import {
  collection,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  onSnapshot,
  query,
  orderBy,
  serverTimestamp,
} from "firebase/firestore";
import { db } from "../firebase";
import { Invoice } from "../types";

const invoicesRef = collection(db, "invoices");

/**
 * LIVE SUBSCRIBE (REAL SYNC)
 */
export const subscribeToInvoices = (
  callback: (invoices: Invoice[]) => void
) => {
  const q = query(invoicesRef, orderBy("createdAt", "desc"));

  return onSnapshot(q, (snapshot) => {
    const invoices: Invoice[] = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...(doc.data() as Invoice),
    }));

    callback(invoices);
  });
};

/**
 * CREATE INVOICE
 */
export const createInvoice = async (invoice: Invoice) => {
  await addDoc(invoicesRef, {
    ...invoice,
    createdAt: serverTimestamp(),
  });
};

/**
 * UPDATE INVOICE
 */
export const updateInvoice = async (id: string, invoice: Partial<Invoice>) => {
  const ref = doc(db, "invoices", id);
  await updateDoc(ref, invoice);
};

/**
 * DELETE INVOICE
 */
export const deleteInvoice = async (id: string) => {
  const ref = doc(db, "invoices", id);
  await deleteDoc(ref);
};
