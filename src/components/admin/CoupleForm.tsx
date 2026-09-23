'use client';

import React, { useState, useTransition } from 'react';
import { updateCouple } from '@/app/actions';
import { updateCoupleSaas } from '@/app/actions-saas';
import { CoupleInfo } from '@/lib/db';
import { Sparkles, Heart } from 'lucide-react';

interface CoupleFormProps {
  initialCouple: CoupleInfo;
  slug?: string;
}

export default function CoupleForm({ initialCouple, slug }: CoupleFormProps) {
  const [groomNameEn, setGroomNameEn] = useState(initialCouple.groom_name_en || '');
  const [groomNameGu, setGroomNameGu] = useState(initialCouple.groom_name_gu || '');
  const [groomBio, setGroomBio] = useState(initialCouple.groom_bio || '');
  const [groomPhoto, setGroomPhoto] = useState(initialCouple.groom_photo || '');

  const [brideNameEn, setBrideNameEn] = useState(initialCouple.bride_name_en || '');
  const [brideNameGu, setBrideNameGu] = useState(initialCouple.bride_name_gu || '');
  const [brideBio, setBrideBio] = useState(initialCouple.bride_bio || '');
  const [bridePhoto, setBridePhoto] = useState(initialCouple.bride_photo || '');

  const [welcomeMessage, setWelcomeMessage] = useState(initialCouple.welcome_message || '');

  const [groomUploading, setGroomUploading] = useState(false);
  const [brideUploading, setBrideUploading] = useState(false);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>, type: 'groom' | 'bride') => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (type === 'groom') setGroomUploading(true);
    else setBrideUploading(true);

    const formData = new FormData();
    formData.append('file', file);
    formData.append('type', 'images');

    try {
      const uploadUrl = slug ? `/api/upload?slug=${slug}` : '/api/upload';
      const res = await fetch(uploadUrl, {
        method: 'POST',
        body: formData,
      });
      const data = await res.json();
      if (data.success && data.url) {
        if (type === 'groom') setGroomPhoto(data.url);
        else setBridePhoto(data.url);
      } else {
        alert(data.error || 'Upload failed');
      }
    } catch (err) {
      console.error(err);
      alert('Error uploading file');
    } finally {
      if (type === 'groom') setGroomUploading(false);
      else setBrideUploading(false);
    }
  };

  const [isPending, startTransition] = useTransition();
  const [status, setStatus] = useState<{ success?: boolean; message?: string } | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setStatus(null);

    startTransition(async () => {
      try {
        const payload = {
          groom_name_en: groomNameEn,
          groom_name_gu: groomNameGu,
          groom_bio: groomBio,
          groom_photo: groomPhoto,
          bride_name_en: brideNameEn,
          bride_name_gu: brideNameGu,
          bride_bio: brideBio,
          bride_photo: bridePhoto,
          welcome_message: welcomeMessage,
        };

        const res = slug 
          ? await updateCoupleSaas(slug, payload)
          : await updateCouple(payload);

        if (res.success) {
          setStatus({ success: true, message: 'Couple details updated successfully!' });
        } else {
          setStatus({ success: false, message: 'Failed to update details.' });
        }
      } catch (err) {
        console.error(err);
        setStatus({ success: false, message: 'An error occurred.' });
      }
    });
  };

  return (
    <div className="space-y-6 font-outfit">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 font-serif">Couple Information</h1>
        <p className="text-gray-500 text-xs md:text-sm mt-1">Manage details, biographies, and welcome notes for the groom and bride</p>
      </div>

      {status && (
        <div
          className={`p-3.5 rounded-xl text-sm font-semibold text-center border ${
            status.success
              ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
              : 'bg-red-50 text-red-800 border-red-200'
          }`}
        >
          {status.message}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          
          {/* Groom Details */}
          <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm space-y-4">
            <h3 className="text-sm font-bold text-[#800000] uppercase tracking-wider flex items-center space-x-2 pb-2 border-b border-gray-100">
              <Heart className="w-4 h-4 text-[#9B111E]" />
              <span>Groom Details (વર પક્ષ)</span>
            </h3>

            <div>
              <label className="block text-xs font-bold text-gray-600 uppercase">Groom Name (English)</label>
              <input
                type="text"
                required
                value={groomNameEn}
                onChange={e => setGroomNameEn(e.target.value)}
                className="w-full mt-1 px-3.5 py-2.5 rounded-xl border border-gray-300 focus:outline-none focus:ring-1 focus:ring-[#800000] focus:border-[#800000] text-sm text-gray-800 bg-[#FDFBF7]"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-600 uppercase">Groom Name (Gujarati)</label>
              <input
                type="text"
                required
                value={groomNameGu}
                onChange={e => setGroomNameGu(e.target.value)}
                className="w-full mt-1 px-3.5 py-2.5 rounded-xl border border-gray-300 focus:outline-none focus:ring-1 focus:ring-[#800000] focus:border-[#800000] text-sm text-gray-800 bg-[#FDFBF7]"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-600 uppercase">Groom Bio</label>
              <textarea
                value={groomBio}
                onChange={e => setGroomBio(e.target.value)}
                rows={3}
                className="w-full mt-1 px-3.5 py-2.5 rounded-xl border border-gray-300 focus:outline-none focus:ring-1 focus:ring-[#800000] focus:border-[#800000] text-sm text-gray-800 bg-[#FDFBF7] resize-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-600 uppercase">Groom Photo</label>
              <div className="mt-1 flex items-center space-x-4">
                {groomPhoto && (
                  <div className="w-12 h-12 rounded-full overflow-hidden border border-gray-300 flex-shrink-0 bg-gray-50">
                    <img src={groomPhoto} alt="Groom Preview" className="w-full h-full object-cover" />
                  </div>
                )}
                <div className="flex-1">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={e => handleFileUpload(e, 'groom')}
                    className="w-full text-xs text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-semibold file:bg-amber-50 file:text-[#800000] hover:file:bg-amber-100 cursor-pointer"
                  />
                  {groomUploading && <span className="text-[10px] text-gray-400 animate-pulse block mt-1">Uploading...</span>}
                </div>
              </div>
            </div>
          </div>

          {/* Bride Details */}
          <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm space-y-4">
            <h3 className="text-sm font-bold text-[#800000] uppercase tracking-wider flex items-center space-x-2 pb-2 border-b border-gray-100">
              <Heart className="w-4 h-4 text-[#9B111E]" />
              <span>Bride Details (કન્યા પક્ષ)</span>
            </h3>

            <div>
              <label className="block text-xs font-bold text-gray-600 uppercase">Bride Name (English)</label>
              <input
                type="text"
                required
                value={brideNameEn}
                onChange={e => setBrideNameEn(e.target.value)}
                className="w-full mt-1 px-3.5 py-2.5 rounded-xl border border-gray-300 focus:outline-none focus:ring-1 focus:ring-[#800000] focus:border-[#800000] text-sm text-gray-800 bg-[#FDFBF7]"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-600 uppercase">Bride Name (Gujarati)</label>
              <input
                type="text"
                required
                value={brideNameGu}
                onChange={e => setBrideNameGu(e.target.value)}
                className="w-full mt-1 px-3.5 py-2.5 rounded-xl border border-gray-300 focus:outline-none focus:ring-1 focus:ring-[#800000] focus:border-[#800000] text-sm text-gray-800 bg-[#FDFBF7]"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-600 uppercase">Bride Bio</label>
              <textarea
                value={brideBio}
                onChange={e => setBrideBio(e.target.value)}
                rows={3}
                className="w-full mt-1 px-3.5 py-2.5 rounded-xl border border-gray-300 focus:outline-none focus:ring-1 focus:ring-[#800000] focus:border-[#800000] text-sm text-gray-800 bg-[#FDFBF7] resize-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-600 uppercase">Bride Photo</label>
              <div className="mt-1 flex items-center space-x-4">
                {bridePhoto && (
                  <div className="w-12 h-12 rounded-full overflow-hidden border border-gray-300 flex-shrink-0 bg-gray-50">
                    <img src={bridePhoto} alt="Bride Preview" className="w-full h-full object-cover" />
                  </div>
                )}
                <div className="flex-1">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={e => handleFileUpload(e, 'bride')}
                    className="w-full text-xs text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-semibold file:bg-amber-50 file:text-[#800000] hover:file:bg-amber-100 cursor-pointer"
                  />
                  {brideUploading && <span className="text-[10px] text-gray-400 animate-pulse block mt-1">Uploading...</span>}
                </div>
              </div>
            </div>
          </div>

        </div>

        {/* Welcome Message Banner */}
        <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm space-y-4">
          <h3 className="text-sm font-bold text-[#800000] uppercase tracking-wider pb-2 border-b border-gray-100">
            Welcome Message (શુભ કંકોતરી લખાણ)
          </h3>
          <div>
            <label className="block text-xs font-bold text-gray-600 uppercase">Invitation Quote / Welcome Message</label>
            <textarea
              required
              value={welcomeMessage}
              onChange={e => setWelcomeMessage(e.target.value)}
              rows={4}
              className="w-full mt-1 px-3.5 py-2.5 rounded-xl border border-gray-300 focus:outline-none focus:ring-1 focus:ring-[#800000] focus:border-[#800000] text-sm text-gray-800 bg-[#FDFBF7]"
            />
          </div>
        </div>

        {/* Submit */}
        <div className="flex justify-end">
          <button
            type="submit"
            disabled={isPending}
            className="bg-[#800000] hover:bg-[#9B111E] text-[#D4AF37] font-bold py-3 px-8 rounded-xl border border-[#D4AF37]/30 shadow-md cursor-pointer flex items-center space-x-2 transition-colors duration-200"
          >
            {isPending ? (
              <span className="animate-spin h-5 w-5 border-2 border-[#D4AF37] border-t-transparent rounded-full"></span>
            ) : (
              <>
                <Sparkles className="w-4 h-4" />
                <span>Save Changes</span>
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
