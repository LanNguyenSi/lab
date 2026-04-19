// components/ui/Card.tsx
import type { ReactNode } from 'react';
import clsx from 'clsx';

interface CardProps {
  title?: string;
  subtitle?: string;
  children: ReactNode;
  className?: string;
  hover?: boolean;
}

export function Card({ 
  title, 
  subtitle, 
  children, 
  className, 
  hover = false 
}: CardProps) {
  return (
    <div className={clsx(
      'bg-slate-900 rounded-xl border border-slate-700 p-6',
      hover && 'hover:border-slate-600 transition-colors',
      className
    )}>
      {title && (
        <div className="mb-4">
          <h3 className="text-lg font-semibold text-white">{title}</h3>
          {subtitle && (
            <p className="text-sm text-slate-400 mt-1">{subtitle}</p>
          )}
        </div>
      )}
      {children}
    </div>
  );
}
