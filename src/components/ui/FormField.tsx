'use client';

import { cn } from '@/lib/utils';

interface FormFieldProps {
  label: string;
  children: React.ReactNode;
  className?: string;
  required?: boolean;
}

export function FormField({ label, children, className, required }: FormFieldProps) {
  return (
    <div className={cn('flex flex-col', className)}>
      <label className="label">
        {label}
        {required && <span className="text-red-500 mr-0.5">*</span>}
      </label>
      {children}
    </div>
  );
}
