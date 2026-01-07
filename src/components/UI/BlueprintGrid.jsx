import React from 'react';

export default function BlueprintGrid({ opacity = 0.05 }) {
  return (
    <div
      aria-hidden="true"
      style={{ opacity }}
      className="pointer-events-none fixed inset-0"
    >
      <svg width="100%" height="100%">
        <defs>
          <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
            <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#94a3b8" strokeWidth="0.5" />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#grid)" />
      </svg>
    </div>
  );
}
