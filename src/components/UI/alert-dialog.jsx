import React, { createContext, useContext } from 'react';
import { createPortal } from 'react-dom';

const AlertDialogContext = createContext({});

export function AlertDialog({ open, onOpenChange, children }) {
  return (
    <AlertDialogContext.Provider value={{ open, onOpenChange }}>
      {children}
    </AlertDialogContext.Provider>
  );
}

export function AlertDialogContent({ children }) {
  const { open } = useContext(AlertDialogContext);
  
  if (!open) return null;

  return createPortal(
    <div className="fixed inset-0 z-[100] flex items-center justify-center">
      <div className="fixed inset-0 bg-black/50 backdrop-blur-sm" />
      <div className="relative z-[100] w-full max-w-md rounded-lg border bg-white p-6 shadow-lg animate-in fade-in-0 zoom-in-95">
        {children}
      </div>
    </div>,
    document.body
  );
}

export function AlertDialogHeader({ children }) {
  return <div className="flex flex-col space-y-2 text-center sm:text-left mb-4">{children}</div>;
}

export function AlertDialogTitle({ children }) {
  return <h2 className="text-lg font-semibold text-slate-900">{children}</h2>;
}

export function AlertDialogDescription({ children }) {
  return <p className="text-sm text-slate-500">{children}</p>;
}

export function AlertDialogFooter({ children }) {
  return <div className="flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-2">{children}</div>;
}

export function AlertDialogCancel({ children, className, ...props }) {
  const { onOpenChange } = useContext(AlertDialogContext);
  return (
    <button 
      className={`mt-2 sm:mt-0 px-4 py-2 rounded-md border border-slate-200 bg-white hover:bg-slate-100 hover:text-slate-900 text-sm font-medium transition-colors ${className || ''}`}
      onClick={() => onOpenChange && onOpenChange(false)}
      {...props}
    >
      {children}
    </button>
  );
}

export function AlertDialogAction({ children, className, ...props }) {
  return (
    <button 
      className={`px-4 py-2 rounded-md bg-slate-900 text-white hover:bg-slate-800 text-sm font-medium transition-colors ${className || ''}`} 
      {...props}
    >
      {children}
    </button>
  );
}
