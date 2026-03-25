const CACHE = 'athleteiq-video-v1';
const ASSETS = ['./index.html', './analyse.html', './manifest.json'];

self.addEventListener('install', e => {
  e.waitUntil(caches.open(CACHE).then(c => c.addAll(ASSETS)).then(() => self.skipWaiting()));
});
self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k)))
    ).then(() => self.clients.claim())
  );
});
self.addEventListener('fetch', e => {
  const ext = e.request.url.includes('cdn.jsdelivr') || e.request.url.includes('fonts.google');
  e.respondWith(
    ext
      ? fetch(e.request).catch(() => caches.match(e.request))
      : caches.match(e.request).then(r => r || fetch(e.request))
  );
});
