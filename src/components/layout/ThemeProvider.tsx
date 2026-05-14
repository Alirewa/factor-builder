'use client';

import { useEffect } from 'react';
import { useInvoiceStore } from '@/store/invoiceStore';

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const theme = useInvoiceStore((s) => s.theme);

  useEffect(() => {
    const root = document.documentElement;
    if (theme === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
  }, [theme]);

  return <>{children}</>;
}
