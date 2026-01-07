import React, { useState, useRef, useEffect, createContext, useContext } from 'react';

const MenuContext = createContext(null);

export function DropdownMenu({ children }) {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);
  useEffect(() => {
    function onDocClick(e) {
      if (!ref.current) return;
      if (open && !ref.current.contains(e.target)) setOpen(false);
    }
    function onKey(e) {
      if (e.key === 'Escape') setOpen(false);
    }
    document.addEventListener('mousedown', onDocClick);
    document.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('mousedown', onDocClick);
      document.removeEventListener('keydown', onKey);
    };
  }, [open]);
  return (
    <MenuContext.Provider value={{ open, setOpen }}>
      <div ref={ref} className="relative inline-block">{children}</div>
    </MenuContext.Provider>
  );
}
export function DropdownMenuTrigger({ asChild, children }) {
  const ctx = useContext(MenuContext);
  if (!ctx) return children;
  const { open, setOpen } = ctx;
  const child = React.Children.only(children);
  const onClick = (e) => {
    if (child.props.onClick) child.props.onClick(e);
    setOpen(!open);
  };
  return React.cloneElement(child, { onClick, 'aria-expanded': open, 'aria-haspopup': 'menu' });
}
export function DropdownMenuContent({ className = '', align = 'end', children }) {
  const ctx = useContext(MenuContext);
  if (!ctx || !ctx.open) return null;
  return (
    <div className={`absolute ${align === 'end' ? 'right-0' : 'left-0'} z-50 mt-2 w-56 rounded-md border bg-white shadow-lg ${className}`}>
      {children}
    </div>
  );
}
export function DropdownMenuLabel({ children }) {
  return <div className="px-3 py-2 text-sm text-slate-600">{children}</div>;
}
export function DropdownMenuSeparator() {
  return <div className="my-1 border-t" />;
}
export function DropdownMenuItem({ className = '', ...props }) {
  return <button className={`w-full text-left px-3 py-2 text-sm hover:bg-slate-100 ${className}`} {...props} />;
}
