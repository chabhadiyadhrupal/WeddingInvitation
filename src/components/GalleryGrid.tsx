'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ZoomIn, ChevronLeft, ChevronRight } from 'lucide-react';
import { GalleryItem } from '@/lib/db';

const motionImport = motion;
const AnimatePresenceImport = AnimatePresence;

interface GalleryGridProps {
  items: GalleryItem[];
}

export default function GalleryGrid({ items }: GalleryGridProps) {
  const [selectedIdx, setSelectedIdx] = useState<number | null>(null);

  const sortedItems = [...items].sort((a, b) => a.order - b.order);

  const handlePrev = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (selectedIdx === null) return;
    setSelectedIdx(selectedIdx === 0 ? sortedItems.length - 1 : selectedIdx - 1);
  };

  const handleNext = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (selectedIdx === null) return;
    setSelectedIdx(selectedIdx === sortedItems.length - 1 ? 0 : selectedIdx + 1);
  };

  return (
    <div className="w-full max-w-5xl mx-auto px-4 py-8 select-none">
      {/* Masonry-like CSS Grid */}
      <div className="columns-1 sm:columns-2 md:columns-3 lg:columns-4 gap-4 space-y-4">
        {sortedItems.map((item, idx) => (
          <motionImport.div
            key={item.id}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: idx * 0.05 }}
            className="break-inside-avoid relative overflow-hidden rounded-xl border-2 border-[#D4AF37]/20 group cursor-pointer shadow-sm hover:shadow-md transition-shadow duration-300"
            onClick={() => setSelectedIdx(idx)}
          >
            {/* Image zoom on hover */}
            <img
              src={item.url}
              alt={item.caption || "Wedding Gallery"}
              className="w-full h-auto object-cover transform group-hover:scale-105 transition-transform duration-500 rounded-lg"
            />
            
            {/* Dark glass overlay with zoom icon and caption */}
            <div className="absolute inset-0 bg-[#4A0E17]/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-between p-4">
              <div className="flex justify-end">
                <span className="p-1.5 rounded-full bg-white/20 backdrop-blur-sm text-[#FFE89C] border border-white/10">
                  <ZoomIn className="w-4 h-4" />
                </span>
              </div>
              {item.caption && (
                <p className="text-white text-xs font-semibold font-outfit truncate bg-[#800000]/60 px-2 py-1 rounded-md border border-[#D4AF37]/20 self-start">
                  {item.caption}
                </p>
              )}
            </div>
          </motionImport.div>
        ))}
      </div>

      {/* Lightbox Modal */}
      <AnimatePresenceImport>
        {selectedIdx !== null && (
          <motionImport.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-[#100305]/95 backdrop-blur-md flex items-center justify-center p-4 cursor-zoom-out"
            onClick={() => setSelectedIdx(null)}
          >
            {/* Close Button */}
            <button
              onClick={() => setSelectedIdx(null)}
              className="absolute top-6 right-6 w-10 h-10 rounded-full bg-white/10 text-white flex items-center justify-center hover:bg-white/20 border border-white/10 cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Navigation Buttons */}
            <button
              onClick={handlePrev}
              className="absolute left-4 w-12 h-12 rounded-full bg-white/10 text-white flex items-center justify-center hover:bg-white/20 border border-white/10 cursor-pointer"
            >
              <ChevronLeft className="w-6 h-6" />
            </button>

            <button
              onClick={handleNext}
              className="absolute right-4 w-12 h-12 rounded-full bg-white/10 text-white flex items-center justify-center hover:bg-white/20 border border-white/10 cursor-pointer"
            >
              <ChevronRight className="w-6 h-6" />
            </button>

            {/* Lightbox Image Container */}
            <div className="max-w-4xl max-h-[80vh] flex flex-col items-center cursor-default" onClick={e => e.stopPropagation()}>
              <motionImport.img
                key={selectedIdx}
                initial={{ scale: 0.95, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.95, opacity: 0 }}
                transition={{ duration: 0.3 }}
                src={sortedItems[selectedIdx].url}
                alt={sortedItems[selectedIdx].caption}
                className="max-w-full max-h-[70vh] object-contain rounded-lg border-2 border-[#D4AF37]"
              />
              {sortedItems[selectedIdx].caption && (
                <p className="text-[#FFE89C] text-sm md:text-base font-medium font-outfit mt-4 bg-[#800000]/80 px-4 py-1.5 rounded-full border border-[#D4AF37]/30 shadow-md">
                  {sortedItems[selectedIdx].caption}
                </p>
              )}
            </div>
          </motionImport.div>
        )}
      </AnimatePresenceImport>
    </div>
  );
}
