importScripts('https://www.gstatic.com/firebasejs/9.0.0/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/9.0.0/firebase-messaging-compat.js');

// Konfiguracja Firebase z rzeczywistymi kluczami
firebase.initializeApp({
  apiKey: "AIzaSyCuxk4VE7CWO2ZvIjz9xbA06Lyq-5ZBvB8",
  authDomain: "Ybeertaste-apk.firebaseapp.com",
  projectId: "beertaste-apk",
  storageBucket: "beertaste-apk.firebasestorage.app",
  messagingSenderId: "714203363835",
  appId: "1:714203363835:web:ece8aff7b9ba741988f35e",
});

const messaging = firebase.messaging();

// Obsługa powiadomień w tle
messaging.onBackgroundMessage((payload) => {
  console.log('Otrzymano powiadomienie w tle:', payload);

  const notificationTitle = payload.notification.title;
  const notificationOptions = {
    body: payload.notification.body,
    icon: '/logo192.png',
    badge: '/badge.png',
    data: payload.data,
    actions: [
      {
        action: 'view',
        title: 'Zobacz szczegóły'
      }
    ]
  };

  self.registration.showNotification(notificationTitle, notificationOptions);
});

// Obsługa kliknięcia w powiadomienie
self.addEventListener('notificationclick', (event) => {
  const warkaId = event.notification.data.warkaId;
  
  clients.openWindow(`/dzienniki/warzenia/${warkaId}`);
  event.notification.close();
});
