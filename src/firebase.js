import { initializeApp, getApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { getMessaging, getToken, onMessage } from "firebase/messaging";

const firebaseConfig = {
  apiKey: "AIzaSyCuxk4VE7CWO2ZvIjz9xbA06Lyq-5ZBvB8",
  authDomain: "Ybeertaste-apk.firebaseapp.com",
  projectId: "beertaste-apk",
  storageBucket: "beertaste-apk.firebasestorage.app",
  messagingSenderId: "714203363835",
  appId: "1:714203363835:web:ece8aff7b9ba741988f35e",
};

export const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);

// Konfiguracja Firebase Messaging
export const messaging = getApp().name !== '[DEFAULT]' ? null : getMessaging(app);

// Funkcja do uzyskania tokenu FCM
export const requestNotificationPermission = async () => {
  try {
    if (!messaging) return null;
    
    const permission = await Notification.requestPermission();
    if (permission !== 'granted') {
      console.log('Brak uprawnień do powiadomień');
      return null;
    }
    
    // Define VAPID key
    // You can use a direct value if environment variables are not loading correctly
    const vapidKey = import.meta.env.VITE_FIREBASE_VAPID_KEY;
    
    if (!vapidKey || vapidKey === 'undefined') {
      console.error('Brak poprawnego klucza VAPID. Sprawdź zmienną VITE_FIREBASE_VAPID_KEY w pliku .env');
      return null;
    }

    console.log("Using VAPID key:", vapidKey);
    
    // Get registration token
    const currentToken = await getToken(messaging, {
      vapidKey: vapidKey
    });
    
    if (currentToken) {
      console.log('Token powiadomień uzyskany', currentToken);
      return currentToken;
    } else {
      console.log('Nie można uzyskać tokenu');
      return null;
    }
  } catch (error) {
    console.error('Błąd uzyskiwania tokenu:', error);
    
    // Provide more detailed error information for debugging
    if (error.name === 'InvalidAccessError') {
      console.error('Błędny format klucza VAPID. Klucz musi być w formacie base64url.');
    }
    
    return null;
  }
};

// Funkcja do nasłuchiwania powiadomień
export const onMessageListener = () => {
  return new Promise((resolve) => {
    if (!messaging) {
      resolve(null);
      return;
    }
    
    onMessage(messaging, (payload) => {
      resolve(payload);
    });
  });
};

export { db, auth, firebaseConfig };