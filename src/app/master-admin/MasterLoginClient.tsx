'use client';

import React, { useState, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import { masterLoginAction } from '@/app/actions-saas';
import { Lock, Sparkles, KeyRound } from 'lucide-react';
import { motion } from 'framer-motion';

export default function MasterLoginClient() {
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    startTransition(async () => {
      try {
        const res = await masterLoginAction(password);
        if (res.success) {
          router.refresh();
        } else {
          setError('નિષ્ફળ: ખોટો પાસવર્ડ (Invalid Master Password)');
        }
      } catch (err) {
        console.error(err);
        setError('An error occurred. Please try again.');
      }
    });
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#1F080C] px-4 font-outfit select-none relative">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(128,0,0,0.35)_0%,rgba(10,2,4,0.98)_100%)] pointer-events-none"></div>

      <motion.div
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md royal-card-dark p-8 border-2 border-[#D4AF37] relative flex flex-col items-center shadow-2xl"
      >
        <div className="absolute top-4 left-4 text-[#D4AF37]/40 text-sm">卐</div>
        <div className="absolute top-4 right-4 text-[#D4AF37]/40 text-sm">卐</div>

        <div className="w-16 h-16 rounded-full bg-gold-metallic border-2 border-[#FFE89C] flex items-center justify-center text-[#4A0E17] mb-6 shadow-md">
          <KeyRound className="w-8 h-8" />
        </div>

        <h2 className="text-gold-metallic text-2xl font-bold font-serif tracking-wider text-center">
          MASTER CONTROL
        </h2>
        <p className="text-amber-100/60 text-xs font-semibold uppercase tracking-wider mt-1 mb-8">
          Super Admin Console
        </p>

        {error && (
          <div className="w-full p-3 rounded-xl bg-red-950/50 border border-red-500/30 text-red-200 text-xs font-medium mb-6 text-center">
            {error}
          </div>
        )}

        <form onSubmit={handleLogin} className="w-full space-y-5">
          <div>
            <label className="block text-[10px] font-bold text-amber-200 uppercase tracking-widest mb-1.5">
              Enter Super Admin Password
            </label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-amber-200/50">
                <Lock className="w-4 h-4" />
              </span>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="******"
                className="w-full pl-10 pr-4 py-3 rounded-xl border border-[#D4AF37]/30 focus:outline-none focus:ring-1 focus:ring-[#D4AF37] focus:border-[#D4AF37] text-sm text-white bg-[#1F080C]/85 placeholder-gray-600"
              />
            </div>
          </div>

          <motion.button
            whileHover={{ scale: 1.02, boxShadow: "0 0 15px rgba(212,175,55,0.4)" }}
            whileTap={{ scale: 0.98 }}
            type="submit"
            disabled={isPending}
            className="w-full bg-gold-metallic text-[#4A0E17] font-bold py-3.5 rounded-xl border border-[#FFE89C] shadow-lg cursor-pointer flex items-center justify-center space-x-2 transition-all duration-300"
          >
            {isPending ? (
              <span className="animate-spin h-5 w-5 border-2 border-[#4A0E17] border-t-transparent rounded-full"></span>
            ) : (
              <>
                <Sparkles className="w-4 h-4" />
                <span className="font-serif text-sm md:text-base tracking-wide">Access Master Console</span>
              </>
            )}
          </motion.button>
        </form>

        <p className="text-gray-600 text-[10px] tracking-widest mt-8 font-mono">
          DEFAULT PASSWORD: masterwedding2026
        </p>
      </motion.div>
    </div>
  );
}
