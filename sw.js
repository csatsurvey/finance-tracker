const CACHE = 'minii-sankhuu-v2';

self.addEventListener('install', e => {
  self.skipWaiting();
});

self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.map(k => caches.delete(k)))
    )
  );
  self.clients.claim();
});

self.addEventListener('fetch', e => {
  // Кэш ашиглахгүй — шууд сервераас татна
  if (e.request.url.startsWith(self.location.origin)) {
    e.respondWith(fetch(e.request));
  }
});
