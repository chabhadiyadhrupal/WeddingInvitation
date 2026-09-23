'use client';

import React, { useState, useEffect, useRef } from 'react';
import QRCode from 'qrcode';
import { Share2, Copy, Check, MessageCircle, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface ShareInvitationProps {
  coupleNames: string;
}

export default function ShareInvitation({ coupleNames }: ShareInvitationProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const [shareUrl, setShareUrl] = useState('');
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  const handleOpen = () => {
    if (typeof window !== 'undefined') {
      setShareUrl(window.location.href);
    }
    setIsOpen(true);
  };

  useEffect(() => {
    if (isOpen && canvasRef.current && shareUrl) {
      QRCode.toCanvas(
        canvasRef.current,
        shareUrl,
        {
          width: 200,
          margin: 2,
          color: {
            dark: '#4A0E17',
            light: '#FDFBF7',
          },
        },
        (err) => {
          if (err) console.error(err);
        }
      );
    }
  }, [isOpen, shareUrl]);

  const handleCopy = () => {
    navigator.clipboard.writeText(shareUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const whatsappUrl = `https://api.whatsapp.com/send?text=${encodeURIComponent(
    `આપને જાણીને આનંદ થશે કે વહાલાં ${coupleNames}ના શુભ લગ્ન નક્કી થયા છે. આપશ્રીને સહપરિવાર પધારવા ભાવભીનું આમંત્રણ છે. આમંત્રણ પત્રિકા જોવા માટે અહીં ક્લિક કરો: ${shareUrl}`
  )}`;

  return (
    <div className="w-full text-center py-6 select-none font-outfit">
      <button
        onClick={handleOpen}
        className="inline-flex items-center space-x-2 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-[#1F080C] font-bold py-2.5 px-6 rounded-full shadow-md border border-[#FFE89C] transition-all duration-300 cursor-pointer"
      >
        <Share2 className="w-4 h-4" />
        <span className="font-gujarati text-xs md:text-sm">આમંત્રણ શેર કરો (Share Invitation)</span>
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4"
            onClick={() => setIsOpen(false)}
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              className="w-full max-w-sm royal-card p-6 text-center bg-[#FDFBF7]"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Close Button */}
              <div className="flex justify-end -mt-2 -mr-2">
                <button
                  onClick={() => setIsOpen(false)}
                  className="p-1 rounded-full text-gray-400 hover:text-gray-600 cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <h4 className="text-[#800000] font-gujarati text-lg font-bold">આમંત્રણ શેર કરો</h4>
              <p className="text-gray-500 text-xs mt-1">Scan or share the wedding invite link</p>

              {/* QR Code Canvas */}
              <div className="flex justify-center my-6 bg-[#FDFBF7] p-3 rounded-xl border border-[#D4AF37]/30 shadow-inner inline-block">
                <canvas ref={canvasRef} className="rounded-lg shadow-sm" />
              </div>

              {/* Share/Actions Grid */}
              <div className="space-y-3">
                <a
                  href={whatsappUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full py-2.5 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs md:text-sm flex items-center justify-center space-x-2 shadow-sm transition-colors duration-200"
                >
                  <MessageCircle className="w-4 h-4" />
                  <span className="font-gujarati">વોટ્સએપ આમંત્રણ (WhatsApp Invite)</span>
                </a>

                <button
                  onClick={handleCopy}
                  className="w-full py-2.5 px-4 rounded-xl bg-white border border-gray-300 hover:bg-gray-50 text-gray-700 font-semibold text-xs md:text-sm flex items-center justify-center space-x-2 transition-colors duration-200 cursor-pointer"
                >
                  {copied ? (
                    <>
                      <Check className="w-4 h-4 text-emerald-600" />
                      <span className="text-emerald-600 font-gujarati">નકલ થઈ ગઈ (Copied!)</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-4 h-4" />
                      <span className="font-gujarati">લિંક કોપી કરો (Copy Link)</span>
                    </>
                  )}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
