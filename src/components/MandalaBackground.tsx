'use client';

import React from 'react';

export default function MandalaBackground() {
  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden flex items-center justify-center opacity-[0.04] md:opacity-[0.06] select-none z-0">
      <div className="animate-scale-pulse">
        <svg
          className="w-[150vw] h-[150vw] max-w-[1200px] max-h-[1200px] animate-spin-slow text-[#D4AF37]"
          viewBox="0 0 200 200"
          fill="none"
          stroke="currentColor"
          strokeWidth="0.5"
        >
        <circle cx="100" cy="100" r="90" strokeDasharray="3,3" />
        <circle cx="100" cy="100" r="80" />
        <circle cx="100" cy="100" r="60" />
        <circle cx="100" cy="100" r="40" strokeDasharray="1,2" />
        <circle cx="100" cy="100" r="20" />
        
        {/* Mandala spokes/petals */}
        {Array.from({ length: 24 }).map((_, i) => {
          const angle = (i * 360) / 24;
          return (
            <g key={i} transform={`rotate(${angle} 100 100)`}>
              <path d="M100 20 C95 40, 95 60, 100 80 C105 60, 105 40, 100 20 Z" />
              <path d="M100 40 C97 50, 97 70, 100 80 C103 70, 103 50, 100 40 Z" fill="currentColor" opacity="0.3" />
              <circle cx="100" cy="20" r="1.5" fill="currentColor" />
              <line x1="100" y1="10" x2="100" y2="190" strokeWidth="0.25" opacity="0.3" />
            </g>
          );
        })}
        {Array.from({ length: 48 }).map((_, i) => {
          const angle = (i * 360) / 48;
          const cx = (100 + 70 * Math.cos((angle * Math.PI) / 180)).toFixed(4);
          const cy = (100 + 70 * Math.sin((angle * Math.PI) / 180)).toFixed(4);
          return (
            <circle
              key={i}
              cx={cx}
              cy={cy}
              r="1"
              fill="currentColor"
            />
          );
        })}
      </svg>
      </div>
    </div>
  );
}
