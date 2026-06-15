// Миний Санхүү — Service Worker (network-only, no cache)
// Зорилго: PWA install боломжтой болгох. Кэшлэхгүй — шинэ контент алдагдахгүй.
const CACHE_NAME = 'minii-sankhuu-v1';

self.addEventListener('install', e => {
  self.skipWaiting(); // Шууд идэвхжинэ
});

self.addEventListener('activate', e => {
  // Хуучин кэш устгах
  e.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.map(k => caches.delete(k)))
    ).then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', e => {
  // Network-only: кэшлэхгүй, шинэ контент авна
  // Offline бол navigate request-д offline page харуулна
  if (e.request.mode === 'navigate') {
    e.respondWith(
      fetch(e.request).catch(() =>
        new Response(
          '<html><body style="font-family:sans-serif;text-align:center;padding:60px;color:#1e3a5f"><h2>📵 Интернэт холбоогүй байна</h2><p>Интернэт холбоогоо шалгаад дахин оролдоно уу.</p></body></html>',
          { headers: { 'Content-Type': 'text/html' } }
        )
      )
    );
  } else {
    e.respondWith(fetch(e.request));
  }
});
