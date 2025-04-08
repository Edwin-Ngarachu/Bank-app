// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAqQyLF2E8X_h40Hj7p-YMiUQLvKAT2waw",
  authDomain: "bank-app-1c06b.firebaseapp.com",
  projectId: "bank-app-1c06b",
  storageBucket: "bank-app-1c06b.firebasestorage.app",
  messagingSenderId: "991989052004",
  appId: "1:991989052004:web:0dbe7ac0ad0404da226571"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);