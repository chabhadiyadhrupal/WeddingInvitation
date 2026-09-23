'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

import { formatGujaratiDate } from '@/lib/utils';

interface KankotriProps {
  couple: {
    groom_name_en: string;
    groom_name_gu: string;
    bride_name_en: string;
    bride_name_gu: string;
    welcome_message: string;
  };
  settings: {
    wedding_date: string;
    wedding_time: string;
    venue_name: string;
    venue_address: string;
  };
}

export default function KankotriSection({ couple, settings }: KankotriProps) {
  const [isOpen, setIsOpen] = useState(false);

  const formattedDate = formatGujaratiDate(settings.wedding_date, true);

  return (
    <div className="relative w-full max-w-2xl mx-auto py-12 px-4 select-none flex flex-col items-center" style={{ perspective: 1200 }}>
      <AnimatePresence mode="wait">
        {!isOpen ? (
          /* CLOSED ENVELOPE state */
          <motion.div
            key="envelope-closed"
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            onClick={() => setIsOpen(true)}
            className="w-full h-80 rounded-2xl bg-gradient-to-br from-[#800000] to-[#4A0E17] border-2 border-[#D4AF37] shadow-2xl relative cursor-pointer overflow-hidden flex flex-col items-center justify-center p-6 text-center group"
          >
            {/* Corner Ornamental Borders */}
            <div className="absolute top-4 left-4 text-[#D4AF37] opacity-60">🕭</div>
            <div className="absolute top-4 right-4 text-[#D4AF37] opacity-60">🕭</div>
            <div className="absolute bottom-4 left-4 text-[#D4AF37] opacity-60">🕭</div>
            <div className="absolute bottom-4 right-4 text-[#D4AF37] opacity-60">🕭</div>

            {/* Glowing gold border outlines */}
            <div className="absolute inset-2 border border-[#D4AF37]/30 rounded-xl pointer-events-none"></div>

            {/* Envelope flap visual lines */}
            <svg className="absolute inset-0 w-full h-full pointer-events-none opacity-20" viewBox="0 0 100 100" preserveAspectRatio="none">
              <path d="M0 0 L50 45 L100 0" fill="none" stroke="#D4AF37" strokeWidth="0.5" />
              <path d="M0 100 L40 50" fill="none" stroke="#D4AF37" strokeWidth="0.5" />
              <path d="M100 100 L60 50" fill="none" stroke="#D4AF37" strokeWidth="0.5" />
            </svg>

            {/* Traditional Kalash Seal */}
            <motion.div
              whileHover={{ scale: 1.1 }}
              className="w-20 h-20 rounded-full bg-gold-metallic border-2 border-[#FFE89C] flex items-center justify-center shadow-lg relative z-10 text-[#4A0E17]"
            >
              {/* Kalash Drawing */}
              <svg className="w-10 h-10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <path d="M8 10 H16 M7 14 C7 20, 17 20, 17 14 C17 12, 7 12, 7 14 Z" />
                <path d="M12 4 L9 10 H15 L12 4 Z" fill="currentColor" opacity="0.3" />
                <circle cx="12" cy="14" r="2" />
              </svg>
            </motion.div>

            <h3 className="text-gold-metallic font-gujarati text-2xl font-bold mt-6 tracking-wide drop-shadow-md">
              શુભ કંકોતરી
            </h3>
            <p className="text-amber-100/80 text-xs mt-2 font-medium tracking-widest uppercase">
              Click to Open Royal Invitation
            </p>
          </motion.div>
        ) : (
          /* OPEN LETTER state */
          <motion.div
            key="envelope-opened"
            initial={{ rotateX: 35, y: 60, opacity: 0, scale: 0.88 }}
            animate={{ rotateX: 0, y: 0, opacity: 1, scale: 1 }}
            exit={{ rotateX: -35, y: -60, opacity: 0, scale: 0.88 }}
            transition={{ type: 'spring', stiffness: 90, damping: 16 }}
            className="w-full royal-card p-6 md:p-10 relative overflow-hidden"
          >
            {/* Gold shimmer sweep across the opened card */}
            <div className="absolute inset-y-0 w-1/3 bg-gradient-to-r from-transparent via-white/15 to-transparent -skew-x-12 pointer-events-none" style={{ animation: 'metallicShine 5s infinite linear', animationDelay: '1.2s' }}></div>

            {/* Top hanging flower overlay inside the card */}
            <div className="absolute top-0 inset-x-0 toran-border"></div>

            {/* Swastik & Om accents */}
            <div className="flex justify-between items-center text-[#800000] opacity-50 px-4 pt-2">
              <span className="text-lg">卐</span>
              <span className="text-lg font-serif">ॐ</span>
              <span className="text-lg">卐</span>
            </div>

            {/* Content Details */}
            <div className="text-center mt-6">
              <h4 className="text-[#800000] font-serif text-sm font-bold tracking-widest uppercase mb-1">
                Shree Ganeshay Namah
              </h4>
              <p className="text-[#9B111E] font-gujarati text-base font-semibold italic max-w-md mx-auto mb-6 leading-relaxed">
                &ldquo;મંગલમ્ ભગવાન વિષ્ણુઃ, મંગલમ્ ગરુડધ્વજઃ ।<br />
                મંગલમ્ પુણ્ડરીકાક્ષઃ, મંગલાય તનો હરિઃ ॥&rdquo;
              </p>

              {/* Decorative Divider */}
              <div className="flex items-center justify-center space-x-2 my-4">
                <div className="h-[1px] w-12 bg-[#D4AF37]"></div>
                <span className="text-[#D4AF37]">✦</span>
                <div className="h-[1px] w-12 bg-[#D4AF37]"></div>
              </div>

              {/* Invitation Text */}
              <h2 className="text-2xl md:text-3xl font-bold font-gujarati text-[#800000] mb-4">
                લગ્ન આમંત્રણ પત્રિકા
              </h2>
              
              <div className="text-gray-700 font-gujarati text-sm md:text-base leading-relaxed space-y-4 max-w-lg mx-auto">
                <p className="text-[#9B111E] font-semibold text-base">
                  {couple.welcome_message || "સ્નેહી સજ્જન, સહર્ષ જણાવતા આનંદ થાય છે કે અમારા આંગણે મંગલ લગ્ન મહોત્સવ યોજાયેલ છે..."}
                </p>

                <div className="py-6 border-y border-[#D4AF37]/20 my-6 bg-[#FDFBF7]/80">
                  <p className="text-xs text-gray-500 uppercase tracking-widest font-outfit">The Blessed Couple</p>
                  <div className="flex flex-col md:flex-row justify-center items-center space-y-2 md:space-y-0 md:space-x-4 mt-2">
                    <span className="text-xl md:text-2xl font-bold text-[#800000] font-gujarati">
                      {couple.groom_name_gu}
                    </span>
                    <span className="text-gold-metallic font-bold font-serif text-lg">Weds</span>
                    <span className="text-xl md:text-2xl font-bold text-[#800000] font-gujarati">
                      {couple.bride_name_gu}
                    </span>
                  </div>
                  <div className="text-xs text-gray-500 font-outfit mt-1">
                    ({couple.groom_name_en} & {couple.bride_name_en})
                  </div>
                </div>

                <div className="space-y-2 text-sm text-left bg-amber-50/50 p-4 rounded-xl border border-[#D4AF37]/20">
                  <div className="flex">
                    <strong className="w-24 text-[#800000] font-semibold flex-shrink-0">શુભ લગ્ન:</strong>
                    <span>{formattedDate}</span>
                  </div>
                  <div className="flex">
                    <strong className="w-24 text-[#800000] font-semibold flex-shrink-0">સમય:</strong>
                    <span>{settings.wedding_time} onwards</span>
                  </div>
                  <div className="flex">
                    <strong className="w-24 text-[#800000] font-semibold flex-shrink-0">સ્થળ:</strong>
                    <span>
                      <strong className="text-gray-900">{settings.venue_name}</strong><br />
                      <span className="text-xs text-gray-600">{settings.venue_address}</span>
                    </span>
                  </div>
                </div>

                <p className="pt-4 text-xs italic text-gray-500">
                  તમારી પાવન ઉપસ્થિતિ અને મંગલ આશીર્વાદ અમારા સ્નેહમિલનને વધુ યાદગાર બનાવશે.
                  <br />
                  <span className="font-outfit block mt-1 not-italic">
                    &ldquo;Your presence and blessings will make our union truly auspicious.&rdquo;
                  </span>
                </p>
              </div>

              {/* Close Button */}
              <button
                onClick={() => setIsOpen(false)}
                className="mt-8 text-xs font-bold text-[#800000] hover:text-[#9B111E] uppercase tracking-wider underline cursor-pointer"
              >
                Close Kankotri
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
