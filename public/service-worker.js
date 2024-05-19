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
    const payload = event.data.json();
    if (!payload || !payload.notification) {
        return;
    }

    event.waitUntil(
        self.registration.showNotification(payload.notification.title, {
            body:  payload.notification.body,
            icon: payload.notification.icon,
        })
    );
});

self.addEventListener('periodicsync', event => {
    if (event.tag === 'sync-data') {
        console.log('Service Worker periodic sync event');
    }
});
