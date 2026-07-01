// ===== PIX POR VOZ — NÚCLEO (lógica pura, sem DOM) =====
// Roda no navegador (window.createPixCore) e no Node (module.exports) para testes.
// Todas as dependências externas (biometria, relógio, storage, banco) são injetadas,
// permitindo mockar WebAuthn/timers nos testes e trocar o banco simulado por API real depois.

(function (root, factory) {
  if (typeof module === 'object' && module.exports) module.exports = factory();
  else root.PixCore = factory();
})(typeof self !== 'undefined' ? self : this, function () {
  'use strict';

  const KEY_BIOMETRIC = 'sabolli_pix_biometric';
  const KEY_CONNECTION = 'sabolli_bank_connection';
  const KEY_AUDIT = 'sabolli_pix_audit';
  const DEFAULT_TIMEOUT_MS = 30000;
  const AUDIT_MAX = 200;

  function pixNormalize(s) {
    return (s || '').toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '').trim();
  }

  function pixCapitalize(s) {
    return (s || '').split(' ').filter(Boolean).map(w => w[0].toUpperCase() + w.slice(1)).join(' ');
  }

  function pixParseMoney(text) {
    const t = pixNormalize(text);
    let m = t.match(/(\d+)\s*reais?\s*(?:e\s*)?(\d{1,2})?/);
    if (m) {
      const cents = m[2] ? Number(m[2].padEnd(2, '0').slice(0, 2)) : 0;
      return Number(m[1]) + cents / 100;
    }
    m = t.match(/(\d+[.,]\d{1,2})/);
    if (m) return Number(m[1].replace(',', '.'));
    m = t.match(/(\d+)/);
    if (m) return Number(m[1]);
    return 0;
  }

  // Interpreta comandos como:
  //   "pix de 50 reais para Maria Silva"
  //   "enviar pix de 120 e 50 para o João Santos"
  //   "fazer um pix para Ana Costa de 30 reais"
  function parseVoicePixCommand(rawTranscript, contacts) {
    const t = pixNormalize(rawTranscript);
    if (!/\bpix\b/.test(t)) return { ok: false, reason: 'not-pix' };

    const value = pixParseMoney(t.replace(/\bpix\b/g, ' '));
    if (!value || value <= 0) return { ok: false, reason: 'no-value' };

    const mRecip = t.match(/\bpara\s+(?:o\s+|a\s+)?([a-z\s]+?)(?=\s+(?:de|no valor|valor)\b|\s*\d|$)/);
    if (!mRecip || !mRecip[1].trim()) return { ok: false, reason: 'no-recipient' };
    const spokenName = mRecip[1].trim();

    // Tenta casar com um contato conhecido para obter o nome completo
    let recipientName = pixCapitalize(spokenName);
    let matchedContact = null;
    for (const c of (contacts || [])) {
      const cn = pixNormalize(c.name);
      if (cn === spokenName || cn.includes(spokenName) || spokenName.includes(cn)) {
        matchedContact = c;
        recipientName = c.name;
        break;
      }
    }
    return { ok: true, value, recipientName, matchedContact };
  }

  function createPixCore(deps) {
    if (!deps || !deps.storage || !deps.biometric) {
      throw new Error('createPixCore: deps.storage e deps.biometric são obrigatórios');
    }
    const storage = deps.storage;               // { get(key), set(key, value), remove(key) }
    const biometric = deps.biometric;           // { isSupported(), enroll({label}), verify({credentialId}) } — async
    const bank = deps.bank || {};               // { createSession({bankName}), revokeSession(token), sendPix(request) } — async
    const clock = deps.clock || { now: () => Date.now() };
    const scheduler = deps.scheduler || {
      setInterval: (fn, ms) => setInterval(fn, ms),
      clearInterval: (id) => clearInterval(id)
    };

    // ---- Auditoria local (sem dados sensíveis: nunca valores, nomes ou chaves) ----
    function appendAudit(event, detail) {
      const list = storage.get(KEY_AUDIT) || [];
      list.unshift({ at: clock.now(), event, detail: detail || null });
      storage.set(KEY_AUDIT, list.slice(0, AUDIT_MAX));
    }

    function getAuditLog() { return storage.get(KEY_AUDIT) || []; }

    // ---- Digital cadastrada ----
    function getEnrolledBiometric() { return storage.get(KEY_BIOMETRIC) || null; }
    function hasBiometric() { return !!getEnrolledBiometric(); }

    // ---- Conexão bancária ----
    function getBankConnection() {
      const c = storage.get(KEY_CONNECTION);
      return (c && c.status === 'active') ? c : null;
    }

    async function isBiometricSupported() {
      try { return await biometric.isSupported(); } catch (e) { return false; }
    }

    // Conecta a conta bancária. O cadastro da digital é etapa OBRIGATÓRIA:
    // se falhar, nada é persistido (rollback total).
    async function connectBank({ bankName, accountName }) {
      if (getEnrolledBiometric()) {
        const err = new Error('Já existe uma digital cadastrada. Remova-a antes de conectar outra conta.');
        err.code = 'already-enrolled';
        throw err;
      }
      if (!(await isBiometricSupported())) {
        appendAudit('connect_blocked_unsupported');
        const err = new Error('Este dispositivo não tem biometria disponível. PIX por voz indisponível.');
        err.code = 'unsupported';
        throw err;
      }
      // 1) Sessão bancária (simulada/pendente — só é confirmada após a digital)
      const session = bank.createSession
        ? await bank.createSession({ bankName })
        : { token: 'mock-session-' + clock.now(), bankName };

      // 2) Cadastro da digital — WebAuthn/BiometricPrompt. Guardamos APENAS o ID da
      //    credencial; o dado biométrico bruto nunca sai do keystore do aparelho.
      let credential;
      try {
        credential = await biometric.enroll({ label: 'PIX Sabolli — ' + bankName });
      } catch (e) {
        // Rollback: revoga a sessão pendente e não persiste nada
        if (bank.revokeSession) { try { await bank.revokeSession(session.token); } catch (_) {} }
        appendAudit('enroll_failed', { stage: 'connect' });
        const err = new Error('Cadastro da digital falhou ou foi cancelado. A conta bancária não foi conectada.');
        err.code = 'enroll-failed';
        throw err;
      }

      const connectionId = 'conn-' + clock.now();
      storage.set(KEY_CONNECTION, {
        id: connectionId, bankName, accountName: accountName || '',
        sessionToken: session.token, connectedAt: clock.now(), status: 'active'
      });
      storage.set(KEY_BIOMETRIC, {
        credentialId: credential.credentialId, connectionId, createdAt: clock.now(),
        label: credential.label || bankName
      });
      appendAudit('bank_connected_biometric_enrolled');
      return { connectionId };
    }

    // Remove a digital cadastrada. Exige NOVA validação biométrica; em caso de falha,
    // nada é alterado. Em caso de sucesso, revoga a sessão bancária automaticamente.
    async function removeBiometric() {
      const record = getEnrolledBiometric();
      if (!record) {
        const err = new Error('Nenhuma digital cadastrada.');
        err.code = 'no-biometric';
        throw err;
      }
      let verified = false;
      try {
        verified = await biometric.verify({ credentialId: record.credentialId });
      } catch (e) { verified = false; }

      if (!verified) {
        appendAudit('removal_biometric_failed');
        const err = new Error('Digital não reconhecida. A digital cadastrada NÃO foi removida.');
        err.code = 'verify-failed';
        throw err;
      }

      // Sucesso: remove digital + desconecta banco (revoga token/sessão)
      const conn = storage.get(KEY_CONNECTION);
      storage.remove(KEY_BIOMETRIC);
      if (conn) {
        if (bank.revokeSession) { try { await bank.revokeSession(conn.sessionToken); } catch (_) {} }
        storage.remove(KEY_CONNECTION);
      }
      appendAudit('biometric_removed_session_revoked');
      return { ok: true };
    }

    // ---- Pré-condições do PIX por voz ----
    async function canUsePixByVoice() {
      if (!(await isBiometricSupported())) return { ok: false, reason: 'unsupported' };
      if (!hasBiometric() || !getBankConnection()) return { ok: false, reason: 'no-enrollment' };
      return { ok: true };
    }

    // ---- Máquina de estados da confirmação (timeout de 30s) ----
    let activeSession = null;

    function startPixConfirmation(request, opts) {
      opts = opts || {};
      const timeoutMs = opts.timeoutMs || DEFAULT_TIMEOUT_MS;

      // Cada nova tentativa cancela a anterior e começa um timer NOVO do zero
      if (activeSession && activeSession.status === 'awaiting') activeSession.cancel('superseded');

      const session = {
        request,                       // { value, recipientName, sourceAccountId, sourceAccountLabel }
        status: 'awaiting',            // awaiting | sending | sent | expired | cancelled
        startedAt: clock.now(),
        expiresAt: clock.now() + timeoutMs,
        _timerId: null,

        getRemainingMs() {
          return Math.max(0, this.expiresAt - clock.now());
        },

        _finish(status) {
          this.status = status;
          if (this._timerId !== null) { scheduler.clearInterval(this._timerId); this._timerId = null; }
          if (activeSession === this) activeSession = null;
        },

        cancel(reason) {
          if (this.status !== 'awaiting') return;
          this._finish('cancelled');
          if (opts.onCancel) opts.onCancel(reason || 'user');
        },

        _expire() {
          if (this.status !== 'awaiting') return;
          this._finish('expired');
          appendAudit('pix_confirmation_expired');
          if (opts.onTimeout) opts.onTimeout();
        },

        // Confirmação: exige biometria válida E dentro da janela de 30s.
        // Falha biométrica NÃO reseta o timer e mantém a sessão ativa.
        async confirm() {
          if (this.status !== 'awaiting') return { ok: false, reason: 'not-awaiting', status: this.status };
          if (this.getRemainingMs() <= 0) { this._expire(); return { ok: false, reason: 'expired' }; }

          const record = getEnrolledBiometric();
          if (!record) {
            this._finish('cancelled');
            appendAudit('send_blocked_no_biometric');
            return { ok: false, reason: 'no-biometric' };
          }

          let verified = false;
          try {
            verified = await biometric.verify({ credentialId: record.credentialId });
          } catch (e) { verified = false; }

          if (!verified) {
            appendAudit('send_biometric_failed');
            // Sessão continua ativa com o tempo restante (sem reset), a menos que já tenha expirado
            if (this.getRemainingMs() <= 0) { this._expire(); return { ok: false, reason: 'expired' }; }
            return { ok: false, reason: 'biometric-failed', remainingMs: this.getRemainingMs() };
          }

          // Biometria OK — revalida a janela dos 30s antes de enviar
          if (this.getRemainingMs() <= 0 || this.status !== 'awaiting') {
            this._expire();
            return { ok: false, reason: 'expired' };
          }

          this.status = 'sending';
          try {
            const receipt = bank.sendPix ? await bank.sendPix(this.request) : { id: 'mock-pix-' + clock.now() };
            this._finish('sent');
            appendAudit('pix_sent_ok');
            return { ok: true, receipt };
          } catch (e) {
            this._finish('cancelled');
            appendAudit('pix_send_error');
            return { ok: false, reason: 'send-error' };
          }
        }
      };

      session._timerId = scheduler.setInterval(() => {
        if (session.status !== 'awaiting') return;
        const remaining = session.getRemainingMs();
        if (opts.onTick) opts.onTick(remaining);
        if (remaining <= 0) session._expire();
      }, opts.tickMs || 250);

      activeSession = session;
      return session;
    }

    function getActiveSession() { return activeSession; }

    return {
      isBiometricSupported, getEnrolledBiometric, hasBiometric,
      getBankConnection, connectBank, removeBiometric,
      canUsePixByVoice, startPixConfirmation, getActiveSession,
      appendAudit, getAuditLog,
      _keys: { KEY_BIOMETRIC, KEY_CONNECTION, KEY_AUDIT }
    };
  }

  return { createPixCore, parseVoicePixCommand, pixParseMoney, pixNormalize, DEFAULT_TIMEOUT_MS };
});
