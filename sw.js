const CACHE_NAME = 'freetools-cache-v1';
const ASSETS_TO_CACHE = [
  '/',
  '/index.html',
  '/about.html',
  '/privacy.html',
  '/contact.html',
  '/image-compressor.html',
  '/word-counter.html',
  '/age-calculator.html',
  '/qr-code-generator.html',
  '/unit-converter.html',
  '/css/style.css',
  '/js/main.js',
  '/js/image-compressor.js',
  '/js/word-counter.js',
  '/js/age-calculator.js',
  '/js/qr-code.js',
  '/js/qrcodegen.js',
  '/js/unit-converter.js',
  '/assets/icon.svg',
  '/manifest.json',
  '/password-generator.html',
  '/bmi-calculator.html',
  '/js/password-generator.js',
  '/js/bmi-calculator.js',
  '/blog/index.html',
  '/blog/reduce-image-file-size.html'
];

// Install Event
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => {
      return cache.addAll(ASSETS_TO_CACHE);
    })
  );
  self.skipWaiting();
});

// Activate Event
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cache => {
          if (cache !== CACHE_NAME) {
            return caches.delete(cache);
          }
        })
      );
    })
  );
  self.clients.claim();
});

// Fetch Event (Stale-While-Revalidate)
self.addEventListener('fetch', event => {
  // Only intercept GET requests for our own origin
  if (event.request.method !== 'GET' || !event.request.url.startsWith(self.location.origin)) {
    return;
  }
  
  event.respondWith(
    caches.match(event.request).then(cachedResponse => {
      if (cachedResponse) {
        // Return cached response immediately, then update cache in background
        fetch(event.request).then(networkResponse => {
          if (networkResponse && networkResponse.ok) {
            caches.open(CACHE_NAME).then(cache => {
              cache.put(event.request, networkResponse);
            });
          }
        }).catch(err => console.error('Background fetch failed:', err));
        
        return cachedResponse;
      }
      
      // Not in cache: perform normal network fetch with proper error propagation
      return fetch(event.request).then(networkResponse => {
        if (networkResponse && networkResponse.ok) {
          const responseToCache = networkResponse.clone();
          caches.open(CACHE_NAME).then(cache => {
            cache.put(event.request, responseToCache);
          });
        }
        return networkResponse;
      }).catch(err => {
        // Let the browser handle the actual network failure gracefully
        console.error('Fetch failed:', err);
        throw err;
      });
    })
  );
});
