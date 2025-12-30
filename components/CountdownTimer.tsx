import React, { useEffect, useState } from 'react';
import { calculateTimeLeft, formatNumber } from '../utils/timeUtils';
import { TimeLeft } from '../types';

interface CountdownTimerProps {
  onComplete: () => void;
}

export const CountdownTimer: React.FC<CountdownTimerProps> = ({ onComplete }) => {
  const [timeLeft, setTimeLeft] = useState<TimeLeft | null>(calculateTimeLeft());
  const [phase, setPhase] = useState<'counting' | 'fading-out' | 'waiting' | 'now-visible'>('counting');

  useEffect(() => {
    // If we are not in counting phase, the interval shouldn't be running logic to check time
    if (phase !== 'counting') return;

    const checkTime = () => {
      const newTimeLeft = calculateTimeLeft();
      if (!newTimeLeft) {
        // --- SEQUENCE START ---
        
        // 1. Immediately freeze background and physics
        onComplete(); 
        
        // 2. Start fading out the numbers
        setPhase('fading-out');
        
        // 3. Wait for fade out to finish (500ms)
        setTimeout(() => {
            setPhase('waiting');

            // 4. Hold stillness (Pure silence) for 1s
            setTimeout(() => {
                setPhase('now-visible');
            }, 1000);

        }, 500);

        setTimeLeft(null);
        return true;
      }
      setTimeLeft(newTimeLeft);
      return false;
    };

    // Check immediately on mount
    const finishedImmediately = checkTime();
    if (finishedImmediately) return;

    const timer = setInterval(() => {
      const finished = checkTime();
      if (finished) {
        clearInterval(timer);
      }
    }, 1000);

    return () => clearInterval(timer);
  }, [phase, onComplete]);

  if (phase === 'now-visible') {
    return (
      <div className="flex flex-col items-center justify-center animate-fade-in mt-20">
        <span className="text-6xl md:text-9xl font-display font-bold text-charcoal opacity-90 tracking-tighter uppercase mix-blend-multiply">
          Now
        </span>
      </div>
    );
  }

  // Preserve layout height during fade/wait to avoid jumps
  if (phase === 'waiting') {
      return <div className="h-[240px] md:h-32 w-full"></div>;
  }

  return (
    <div 
        className={`w-full border-t border-b border-black/10 py-8 md:py-12 transition-opacity duration-500 ease-out 
        grid grid-cols-2 gap-y-12 gap-x-4 md:flex md:justify-between md:gap-0
        ${phase === 'fading-out' ? 'opacity-0' : 'opacity-100'}`}
    >
        {timeLeft ? (
            <>
                <TimerUnit value={timeLeft.days} label="Days" />
                <div className="hidden md:block w-px h-16 bg-black/10 self-center"></div>
                <TimerUnit value={timeLeft.hours} label="Hours" />
                <div className="hidden md:block w-px h-16 bg-black/10 self-center"></div>
                <TimerUnit value={timeLeft.minutes} label="Minutes" />
                <div className="hidden md:block w-px h-16 bg-black/10 self-center"></div>
                <TimerUnit value={timeLeft.seconds} label="Seconds" />
            </>
        ) : (
            // Fallback for initial render before effect if time is technically 0 but state not updated
            <div className="h-[240px] md:h-32 w-full"></div>
        )}
    </div>
  );
};

interface TimerUnitProps {
  value: number;
  label: string;
}

const TimerUnit: React.FC<TimerUnitProps> = ({ value, label }) => {
  return (
    <div className="flex flex-col items-center justify-center flex-1">
      {/* 
          Updated font-display to font-sans (Inter) 
          Inter supports tabular-nums perfectly, ensuring alignment.
      */}
      <span className="text-6xl md:text-7xl font-sans font-bold text-charcoal tabular-nums tracking-tighter leading-none">
        {formatNumber(value)}
      </span>
      <span className="mt-2 text-[10px] md:text-xs font-sans uppercase tracking-[0.25em] text-charcoal/50">
        {label}
      </span>
    </div>
  );
};