import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { InvoiceItem, InvoiceTotals } from '@/types/invoice';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('fa-IR').format(Math.round(amount));
}

export function calculateItemTotal(item: Omit<InvoiceItem, 'id' | 'total'>): number {
  const base = item.quantity * item.unitPrice;
  const discountAmount = (base * item.discount) / 100;
  return base - discountAmount;
}

export function calculateTotals(
  items: InvoiceItem[],
  taxRate: number,
  globalDiscount: number
): InvoiceTotals {
  const subtotal = items.reduce((sum, item) => sum + item.quantity * item.unitPrice, 0);
  const itemDiscounts = items.reduce((sum, item) => {
    return sum + (item.quantity * item.unitPrice * item.discount) / 100;
  }, 0);
  const afterItemDiscounts = subtotal - itemDiscounts;
  const globalDiscountAmount = (afterItemDiscounts * globalDiscount) / 100;
  const afterAllDiscounts = afterItemDiscounts - globalDiscountAmount;
  const taxAmount = (afterAllDiscounts * taxRate) / 100;
  const total = afterAllDiscounts + taxAmount;

  return {
    subtotal,
    itemDiscounts,
    globalDiscountAmount,
    taxAmount,
    total,
  };
}

export function generateInvoiceNumber(): string {
  const now = new Date();
  const year = now.getFullYear().toString().slice(-2);
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');
  const rand = String(Math.floor(Math.random() * 9000) + 1000);
  return `INV-${year}${month}${day}-${rand}`;
}

export function getTodayDate(): string {
  const now = new Date();
  return now.toISOString().split('T')[0];
}

export function toJalali(date: string): string {
  if (!date) return '';
  try {
    const d = new Date(date);
    return new Intl.DateTimeFormat('fa-IR', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
    }).format(d);
  } catch {
    return date;
  }
}

export function fileToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

export function validateImageFile(file: File): string | null {
  const allowedTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/svg+xml'];
  const maxSize = 2 * 1024 * 1024;
  if (!allowedTypes.includes(file.type)) return 'فرمت تصویر باید JPG، PNG، WEBP یا SVG باشد';
  if (file.size > maxSize) return 'حجم تصویر نباید بیشتر از ۲ مگابایت باشد';
  return null;
}
