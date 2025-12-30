import React, { useEffect, useState, useRef } from 'react';

interface TextScrambleProps {
  text: string;
  className?: string;
  trigger?: any; // Change this prop to restart animation
  speed?: number;
}

const CHARS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789@#$%&';

export const TextScramble: React.FC<TextScrambleProps> = ({ 
  text, 
  className = "", 
  trigger,
  speed = 30 
}) => {
  const [displayText, setDisplayText] = useState(text);
  const frameRequest = useRef<number>(0);
  
  useEffect(() => {
    let iteration = 0;
    
    const animate = () => {
      setDisplayText(prev => 
        text
          .split("")
          .map((letter, index) => {
            if (index < iteration) {
              return text[index];
            }
            return CHARS[Math.floor(Math.random() * CHARS.length)];
          })
          .join("")
      );

      if (iteration < text.length) {
        iteration += 1 / 3; // Controls how fast it resolves relative to frame rate
        frameRequest.current = requestAnimationFrame(animate);
      }
    };

    // Cancel any existing animation
    if (frameRequest.current) cancelAnimationFrame(frameRequest.current);
    
    animate();

    return () => cancelAnimationFrame(frameRequest.current);
  }, [text, trigger]);

  return <span className={className}>{displayText}</span>;
};