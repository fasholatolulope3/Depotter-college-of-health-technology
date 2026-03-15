// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDdFX4lpFuq7HYe92F-vhUl484t2H8-6bg",
  authDomain: "pharmacy-awards.firebaseapp.com",
  projectId: "pharmacy-awards",
  storageBucket: "pharmacy-awards.firebasestorage.app",
  messagingSenderId: "928734939848",
  appId: "1:928734939848:web:21da4e5203850f6c4873fd",
  measurementId: "G-Q1M5RDZNJM"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export { db };
