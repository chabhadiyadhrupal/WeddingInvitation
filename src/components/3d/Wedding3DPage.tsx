'use client';

import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Sparkles,
  Heart,
  Volume2,
  VolumeX,
  Calendar,
  MapPin,
  Clock,
  Send,
  X,
  ChevronDown,
  Navigation,
  CheckCircle,
  Share2,
} from 'lucide-react';
import WeddingScene3D from './WeddingScene3D';
import LoadingScreen3D from './LoadingScreen3D';

export default function Wedding3DPage() {
  const [isLoading, setIsLoading] = useState(true);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [activeSection, setActiveSection] = useState(0);
  const [isPlayingMusic, setIsPlayingMusic] = useState(false);
  const [showRsvpModal, setShowRsvpModal] = useState(false);
  const [rsvpSubmitted, setRsvpSubmitted] = useState(false);

  // RSVP Form State
  const [rsvpName, setRsvpName] = useState('');
  const [rsvpPhone, setRsvpPhone] = useState('');
  const [rsvpGuests, setRsvpGuests] = useState('2');
  const [rsvpNote, setRsvpNote] = useState('');

  const audioRef = useRef<HTMLAudioElement | null>(null);

  const toggleMusic = () => {
    if (!audioRef.current) return;
    if (isPlayingMusic) {
      audioRef.current.pause();
      setIsPlayingMusic(false);
    } else {
      audioRef.current.play().catch(() => {});
      setIsPlayingMusic(true);
    }
  };

  const handleRsvpSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setRsvpSubmitted(true);
    setTimeout(() => {
      setShowRsvpModal(false);
      setRsvpSubmitted(false);
    }, 2500);
  };

  return (
    <div className="relative min-h-screen bg-[#0A070D] text-[#FFFDF9] font-outfit selection:bg-[#800000] selection:text-[#D4AF37] overflow-x-hidden">
      {/* 1. Cinematic Loading Screen */}
      <LoadingScreen3D isLoading={isLoading} />

      {/* Background Shehnai / Wedding MP3 Audio */}
      <audio
        ref={audioRef}
        loop
        src="https://cdn.pixabay.com/download/audio/2022/05/27/audio_1808fbf07a.mp3?filename=indian-traditional-background-music-112347.mp3"
      />

      {/* 2. Top Navigation Bar */}
      <nav className="fixed top-0 left-0 right-0 z-40 px-4 md:px-8 py-4 flex items-center justify-between backdrop-blur-md bg-[#0F0B15]/40 border-b border-[#D4AF37]/20">
        <div className="flex items-center gap-2">
          <span className="text-xl font-bold font-serif text-[#D4AF37] tracking-widest">
            A &amp; K
          </span>
          <span className="hidden sm:inline text-xs text-gray-400 border-l border-[#D4AF37]/30 pl-2">
            Dec 14-15, 2026
          </span>
        </div>

        {/* Scroll Progress Bar indicator */}
        <div className="hidden md:flex items-center gap-3 w-48">
          <div className="flex-1 h-1 bg-gray-800 rounded-full overflow-hidden border border-[#D4AF37]/30">
            <div
              className="h-full bg-gradient-to-r from-[#800000] to-[#D4AF37] transition-all duration-150"
              style={{ width: `${Math.round(scrollProgress * 100)}%` }}
            />
          </div>
          <span className="text-[10px] font-mono text-[#D4AF37]">
            {Math.round(scrollProgress * 100)}%
          </span>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={toggleMusic}
            className="p-2.5 rounded-full bg-[#800000]/60 hover:bg-[#800000] text-[#D4AF37] border border-[#D4AF37]/40 shadow-lg backdrop-blur-sm transition-all cursor-pointer"
            title="Toggle Music"
          >
            {isPlayingMusic ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
          </button>

          <button
            onClick={() => setShowRsvpModal(true)}
            className="bg-gradient-to-r from-[#800000] to-[#B8860B] hover:opacity-90 text-[#FFFDF9] text-xs font-semibold px-4 py-2 rounded-full border border-[#D4AF37]/50 shadow-lg transition-all cursor-pointer"
          >
            RSVP Now
          </button>
        </div>
      </nav>

      {/* 3. 3D WebGL Canvas Component */}
      <WeddingScene3D
        onLoaded={() => setIsLoading(false)}
        onProgressUpdate={(progress, sectionIdx) => {
          setScrollProgress(progress);
          setActiveSection(sectionIdx);
        }}
      />

      {/* 4. Overlay HTML Glassmorphism Cards Container */}
      <div className="absolute inset-0 pointer-events-none z-10">
        
        {/* SECTION 0: HERO */}
        <section className="h-screen flex flex-col justify-center items-center px-4 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1 }}
            className="pointer-events-auto max-w-2xl p-8 rounded-3xl backdrop-blur-md bg-[#0F0B15]/50 border border-[#D4AF37]/30 shadow-2xl relative"
          >
            <p className="text-[#D4AF37] text-xs font-bold uppercase tracking-widest mb-3">
              ॥ શ્રી ગણેશાય નમઃ ॥
            </p>
            <h1 className="text-4xl md:text-7xl font-bold font-serif text-[#FFFDF9] tracking-tight drop-shadow-md">
              Aarav &amp; Kiara
            </h1>
            <p className="text-lg md:text-xl font-serif text-[#D4AF37] italic mt-2">
              “Our Forever Begins”
            </p>
            <div className="my-6 w-24 h-0.5 bg-gradient-to-r from-transparent via-[#D4AF37] to-transparent mx-auto" />
            <p className="text-xs md:text-sm text-gray-300 tracking-wide uppercase">
              December 14 &amp; 15, 2026 • Ahmedabad, Gujarat
            </p>

            {/* Scroll Down Indicator */}
            <div className="mt-8 flex flex-col items-center gap-1 text-gray-400 text-xs animate-bounce">
              <span>Scroll to explore our 3D story</span>
              <ChevronDown className="w-4 h-4 text-[#D4AF37]" />
            </div>
          </motion.div>
        </section>

        {/* SECTION 1: OUR STORY */}
        <section className="h-screen flex items-center justify-start px-6 md:px-16">
          <div className="pointer-events-auto max-w-md p-6 rounded-2xl backdrop-blur-md bg-[#0F0B15]/60 border border-[#D4AF37]/30 shadow-xl">
            <span className="text-xs font-bold text-[#D4AF37] uppercase tracking-widest block mb-2">
              CHAPTER I
            </span>
            <h2 className="text-2xl md:text-3xl font-serif font-bold text-[#FFFDF9] mb-3">
              Our Love Story
            </h2>
            <p className="text-xs md:text-sm text-gray-300 leading-relaxed mb-4">
              From our first glance to endless conversations, every milestone has been filled with love, laughter, and magical memories.
            </p>
            <div className="p-3 rounded-lg bg-[#800000]/40 border border-[#D4AF37]/20 flex items-center gap-3">
              <Sparkles className="w-5 h-5 text-[#FFD700] flex-shrink-0" />
              <p className="text-xs text-[#D4AF37] italic">
                “Look around at the floating golden frames showcasing our favorite moments.”
              </p>
            </div>
          </div>
        </section>

        {/* SECTION 2: WEDDING EVENTS */}
        <section className="h-screen flex items-center justify-end px-6 md:px-16">
          <div className="pointer-events-auto max-w-lg p-6 rounded-2xl backdrop-blur-md bg-[#0F0B15]/60 border border-[#D4AF37]/30 shadow-xl">
            <span className="text-xs font-bold text-[#D4AF37] uppercase tracking-widest block mb-2">
              CHAPTER II
            </span>
            <h2 className="text-2xl md:text-3xl font-serif font-bold text-[#FFFDF9] mb-4">
              Celebration Events
            </h2>

            <div className="space-y-3">
              {[
                { name: 'Haldi Rasam', date: 'Dec 14 • 10:00 AM', venue: 'Royal Sun Garden' },
                { name: 'Mehndi & Sangeet', date: 'Dec 14 • 05:00 PM', venue: 'Emerald Crystal Lawn' },
                { name: 'Wedding Ceremony', date: 'Dec 15 • 11:15 AM', venue: 'Palace Mandap' },
                { name: 'Grand Reception', date: 'Dec 15 • 07:00 PM', venue: 'Heritage Ballroom' },
              ].map((item, idx) => (
                <div
                  key={idx}
                  className="p-3 rounded-xl bg-[#800000]/30 border border-[#D4AF37]/20 flex items-center justify-between text-xs"
                >
                  <div>
                    <h4 className="font-bold text-[#FFFDF9]">{item.name}</h4>
                    <p className="text-gray-400 flex items-center gap-1 mt-0.5">
                      <Clock className="w-3 h-3 text-[#D4AF37]" />
                      <span>{item.date}</span>
                    </p>
                  </div>
                  <span className="text-[11px] text-[#D4AF37] bg-[#D4AF37]/10 px-2.5 py-1 rounded-full border border-[#D4AF37]/30">
                    {item.venue}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* SECTION 3: SACRED MANDAP */}
        <section className="h-screen flex items-center justify-center px-4 text-center">
          <div className="pointer-events-auto max-w-xl p-8 rounded-3xl backdrop-blur-md bg-[#0F0B15]/70 border border-[#D4AF37]/40 shadow-2xl">
            <span className="text-xs font-bold text-[#D4AF37] uppercase tracking-widest block mb-2">
              CHAPTER III
            </span>
            <h2 className="text-3xl md:text-4xl font-serif font-bold text-[#FFFDF9] mb-3">
              The Sacred Mandap &amp; Pheras
            </h2>
            <p className="text-xs md:text-sm text-gray-300 leading-relaxed mb-6">
              Surrounded by four carved golden pillars, holy flames of the Havan Kund, and showering marigold petals, we take the seven sacred steps.
            </p>
            <div className="inline-block px-4 py-2 rounded-full bg-[#800000] border border-[#D4AF37]/50 text-xs font-serif text-[#FFD700]">
              ॥ મંગલમ્ ભગવાન વિષ્ણુ મંગલમ્ ગરુડધ્વજઃ ॥
            </div>
          </div>
        </section>

        {/* SECTION 4: 3D GALLERY */}
        <section className="h-screen flex items-center justify-start px-6 md:px-16">
          <div className="pointer-events-auto max-w-md p-6 rounded-2xl backdrop-blur-md bg-[#0F0B15]/60 border border-[#D4AF37]/30 shadow-xl">
            <span className="text-xs font-bold text-[#D4AF37] uppercase tracking-widest block mb-2">
              CHAPTER IV
            </span>
            <h2 className="text-2xl md:text-3xl font-serif font-bold text-[#FFFDF9] mb-3">
              Photo Gallery
            </h2>
            <p className="text-xs md:text-sm text-gray-300 leading-relaxed mb-4">
              Explore our 3D gallery floating in space. Every photograph holds a precious memory leading up to our big day.
            </p>
            <div className="grid grid-cols-2 gap-2">
              <div className="p-3 rounded-lg bg-black/40 border border-[#D4AF37]/20 text-center">
                <span className="text-xl font-bold text-[#D4AF37] block">50+</span>
                <span className="text-[10px] text-gray-400">Captured Moments</span>
              </div>
              <div className="p-3 rounded-lg bg-black/40 border border-[#D4AF37]/20 text-center">
                <span className="text-xl font-bold text-[#D4AF37] block">4K</span>
                <span className="text-[10px] text-gray-400">Cinematic Quality</span>
              </div>
            </div>
          </div>
        </section>

        {/* SECTION 5: 3D LOCATION MAP */}
        <section className="h-screen flex items-center justify-end px-6 md:px-16">
          <div className="pointer-events-auto max-w-md p-6 rounded-2xl backdrop-blur-md bg-[#0F0B15]/70 border border-[#D4AF37]/40 shadow-xl">
            <span className="text-xs font-bold text-[#D4AF37] uppercase tracking-widest block mb-2">
              CHAPTER V
            </span>
            <h2 className="text-2xl md:text-3xl font-serif font-bold text-[#FFFDF9] mb-2">
              The Venue Location
            </h2>
            <p className="text-xs text-gray-300 mb-4">
              The Royal Heritage Palace, SG Highway, Ahmedabad, Gujarat 380054
            </p>
            <a
              href="https://maps.google.com"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 bg-[#800000] hover:bg-[#9B111E] text-[#D4AF37] font-semibold text-xs py-2.5 px-5 rounded-full border border-[#D4AF37]/40 shadow transition-all"
            >
              <Navigation className="w-4 h-4" />
              <span>Get Directions on Google Maps</span>
            </a>
          </div>
        </section>

        {/* SECTION 6: FINAL & RSVP */}
        <section className="h-screen flex flex-col justify-center items-center px-4 text-center">
          <div className="pointer-events-auto max-w-xl p-8 rounded-3xl backdrop-blur-md bg-[#0F0B15]/80 border border-[#D4AF37]/50 shadow-2xl">
            <Heart className="w-10 h-10 text-[#800000] mx-auto mb-3 fill-current animate-pulse" />
            <h2 className="text-3xl md:text-5xl font-serif font-bold text-[#FFFDF9] mb-3">
              We Can&apos;t Wait to Celebrate!
            </h2>
            <p className="text-xs md:text-sm text-gray-300 max-w-md mx-auto mb-6">
              Your presence will add warmth, blessings, and joy to our auspicious wedding celebration.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <button
                onClick={() => setShowRsvpModal(true)}
                className="bg-gradient-to-r from-[#800000] via-[#B8860B] to-[#800000] hover:opacity-90 text-[#FFFDF9] font-semibold text-xs md:text-sm py-3 px-8 rounded-full border border-[#D4AF37]/60 shadow-xl transition-all cursor-pointer"
              >
                Confirm Your Presence (RSVP)
              </button>
            </div>
          </div>
        </section>
      </div>

      {/* 5. RSVP Modal Form */}
      <AnimatePresence>
        {showRsvpModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-md">
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="relative w-full max-w-lg p-6 md:p-8 rounded-3xl bg-[#0F0B15] border border-[#D4AF37]/40 shadow-2xl text-[#FFFDF9]"
            >
              <button
                onClick={() => setShowRsvpModal(false)}
                className="absolute top-4 right-4 p-2 text-gray-400 hover:text-white rounded-full bg-gray-900/60"
              >
                <X className="w-5 h-5" />
              </button>

              {rsvpSubmitted ? (
                <div className="text-center py-8 space-y-4">
                  <CheckCircle className="w-16 h-16 text-[#FFD700] mx-auto" />
                  <h3 className="text-2xl font-serif font-bold text-[#FFFDF9]">
                    Thank You, {rsvpName}!
                  </h3>
                  <p className="text-xs text-gray-300">
                    Your presence confirmation has been received. Aarav &amp; Kiara are looking forward to welcoming you!
                  </p>
                </div>
              ) : (
                <form onSubmit={handleRsvpSubmit} className="space-y-4">
                  <div className="text-center mb-4">
                    <span className="text-xs font-bold text-[#D4AF37] uppercase tracking-widest">
                      ॥ શુભ હાજરી પત્રક ॥
                    </span>
                    <h3 className="text-2xl font-serif font-bold text-[#FFFDF9] mt-1">
                      RSVP Invitation
                    </h3>
                  </div>

                  <div>
                    <label className="block text-xs text-gray-300 mb-1">Your Full Name *</label>
                    <input
                      type="text"
                      required
                      value={rsvpName}
                      onChange={(e) => setRsvpName(e.target.value)}
                      placeholder="e.g. Rajesh Kumar"
                      className="w-full px-4 py-2.5 rounded-xl bg-gray-900/80 border border-[#D4AF37]/30 text-xs text-white focus:outline-none focus:border-[#D4AF37]"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs text-gray-300 mb-1">Phone Number</label>
                      <input
                        type="tel"
                        value={rsvpPhone}
                        onChange={(e) => setRsvpPhone(e.target.value)}
                        placeholder="+91 98765 43210"
                        className="w-full px-4 py-2.5 rounded-xl bg-gray-900/80 border border-[#D4AF37]/30 text-xs text-white focus:outline-none focus:border-[#D4AF37]"
                      />
                    </div>
                    <div>
                      <label className="block text-xs text-gray-300 mb-1">Total Guests</label>
                      <select
                        value={rsvpGuests}
                        onChange={(e) => setRsvpGuests(e.target.value)}
                        className="w-full px-4 py-2.5 rounded-xl bg-gray-900/80 border border-[#D4AF37]/30 text-xs text-white focus:outline-none focus:border-[#D4AF37]"
                      >
                        <option value="1">1 Person</option>
                        <option value="2">2 Persons</option>
                        <option value="3">3 Persons</option>
                        <option value="4+">4+ Persons</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs text-gray-300 mb-1">Warm Wishes / Notes</label>
                    <textarea
                      rows={3}
                      value={rsvpNote}
                      onChange={(e) => setRsvpNote(e.target.value)}
                      placeholder="Share your loving wishes for the couple..."
                      className="w-full px-4 py-2.5 rounded-xl bg-gray-900/80 border border-[#D4AF37]/30 text-xs text-white focus:outline-none focus:border-[#D4AF37]"
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full py-3 rounded-xl bg-gradient-to-r from-[#800000] to-[#B8860B] text-[#FFFDF9] font-bold text-xs shadow-lg border border-[#D4AF37]/40 flex items-center justify-center gap-2 cursor-pointer hover:opacity-90"
                  >
                    <Send className="w-4 h-4" />
                    <span>Submit RSVP</span>
                  </button>
                </form>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
