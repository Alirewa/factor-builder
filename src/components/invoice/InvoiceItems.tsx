'use client';

import { useInvoiceStore } from '@/store/invoiceStore';
import { SectionCard } from '@/components/ui/SectionCard';
import { formatCurrency } from '@/lib/utils';
import { Plus, Trash2, ShoppingCart } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { InvoiceItem } from '@/types/invoice';

function ItemRow({ item, index }: { item: InvoiceItem; index: number }) {
  const { updateItem, removeItem } = useInvoiceStore();

  return (
    <motion.div
      initial={{ opacity: 0, y: -8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, height: 0, marginBottom: 0 }}
      transition={{ duration: 0.18 }}
      className="border-b border-gray-50 dark:border-slate-700/40 last:border-0 py-2.5"
    >
      {/* Row: number + name + delete */}
      <div className="flex items-start gap-2 mb-2">
        <span className="w-5 flex-shrink-0 text-center text-[11px] text-gray-400 dark:text-slate-500 font-medium mt-2.5">
          {index + 1}
        </span>
        <div className="flex-1">
          <input
            className="input text-sm"
            value={item.name}
            onChange={(e) => updateItem(item.id, { name: e.target.value })}
            placeholder="نام کالا / سرویس"
          />
        </div>
        <button
          onClick={() => removeItem(item.id)}
          className="mt-1 flex-shrink-0 p-1.5 rounded-lg text-gray-300 dark:text-slate-600 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
          title="حذف"
        >
          <Trash2 className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Row: qty + price + total — 3 cols, comfortable on all screen sizes */}
      <div className="grid grid-cols-3 gap-2 pr-7">
        {/* Quantity */}
        <div>
          <label className="label">تعداد</label>
          <input
            className="input text-xs text-center py-2"
            type="number"
            min="0"
            step="0.01"
            value={item.quantity || ''}
            onChange={(e) => updateItem(item.id, { quantity: parseFloat(e.target.value) || 0 })}
            placeholder="1"
            dir="ltr"
          />
        </div>

        {/* Unit price */}
        <div>
          <label className="label">
            <span className="hidden sm:inline">قیمت واحد (ریال)</span>
            <span className="sm:hidden">قیمت (ریال)</span>
          </label>
          <input
            className="input text-xs py-2"
            type="number"
            min="0"
            value={item.unitPrice || ''}
            onChange={(e) => updateItem(item.id, { unitPrice: parseFloat(e.target.value) || 0 })}
            placeholder="0"
            dir="ltr"
          />
        </div>

        {/* Row total */}
        <div>
          <label className="label">جمع</label>
          <div className="h-[38px] flex items-center justify-end px-2 rounded-lg bg-gray-50 dark:bg-slate-700/30 border border-gray-100 dark:border-slate-700">
            <span className="text-xs font-semibold text-gray-700 dark:text-slate-300 tabular-nums">
              {formatCurrency(item.total)}
            </span>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

const MAX_ITEMS = 10;

export function InvoiceItems() {
  const { invoice, addItem } = useInvoiceStore();
  const atLimit = invoice.items.length >= MAX_ITEMS;

  return (
    <SectionCard title="اقلام فاکتور" icon={<ShoppingCart className="w-4 h-4" />}>
      <AnimatePresence initial={false}>
        {invoice.items.map((item, index) => (
          <ItemRow key={item.id} item={item} index={index} />
        ))}
      </AnimatePresence>

      {invoice.items.length === 0 && (
        <div className="py-10 text-center">
          <div className="w-12 h-12 bg-gray-100 dark:bg-slate-700/60 rounded-full flex items-center justify-center mx-auto mb-3">
            <ShoppingCart className="w-5 h-5 text-gray-300 dark:text-slate-500" />
          </div>
          <p className="text-sm text-gray-400 dark:text-slate-500">هنوز کالایی اضافه نشده</p>
          <p className="text-xs text-gray-300 dark:text-slate-600 mt-1">روی دکمه زیر کلیک کنید</p>
        </div>
      )}

      <div className={invoice.items.length > 0 ? 'mt-3 pt-3 border-t border-gray-100 dark:border-slate-700/60' : 'mt-2'}>
        <div className="flex items-center gap-3">
          <button
            onClick={addItem}
            disabled={atLimit}
            className="btn-secondary text-xs w-full sm:w-auto disabled:opacity-40 disabled:cursor-not-allowed"
          >
            <Plus className="w-4 h-4" />
            افزودن ردیف
          </button>
          <span className={`text-xs tabular-nums ${atLimit ? 'text-amber-500 dark:text-amber-400 font-medium' : 'text-gray-400 dark:text-slate-500'}`}>
            {invoice.items.length} / {MAX_ITEMS}
            {atLimit && ' — حداکثر'}
          </span>
        </div>
      </div>
    </SectionCard>
  );
}
