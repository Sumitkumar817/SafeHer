// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth"; // 1. Add this line

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyD_8muWlXgAVt5LMBZhTdOY_mRMEFxiyO4",
  authDomain: "dhruvtara-web.firebaseapp.com",
  projectId: "dhruvtara-web",
  storageBucket: "dhruvtara-web.firebasestorage.app",
  messagingSenderId: "596946902656",
  appId: "1:596946902656:web:552af132ec0f84631a5065"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// 2. Add and export the auth service
export const auth = getAuth(app);