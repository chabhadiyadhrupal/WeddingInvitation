'use client';

import React, { useState, useTransition } from 'react';
import { motion } from 'framer-motion';
import { Users, Phone, User, MessageSquare, Check, Sparkles } from 'lucide-react';
import confetti from 'canvas-confetti';
import { submitRSVP } from '@/app/actions';
import { submitRSVPSaas } from '@/app/actions-saas';

interface RSVPFormProps {
  slug?: string;
}

export default function RSVPForm({ slug }: RSVPFormProps) {
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [guestsCount, setGuestsCount] = useState(1);
  const [attending, setAttending] = useState<boolean | null>(null);
  const [message, setMessage] = useState('');
  
  const [isPending, startTransition] = useTransition();
  const [status, setStatus] = useState<{ success?: boolean; message?: string } | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (attending === null) {
      setStatus({ success: false, message: 'Please select whether you will attend.' });
      return;
    }

    startTransition(async () => {
      try {
        const payload = {
          name,
          phone,
          guests_count: attending ? Number(guestsCount) : 0,
          attending,
          message
        };

        const res = slug 
          ? await submitRSVPSaas(slug, payload)
          : await submitRSVP(payload);

        if (res.success) {
          setStatus({ success: true, message: 'આરએસવીપી સ્વીકારવામાં આવી છે! Thank you for confirming.' });
          
          // Trigger traditional confetti (gold + maroon colors)
          confetti({
            particleCount: 150,
            spread: 80,
            origin: { y: 0.6 },
            colors: ['#D4AF37', '#800000', '#F3E5AB', '#9B111E']
          });

          // Reset fields
          setName('');
          setPhone('');
          setGuestsCount(1);
          setAttending(null);
          setMessage('');
        } else {
          setStatus({ success: false, message: (res as { message?: string; error?: string }).message || (res as { message?: string; error?: string }).error || 'Something went wrong.' });
        }
      } catch (err) {
        console.error(err);
        setStatus({ success: false, message: 'Error submitting RSVP. Please try again.' });
      }
    });
  };

  return (
    <div className="w-full max-w-xl mx-auto px-4 py-8 font-outfit select-none">
      <motion.div 
        initial={{ y: 20, opacity: 0 }}
        whileInView={{ y: 0, opacity: 1 }}
        viewport={{ once: true }}
        className="royal-card p-6 md:p-8 bg-[#FDFBF7]/95 border-2 border-[#D4AF37]/40 shadow-xl relative z-10"
      >
        <div className="text-center mb-6">
          <span className="text-2xl text-[#800000] mb-2 block">💌</span>
          <h3 className="text-xl md:text-2xl font-bold font-serif text-[#800000] tracking-wide">
            આરએસવીપી (RSVP)
          </h3>
          <p className="text-gray-500 text-xs md:text-sm mt-1">
            Please let us know if you will be joining us to celebrate
          </p>
          <div className="w-16 h-[1px] bg-[#D4AF37] mx-auto mt-3"></div>
        </div>

        {status && (
          <motion.div 
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className={`p-3.5 rounded-xl text-center text-xs md:text-sm font-semibold mb-5 border ${
              status.success 
                ? 'bg-emerald-50 text-emerald-800 border-emerald-200' 
                : 'bg-red-50 text-red-800 border-red-200'
            }`}
          >
            {status.message}
          </motion.div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Guest Name */}
          <div>
            <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Your Full Name</label>
            <div className="relative">
              <span className="absolute inset-y-0 left-3 flex items-center pointer-events-none text-gray-400">
                <User className="w-4 h-4" />
              </span>
              <input
                type="text"
                required
                value={name}
                onChange={e => setName(e.target.value)}
                placeholder="અતિથિનું નામ..."
                className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-gray-300 focus:outline-none focus:ring-1 focus:ring-[#800000] focus:border-[#800000] text-sm text-gray-800 bg-[#FDFBF7]"
              />
            </div>
          </div>

          {/* Guest Phone */}
          <div>
            <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Contact Phone</label>
            <div className="relative">
              <span className="absolute inset-y-0 left-3 flex items-center pointer-events-none text-gray-400">
                <Phone className="w-4 h-4" />
              </span>
              <input
                type="tel"
                required
                value={phone}
                onChange={e => setPhone(e.target.value)}
                placeholder="ફોન નંબર..."
                className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-gray-300 focus:outline-none focus:ring-1 focus:ring-[#800000] focus:border-[#800000] text-sm text-gray-800 bg-[#FDFBF7]"
              />
            </div>
          </div>

          {/* Attendance Toggle */}
          <div>
            <label className="block text-xs font-bold text-gray-700 uppercase mb-2">Will you attend?</label>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setAttending(true)}
                className={`py-2.5 px-4 rounded-xl text-xs md:text-sm font-bold border transition-all cursor-pointer flex items-center justify-center space-x-1.5 ${
                  attending === true
                    ? 'bg-[#800000] text-[#D4AF37] border-[#800000] shadow-md'
                    : 'bg-white text-gray-700 border-gray-300 hover:bg-amber-50/30'
                }`}
              >
                <Check className={`w-4 h-4 ${attending === true ? 'opacity-100' : 'opacity-0'}`} />
                <span>Yes, Attending (પધારીશું)</span>
              </button>
              <button
                type="button"
                onClick={() => setAttending(false)}
                className={`py-2.5 px-4 rounded-xl text-xs md:text-sm font-bold border transition-all cursor-pointer flex items-center justify-center space-x-1.5 ${
                  attending === false
                    ? 'bg-[#800000] text-[#D4AF37] border-[#800000] shadow-md'
                    : 'bg-white text-gray-700 border-gray-300 hover:bg-amber-50/30'
                }`}
              >
                <span className="w-4"></span>
                <span>No, Cannot Attend (ક્ષમાપ્રાર્થી)</span>
              </button>
            </div>
          </div>

          {/* Guest Count */}
          {attending === true && (
            <motion.div 
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              className="overflow-hidden"
            >
              <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Number of Guests</label>
              <div className="relative">
                <span className="absolute inset-y-0 left-3 flex items-center pointer-events-none text-gray-400">
                  <Users className="w-4 h-4" />
                </span>
                <select
                  value={guestsCount}
                  onChange={e => setGuestsCount(Number(e.target.value))}
                  className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-gray-300 focus:outline-none focus:ring-1 focus:ring-[#800000] focus:border-[#800000] text-sm text-gray-800 bg-[#FDFBF7]"
                >
                  {[1, 2, 3, 4, 5, 6, 7, 8].map(n => (
                    <option key={n} value={n}>{n} {n === 1 ? 'Person' : 'People'}</option>
                  ))}
                </select>
              </div>
            </motion.div>
          )}

          {/* Message for Couple */}
          <div>
            <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Message for the Couple</label>
            <div className="relative">
              <span className="absolute top-3 left-3 flex items-center pointer-events-none text-gray-400">
                <MessageSquare className="w-4 h-4" />
              </span>
              <textarea
                value={message}
                onChange={e => setMessage(e.target.value)}
                placeholder="શુભેચ્છા સંદેશ..."
                rows={3}
                className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-gray-300 focus:outline-none focus:ring-1 focus:ring-[#800000] focus:border-[#800000] text-sm text-gray-800 bg-[#FDFBF7] resize-none"
              />
            </div>
          </div>

          {/* Submit Button */}
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            type="submit"
            disabled={isPending}
            className="w-full bg-[#800000] hover:bg-[#9B111E] text-[#D4AF37] font-bold py-3.5 px-4 rounded-xl border border-[#D4AF37]/30 shadow-lg cursor-pointer transition-all duration-300 flex items-center justify-center space-x-2 text-xs md:text-sm"
          >
            {isPending ? (
              <span className="animate-spin h-5 w-5 border-2 border-[#D4AF37] border-t-transparent rounded-full"></span>
            ) : (
              <>
                <Sparkles className="w-4 h-4" />
                <span className="font-gujarati">મોકલો (Submit RSVP)</span>
              </>
            )}
          </motion.button>
        </form>
      </motion.div>
    </div>
  );
}