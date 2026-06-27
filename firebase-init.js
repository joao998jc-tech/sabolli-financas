import { initializeApp } from 'https://www.gstatic.com/firebasejs/10.12.0/firebase-app.js';
import { getAuth, signInWithPopup, signOut, GoogleAuthProvider, onAuthStateChanged } from 'https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js';
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
let currentUid = null;

window.signInWithGoogle = async () => {
  try {
    await signInWithPopup(auth, provider);
  } catch(e) {
    if (window.toast) window.toast('Erro ao entrar: ' + (e.code || e.message), 'error');
  }
};

window.signOutUser = async () => {
  await signOut(auth);
  location.reload();
};

window.syncSaveData = async (key, data) => {
  if (!currentUid) return;
  try {
    await setDoc(doc(db, 'users', currentUid, 'data', key), { v: data });
  } catch(e) {}
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

let visibilityListenerAdded = false;

onAuthStateChanged(auth, async user => {
  if (user) {
    currentUid = user.uid;
    hideLoginOverlay();
    updateUserUI(user);
    await loadFromCloud(currentUid);
    if (window._startApp) window._startApp();

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
