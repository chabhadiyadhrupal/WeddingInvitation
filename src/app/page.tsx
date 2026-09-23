'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Heart, Sparkles, Music, Calendar, ClipboardList, MessageSquareQuote, ShieldCheck, ArrowRight } from 'lucide-react';
import MandalaBackground from '@/components/MandalaBackground';
import ToranDecoration from '@/components/ToranDecoration';
import Link from 'next/link';

export default function MarketingLandingPage() {
  const features = [
    {
      title: 'શુભ ગણેશ વંદના (Auspicious Welcome)',
      desc: 'An elegant, traditional animated splash screen welcoming guests with Ganesh Vandana and floral rain.',
      icon: <Sparkles className="w-6 h-6 text-gold-metallic" />
    },
    {
      title: 'રાગ-સૂર સંગીત (Auto-play Shehnai & MP3)',
      desc: 'Dynamic music player featuring preset traditional shehnai/sitar dhun, or upload your own favorite love song.',
      icon: <Music className="w-6 h-6 text-gold-metallic" />
    },
    {
      title: 'હાજરી પત્રક (Interactive RSVP Manager)',
      desc: 'Seamless guest presence confirmation with custom guest counts, contact information, and dashboard statistics.',
      icon: <ClipboardList className="w-6 h-6 text-gold-metallic" />
    },
    {
      title: 'આશીર્વાદ દિવાલ (Blessings Wall)',
      desc: 'Showcase loving messages from guests. Includes a full moderation panel in your console to approve or hide wishes.',
      icon: <MessageSquareQuote className="w-6 h-6 text-gold-metallic" />
    },
    {
      title: 'વર-કન્યા પરિચય & ફોટો ગૅલેરી (Gallery & Bio)',
      desc: 'Highlight the couple’s journey, pre-wedding photoshoot milestones, and detailed loving family bios.',
      icon: <Heart className="w-6 h-6 text-gold-metallic" />
    },
    {
      title: 'લગ્ન મહોત્સવ પત્રિકા (Itinerary Events)',
      desc: 'Present neat timelines of events like Mehendi, Sangeet, Haldi, Lagna Vidhi, and Reception with venue maps.',
      icon: <Calendar className="w-6 h-6 text-gold-metallic" />
    }
  ];

  return (
    <div className="relative min-h-screen bg-[#FDFBF7] selection:bg-[#800000] selection:text-[#D4AF37] font-outfit select-none overflow-hidden">
      
      {/* Garland Toran Decoration top */}
      <ToranDecoration />

      {/* Backdrop Mandala Vector animation */}
      <MandalaBackground />

      {/* Hero Header */}
      <header className="relative min-h-[90vh] flex flex-col justify-center items-center px-4 pt-20 pb-12 text-center z-10">
        <div className="absolute inset-0 bg-gradient-to-b from-amber-50/20 via-transparent to-amber-50/10 -z-10"></div>
        
        {/* Swastik / Shloka */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.7 }}
          transition={{ duration: 1 }}
          className="text-[#9B111E] font-gujarati text-xs md:text-sm font-bold tracking-wider max-w-sm mb-6 uppercase"
        >
          ॥ શ્રી ગણેશાય નમઃ ॥
        </motion.p>

        {/* Brand Headline */}
        <motion.div
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.8 }}
          className="max-w-3xl"
        >
          <h1 className="text-4xl md:text-6xl font-bold font-gujarati text-[#800000] leading-snug drop-shadow-sm">
            શુભ લગ્ન કંકોતરી
          </h1>
          <h2 className="text-xl md:text-2xl font-serif text-gold-metallic font-semibold tracking-wider mt-3 uppercase">
            Premium Gujarati Wedding Invitations
          </h2>
          <p className="text-gray-600 text-xs md:text-sm max-w-lg mx-auto mt-6 leading-relaxed">
            Create a gorgeous, interactive Gujarati wedding invitation website in minutes. Share traditional royal aesthetics, handle RSVP lists, upload custom music, and moderate guest blessings easily.
          </p>
        </motion.div>

        {/* Hero CTAs */}
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="flex flex-col sm:flex-row gap-4 mt-10"
        >
          <a
            href="/wedding/aarav-kiara-3d"
            target="_blank"
            rel="noopener noreferrer"
            className="bg-gradient-to-r from-[#800000] via-[#B8860B] to-[#800000] hover:opacity-90 text-[#FFFDF9] font-bold text-xs md:text-sm py-3 px-8 rounded-full border border-[#FFD700] shadow-xl cursor-pointer flex items-center justify-center space-x-2 transition-all transform hover:scale-105"
          >
            <Sparkles className="w-4 h-4 text-[#FFD700]" />
            <span>✨ View Royal Luxury Invitation</span>
          </a>

          <a
            href="/wedding/aarav-diya"
            target="_blank"
            rel="noopener noreferrer"
            className="bg-[#800000] hover:bg-[#9B111E] text-[#D4AF37] font-semibold text-xs md:text-sm py-3 px-8 rounded-full border border-[#D4AF37]/40 shadow-lg cursor-pointer flex items-center justify-center space-x-1.5 transition-colors duration-200"
          >
            <span>View Classic Invitation</span>
            <ArrowRight className="w-4 h-4" />
          </a>
          
          <a
            href="/master-admin"
            className="bg-white/90 hover:bg-amber-50 text-[#800000] font-semibold text-xs md:text-sm py-3 px-8 rounded-full border border-[#D4AF37]/30 shadow-md cursor-pointer transition-colors duration-200"
          >
            Create Your Invitation (Master Admin)
          </a>
        </motion.div>

        {/* Peacock Diya indicator bottom */}
        <div className="absolute bottom-6 flex space-x-8 animate-float">
          <span className="text-xl">🪔</span>
          <span className="text-xl">🦚</span>
          <span className="text-xl">🪔</span>
        </div>
      </header>

      {/* Features Overview */}
      <section className="relative z-10 py-20 px-4 max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h3 className="text-[#800000] font-gujarati text-3xl font-bold mb-2">વૈશિષ્ટ્યો (Feature Highlights)</h3>
          <p className="text-gray-400 text-xs font-semibold uppercase tracking-wider">Traditional Gujarati Culture meets Digital Elegance</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((f, idx) => (
            <motion.div
              key={idx}
              initial={{ y: 30, opacity: 0 }}
              whileInView={{ y: 0, opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.05 }}
              className="royal-card p-6 bg-white/95 border border-[#D4AF37]/20 shadow-sm hover:shadow-md transition-all flex flex-col items-start"
            >
              <div className="p-3 bg-[#1F080C] rounded-xl border border-[#D4AF37]/30 mb-4 shadow">
                {f.icon}
              </div>
              <h4 className="text-base font-bold text-gray-900 font-gujarati mb-2">{f.title}</h4>
              <p className="text-gray-500 text-xs leading-relaxed">{f.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Pricing / Royal Plan CTA */}
      <section className="relative z-10 py-20 bg-gradient-to-b from-transparent via-[#800000]/5 to-transparent px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h3 className="text-[#800000] font-gujarati text-3xl font-bold mb-2">કિંમત પત્રક (Royal Pricing)</h3>
          <p className="text-gray-400 text-xs font-semibold uppercase tracking-wider mb-12">One transparent package, full access lifetime license</p>

          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            whileInView={{ scale: 1, opacity: 1 }}
            viewport={{ once: true }}
            className="royal-card max-w-md mx-auto p-8 bg-[#FDFBF7] border-2 border-[#D4AF37] relative shadow-xl"
          >
            <div className="absolute top-4 right-4 text-[#D4AF37] font-bold text-[9px] border border-[#D4AF37]/40 px-2 py-0.5 rounded bg-amber-50 uppercase tracking-widest font-mono">
              Best Seller
            </div>
            
            <h4 className="text-[#800000] font-serif text-lg font-bold uppercase tracking-wider">Royal Kankotri Plan</h4>
            <div className="my-6">
              <span className="text-gray-400 line-through text-xs font-bold mr-2">₹4,999</span>
              <span className="text-[#800000] text-3xl font-extrabold font-serif">₹1,499</span>
              <span className="text-gray-400 text-xs font-bold block mt-1">One-time payment per wedding</span>
            </div>

            <ul className="text-left text-xs text-gray-600 space-y-3.5 border-t border-dashed border-[#D4AF37]/20 pt-6 mb-8 font-semibold">
              <li className="flex items-center space-x-2">
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
                <span>Custom Gujarati/English Names & Bios</span>
              </li>
              <li className="flex items-center space-x-2">
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
                <span>Unlimited RSVPs with guest list CSV export</span>
              </li>
              <li className="flex items-center space-x-2">
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
                <span>Preset Traditional Songs or Custom MP3 upload</span>
              </li>
              <li className="flex items-center space-x-2">
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
                <span>Ganesh splash animation + floral canvas rain</span>
              </li>
              <li className="flex items-center space-x-2">
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
                <span>Moderated wishes wall (approve/reject/delete)</span>
              </li>
              <li className="flex items-center space-x-2">
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
                <span>Photo gallery, maps navigation, and love stories</span>
              </li>
            </ul>

            <a
              href="/master-admin"
              className="block bg-[#800000] hover:bg-[#9B111E] text-[#D4AF37] font-bold text-xs py-3.5 px-4 rounded-xl border border-[#D4AF37]/30 shadow-lg cursor-pointer transition-all duration-200"
            >
              Get Started Now
            </a>
          </motion.div>
        </div>
      </section>

      {/* Footer / Console Quicklinks */}
      <footer className="relative z-10 bg-[#1F080C] text-[#FDFBF7] py-16 text-center border-t-2 border-[#D4AF37]">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom,rgba(128,0,0,0.35)_0%,rgba(10,2,4,0.98)_100%)] pointer-events-none"></div>

        <div className="relative max-w-4xl mx-auto px-4 flex flex-col items-center">
          <span className="text-2xl text-gold-metallic mb-4 animate-pulse">🪔</span>
          
          <h4 className="text-gold-metallic font-serif text-sm font-bold tracking-widest uppercase mb-4">
            GUJARATI DIGITAL INVITATIONS
          </h4>
          <p className="text-amber-100/50 text-[10px] max-w-sm leading-relaxed mb-6 font-semibold">
            Celebrate love, lineage, and legacy with modern luxury digital invitations. Completely automated guest lists and shehnai tunes.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 text-xs font-semibold text-amber-100/50 border-t border-[#D4AF37]/10 pt-8 w-full max-w-md justify-center items-center">
            <a href="/wedding/aarav-diya" target="_blank" rel="noopener noreferrer" className="hover:text-gold-metallic transition-colors">
              Live Demo invite
            </a>
            <span className="hidden sm:inline-block">|</span>
            <Link href="/admin/aarav-diya/login" className="hover:text-gold-metallic transition-colors">
              Couple Console login
            </Link>
            <span className="hidden sm:inline-block">|</span>
            <Link href="/master-admin" className="hover:text-gold-metallic transition-colors font-bold text-amber-200">
              Master Admin Control Panel
            </Link>
          </div>

          <p className="text-gray-700 text-[9px] tracking-wider uppercase mt-8 font-mono">
            © 2026 Shubh Kankotri. Designed by Antigravity AI.
          </p>
        </div>
      </footer>

    </div>
  );
}
