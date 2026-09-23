'use client';

import React, { useEffect, useState } from 'react';

interface CountdownTimerProps {
  targetDate: string; // "YYYY-MM-DD"
  targetTime?: string; // "HH:MM AM/PM"
}

export default function CountdownTimer({ targetDate, targetTime = "10:00 AM" }: CountdownTimerProps) {
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
    isExpired: false
  });

  useEffect(() => {
    // Parse target date and time
    const dateStr = targetDate;
    
    // Convert e.g. "10:00 AM" to "10:00:00" and combine
    let timeStr = "10:00:00";
    if (targetTime) {
      const match = targetTime.match(/(\d+):(\d+)\s*(AM|PM)/i);
      if (match) {
        let hrs = parseInt(match[1]);
        const mins = match[2];
        const amp = match[3].toUpperCase();
        if (amp === 'PM' && hrs < 12) hrs += 12;
        if (amp === 'AM' && hrs === 12) hrs = 0;
        timeStr = `${hrs.toString().padStart(2, '0')}:${mins}:00`;
      }
    }
    
    const targetTimestamp = new Date(`${dateStr}T${timeStr}`).getTime();

    const calculateTime = () => {
      const now = new Date().getTime();
      const difference = targetTimestamp - now;

      if (difference <= 0) {
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0, isExpired: true });
        return;
      }

      const d = Math.floor(difference / (1000 * 60 * 60 * 24));
      const h = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const m = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
      const s = Math.floor((difference % (1000 * 60)) / 1000);

      setTimeLeft({ days: d, hours: h, minutes: m, seconds: s, isExpired: false });
    };

    calculateTime();
    const interval = setInterval(calculateTime, 1000);

    return () => clearInterval(interval);
  }, [targetDate, targetTime]);

  if (timeLeft.isExpired) {
    return (
      <div className="text-center py-6">
        <h3 className="text-2xl font-serif font-bold text-gold-metallic">
          The Auspicious Day is Here!
        </h3>
        <p className="text-amber-100 font-gujarati mt-2">મંગલ મય પ્રારંભ થઈ ચૂક્યો છે.</p>
      </div>
    );
  }

  const timerItems = [
    { value: timeLeft.days, labelEn: "Days", labelGu: "દિવસો" },
    { value: timeLeft.hours, labelEn: "Hours", labelGu: "કલાકો" },
    { value: timeLeft.minutes, labelEn: "Minutes", labelGu: "મિનિટો" },
    { value: timeLeft.seconds, labelEn: "Seconds", labelGu: "સેકન્ડો" }
  ];

  return (
    <div className="flex justify-center items-center space-x-2 md:space-x-6 max-w-xl mx-auto py-4 select-none">
      {timerItems.map((item, idx) => (
        <div 
          key={idx} 
          className="flex flex-col items-center justify-center w-20 h-24 md:w-28 md:h-32 rounded-xl border border-[#D4AF37]/40 bg-[#800000]/60 backdrop-blur-sm shadow-[inset_0_0_15px_rgba(212,175,55,0.1)] relative overflow-hidden"
        >
          {/* Subtle top metallic shine highlight */}
          <div className="absolute top-0 inset-x-0 h-[2px] bg-gradient-to-r from-transparent via-[#FFE89C] to-transparent"></div>
          
          {/* Moving shine sweep across the timer box */}
          <div className="absolute inset-y-0 w-1/2 bg-gradient-to-r from-transparent via-white/15 to-transparent -skew-x-12 pointer-events-none" style={{ animation: 'metallicShine 3.5s infinite linear', animationDelay: `${idx * 0.3}s` }}></div>
          
          <span className="text-2xl md:text-4xl font-bold font-serif text-gold-metallic tracking-normal">
            {item.value.toString().padStart(2, '0')}
          </span>
          <span className="text-[10px] md:text-xs font-semibold text-amber-200 mt-1 uppercase tracking-wider font-outfit">
            {item.labelEn}
          </span>
          <span className="text-[9px] md:text-[10px] text-amber-100 font-gujarati opacity-75 mt-[1px]">
            {item.labelGu}
          </span>
        </div>
      ))}
    </div>
  );
}
