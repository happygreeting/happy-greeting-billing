import { auth, db } from "../firebase";
import { 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  signOut, 
  User as FirebaseUser 
} from "firebase/auth";
import { doc, setDoc, getDoc } from "firebase/firestore";
import { User, UserRole } from "../types";

export const loginUser = async (email: string, password: string) => {
  const userCredential = await signInWithEmailAndPassword(auth, email, password);
  return userCredential.user;
};

export const registerUser = async (email: string, password: string, name: string) => {
  const userCredential = await createUserWithEmailAndPassword(auth, email, password);
  const firebaseUser = userCredential.user;

  // Create a user document in Firestore to store role/name
  const userData: User = {
    id: firebaseUser.uid,
    name: name,
    email: email,
    role: 'ADMIN' // Default to Admin for first user, change manually in DB for employees
  };

  await setDoc(doc(db, "users", firebaseUser.uid), userData);
  return firebaseUser;
};

export const logoutUser = async () => {
  await signOut(auth);
};

export const getUserProfile = async (uid: string): Promise<User | null> => {
  const docRef = doc(db, "users", uid);
  const docSnap = await getDoc(docRef);
  if (docSnap.exists()) {
    return docSnap.data() as User;
  }
  return null;
};