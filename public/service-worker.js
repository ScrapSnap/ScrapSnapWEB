self.addEventListener("fetch", (event) => {
    //console.log('Service Worker fetching:', event.request.url);
    event.respondWith(fetch(event.request));
});


self.addEventListener('install', event => {
    console.log('Service Worker installing.');
});

self.addEventListener('activate', event => {
    console.log('Service Worker activating.');
});

self.addEventListener('push', event => {
    console.log('Service Worker push event:', event);
    const payload = event.data ? event.data.text() : 'Default notification payload';

    event.waitUntil(
        self.registration.showNotification('Push Notification', {
            body: payload,
            icon: 'icons/icon-192x192.png',
        })
    );
});

self.addEventListener('periodicsync', event => {
    if (event.tag === 'sync-data') {
        console.log('Service Worker periodic sync event');
    }
});
