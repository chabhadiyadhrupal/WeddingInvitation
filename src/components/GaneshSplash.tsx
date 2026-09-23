'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface GaneshSplashProps {
  onEnter: () => void;
}

export default function GaneshSplash({ onEnter }: GaneshSplashProps) {
  const [isVisible, setIsVisible] = useState(true);

  const handleEnter = () => {
    setIsVisible(false);
    setTimeout(onEnter, 800); // Allow exit animations to complete
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.8, ease: 'easeInOut' }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-[#1F080C] px-4 select-none"
        >
          {/* Decorative Background Pattern */}
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(128,0,0,0.4)_0%,rgba(10,2,4,0.95)_100%)] pointer-events-none"></div>
          
          {/* Subtle spinning mandala in the background */}
          <div className="absolute opacity-10 animate-spin-slow pointer-events-none">
            <svg className="w-[80vw] h-[80vw] max-w-[600px] text-[#D4AF37]" viewBox="0 0 100 100" fill="none" stroke="currentColor" strokeWidth="0.5">
              <circle cx="50" cy="50" r="45" strokeDasharray="2,2" />
              {Array.from({ length: 12 }).map((_, i) => (
                <line key={i} x1="50" y1="5" x2="50" y2="95" transform={`rotate(${i * 15} 50 50)`} />
              ))}
            </svg>
          </div>

          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 1, ease: 'easeOut' }}
            className="w-full max-w-lg royal-card-dark py-12 px-6 text-center border-2 border-[#D4AF37] relative flex flex-col items-center"
          >
            {/* Auspicious Swastik symbols in corners */}
            <div className="absolute top-4 left-4 text-[#D4AF37] font-serif text-xl">卐</div>
            <div className="absolute top-4 right-4 text-[#D4AF37] font-serif text-xl">卐</div>
            <div className="absolute bottom-4 left-4 text-[#D4AF37] font-serif text-xl">卐</div>
            <div className="absolute bottom-4 right-4 text-[#D4AF37] font-serif text-xl">卐</div>

            {/* Glowing Ganesh Ji Icon */}
            <motion.div
              animate={{ 
                filter: ["drop-shadow(0 0 8px rgba(212,175,55,0.4))", "drop-shadow(0 0 18px rgba(212,175,55,0.7))", "drop-shadow(0 0 8px rgba(212,175,55,0.4))"],
                scale: [1, 1.03, 1]
              }}
              transition={{ repeat: Infinity, duration: 4, ease: 'easeInOut' }}
              className="text-[#D4AF37] mb-6"
            >
              <svg
                className="w-24 h-24 md:w-32 md:h-32"
                viewBox="0 0 100 100"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                {/* Simplified Line Art Ganesh Ji */}
                {/* Crown (Mukut) */}
                <path d="M45 10 L50 3 L55 10 L52 20 L48 20 Z" />
                <path d="M48 10 L52 10" />
                
                {/* Head & Ears */}
                <path d="M40 25 C30 20, 25 35, 35 45 C40 50, 43 45, 45 42" /> {/* Left Ear */}
                <path d="M60 25 C70 20, 75 35, 65 45 C60 50, 57 45, 55 42" /> {/* Right Ear */}
                <path d="M45 20 C42 28, 58 28, 55 20" /> {/* Forehead */}
                
                {/* Tilak */}
                <path d="M50 17 L50 25" strokeWidth="2.5" />
                <path d="M48 21 L52 21" strokeWidth="1" />

                {/* Eyes */}
                <circle cx="46" cy="30" r="1.5" fill="currentColor" />
                <circle cx="54" cy="30" r="1.5" fill="currentColor" />

                {/* Trunk (Sondh) */}
                <path d="M50 27 C42 35, 48 55, 38 60 C32 63, 30 55, 33 52 C35 50, 38 52, 38 55 C38 65, 52 65, 52 40 C52 35, 50 32, 50 27" />

                {/* Modak (Sweet) in Trunk area */}
                <path d="M30 52 C28 50, 26 53, 28 55 C29 56, 31 54, 30 52 Z" fill="currentColor" />

                {/* Auspicious Kalash symbol underneath */}
                <path d="M45 75 L55 75 L57 82 L43 82 Z" />
                <path d="M41 82 C41 93, 59 93, 59 82 Z" />
                <path d="M48 75 C48 70, 52 70, 52 75" />
              </svg>
            </motion.div>

            {/* Ganesh Vandana Text */}
            <h2 className="text-[#D4AF37] font-serif text-lg md:text-xl font-semibold tracking-wider mb-2">
              ॥ શ્રી ગણેશાય નમઃ ॥
            </h2>

            {/* Shloka */}
            <p className="text-[#F5DEB3] text-xs md:text-sm leading-relaxed italic max-w-sm mb-8 opacity-80 px-4 animate-gold-pulse">
              &ldquo;વક્રતુણ્ડ મહાકાય સૂર્યકોટી સમપ્રભ,<br />
              નિર્વિઘ્નં કુરુ મે દેવ સર્વકાર્યેષુ સર્વદા.&rdquo;
            </p>

            {/* Welcome Quote */}
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.5, duration: 0.8 }}
              className="mb-8"
            >
              <h1 className="text-3xl md:text-4xl font-bold tracking-normal font-gujarati text-gold-metallic py-2 drop-shadow-[0_0_15px_rgba(212,175,55,0.75)] animate-pulse">
                જય શ્રી ગણેશ
              </h1>
              <p className="text-amber-100 text-sm md:text-md mt-2 tracking-wide font-medium">
                શુભ લગ્ન આમંત્રણ પત્રિકા
              </p>
            </motion.div>

            {/* Premium Metallic CTA Button */}
            <motion.button
              whileHover={{ scale: 1.05, boxShadow: "0 0 20px rgba(212,175,55,0.6)" }}
              whileTap={{ scale: 0.95 }}
              onClick={handleEnter}
              className="bg-gold-metallic text-[#4A0E17] font-bold text-sm md:text-base py-3 px-8 rounded-full border-2 border-[#FFE89C] tracking-widest shadow-lg cursor-pointer transition-all duration-300 font-gujarati"
            >
              આમંત્રણ પત્રિકા પ્રવેશો
            </motion.button>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
