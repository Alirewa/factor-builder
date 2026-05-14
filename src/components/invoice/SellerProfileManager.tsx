'use client';

import { useState } from 'react';
import { useInvoiceStore } from '@/store/invoiceStore';
import { motion, AnimatePresence } from 'framer-motion';
import { Bookmark, BookmarkCheck, Trash2, ChevronDown, Check, Plus, User } from 'lucide-react';
import toast from 'react-hot-toast';

export function SellerProfileManager() {
  const { savedProfiles, saveProfile, loadProfile, deleteProfile, invoice } = useInvoiceStore();
  const [isOpen, setIsOpen] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [profileName, setProfileName] = useState('');

  const hasSellerData = !!(invoice.seller.name || invoice.seller.company);

  const handleSave = () => {
    const name = profileName.trim();
    if (!name) { toast.error('نام پروفایل را وارد کنید'); return; }
    if (!hasSellerData) { toast.error('ابتدا مشخصات فروشنده را وارد کنید'); return; }
    saveProfile(name);
    toast.success(`پروفایل «${name}» ذخیره شد`);
    setProfileName('');
    setIsSaving(false);
  };

  const handleLoad = (id: string, name: string) => {
    loadProfile(id);
    toast.success(`پروفایل «${name}» بارگذاری شد`);
    setIsOpen(false);
  };

  const handleDelete = (id: string, name: string, e: React.MouseEvent) => {
    e.stopPropagation();
    deleteProfile(id);
    toast(`پروفایل «${name}» حذف شد`, { icon: '🗑️' });
  };

  return (
    <div className="mt-3 pt-3 border-t border-gray-100 dark:border-slate-700/60">
      <p className="text-[11px] text-gray-400 dark:text-slate-500 mb-2 flex items-center gap-1">
        <User className="w-3 h-3" />
        ذخیره / بارگذاری اطلاعات فروشنده
      </p>
      <div className="flex items-center gap-2">

        {/* ── Load dropdown ── */}
        <div className="relative flex-1" style={{ zIndex: 30 }}>
          <button
            type="button"
            onClick={() => setIsOpen((v) => !v)}
            disabled={savedProfiles.length === 0}
            className="btn-secondary text-xs w-full justify-between"
            title={savedProfiles.length === 0 ? 'هنوز پروفایلی ندارید' : 'انتخاب پروفایل'}
          >
            <span className="flex items-center gap-1.5 min-w-0">
              <Bookmark className="w-3.5 h-3.5 flex-shrink-0" />
              <span className="truncate">
                {savedProfiles.length === 0 ? 'پروفایلی ندارید' : `${savedProfiles.length} پروفایل`}
              </span>
            </span>
            {savedProfiles.length > 0 && (
              <motion.span animate={{ rotate: isOpen ? 180 : 0 }} transition={{ duration: 0.15 }}>
                <ChevronDown className="w-3.5 h-3.5 flex-shrink-0 mr-1" />
              </motion.span>
            )}
          </button>

          <AnimatePresence>
            {isOpen && savedProfiles.length > 0 && (
              <>
                {/* backdrop */}
                <div className="fixed inset-0 z-30" onClick={() => setIsOpen(false)} />
                <motion.div
                  initial={{ opacity: 0, y: -6 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -6 }}
                  transition={{ duration: 0.12 }}
                  className="absolute top-full right-0 mt-1.5 min-w-[220px] w-full z-40 bg-white dark:bg-slate-800 rounded-xl shadow-2xl border border-gray-100 dark:border-slate-700"
                >
                  <div className="p-1.5 max-h-52 overflow-y-auto scrollbar-thin">
                    {savedProfiles
                      .slice()
                      .sort((a, b) => b.createdAt - a.createdAt)
                      .map((p) => (
                        <div
                          key={p.id}
                          role="button"
                          tabIndex={0}
                          onClick={() => handleLoad(p.id, p.name)}
                          onKeyDown={(e) => e.key === 'Enter' && handleLoad(p.id, p.name)}
                          className="flex items-center gap-2 px-3 py-2.5 rounded-lg cursor-pointer hover:bg-blue-50 dark:hover:bg-blue-900/20 group transition-colors"
                        >
                          <BookmarkCheck className="w-3.5 h-3.5 text-blue-500 flex-shrink-0" />
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-semibold text-gray-800 dark:text-slate-100 truncate">{p.name}</p>
                            {(p.seller.company || p.seller.name) && (
                              <p className="text-[10px] text-gray-400 truncate">
                                {p.seller.company || p.seller.name}
                              </p>
                            )}
                          </div>
                          <div className="flex items-center gap-1 flex-shrink-0">
                            {p.stampImage && (
                              <span className="text-[9px] bg-emerald-50 dark:bg-emerald-900/30 text-emerald-600 px-1.5 py-0.5 rounded-full">مهر</span>
                            )}
                            {p.logoImage && (
                              <span className="text-[9px] bg-blue-50 dark:bg-blue-900/30 text-blue-600 px-1.5 py-0.5 rounded-full">لوگو</span>
                            )}
                            <button
                              onClick={(e) => handleDelete(p.id, p.name, e)}
                              className="p-1 rounded text-gray-300 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors opacity-0 group-hover:opacity-100 focus:opacity-100"
                            >
                              <Trash2 className="w-3 h-3" />
                            </button>
                          </div>
                        </div>
                      ))}
                  </div>
                </motion.div>
              </>
            )}
          </AnimatePresence>
        </div>

        {/* ── Save ── */}
        <AnimatePresence mode="wait">
          {isSaving ? (
            <motion.div
              key="form"
              initial={{ opacity: 0, scaleX: 0.8 }}
              animate={{ opacity: 1, scaleX: 1 }}
              exit={{ opacity: 0, scaleX: 0.8 }}
              className="flex items-center gap-1 origin-left"
            >
              <input
                autoFocus
                className="input text-xs py-2 w-24"
                value={profileName}
                onChange={(e) => setProfileName(e.target.value)}
                placeholder="نام پروفایل"
                maxLength={24}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') handleSave();
                  if (e.key === 'Escape') { setIsSaving(false); setProfileName(''); }
                }}
              />
              <button onClick={handleSave} className="btn-primary text-xs bg-blue-600 hover:bg-blue-700 px-2.5 py-2 flex-shrink-0">
                <Check className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={() => { setIsSaving(false); setProfileName(''); }}
                className="btn-ghost px-2 py-2 flex-shrink-0 text-sm leading-none"
              >×</button>
            </motion.div>
          ) : (
            <motion.button
              key="btn"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              type="button"
              onClick={() => setIsSaving(true)}
              className="btn-secondary text-xs flex-shrink-0"
              title="ذخیره اطلاعات فروشنده به عنوان پروفایل"
            >
              <Plus className="w-3.5 h-3.5" />
              ذخیره
            </motion.button>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
