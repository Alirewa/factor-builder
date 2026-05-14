'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { useInvoiceStore } from '@/store/invoiceStore';
import { AlertTriangle } from 'lucide-react';

export function ResetModal() {
  const { isResetModalOpen, toggleResetModal, resetInvoice } = useInvoiceStore();

  return (
    <>
      {/*
        Backdrop: NO AnimatePresence exit animation.
        Removing it immediately prevents the backdrop from staying in the DOM
        (full-screen, z-50) while fading out — which caused every click during
        the exit phase to call toggleResetModal() and re-open the dialog.
      */}
      {isResetModalOpen && (
        <div
          className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 no-print"
          onClick={toggleResetModal}
        />
      )}

      {/* Modal content: keeps the spring animation */}
      <AnimatePresence>
        {isResetModalOpen && (
          <motion.div
            key="reset-modal"
            initial={{ scale: 0.92, opacity: 0, y: 8 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.92, opacity: 0, y: 8 }}
            transition={{ type: 'spring', damping: 26, stiffness: 380 }}
            className="fixed top-1/2 right-1/2 translate-x-1/2 -translate-y-1/2 z-[51] w-full max-w-sm no-print"
            // Stop clicks inside the modal from reaching the backdrop below
            onClick={(e) => e.stopPropagation()}
          >
            <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-2xl mx-4 overflow-hidden">
              <div className="p-6">
                <div className="w-12 h-12 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
                  <AlertTriangle className="w-6 h-6 text-red-500" />
                </div>
                <h3 className="text-base font-bold text-gray-900 dark:text-white text-center mb-2">
                  پاک کردن فرم
                </h3>
                <p className="text-sm text-gray-500 dark:text-slate-400 text-center leading-relaxed">
                  تمام اطلاعات فاکتور از جمله اقلام، اطلاعات طرفین و تنظیمات پاک می‌شود.
                  این عمل قابل بازگشت نیست.
                </p>
              </div>
              <div className="flex gap-3 px-6 pb-6">
                <button
                  onClick={toggleResetModal}
                  className="btn-secondary flex-1"
                >
                  انصراف
                </button>
                <button
                  onClick={resetInvoice}
                  className="btn-danger flex-1 justify-center bg-red-50 text-red-600 hover:bg-red-100 dark:bg-red-900/20 dark:text-red-400 dark:hover:bg-red-900/40"
                >
                  بله، پاک شود
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
