// Scripts for firebase-messaging-sw.js
importScripts("https://www.gstatic.com/firebasejs/9.0.0/firebase-app-compat.js");
importScripts("https://www.gstatic.com/firebasejs/9.0.0/firebase-messaging-compat.js");

// Initialize the Firebase app in the service worker by passing in the
// messagingSenderId.
// Note: These will be replaced by environment variables or placeholders.
const firebaseConfig = {
    apiKey: "AIzaSyCJKkje_S7j_8o5x59LVr2-TnQBVBiKgis",
    authDomain: "itend-backend.firebaseapp.com",
    projectId: "itend-backend",
    storageBucket: "itend-backend.firebasestorage.app",
    messagingSenderId: "678060058017",
    appId: "1:678060058017:web:eaf0650a6ab5615c9317e0",
};

firebase.initializeApp(firebaseConfig);

// Retrieve an instance of Firebase Messaging so that it can handle background
// messages.
const messaging = firebase.messaging();

messaging.onBackgroundMessage((payload) => {
    console.log("[firebase-messaging-sw.js] Received background message ", payload);
    const notificationTitle = payload.notification.title;
    const notificationOptions = {
        body: payload.notification.body,
        icon: "/surbuy-icon.png",
    };

    self.registration.showNotification(notificationTitle, notificationOptions);
});
