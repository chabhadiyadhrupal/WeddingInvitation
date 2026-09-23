'use client';

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, Heart } from 'lucide-react';

interface LoadingScreen3DProps {
  isLoading: boolean;
}

export default function LoadingScreen3D({ isLoading }: LoadingScreen3DProps) {
  return (
    <AnimatePresence>
      {isLoading && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{ opacity: 0, transition: { duration: 0.9, ease: 'easeInOut' } }}
          className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-[#0F0B15] text-[#D4AF37] selection:bg-[#800000] font-outfit select-none px-4 overflow-hidden"
        >
          {/* Subtle Ambient Background Radial Glow */}
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-[#800000]/30 via-transparent to-transparent pointer-events-none" />

          {/* Golden Mandala Decorative Circle */}
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 30, repeat: Infinity, ease: 'linear' }}
            className="w-48 h-48 md:w-64 md:h-64 rounded-full border border-[#D4AF37]/20 border-dashed flex items-center justify-center absolute -z-0"
          >
            <div className="w-36 h-36 md:w-48 md:h-48 rounded-full border border-[#D4AF37]/15" />
          </motion.div>

          <div className="relative z-10 flex flex-col items-center text-center max-w-md">
            {/* Ganesh Vandana Shloka */}
            <motion.p
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-[#D4AF37] text-xs md:text-sm font-bold tracking-widest uppercase mb-4"
            >
              ॥ શ્રી ગણેશાય નમઃ ॥
            </motion.p>

            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="relative mb-6"
            >
              <div className="w-16 h-16 rounded-full bg-gradient-to-tr from-[#800000] to-[#D4AF37]/40 flex items-center justify-center shadow-lg border border-[#D4AF37]/40">
                <Sparkles className="w-8 h-8 text-[#FFD700] animate-pulse" />
              </div>
            </motion.div>

            {/* Title & Subtitle */}
            <motion.h1
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="text-3xl md:text-4xl font-bold font-serif text-[#FFFDF9] tracking-wide drop-shadow"
            >
              Aarav &amp; Kiara
            </motion.h1>

            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.8 }}
              transition={{ delay: 0.4 }}
              className="text-xs md:text-sm text-[#D4AF37] tracking-wider uppercase mt-1 mb-8"
            >
              Cinematic 3D Wedding Experience
            </motion.p>

            {/* Loading Bar Animation */}
            <div className="w-64 md:w-80 h-1.5 bg-gray-900 rounded-full overflow-hidden border border-[#D4AF37]/30 shadow-inner relative">
              <motion.div
                initial={{ x: '-100%' }}
                animate={{ x: '0%' }}
                transition={{ duration: 1.2, ease: 'easeInOut' }}
                className="h-full bg-gradient-to-r from-[#800000] via-[#FFD700] to-[#FFFDF9] rounded-full"
              />
            </div>

            <p className="text-[11px] text-gray-400 mt-4 flex items-center gap-1">
              <span>Preparing 3D Mandap &amp; Lighting</span>
              <Heart className="w-3 h-3 text-[#800000] inline fill-current animate-ping" />
            </p>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
