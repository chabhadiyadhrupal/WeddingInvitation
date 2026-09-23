'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Music, Sun, Heart, Gift, Palette, Sparkles, Clock, MapPin } from 'lucide-react';
import { WeddingEvent } from '@/lib/db';

interface TimelineEventsProps {
  events: WeddingEvent[];
}

const getEventIcon = (iconName: string) => {
  switch (iconName?.toLowerCase()) {
    case 'palette':
      return <Palette className="w-5 h-5 text-[#4A0E17]" />;
    case 'music':
      return <Music className="w-5 h-5 text-[#4A0E17]" />;
    case 'sun':
      return <Sun className="w-5 h-5 text-[#4A0E17]" />;
    case 'heart':
      return <Heart className="w-5 h-5 text-[#4A0E17]" />;
    case 'gift':
      return <Gift className="w-5 h-5 text-[#4A0E17]" />;
    default:
      return <Sparkles className="w-5 h-5 text-[#4A0E17]" />;
  }
};

import { formatGujaratiDate } from '@/lib/utils';

export default function TimelineEvents({ events }: TimelineEventsProps) {
  // Sort events by date if they aren't already
  const sortedEvents = [...events].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

  return (
    <div className="relative w-full max-w-4xl mx-auto px-4 py-8">
      {/* Central Line */}
      <div className="absolute left-6 md:left-1/2 top-0 bottom-0 w-[2px] bg-gradient-to-b from-[#D4AF37]/20 via-[#D4AF37] to-[#D4AF37]/20 transform -translate-x-1/2"></div>

      <div className="space-y-12">
        {sortedEvents.map((event, index) => {
          const isLeft = index % 2 === 0;
          const formattedDate = formatGujaratiDate(event.date, false);

          return (
            <div key={event.id} className="relative flex flex-col md:flex-row md:justify-between items-start md:items-center w-full">
              
              {/* Central Circle Badge with Icon */}
              <div className="absolute left-6 md:left-1/2 transform -translate-x-1/2 flex items-center justify-center z-10">
                <motion.div
                  initial={{ scale: 0.8, opacity: 0 }}
                  whileInView={{ scale: 1, opacity: 1 }}
                  viewport={{ once: true, margin: '-50px' }}
                  className="w-10 h-10 rounded-full bg-gold-metallic border-2 border-[#FFE89C] flex items-center justify-center shadow-md"
                >
                  {getEventIcon(event.icon)}
                </motion.div>
              </div>

              {/* Event Content Card */}
              <div className={`w-full md:w-[45%] pl-12 md:pl-0 ${isLeft ? 'md:mr-auto' : 'md:ml-auto'}`}>
                <motion.div
                  initial={{ x: isLeft ? -50 : 50, opacity: 0 }}
                  whileInView={{ x: 0, opacity: 1 }}
                  viewport={{ once: true, margin: '-50px' }}
                  transition={{ duration: 0.6, type: 'spring', stiffness: 100 }}
                  className="royal-card p-6 border border-[#D4AF37]/30 bg-[#FDFBF7]/95 hover:shadow-[0_12px_24px_rgba(128,0,0,0.1)] transition-all duration-300 relative group"
                >
                  {/* Subtle decorative gold line on hover */}
                  <div className="absolute bottom-0 left-0 right-0 h-1 bg-[#D4AF37] scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-center rounded-b-xl"></div>
                  
                  {/* Event Title (Gujarati + English) */}
                  <div className="flex flex-col mb-3">
                    <span className="text-[#800000] font-gujarati text-xl font-bold">
                      {event.title_gu}
                    </span>
                    <span className="text-gray-500 font-outfit text-xs font-semibold uppercase tracking-wider mt-[2px]">
                      {event.title_en}
                    </span>
                  </div>

                  {/* Event Meta (Date, Time, Venue) */}
                  <div className="space-y-1.5 text-xs text-gray-600 font-outfit border-b border-dashed border-[#D4AF37]/20 pb-3 mb-3">
                    <div className="flex items-center space-x-2">
                      <Clock className="w-3.5 h-3.5 text-[#9B111E]" />
                      <span className="font-semibold text-gray-800">{event.time}</span>
                      <span className="text-[#D4AF37]">•</span>
                      <span>{formattedDate}</span>
                    </div>
                    <div className="flex items-start space-x-2">
                      <MapPin className="w-3.5 h-3.5 text-[#9B111E] mt-0.5" />
                      <span className="text-gray-700 font-medium">{event.venue}</span>
                    </div>
                  </div>

                  {/* Event Description (Gujarati + English) */}
                  <div className="space-y-2 text-xs md:text-sm">
                    <p className="text-gray-800 font-gujarati leading-relaxed">
                      {event.description_gu}
                    </p>
                    {event.description_en && (
                      <p className="text-gray-500 italic leading-relaxed">
                        &ldquo;{event.description_en}&rdquo;
                      </p>
                    )}
                  </div>
                </motion.div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
