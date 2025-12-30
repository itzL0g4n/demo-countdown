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
    <main ref={containerRef} className="relative min-h-screen w-full flex flex-col items-center p-6 md:p-12 overflow-hidden font-sans selection:bg-black selection:text-white">
      <Background isComplete={isComplete} />
      
      <div className="z-10 w-full max-w-6xl flex flex-col items-center justify-between min-h-[90vh]">
        
        {/* Minimal Header */}
        <header className={`w-full flex flex-col md:flex-row items-center justify-between py-8 border-b border-black/5 transition-opacity duration-1000 ${isComplete ? 'opacity-0' : 'opacity-100'}`}>
          <div className="flex items-center space-x-2 text-charcoal/60 uppercase tracking-widest text-xs font-semibold">
            <MapPin className="w-3 h-3" />
            <span>Hanoi / Bangkok</span>
          </div>
          <div className="hidden md:block text-xs font-mono text-charcoal/40">
             TARGET: 2026.01.01
          </div>
        </header>

        {/* Hero Section */}
        <div className="flex-1 flex flex-col items-center justify-center space-y-12 w-full py-12 perspective-1000">
          
          <div className={`text-center space-y-2 relative z-20 transition-opacity duration-1000 ${isComplete ? 'opacity-0' : 'opacity-100'}`}>
            <div className="overflow-hidden">
               <h2 className="text-lg md:text-xl font-serif italic text-charcoal/60 animate-slide-up">
                  The Future is
               </h2>
            </div>
            
            {/* Static, Heavy 2026 Text */}
            <h1 
              className="text-[15vw] md:text-[10rem] leading-[0.85] font-display font-extrabold text-charcoal tracking-tighter mix-blend-multiply select-none cursor-default"
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
    </main>
  );
}