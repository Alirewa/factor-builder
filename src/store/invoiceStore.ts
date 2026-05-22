import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import {
  InvoiceData, InvoiceItem, InvoiceTotals, ThemeMode,
  SavedProfile, SavedInvoice, MAX_SAVED_INVOICES, INVOICE_TYPE_LABELS,
} from '@/types/invoice';
import { calculateTotals, calculateItemTotal, generateInvoiceNumber, getTodayDate, fileToBase64 } from '@/lib/utils';

const defaultInvoice: InvoiceData = {
  invoiceNumber: '', // generated lazily on client to avoid SSR/client hydration mismatch
  invoiceDate: '',   // same — filled by initInvoice() after rehydration
  dueDate: '',
  invoiceType: 'sale',
  seller: { name: '', company: '', address: '', phone: '', email: '', nationalId: '' },
  buyer:  { name: '', company: '', address: '', phone: '', email: '', nationalId: '' },
  items: [],
  taxRate: 9,
  globalDiscount: 0,
  notes: '',
  signature: { stampImage: null, signatureImage: null },
  customization: {
    primaryColor: '#2563eb',
    logoImage: null,
    fontSize: 'md',
    showTax: true,
    showDiscount: true,
    showNotes: true,
    showSignature: true,
    showStamp: true,
    template: 'modern',
    showFooter: false,
    footerText: '',
  },
};

interface InvoiceStore {
  invoice: InvoiceData;
  totals: InvoiceTotals;
  theme: ThemeMode;
  isCustomizationOpen: boolean;
  isResetModalOpen: boolean;
  isInvoiceListOpen: boolean;
  savedProfiles: SavedProfile[];
  savedInvoices: SavedInvoice[];

  // Invoice CRUD
  updateInvoice: (data: Partial<InvoiceData>) => void;
  updateSeller:  (data: Partial<InvoiceData['seller']>) => void;
  updateBuyer:   (data: Partial<InvoiceData['buyer']>) => void;
  addItem:    () => void;
  updateItem: (id: string, data: Partial<Omit<InvoiceItem, 'id' | 'total'>>) => void;
  removeItem: (id: string) => void;
  updateCustomization: (data: Partial<InvoiceData['customization']>) => void;
  updateSignature:     (data: Partial<InvoiceData['signature']>) => void;
  resetInvoice: () => void;

  // Lifecycle
  initInvoice: () => void;   // call once on client mount after rehydration

  // UI
  setTheme: (t: ThemeMode) => void;
  toggleCustomization: () => void;
  toggleResetModal:    () => void;
  toggleInvoiceList:   () => void;

  // Seller profile actions
  saveProfile:   (name: string) => SavedProfile;
  loadProfile:   (id: string) => void;
  deleteProfile: (id: string) => void;

  // Presets
  loadBimfaPreset: () => Promise<void>;

  // Saved invoice actions (max 10)
  saveCurrentInvoice:  () => SavedInvoice | null;
  loadSavedInvoice:    (id: string) => void;
  deleteSavedInvoice:  (id: string) => void;
  updateSavedInvoice:  (id: string) => void;   // overwrite with current data
}

function recalc(inv: InvoiceData): InvoiceTotals {
  return calculateTotals(inv.items, inv.taxRate, inv.globalDiscount);
}

function makeInvoiceLabel(inv: InvoiceData, totals: InvoiceTotals): string {
  const type = INVOICE_TYPE_LABELS[inv.invoiceType];
  const buyer = inv.buyer.company || inv.buyer.name || 'بدون خریدار';
  return `${type} — ${buyer}`;
}

export const useInvoiceStore = create<InvoiceStore>()(
  persist(
    (set, get) => ({
      invoice: defaultInvoice,
      totals:  recalc(defaultInvoice),
      theme:   'light',
      isCustomizationOpen: false,
      isResetModalOpen:    false,
      isInvoiceListOpen:   false,
      savedProfiles: [],
      savedInvoices: [],

      updateInvoice: (data) =>
        set((s) => { const u = { ...s.invoice, ...data }; return { invoice: u, totals: recalc(u) }; }),

      updateSeller: (data) =>
        set((s) => ({ invoice: { ...s.invoice, seller: { ...s.invoice.seller, ...data } } })),

      updateBuyer: (data) =>
        set((s) => ({ invoice: { ...s.invoice, buyer: { ...s.invoice.buyer, ...data } } })),

      addItem: () =>
        set((s) => {
          const item: InvoiceItem = { id: crypto.randomUUID(), name: '', quantity: 1, unitPrice: 0, discount: 0, total: 0 };
          const u = { ...s.invoice, items: [...s.invoice.items, item] };
          return { invoice: u, totals: recalc(u) };
        }),

      updateItem: (id, data) =>
        set((s) => {
          const items = s.invoice.items.map((it) => {
            if (it.id !== id) return it;
            const m = { ...it, ...data };
            return { ...m, total: calculateItemTotal(m) };
          });
          const u = { ...s.invoice, items };
          return { invoice: u, totals: recalc(u) };
        }),

      removeItem: (id) =>
        set((s) => {
          const u = { ...s.invoice, items: s.invoice.items.filter((i) => i.id !== id) };
          return { invoice: u, totals: recalc(u) };
        }),

      updateCustomization: (data) =>
        set((s) => ({ invoice: { ...s.invoice, customization: { ...s.invoice.customization, ...data } } })),

      updateSignature: (data) =>
        set((s) => ({ invoice: { ...s.invoice, signature: { ...s.invoice.signature, ...data } } })),

      // ── Init (called once on client after rehydration) ──────────────────────
      initInvoice: () => {
        const { invoice } = get();
        const updates: Partial<InvoiceData> = {};
        if (!invoice.invoiceNumber) updates.invoiceNumber = generateInvoiceNumber();
        if (!invoice.invoiceDate) updates.invoiceDate = getTodayDate();
        if (Object.keys(updates).length > 0) {
          set((s) => {
            const u = { ...s.invoice, ...updates };
            return { invoice: u, totals: recalc(u) };
          });
        }
      },

      resetInvoice: () => {
        const fresh = { ...defaultInvoice, invoiceNumber: generateInvoiceNumber(), invoiceDate: getTodayDate() };
        set({ invoice: fresh, totals: recalc(fresh), isResetModalOpen: false });
      },

      // ── BIMFA preset ───────────────────────────────────────────────────────
      loadBimfaPreset: async () => {
        let logoImage: string | null = null;
        try {
          const res = await fetch('/presets/bimfa-logo.png');
          if (res.ok) {
            const blob = await res.blob();
            logoImage = await fileToBase64(blob as File);
          }
        } catch { /* logo not found — user can upload manually */ }

        set((s) => ({
          invoice: {
            ...s.invoice,
            seller: {
              company: 'گروه بیم فا',
              name: '',
              phone: '+98 911 145 4518 پورغلام',
              address: 'کیش، گلدیس، وصال 1، ساختمان اداری ایران، طبقه دوم، واحد 13',
              email: '',
              nationalId: '',
            },
            customization: {
              ...s.invoice.customization,
              primaryColor: '#1d6fe8',
              showFooter: true,
              footerText: 'آدرس: کیش، گلدیس، وصال ۱، ساختمان اداری ایران، طبقه دوم، واحد ۱۳  |  تلفن: ۰۹۱۱۱۴۵۴۵۱۸ پورغلام',
              ...(logoImage ? { logoImage } : {}),
            },
          },
        }));
      },

      setTheme: (theme) => set({ theme }),
      toggleCustomization: () => set((s) => ({ isCustomizationOpen: !s.isCustomizationOpen })),
      toggleResetModal:    () => set((s) => ({ isResetModalOpen:    !s.isResetModalOpen })),
      toggleInvoiceList:   () => set((s) => ({ isInvoiceListOpen:   !s.isInvoiceListOpen })),

      // ── Seller profiles ────────────────────────────────────────────────────
      saveProfile: (name) => {
        const { invoice } = get();
        const profile: SavedProfile = {
          id: crypto.randomUUID(),
          name: name.trim(),
          seller:         { ...invoice.seller },
          stampImage:     invoice.signature.stampImage,
          signatureImage: invoice.signature.signatureImage,
          logoImage:      invoice.customization.logoImage,
          primaryColor:   invoice.customization.primaryColor,
          createdAt: Date.now(),
        };
        set((s) => ({ savedProfiles: [...s.savedProfiles, profile] }));
        return profile;
      },

      loadProfile: (id) => {
        const p = get().savedProfiles.find((x) => x.id === id);
        if (!p) return;
        set((s) => ({
          invoice: {
            ...s.invoice,
            seller:    { ...p.seller },
            signature: { ...s.invoice.signature, stampImage: p.stampImage, signatureImage: p.signatureImage },
            customization: { ...s.invoice.customization, logoImage: p.logoImage, primaryColor: p.primaryColor },
          },
        }));
      },

      deleteProfile: (id) =>
        set((s) => ({ savedProfiles: s.savedProfiles.filter((p) => p.id !== id) })),

      // ── Saved invoices ─────────────────────────────────────────────────────
      saveCurrentInvoice: () => {
        const { invoice, totals, savedInvoices } = get();
        if (savedInvoices.length >= MAX_SAVED_INVOICES) return null; // caller shows error

        const si: SavedInvoice = {
          id: crypto.randomUUID(),
          label:         makeInvoiceLabel(invoice, totals),
          invoiceNumber: invoice.invoiceNumber,
          invoiceDate:   invoice.invoiceDate,
          invoiceType:   invoice.invoiceType,
          buyerName:     invoice.buyer.company || invoice.buyer.name || '—',
          total:         totals.total,
          data:          JSON.parse(JSON.stringify(invoice)), // deep clone
          savedAt:       Date.now(),
        };
        set((s) => ({ savedInvoices: [si, ...s.savedInvoices] }));
        return si;
      },

      loadSavedInvoice: (id) => {
        const si = get().savedInvoices.find((x) => x.id === id);
        if (!si) return;
        const inv = JSON.parse(JSON.stringify(si.data)) as InvoiceData;
        set({ invoice: inv, totals: recalc(inv), isInvoiceListOpen: false });
      },

      deleteSavedInvoice: (id) =>
        set((s) => ({ savedInvoices: s.savedInvoices.filter((i) => i.id !== id) })),

      updateSavedInvoice: (id) => {
        const { invoice, totals } = get();
        set((s) => ({
          savedInvoices: s.savedInvoices.map((si) =>
            si.id !== id
              ? si
              : {
                  ...si,
                  label:         makeInvoiceLabel(invoice, totals),
                  invoiceNumber: invoice.invoiceNumber,
                  invoiceDate:   invoice.invoiceDate,
                  invoiceType:   invoice.invoiceType,
                  buyerName:     invoice.buyer.company || invoice.buyer.name || '—',
                  total:         totals.total,
                  data:          JSON.parse(JSON.stringify(invoice)),
                  savedAt:       Date.now(),
                }
          ),
        }));
      },
    }),
    {
      name: 'factor-saz-v2',
      storage: createJSONStorage(() => localStorage),
      skipHydration: true, // prevents SSR/client mismatch from non-deterministic defaults
      partialize: (s) => ({
        invoice:       s.invoice,
        theme:         s.theme,
        savedProfiles: s.savedProfiles,
        savedInvoices: s.savedInvoices,
      }),
    }
  )
);
