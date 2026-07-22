const CACHE_NAME = 'bienestar-en-claro-v4';
const STATIC_ASSETS = [
  '/',
  '/index.html',
  '/manifest.json',
  '/branding/social/og-image.png',
  '/branding/pwa/icon-192.png',
  '/branding/pwa/icon-512.png',
  '/branding/pwa/maskable-192.png',
  '/branding/pwa/maskable-512.png',
];

self.addEventListener('install', (event) => {
  event.waitUntil(caches.open(CACHE_NAME).then((cache) => cache.addAll(STATIC_ASSETS)));
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(caches.keys().then((keys) => Promise.all(keys.filter((k) => k !== CACHE_NAME).map((k) => caches.delete(k)))));
  self.clients.claim();
});

self.addEventListener('fetch', (event) => {
  if (event.request.method !== 'GET') return;

  if (event.request.url.match(/\.(png|jpg|jpeg|webp|svg|woff2?|ttf|mp4|webm)$/) || event.request.url.includes('/branding/') || event.request.url.includes('/img/') || event.request.url.includes('/images/')) {
    event.respondWith(caches.match(event.request).then((cached) => fetch(event.request).then((response) => { if (response.ok) { const clone = response.clone(); caches.open(CACHE_NAME).then((cache) => cache.put(event.request, clone)); } return response; }).catch(() => cached || Response.error())));
    return;
  }

  if (event.request.mode === 'navigate') {
    event.respondWith(fetch(event.request).then((response) => { if (response.ok) { const clone = response.clone(); caches.open(CACHE_NAME).then((cache) => cache.put(event.request, clone)); } return response; }).catch(() => caches.match('/index.html').then((cached) => cached || Response.error())));
    return;
  }

  event.respondWith(fetch(event.request).catch(() => caches.match(event.request).then((cached) => cached || Response.error())));
});
