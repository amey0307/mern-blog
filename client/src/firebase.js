// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: "mern-auth-af6f0.firebaseapp.com",
  projectId: "mern-auth-af6f0",
  storageBucket: "mern-auth-af6f0.appspot.com",
  messagingSenderId: "670798417130",
  appId: "1:670798417130:web:2133b7f7af537a8817db93"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);