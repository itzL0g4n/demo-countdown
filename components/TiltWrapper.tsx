import React, { useRef, useState, MouseEvent } from 'react';

interface TiltWrapperProps {
  children: React.ReactNode;
  className?: string;
  intensity?: number;
}

export const TiltWrapper: React.FC<TiltWrapperProps> = ({ children, className = "", intensity = 20 }) => {
  const ref = useRef<HTMLDivElement>(null);
  const [rotation, setRotation] = useState({ x: 0, y: 0 });
  const [shine, setShine] = useState({ x: 0, y: 0, opacity: 0 });

  const handleMouseMove = (e: MouseEvent<HTMLDivElement>) => {
    if (!ref.current) return;

    const rect = ref.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    
    // Calculate rotation
    const rotateX = ((y - centerY) / centerY) * -intensity; 
    const rotateY = ((x - centerX) / centerX) * intensity;

    setRotation({ x: rotateX, y: rotateY });
    setShine({ 
      x: (x / rect.width) * 100, 
      y: (y / rect.height) * 100, 
      opacity: 1 
    });
  };

  const handleMouseLeave = () => {
    setRotation({ x: 0, y: 0 });
    setShine(prev => ({ ...prev, opacity: 0 }));
  };

  return (
    <div
      ref={ref}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className={`perspective-1000 transform-gpu ${className}`}
      style={{ perspective: '1000px' }}
    >
      <div
        className="transition-transform duration-100 ease-out relative"
        style={{
          transform: `rotateX(${rotation.x}deg) rotateY(${rotation.y}deg)`,
        }}
      >
        {children}
        
        {/* Holographic Shine/Glare Overlay */}
        <div 
          className="absolute inset-0 pointer-events-none mix-blend-overlay z-20"
          style={{
            background: `radial-gradient(circle at ${shine.x}% ${shine.y}%, rgba(255,255,255,0.8) 0%, transparent 60%)`,
            opacity: shine.opacity * 0.4,
          }}
        />
      </div>
    </div>
  );
};