export interface InvoiceItem {
  id: string;
  name: string;
  quantity: number;
  unitPrice: number;
  discount: number;
  total: number;
}

export interface PartyInfo {
  name: string;
  company: string;
  address: string;
  phone: string;
  email: string;
  nationalId: string;
}

export interface InvoiceSignature {
  stampImage: string | null;
  signatureImage: string | null;
}

export type InvoiceTemplate = 'formal' | 'corporate' | 'modern' | 'minimal';
export type ThemeMode = 'light' | 'dark';
export type InvoiceType = 'sale' | 'purchase' | 'proforma';

export const INVOICE_TYPE_LABELS: Record<InvoiceType, string> = {
  sale:     'فاکتور فروش',
  purchase: 'فاکتور خرید',
  proforma: 'پیش‌فاکتور',
};

export interface InvoiceCustomization {
  primaryColor: string;
  logoImage: string | null;   // lives here for template rendering
  fontSize: 'sm' | 'md' | 'lg';
  showTax: boolean;
  showDiscount: boolean;
  showNotes: boolean;
  showSignature: boolean;
  showStamp: boolean;
  template: InvoiceTemplate;
}

export interface InvoiceData {
  invoiceNumber: string;
  invoiceDate: string;
  dueDate: string;
  invoiceType: InvoiceType;
  seller: PartyInfo;
  buyer: PartyInfo;
  items: InvoiceItem[];
  taxRate: number;
  globalDiscount: number;
  notes: string;
  signature: InvoiceSignature;
  customization: InvoiceCustomization;
}

export interface InvoiceTotals {
  subtotal: number;
  itemDiscounts: number;
  globalDiscountAmount: number;
  taxAmount: number;
  total: number;
}

// ─── Seller profile (save/load seller info + assets) ──────────────────────────
export interface SavedProfile {
  id: string;
  name: string;
  seller: PartyInfo;
  stampImage: string | null;
  signatureImage: string | null;
  logoImage: string | null;
  primaryColor: string;
  createdAt: number;
}

// ─── Saved invoice (local invoice list, max 10) ───────────────────────────────
export interface SavedInvoice {
  id: string;
  label: string;              // auto: "شماره × — خریدار ×"
  invoiceNumber: string;
  invoiceDate: string;
  invoiceType: InvoiceType;
  buyerName: string;          // for quick display
  total: number;
  data: InvoiceData;          // full snapshot
  savedAt: number;
}

export const MAX_SAVED_INVOICES = 10;
