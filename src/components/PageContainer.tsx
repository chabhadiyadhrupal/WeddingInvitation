'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Heart, MapPin, Sparkles, Navigation, Calendar } from 'lucide-react';
import GaneshSplash from './GaneshSplash';
import AudioPlayer from './AudioPlayer';
import FlowerRain from './FlowerRain';
import MandalaBackground from './MandalaBackground';
import ToranDecoration from './ToranDecoration';
import CountdownTimer from './CountdownTimer';
import KankotriSection from './KankotriSection';
import TimelineEvents from './TimelineEvents';
import GalleryGrid from './GalleryGrid';
import RSVPForm from './RSVPForm';
import BlessingsWall from './BlessingsWall';
import ShareInvitation from './ShareInvitation';
import { WeddingSettings, CoupleInfo, WeddingEvent, GalleryItem, FamilyMember, LoveStoryMilestone, Wish } from '@/lib/db';

interface PageContainerProps {
  settings: WeddingSettings;
  couple: CoupleInfo;
  events: WeddingEvent[];
  gallery: GalleryItem[];
  family: FamilyMember[];
  loveStory: LoveStoryMilestone[];
  wishes: Wish[];
  slug?: string;
}

export default function PageContainer({
  settings,
  couple,
  events,
  gallery,
  family,
  loveStory,
  wishes,
  slug
}: PageContainerProps) {
  const [entered, setEntered] = useState(false);
  const [guestName, setGuestName] = useState('');
  const [guestLocation, setGuestLocation] = useState('');
  const [showGiftModal, setShowGiftModal] = useState(false);
  const [copiedGiftText, setCopiedGiftText] = useState(false);

  React.useEffect(() => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      const to = params.get('to') || params.get('guest');
      const loc = params.get('loc') || params.get('location') || params.get('city');
      setTimeout(() => {
        if (to) setGuestName(to);
        if (loc) setGuestLocation(loc);
      }, 0);
    }
  }, []);

  // Group family by side
  const groomFamily = family.filter(f => f.side === 'groom');
  const brideFamily = family.filter(f => f.side === 'bride');

  // Helper to convert hex to rgb for opacity overrides
  const hexToRgb = (hex: string) => {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? {
      r: parseInt(result[1], 16),
      g: parseInt(result[2], 16),
      b: parseInt(result[3], 16)
    } : { r: 128, g: 0, b: 0 };
  };

  const primary = settings.theme_colors?.primary || '#800000';
  const secondary = settings.theme_colors?.secondary || '#D4AF37';
  const accent = settings.theme_colors?.accent || '#9B111E';
  const bg = settings.theme_colors?.bg || '#FDFBF7';

  const pRgb = hexToRgb(primary);
  const sRgb = hexToRgb(secondary);
  const aRgb = hexToRgb(accent);
  const bgRgb = hexToRgb(bg);

  return (
    <>
      <style>{`
        :root {
          --color-primary: ${primary};
          --color-secondary: ${secondary};
          --color-accent: ${accent};
          --color-bg: ${bg};
        }

        /* Solid Overrides */
        .text-\[\#800000\] { color: ${primary} !important; }
        .bg-\[\#800000\] { background-color: ${primary} !important; }
        .border-\[\#800000\] { border-color: ${primary} !important; }
        .hover\:bg-\[\#800000\]:hover { background-color: ${primary} !important; }
        .hover\:text-\[\#800000\]:hover { color: ${primary} !important; }
        .focus\:ring-\[\#800000\]:focus { --tw-ring-color: ${primary} !important; }
        .focus\:border-\[\#800000\]:focus { border-color: ${primary} !important; }
        .selection\:bg-\[\#800000\] *::selection { background-color: ${primary} !important; }
        .selection\:bg-\[\#800000\]::selection { background-color: ${primary} !important; }

        .text-\[\#D4AF37\] { color: ${secondary} !important; }
        .bg-\[\#D4AF37\] { background-color: ${secondary} !important; }
        .border-\[\#D4AF37\] { border-color: ${secondary} !important; }
        .hover\:text-\[\#D4AF37\]:hover { color: ${secondary} !important; }
        .hover\:border-\[\#D4AF37\]:hover { border-color: ${secondary} !important; }
        .selection\:text-\[\#D4AF37\] *::selection { color: ${secondary} !important; }
        .selection\:text-\[\#D4AF37\]::selection { color: ${secondary} !important; }

        .text-\[\#9B111E\] { color: ${accent} !important; }
        .bg-\[\#9B111E\] { background-color: ${accent} !important; }
        .border-\[\#9B111E\] { border-color: ${accent} !important; }
        .hover\:bg-\[\#9B111E\]:hover { background-color: ${accent} !important; }
        .fill-\[\#9B111E\] { fill: ${accent} !important; }

        .bg-\[\#FDFBF7\] { background-color: ${bg} !important; }
        .text-\[\#FDFBF7\] { color: ${bg} !important; }

        /* Transparency Variants */
        .bg-\[\#FDFBF7\]\/90 { background-color: rgba(${bgRgb.r}, ${bgRgb.g}, ${bgRgb.b}, 0.9) !important; }
        .bg-\[\#FDFBF7\]\/95 { background-color: rgba(${bgRgb.r}, ${bgRgb.g}, ${bgRgb.b}, 0.95) !important; }
        
        .border-\[\#D4AF37\]\/10 { border-color: rgba(${sRgb.r}, ${sRgb.g}, ${sRgb.b}, 0.1) !important; }
        .border-\[\#D4AF37\]\/20 { border-color: rgba(${sRgb.r}, ${sRgb.g}, ${sRgb.b}, 0.2) !important; }
        .bg-\[\#D4AF37\]\/20 { background-color: rgba(${sRgb.r}, ${sRgb.g}, ${sRgb.b}, 0.2) !important; }
        .from-\[\#D4AF37\]\/20 { --tw-gradient-from: rgba(${sRgb.r}, ${sRgb.g}, ${sRgb.b}, 0.2) !important; }
        .to-\[\#D4AF37\]\/20 { --tw-gradient-to: rgba(${sRgb.r}, ${sRgb.g}, ${sRgb.b}, 0.2) !important; }
        
        .border-\[\#D4AF37\]\/30 { border-color: rgba(${sRgb.r}, ${sRgb.g}, ${sRgb.b}, 0.3) !important; }
        .border-\[\#D4AF37\]\/40 { border-color: rgba(${sRgb.r}, ${sRgb.g}, ${sRgb.b}, 0.4) !important; }
        .bg-\[\#D4AF37\]\/50 { background-color: rgba(${sRgb.r}, ${sRgb.g}, ${sRgb.b}, 0.5) !important; }
        .border-\[\#D4AF37\]\/50 { border-color: rgba(${sRgb.r}, ${sRgb.g}, ${sRgb.b}, 0.5) !important; }
        .bg-\[\#D4AF37\]\/10 { background-color: rgba(${sRgb.r}, ${sRgb.g}, ${sRgb.b}, 0.1) !important; }
        .bg-\[\#800000\]\/10 { background-color: rgba(${pRgb.r}, ${pRgb.g}, ${pRgb.b}, 0.1) !important; }
        .bg-\[\#800000\]\/60 { background-color: rgba(${pRgb.r}, ${pRgb.g}, ${pRgb.b}, 0.6) !important; }

        /* Gradient Overrides */
        .from-\[\#800000\] { --tw-gradient-from: ${primary} !important; --tw-gradient-to: rgba(${pRgb.r}, ${pRgb.g}, ${pRgb.b}, 0) !important; --tw-gradient-stops: var(--tw-gradient-from), var(--tw-gradient-to) !important; }
        .to-\[\#800000\] { --tw-gradient-to: ${primary} !important; }
        .from-\[\#9B111E\] { --tw-gradient-from: ${accent} !important; --tw-gradient-to: rgba(${aRgb.r}, ${aRgb.g}, ${aRgb.b}, 0) !important; --tw-gradient-stops: var(--tw-gradient-from), var(--tw-gradient-to) !important; }
        .to-\[\#9B111E\] { --tw-gradient-to: ${accent} !important; }
        .to-\[\#FDFBF7\] { --tw-gradient-to: ${bg} !important; }
        .from-\[\#FDFBF7\] { --tw-gradient-from: ${bg} !important; --tw-gradient-to: rgba(${bgRgb.r}, ${bgRgb.g}, ${bgRgb.b}, 0) !important; --tw-gradient-stops: var(--tw-gradient-from), var(--tw-gradient-to) !important; }

        .from-transparent { --tw-gradient-from: transparent !important; }
        .to-\[\#D4AF37\] { --tw-gradient-to: ${secondary} !important; }
        .from-\[\#D4AF37\] { --tw-gradient-from: ${secondary} !important; --tw-gradient-to: rgba(${sRgb.r}, ${sRgb.g}, ${sRgb.b}, 0) !important; --tw-gradient-stops: var(--tw-gradient-from), var(--tw-gradient-to) !important; }
      `}</style>
      {/* Welcome Screen Splash */}
      {settings.theme_layout !== 'modern-slate' ? (
        <GaneshSplash onEnter={() => setEntered(true)} />
      ) : (
        !entered && (
          <div className="fixed inset-0 bg-[#2D3748] z-50 flex items-center justify-center px-4 font-outfit select-none">
            <div className="absolute inset-0 pointer-events-none bg-gradient-to-b from-black/30 to-black/80 z-10"></div>
            {/* Cover Background Photo */}
            <div className="absolute inset-0 bg-cover bg-center" style={{ backgroundImage: `url(${settings.cover_photo || "https://images.unsplash.com/photo-1519741497674-611481863552?q=80&w=1000"})` }}></div>
            
            <div className="relative w-full max-w-md text-center text-[#F7FAFC] z-20 flex flex-col justify-between h-[85vh] py-6 px-4">
              <div className="space-y-1.5 mt-2">
                <span className="text-[10px] tracking-[0.3em] uppercase font-bold text-gray-300">The Wedding of</span>
                <h1 className="text-3xl md:text-4xl font-bold font-serif text-[#F7FAFC] leading-normal font-gujarati tracking-wide drop-shadow-md">
                  {couple.groom_name_gu} &amp; {couple.bride_name_gu}
                </h1>
                <p className="text-xs tracking-[0.15em] text-gray-300 font-serif mt-0.5">
                  {couple.groom_name_en} &amp; {couple.bride_name_en}
                </p>
              </div>
              
              <div className="bg-[#2D3748]/90 backdrop-blur-md p-6 rounded-2xl border border-[#718096]/30 shadow-2xl flex flex-col items-center space-y-4 max-w-xs mx-auto w-full">
                <div className="space-y-1">
                  <span className="text-[10px] text-gray-400 uppercase tracking-widest block font-bold">Dear,</span>
                  <h3 className="text-base font-bold text-[#F7FAFC] font-serif leading-tight">
                    {guestName || "Valued Guest"}
                  </h3>
                  {guestLocation && (
                    <span className="text-xs text-gray-400 block mt-0.5">at {guestLocation}</span>
                  )}
                </div>
                
                <button
                  onClick={() => setEntered(true)}
                  className="w-full bg-[#F7FAFC] hover:bg-gray-100 text-[#2D3748] font-bold text-xs py-3 rounded-xl border border-transparent shadow-lg cursor-pointer transition-colors duration-200 uppercase tracking-widest"
                >
                  Open Invitation
                </button>
              </div>
              
              <div className="text-[10px] text-gray-300 font-serif tracking-widest mb-2 uppercase">
                {settings.wedding_date}
              </div>
            </div>
          </div>
        )
      )}

      {/* Audio player & canvas flower rain load when welcome screen is unlocked */}
      {entered && (
        <>
          <AudioPlayer url={settings.music_url} autoPlay={settings.music_autoplay} triggerPlay={entered} />
          <FlowerRain />
        </>
      )}

      {/* Main Wedding Invitation Page */}
      <div className={`relative min-h-screen bg-[#FDFBF7] selection:bg-[#800000] selection:text-[#D4AF37] ${!entered ? 'h-screen overflow-hidden' : ''}`}>

        {/* Decorative Top Border (Garland Toran) */}
        {settings.theme_layout !== 'modern-slate' && <ToranDecoration />}

        {/* Rotating Mandala Vector backdrop */}
        <MandalaBackground />

        {/* 1. HERO SECTION */}
        <header className="relative min-h-screen flex flex-col justify-center items-center px-4 pt-16 text-center select-none overflow-hidden z-10">
          <div className="absolute inset-0 bg-gradient-to-b from-amber-50/20 via-transparent to-amber-50/30 -z-10"></div>

          {/* Kalash Icon top */}
          <motion.div
            initial={{ y: -30, opacity: 0 }}
            animate={entered ? { y: 0, opacity: 1 } : {}}
            transition={{ duration: 1, delay: 0.2 }}
            className="text-[#800000] mb-4"
          >
            <span className="text-3xl">🕭</span>
          </motion.div>

          {/* Shloka */}
          <motion.p
            initial={{ opacity: 0 }}
            animate={entered ? { opacity: 0.6 } : {}}
            transition={{ duration: 1, delay: 0.4 }}
            className="text-[#9B111E] font-gujarati text-xs md:text-sm font-semibold tracking-wide max-w-sm mb-4 leading-relaxed"
          >
            વક્રતુણ્ડ મહાકાય સૂર્યકોટી સમપ્રભ,
            <br />
            નિર્વિઘ્નં કુરુ મે દેવ સર્વકાર્યેષુ સર્વદા.
          </motion.p>

          {/* Title Names */}
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={entered ? { scale: 1, opacity: 1 } : {}}
            transition={{ duration: 1.2, type: 'spring' }}
            className="mb-6"
          >
            <h1 className="text-4xl md:text-6xl font-bold font-gujarati text-[#800000] leading-normal tracking-wide drop-shadow-sm">
              {couple.groom_name_gu}
            </h1>
            <div className="flex items-center justify-center space-x-4 my-2">
              <div className="h-[2px] w-12 bg-gradient-to-r from-transparent to-[#D4AF37]"></div>
              <motion.span
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ repeat: Infinity, duration: 2.5 }}
                className="text-[#9B111E]"
              >
                <Heart className="w-5 h-5 fill-[#9B111E]" />
              </motion.span>
              <div className="h-[2px] w-12 bg-gradient-to-l from-transparent to-[#D4AF37]"></div>
            </div>
            <h1 className="text-4xl md:text-6xl font-bold font-gujarati text-[#800000] leading-normal tracking-wide drop-shadow-sm">
              {couple.bride_name_gu}
            </h1>
          </motion.div>

          {/* English names translation */}
          <motion.p
            initial={{ opacity: 0 }}
            animate={entered ? { opacity: 0.7 } : {}}
            transition={{ delay: 0.8 }}
            className="text-gray-500 font-serif text-sm md:text-base tracking-widest uppercase mb-12"
          >
            {couple.groom_name_en} & {couple.bride_name_en}
          </motion.p>

          {/* Invitation text */}
          <motion.p
            initial={{ y: 20, opacity: 0 }}
            animate={entered ? { y: 0, opacity: 1 } : {}}
            transition={{ delay: 1, duration: 0.8 }}
            className="text-[#9B111E] font-gujarati text-lg max-w-md mx-auto mb-8 font-medium leading-relaxed"
          >
            અમારા શુભ મંગલ લગ્ન પ્રસંગે આપને સહપરિવાર પધારવા ભાવભીનું આમંત્રણ છે.
          </motion.p>

          {/* Hero CTA to jump to RSVP */}
          <motion.a
            href="#rsvp"
            initial={{ scale: 0.9, opacity: 0 }}
            animate={entered ? { scale: 1, opacity: 1 } : {}}
            whileHover={{ scale: 1.05, boxShadow: "0 4px 15px rgba(128,0,0,0.15)" }}
            transition={{ delay: 1.2 }}
            className="bg-[#800000] hover:bg-[#9B111E] text-[#D4AF37] font-semibold text-xs md:text-sm py-2.5 px-6 rounded-full border border-[#D4AF37]/40 shadow-md cursor-pointer transition-colors duration-200"
          >
            Confirm RSVP
          </motion.a>

          {/* Floating Diya indicators bottom */}
          <div className="absolute bottom-10 flex space-x-12 animate-float">
            <div className="flex flex-col items-center">
              <span className="text-xl">🪔</span>
              <div className="w-1.5 h-1.5 rounded-full bg-[#D4AF37]/50 mt-1"></div>
            </div>
            <div className="flex flex-col items-center">
              <span className="text-xl">🪔</span>
              <div className="w-1.5 h-1.5 rounded-full bg-[#D4AF37]/50 mt-1"></div>
            </div>
          </div>
        </header>

        {/* 2. KANKOTRI SECTION */}
        <section className="relative z-10 py-16 bg-[#FDFBF7]">
          <KankotriSection couple={couple} settings={settings} />
        </section>

        {/* 3. COUNTDOWN TIMELINE SECTION */}
        <section className="relative z-10 py-16 bg-[#800000] text-[#FDFBF7]">
          {/* Top border decoration */}
          <div className="absolute top-0 inset-x-0 toran-border opacity-30"></div>

          <div className="max-w-4xl mx-auto px-4 text-center">
            <h3 className="text-gold-metallic font-gujarati text-3xl font-bold mb-2">મંગલ મુહૂર્ત Countdown</h3>
            <p className="text-amber-100/70 font-outfit text-xs font-semibold uppercase tracking-wider mb-8">
              Counting down to the auspicious day
            </p>

            <CountdownTimer targetDate={settings.wedding_date} targetTime={settings.wedding_time} />
          </div>
        </section>

        {/* 4. COUPLE BIO SECTION */}
        <section className="relative z-10 py-20 px-4 bg-[#FDFBF7]">
          <div className="max-w-4xl mx-auto text-center">
            <h3 className="text-[#800000] font-gujarati text-3xl font-bold mb-2">વર-કન્યા પરિચય</h3>
            <p className="text-gray-500 font-outfit text-xs font-semibold uppercase tracking-wider mb-12">
              Meet the Bride & Groom
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mt-6">
              {/* Groom Profile */}
              <motion.div
                initial={{ x: -40, opacity: 0 }}
                whileInView={{ x: 0, opacity: 1 }}
                viewport={{ once: true }}
                className="royal-card p-6 flex flex-col items-center bg-[#FDFBF7]/90"
              >
                <div className="w-40 h-40 rounded-full border-4 border-[#D4AF37] overflow-hidden shadow-lg mb-6 flex items-center justify-center bg-amber-50">
                  {couple.groom_photo && couple.groom_photo.trim() !== "" ? (
                    <img src={couple.groom_photo} alt={couple.groom_name_en} className="w-full h-full object-cover" />
                  ) : (
                    <span className="text-4xl font-bold text-[#800000] font-gujarati">
                      {couple.groom_name_gu ? couple.groom_name_gu.charAt(0) : 'વ'}
                    </span>
                  )}
                </div>
                <h4 className="text-[#800000] font-gujarati text-2xl font-bold">{couple.groom_name_gu}</h4>
                <p className="text-xs text-gray-400 uppercase tracking-widest font-outfit mb-3">{couple.groom_name_en}</p>
                <p className="text-sm text-gray-600 leading-relaxed max-w-xs">{couple.groom_bio}</p>
              </motion.div>

              {/* Bride Profile */}
              <motion.div
                initial={{ x: 40, opacity: 0 }}
                whileInView={{ x: 0, opacity: 1 }}
                viewport={{ once: true }}
                className="royal-card p-6 flex flex-col items-center bg-[#FDFBF7]/90"
              >
                <div className="w-40 h-40 rounded-full border-4 border-[#D4AF37] overflow-hidden shadow-lg mb-6 flex items-center justify-center bg-amber-50">
                  {couple.bride_photo && couple.bride_photo.trim() !== "" ? (
                    <img src={couple.bride_photo} alt={couple.bride_name_en} className="w-full h-full object-cover" />
                  ) : (
                    <span className="text-4xl font-bold text-[#800000] font-gujarati">
                      {couple.bride_name_gu ? couple.bride_name_gu.charAt(0) : 'ક'}
                    </span>
                  )}
                </div>
                <h4 className="text-[#800000] font-gujarati text-2xl font-bold">{couple.bride_name_gu}</h4>
                <p className="text-xs text-gray-400 uppercase tracking-widest font-outfit mb-3">{couple.bride_name_en}</p>
                <p className="text-sm text-gray-600 leading-relaxed max-w-xs">{couple.bride_bio}</p>
              </motion.div>
            </div>
          </div>
        </section>

        {/* 5. EVENTS SCHEDULE TIMELINE */}
        <section className="relative z-10 py-20 bg-gradient-to-b from-[#FDFBF7] via-[#FFFBF0] to-[#FDFBF7]">
          <div className="text-center mb-12">
            <h3 className="text-[#800000] font-gujarati text-3xl font-bold mb-2">લગ્ન મહોત્સવ પ્રસંગો</h3>
            <p className="text-gray-500 font-outfit text-xs font-semibold uppercase tracking-wider">
              Wedding Celebrations Schedule
            </p>
          </div>

          <TimelineEvents events={events} />
        </section>

        {/* 6. LOVE STORY TIMELINE */}
        {loveStory.length > 0 && (
          <section className="relative z-10 py-20 px-4 bg-[#FDFBF7]">
            <div className="max-w-4xl mx-auto text-center">
              <h3 className="text-[#800000] font-gujarati text-3xl font-bold mb-2">સ્નેહયાત્રા (Our Love Story)</h3>
              <p className="text-gray-500 font-outfit text-xs font-semibold uppercase tracking-wider mb-12">
                A journey of love, trust and commitment
              </p>

              <div className="space-y-12">
                {loveStory.map((milestone, idx) => (
                  <motion.div
                    key={milestone.id}
                    initial={{ y: 30, opacity: 0 }}
                    whileInView={{ y: 0, opacity: 1 }}
                    viewport={{ once: true }}
                    className="flex flex-col md:flex-row items-center space-y-6 md:space-y-0 md:space-x-8 text-left bg-white/70 p-6 rounded-2xl border border-[#D4AF37]/20 shadow-sm"
                  >
                    {milestone.photo && milestone.photo.trim() !== "" && (
                      <div className="w-full md:w-48 h-36 rounded-xl overflow-hidden flex-shrink-0 border border-[#D4AF37]/30 shadow-inner">
                        <img src={milestone.photo} alt={milestone.title} className="w-full h-full object-cover" />
                      </div>
                    )}
                    <div>
                      <span className="text-xs font-bold text-[#9B111E] uppercase tracking-wider bg-amber-50 px-2.5 py-1 rounded-full border border-[#D4AF37]/20">
                        {milestone.date}
                      </span>
                      <h4 className="text-[#800000] font-gujarati text-xl font-bold mt-2">{milestone.title}</h4>
                      <p className="text-gray-600 text-xs md:text-sm leading-relaxed mt-2">{milestone.description}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* 7. PHOTO GALLERY */}
        {gallery.length > 0 && (
          <section className="relative z-10 py-20 bg-gradient-to-b from-[#FDFBF7] to-[#FAF8F2]">
            <div className="text-center mb-12">
              <h3 className="text-[#800000] font-gujarati text-3xl font-bold mb-2">યાદગાર પળો (Photo Gallery)</h3>
              <p className="text-gray-500 font-outfit text-xs font-semibold uppercase tracking-wider">
                Capture the joy and celebrations
              </p>
            </div>

            <GalleryGrid items={gallery} />
          </section>
        )}

        {/* 8. FAMILY MEMBERS */}
        {family.length > 0 && (
          <section className="relative z-10 py-20 px-4 bg-[#FDFBF7]">
            <div className="max-w-5xl mx-auto text-center">
              <h3 className="text-[#800000] font-gujarati text-3xl font-bold mb-2">પરિવાર પરિચય</h3>
              <p className="text-gray-500 font-outfit text-xs font-semibold uppercase tracking-wider mb-12">
                The Loving Families
              </p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                {/* Groom's Family */}
                <div>
                  <h4 className="text-[#800000] font-gujarati text-xl font-bold mb-6 pb-2 border-b border-[#D4AF37]/30 inline-block">
                    વર પક્ષ (Groom&apos;s Side)
                  </h4>
                  <div className="grid grid-cols-2 gap-4">
                    {groomFamily.map(member => (
                      <div key={member.id} className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm flex flex-col items-center">
                        <div className="w-16 h-16 rounded-full overflow-hidden mb-3 border-2 border-[#D4AF37] flex items-center justify-center bg-amber-50">
                          {member.photo && member.photo.trim() !== "" ? (
                            <img src={member.photo} alt={member.name} className="w-full h-full object-cover" />
                          ) : (
                            <span className="text-lg font-bold text-[#800000]">{member.name ? member.name.charAt(0) : 'વ'}</span>
                          )}
                        </div>
                        <h5 className="font-bold text-sm text-gray-800">{member.name}</h5>
                        <p className="text-[10px] text-gray-500 mt-0.5">{member.relationship}</p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Bride's Family */}
                <div>
                  <h4 className="text-[#800000] font-gujarati text-xl font-bold mb-6 pb-2 border-b border-[#D4AF37]/30 inline-block">
                    કન્યા પક્ષ (Bride&apos;s Side)
                  </h4>
                  <div className="grid grid-cols-2 gap-4">
                    {brideFamily.map(member => (
                      <div key={member.id} className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm flex flex-col items-center">
                        <div className="w-16 h-16 rounded-full overflow-hidden mb-3 border-2 border-[#D4AF37] flex items-center justify-center bg-amber-50">
                          {member.photo && member.photo.trim() !== "" ? (
                            <img src={member.photo} alt={member.name} className="w-full h-full object-cover" />
                          ) : (
                            <span className="text-lg font-bold text-[#800000]">{member.name ? member.name.charAt(0) : 'ક'}</span>
                          )}
                        </div>
                        <h5 className="font-bold text-sm text-gray-800">{member.name}</h5>
                        <p className="text-[10px] text-gray-500 mt-0.5">{member.relationship}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </section>
        )}

        {/* 9. VENUE SECTION */}
        <section className="relative z-10 py-20 px-4 bg-[#FDFBF7]/90 border-t border-[#D4AF37]/10">
          <div className="max-w-4xl mx-auto text-center">
            <h3 className="text-[#800000] font-gujarati text-3xl font-bold mb-2">લગ્ન સ્થળ (Wedding Venue)</h3>
            <p className="text-gray-500 font-outfit text-xs font-semibold uppercase tracking-wider mb-12">
              Locate the Royal Celebration Venue
            </p>

            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              whileInView={{ scale: 1, opacity: 1 }}
              viewport={{ once: true }}
              className="royal-card p-6 md:p-8 bg-white max-w-xl mx-auto text-left shadow-lg"
            >
              <div className="flex flex-col space-y-4">
                <div className="flex items-start space-x-3">
                  <MapPin className="w-6 h-6 text-[#9B111E] flex-shrink-0 mt-1" />
                  <div>
                    <h4 className="text-lg font-bold text-gray-900 font-serif">{settings.venue_name}</h4>
                    <p className="text-sm text-gray-600 mt-1 leading-relaxed">{settings.venue_address}</p>
                  </div>
                </div>

                <div className="pt-4 border-t border-dashed border-[#D4AF37]/20 flex justify-between items-center">
                  <span className="text-xs text-gray-400 font-outfit flex items-center space-x-1">
                    <Calendar className="w-3.5 h-3.5" />
                    <span>{new Date(settings.wedding_date).toLocaleDateString('en-IN', { dateStyle: 'medium' })}</span>
                  </span>

                  {settings.maps_link && (
                    <a
                      href={settings.maps_link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center space-x-1.5 bg-[#800000] hover:bg-[#9B111E] text-[#D4AF37] font-bold text-xs py-2 px-4 rounded-lg shadow border border-[#D4AF37]/20 transition-colors duration-200 cursor-pointer"
                    >
                      <Navigation className="w-3.5 h-3.5" />
                      <span className="font-gujarati">નકશો જુઓ (Open Maps)</span>
                    </a>
                  )}
                </div>
              </div>
            </motion.div>
          </div>
        </section>

        {/* Live Stream Section */}
        {(settings.zoom_link || settings.youtube_link || settings.instagram_link) && (
          <section className="relative z-10 py-20 px-4 bg-[#FDFBF7]/90 border-t border-[#D4AF37]/10">
            <div className="max-w-4xl mx-auto text-center">
              <h3 className="text-[#800000] font-gujarati text-3xl font-bold mb-2">લાઇવ પ્રસારણ (Live Streaming)</h3>
              <p className="text-gray-500 font-outfit text-xs font-semibold uppercase tracking-wider mb-12">
                Join our celebrations virtually from anywhere
              </p>
              
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 max-w-3xl mx-auto">
                {settings.zoom_link && (
                  <motion.div 
                    whileHover={{ y: -5 }}
                    className="p-6 rounded-2xl bg-white border border-[#D4AF37]/20 shadow-sm flex flex-col items-center space-y-4"
                  >
                    <div className="w-12 h-12 rounded-full bg-blue-50 flex items-center justify-center text-blue-600">
                      <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" /></svg>
                    </div>
                    <div className="text-center">
                      <h4 className="font-bold text-gray-800 text-sm">Zoom Meeting</h4>
                      <p className="text-[10px] text-gray-400 mt-0.5 font-outfit">Interactive Stream</p>
                    </div>
                    <a 
                      href={settings.zoom_link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-full text-center bg-[#800000] hover:bg-[#9B111E] text-[#D4AF37] text-xs font-bold py-2.5 rounded-xl border border-transparent shadow-sm transition-colors duration-200 font-outfit uppercase tracking-widest cursor-pointer"
                    >
                      Join Zoom
                    </a>
                  </motion.div>
                )}

                {settings.youtube_link && (
                  <motion.div 
                    whileHover={{ y: -5 }}
                    className="p-6 rounded-2xl bg-white border border-[#D4AF37]/20 shadow-sm flex flex-col items-center space-y-4"
                  >
                    <div className="w-12 h-12 rounded-full bg-red-50 flex items-center justify-center text-red-600">
                      <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M7 4h10M4 8h16v10a2 2 0 01-2 2H6a2 2 0 01-2-2V8zm6 12v2m4-2v2" /></svg>
                    </div>
                    <div className="text-center">
                      <h4 className="font-bold text-gray-800 text-sm">YouTube Live</h4>
                      <p className="text-[10px] text-gray-400 mt-0.5 font-outfit">HD Video Broadcast</p>
                    </div>
                    <a 
                      href={settings.youtube_link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-full text-center bg-[#800000] hover:bg-[#9B111E] text-[#D4AF37] text-xs font-bold py-2.5 rounded-xl border border-transparent shadow-sm transition-colors duration-200 font-outfit uppercase tracking-widest cursor-pointer"
                    >
                      Watch Live
                    </a>
                  </motion.div>
                )}

                {settings.instagram_link && (
                  <motion.div 
                    whileHover={{ y: -5 }}
                    className="p-6 rounded-2xl bg-white border border-[#D4AF37]/20 shadow-sm flex flex-col items-center space-y-4"
                  >
                    <div className="w-12 h-12 rounded-full bg-pink-50 flex items-center justify-center text-pink-600">
                      <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line></svg>
                    </div>
                    <div className="text-center">
                      <h4 className="font-bold text-gray-800 text-sm">Instagram Live</h4>
                      <p className="text-[10px] text-gray-400 mt-0.5 font-outfit">Social Broadcast</p>
                    </div>
                    <a 
                      href={settings.instagram_link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-full text-center bg-[#800000] hover:bg-[#9B111E] text-[#D4AF37] text-xs font-bold py-2.5 rounded-xl border border-transparent shadow-sm transition-colors duration-200 font-outfit uppercase tracking-widest cursor-pointer"
                    >
                      Follow Live
                    </a>
                  </motion.div>
                )}
              </div>
            </div>
          </section>
        )}

        {/* Health Protocols Section */}
        <section className="relative z-10 py-16 px-4 bg-[#FDFBF7] border-t border-[#D4AF37]/10">
          <div className="max-w-4xl mx-auto text-center">
            <h3 className="text-[#800000] font-gujarati text-3xl font-bold mb-2">આરોગ્ય માર્ગદર્શિકા (Health Protocols)</h3>
            <p className="text-gray-500 font-outfit text-xs font-semibold uppercase tracking-wider mb-12">
              For the safety of all guests
            </p>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-3xl mx-auto">
              <div className="flex flex-col items-center space-y-3">
                <div className="w-16 h-16 rounded-full bg-emerald-50/50 border border-emerald-100 flex items-center justify-center text-emerald-600">
                  <svg className="w-7 h-7" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" /></svg>
                </div>
                <h4 className="font-bold text-gray-800 text-sm">Sanitize Hands</h4>
                <p className="text-[10px] text-gray-500 text-center px-2 font-outfit">Sanitization stations will be available throughout</p>
              </div>

              <div className="flex flex-col items-center space-y-3">
                <div className="w-16 h-16 rounded-full bg-emerald-50/50 border border-emerald-100 flex items-center justify-center text-emerald-600">
                  <svg className="w-7 h-7" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>
                </div>
                <h4 className="font-bold text-gray-800 text-sm">Wear Mask</h4>
                <p className="text-[10px] text-gray-500 text-center px-2 font-outfit">Please wear a face mask when appropriate</p>
              </div>

              <div className="flex flex-col items-center space-y-3">
                <div className="w-16 h-16 rounded-full bg-emerald-50/50 border border-emerald-100 flex items-center justify-center text-emerald-600">
                  <Heart className="w-7 h-7" />
                </div>
                <h4 className="font-bold text-gray-800 text-sm">Safe Distance</h4>
                <p className="text-[10px] text-gray-500 text-center px-2 font-outfit">Keep safe physical distance where possible</p>
              </div>

              <div className="flex flex-col items-center space-y-3">
                <div className="w-16 h-16 rounded-full bg-emerald-50/50 border border-emerald-100 flex items-center justify-center text-emerald-600">
                  <svg className="w-7 h-7" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" /></svg>
                </div>
                <h4 className="font-bold text-gray-800 text-sm">Avoid if Unwell</h4>
                <p className="text-[10px] text-gray-500 text-center px-2 font-outfit">If you feel sick, please celebrate with us online</p>
              </div>
            </div>
          </div>
        </section>

        {/* Wedding Gifts Section */}
        {(settings.gift_bank_name || settings.gift_account_number) && (
          <section className="relative z-10 py-16 px-4 bg-[#FDFBF7]/90 border-t border-[#D4AF37]/10">
            <div className="max-w-4xl mx-auto text-center">
              <h3 className="text-[#800000] font-gujarati text-3xl font-bold mb-2">શુભ આશીર્વાદ અને ભેટ (Wedding Registry)</h3>
              <p className="text-gray-500 font-outfit text-xs font-semibold uppercase tracking-wider mb-8">
                Your presence & blessings are our greatest gift
              </p>
              <p className="text-gray-600 text-sm max-w-md mx-auto mb-8 leading-relaxed font-outfit">
                Should you wish to send a token of love, you may transfer it directly to our wedding account details below:
              </p>
              
              <button
                onClick={() => setShowGiftModal(true)}
                className="bg-[#800000] hover:bg-[#9B111E] text-[#D4AF37] font-semibold text-xs md:text-sm py-3 px-8 rounded-full border border-[#D4AF37]/40 shadow-md cursor-pointer transition-all duration-200 uppercase tracking-widest inline-flex items-center space-x-2 font-outfit"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M20 12V8H4v4M3 8h18M12 3v18M12 8a3 3 0 100-6 3 3 0 000 6z" /></svg>
                <span>Send Wedding Gift</span>
              </button>
            </div>

            {/* Registry Details Modal */}
            {showGiftModal && (
              <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center px-4 font-outfit">
                <motion.div 
                  initial={{ scale: 0.95, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  className="bg-white rounded-2xl max-w-md w-full p-6 relative border border-[#D4AF37]/30 shadow-2xl text-gray-800"
                >
                  <button 
                    onClick={() => setShowGiftModal(false)}
                    className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 text-xl cursor-pointer"
                  >
                    ✕
                  </button>
                  <h3 className="text-lg font-bold text-gray-900 mb-4 border-b pb-2">Wedding Registry Details</h3>
                  
                  <div className="space-y-4 text-sm text-left">
                    <div className="bg-amber-50/50 p-4 rounded-xl border border-dashed border-[#D4AF37]/30">
                      <div className="text-xs text-gray-400 uppercase tracking-wider font-bold">Bank Name</div>
                      <div className="font-bold text-gray-800 text-base mt-0.5">{settings.gift_bank_name || 'HDFC Bank'}</div>
                    </div>

                    <div className="bg-amber-50/50 p-4 rounded-xl border border-dashed border-[#D4AF37]/30 flex justify-between items-center">
                      <div>
                        <div className="text-xs text-gray-400 uppercase tracking-wider font-bold">Account Number</div>
                        <div className="font-mono font-bold text-gray-800 text-base mt-0.5">{settings.gift_account_number || '1234567890'}</div>
                      </div>
                      <button
                        onClick={() => {
                          if (navigator.clipboard) {
                            navigator.clipboard.writeText(settings.gift_account_number || '');
                            setCopiedGiftText(true);
                            setTimeout(() => setCopiedGiftText(false), 2000);
                          }
                        }}
                        className="p-2 hover:bg-amber-100 rounded-lg text-[#800000] transition-colors cursor-pointer"
                        title="Copy Account Number"
                      >
                        {copiedGiftText ? (
                          <svg className="w-5 h-5 text-emerald-600" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>
                        ) : (
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M8 7v8a2 2 0 002 2h6M8 7V5a2 2 0 012-2h4.586A1 1 0 0117 3.414l2.586 2.586A1 1 0 0120 6.707V15a2 2 0 01-2 2h-2M8 7H6a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2v-2" /></svg>
                        )}
                      </button>
                    </div>

                    <div className="bg-amber-50/50 p-4 rounded-xl border border-dashed border-[#D4AF37]/30">
                      <div className="text-xs text-gray-400 uppercase tracking-wider font-bold">Account Name</div>
                      <div className="font-bold text-gray-800 text-base mt-0.5">{settings.gift_account_name || 'Couple Name'}</div>
                    </div>
                  </div>

                  <button
                    onClick={() => setShowGiftModal(false)}
                    className="w-full bg-[#800000] hover:bg-[#9B111E] text-[#D4AF37] font-bold text-xs py-3 rounded-xl shadow-md transition-colors mt-6 uppercase tracking-widest cursor-pointer"
                  >
                    Close
                  </button>
                </motion.div>
              </div>
            )}
          </section>
        )}

        {/* 10. RSVP FORM SECTION */}
        <section id="rsvp" className="relative z-10 py-20 bg-gradient-to-b from-[#FDFBF7] to-[#800000]/10 scroll-mt-6">
          <RSVPForm slug={slug} />
        </section>

        {/* 11. BLESSINGS WALL */}
        <section className="relative z-10 py-20 px-4 bg-[#FDFBF7]">
          <div className="text-center mb-12">
            <h3 className="text-[#800000] font-gujarati text-3xl font-bold mb-2">મંગલ આશીર્વાદ દિવાલ</h3>
            <p className="text-gray-500 font-outfit text-xs font-semibold uppercase tracking-wider">
              Blessings Wall & Good Wishes
            </p>
          </div>

          <BlessingsWall initialWishes={wishes} slug={slug} />
        </section>

        {/* Share Invitation widget */}
        <section className="relative z-10 pb-16 bg-[#FDFBF7]">
          <ShareInvitation coupleNames={`${couple.groom_name_en} & ${couple.bride_name_en}`} />
        </section>

        {/* 12. FOOTER */}
        <footer className="relative z-10 bg-[#1F080C] text-[#FDFBF7] py-16 text-center border-t-2 border-[#D4AF37] select-none">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom,rgba(128,0,0,0.35)_0%,rgba(10,2,4,0.98)_100%)] pointer-events-none"></div>
          
          <div className="relative max-w-4xl mx-auto px-4 flex flex-col items-center">
            {/* Peacock plume / Swastik decoration */}
            <span className="text-3xl text-gold-metallic mb-6 animate-pulse">🪔</span>

            <h4 className="text-gold-metallic font-gujarati text-2xl font-bold tracking-wider mb-2">
              આપના સ્નેહાભિલાષી
            </h4>
            <p className="text-amber-100 text-xs md:text-sm font-semibold max-w-md leading-relaxed mb-6 font-gujarati">
              પટેલ પરિવાર અને શાહ પરિવારના સ્નેહ આશીર્વાદ સહ.
            </p>

            <p className="text-amber-200/50 text-[10px] tracking-wider uppercase font-outfit mt-4">
              © 2026 {couple.groom_name_en} & {couple.bride_name_en} Wedding. All Rights Reserved.
            </p>
          </div>
        </footer>

      </div>
    </>
  );
}
