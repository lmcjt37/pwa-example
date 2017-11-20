var cacheName = 'pwa-example';

self.addEventListener('install', function(event) {

    console.log('Service Worker: Installing...');

    event.waitUntil(

        caches.open(cacheName).then(function(cache) {
            console.log('Service Worker: Caching...');

            return cache.addAll([
                './',
                './css/style.css',
                './images/home.svg',
                './images/ic_refresh_white_24px.svg',
                './images/profile.png',
                './images/push-off.png',
                './images/push-on.png',
                './js/app.js',
                './js/menu.js',
                './js/notification.js',
                './js/offline.js',
                './js/toast.js'
            ]);
        })
    );
});


// Fired when the Service Worker starts up
self.addEventListener('activate', function(event) {

    console.log('Service Worker: Activating...');

    event.waitUntil(
        caches.keys().then(function(cacheNames) {
            return Promise.all(cacheNames.map(function(key) {
                if (key !== cacheName) {
                    console.log('Service Worker: Clearing Cache... ', key);
                    return caches.delete(key);
                }
            }));
        })
    );
    return self.clients.claim();
});


self.addEventListener('fetch', function(event) {

    console.log('Service Worker: Fetching... ', event.request.url);

    event.respondWith(
        caches.match(event.request).then(function(response) {
            return response || fetch(event.request);
        })
    );
});

self.addEventListener('push', function(event) {

    console.info('Push Received.');

    var title = 'PWA Example';
    var body = {
        'body': 'Click to see more...',
        'tag': 'pwa',
        'icon': './images/48x48.png'
    };

    event.waitUntil(
        self.registration.showNotification(title, body)
    );
});

self.addEventListener('notificationclick', function(event) {

    event.notification.close();
    event.waitUntil(
        clients.openWindow('./latest.html')
    );

});
