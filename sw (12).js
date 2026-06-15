// Миний Санхүү — Service Worker v121
// Авто шинэчлэлт: шинэ хувилбар гарахад хуудас автоматаар дахин ачааллана

const SW_VERSION = 'v121';

self.addEventListener('install', e => {
  self.skipWaiting(); // Шинэ SW шууд идэвхжинэ
});

self.addEventListener('activate', e => {
  e.waitUntil(
    // Хуучин кэш бүгдийг устгах
    caches.keys()
      .then(keys => Promise.all(keys.map(k => caches.delete(k))))
      .then(() => self.clients.claim()) // Бүх tab-г шинэ SW-д шилжүүлнэ
      .then(() => {
        // Бүх нээлттэй хуудсыг дахин ачааллах
        return self.clients.matchAll({ type: 'window' });
      })
      .then(clients => {
        clients.forEach(client => {
          client.postMessage({ type: 'SW_UPDATED', version: SW_VERSION });
        });
      })
  );
});

self.addEventListener('fetch', e => {
  if (e.request.mode === 'navigate') {
    // HTML хуудас: cache-аас ХЭЗЭЭ Ч авахгүй, үргэлж сүлжээнээс
    e.respondWith(
      fetch(e.request, {
        cache: 'no-store',
        headers: { 'Cache-Control': 'no-cache' }
      }).catch(() =>
        new Response(
          '<html><body style="font-family:sans-serif;text-align:center;padding:60px"><h2>📵 Интернэт холбоогүй</h2><p>Дахин оролдоно уу.</p></body></html>',
          { headers: { 'Content-Type': 'text/html' } }
        )
      )
    );
  } else {
    // Бусад (JS, CSS, img): cache-аас авахгүй
    e.respondWith(fetch(e.request, { cache: 'no-store' })
      .catch(() => fetch(e.request)));
  }
});
