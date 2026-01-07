import React, { useState } from 'react';

export function Tabs({ value, onValueChange, children }) {
  const [v, setV] = useState(value);
  const change = (nv) => {
    setV(nv);
    onValueChange?.(nv);
  };
  return React.Children.map(children, child => {
    if (!React.isValidElement(child)) return child;
    return React.cloneElement(child, { value: v, onValueChange: change });
  });
}
export function TabsList({ children }) {
  return <div className="flex gap-2 rounded-lg bg-slate-100 p-1">{children}</div>;
}
export function TabsTrigger({ value, onValueChange, children }) {
  return (
    <button
      onClick={() => onValueChange?.(value)}
      className="px-3 py-1 rounded-md text-sm hover:bg-white"
    >
      {children}
    </button>
  );
}
export function TabsContent({ value, children, value: current }) {
  if (value !== current) return null;
  return <div className="mt-4">{children}</div>;
}
