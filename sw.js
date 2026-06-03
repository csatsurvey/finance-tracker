const CACHE = 'ms-v3';
const MAIN = '/finance-tracker/index.html';

self.addEventListener('install', e => {
  e.waitUntil(
    caches.open(CACHE).then(c => c.add(MAIN).catch(()=>{}))
  );
  self.skipWaiting();
});

self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k)))
    )
  );
  self.clients.claim();
});

self.addEventListener('fetch', e => {
  if (!e.request.url.startsWith(self.location.origin)) return;
  if (e.request.url.includes('firebase') || e.request.url.includes('gstatic')) return;
  
  e.respondWith(
    // Network-first: сервераас татах, амжилтгүй бол кэшнээс
    fetch(e.request).then(resp => {
      if (resp && resp.status === 200) {
        const clone = resp.clone();
        caches.open(CACHE).then(c => c.put(e.request, clone));
      }
      return resp;
    }).catch(() => caches.match(e.request).then(r => r || caches.match(MAIN)))
  );
});
