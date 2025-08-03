// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBxp0XPoBrKcdicwnfes0YRatzRIP9RA3o",
  authDomain: "chat-boot-829dc.firebaseapp.com",
  projectId: "chat-boot-829dc",
  storageBucket: "chat-boot-829dc.firebasestorage.app",
  messagingSenderId: "40256153900",
  appId: "1:40256153900:web:b8ca0761997817528f6489",
  measurementId: "G-HCH5QLCRPL"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);