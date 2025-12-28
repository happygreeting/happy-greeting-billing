import { db } from "../firebase";
import { 
  collection, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  doc, 
  query, 
  onSnapshot, 
  orderBy,
  Timestamp,
  where
} from "firebase/firestore";
import { Invoice } from "../types";

const COLLECTION_NAME = "invoices";

// Real-time listener for invoices
export const subscribeToInvoices = (onUpdate: (invoices: Invoice[]) => void) => {
  const q = query(collection(db, COLLECTION_NAME), orderBy("date", "desc"));
  
  return onSnapshot(q, (querySnapshot) => {
    const invoices: Invoice[] = [];
    querySnapshot.forEach((doc) => {
      const data = doc.data();
      // Convert Firestore Timestamp to string for UI
      invoices.push({
        ...data,
        id: doc.id,
        createdAt: data.createdAt
      } as Invoice);
    });
    onUpdate(invoices);
  });
};

export const createInvoice = async (
  invoice: Omit<Invoice, "id">
) => {
  await addDoc(collection(db, COLLECTION_NAME), {
    ...invoice,
    createdAt: Timestamp.now(),
    updatedAt: Timestamp.now()
  });
};
};

export const updateInvoice = async (id: string, invoice: Partial<Invoice>) => {
  const docRef = doc(db, COLLECTION_NAME, id);
  await updateDoc(docRef, {
    ...invoice,
    updatedAt: Timestamp.now()
  });
};

export const deleteInvoice = async (id: string) => {
  await deleteDoc(doc(db, COLLECTION_NAME, id));
};
