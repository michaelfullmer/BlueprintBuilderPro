import React from 'react';
import { cn } from '@/lib/utils';

export function Input({ className = '', ...props }) {
  return (
    <input
      className={cn('h-10 px-3 rounded-md border border-slate-300 focus:outline-none focus:ring-2 focus:ring-slate-400', className)}
      {...props}
    />
  );
}

export default Input;
