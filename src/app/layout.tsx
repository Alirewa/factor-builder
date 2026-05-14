import type { Metadata, Viewport } from 'next';
import './globals.css';
import { ThemeProvider } from '@/components/layout/ThemeProvider';
import { StoreHydrator } from '@/components/layout/StoreHydrator';
import { Toaster } from 'react-hot-toast';

export const metadata: Metadata = {
  title: 'فاکتور ساز آنلاین | ساخت فاکتور حرفه‌ای رایگان',
  description: 'با فاکتور ساز آنلاین به صورت رایگان فاکتورهای حرفه‌ای فارسی بسازید، PDF دانلود کنید و چاپ کنید.',
  keywords: 'فاکتور ساز, فاکتور آنلاین, فاکتور فارسی, ساخت فاکتور, صورتحساب',
  manifest: '/manifest.json',
  icons: { icon: '/icons/icon-192.png', apple: '/icons/icon-192.png' },
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fa" dir="rtl" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://cdn.jsdelivr.net" crossOrigin="anonymous" />
      </head>
      <body suppressHydrationWarning>
        <ThemeProvider>
          <StoreHydrator />
          {children}
          <Toaster
            position="bottom-center"
            toastOptions={{
              duration: 3000,
              style: {
                fontFamily: 'Vazirmatn, sans-serif',
                direction: 'rtl',
                borderRadius: '10px',
                fontSize: '14px',
              },
            }}
          />
        </ThemeProvider>
      </body>
    </html>
  );
}
