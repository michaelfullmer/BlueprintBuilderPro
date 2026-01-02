import React from 'react';

export default function BlueprintGrid({ className = "", opacity = 0.03 }) {
  return (
    <div 
      className={`absolute inset-0 pointer-events-none ${className}`}
      style={{
        backgroundImage: `
          linear-gradient(rgba(15, 23, 42, ${opacity}) 1px, transparent 1px),
          linear-gradient(90deg, rgba(15, 23, 42, ${opacity}) 1px, transparent 1px)
        `,
        backgroundSize: '24px 24px'
      }}
    />
  );
}