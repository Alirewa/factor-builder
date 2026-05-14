'use client';

import { cn } from '@/lib/utils';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown } from 'lucide-react';
import { useState } from 'react';

interface SectionCardProps {
  title: string;
  icon?: React.ReactNode;
  children: React.ReactNode;
  className?: string;
  collapsible?: boolean;
  defaultOpen?: boolean;
}

export function SectionCard({
  title,
  icon,
  children,
  className,
  collapsible = false,
  defaultOpen = true,
}: SectionCardProps) {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  return (
    // NOTE: NO overflow-hidden here — dropdowns inside need to escape
    <div className={cn('card', className)}>
      <div
        className={cn(
          'flex items-center justify-between px-4 py-3 rounded-t-xl',
          collapsible && 'cursor-pointer select-none hover:bg-gray-50 dark:hover:bg-slate-700/30 active:bg-gray-100',
          'transition-colors'
        )}
        onClick={collapsible ? () => setIsOpen(!isOpen) : undefined}
        role={collapsible ? 'button' : undefined}
        aria-expanded={collapsible ? isOpen : undefined}
      >
        <div className="flex items-center gap-2">
          {icon && <span className="text-blue-600 dark:text-blue-400 flex-shrink-0">{icon}</span>}
          <h2 className="section-title">{title}</h2>
        </div>
        {collapsible && (
          <motion.span
            animate={{ rotate: isOpen ? 0 : -90 }}
            transition={{ duration: 0.2 }}
            className="text-gray-400 flex-shrink-0"
          >
            <ChevronDown className="w-4 h-4" />
          </motion.span>
        )}
      </div>

      <div className="divider" />

      <AnimatePresence initial={false}>
        {(!collapsible || isOpen) && (
          <motion.div
            key="content"
            initial={collapsible ? { height: 0, opacity: 0 } : false}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2, ease: 'easeInOut' }}
            style={{ overflow: 'visible' }}   // ← visible so dropdowns escape
          >
            <div className="p-3 sm:p-4">{children}</div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
