import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyD5bZtc2AmaP_p3aYzL6F-Zk79162csOYQ",
  authDomain: "happy-greeting-billing.firebaseapp.com",
  projectId: "happy-greeting-billing",
  storageBucket: "happy-greeting-billing.appspot.com",
  messagingSenderId: "853948169436",
  appId: "1:853948169436:web:6f611f6d18ac3e09238819"
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);
