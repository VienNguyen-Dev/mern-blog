// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY, //Trong Vite thì ta sử dựng import.meta.env còn trong react thì ta sử dụng process.env
  authDomain: "mern--blog-efff9.firebaseapp.com",
  projectId: "mern--blog-efff9",
  storageBucket: "mern--blog-efff9.appspot.com",
  messagingSenderId: "812915102495",
  appId: "1:812915102495:web:16d07d71ebecbdceae962a"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);