
import { initializeApp, getApps, getApp } from "firebase/app";
import { getAnalytics, isSupported } from "firebase/analytics";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBgWZloc08fbMwnojQ4n4wkgoN9892wnFk",
  authDomain: "nexusos-57979.firebaseapp.com",
  projectId: "nexusos-57979",
  storageBucket: "nexusos-57979.firebasestorage.app",
  messagingSenderId: "654054320210",
  appId: "1:654054320210:web:d2c6ffff5d9b027c65578b",
  measurementId: "G-W9JEFFDSQ7"
};

// Initialize Firebase
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();

import { getStorage } from "firebase/storage";

// Initialize services
const db = getFirestore(app);
const auth = getAuth(app);
const storage = getStorage(app);
import { GoogleAuthProvider } from "firebase/auth";
const googleProvider = new GoogleAuthProvider();

// Analytics only runs on the client side
let analytics;
if (typeof window !== "undefined") {
  isSupported().then((supported) => {
    if (supported) {
      analytics = getAnalytics(app);
    }
  });
}

export { app, db, auth, analytics, storage, googleProvider };
