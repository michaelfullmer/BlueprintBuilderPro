import React from 'react';
import { cn } from '@/lib/utils';

export function Avatar({ className = '', children }) {
  return <div className={cn('inline-flex items-center justify-center rounded-full bg-slate-200', className)}>{children}</div>;
}
export function AvatarImage({ src, alt }) {
  return <img src={src} alt={alt} className="w-full h-full rounded-full object-cover" />;
}
export function AvatarFallback({ className = '', children }) {
  return <div className={cn('w-full h-full rounded-full flex items-center justify-center', className)}>{children}</div>;
}
