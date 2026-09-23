'use client';

import React, { useEffect, useRef, useState } from 'react';
import { Volume2, VolumeX, Music } from 'lucide-react';

interface AudioPlayerProps {
  url: string;
  autoPlay: boolean;
  triggerPlay: boolean;
}

export default function AudioPlayer({ url, autoPlay, triggerPlay }: AudioPlayerProps) {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.loop = true;
      audioRef.current.volume = 0.5;
    }
  }, [url]);

  useEffect(() => {
    if (triggerPlay && audioRef.current) {
      audioRef.current.play()
        .then(() => setIsPlaying(true))
        .catch(err => console.log("Autoplay blocked by browser. Awaiting user interaction.", err));
    }
  }, [triggerPlay]);

  const togglePlay = () => {
    if (!audioRef.current) return;
    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
    } else {
      audioRef.current.play()
        .then(() => setIsPlaying(true))
        .catch(err => console.log("Play failed", err));
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-40 select-none">
      <audio ref={audioRef} src={url || "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3"} />
      
      <button
        onClick={togglePlay}
        className={`w-12 h-12 rounded-full border-2 border-[#D4AF37] flex items-center justify-center cursor-pointer transition-all duration-300 relative shadow-lg ${
          isPlaying 
            ? 'bg-[#800000] text-[#D4AF37] animate-spin-slow' 
            : 'bg-[#FDFBF7] text-[#800000]'
        }`}
        title={isPlaying ? "Mute Music" : "Play Shehnai Music"}
      >
        {isPlaying ? (
          <>
            <Volume2 className="w-5 h-5" />
            {/* Animated music wave lines */}
            <span className="absolute -top-1 -left-1 flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-amber-500"></span>
            </span>
          </>
        ) : (
          <VolumeX className="w-5 h-5" />
        )}
      </button>

      {/* Decorative audio waves indicator next to the button */}
      {isPlaying && (
        <div className="absolute right-14 bottom-3 flex items-end space-x-[2px] bg-black/40 px-2 py-1.5 rounded-md backdrop-blur-sm border border-[#D4AF37]/30 h-6">
          <div className="w-[2px] bg-[#D4AF37] animate-[bounce_0.8s_infinite_100ms] h-3"></div>
          <div className="w-[2px] bg-[#D4AF37] animate-[bounce_0.8s_infinite_300ms] h-4"></div>
          <div className="w-[2px] bg-[#D4AF37] animate-[bounce_0.8s_infinite_0ms] h-2"></div>
          <div className="w-[2px] bg-[#D4AF37] animate-[bounce_0.8s_infinite_400ms] h-3.5"></div>
        </div>
      )}
    </div>
  );
}
