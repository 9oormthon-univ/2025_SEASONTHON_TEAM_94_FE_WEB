import type { ReactNode } from 'react';

interface FormFieldProps {
  label: string;
  children: ReactNode;
  error?: string;
}

export function FormField({ label, children, error }: FormFieldProps) {
  return (
    <div className="flex items-center justify-between py-4 border-b border-gray-200 min-h-[52px]">
      <label className="text-base text-[#757575] tracking-[-0.176px] flex-shrink-0">
        {label}
      </label>
      <div className="flex-1 ml-4">
        {children}
        {error && (
          <p className="text-red-500 text-xs mt-1 text-right">{error}</p>
        )}
      </div>
    </div>
  );
}
