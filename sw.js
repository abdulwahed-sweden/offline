/* Offline support for the three block maps.
   The app shell (pages, Leaflet, geometry) is precached on install, so the maps
   open with no network. Map tiles are cached as they are viewed — panning an
   area once while online makes it available offline afterwards. */

var SHELL_CACHE = 'blocks-shell-v1';
var TILE_CACHE = 'blocks-tiles-v1';
var TILE_LIMIT = 1500;

var SHELL = [
    './',
    './index.html',
    './gaza-block-finder.html',
    './gaza-block-guide.html',
    './vendor/leaflet/leaflet.js',
    './vendor/leaflet/leaflet.css',
    './vendor/leaflet/images/marker-icon.png',
    './vendor/leaflet/images/marker-icon-2x.png',
    './vendor/leaflet/images/marker-shadow.png',
    './vendor/leaflet/images/layers.png',
    './vendor/leaflet/images/layers-2x.png'
];

var TILE_HOSTS = ['tile.openstreetmap.org', 'server.arcgisonline.com', 'basemaps.cartocdn.com'];

self.addEventListener('install', function (event) {
    event.waitUntil(
        caches.open(SHELL_CACHE)
            .then(function (cache) { return cache.addAll(SHELL); })
            .then(function () { return self.skipWaiting(); })
    );
});

self.addEventListener('activate', function (event) {
    event.waitUntil(
        caches.keys().then(function (names) {
            return Promise.all(names.map(function (name) {
                if (name !== SHELL_CACHE && name !== TILE_CACHE) {
                    return caches.delete(name);
                }
            }));
        }).then(function () { return self.clients.claim(); })
    );
});

function isTile(url) {
    return TILE_HOSTS.some(function (host) { return url.hostname.indexOf(host) !== -1; });
}

// Keep the tile cache from growing without bound: oldest entries go first.
function trimTiles(cache) {
    return cache.keys().then(function (keys) {
        if (keys.length <= TILE_LIMIT) {
            return;
        }
        return Promise.all(keys.slice(0, keys.length - TILE_LIMIT).map(function (key) {
            return cache.delete(key);
        }));
    });
}

function cacheFirst(request, cacheName, isTileRequest) {
    return caches.open(cacheName).then(function (cache) {
        return cache.match(request).then(function (hit) {
            if (hit) {
                return hit;
            }
            return fetch(request).then(function (response) {
                // Tiles come back opaque (no CORS), so status is 0 rather than 200.
                if (response && (response.ok || response.type === 'opaque')) {
                    cache.put(request, response.clone()).then(function () {
                        if (isTileRequest) {
                            return trimTiles(cache);
                        }
                    });
                }
                return response;
            });
        });
    });
}

self.addEventListener('fetch', function (event) {
    var request = event.request;
    if (request.method !== 'GET') {
        return;
    }

    var url = new URL(request.url);

    if (isTile(url)) {
        event.respondWith(cacheFirst(request, TILE_CACHE, true).catch(function () {
            return Response.error();
        }));
        return;
    }

    if (url.origin === self.location.origin) {
        event.respondWith(cacheFirst(request, SHELL_CACHE, false).catch(function () {
            return caches.match('./index.html');
        }));
    }
});
