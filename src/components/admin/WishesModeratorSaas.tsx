'use client';

import React, { useState, useTransition } from 'react';
import { approveWishSaas, deleteWishSaas } from '@/app/actions-saas';
import { Wish } from '@/lib/db';
import { Check, Trash2, X, MessageSquareQuote, ShieldAlert } from 'lucide-react';

interface Props {
  slug: string;
  initialWishes: Wish[];
}

export default function WishesModeratorSaas({ slug, initialWishes }: Props) {
  const [wishes, setWishes] = useState<Wish[]>(initialWishes);
  const [isPending, startTransition] = useTransition();

  const pending = wishes.filter(w => !w.approved);
  const approved = wishes.filter(w => w.approved);

  const handleApprove = (id: string, approve: boolean) => {
    startTransition(async () => {
      const res = await approveWishSaas(slug, id, approve);
      if (res.success) {
        setWishes(prev =>
          prev.map(w => (w.id === id ? { ...w, approved: approve } : w))
        );
      }
    });
  };

  const handleDelete = (id: string) => {
    if (!confirm('Are you sure you want to delete this blessing permanently?')) return;
    
    startTransition(async () => {
      const res = await deleteWishSaas(slug, id);
      if (res.success) {
        setWishes(prev => prev.filter(w => w.id !== id));
      }
    });
  };

  return (
    <div className="space-y-8 font-outfit select-none animate-fadeIn">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 font-serif">Blessings Moderation</h1>
        <p className="text-gray-500 text-xs md:text-sm mt-1">
          Approve or delete messages posted by guests to the blessings wall
        </p>
      </div>

      {/* 1. PENDING MODERATION */}
      <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm space-y-4">
        <h3 className="text-sm font-bold text-amber-600 uppercase tracking-wider flex items-center space-x-2 pb-2 border-b border-gray-100">
          <ShieldAlert className="w-4 h-4" />
          <span>Pending Approval ({pending.length})</span>
        </h3>

        {pending.length === 0 ? (
          <p className="text-gray-400 text-sm italic py-4">No pending messages.</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {pending.map(wish => (
              <div key={wish.id} className="bg-amber-50/30 border border-amber-200 rounded-xl p-4 flex flex-col justify-between space-y-4 shadow-sm">
                <div>
                  <p className="text-gray-800 text-xs md:text-sm italic">&ldquo;{wish.message}&rdquo;</p>
                  <span className="block font-bold text-xs text-[#800000] mt-2 font-gujarati">- {wish.name}</span>
                </div>
                
                <div className="flex justify-end space-x-2 pt-2 border-t border-amber-100">
                  <button
                    onClick={() => handleDelete(wish.id)}
                    disabled={isPending}
                    className="p-1.5 rounded-lg text-gray-400 hover:text-red-600 hover:bg-red-50 transition-colors cursor-pointer"
                    title="Delete Permanently"
                  >
                    <Trash2 className="w-4.5 h-4.5" />
                  </button>
                  <button
                    onClick={() => handleApprove(wish.id, true)}
                    disabled={isPending}
                    className="py-1.5 px-3 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs flex items-center space-x-1 cursor-pointer transition-colors shadow-sm"
                  >
                    <Check className="w-3.5 h-3.5" />
                    <span>Approve</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* 2. APPROVED WISHES */}
      <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm space-y-4">
        <h3 className="text-sm font-bold text-emerald-700 uppercase tracking-wider flex items-center space-x-2 pb-2 border-b border-gray-100">
          <MessageSquareQuote className="w-4 h-4" />
          <span>Approved Blessings ({approved.length})</span>
        </h3>

        {approved.length === 0 ? (
          <p className="text-gray-400 text-sm italic py-4">No approved messages yet.</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {approved.map(wish => (
              <div key={wish.id} className="bg-[#FDFBF7] border border-gray-200 rounded-xl p-4 flex flex-col justify-between space-y-4 shadow-sm">
                <div>
                  <p className="text-gray-700 text-xs md:text-sm italic">&ldquo;{wish.message}&rdquo;</p>
                  <span className="block font-bold text-xs text-[#800000] mt-2 font-gujarati">- {wish.name}</span>
                </div>
                
                <div className="flex justify-end space-x-2 pt-2 border-t border-gray-100">
                  <button
                    onClick={() => handleDelete(wish.id)}
                    disabled={isPending}
                    className="p-1.5 rounded-lg text-gray-400 hover:text-red-600 hover:bg-red-50 transition-colors cursor-pointer"
                    title="Delete Permanently"
                  >
                    <Trash2 className="w-4.5 h-4.5" />
                  </button>
                  <button
                    onClick={() => handleApprove(wish.id, false)}
                    disabled={isPending}
                    className="py-1.5 px-3 rounded-lg bg-gray-100 hover:bg-gray-200 text-gray-700 border border-gray-300 font-bold text-xs flex items-center space-x-1 cursor-pointer transition-colors"
                  >
                    <X className="w-3.5 h-3.5" />
                    <span>Unapprove</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
