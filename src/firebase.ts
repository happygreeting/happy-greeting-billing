// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyD5bztc2AmaP_p3aYLz6F-Zk79I62scOYQ",
  authDomain: "happy-greeting-billing.firebaseapp.com",
  projectId: "happy-greeting-billing",
  storageBucket: "happy-greeting-billing.firebasestorage.app",
  messagingSenderId: "853948169436",
  appId: "1:853948169436:web:6f611f6d18ac3e09238819",
  measurementId: "G-6S5VXNKK3E"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
