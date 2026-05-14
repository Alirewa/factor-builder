'use client';

import { useRef } from 'react';
import { useInvoiceStore } from '@/store/invoiceStore';
import { FormField } from '@/components/ui/FormField';
import { SectionCard } from '@/components/ui/SectionCard';
import { SellerProfileManager } from './SellerProfileManager';
import { User, Building2, Upload, X, Image as ImageIcon } from 'lucide-react';
import { fileToBase64, validateImageFile } from '@/lib/utils';
import toast from 'react-hot-toast';

interface PartyFormProps {
  type: 'seller' | 'buyer';
}

const labels = {
  seller: { title: 'اطلاعات فروشنده', icon: <Building2 className="w-4 h-4" /> },
  buyer:  { title: 'اطلاعات خریدار',  icon: <User className="w-4 h-4" /> },
};

export function PartyForm({ type }: PartyFormProps) {
  const { invoice, updateSeller, updateBuyer, updateCustomization } = useInvoiceStore();
  const data = invoice[type];
  const update = type === 'seller' ? updateSeller : updateBuyer;
  const { title, icon } = labels[type];
  const logoRef = useRef<HTMLInputElement>(null);

  const handleLogoUpload = async (file: File | undefined) => {
    if (!file) return;
    const err = validateImageFile(file);
    if (err) { toast.error(err); return; }
    try {
      const b64 = await fileToBase64(file);
      updateCustomization({ logoImage: b64 });
      toast.success('لوگو آپلود شد');
    } catch {
      toast.error('خطا در بارگذاری لوگو');
    }
  };

  return (
    <SectionCard title={title} icon={icon} collapsible defaultOpen={type === 'seller'}>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <FormField label="نام و نام خانوادگی">
          <input
            className="input"
            value={data.name}
            onChange={(e) => update({ name: e.target.value })}
            placeholder="علی محمدی"
          />
        </FormField>

        <FormField label="نام شرکت / سازمان">
          <input
            className="input"
            value={data.company}
            onChange={(e) => update({ company: e.target.value })}
            placeholder="شرکت نمونه"
          />
        </FormField>

        <FormField label="کد ملی / شناسه ملی">
          <input
            className="input"
            value={data.nationalId}
            onChange={(e) => update({ nationalId: e.target.value })}
            placeholder="0010000000"
            dir="ltr"
            inputMode="numeric"
          />
        </FormField>

        <FormField label="شماره تماس">
          <input
            className="input"
            value={data.phone}
            onChange={(e) => update({ phone: e.target.value })}
            placeholder="09123456789"
            dir="ltr"
            inputMode="tel"
          />
        </FormField>

        <FormField label="ایمیل">
          <input
            className="input"
            type="email"
            value={data.email}
            onChange={(e) => update({ email: e.target.value })}
            placeholder="example@email.com"
            dir="ltr"
          />
        </FormField>

        <FormField label="آدرس" className="sm:col-span-2">
          <textarea
            className="input resize-none"
            rows={2}
            value={data.address}
            onChange={(e) => update({ address: e.target.value })}
            placeholder="تهران، خیابان ولیعصر، پلاک ۱"
          />
        </FormField>
      </div>

      {/* Logo upload — only for seller */}
      {type === 'seller' && (
        <div className="mt-3 pt-3 border-t border-gray-100 dark:border-slate-700/60">
          <p className="text-[11px] text-gray-400 dark:text-slate-500 mb-2 flex items-center gap-1">
            <ImageIcon className="w-3 h-3" />
            لوگوی برند / شرکت
          </p>
          <input
            ref={logoRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={(e) => handleLogoUpload(e.target.files?.[0])}
            onClick={(e) => ((e.target as HTMLInputElement).value = '')}
          />
          {invoice.customization.logoImage ? (
            <div className="flex items-center gap-2 p-2 rounded-xl border border-gray-100 dark:border-slate-700 bg-gray-50 dark:bg-slate-800/60">
              <img
                src={invoice.customization.logoImage}
                alt="logo"
                className="h-10 w-16 object-contain rounded-lg bg-white dark:bg-slate-700 border border-gray-100 dark:border-slate-600 p-1 flex-shrink-0"
              />
              <div className="flex-1 min-w-0">
                <p className="text-xs font-medium text-gray-700 dark:text-slate-300 truncate">لوگو آپلود شده</p>
                <p className="text-[10px] text-gray-400 dark:text-slate-500">در هدر فاکتور نمایش داده می‌شود</p>
              </div>
              <div className="flex gap-1 flex-shrink-0">
                <button
                  type="button"
                  onClick={() => logoRef.current?.click()}
                  className="btn-secondary text-[11px] px-2 py-1"
                >تغییر</button>
                <button
                  type="button"
                  onClick={() => updateCustomization({ logoImage: null })}
                  className="p-1.5 rounded-lg text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
                  title="حذف لوگو"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ) : (
            <button
              type="button"
              onClick={() => logoRef.current?.click()}
              className="w-full h-14 border-2 border-dashed border-gray-200 dark:border-slate-600 rounded-xl flex items-center justify-center gap-2 text-xs text-gray-400 dark:text-slate-500 hover:border-blue-400 hover:text-blue-500 dark:hover:border-blue-500 dark:hover:text-blue-400 transition-all active:scale-98"
            >
              <Upload className="w-4 h-4" />
              آپلود لوگو (JPG، PNG، SVG تا ۲ مگابایت)
            </button>
          )}
        </div>
      )}

      {/* Profile save/load — only for seller */}
      {type === 'seller' && <SellerProfileManager />}
    </SectionCard>
  );
}
