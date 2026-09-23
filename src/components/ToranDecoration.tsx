'use client';

import React from 'react';

export default function ToranDecoration() {
  return (
    <div className="absolute top-0 left-0 right-0 w-full overflow-hidden pointer-events-none select-none z-30 flex justify-center">
      <div className="flex w-[110%] justify-around items-start -translate-y-1 animate-sway">
        {Array.from({ length: 16 }).map((_, i) => (
          <div key={i} className="flex flex-col items-center min-w-[32px] md:min-w-[48px]">
            {/* The string/thread */}
            <div className="w-[1px] h-3 bg-amber-600/60"></div>
            
            {/* Marigold flower */}
            <div className="w-5 h-5 md:w-7 md:h-7 rounded-full bg-gradient-to-r from-orange-400 to-amber-500 shadow-md flex items-center justify-center relative border border-orange-600/30">
              {/* Flower inner petalling details */}
              <div className="w-3.5 h-3.5 md:w-5 md:h-5 rounded-full bg-amber-400 border border-orange-500/20"></div>
              <div className="w-2 h-2 md:w-3 md:h-3 rounded-full bg-yellow-300"></div>
            </div>
            
            {/* Hanging Mango Leaf (Aso-palav) */}
            <svg
              className="w-4 h-10 md:w-6 md:h-14 text-emerald-700 drop-shadow-md -mt-1 transform origin-top rotate-0"
              viewBox="0 0 20 50"
              fill="currentColor"
            >
              <path d="M10 0 C13 12, 18 20, 18 35 C18 45, 14 50, 10 50 C6 50, 2 45, 2 35 C2 20, 7 12, 10 0 Z" />
              {/* Leaf center line */}
              <path d="M10 0 L10 48" stroke="#064e3b" strokeWidth="0.75" fill="none" opacity="0.5" />
            </svg>
          </div>
        ))}
      </div>
    </div>
  );
}
