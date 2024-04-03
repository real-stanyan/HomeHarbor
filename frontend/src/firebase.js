// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_APIKEY,
  authDomain: "home-harbor-91ac5.firebaseapp.com",
  projectId: "home-harbor-91ac5",
  storageBucket: "home-harbor-91ac5.appspot.com",
  messagingSenderId: "283774915029",
  appId: "1:283774915029:web:c8da63c4ce6eda6c7fad5c",
  measurementId: "G-3X9VHPFRM9",
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
