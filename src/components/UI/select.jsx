import React, { useState } from 'react';

export function Select({ value, onValueChange, children }) {
  const [open, setOpen] = useState(false);
  return React.Children.map(children, child => {
    if (!React.isValidElement(child)) return child;
    return React.cloneElement(child, { open, setOpen, value, onValueChange });
  });
}
export function SelectTrigger({ className = '', open, setOpen, children }) {
  return (
    <button className={`inline-flex items-center h-10 px-3 border rounded-md ${className}`} onClick={() => setOpen(!open)}>
      {children}
    </button>
  );
}
export function SelectValue({ placeholder }) {
  return <span className="text-sm text-slate-600">{placeholder}</span>;
}
export function SelectContent({ open, children }) {
  if (!open) return null;
  return <div className="mt-2 w-44 rounded-md border bg-white shadow">{children}</div>;
}
export function SelectItem({ value, onClick, onValueChange, children }) {
  return (
    <div
      className="px-3 py-2 text-sm hover:bg-slate-100 cursor-pointer"
      onClick={() => onValueChange ? onValueChange(value) : onClick?.()}
    >
      {children}
    </div>
  );
}
