import React from 'react';

const ScrollArea = React.forwardRef(({ className, children, ...props }, ref) => (
  <div ref={ref} className={className} style={{ overflow: 'auto' }} {...props}>
    {children}
  </div>
));
ScrollArea.displayName = "ScrollArea";

export { ScrollArea };
