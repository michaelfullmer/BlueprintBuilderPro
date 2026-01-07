import React from 'react';

const RadioGroup = React.forwardRef(({ className, ...props }, ref) => {
  return (<div role="radiogroup" ref={ref} className={className} {...props} />);
});
RadioGroup.displayName = "RadioGroup";

const RadioGroupItem = React.forwardRef(({ className, children, ...props }, ref) => {
  return (
    <button
      role="radio"
      ref={ref}
      className={className}
      {...props}
    >
        <div className="h-2.5 w-2.5 fill-current text-current" />
    </button>
  );
});
RadioGroupItem.displayName = "RadioGroupItem";

export { RadioGroup, RadioGroupItem };
