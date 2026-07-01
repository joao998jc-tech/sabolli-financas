// ===== PIX POR VOZ — ADAPTERS DO NAVEGADOR + UI =====
// Usa o núcleo puro (pix-core.js) com adapters reais:
//  - Biometria: WebAuthn com autenticador de plataforma (no Android/Chrome dispara o
//    BiometricPrompt do sistema; o dado biométrico bruto NUNCA sai do keystore do aparelho —
//    o app guarda apenas o ID da credencial).
//  - Banco: SIMULADO (não há backend/Open Finance real). Mantém os contratos de uma
//    integração real: token de sessão revogável e envio que debita a conta do app.

(function () {
  'use strict';

  // ---- Helpers base64 <-> ArrayBuffer para IDs de credencial WebAuthn ----
  function bufToB64(buf) {
    return btoa(String.fromCharCode(...new Uint8Array(buf)));
  }
  function b64ToBuf(b64) {
    const bin = atob(b64);
    const arr = new Uint8Array(bin.length);
    for (let i = 0; i < bin.length; i++) arr[i] = bin.charCodeAt(i);
    return arr.buffer;
  }

  // ---- Adapter de biometria: WebAuthn (plataforma, verificação de usuário obrigatória) ----
  const webAuthnBiometric = {
    async isSupported() {
      if (!window.PublicKeyCredential || !navigator.credentials) return false;
      try { return await PublicKeyCredential.isUserVerifyingPlatformAuthenticatorAvailable(); }
      catch (e) { return false; }
    },
    async enroll({ label }) {
      const challenge = crypto.getRandomValues(new Uint8Array(32));
      const userId = crypto.getRandomValues(new Uint8Array(16));
      const cred = await navigator.credentials.create({
        publicKey: {
          challenge,
          rp: { name: 'Sabolli Finanças' },
          user: { id: userId, name: 'pix@sabolli', displayName: label || 'PIX Sabolli' },
          pubKeyCredParams: [{ type: 'public-key', alg: -7 }, { type: 'public-key', alg: -257 }],
          authenticatorSelection: { authenticatorAttachment: 'platform', userVerification: 'required', residentKey: 'preferred' },
          timeout: 60000,
          attestation: 'none'
        }
      });
      if (!cred) throw new Error('enroll-cancelled');
      return { credentialId: bufToB64(cred.rawId), label };
    },
    async verify({ credentialId }) {
      const challenge = crypto.getRandomValues(new Uint8Array(32));
      try {
        const assertion = await navigator.credentials.get({
          publicKey: {
            challenge,
            allowCredentials: [{ type: 'public-key', id: b64ToBuf(credentialId), transports: ['internal'] }],
            userVerification: 'required',
            timeout: 60000
          }
        });
        return !!assertion;
      } catch (e) { return false; }
    }
  };

  // ---- Adapter de storage: reaproveita saveData/loadData (localStorage + sync Firestore) ----
  const pixStorage = {
    get(key) { return loadData(key); },
    set(key, value) { saveData(key, value); },
    remove(key) {
      localStorage.removeItem(key);
      if (window.syncSaveData) window.syncSaveData(key, null);
    }
  };

  // ---- Banco simulado (mock Open Finance) ----
  const mockBank = {
    async createSession({ bankName }) {
      const token = 'sess-' + Date.now() + '-' + Math.random().toString(36).slice(2, 10);
      return { token, bankName };
    },
    async revokeSession(token) {
      // Numa integração real: POST /revoke no provedor Open Finance
      return { revoked: true };
    },
    async sendPix(request) {
      // Simula o envio: debita a conta de origem e registra a transação no app
      const accs = loadData('sabolli_accounts') || [];
      const acc = accs.find(a => a.id === request.sourceAccountId);
      if (acc) { acc.balance = (acc.balance || 0) - request.value; saveData('sabolli_accounts', accs); }
      const txs = loadData('sabolli_financial_transactions') || [];
      txs.unshift({
        id: nextId(txs), date: todayStr(), desc: 'PIX enviado para ' + request.recipientName,
        type: 'saída', value: request.value, category: 'PIX',
        accountId: request.sourceAccountId || null, extractType: 'pessoal', status: 'realizado', viaVoicePix: true
      });
      saveData('sabolli_financial_transactions', txs);
      return { id: 'pix-' + Date.now(), sentAt: Date.now() };
    }
  };

  const core = PixCore.createPixCore({ storage: pixStorage, biometric: webAuthnBiometric, bank: mockBank });
  window.pixCore = core;

  // ============ FLUXO DE VOZ ============
  window.voicePix = async function () {
    const gate = await core.canUsePixByVoice();
    if (!gate.ok) {
      if (gate.reason === 'unsupported') {
        toast('Este dispositivo não tem biometria (digital) disponível. O PIX por voz está bloqueado por segurança.', 'error');
      } else {
        toast('Você precisa conectar uma conta bancária e cadastrar sua digital antes de usar o PIX por voz.', 'warning');
        navigateTo('pix-voice');
      }
      return;
    }
    startVoiceCapture(processVoicePix);
  };

  function processVoicePix(rawTranscript) {
    const contacts = loadData('sabolli_customers') || [];
    const parsed = PixCore.parseVoicePixCommand(rawTranscript, contacts);
    if (!parsed.ok) {
      if (parsed.reason === 'no-value') toast('Não identifiquei o valor. Ex: "PIX de 50 reais para Maria Silva".', 'error');
      else if (parsed.reason === 'no-recipient') toast('Não identifiquei o destinatário. Diga "para" seguido do nome. Ex: "PIX de 50 reais para Maria Silva".', 'error');
      else toast('Comando não reconhecido. Diga, por exemplo: "PIX de 50 reais para Maria Silva".', 'error');
      return;
    }
    const conn = core.getBankConnection();
    const accounts = (loadData('sabolli_accounts') || []).filter(a => a.type !== 'cartão');
    const srcAcc = accounts.find(a => a.id === conn.linkedAccountId) || accounts[0];
    if (!srcAcc) { toast('Nenhuma conta de origem disponível. Cadastre uma conta em Contas e Cartões.', 'error'); return; }

    openPixConfirmation({
      value: parsed.value,
      recipientName: parsed.recipientName,
      sourceAccountId: srcAcc.id,
      sourceAccountLabel: srcAcc.name + (srcAcc.bank ? ' — ' + srcAcc.bank : '')
    });
  }
  window.processVoicePix = processVoicePix;

  // ============ TELA DE CONFIRMAÇÃO COM CONTADOR DE 30s ============
  function openPixConfirmation(request) {
    // Remove modal anterior, se houver (nova tentativa = timer novo, do zero)
    const old = document.getElementById('pix-confirm-overlay');
    if (old) old.remove();

    const overlay = document.createElement('div');
    overlay.id = 'pix-confirm-overlay';
    overlay.style.cssText = 'position:fixed;inset:0;background:rgba(0,0,0,0.6);z-index:99999;display:flex;align-items:center;justify-content:center;padding:20px';
    overlay.innerHTML = `<div style="background:#fff;border-radius:20px;padding:26px 22px;max-width:360px;width:100%;box-shadow:0 20px 60px rgba(0,0,0,0.35)">
      <div style="text-align:center;font-size:34px;margin-bottom:8px">⚡</div>
      <div style="font-size:16px;font-weight:900;color:#1E293B;text-align:center;margin-bottom:14px">Novo PIX será enviado</div>
      <div style="background:#F8FAFC;border-radius:14px;padding:14px;margin-bottom:14px">
        <div style="font-size:12px;color:#64748B;margin-bottom:2px">Valor</div>
        <div style="font-size:24px;font-weight:900;color:#1E3A8A;margin-bottom:10px">${fmt(request.value)}</div>
        <div style="font-size:12px;color:#64748B;margin-bottom:2px">De (conta de origem)</div>
        <div style="font-size:14px;font-weight:700;color:#1E293B;margin-bottom:10px">${request.sourceAccountLabel}</div>
        <div style="font-size:12px;color:#64748B;margin-bottom:2px">Para (destinatário)</div>
        <div style="font-size:14px;font-weight:700;color:#1E293B">${request.recipientName}</div>
      </div>
      <div style="text-align:center;margin-bottom:14px">
        <span style="font-size:12px;color:#64748B">Expira em </span>
        <span id="pix-countdown" style="font-size:22px;font-weight:900;color:#059669">30</span>
        <span style="font-size:12px;color:#64748B"> s</span>
      </div>
      <div id="pix-confirm-msg" style="display:none;font-size:12px;color:#DC2626;background:#FEF2F2;border-radius:10px;padding:8px 12px;text-align:center;margin-bottom:12px"></div>
      <div style="display:flex;gap:10px">
        <button id="pix-cancel" style="flex:1;padding:13px;border-radius:12px;border:1.5px solid #E2E8F0;background:#fff;font-size:14px;font-weight:600;cursor:pointer;color:#64748B">Cancelar</button>
        <button id="pix-confirm" style="flex:1.4;padding:13px;border-radius:12px;border:none;background:linear-gradient(135deg,#059669,#047857);color:#fff;font-size:14px;font-weight:800;cursor:pointer">☝️ Confirmar com digital</button>
      </div>
    </div>`;
    document.body.appendChild(overlay);

    const countdownEl = overlay.querySelector('#pix-countdown');
    const msgEl = overlay.querySelector('#pix-confirm-msg');
    const btnConfirm = overlay.querySelector('#pix-confirm');
    const btnCancel = overlay.querySelector('#pix-cancel');

    const session = core.startPixConfirmation(request, {
      onTick(remainingMs) {
        const s = Math.ceil(remainingMs / 1000);
        countdownEl.textContent = String(s);
        countdownEl.style.color = s <= 10 ? '#DC2626' : '#059669';
      },
      onTimeout() {
        overlay.remove();
        toast('Tempo esgotado. Repita o comando para tentar novamente.', 'error');
      },
      onCancel() { overlay.remove(); }
    });

    btnCancel.onclick = () => session.cancel('user');

    btnConfirm.onclick = async () => {
      btnConfirm.disabled = true;
      btnConfirm.textContent = 'Validando digital...';
      const result = await session.confirm();
      if (result.ok) {
        overlay.remove();
        toast('✅ PIX de ' + fmt(request.value) + ' enviado para ' + request.recipientName + '!');
        if (['transactions', 'extract', 'pix-voice'].includes(window._currentSection)) navigateTo(window._currentSection);
        return;
      }
      if (result.reason === 'biometric-failed') {
        // Mantém a tela ativa com o tempo restante (timer NÃO reseta)
        msgEl.style.display = 'block';
        msgEl.textContent = 'Digital não reconhecida. O PIX não foi enviado. Tente novamente dentro do tempo restante.';
        btnConfirm.disabled = false;
        btnConfirm.textContent = '☝️ Confirmar com digital';
        return;
      }
      if (result.reason === 'no-biometric') {
        overlay.remove();
        toast('Nenhuma digital cadastrada. Conecte sua conta bancária primeiro.', 'error');
        navigateTo('pix-voice');
        return;
      }
      if (result.reason === 'send-error') {
        overlay.remove();
        toast('Erro ao enviar o PIX. Nenhum valor foi debitado.', 'error');
        return;
      }
      // 'expired' e demais: onTimeout já tratou a UI
    };
  }
  window.openPixConfirmation = openPixConfirmation;

  // ============ CONEXÃO BANCÁRIA + CADASTRO DE DIGITAL ============
  window.pixConnectBank = function () {
    const accounts = (loadData('sabolli_accounts') || []).filter(a => a.type !== 'cartão');
    if (!accounts.length) { toast('Cadastre uma conta em Contas e Cartões antes de conectar.', 'error'); return; }

    const old = document.getElementById('pix-connect-overlay');
    if (old) old.remove();
    const overlay = document.createElement('div');
    overlay.id = 'pix-connect-overlay';
    overlay.style.cssText = 'position:fixed;inset:0;background:rgba(0,0,0,0.6);z-index:99999;display:flex;align-items:center;justify-content:center;padding:20px';
    overlay.innerHTML = `<div style="background:#fff;border-radius:20px;padding:26px 22px;max-width:360px;width:100%;box-shadow:0 20px 60px rgba(0,0,0,0.35)">
      <div style="font-size:16px;font-weight:900;color:#1E293B;margin-bottom:6px">🏦 Conectar conta bancária</div>
      <div style="font-size:12px;color:#64748B;margin-bottom:16px;line-height:1.5">Conexão simulada (Open Finance de demonstração). Após conectar, o cadastro da sua <b>digital</b> é obrigatório — ela será exigida para confirmar cada PIX.</div>
      <div style="font-size:12px;color:#64748B;margin-bottom:4px">Conta do app a vincular</div>
      <select id="pix-conn-account" style="width:100%;padding:12px;border-radius:12px;border:1.5px solid #E2E8F0;font-size:14px;color:#1E293B;background:#F8FAFC;margin-bottom:16px">
        ${accounts.map(a => `<option value="${a.id}">${a.name}${a.bank ? ' — ' + a.bank : ''}</option>`).join('')}
      </select>
      <div style="display:flex;gap:10px">
        <button id="pix-conn-cancel" style="flex:1;padding:12px;border-radius:12px;border:1.5px solid #E2E8F0;background:#fff;font-size:14px;font-weight:600;cursor:pointer;color:#64748B">Cancelar</button>
        <button id="pix-conn-ok" style="flex:1.4;padding:12px;border-radius:12px;border:none;background:linear-gradient(135deg,#1E3A8A,#2563EB);color:#fff;font-size:14px;font-weight:800;cursor:pointer">Conectar + cadastrar digital</button>
      </div>
    </div>`;
    document.body.appendChild(overlay);
    overlay.querySelector('#pix-conn-cancel').onclick = () => overlay.remove();
    overlay.querySelector('#pix-conn-ok').onclick = async () => {
      const btn = overlay.querySelector('#pix-conn-ok');
      btn.disabled = true; btn.textContent = 'Aguardando digital...';
      const accId = Number(overlay.querySelector('#pix-conn-account').value);
      const acc = accounts.find(a => a.id === accId);
      try {
        await core.connectBank({ bankName: acc.bank || acc.name, accountName: acc.name });
        // Vincula a conta do app escolhida à conexão (origem dos PIX)
        const conn = loadData(core._keys.KEY_CONNECTION);
        if (conn) { conn.linkedAccountId = acc.id; saveData(core._keys.KEY_CONNECTION, conn); }
        overlay.remove();
        toast('✅ Conta conectada e digital cadastrada com sucesso!');
        navigateTo('pix-voice');
      } catch (e) {
        overlay.remove();
        if (e.code === 'unsupported') toast('Este dispositivo não tem biometria disponível. Não é possível ativar o PIX por voz.', 'error');
        else if (e.code === 'already-enrolled') toast(e.message, 'error');
        else toast('Cadastro da digital falhou ou foi cancelado. A conta NÃO foi conectada. Tente novamente.', 'error');
        navigateTo('pix-voice');
      }
    };
  };

  // ============ REMOÇÃO DA DIGITAL (exige nova validação biométrica) ============
  window.pixRemoveBiometric = function () {
    if (!core.hasBiometric()) { toast('Nenhuma digital cadastrada.', 'error'); return; }
    customConfirm('Tem certeza que deseja remover a digital cadastrada?<br><br>Isso <b>desconectará sua conta bancária</b> e você precisará refazer a conexão e cadastrar uma nova digital do zero.<br><br>Para confirmar, sua digital atual será solicitada.', async () => {
      try {
        await core.removeBiometric();
        toast('Digital removida e conta bancária desconectada. Para usar o PIX por voz novamente, refaça a conexão.', 'warning');
      } catch (e) {
        toast(e.code === 'verify-failed'
          ? 'Digital não reconhecida. A digital cadastrada NÃO foi removida e sua conexão bancária permanece ativa.'
          : e.message, 'error');
      }
      navigateTo('pix-voice');
    });
  };

  // ============ SEÇÃO "PIX POR VOZ" ============
  const AUDIT_LABELS = {
    enroll_failed: '❌ Falha/cancelamento no cadastro da digital',
    connect_blocked_unsupported: '🚫 Conexão bloqueada: dispositivo sem biometria',
    bank_connected_biometric_enrolled: '✅ Conta conectada e digital cadastrada',
    removal_biometric_failed: '❌ Falha biométrica na remoção da digital (nada removido)',
    biometric_removed_session_revoked: '🔓 Digital removida e sessão bancária revogada',
    pix_confirmation_expired: '⏱️ Confirmação de PIX expirada (30s)',
    send_biometric_failed: '❌ Falha biométrica na confirmação de envio (PIX não enviado)',
    send_blocked_no_biometric: '🚫 Envio bloqueado: nenhuma digital cadastrada',
    pix_sent_ok: '✅ PIX enviado com autenticação biométrica',
    pix_send_error: '❌ Erro no envio do PIX'
  };

  window.renderPixVoice = function (c) {
    const conn = core.getBankConnection();
    const bio = core.getEnrolledBiometric();
    const audit = core.getAuditLog().slice(0, 20);
    const ready = !!(conn && bio);

    c.innerHTML = `
      <div class="card" style="padding:20px;margin-bottom:14px">
        <div class="section-title" style="margin-bottom:6px">⚡ PIX por Comando de Voz</div>
        <div style="font-size:13px;color:#64748B;line-height:1.5;margin-bottom:14px">Diga, por exemplo: <b>"PIX de 50 reais para Maria Silva"</b>. Toda confirmação exige sua digital e expira em 30 segundos.</div>
        <div id="pix-support-banner" style="display:none;font-size:13px;font-weight:700;color:#B91C1C;background:#FEF2F2;border-radius:12px;padding:12px;margin-bottom:12px">🚫 Este dispositivo não possui biometria (digital) disponível. O PIX por voz está bloqueado por segurança. Cadastre uma digital nas configurações do aparelho ou use um dispositivo compatível.</div>
        <button onclick="voicePix()" ${ready ? '' : 'disabled'} style="width:100%;padding:14px;border-radius:14px;border:none;background:${ready ? 'linear-gradient(135deg,#059669,#047857)' : '#CBD5E1'};color:#fff;font-size:14px;font-weight:800;cursor:${ready ? 'pointer' : 'not-allowed'};display:flex;align-items:center;justify-content:center;gap:8px">🎙️ Enviar PIX por Voz</button>
        ${ready ? '' : '<div style="font-size:12px;color:#B45309;background:#FFFBEB;border-radius:10px;padding:10px;margin-top:10px">⚠️ Para usar o PIX por voz, conecte uma conta bancária e cadastre sua digital abaixo.</div>'}
      </div>

      <div class="card" style="padding:20px;margin-bottom:14px">
        <div class="section-title" style="margin-bottom:10px">🏦 Conexão bancária & digital</div>
        ${conn ? `
          <div style="display:flex;align-items:center;gap:10px;margin-bottom:10px">
            <div style="width:38px;height:38px;border-radius:10px;background:#DCFCE7;display:flex;align-items:center;justify-content:center;font-size:18px">🏦</div>
            <div style="flex:1"><div style="font-size:14px;font-weight:800;color:#1E293B">${conn.bankName}</div>
            <div style="font-size:12px;color:#64748B">${conn.accountName || ''} · conectada em ${new Date(conn.connectedAt).toLocaleDateString('pt-BR')}</div></div>
            <span style="font-size:11px;font-weight:800;color:#059669;background:#DCFCE7;border-radius:8px;padding:4px 8px">ATIVA</span>
          </div>` : `
          <div style="font-size:13px;color:#64748B;margin-bottom:12px">Nenhuma conta bancária conectada.</div>`}
        ${bio ? `
          <div style="display:flex;align-items:center;gap:10px;margin-bottom:12px">
            <div style="width:38px;height:38px;border-radius:10px;background:#EFF6FF;display:flex;align-items:center;justify-content:center;font-size:18px">☝️</div>
            <div style="flex:1"><div style="font-size:14px;font-weight:800;color:#1E293B">Digital cadastrada</div>
            <div style="font-size:12px;color:#64748B">1 de 1 permitida · em ${new Date(bio.createdAt).toLocaleDateString('pt-BR')} · armazenada no chip seguro do aparelho</div></div>
          </div>
          <button onclick="pixRemoveBiometric()" style="width:100%;padding:12px;border-radius:12px;border:1.5px solid #FCA5A5;background:#FEF2F2;color:#DC2626;font-size:13px;font-weight:700;cursor:pointer">🗑️ Remover digital (exige validação biométrica)</button>` : `
          <button onclick="pixConnectBank()" style="width:100%;padding:13px;border-radius:12px;border:none;background:linear-gradient(135deg,#1E3A8A,#2563EB);color:#fff;font-size:14px;font-weight:800;cursor:pointer">🔗 Conectar conta + cadastrar digital</button>`}
      </div>

      <div class="card" style="padding:20px">
        <div class="section-title" style="margin-bottom:10px">📋 Auditoria local (sem dados sensíveis)</div>
        ${audit.length === 0 ? '<div style="font-size:13px;color:#94A3B8">Nenhum evento registrado ainda.</div>' :
          audit.map(a => `<div style="display:flex;justify-content:space-between;gap:10px;padding:8px 0;border-bottom:1px solid #F1F5F9">
            <div style="font-size:13px;color:#1E293B">${AUDIT_LABELS[a.event] || a.event}</div>
            <div style="font-size:11px;color:#94A3B8;white-space:nowrap">${new Date(a.at).toLocaleString('pt-BR')}</div>
          </div>`).join('')}
      </div>`;

    // Checagem assíncrona de suporte biométrico do dispositivo
    core.isBiometricSupported().then(supported => {
      if (supported) return;
      const banner = document.getElementById('pix-support-banner');
      if (banner) banner.style.display = 'block';
      const btn = c.querySelector('button[onclick="voicePix()"]');
      if (btn) { btn.disabled = true; btn.style.background = '#CBD5E1'; btn.style.cursor = 'not-allowed'; }
    });
  };
})();
