'use client';

import { Moon, Sun, Settings, RotateCcw, Download, Printer, FolderOpen } from 'lucide-react';
import { useInvoiceStore } from '@/store/invoiceStore';
import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';

interface NavbarProps {
  onExportPDF: () => void;
  onPrint: () => void;
  isExporting: boolean;
}

export function Navbar({ onExportPDF, onPrint, isExporting }: NavbarProps) {
  const { theme, setTheme, toggleCustomization, toggleResetModal, toggleInvoiceList, savedInvoices } = useInvoiceStore();

  return (
    <header className="no-print flex-shrink-0 sticky top-0 z-50 h-14 bg-white/90 dark:bg-slate-900/90 backdrop-blur-md border-b border-gray-200/80 dark:border-slate-700/80">
      <div className="h-full px-3 sm:px-4 flex items-center justify-between gap-2">

        {/* Logo */}
        <motion.div
          initial={{ opacity: 0, x: 12 }}
          animate={{ opacity: 1, x: 0 }}
          className="flex items-center gap-2 flex-shrink-0"
        >
          <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center shadow-sm">
            <svg viewBox="0 0 24 24" className="w-[18px] h-[18px] fill-white">
              <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8l-6-6zm4 18H6V4h7v5h5v11zM8 15h8v2H8v-2zm0-4h8v2H8v-2z"/>
            </svg>
          </div>
          <div className="leading-none">
            <p className="text-sm font-bold text-gray-900 dark:text-white leading-tight">فاکتورساز اختصاصی</p>
            <p className="text-[10px] text-gray-400 dark:text-slate-500 leading-tight">اپلای فا</p>
          </div>
        </motion.div>

        {/* Action buttons */}
        <div className="flex items-center gap-0.5 sm:gap-1">
          {/* Invoice list */}
          <button
            onClick={toggleInvoiceList}
            className="btn-ghost px-2 sm:px-3 relative"
            title="فاکتورهای ذخیره‌شده"
          >
            <FolderOpen className="w-4 h-4" />
            <span className="hidden sm:inline text-xs">فاکتورها</span>
            {savedInvoices.length > 0 && (
              <span className="absolute -top-0.5 -left-0.5 w-4 h-4 rounded-full bg-blue-500 text-[9px] text-white font-bold flex items-center justify-center">
                {savedInvoices.length}
              </span>
            )}
          </button>

          {/* Reset — icon only on xs */}
          <button
            onClick={toggleResetModal}
            className="btn-ghost px-2 sm:px-3"
            title="پاک کردن فرم"
          >
            <RotateCcw className="w-4 h-4" />
            <span className="hidden sm:inline text-xs">پاک کردن</span>
          </button>

          {/* Settings */}
          <button
            onClick={toggleCustomization}
            className="btn-ghost px-2 sm:px-3"
            title="تنظیمات"
          >
            <Settings className="w-4 h-4" />
            <span className="hidden sm:inline text-xs">تنظیمات</span>
          </button>

          {/* Separator */}
          <span className="w-px h-5 bg-gray-200 dark:bg-slate-700 mx-0.5 hidden sm:block" />

          {/* Theme toggle */}
          <button
            onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
            className="btn-ghost px-2 sm:px-2.5"
            title={theme === 'dark' ? 'حالت روشن' : 'حالت تاریک'}
          >
            {theme === 'dark'
              ? <Sun className="w-4 h-4" />
              : <Moon className="w-4 h-4" />}
          </button>

          {/* Print — hidden on xs */}
          <button
            onClick={onPrint}
            className="btn-secondary hidden sm:inline-flex px-2.5 sm:px-3 text-xs"
            title="چاپ"
          >
            <Printer className="w-4 h-4" />
            <span className="hidden sm:inline">چاپ</span>
          </button>

          {/* PDF download */}
          <button
            onClick={onExportPDF}
            disabled={isExporting}
            className={cn(
              'btn-primary text-xs bg-blue-600 hover:bg-blue-700 px-2.5 sm:px-3',
              isExporting && 'opacity-70'
            )}
          >
            <Download className="w-4 h-4" />
            <span className="hidden sm:inline">
              {isExporting ? 'در حال ساخت...' : 'دانلود PDF'}
            </span>
          </button>
        </div>
      </div>
    </header>
  );
}
