'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Heart,
  Calendar,
  Clock,
  MapPin,
  Sparkles,
  Volume2,
  VolumeX,
  Navigation,
  Send,
  Share2,
  CheckCircle2,
  Gift,
  Copy,
  Check,
  ChevronRight,
  Music,
  Camera,
  MessageSquare,
  UserCheck,
} from 'lucide-react';
import GaneshSplash from './GaneshSplash';
import AudioPlayer from './AudioPlayer';
import FlowerRain from './FlowerRain';
import ToranDecoration from './ToranDecoration';
import CountdownTimer from './CountdownTimer';

export default function CinematicLuxuryPage() {
  const [entered, setEntered] = useState(false);
  const [isPlayingMusic, setIsPlayingMusic] = useState(false);
  const [showRsvpModal, setShowRsvpModal] = useState(false);
  const [showGiftModal, setShowGiftModal] = useState(false);
  const [copiedGiftText, setCopiedGiftText] = useState(false);
  const [activeTab, setActiveTab] = useState<'all' | 'prewedding' | 'ceremony'>('all');
  const [blessings, setBlessings] = useState([
    { name: 'Ramesh Bhai & Family', text: 'Wishing both of you a lifetime of love, joy, and togetherness! May Lord Ganesha bless this union.', date: 'Today' },
    { name: 'Pooja & Sameer', text: 'Super excited for the Sangeet night! Aarav & Kiara look so made for each other.', date: 'Yesterday' },
  ]);
  const [newBlessingName, setNewBlessingName] = useState('');
  const [newBlessingMessage, setNewBlessingMessage] = useState('');
  const [blessingSubmitted, setBlessingSubmitted] = useState(false);

  // RSVP state
  const [rsvpName, setRsvpName] = useState('');
  const [rsvpGuests, setRsvpGuests] = useState('2');
  const [rsvpSubmitted, setRsvpSubmitted] = useState(false);

  const couple = {
    groom_name: 'Aarav',
    bride_name: 'Kiara',
    groom_full: 'Aarav Patel',
    bride_full: 'Kiara Shah',
    wedding_date: '2026-12-15T11:15:00',
    formatted_date: 'December 15, 2026',
    venue_name: 'The Royal Heritage Palace',
    venue_city: 'Ahmedabad, Gujarat',
    venue_address: 'SG Highway, Bodakdev, Ahmedabad - 380054',
  };

  const galleryImages = [
    {
      url: 'https://images.unsplash.com/photo-1583939003579-730e3918a45a?auto=format&fit=crop&w=800&q=80',
      title: 'Royal Pre-Wedding Shoot',
      category: 'prewedding',
    },
    {
      url: 'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=800&q=80',
      title: 'First Glance Together',
      category: 'prewedding',
    },
    {
      url: 'https://images.unsplash.com/photo-1511285560929-80b456fea0bc?auto=format&fit=crop&w=800&q=80',
      title: 'Traditional Garba & Sangeet',
      category: 'ceremony',
    },
    {
      url: 'https://images.unsplash.com/photo-1606800052052-a08af7148866?auto=format&fit=crop&w=800&q=80',
      title: 'Sacred Mandap Setup',
      category: 'ceremony',
    },
  ];

  const filteredGallery = activeTab === 'all'
    ? galleryImages
    : galleryImages.filter((img) => img.category === activeTab);

  const handleAddBlessing = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newBlessingName || !newBlessingMessage) return;
    setBlessings([
      { name: newBlessingName, text: newBlessingMessage, date: 'Just now' },
      ...blessings,
    ]);
    setNewBlessingName('');
    setNewBlessingMessage('');
    setBlessingSubmitted(true);
    setTimeout(() => setBlessingSubmitted(false), 3000);
  };

  const handleRsvp = (e: React.FormEvent) => {
    e.preventDefault();
    setRsvpSubmitted(true);
    setTimeout(() => {
      setShowRsvpModal(false);
      setRsvpSubmitted(false);
    }, 2000);
  };

  return (
    <div className="relative min-h-screen bg-[#FDFBF7] text-gray-800 font-outfit selection:bg-[#800000] selection:text-[#D4AF37] overflow-x-hidden">
      
      {/* 1. Auspicious Ganesh Splash Welcome Screen */}
      <AnimatePresence>
        {!entered && (
          <GaneshSplash
            onEnter={() => setEntered(true)}
          />
        )}
      </AnimatePresence>

      {/* Floating Petal Rain animation */}
      <FlowerRain />

      {/* Top Garland Decoration */}
      <ToranDecoration />

      {/* Floating Audio Player */}
      <div className="fixed bottom-6 right-6 z-40">
        <AudioPlayer
          url="https://cdn.pixabay.com/download/audio/2022/05/27/audio_1808fbf07a.mp3?filename=indian-traditional-background-music-112347.mp3"
          autoPlay={entered}
          triggerPlay={entered}
        />
      </div>

      {/* Fixed Sticky Header Navbar */}
      <motion.nav
        initial={{ y: -50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="sticky top-0 z-30 bg-[#FDFBF7]/90 backdrop-blur-md border-b border-[#D4AF37]/30 px-4 md:px-8 py-3.5 flex items-center justify-between shadow-sm"
      >
        <div className="flex items-center gap-2">
          <span className="text-xl font-bold font-serif text-[#800000] tracking-wide">
            {couple.groom_name} &amp; {couple.bride_name}
          </span>
          <span className="hidden sm:inline text-xs text-[#D4AF37] font-serif border-l border-[#D4AF37]/40 pl-2">
            15th Dec 2026
          </span>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setShowRsvpModal(true)}
            className="bg-[#800000] hover:bg-[#9B111E] text-[#D4AF37] font-semibold text-xs py-2 px-5 rounded-full border border-[#D4AF37]/40 shadow transition-all cursor-pointer flex items-center gap-1.5"
          >
            <UserCheck className="w-3.5 h-3.5" />
            <span>RSVP</span>
          </button>
        </div>
      </motion.nav>

      {/* HERO SECTION */}
      <header className="relative min-h-[92vh] flex flex-col justify-center items-center px-4 pt-12 pb-16 text-center z-10">
        {/* Shloka Header */}
        <motion.p
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-[#800000] font-bold text-xs md:text-sm tracking-widest uppercase mb-4"
        >
          ॥ શ્રી ગણેશાય નમઃ ॥
        </motion.p>

        {/* Main Title Banner */}
        <motion.div
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 1 }}
          className="max-w-3xl"
        >
          <h2 className="text-sm md:text-base font-serif text-[#D4AF37] font-bold tracking-widest uppercase mb-2">
            Save The Date For The Wedding Of
          </h2>

          <h1 className="text-5xl md:text-8xl font-bold font-serif text-[#800000] tracking-tight drop-shadow-sm leading-tight">
            {couple.groom_name} <span className="text-[#D4AF37] font-serif font-light">&amp;</span> {couple.bride_name}
          </h1>

          <p className="text-gray-600 text-xs md:text-sm italic font-serif mt-3 max-w-md mx-auto">
            “Two hearts, two souls, united in love and blessed by traditions forever.”
          </p>

          {/* Golden Divider */}
          <div className="flex items-center justify-center gap-3 my-6">
            <div className="w-16 h-0.5 bg-gradient-to-r from-transparent to-[#D4AF37]" />
            <Sparkles className="w-5 h-5 text-[#D4AF37]" />
            <div className="w-16 h-0.5 bg-gradient-to-l from-transparent to-[#D4AF37]" />
          </div>

          <p className="text-sm md:text-lg font-semibold text-[#800000] font-serif uppercase tracking-wider">
            {couple.formatted_date}
          </p>
          <p className="text-xs text-gray-500 mt-1">
            {couple.venue_name}, {couple.venue_city}
          </p>
        </motion.div>

        {/* Countdown Timer */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="mt-10 w-full max-w-xl"
        >
          <CountdownTimer targetDate={couple.wedding_date} />
        </motion.div>
      </header>

      {/* BRIDE & GROOM PROFILE SECTION */}
      <section className="py-16 px-4 max-w-6xl mx-auto z-10 relative">
        <div className="text-center mb-12">
          <span className="text-xs font-bold text-[#D4AF37] uppercase tracking-widest">
            THE COUPLE
          </span>
          <h2 className="text-3xl md:text-4xl font-serif font-bold text-[#800000] mt-1">
            Meet Aarav &amp; Kiara
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Groom Card */}
          <motion.div
            whileHover={{ y: -6 }}
            className="royal-card p-8 bg-[#FDFBF7] border border-[#D4AF37]/30 rounded-3xl shadow-xl text-center relative overflow-hidden"
          >
            <div className="w-36 h-36 mx-auto rounded-full p-1 bg-gradient-to-tr from-[#800000] via-[#D4AF37] to-[#800000] shadow-md mb-6">
              <img
                src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80"
                alt="Aarav Patel"
                className="w-full h-full object-cover rounded-full"
              />
            </div>
            <h3 className="text-2xl font-serif font-bold text-[#800000]">Aarav Patel</h3>
            <p className="text-xs font-serif text-[#D4AF37] uppercase font-bold tracking-wider mt-1">
              The Groom
            </p>
            <p className="text-gray-600 text-xs mt-3 leading-relaxed">
              Son of Mrs. Alka &amp; Mr. Ramesh Patel. An ambitious software architect with a passionate heart for traditional music &amp; travel.
            </p>
          </motion.div>

          {/* Bride Card */}
          <motion.div
            whileHover={{ y: -6 }}
            className="royal-card p-8 bg-[#FDFBF7] border border-[#D4AF37]/30 rounded-3xl shadow-xl text-center relative overflow-hidden"
          >
            <div className="w-36 h-36 mx-auto rounded-full p-1 bg-gradient-to-tr from-[#800000] via-[#D4AF37] to-[#800000] shadow-md mb-6">
              <img
                src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80"
                alt="Kiara Shah"
                className="w-full h-full object-cover rounded-full"
              />
            </div>
            <h3 className="text-2xl font-serif font-bold text-[#800000]">Kiara Shah</h3>
            <p className="text-xs font-serif text-[#D4AF37] uppercase font-bold tracking-wider mt-1">
              The Bride
            </p>
            <p className="text-gray-600 text-xs mt-3 leading-relaxed">
              Daughter of Mrs. Nita &amp; Mr. Mahendra Shah. A creative interior designer with an endearing smile and love for classical art.
            </p>
          </motion.div>
        </div>
      </section>

      {/* WEDDING EVENTS TIMELINE */}
      <section className="py-16 px-4 bg-amber-50/40 border-y border-[#D4AF37]/20 relative z-10">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <span className="text-xs font-bold text-[#D4AF37] uppercase tracking-widest">
              ITINERARY
            </span>
            <h2 className="text-3xl md:text-4xl font-serif font-bold text-[#800000] mt-1">
              Wedding Celebrations
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                title: 'Haldi Rasam',
                date: 'Dec 14, 2026',
                time: '10:00 AM Onwards',
                venue: 'Royal Sun Lawn',
                desc: 'A vibrant morning of yellow hues, auspicious turmeric, and happy laughter.',
              },
              {
                title: 'Mehndi & Sangeet',
                date: 'Dec 14, 2026',
                time: '05:00 PM Onwards',
                venue: 'Crystal Ballroom',
                desc: 'Intricate henna designs, traditional folk songs, and energetic Garba performances.',
              },
              {
                title: 'Lagna Vidhi (Wedding)',
                date: 'Dec 15, 2026',
                time: '11:15 AM Hast Melap',
                venue: 'The Palace Mandap',
                desc: 'The sacred 7 Pheras, Vedic mantras, and divine blessings of elders.',
              },
              {
                title: 'Grand Reception',
                date: 'Dec 15, 2026',
                time: '07:00 PM Onwards',
                venue: 'Royal Heritage Lawn',
                desc: 'A glittering evening dinner celebration welcoming the newly married couple.',
              },
            ].map((evt, idx) => (
              <motion.div
                key={idx}
                whileHover={{ y: -4 }}
                className="bg-[#FDFBF7] p-6 rounded-2xl border border-[#D4AF37]/30 shadow-md flex flex-col justify-between"
              >
                <div>
                  <div className="w-10 h-10 rounded-full bg-[#800000]/10 text-[#800000] flex items-center justify-center font-bold text-sm mb-4">
                    0{idx + 1}
                  </div>
                  <h3 className="text-lg font-serif font-bold text-[#800000] mb-1">
                    {evt.title}
                  </h3>
                  <p className="text-xs font-semibold text-[#D4AF37] flex items-center gap-1 mb-2">
                    <Calendar className="w-3.5 h-3.5" />
                    <span>{evt.date} • {evt.time}</span>
                  </p>
                  <p className="text-xs text-gray-600 leading-relaxed mb-4">
                    {evt.desc}
                  </p>
                </div>
                <div className="pt-3 border-t border-[#D4AF37]/20 flex items-center justify-between text-xs">
                  <span className="text-gray-500 flex items-center gap-1">
                    <MapPin className="w-3 h-3 text-[#800000]" />
                    <span>{evt.venue}</span>
                  </span>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* GALLERY SECTION */}
      <section className="py-16 px-4 max-w-6xl mx-auto z-10 relative">
        <div className="text-center mb-10">
          <span className="text-xs font-bold text-[#D4AF37] uppercase tracking-widest">
            MEMORIES
          </span>
          <h2 className="text-3xl md:text-4xl font-serif font-bold text-[#800000] mt-1">
            Photo Gallery
          </h2>

          {/* Filter Tabs */}
          <div className="flex justify-center gap-2 mt-6">
            {(['all', 'prewedding', 'ceremony'] as const).map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-5 py-2 rounded-full text-xs font-semibold uppercase tracking-wider border transition-all cursor-pointer ${
                  activeTab === tab
                    ? 'bg-[#800000] text-[#D4AF37] border-[#D4AF37]'
                    : 'bg-white text-gray-600 border-gray-200 hover:border-[#D4AF37]'
                }`}
              >
                {tab === 'all' ? 'All Photos' : tab === 'prewedding' ? 'Pre-Wedding' : 'Ceremony'}
              </button>
            ))}
          </div>
        </div>

        {/* Gallery Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {filteredGallery.map((img, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.4, delay: idx * 0.1 }}
              whileHover={{ scale: 1.03 }}
              className="relative group rounded-2xl overflow-hidden shadow-lg border border-[#D4AF37]/30 bg-black aspect-[4/5]"
            >
              <img
                src={img.url}
                alt={img.title}
                className="w-full h-full object-cover opacity-90 group-hover:opacity-100 transition-opacity duration-300"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-4">
                <p className="text-white text-xs font-bold font-serif">{img.title}</p>
                <p className="text-[#D4AF37] text-[10px] uppercase">{img.category}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* VENUE LOCATION & MAP */}
      <section className="py-16 px-4 bg-amber-50/50 border-t border-[#D4AF37]/20 z-10 relative">
        <div className="max-w-4xl mx-auto text-center">
          <span className="text-xs font-bold text-[#D4AF37] uppercase tracking-widest">
            LOCATION
          </span>
          <h2 className="text-3xl md:text-4xl font-serif font-bold text-[#800000] mt-1 mb-4">
            Wedding Venue &amp; Map
          </h2>

          <div className="royal-card p-8 bg-[#FDFBF7] border border-[#D4AF37]/30 rounded-3xl shadow-xl max-w-xl mx-auto">
            <div className="w-12 h-12 rounded-full bg-[#800000]/10 text-[#800000] flex items-center justify-center mx-auto mb-4">
              <MapPin className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-serif font-bold text-[#800000]">
              {couple.venue_name}
            </h3>
            <p className="text-xs text-gray-600 mt-1 mb-6">
              {couple.venue_address}
            </p>

            <a
              href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(couple.venue_name + ' ' + couple.venue_city)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 bg-[#800000] hover:bg-[#9B111E] text-[#D4AF37] font-semibold text-xs py-3 px-8 rounded-full border border-[#D4AF37]/40 shadow transition-all cursor-pointer"
            >
              <Navigation className="w-4 h-4" />
              <span>Get Directions on Google Maps</span>
            </a>
          </div>
        </div>
      </section>

      {/* BLESSINGS WALL & WISHES */}
      <section className="py-16 px-4 max-w-4xl mx-auto z-10 relative">
        <div className="text-center mb-10">
          <span className="text-xs font-bold text-[#D4AF37] uppercase tracking-widest">
            BLESSINGS
          </span>
          <h2 className="text-3xl md:text-4xl font-serif font-bold text-[#800000] mt-1">
            Wishes &amp; Blessings Wall
          </h2>
        </div>

        {/* Add Wish Form */}
        <div className="royal-card p-6 bg-[#FDFBF7] border border-[#D4AF37]/30 rounded-2xl shadow-md mb-8">
          <form onSubmit={handleAddBlessing} className="space-y-3">
            <input
              type="text"
              required
              placeholder="Your Name (e.g. Uncle Ramesh)"
              value={newBlessingName}
              onChange={(e) => setNewBlessingName(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-xs focus:outline-none focus:border-[#800000]"
            />
            <textarea
              rows={3}
              required
              placeholder="Write your heartiest blessings for Aarav & Kiara..."
              value={newBlessingMessage}
              onChange={(e) => setNewBlessingMessage(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-xs focus:outline-none focus:border-[#800000]"
            />
            <button
              type="submit"
              className="w-full py-3 bg-[#800000] hover:bg-[#9B111E] text-[#D4AF37] font-semibold text-xs rounded-xl shadow border border-[#D4AF37]/30 transition-all cursor-pointer flex items-center justify-center gap-2"
            >
              <Send className="w-3.5 h-3.5" />
              <span>Send Loving Blessings</span>
            </button>
          </form>
        </div>

        {/* Blessings List */}
        <div className="space-y-4">
          {blessings.map((b, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="p-5 rounded-2xl bg-white border border-[#D4AF37]/20 shadow-sm"
            >
              <div className="flex justify-between items-center mb-1">
                <h4 className="font-bold text-[#800000] text-sm">{b.name}</h4>
                <span className="text-[10px] text-gray-400">{b.date}</span>
              </div>
              <p className="text-xs text-gray-600 italic">“{b.text}”</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* FOOTER */}
      <footer className="py-12 px-4 bg-[#800000] text-[#D4AF37] text-center z-10 relative">
        <p className="text-xs uppercase font-serif tracking-widest mb-2">
          ॥ શુભ વિવાહ ॥
        </p>
        <h3 className="text-2xl font-serif font-bold text-white">
          Aarav &amp; Kiara
        </h3>
        <p className="text-xs text-amber-200 mt-2">
          We look forward to welcoming you with joy and love!
        </p>
      </footer>

      {/* RSVP MODAL */}
      <AnimatePresence>
        {showRsvpModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="relative w-full max-w-md p-6 bg-[#FDFBF7] border border-[#D4AF37]/40 rounded-3xl shadow-2xl"
            >
              <button
                onClick={() => setShowRsvpModal(false)}
                className="absolute top-4 right-4 p-1.5 text-gray-400 hover:text-gray-600 rounded-full"
              >
                ✕
              </button>

              {rsvpSubmitted ? (
                <div className="text-center py-6 space-y-3">
                  <CheckCircle2 className="w-12 h-12 text-[#800000] mx-auto" />
                  <h3 className="text-xl font-serif font-bold text-[#800000]">
                    RSVP Confirmed!
                  </h3>
                  <p className="text-xs text-gray-600">
                    Thank you, {rsvpName}. We can&apos;t wait to see you at the wedding!
                  </p>
                </div>
              ) : (
                <form onSubmit={handleRsvp} className="space-y-4">
                  <div className="text-center">
                    <span className="text-xs font-bold text-[#D4AF37] uppercase tracking-widest">
                      CONFIRM ATTENDANCE
                    </span>
                    <h3 className="text-2xl font-serif font-bold text-[#800000] mt-1">
                      RSVP Form
                    </h3>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-1">
                      Your Full Name *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Ramesh Patel"
                      value={rsvpName}
                      onChange={(e) => setRsvpName(e.target.value)}
                      className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-xs focus:outline-none focus:border-[#800000]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-1">
                      Number of Guests Attending
                    </label>
                    <select
                      value={rsvpGuests}
                      onChange={(e) => setRsvpGuests(e.target.value)}
                      className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-xs focus:outline-none focus:border-[#800000]"
                    >
                      <option value="1">1 Person</option>
                      <option value="2">2 Persons</option>
                      <option value="3">3 Persons</option>
                      <option value="4+">4+ Persons</option>
                    </select>
                  </div>

                  <button
                    type="submit"
                    className="w-full py-3 bg-[#800000] hover:bg-[#9B111E] text-[#D4AF37] font-semibold text-xs rounded-xl shadow border border-[#D4AF37]/30 transition-all cursor-pointer"
                  >
                    Confirm Presence
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
