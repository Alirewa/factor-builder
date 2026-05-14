'use client';

import { useEffect } from 'react';
import { useInvoiceStore } from '@/store/invoiceStore';

/**
 * Triggers Zustand persist rehydration from localStorage after the client
 * mounts, then initialises any values that must not run on the server
 * (invoice number, today's date). This avoids SSR ↔ client hydration mismatches
 * caused by Math.random() / Date.now() being called at module load time.
 */
export function StoreHydrator() {
  useEffect(() => {
    // Manually rehydrate — store was created with skipHydration: true
    useInvoiceStore.persist.rehydrate();
    // localStorage is synchronous, so the store is fully loaded now.
    // Generate invoice number / date if they were empty (first visit or reset).
    useInvoiceStore.getState().initInvoice();
  }, []);

  return null;
}
