// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBXmz9AIc2z7G47TjFwDzY1j2Dz3i58Rwo",
  authDomain: "depotter-college-of-health.firebaseapp.com",
  projectId: "depotter-college-of-health",
  storageBucket: "depotter-college-of-health.firebasestorage.app",
  messagingSenderId: "1013814083395",
  appId: "1:1013814083395:web:9012a3572aa8b6d5bfb9f6",
  measurementId: "G-13HDQG8TLZ"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export { db };
