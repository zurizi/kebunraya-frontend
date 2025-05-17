importScripts(
  "https://www.gstatic.com/firebasejs/10.13.2/firebase-app-compat.js"
);
importScripts(
  "https://www.gstatic.com/firebasejs/10.13.2/firebase-messaging-compat.js"
);

const firebaseConfig = {
  apiKey: "AIzaSyDd0gz9reboWjr4elHHJVUgY3VAxvANDUQ",
  authDomain: "kebunraya-535bc.firebaseapp.com",
  projectId: "kebunraya-535bc",
  storageBucket: "kebunraya-535bc.firebasestorage.app",
  messagingSenderId: "498906273316",
  appId: "1:498906273316:web:1aab51f6066295530faab1",
  measurementId: "G-02GWS5ZPYV",
};

if (firebase.apps.length === 0) {
    firebase.initializeApp(firebaseConfig);
}

const messaging = firebase.messaging();

// Menangani pesan latar belakang
messaging.onBackgroundMessage((payload) => {
    console.log('[firebase-messaging-sw.js] Received background message ', payload);

    const notificationTitle = payload.notification.title;
    const notificationOptions = {
        body: payload.notification.body,
        icon: payload.notification.image || '/icons/icon-192x192.png' // Ganti dengan path ikon Anda
        // Anda bisa menambahkan data, actions, dll.
    };

    self.registration.showNotification(notificationTitle, notificationOptions);
});

// (Opsional) Menangani klik pada notifikasi
self.addEventListener('notificationclick', (event) => {
    console.log('[firebase-messaging-sw.js] Notification click Received.', event.notification);
    event.notification.close();
    // Aksi kustom saat notifikasi diklik, misalnya membuka URL tertentu
    // const urlToOpen = event.notification.data.url || '/';
    // event.waitUntil(clients.openWindow(urlToOpen));
});