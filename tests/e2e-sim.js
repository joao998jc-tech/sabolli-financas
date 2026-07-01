// Simulação ponta a ponta do fluxo de PIX por voz (biometria mockada — dev sem hardware).
// Percorre: comando de voz → tela de confirmação → timer 30s → biometria → envio,
// exercitando o cancelamento em CADA ponto de falha. Rode com: node tests/e2e-sim.js
const assert = require('node:assert/strict');
const PixCore = require('../pix-core.js');

let step = 0;
function ok(desc) { step++; console.log(`  ✔ [${step}] ${desc}`); }

function makeWorld({ supported = true } = {}) {
  const store = new Map();
  const storage = {
    get: (k) => store.has(k) ? JSON.parse(JSON.stringify(store.get(k))) : null,
    set: (k, v) => store.set(k, JSON.parse(JSON.stringify(v))),
    remove: (k) => store.delete(k)
  };
  let now = 0;
  const timers = new Map(); let tid = 1;
  const scheduler = {
    setInterval(fn, ms) { const id = tid++; timers.set(id, { fn, ms, next: now + ms }); return id; },
    clearInterval(id) { timers.delete(id); }
  };
  function advance(ms) {
    const target = now + ms;
    for (;;) {
      let e = null, eid = null;
      for (const [id, t] of timers) if (t.next <= target && (e === null || t.next < e)) { e = t.next; eid = id; }
      if (eid === null) break;
      now = e; const t = timers.get(eid); if (t) { t.next += t.ms; t.fn(); }
    }
    now = target;
  }
  const biometric = {
    supported, enrollFail: false, verifyQueue: [],
    async isSupported() { return this.supported; },
    async enroll({ label }) { if (this.enrollFail) throw new Error('cancelado'); return { credentialId: 'cred-e2e', label }; },
    async verify() { return this.verifyQueue.length ? this.verifyQueue.shift() : true; }
  };
  // "Conta do app" que o PIX debita — como faz o mock de banco do pix.js
  const account = { id: 1, name: 'Conta Corrente', balance: 1000 };
  const bank = {
    revoked: [], sent: [],
    async createSession({ bankName }) { return { token: 'tok-e2e', bankName }; },
    async revokeSession(t) { this.revoked.push(t); },
    async sendPix(req) { account.balance -= req.value; this.sent.push(req); return { id: 'pix-e2e-1' }; }
  };
  const core = PixCore.createPixCore({ storage, biometric, bank, clock: { now: () => now }, scheduler });
  return { core, biometric, bank, storage, account, advance };
}

(async function main() {
  console.log('— E2E SIMULADO: PIX por comando de voz —\n');

  // ETAPA 0 — dispositivo sem biometria: recurso bloqueado
  {
    const w = makeWorld({ supported: false });
    assert.deepEqual(await w.core.canUsePixByVoice(), { ok: false, reason: 'unsupported' });
    await assert.rejects(() => w.core.connectBank({ bankName: 'Banco Demo' }), (e) => e.code === 'unsupported');
    ok('Dispositivo sem hardware biométrico: PIX por voz bloqueado e usuário avisado');
  }

  const w = makeWorld();

  // ETAPA 1 — usuário tenta PIX por voz sem ter conectado banco: bloqueado e direcionado
  assert.deepEqual(await w.core.canUsePixByVoice(), { ok: false, reason: 'no-enrollment' });
  ok('Sem digital cadastrada: fluxo de voz bloqueado, direcionar para conexão bancária');

  // ETAPA 2 — conexão bancária com falha no cadastro da digital: rollback total
  w.biometric.enrollFail = true;
  await assert.rejects(() => w.core.connectBank({ bankName: 'Banco Demo', accountName: 'Conta Corrente' }));
  assert.equal(w.core.hasBiometric(), false);
  assert.equal(w.core.getBankConnection(), null);
  assert.deepEqual(w.bank.revoked, ['tok-e2e']);
  ok('Cadastro da digital cancelado durante a conexão: nada persistido, sessão revogada');

  // ETAPA 3 — conexão bancária + cadastro da digital com sucesso
  w.biometric.enrollFail = false;
  await w.core.connectBank({ bankName: 'Banco Demo', accountName: 'Conta Corrente' });
  assert.ok(w.core.hasBiometric() && w.core.getBankConnection());
  ok('Conta bancária conectada com cadastro obrigatório da digital (1 de 1)');

  // ETAPA 4 — segunda digital: proibida
  await assert.rejects(() => w.core.connectBank({ bankName: 'Outro Banco' }), (e) => e.code === 'already-enrolled');
  ok('Tentativa de segunda digital: bloqueada');

  // ETAPA 5 — comando de voz interpretado
  const contacts = [{ id: 1, name: 'Maria Silva' }];
  const parsed = PixCore.parseVoicePixCommand('enviar pix de 150 reais e 50 para a maria', contacts);
  assert.deepEqual({ ok: parsed.ok, value: parsed.value, name: parsed.recipientName },
    { ok: true, value: 150.5, name: 'Maria Silva' });
  ok('Voz: "enviar pix de 150 reais e 50 para a maria" → R$ 150,50 para "Maria Silva" (nome completo)');

  const req = { value: parsed.value, recipientName: parsed.recipientName, sourceAccountId: w.account.id, sourceAccountLabel: 'Conta Corrente — Banco Demo' };

  // ETAPA 6 — tela de confirmação aberta e 30s expiram sem confirmação
  let timeoutMsg = null;
  let s = w.core.startPixConfirmation(req, { onTimeout: () => { timeoutMsg = 'Tempo esgotado. Repita o comando para tentar novamente.'; } });
  w.advance(30001);
  assert.equal(s.status, 'expired');
  assert.equal(timeoutMsg, 'Tempo esgotado. Repita o comando para tentar novamente.');
  assert.equal(w.bank.sent.length, 0);
  ok('Timer de 30s expirou: operação cancelada automaticamente com mensagem de timeout');

  // ETAPA 7 — nova tentativa: timer zerado; falha biométrica NÃO reseta o tempo restante
  s = w.core.startPixConfirmation(req, {});
  assert.equal(s.getRemainingMs(), 30000);
  ok('Nova tentativa: contador reiniciado do zero (30s cheios)');

  w.advance(12000);
  w.biometric.verifyQueue = [false];
  let r = await s.confirm();
  assert.deepEqual({ ok: r.ok, reason: r.reason, remaining: r.remainingMs }, { ok: false, reason: 'biometric-failed', remaining: 18000 });
  assert.equal(s.status, 'awaiting');
  assert.equal(w.bank.sent.length, 0);
  ok('Digital não reconhecida: PIX NÃO enviado, tela mantida com 18s restantes (sem reset)');

  // ETAPA 8 — usuário cancela manualmente
  s.cancel('user');
  assert.equal(s.status, 'cancelled');
  ok('Cancelamento manual pelo botão "Cancelar" funciona');

  // ETAPA 9 — fluxo feliz: voz → confirmação → biometria válida dentro dos 30s → envio
  s = w.core.startPixConfirmation(req, {});
  w.advance(8000);
  w.biometric.verifyQueue = [true];
  r = await s.confirm();
  assert.equal(r.ok, true);
  assert.equal(w.bank.sent.length, 1);
  assert.equal(w.account.balance, 1000 - 150.5);
  ok('Biometria válida aos 8s: PIX de R$ 150,50 enviado e conta debitada (saldo R$ ' + w.account.balance.toFixed(2) + ')');

  // ETAPA 10 — remoção da digital: falha biométrica mantém tudo
  w.biometric.verifyQueue = [false];
  await assert.rejects(() => w.core.removeBiometric(), (e) => e.code === 'verify-failed');
  assert.ok(w.core.hasBiometric() && w.core.getBankConnection());
  ok('Remoção com digital não reconhecida: NADA removido, conexão intacta, erro claro');

  // ETAPA 11 — remoção com biometria válida: digital removida + logout do banco
  w.biometric.verifyQueue = [true];
  await w.core.removeBiometric();
  assert.equal(w.core.hasBiometric(), false);
  assert.equal(w.core.getBankConnection(), null);
  assert.equal(w.bank.revoked.length, 2, 'sessão ativa revogada no logout');
  assert.deepEqual(await w.core.canUsePixByVoice(), { ok: false, reason: 'no-enrollment' });
  ok('Remoção validada por biometria: digital removida, sessão bancária revogada, PIX por voz volta a exigir reconexão do zero');

  // ETAPA 12 — auditoria registrou as falhas, sem dados sensíveis
  const audit = w.core.getAuditLog();
  assert.ok(audit.some(a => a.event === 'send_biometric_failed'));
  assert.ok(audit.some(a => a.event === 'removal_biometric_failed'));
  assert.ok(audit.some(a => a.event === 'pix_confirmation_expired'));
  const dump = JSON.stringify(audit);
  assert.ok(!dump.includes('150.5') && !dump.includes('Maria') && !dump.includes('cred-') && !dump.includes('tok-'));
  ok('Auditoria local registrou todas as falhas biométricas e o timeout, sem dados sensíveis');

  console.log('\n✅ E2E SIMULADO COMPLETO: ' + step + ' etapas verificadas com sucesso.');
})().catch(e => { console.error('\n❌ FALHA NO E2E:', e); process.exit(1); });
