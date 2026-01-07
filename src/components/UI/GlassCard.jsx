import React from 'react';
import { cn } from '@/lib/utils';

export default function GlassCard({ className = '', children }) {
  return (
    <div className={cn('rounded-xl border border-slate-200 bg-white/70 backdrop-blur-sm shadow-sm', className)}>
      {children}
    </div>
  );
}
