ok// Nazwa cache dla zasobów statycznych
const CACHE_NAME = 'static-cache-v2';

// Lista statycznych zasobów do cache'owania
const STATIC_ASSETS = [
  '/',
  '/index.html',
  '/manifest.json',
  '/icon-192x192.png',
  '/icon-512x512.png',
  
  
  // Dodaj tutaj wszystkie inne statyczne zasoby aplikacji
];

// Nasłuchuj zdarzenia 'install' - instalacja service workera
self.addEventListener('install', (event) => {
    console.log('[Service Worker] Installing Service Worker ...', event);
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then((cache) => {
                console.log('[Service Worker] Precaching App Shell');
                return cache.addAll(STATIC_ASSETS);
            })
    );
});

// Nasłuchuj zdarzenia 'fetch' - pobieranie zasobów
self.addEventListener('fetch', (event) => {
    event.respondWith(
        caches.match(event.request)
            .then((response) => {
                if (response) {
                    return response; // Zwróć zasób z cache
                } else {
                    return fetch(event.request); // Pobierz zasób z sieci
                }
            })
    );
});

// Nasłuchuj zdarzenia 'activate' - aktywacja service workera
self.addEventListener('activate', (event) => {
    console.log('[Service Worker] Activating Service Worker ....', event);
    const cacheWhitelist = [CACHE_NAME];
    event.waitUntil(
        caches.keys().then((cacheNames) => {
            return Promise.all(
                cacheNames.map((cacheName) => {
                    if (cacheWhitelist.indexOf(cacheName) === -1) {
                        return caches.delete(cacheName);
                    }
                })
            );
        })
    );
});