import React, { useState, useRef, useEffect } from 'react';
import { Background } from './components/Background';
import { CountdownTimer } from './components/CountdownTimer';
import { AICard } from './components/AICard';
import { MapPin } from 'lucide-react';

export default function App() {
  const [isComplete, setIsComplete] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isComplete) {
      const noise = document.querySelector('.noise-bg') as HTMLElement;
      if (noise) {
        noise.style.animationPlayState = 'paused';
      }
    }
  }, [isComplete]);

  return (
    <main ref={containerRef} className="relative min-h-screen w-full overflow-hidden font-sans selection:bg-black selection:text-white bg-cloud-dancer">
      <Background isComplete={isComplete} />
      
      {/* =========================================
          DESKTOP VIEW (Hidden on Mobile)
         ========================================= */}
      <div className="hidden md:flex flex-col items-center p-12 min-h-screen w-full max-w-6xl mx-auto justify-between relative z-10">
        
        {/* Minimal Header */}
        <header className={`w-full flex flex-row items-center justify-between py-8 border-b border-black/5 transition-opacity duration-1000 ${isComplete ? 'opacity-0' : 'opacity-100'}`}>
          <div className="flex items-center space-x-2 text-charcoal/60 uppercase tracking-widest text-xs font-semibold">
            <MapPin className="w-3 h-3" />
            <span>Hanoi / Bangkok</span>
          </div>
          <div className="block text-xs font-mono text-charcoal/40">
             TARGET: 2026.01.01
          </div>
        </header>

        {/* Hero Section */}
        <div className="flex-1 flex flex-col items-center justify-center space-y-12 w-full py-12 perspective-1000">
          
          <div className={`text-center space-y-2 relative z-20 transition-opacity duration-1000 ${isComplete ? 'opacity-0' : 'opacity-100'}`}>
            <div className="overflow-hidden">
               <h2 className="text-xl font-serif italic text-charcoal/60 animate-slide-up">
                  The Future is
               </h2>
            </div>
            
            {/* Static, Heavy 2026 Text */}
            <h1 
              className="text-[10rem] leading-[0.85] font-display font-extrabold text-charcoal tracking-tighter mix-blend-multiply select-none cursor-default"
            >
              2026
            </h1>
          </div>

          {/* Timer */}
          <div className="w-full max-w-4xl min-h-[200px] flex items-center justify-center">
             <CountdownTimer onComplete={() => setIsComplete(true)} />
          </div>

        </div>

        {/* Bottom Section */}
        <div className={`w-full flex justify-center pb-8 z-20 transition-opacity duration-1000 ${isComplete ? 'opacity-0 pointer-events-none' : 'opacity-100'}`}>
           <div className="w-full max-w-xl">
              <AICard />
           </div>
        </div>
      </div>


      {/* =========================================
          MOBILE VIEW (Hidden on Desktop)
         ========================================= */}
      <div className={`flex md:hidden flex-col h-screen w-full relative p-6 justify-between transition-opacity duration-1000 ${isComplete ? 'opacity-0' : 'opacity-100'}`}>
        
        {/* 1. Mobile Header: Compact & Top Aligned */}
        <div className="w-full flex justify-between items-start pt-2 z-20">
            <div className="flex items-center space-x-1.5 text-[10px] uppercase tracking-widest text-charcoal/60 font-semibold bg-white/30 backdrop-blur-sm px-3 py-1.5 rounded-full border border-white/20">
                <MapPin className="w-3 h-3" />
                <span>BKK / HAN</span>
            </div>
            <div className="text-[10px] font-mono text-charcoal/40 bg-white/30 backdrop-blur-sm px-3 py-1.5 rounded-full border border-white/20">
                2026.01.01
            </div>
        </div>

        {/* 2. Mobile Center: Massive Typography & Grid Timer */}
        <div className="flex-1 flex flex-col justify-center items-center w-full z-10 relative">
            
            <div className="w-full flex flex-col items-center mb-8">
                <div className="w-full text-left pl-2 mb-[-10px] relative z-10">
                    <span className="font-serif italic text-charcoal/60 text-lg">The Future is</span>
                </div>
                <h1 className="text-[32vw] font-display font-extrabold text-charcoal leading-none tracking-tighter mix-blend-multiply drop-shadow-sm">
                    2026
                </h1>
            </div>

            <div className="w-full px-2">
                <CountdownTimer onComplete={() => setIsComplete(true)} />
            </div>
        </div>

        {/* 3. Mobile Footer: AI Card (Bottom Drawer feel) */}
        <div className="w-full pb-4 z-20">
            <AICard />
        </div>

      </div>
    </main>
  );
}