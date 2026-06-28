import { initializeApp } from 'https://www.gstatic.com/firebasejs/10.12.0/firebase-app.js';
import { getAuth, signInWithPopup, signInWithRedirect, getRedirectResult, signOut, GoogleAuthProvider, onAuthStateChanged, signInWithEmailAndPassword, createUserWithEmailAndPassword } from 'https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js';
import { getFirestore, collection, getDocs, doc, setDoc } from 'https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js';

window._fbReady = true;
if (window._fbStarted) window._fbStarted();

const firebaseConfig = {
  apiKey: "AIzaSyBTJmv-CaNSyYL1mA9HAO-vjL5fUL4vpPc",
  authDomain: "sabolli-financas.firebaseapp.com",
  projectId: "sabolli-financas",
  storageBucket: "sabolli-financas.firebasestorage.app",
  messagingSenderId: "1099064629968",
  appId: "1:1099064629968:web:38fe1994cbe14ec7439cd5"
};

const fbApp = initializeApp(firebaseConfig);
const auth = getAuth(fbApp);
const db = getFirestore(fbApp);
const provider = new GoogleAuthProvider();
provider.setCustomParameters({ prompt: 'select_account' });
let currentUid = null;

const GOOGLE_BTN_HTML = `<svg width="20" height="20" viewBox="0 0 48 48"><path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"/><path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"/><path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"/><path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.18 1.48-4.97 2.34-8.16 2.34-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"/></svg> Entrar com Google`;

window.signInWithGoogle = async () => {
  const btn = document.getElementById('btn-google-login');
  const setBtn = (txt, disabled) => {
    if (!btn) return;
    btn.disabled = !!disabled;
    if (txt) btn.innerHTML = txt;
  };
  try {
    setBtn('Aguardando...', true);
    // Tenta popup em qualquer dispositivo — Chrome Android abre como aba nova
    await signInWithPopup(auth, provider);
    // onAuthStateChanged cuida do resto automaticamente
  } catch(e) {
    const code = e.code || '';
    // Usuário fechou o popup — reabilita o botão silenciosamente
    if (code === 'auth/popup-closed-by-user' || code === 'auth/cancelled-popup-request') {
      setBtn(GOOGLE_BTN_HTML, false);
      return;
    }
    // Popup realmente bloqueado pelo browser → fallback para redirect
    if (code === 'auth/popup-blocked') {
      setBtn('Redirecionando para o Google...', true);
      try { await signInWithRedirect(auth, provider); } catch(_) {}
      return;
    }
    setBtn(GOOGLE_BTN_HTML, false);
    // Mostra o erro real para ajudar a diagnosticar
    const msg = e.message || code || 'Erro desconhecido';
    alert('Erro ao entrar: ' + msg);
  }
};

// Traduz erros do Firebase para português
function traduzErro(code) {
  const erros = {
    'auth/invalid-email': 'E-mail inválido.',
    'auth/user-not-found': 'Nenhuma conta com esse e-mail. Crie uma conta primeiro.',
    'auth/wrong-password': 'Senha incorreta.',
    'auth/invalid-credential': 'E-mail ou senha incorretos.',
    'auth/email-already-in-use': 'Esse e-mail já está cadastrado. Faça login.',
    'auth/weak-password': 'Senha muito fraca. Use pelo menos 6 caracteres.',
    'auth/too-many-requests': 'Muitas tentativas. Aguarde alguns minutos.',
    'auth/network-request-failed': 'Sem internet. Verifique sua conexão.',
  };
  return erros[code] || 'Erro ao entrar. Tente novamente.';
}

window.signInEmail = async () => {
  const email = (document.getElementById('login-email')?.value || '').trim();
  const pass = document.getElementById('login-pass')?.value || '';
  const errEl = document.getElementById('login-error');
  const btn = document.getElementById('btn-email-login');
  if (errEl) errEl.style.display = 'none';
  if (!email || !pass) {
    if (errEl) { errEl.textContent = 'Preencha e-mail e senha.'; errEl.style.display = 'block'; }
    return;
  }
  if (btn) { btn.textContent = 'Entrando...'; btn.disabled = true; }
  try {
    await signInWithEmailAndPassword(auth, email, pass);
  } catch(e) {
    if (errEl) { errEl.textContent = traduzErro(e.code); errEl.style.display = 'block'; }
    if (btn) { btn.textContent = 'Entrar'; btn.disabled = false; }
  }
};

window.criarConta = async () => {
  const email = (document.getElementById('reg-email')?.value || '').trim();
  const pass = document.getElementById('reg-pass')?.value || '';
  const errEl = document.getElementById('reg-error');
  const btn = document.getElementById('btn-criar');
  if (errEl) errEl.style.display = 'none';
  if (!email || !pass) {
    if (errEl) { errEl.textContent = 'Preencha e-mail e senha.'; errEl.style.display = 'block'; }
    return;
  }
  if (btn) { btn.textContent = 'Criando...'; btn.disabled = true; }
  try {
    await createUserWithEmailAndPassword(auth, email, pass);
  } catch(e) {
    if (errEl) { errEl.textContent = traduzErro(e.code); errEl.style.display = 'block'; }
    if (btn) { btn.textContent = 'Criar conta'; btn.disabled = false; }
  }
};

window.toggleCriarConta = () => {
  const box = document.getElementById('criar-conta-box');
  if (!box) return;
  const aberto = box.style.display !== 'none';
  box.style.display = aberto ? 'none' : 'block';
  const btn = box.previousElementSibling?.querySelector('button');
  if (btn) btn.textContent = aberto ? 'Não tem conta? Criar agora →' : 'Já tenho conta';
};

window.skipLogin = () => {
  localStorage.setItem('sabolli_skip_login', '1');
  hideLoginOverlay();
  if (window._startApp) window._startApp();
};

window.signOutUser = async () => {
  localStorage.removeItem('sabolli_skip_login');
  await signOut(auth);
  location.reload();
};

// Debounce: agrupa escritas em lote a cada 2s para não sobrecarregar o Firestore
const _syncQueue = {};
let _syncTimer = null;
window.syncSaveData = (key, data) => {
  if (!currentUid) return;
  _syncQueue[key] = data;
  clearTimeout(_syncTimer);
  _syncTimer = setTimeout(async () => {
    const entries = Object.entries(_syncQueue);
    for (const k in _syncQueue) delete _syncQueue[k];
    for (const [k, v] of entries) {
      try { await setDoc(doc(db, 'users', currentUid, 'data', k), { v }); } catch(e) {}
    }
  }, 2000);
};

async function loadFromCloud(uid) {
  try {
    const snap = await getDocs(collection(db, 'users', uid, 'data'));
    snap.forEach(d => {
      if (d.data().v !== undefined) {
        localStorage.setItem(d.id, JSON.stringify(d.data().v));
      }
    });
    return true;
  } catch(e) {
    return false;
  }
}

function showLoginOverlay() {
  if (localStorage.getItem('sabolli_skip_login') === '1') {
    hideLoginOverlay();
    if (window._startApp) window._startApp();
    return;
  }
  const el = document.getElementById('login-overlay');
  if (el) el.style.display = 'flex';
}

function hideLoginOverlay() {
  const el = document.getElementById('login-overlay');
  if (el) el.style.display = 'none';
}

function updateUserUI(user) {
  const el = document.getElementById('fb-user');
  if (!el) return;
  const name = (user.displayName || 'Você').split(' ')[0];
  el.innerHTML = `
    <span style="font-size:12px;font-weight:700;color:rgba(255,255,255,0.85)">${name}</span>
    <button onclick="signOutUser()" title="Sair" style="background:rgba(255,255,255,0.15);color:#fff;border:none;border-radius:8px;padding:4px 9px;font-size:11px;cursor:pointer;font-weight:600">Sair</button>`;
}

// Processa resultado do redirect (login no mobile)
getRedirectResult(auth)
  .then(result => {
    // onAuthStateChanged cuida do estado do usuário após redirect
    if (result && result.user) {
      // Usuário acabou de logar via redirect — onAuthStateChanged já vai disparar
    }
  })
  .catch(e => {
    const code = e.code || '';
    // Erros comuns de redirect que podem ser ignorados
    if (code === 'auth/redirect-cancelled-by-user' || code === 'auth/redirect-operation-pending') return;
    if (window.toast && code) window.toast('Erro ao entrar: ' + code, 'error');
  });

let visibilityListenerAdded = false;
let appAlreadyStarted = false;

onAuthStateChanged(auth, async user => {
  if (user) {
    currentUid = user.uid;
    localStorage.removeItem('sabolli_skip_login');
    hideLoginOverlay();
    updateUserUI(user);

    if (!appAlreadyStarted) {
      await loadFromCloud(currentUid);
      appAlreadyStarted = true;
      if (window._startApp) window._startApp();
    }

    if (!visibilityListenerAdded) {
      visibilityListenerAdded = true;
      document.addEventListener('visibilitychange', async () => {
        if (document.visibilityState === 'visible' && currentUid) {
          await loadFromCloud(currentUid);
          if (window.navigateTo && window._currentSection) {
            window.navigateTo(window._currentSection);
          }
        }
      });
    }
  } else {
    currentUid = null;
    showLoginOverlay();
  }
});
