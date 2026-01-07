import React from 'react';
import { cn } from '@/lib/utils';

export function Button({ variant = 'default', size = 'md', className = '', ...props }) {
  const base = 'inline-flex items-center justify-center rounded-md transition-colors leading-none';
  const variants = {
    default: 'bg-slate-900 text-white hover:bg-slate-800',
    outline: 'border border-slate-300 text-slate-700 hover:bg-slate-50',
    ghost: 'text-slate-700 hover:bg-slate-100',
  };
  const sizes = {
    sm: 'h-9 px-3 text-sm',
    md: 'h-10 px-4 text-sm',
    lg: 'h-11 px-6 text-base',
    icon: 'h-9 w-9'
  };
  return <button className={cn(base, variants[variant], sizes[size], className)} {...props} />;
}

export default Button;
