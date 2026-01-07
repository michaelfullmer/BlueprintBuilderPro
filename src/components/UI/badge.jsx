import React from 'react';
import { cn } from '@/lib/utils';

export function Badge({ variant = 'secondary', className = '', ...props }) {
  const variants = {
    secondary: 'bg-slate-100 text-slate-700',
    outline: 'border border-slate-300 text-slate-700'
  };
  return <span className={cn('inline-flex items-center rounded-md px-2 py-1 text-xs', variants[variant], className)} {...props} />;
}

export default Badge;
