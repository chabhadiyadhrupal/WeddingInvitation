'use client';

import React, { useState, useTransition } from 'react';
import { motion } from 'framer-motion';
import { MessageCircleHeart, Send, Quote } from 'lucide-react';
import { submitWish } from '@/app/actions';
import { submitWishSaas } from '@/app/actions-saas';
import { Wish } from '@/lib/db';

interface BlessingsWallProps {
  initialWishes: Wish[];
  slug?: string;
}

export default function BlessingsWall({ initialWishes, slug }: BlessingsWallProps) {
  const wishes = initialWishes;
  const [name, setName] = useState('');
  const [message, setMessage] = useState('');
  
  const [isPending, startTransition] = useTransition();
  const [feedback, setFeedback] = useState<{ success?: boolean; message?: string } | null>(null);

  const handlePostWish = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !message.trim()) return;

    startTransition(async () => {
      try {
        const payload = { name, message };
        const res = slug 
          ? await submitWishSaas(slug, payload)
          : await submitWish(payload);
          
        if (res.success) {
          setFeedback({ success: true, message: res.message });
          setName('');
          setMessage('');
        } else {
          setFeedback({ success: false, message: (res as { message?: string; error?: string }).message || (res as { message?: string; error?: string }).error || 'Could not post blessing.' });
        }
      } catch (err) {
        console.error(err);
        setFeedback({ success: false, message: 'Error posting blessing.' });
      }
    });
  };

  return (
    <div className="w-full max-w-4xl mx-auto px-4 py-8 font-outfit select-none relative z-10">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Wish Post Form */}
        <div className="lg:col-span-1">
          <motion.div 
            initial={{ x: -20, opacity: 0 }}
            whileInView={{ x: 0, opacity: 1 }}
            viewport={{ once: true }}
            className="royal-card p-5 bg-[#FDFBF7]/90 sticky top-6 border border-[#D4AF37]/30 shadow-md"
          >
            <h4 className="text-[#800000] font-gujarati text-lg font-bold flex items-center space-x-2 pb-2 border-b border-[#D4AF37]/20">
              <MessageCircleHeart className="w-5 h-5 text-[#9B111E]" />
              <span>આશીર્વાદ આપો</span>
            </h4>
            <p className="text-gray-500 text-xs mt-1">Leave your wishes for the couple</p>

            {feedback && (
              <div 
                className={`p-3 rounded-xl text-xs font-semibold text-center mt-4 border ${
                  feedback.success
                    ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                    : 'bg-red-50 text-red-800 border-red-200'
                }`}
              >
                {feedback.message}
              </div>
            )}

            <form onSubmit={handlePostWish} className="space-y-4 mt-4">
              <div>
                <label className="block text-[10px] font-bold text-[#800000] uppercase">Your Name</label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={e => setName(e.target.value)}
                  placeholder="નામ..."
                  className="w-full mt-1 px-3 py-2 rounded-xl border border-gray-300 focus:outline-none focus:ring-1 focus:ring-[#800000] focus:border-[#800000] text-xs md:text-sm text-gray-800 bg-[#FDFBF7]"
                />
              </div>

              <div>
                <label className="block text-[10px] font-bold text-[#800000] uppercase">Blessings Message</label>
                <textarea
                  required
                  value={message}
                  onChange={e => setMessage(e.target.value)}
                  placeholder="શુભેચ્છા સંદેશ..."
                  rows={4}
                  className="w-full mt-1 px-3 py-2 rounded-xl border border-gray-300 focus:outline-none focus:ring-1 focus:ring-[#800000] focus:border-[#800000] text-xs md:text-sm text-gray-800 bg-[#FDFBF7] resize-none"
                />
              </div>

              <button
                type="submit"
                disabled={isPending}
                className="w-full bg-[#800000] hover:bg-[#9B111E] text-[#D4AF37] font-bold py-2.5 rounded-xl border border-[#D4AF37]/20 shadow flex items-center justify-center space-x-1.5 transition-colors cursor-pointer text-xs"
              >
                {isPending ? (
                  <span className="animate-spin h-4 w-4 border-2 border-[#D4AF37] border-t-transparent rounded-full"></span>
                ) : (
                  <>
                    <Send className="w-3.5 h-3.5" />
                    <span>મોકલો (Send Blessing)</span>
                  </>
                )}
              </button>
            </form>
          </motion.div>
        </div>

        {/* Wishes List */}
        <div className="lg:col-span-2">
          <h4 className="text-[#800000] font-serif text-xl font-bold mb-4 flex items-center space-x-2">
            <span>✨ Wishes & Blessings (મંગલ શુભેચ્છાઓ)</span>
          </h4>

          {wishes.length === 0 ? (
            <div className="text-center py-12 bg-white/70 backdrop-blur rounded-2xl border border-gray-200 shadow-sm">
              <p className="text-gray-500 text-sm italic">No wishes posted yet. Be the first to leave a blessing!</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {wishes.map((wish, index) => (
                <motion.div
                  key={wish.id}
                  initial={{ scale: 0.95, opacity: 0 }}
                  whileInView={{ scale: 1, opacity: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.05 }}
                  className="bg-[#FDFBF7]/95 border-2 border-dashed border-[#D4AF37]/30 rounded-xl p-5 shadow-sm relative flex flex-col justify-between hover:shadow-md transition-shadow"
                >
                  <span className="absolute right-4 top-2 text-[#D4AF37]/15">
                    <Quote className="w-12 h-12 rotate-180" />
                  </span>

                  <p className="text-gray-700 font-gujarati text-sm leading-relaxed mb-4 relative z-10 italic">
                    &ldquo;{wish.message}&rdquo;
                  </p>

                  <div className="border-t border-[#D4AF37]/10 pt-2 flex items-center justify-between mt-auto">
                    <span className="font-bold text-xs text-[#800000] font-gujarati">
                      - {wish.name}
                    </span>
                    <span className="text-[9px] text-gray-400 font-outfit">
                      {new Date(wish.created_at).toLocaleDateString('en-IN', {
                        month: 'short',
                        day: 'numeric'
                      })}
                    </span>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>

      </div>
    </div>
  );
}