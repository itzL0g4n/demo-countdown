import React, { useEffect, useRef } from 'react';

interface BackgroundProps {
  isComplete: boolean;
}

export const Background: React.FC<BackgroundProps> = ({ isComplete }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  
  // Mouse state
  const mouse = useRef({ x: -1000, y: -1000 });
  // Lagged mouse for inertia/weight feel
  const laggedMouse = useRef({ x: -1000, y: -1000 });
  
  // Time state for micro-events
  const timeState = useRef({
    lastSecond: -1,
    lastMinute: -1,
    secondPulse: 0,
    minuteSnap: 0,
  });

  const isCompleteRef = useRef(isComplete);

  useEffect(() => {
    isCompleteRef.current = isComplete;
  }, [isComplete]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let width = 0;
    let height = 0;

    const setSize = () => {
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.width = width;
      canvas.height = height;
    };
    setSize();
    window.addEventListener('resize', setSize);

    const handleMouseMove = (e: MouseEvent) => {
      if (isCompleteRef.current) return;
      mouse.current = { x: e.clientX, y: e.clientY };
    };

    const handleMouseLeave = () => {
       mouse.current = { x: -1000, y: -1000 };
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseout', handleMouseLeave);

    // --- HEAVY PHYSICS ENGINE ---
    const numParticles = 6000; 
    const particles: Dot[] = [];

    // Helper for uniform distribution
    let distributionStep = 0;
    let distributionBuffer = 200; // Extra space to prevent edge gaps
    let totalVirtualWidth = 0;

    class Dot {
      x: number;
      y: number;
      
      // Physics state
      vx: number;
      vy: number;
      
      // Home state
      baseX: number;
      baseOffsetY: number; // Vertical spread
      
      // Properties
      mass: number;     // Determines resistance
      density: number;  // For time-based shifting
      
      constructor(index: number) {
        // UNIFORM DISTRIBUTION FIX:
        // Instead of random X, we place them on a perfect grid.
        // This guarantees no large voids exist in the array.
        const perfectX = (index * distributionStep) - (distributionBuffer / 2);
        
        // Add a tiny bit of noise so it doesn't look like a barcode, 
        // but small enough (±1.5px) that it can't create a visible gap.
        const microNoise = (Math.random() - 0.5) * 3;
        
        this.baseX = perfectX + microNoise;
        this.x = this.baseX;
        
        const rand = (Math.random() + Math.random() + Math.random() + Math.random() - 2); 
        this.baseOffsetY = rand * 50; 
        
        this.y = height / 2 + this.baseOffsetY;
        
        this.vx = 0;
        this.vy = 0;
        
        this.mass = 1 + Math.random() * 2;
        this.density = Math.random() * 20;
      }

      update(time: number, secondPulse: number, minuteSnap: number, hourShift: number, frozen: boolean) {
        // 1. Global Drift
        this.baseX += 0.2; 
        
        // SEAMLESS WRAPPING FIX:
        // Instead of resetting to -10, we subtract the exact total width.
        // This preserves the relative distance to the neighbor particles.
        if (this.baseX > width + distributionBuffer) {
            this.baseX -= totalVirtualWidth;
            this.x -= totalVirtualWidth; 
        }

        if (frozen) {
            // RESOLUTION STATE:
            
            // Target Y - Flatten to a dense stripe
            const targetY = (height / 2) + (this.baseOffsetY * 0.1);
            const dy = targetY - this.y;
            this.vy += dy * 0.05; 

            // Target X - Snap to the drifting baseX (which is now perfectly uniform)
            const targetX = this.baseX;
            const dx = targetX - this.x;

            // Only spring if close (safety check for wrapping artifacts)
            if (Math.abs(dx) < 200) {
                this.vx += dx * 0.05;
            } else {
                this.vx *= 0.5;
            }

            this.vx *= 0.90; 
            this.vy *= 0.90; 

            this.x += this.vx;
            this.y += this.vy;
            return;
        }

        // 2. Calculate Target Position (Wave)
        const waveFreq = 0.002 + (hourShift * 0.0005);
        const waveAmp = (height * 0.1) + (hourShift * 20);
        
        const waveY = Math.sin(this.baseX * waveFreq + time * 0.0001) * waveAmp;
        const currentOffsetY = this.baseOffsetY * (1 - minuteSnap * 0.8);
        
        const targetY = (height / 2) + waveY + currentOffsetY;
        const targetX = this.baseX;

        // 3. Mouse Interaction
        let forceX = 0;
        let forceY = 0;

        const mx = laggedMouse.current.x;
        const my = laggedMouse.current.y;

        if (mx > -100) {
          const dx = this.x - mx;
          const dy = this.y - my;
          const distSq = dx * dx + dy * dy;
          const radius = 220; 
          const radiusSq = radius * radius;

          if (distSq < radiusSq) {
            const dist = Math.sqrt(distSq);
            const forceFactor = (radius - dist) / radius; 
            const angle = Math.atan2(dy, dx);
            const push = 1.5 * forceFactor; 

            forceX += Math.cos(angle) * push / this.mass;
            forceY += Math.sin(angle) * push / this.mass;
          }
        }

        // 4. Spring Back Force
        const springK = 0.02; 
        const distToHomeX = targetX - this.x;
        const distToHomeY = targetY - this.y;

        forceX += distToHomeX * springK;
        forceY += distToHomeY * springK;

        // 5. Time-based Jitter
        if (secondPulse > 0.01) {
            forceX += (Math.random() - 0.5) * secondPulse * 0.5;
            forceY += (Math.random() - 0.5) * secondPulse * 0.5;
        }

        // 6. Integrate Physics
        this.vx += forceX;
        this.vy += forceY;

        this.vx *= 0.92; 
        this.vy *= 0.92;

        this.x += this.vx;
        this.y += this.vy;
      }

      draw(ctx: CanvasRenderingContext2D) {
        const alpha = 0.55 + (Math.abs(this.baseOffsetY) / 60) * -0.3; 
        ctx.fillStyle = `rgba(26, 26, 26, ${Math.max(0.2, alpha)})`;
        ctx.fillRect(this.x, this.y, 2.2, 2.2); 
      }
    }

    const initParticles = () => {
        particles.length = 0;
        
        // Calculate uniform step
        // We add extra width buffer to the screen width so wrapping happens off-screen
        const buffer = 200; 
        distributionBuffer = buffer;
        const totalW = width + buffer;
        totalVirtualWidth = totalW;
        
        distributionStep = totalW / numParticles;

        for (let i = 0; i < numParticles; i++) {
            particles.push(new Dot(i));
        }
    };
    
    initParticles();

    // --- ANIMATION LOOP ---
    let animationId: number;
    let absoluteTime = 0;

    const animate = () => {
      ctx.clearRect(0, 0, width, height);
      
      const frozen = isCompleteRef.current;

      // Only advance time if not frozen (stops wave movement)
      if (!frozen) {
        absoluteTime += 16.67;
      }

      // 1. Time Events Logic
      const now = new Date();
      const s = now.getSeconds();
      const m = now.getMinutes();
      const h = now.getHours();

      if (!frozen) {
        if (s !== timeState.current.lastSecond) {
            timeState.current.secondPulse = 1.0; 
            timeState.current.lastSecond = s;
        }
        if (m !== timeState.current.lastMinute) {
            timeState.current.minuteSnap = 1.0; 
            timeState.current.lastMinute = m;
        }
      }

      timeState.current.secondPulse *= 0.9; 
      timeState.current.minuteSnap *= 0.98; 

      // 2. Mouse Inertia Logic
      if (!frozen && mouse.current.x > -100) {
        const dx = mouse.current.x - laggedMouse.current.x;
        const dy = mouse.current.y - laggedMouse.current.y;
        
        if (laggedMouse.current.x < -100) {
            laggedMouse.current = { ...mouse.current };
        } else {
            laggedMouse.current.x += dx * 0.08;
            laggedMouse.current.y += dy * 0.08;
        }
      } else {
        laggedMouse.current.x = -1000;
        laggedMouse.current.y = -1000;
      }

      // 3. Update Particles
      const hourShift = (h % 12) / 12;

      particles.forEach(p => {
          p.update(
            absoluteTime, 
            timeState.current.secondPulse,
            timeState.current.minuteSnap,
            hourShift,
            frozen
          );
          p.draw(ctx);
      });

      animationId = requestAnimationFrame(animate);
    };

    animate();

    const handleResize = () => {
        setSize();
        initParticles();
    };

    window.addEventListener('resize', handleResize);

    return () => {
      cancelAnimationFrame(animationId);
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseout', handleMouseLeave);
    };
  }, []); // Empty dependency array, ref handles updates

  return (
    <div className="fixed inset-0 z-0 overflow-hidden pointer-events-none">
      <canvas ref={canvasRef} className="absolute inset-0 w-full h-full" />
    </div>
  );
};