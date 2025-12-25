export interface LineItem {
  id: string;
  description: string;
  quantity: number;
  rate: number;
  productId?: string;
}

export interface Invoice {
  id: string;
  invoiceNumber: string;
  date: string;
  customerName: string;
  customerPhone?: string;
  officeNo?: string;
  msmeNo?: string;
  items: LineItem[];
  extraCharges?: number; // For Revision Fee etc.
  extraChargesLabel?: string; // e.g. "Design Fee"
  amountPaid: number; // This is the total amount paid (Advance + any later payment)
  totalAmount: number; // Derived usually, but good to store for snapshots
  email?: string;
  address?: string; // Customer Address
  status: 'PAID' | 'PARTIAL' | 'UNPAID';
}

export type ProductType = 'READYMADE' | 'PERSONALIZED';

export interface Product {
  id: string;
  name: string;
  type: ProductType;
  price: number;
  description?: string;
}

export interface AppSettings {
  companyName: string;
  tagline: string;
  logoUrl?: string; // Base64 or URL
  officeAddress: string;
  officePhone: string;
  email: string;
  msmeNo: string;
  upiId: string;
  footerMessage?: string;
  subFooterMessage?: string;
  googleReviewUrl?: string;
}

export type UserRole = 'ADMIN' | 'EMPLOYEE';

export interface User {
  id: string;
  name: string;
  email: string;
  password: string; // In a real app, this should be hashed. For local-only, plain text is stored.
  role: UserRole;
}

export enum ViewState {
  DASHBOARD = 'DASHBOARD',
  INVOICE_LIST = 'INVOICE_LIST',
  INVOICE_CREATE = 'INVOICE_CREATE',
  INVOICE_EDIT = 'INVOICE_EDIT',
  INVENTORY = 'INVENTORY',
  SETTINGS = 'SETTINGS',
}