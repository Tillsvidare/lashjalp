/**
 * OCR Läshjälp - Service Worker
 *
 * Strategi:
 * - App shell (HTML, manifest, ikoner): cache-first, uppdateras vid ny version.
 * - Tesseract-bibliotek (jsdelivr): cache-first, immutabla vid versionslåsning.
 * - Tesseract språkdata (tessdata.projectnaptha.com): cache-first, stora filer
 *   som sällan ändras. Cachas efter första laddning, fungerar offline därefter.
 * - Övrigt: network-first.
 */

const VERSION = 'v9';
const APP_SHELL_CACHE = `ocr-lashjalp-shell-${VERSION}`;
const RUNTIME_CACHE = `ocr-lashjalp-runtime-${VERSION}`;

const APP_SHELL = [
  './',
  './index.html',
  './manifest.webmanifest',
  './icons/icon-192.png',
  './icons/icon-512.png',
  './icons/icon-maskable-192.png',
  './icons/icon-maskable-512.png'
];

// Domäner som ska cachas runtime (Tesseract + språkdata + font)
const RUNTIME_CACHEABLE_HOSTS = [
  'cdn.jsdelivr.net',
  'tessdata.projectnaptha.com'
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(APP_SHELL_CACHE)
      .then(cache => cache.addAll(APP_SHELL))
      .then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then(keys => {
      return Promise.all(
        keys
          .filter(k => k !== APP_SHELL_CACHE && k !== RUNTIME_CACHE)
          .map(k => caches.delete(k))
      );
    }).then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', (event) => {
  const req = event.request;
  if (req.method !== 'GET') return;

  const url = new URL(req.url);

  // Same-origin: cache-first mot app shell, annars network-first
  if (url.origin === self.location.origin) {
    event.respondWith(cacheFirst(req, APP_SHELL_CACHE));
    return;
  }

  // Runtime caching för Tesseract och språkdata
  if (RUNTIME_CACHEABLE_HOSTS.includes(url.hostname)) {
    event.respondWith(cacheFirst(req, RUNTIME_CACHE));
    return;
  }

  // Allt annat: låt gå till nätverket
});

async function cacheFirst(request, cacheName) {
  const cache = await caches.open(cacheName);
  const cached = await cache.match(request);
  if (cached) return cached;

  try {
    const fresh = await fetch(request);
    // Bara cacha lyckade och basic/cors-responses
    if (fresh && (fresh.ok || fresh.type === 'opaque')) {
      cache.put(request, fresh.clone());
    }
    return fresh;
  } catch (err) {
    // Offline och inte i cache
    if (request.mode === 'navigate') {
      const fallback = await cache.match('./index.html');
      if (fallback) return fallback;
    }
    throw err;
  }
}

// Meddelandelyssnare för manuell uppdatering från klienten
self.addEventListener('message', (event) => {
  if (event.data === 'skipWaiting') self.skipWaiting();
});
