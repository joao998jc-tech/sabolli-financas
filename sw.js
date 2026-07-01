const CACHE = 'sabolli-v18';
// Arquivos que NUNCA devem vir do cache — sempre busca a versão mais recente
const NETWORK_ONLY = ['app.js', 'index.html', 'firebase-init.js', './app.js', './index.html', './firebase-init.js', '/app.js', '/index.html', '/firebase-init.js'];
// Arquivos estáticos que podem ser cacheados (inclui o widget)
const STATIC = ['./styles.css', './manifest.json', './icon.svg', './widget.html'];

self.addEventListener('install', e => {
  e.waitUntil(caches.open(CACHE).then(c => c.addAll(STATIC).catch(() => {})));
  // NÃO chama skipWaiting — espera o app sinalizar que o usuário aprovou a atualização
});

self.addEventListener('activate', e => {
  e.waitUntil(caches.keys().then(keys =>
    Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k)))
  ));
  self.clients.claim();
});

// Recebe mensagem do app para ativar o novo SW
self.addEventListener('message', e => {
  if (e.data && e.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
});

self.addEventListener('fetch', e => {
  const url = new URL(e.request.url);
  const filename = url.pathname.split('/').pop() || 'index.html';
  const isNetworkOnly = NETWORK_ONLY.some(f => url.pathname.endsWith(f) || filename === f || filename === '');

  if (isNetworkOnly || url.pathname === '/' || url.pathname.endsWith('/')) {
    // Sempre busca na rede; só usa cache se estiver offline
    e.respondWith(
      fetch(e.request, { cache: 'no-store' })
        .then(r => {
          const clone = r.clone();
          caches.open(CACHE).then(c => c.put(e.request, clone));
          return r;
        })
        .catch(() => caches.match(e.request))
    );
  } else {
    // Outros arquivos (inclui widget.html): rede primeiro, atualiza cache, fallback para cache
    e.respondWith(
      fetch(e.request)
        .then(r => {
          const clone = r.clone();
          caches.open(CACHE).then(c => c.put(e.request, clone));
          return r;
        })
        .catch(() => caches.match(e.request))
    );
  }
});

// Periodic Background Sync — notifica os clientes para atualizar o saldo
self.addEventListener('periodicsync', e => {
  if (e.tag === 'sabolli-balance-sync') {
    e.waitUntil(notifyClientsToRefresh());
  }
});

async function notifyClientsToRefresh() {
  const clients = await self.clients.matchAll({ type: 'window' });
  clients.forEach(client => {
    client.postMessage({ type: 'BALANCE_UPDATED' });
  });
}
