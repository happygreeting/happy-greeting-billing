import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getAnalytics } from "firebase/analytics";

// Your web app's Firebase configuration
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
export const auth = getAuth(app);
export const db = getFirestore(app);
export const analytics = getAnalytics(app);