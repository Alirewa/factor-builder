'use client';

import { useInvoiceStore } from '@/store/invoiceStore';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Palette, Layout, Eye, Type, Building2 } from 'lucide-react';
import { InvoiceTemplate } from '@/types/invoice';
import toast from 'react-hot-toast';

const COLORS = [
  { hex: '#2563eb', name: 'آبی' },
  { hex: '#0891b2', name: 'فیروزه‌ای' },
  { hex: '#059669', name: 'سبز' },
  { hex: '#7c3aed', name: 'بنفش' },
  { hex: '#dc2626', name: 'قرمز' },
  { hex: '#ea580c', name: 'نارنجی' },
  { hex: '#0f172a', name: 'مشکی' },
  { hex: '#374151', name: 'خاکستری' },
];

const TEMPLATES: { id: InvoiceTemplate; label: string; desc: string }[] = [
  { id: 'modern',    label: 'مدرن',    desc: 'هدر رنگی + جدول تمیز' },
  { id: 'formal',    label: 'رسمی',    desc: 'صورتحساب کلاسیک' },
  { id: 'corporate', label: 'شرکتی',   desc: 'دو‌رنگ + جدول تیره' },
  { id: 'minimal',   label: 'مینیمال', desc: 'ساده و مینیمال' },
];

export function CustomizationPanel() {
  const { isCustomizationOpen, toggleCustomization, invoice, updateCustomization, loadBimfaPreset } = useInvoiceStore();
  const c = invoice.customization;

  const handleBimfaPreset = async () => {
    const t = toast.loading('در حال بارگذاری پریست...');
    try {
      await loadBimfaPreset();
      toast.success('پریست بیم فا بارگذاری شد. لوگو را از بخش اطلاعات فروشنده آپلود کنید.', { id: t, duration: 4000 });
    } catch {
      toast.error('خطا در بارگذاری پریست', { id: t });
    }
  };

  return (
    <AnimatePresence>
      {isCustomizationOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={toggleCustomization}
            className="fixed inset-0 bg-black/30 backdrop-blur-sm z-40 no-print"
          />

          {/* Drawer */}
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 28, stiffness: 320 }}
            className="fixed right-0 top-0 h-full z-50 no-print flex flex-col
                       w-full max-w-[320px] sm:max-w-[340px]
                       bg-white dark:bg-slate-900
                       shadow-2xl border-l border-gray-200 dark:border-slate-700"
          >
            {/* Header */}
            <div className="flex items-center justify-between px-4 py-3.5 border-b border-gray-100 dark:border-slate-800 flex-shrink-0">
              <h3 className="text-sm font-bold text-gray-900 dark:text-white">تنظیمات فاکتور</h3>
              <button onClick={toggleCustomization} className="btn-ghost p-1.5 -ml-1">
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Scrollable content */}
            <div className="flex-1 overflow-y-auto p-4 space-y-5 scrollbar-thin">

              {/* BIMFA Preset */}
              <Section icon={<Building2 className="w-3.5 h-3.5" />} title="پیش‌فرض برند">
                <button
                  onClick={handleBimfaPreset}
                  className="w-full flex items-center gap-3 p-3 rounded-xl border-2 border-blue-200 dark:border-blue-800 bg-blue-50 dark:bg-blue-900/20 hover:bg-blue-100 dark:hover:bg-blue-900/30 transition-colors text-right"
                >
                  <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center flex-shrink-0">
                    <span className="text-white text-[10px] font-black">BF</span>
                  </div>
                  <div>
                    <div className="text-xs font-bold text-blue-700 dark:text-blue-300">گروه بیم فا</div>
                    <div className="text-[10px] text-blue-500 dark:text-blue-400 mt-0.5">بارگذاری اطلاعات و فوتر</div>
                  </div>
                </button>
              </Section>

              {/* Template */}
              <Section icon={<Layout className="w-3.5 h-3.5" />} title="قالب">
                <div className="grid grid-cols-2 gap-2">
                  {TEMPLATES.map((t) => (
                    <button
                      key={t.id}
                      onClick={() => updateCustomization({ template: t.id })}
                      className={`p-3 rounded-xl border-2 text-right transition-all active:scale-95 ${
                        c.template === t.id
                          ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                          : 'border-gray-200 dark:border-slate-700 hover:border-gray-300 dark:hover:border-slate-600'
                      }`}
                    >
                      <div className="text-xs font-bold text-gray-800 dark:text-slate-200">{t.label}</div>
                      <div className="text-[10px] text-gray-400 dark:text-slate-500 mt-0.5">{t.desc}</div>
                    </button>
                  ))}
                </div>
              </Section>

              {/* Color */}
              <Section icon={<Palette className="w-3.5 h-3.5" />} title="رنگ اصلی">
                <div className="flex flex-wrap gap-2 mb-3">
                  {COLORS.map((color) => (
                    <button
                      key={color.hex}
                      onClick={() => updateCustomization({ primaryColor: color.hex })}
                      title={color.name}
                      className="w-8 h-8 rounded-full transition-transform active:scale-90"
                      style={{
                        background: color.hex,
                        outline: c.primaryColor === color.hex ? `3px solid ${color.hex}` : 'none',
                        outlineOffset: '2px',
                        transform: c.primaryColor === color.hex ? 'scale(1.15)' : undefined,
                      }}
                    />
                  ))}
                </div>
                <div className="flex items-center gap-2">
                  <input
                    type="color"
                    value={c.primaryColor}
                    onChange={(e) => updateCustomization({ primaryColor: e.target.value })}
                    className="w-9 h-9 rounded-lg border border-gray-200 dark:border-slate-600 cursor-pointer p-0.5 flex-shrink-0"
                  />
                  <span className="text-xs text-gray-500 dark:text-slate-400">رنگ سفارشی</span>
                  <code className="text-[11px] text-gray-400 mr-auto font-mono">{c.primaryColor}</code>
                </div>
              </Section>

              {/* Font size */}
              <Section icon={<Type className="w-3.5 h-3.5" />} title="اندازه متن">
                <div className="flex gap-2">
                  {([['sm', 'کوچک'], ['md', 'متوسط'], ['lg', 'بزرگ']] as const).map(([size, label]) => (
                    <button
                      key={size}
                      onClick={() => updateCustomization({ fontSize: size })}
                      className={`flex-1 py-2 rounded-lg text-xs font-medium border transition-all active:scale-95 ${
                        c.fontSize === size
                          ? 'border-blue-500 text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/20'
                          : 'border-gray-200 dark:border-slate-700 text-gray-500 dark:text-slate-400 hover:border-gray-300'
                      }`}
                    >
                      {label}
                    </button>
                  ))}
                </div>
              </Section>

              {/* Visibility */}
              <Section icon={<Eye className="w-3.5 h-3.5" />} title="نمایش بخش‌ها">
                <div className="space-y-1">
                  {([
                    ['showTax',       'نمایش مالیات'],
                    ['showDiscount',  'نمایش تخفیف'],
                    ['showNotes',     'نمایش توضیحات'],
                    ['showSignature', 'نمایش امضا'],
                    ['showStamp',     'نمایش مهر'],
                    ['showFooter',    'نمایش فوتر تماس'],
                  ] as const).map(([key, label]) => (
                    <label key={key} className="flex items-center justify-between cursor-pointer py-1.5 rounded-lg px-1 hover:bg-gray-50 dark:hover:bg-slate-800 transition-colors">
                      <span className="text-sm text-gray-600 dark:text-slate-400">{label}</span>
                      <Toggle
                        checked={c[key]}
                        onChange={(v) => updateCustomization({ [key]: v })}
                      />
                    </label>
                  ))}
                </div>

                {/* Footer text area — shown when footer toggle is on */}
                {c.showFooter && (
                  <div className="mt-3">
                    <label className="label mb-1.5">متن فوتر</label>
                    <textarea
                      value={c.footerText}
                      onChange={(e) => updateCustomization({ footerText: e.target.value })}
                      placeholder="آدرس، تلفن، وب‌سایت..."
                      rows={3}
                      className="input resize-none text-xs leading-relaxed"
                    />
                  </div>
                )}
              </Section>

            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

function Section({ icon, title, children }: { icon: React.ReactNode; title: string; children: React.ReactNode }) {
  return (
    <div>
      <div className="flex items-center gap-1.5 mb-2.5">
        <span className="text-blue-500 dark:text-blue-400">{icon}</span>
        <h4 className="text-xs font-bold text-gray-600 dark:text-slate-400 uppercase tracking-wide">{title}</h4>
      </div>
      {children}
    </div>
  );
}

function Toggle({ checked, onChange }: { checked: boolean; onChange: (v: boolean) => void }) {
  return (
    <button
      role="switch"
      aria-checked={checked}
      onClick={() => onChange(!checked)}
      className="relative flex-shrink-0 rounded-full transition-colors duration-200 focus:outline-none"
      style={{ width: 40, height: 22, background: checked ? '#3b82f6' : '#d1d5db' }}
    >
      <span
        className="absolute top-0.5 bg-white rounded-full shadow-sm transition-transform duration-200"
        style={{ width: 18, height: 18, transform: checked ? 'translateX(19px)' : 'translateX(2px)' }}
      />
    </button>
  );
}
