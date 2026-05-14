'use client';

import { useEffect, useRef } from 'react';
import { useInvoiceStore } from '@/store/invoiceStore';
import toast from 'react-hot-toast';

export function useAutoSave(intervalMs = 30000) {
  const invoice = useInvoiceStore((s) => s.invoice);
  const lastSaved = useRef<string>('');
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    const current = JSON.stringify(invoice);
    if (current === lastSaved.current) return;

    if (timerRef.current) clearInterval(timerRef.current);

    timerRef.current = setInterval(() => {
      const latest = JSON.stringify(useInvoiceStore.getState().invoice);
      if (latest !== lastSaved.current) {
        lastSaved.current = latest;
        // Zustand persist handles the actual save — this just shows feedback
        toast('ذخیره شد', {
          icon: '💾',
          duration: 1500,
          style: { fontSize: '12px', padding: '8px 14px' },
        });
      }
    }, intervalMs);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [invoice, intervalMs]);
}
