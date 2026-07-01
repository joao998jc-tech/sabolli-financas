// Testes do núcleo do PIX por voz — roda com: node --test tests/
// Biometria, relógio e banco são mockados (ambiente de dev sem hardware biométrico).
const { test } = require('node:test');
const assert = require('node:assert/strict');
const PixCore = require('../pix-core.js');

// ---- Mocks ----
function makeStorage() {
  const store = new Map();
  return {
    get: (k) => store.has(k) ? JSON.parse(JSON.stringify(store.get(k))) : null,
    set: (k, v) => store.set(k, JSON.parse(JSON.stringify(v))),
    remove: (k) => store.delete(k),
    _raw: store
  };
}

function makeClock() {
  let now = 1000000;
  const timers = new Map();
  let nextTimerId = 1;
  return {
    clock: { now: () => now },
    scheduler: {
      setInterval(fn, ms) { const id = nextTimerId++; timers.set(id, { fn, ms, next: now + ms }); return id; },
      clearInterval(id) { timers.delete(id); }
    },
    advance(ms) {
      const target = now + ms;
      for (;;) {
        let earliest = null, eid = null;
        for (const [id, t] of timers) {
          if (t.next <= target && (earliest === null || t.next < earliest)) { earliest = t.next; eid = id; }
        }
        if (eid === null) break;
        now = earliest;
        const t = timers.get(eid);
        if (t) { t.next += t.ms; t.fn(); }
      }
      now = target;
    },
    jump(ms) { now += ms; } // avança o relógio SEM disparar timers (ex: biometria demorada)
  };
}

function makeBiometric({ supported = true } = {}) {
  const b = {
    supported,
    enrollShouldFail: false,
    verifyQueue: [],       // resultados enfileirados para verify()
    verifyDefault: true,
    onVerify: null,        // hook para simular demora
    enrollCount: 0,
    verifyCount: 0,
    async isSupported() { return b.supported; },
    async enroll({ label }) {
      b.enrollCount++;
      if (b.enrollShouldFail) throw new Error('cancelado pelo usuário');
      return { credentialId: 'cred-' + b.enrollCount, label };
    },
    async verify() {
      b.verifyCount++;
      if (b.onVerify) b.onVerify();
      return b.verifyQueue.length ? b.verifyQueue.shift() : b.verifyDefault;
    }
  };
  return b;
}

function makeBank() {
  const bank = {
    sessions: [], revoked: [], sent: [], sendShouldFail: false,
    async createSession({ bankName }) {
      const s = { token: 'tok-' + (bank.sessions.length + 1), bankName };
      bank.sessions.push(s);
      return s;
    },
    async revokeSession(token) { bank.revoked.push(token); return { revoked: true }; },
    async sendPix(request) {
      if (bank.sendShouldFail) throw new Error('falha no envio');
      bank.sent.push(request);
      return { id: 'pix-' + bank.sent.length };
    }
  };
  return bank;
}

function makeEnv(opts = {}) {
  const storage = makeStorage();
  const time = makeClock();
  const biometric = makeBiometric(opts);
  const bank = makeBank();
  const core = PixCore.createPixCore({ storage, biometric, bank, clock: time.clock, scheduler: time.scheduler });
  return { storage, time, biometric, bank, core };
}

async function connectDefault(env) {
  return env.core.connectBank({ bankName: 'Banco Demo', accountName: 'Conta Corrente' });
}

const PIX_REQ = { value: 150.5, recipientName: 'Maria Silva', sourceAccountId: 1, sourceAccountLabel: 'Conta Corrente — Banco Demo' };

// ============ 1. CADASTRO DE DIGITAL NA CONEXÃO BANCÁRIA ============
test('conectar banco exige e cadastra a digital, vinculada à conexão', async () => {
  const env = makeEnv();
  const res = await connectDefault(env);
  assert.ok(res.connectionId);
  const bio = env.core.getEnrolledBiometric();
  const conn = env.core.getBankConnection();
  assert.ok(bio, 'digital deve estar cadastrada');
  assert.ok(conn, 'conexão deve estar ativa');
  assert.equal(bio.connectionId, conn.id, 'digital vinculada à conexão');
  assert.equal(env.biometric.enrollCount, 1);
});

test('nunca armazena dado biométrico bruto — apenas referência (ID da credencial)', async () => {
  const env = makeEnv();
  await connectDefault(env);
  const bio = env.core.getEnrolledBiometric();
  assert.deepEqual(Object.keys(bio).sort(), ['connectionId', 'createdAt', 'credentialId', 'label'].sort());
  assert.equal(typeof bio.credentialId, 'string');
});

test('falha no cadastro da digital faz rollback total: nada persistido e sessão revogada', async () => {
  const env = makeEnv();
  env.biometric.enrollShouldFail = true;
  await assert.rejects(() => connectDefault(env), (e) => e.code === 'enroll-failed');
  assert.equal(env.core.hasBiometric(), false);
  assert.equal(env.core.getBankConnection(), null);
  assert.deepEqual(env.bank.revoked, ['tok-1'], 'sessão pendente deve ser revogada');
  assert.ok(env.core.getAuditLog().some(a => a.event === 'enroll_failed'), 'falha deve ser auditada');
});

// ============ 2. BLOQUEIO DE SEGUNDA DIGITAL ============
test('não permite cadastrar segunda digital enquanto a primeira existir', async () => {
  const env = makeEnv();
  await connectDefault(env);
  await assert.rejects(
    () => env.core.connectBank({ bankName: 'Outro Banco', accountName: 'Outra Conta' }),
    (e) => e.code === 'already-enrolled'
  );
  assert.equal(env.biometric.enrollCount, 1, 'enroll não deve nem ser tentado de novo');
  assert.equal(env.core.getBankConnection().bankName, 'Banco Demo', 'conexão original intacta');
});

// ============ 3. REMOÇÃO EXIGE BIOMETRIA + REVOGA SESSÃO ============
test('remoção com biometria válida remove a digital e revoga a sessão bancária', async () => {
  const env = makeEnv();
  await connectDefault(env);
  const token = env.storage.get('sabolli_bank_connection').sessionToken;
  env.biometric.verifyQueue = [true];
  await env.core.removeBiometric();
  assert.equal(env.core.hasBiometric(), false, 'digital removida');
  assert.equal(env.core.getBankConnection(), null, 'conexão desconectada');
  assert.ok(env.bank.revoked.includes(token), 'token da sessão revogado');
  assert.ok(env.core.getAuditLog().some(a => a.event === 'biometric_removed_session_revoked'));
  // Precisa refazer tudo do zero — e aí pode cadastrar nova digital
  await connectDefault(env);
  assert.ok(env.core.hasBiometric(), 'após remover, nova conexão + digital é possível');
});

// ============ 4. FALHA NA BIOMETRIA DE REMOÇÃO NÃO REMOVE NADA ============
test('falha biométrica na remoção mantém digital e conexão intactas', async () => {
  const env = makeEnv();
  await connectDefault(env);
  env.biometric.verifyQueue = [false];
  await assert.rejects(() => env.core.removeBiometric(), (e) => e.code === 'verify-failed');
  assert.ok(env.core.hasBiometric(), 'digital NÃO removida');
  assert.ok(env.core.getBankConnection(), 'conexão continua ativa');
  assert.equal(env.bank.revoked.length, 0, 'nenhuma sessão revogada');
  assert.ok(env.core.getAuditLog().some(a => a.event === 'removal_biometric_failed'), 'falha auditada');
});

// ============ 5. TIMEOUT DE 30s CANCELA A CONFIRMAÇÃO ============
test('confirmação expira automaticamente após 30s sem confirmação', async () => {
  const env = makeEnv();
  await connectDefault(env);
  let timedOut = false;
  const session = env.core.startPixConfirmation(PIX_REQ, { onTimeout: () => { timedOut = true; } });
  env.time.advance(29999);
  assert.equal(session.status, 'awaiting', 'ainda ativa a 29,999s');
  env.time.advance(2);
  assert.equal(session.status, 'expired');
  assert.equal(timedOut, true, 'callback de timeout disparado');
  assert.equal(env.bank.sent.length, 0, 'nada enviado');
  const r = await session.confirm();
  assert.equal(r.ok, false, 'confirmar depois de expirado não envia');
  assert.ok(env.core.getAuditLog().some(a => a.event === 'pix_confirmation_expired'));
});

test('contador regressivo é reportado via onTick', async () => {
  const env = makeEnv();
  await connectDefault(env);
  const ticks = [];
  env.core.startPixConfirmation(PIX_REQ, { onTick: (ms) => ticks.push(ms) });
  env.time.advance(1000);
  assert.ok(ticks.length >= 3, 'ticks periódicos emitidos');
  assert.ok(ticks[ticks.length - 1] < ticks[0], 'tempo restante decresce');
});

// ============ 6. TIMER REINICIA DO ZERO A CADA NOVA TENTATIVA ============
test('nova tentativa cancela a anterior e começa timer novo de 30s', async () => {
  const env = makeEnv();
  await connectDefault(env);
  const s1 = env.core.startPixConfirmation(PIX_REQ, {});
  env.time.advance(20000);
  assert.equal(s1.getRemainingMs(), 10000);
  const s2 = env.core.startPixConfirmation(PIX_REQ, {});
  assert.equal(s1.status, 'cancelled', 'sessão anterior cancelada');
  assert.equal(s2.getRemainingMs(), 30000, 'timer novo começa do zero (30s cheios)');
  env.time.advance(25000);
  assert.equal(s2.status, 'awaiting', 'nova sessão não herda tempo da anterior');
  env.time.advance(5001);
  assert.equal(s2.status, 'expired');
});

test('falha biométrica na confirmação NÃO reseta o timer', async () => {
  const env = makeEnv();
  await connectDefault(env);
  const session = env.core.startPixConfirmation(PIX_REQ, {});
  env.time.advance(12000);
  env.biometric.verifyQueue = [false];
  const r = await session.confirm();
  assert.equal(r.ok, false);
  assert.equal(r.reason, 'biometric-failed');
  assert.equal(session.status, 'awaiting', 'sessão continua ativa');
  assert.equal(r.remainingMs, 18000, 'tempo restante preservado (sem reset)');
  // e ainda pode confirmar com sucesso dentro da janela
  env.biometric.verifyQueue = [true];
  const r2 = await session.confirm();
  assert.equal(r2.ok, true);
});

// ============ 7. BLOQUEIO DE ENVIO SEM BIOMETRIA VÁLIDA ============
test('PIX só é enviado com biometria válida; falha não envia nada', async () => {
  const env = makeEnv();
  await connectDefault(env);
  const session = env.core.startPixConfirmation(PIX_REQ, {});
  env.biometric.verifyQueue = [false, false];
  await session.confirm();
  await session.confirm();
  assert.equal(env.bank.sent.length, 0, 'nenhum PIX enviado com biometria inválida');
  const failures = env.core.getAuditLog().filter(a => a.event === 'send_biometric_failed');
  assert.equal(failures.length, 2, 'cada falha biométrica é auditada');
  env.biometric.verifyQueue = [true];
  const ok = await session.confirm();
  assert.equal(ok.ok, true);
  assert.equal(env.bank.sent.length, 1);
  assert.deepEqual(env.bank.sent[0], PIX_REQ);
});

test('biometria válida porém FORA da janela de 30s não envia', async () => {
  const env = makeEnv();
  await connectDefault(env);
  const session = env.core.startPixConfirmation(PIX_REQ, {});
  // Simula prompt biométrico demorado: usuário só valida depois que a janela fechou
  env.biometric.onVerify = () => env.time.jump(31000);
  env.biometric.verifyQueue = [true];
  const r = await session.confirm();
  assert.equal(r.ok, false);
  assert.equal(r.reason, 'expired');
  assert.equal(env.bank.sent.length, 0, 'não envia mesmo com biometria OK, pois expirou');
});

test('sem digital cadastrada o envio é bloqueado', async () => {
  const env = makeEnv();
  await connectDefault(env);
  const session = env.core.startPixConfirmation(PIX_REQ, {});
  env.storage.remove('sabolli_pix_biometric'); // digital sumiu no meio do fluxo
  const r = await session.confirm();
  assert.equal(r.ok, false);
  assert.equal(r.reason, 'no-biometric');
  assert.equal(env.bank.sent.length, 0);
  const gate = await env.core.canUsePixByVoice();
  assert.deepEqual(gate, { ok: false, reason: 'no-enrollment' }, 'fluxo de voz bloqueado sem digital');
});

// ============ 8. DISPOSITIVO SEM SUPORTE BIOMÉTRICO ============
test('dispositivo sem biometria: PIX por voz bloqueado e conexão bancária impedida', async () => {
  const env = makeEnv({ supported: false });
  const gate = await env.core.canUsePixByVoice();
  assert.deepEqual(gate, { ok: false, reason: 'unsupported' });
  await assert.rejects(() => connectDefault(env), (e) => e.code === 'unsupported');
  assert.equal(env.core.hasBiometric(), false);
  assert.ok(env.core.getAuditLog().some(a => a.event === 'connect_blocked_unsupported'));
});

// ============ NÃO FUNCIONAIS ============
test('auditoria local não contém dados sensíveis (valores, nomes, chaves)', async () => {
  const env = makeEnv();
  await connectDefault(env);
  const session = env.core.startPixConfirmation(PIX_REQ, {});
  env.biometric.verifyQueue = [false, true];
  await session.confirm();
  await session.confirm();
  const dump = JSON.stringify(env.core.getAuditLog());
  assert.ok(!dump.includes('150.5'), 'sem valor do PIX');
  assert.ok(!dump.includes('Maria'), 'sem nome do destinatário');
  assert.ok(!dump.includes('cred-'), 'sem ID de credencial');
  assert.ok(!dump.includes('tok-'), 'sem token de sessão');
});

// ============ PARSER DO COMANDO DE VOZ ============
test('parser entende "pix de X reais para NOME" e resolve nome completo via contatos', () => {
  const contacts = [{ id: 1, name: 'Maria Silva' }, { id: 2, name: 'João Santos' }];
  let p = PixCore.parseVoicePixCommand('pix de 50 reais para Maria Silva', contacts);
  assert.deepEqual({ ok: p.ok, value: p.value, name: p.recipientName }, { ok: true, value: 50, name: 'Maria Silva' });

  p = PixCore.parseVoicePixCommand('enviar um pix de 120 reais e 50 para a maria', contacts);
  assert.equal(p.ok, true);
  assert.equal(p.value, 120.5);
  assert.equal(p.recipientName, 'Maria Silva', 'nome parcial resolve para o nome completo do contato');

  p = PixCore.parseVoicePixCommand('pix de 30 reais para Carlos Pereira', contacts);
  assert.equal(p.ok, true);
  assert.equal(p.recipientName, 'Carlos Pereira', 'nome fora dos contatos é usado como falado');

  p = PixCore.parseVoicePixCommand('pix para Maria Silva', contacts);
  assert.deepEqual({ ok: p.ok, reason: p.reason }, { ok: false, reason: 'no-value' });

  p = PixCore.parseVoicePixCommand('pix de 50 reais', contacts);
  assert.deepEqual({ ok: p.ok, reason: p.reason }, { ok: false, reason: 'no-recipient' });

  p = PixCore.parseVoicePixCommand('paguei 50 reais de mercado', contacts);
  assert.deepEqual({ ok: p.ok, reason: p.reason }, { ok: false, reason: 'not-pix' },
    'comando de lançamento comum não é confundido com PIX');
});
