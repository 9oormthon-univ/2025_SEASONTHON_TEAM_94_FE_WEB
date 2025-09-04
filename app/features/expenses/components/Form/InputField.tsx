import type { ReactNode } from 'react';
import { Label } from '@/shared/components/ui/label';

interface InputFieldProps {
  label: string;
  children: ReactNode;
  error?: string;
  htmlFor?: string;
}

export function InputField({ label, children, error, htmlFor }: InputFieldProps) {
  return (
    <div className="grid w-full items-center gap-3">
      <Label htmlFor={htmlFor} className="text-base text-[#3d3d3d] font-medium">
        {label}
      </Label>
      {children}
      {error && (
        <p className="text-red-500 text-sm transition-opacity duration-200">{error}</p>
      )}
    </div>
  );
}
