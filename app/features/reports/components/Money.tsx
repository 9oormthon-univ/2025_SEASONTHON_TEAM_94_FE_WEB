import { type ReactNode } from 'react';

type MoneyProps = { className?: string; children?: ReactNode };

export default function Money({ className, children }: MoneyProps) {
  return (
    <span className={`whitespace-nowrap tabular-nums tracking-tight ${className ?? ''}`}>
      {children}
    </span>
  );
}
