const CACHE = 'paira-v3';
const ASSETS = ['./', 'index.html', 'manifest.json', 'favicon.png', 'apple-touch-icon.png', 'logo.png', 'icon-192-v3.png', 'icon-512-v3.png', 'icon-maskable-v3.png'];
self.addEventListener('install', e => {
  e.waitUntil(caches.open(CACHE).then(c => c.addAll(ASSETS)).then(() => self.skipWaiting()));
});
self.addEventListener('activate', e => {
  e.waitUntil(caches.keys().then(k => Promise.all(k.filter(x => x !== CACHE).map(x => caches.delete(x)))).then(() => self.clients.claim()));
});
// сеть в приоритете, кеш — только когда нет интернета (так обновления и иконки приходят сразу)
self.addEventListener('fetch', e => {
  const r = e.request;
  if (r.method !== 'GET') return;
  if (new URL(r.url).origin !== location.origin) return; // Supabase и CDN не трогаем
  e.respondWith(fetch(r).then(res => {
    const cp = res.clone(); caches.open(CACHE).then(c => c.put(r.mode === 'navigate' ? 'index.html' : r, cp)); return res;
  }).catch(() => caches.match(r.mode === 'navigate' ? 'index.html' : r)));
});
