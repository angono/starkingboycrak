// serviceworker.js
// Base Service Worker implementation.  To use your own Service Worker, set the PWA_SERVICE_WORKER_PATH variable in settings.py

var staticCacheName = "starking-v" + new Date().getTime();
var filesToCache = [
  '/',
  '/static/css/styles.css',
  '/static/css/boostrap.min.css',
  '/static/css/custom.css',
  '/static/js/boostrap.min.js',
  '/static/js/scripts.js',
  '/offline.html',
  '/static/assets/favicon.ico',
  '/static/assets/icon-192.png',
  '/static/assets/logo.png'
];

// Cache on install
self.addEventListener("install", event => {
    this.skipWaiting();
    event.waitUntil(
        caches.open(staticCacheName)
            .then(cache => {
                return cache.addAll(filesToCache);
            })
    )
});

// Clear cache on activate
self.addEventListener('activate', event => {
    event.waitUntil(
        caches.keys().then(cacheNames => {
            return Promise.all(
                cacheNames
                    .filter(cacheName => (cacheName.startsWith("starking-")))
                    .filter(cacheName => (cacheName !== staticCacheName))
                    .map(cacheName => caches.delete(cacheName))
            );
        })
    );
});

// Serve from Cache
self.addEventListener("fetch", event => {
    event.respondWith(
        caches.match(event.request)
            .then(response => {
                return response || fetch(event.request);
            })
            .catch(() => {
                return caches.match('/offline/');
            })
    )
});
