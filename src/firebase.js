import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";

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

export { db, auth, firebaseConfig };