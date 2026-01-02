import React from 'react';
import { cn } from '@/lib/utils';

export default function GlassCard({ children, className = "", hover = true, ...props }) {
  return (
    <div 
      className={cn(
        "bg-white/80 backdrop-blur-xl rounded-2xl border border-slate-200/60 shadow-lg shadow-slate-200/20",
        hover && "transition-all duration-300 hover:shadow-xl hover:shadow-slate-200/30 hover:border-slate-300/60",
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}