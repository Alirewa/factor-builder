'use client';

import { useInvoiceStore } from '@/store/invoiceStore';
import { SectionCard } from '@/components/ui/SectionCard';
import { FormField } from '@/components/ui/FormField';
import { formatCurrency } from '@/lib/utils';
import { Calculator } from 'lucide-react';

export function InvoiceTotals() {
  const { invoice, totals, updateInvoice } = useInvoiceStore();

  return (
    <SectionCard title="محاسبات و جمع کل" icon={<Calculator className="w-4 h-4" />}>
      {/* Tax & discount inputs */}
      <div className="grid grid-cols-2 gap-3 mb-4">
        <FormField label="نرخ مالیات (%)">
          <div className="relative">
            <input
              className="input pl-7 text-sm"
              type="number"
              min="0"
              max="100"
              value={invoice.taxRate}
              onChange={(e) => updateInvoice({ taxRate: parseFloat(e.target.value) || 0 })}
              dir="ltr"
            />
            <span className="absolute left-2.5 top-1/2 -translate-y-1/2 text-xs text-gray-400">%</span>
          </div>
        </FormField>

        <FormField label="تخفیف کلی (%)">
          <div className="relative">
            <input
              className="input pl-7 text-sm"
              type="number"
              min="0"
              max="100"
              value={invoice.globalDiscount}
              onChange={(e) => updateInvoice({ globalDiscount: parseFloat(e.target.value) || 0 })}
              dir="ltr"
            />
            <span className="absolute left-2.5 top-1/2 -translate-y-1/2 text-xs text-gray-400">%</span>
          </div>
        </FormField>
      </div>

      {/* Totals summary card */}
      <div className="bg-gray-50 dark:bg-slate-700/25 rounded-xl p-4 space-y-2.5">
        <TotalRow label="جمع اقلام" value={totals.subtotal} />

        {totals.globalDiscountAmount > 0 && (
          <TotalRow
            label={`تخفیف کلی (${invoice.globalDiscount}%)`}
            value={totals.globalDiscountAmount}
            type="discount"
          />
        )}
        {totals.taxAmount > 0 && (
          <TotalRow
            label={`مالیات (${invoice.taxRate}%)`}
            value={totals.taxAmount}
            type="tax"
          />
        )}

        <div className="pt-2.5 mt-1 border-t border-gray-200 dark:border-slate-600 flex items-center justify-between">
          <span className="text-sm font-bold text-gray-900 dark:text-slate-100">قابل پرداخت</span>
          <div className="flex items-baseline gap-1">
            <span className="text-xl font-bold text-blue-600 dark:text-blue-400 tabular-nums">
              {formatCurrency(totals.total)}
            </span>
            <span className="text-xs text-gray-400 dark:text-slate-500">ریال</span>
          </div>
        </div>
      </div>

      {/* Notes */}
      <div className="mt-4 pt-4 border-t border-gray-100 dark:border-slate-700/60">
        <FormField label="توضیحات">
          <textarea
            className="input resize-none text-sm"
            rows={3}
            value={invoice.notes}
            onChange={(e) => updateInvoice({ notes: e.target.value })}
            placeholder="توضیحات، شرایط پرداخت، قوانین و..."
          />
        </FormField>
      </div>
    </SectionCard>
  );
}

function TotalRow({
  label,
  value,
  type,
}: {
  label: string;
  value: number;
  type?: 'discount' | 'tax';
}) {
  const color =
    type === 'discount'
      ? 'text-emerald-600 dark:text-emerald-400'
      : type === 'tax'
      ? 'text-orange-500 dark:text-orange-400'
      : 'text-gray-700 dark:text-slate-300';

  return (
    <div className="flex items-center justify-between text-sm">
      <span className="text-gray-500 dark:text-slate-400 text-xs sm:text-sm">{label}</span>
      <span className={`tabular-nums font-medium text-xs sm:text-sm ${color}`}>
        {type === 'discount' ? '−' : type === 'tax' ? '+' : ''}
        {formatCurrency(value)} <span className="text-gray-400 dark:text-slate-500 font-normal">ریال</span>
      </span>
    </div>
  );
}
