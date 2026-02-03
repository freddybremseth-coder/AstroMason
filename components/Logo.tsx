
import React from 'react';

interface LogoProps {
  size?: number;
  className?: string;
  showText?: boolean;
  textColor?: string;
}

const Logo: React.FC<LogoProps> = ({ 
  size = 64, 
  className = "", 
  showText = false,
  textColor = "text-white"
}) => {
  return (
    <div className={`flex flex-col items-center gap-4 ${className}`}>
      <div 
        className="relative flex items-center justify-center"
        style={{ width: size, height: size }}
      >
        {/* Deep Celestial Glow */}
        <div className="absolute inset-0 bg-amber-500/5 blur-3xl rounded-full scale-150"></div>
        <div className="absolute inset-0 bg-indigo-500/10 blur-2xl rounded-full"></div>
        
        <svg 
          viewBox="0 0 100 100" 
          fill="none" 
          xmlns="http://www.w3.org/2000/svg"
          className="relative z-10 w-full h-full drop-shadow-[0_0_15px_rgba(217,119,6,0.2)]"
        >
          {/* Background: The Great Work Circle */}
          <circle cx="50" cy="50" r="48" stroke="url(#celestialGold)" strokeWidth="0.5" strokeDasharray="1 4" opacity="0.3" />
          <circle cx="50" cy="50" r="38" stroke="url(#celestialGold)" strokeWidth="0.25" opacity="0.2" />

          {/* The "Compass" Nuance: A stylized Trine Aspect (Triangle) */}
          {/* Formed by the upper spirit rays meeting at the apex */}
          <path 
            d="M50 15 L22 75 M50 15 L78 75" 
            stroke="url(#celestialGold)" 
            strokeWidth="1.5" 
            strokeLinecap="round" 
            opacity="0.8"
          />
          
          {/* The "Square" Nuance: A stylized Square Aspect (90 degree angle) */}
          {/* Grounding the geometry at the base */}
          <path 
            d="M30 55 L50 75 L70 55" 
            stroke="url(#celestialGold)" 
            strokeWidth="2.5" 
            strokeLinecap="round" 
            strokeLinejoin="round" 
            opacity="0.7"
          />

          {/* Vesica Piscis (The Intersection of Worlds) */}
          <path 
            d="M50 35 C60 35 68 42 68 50 C68 58 60 65 50 65 C40 65 32 58 32 50 C32 42 40 35 50 35Z" 
            stroke="url(#celestialGold)" 
            strokeWidth="0.5" 
            opacity="0.4"
          />

          {/* The Central Star (Sirius/The Blazing Star) */}
          <g transform="translate(50, 50)">
            <path 
              d="M0 -12 L3 -3 L12 0 L3 3 L0 12 L-3 3 L-12 0 L-3 -3 Z" 
              fill="#fff" 
              className="animate-pulse"
            />
            <circle r="2.5" fill="url(#celestialGold)" />
          </g>

          {/* Orbital Paths (Planetary movement) */}
          <ellipse cx="50" cy="50" rx="45" ry="20" stroke="url(#celestialGold)" strokeWidth="0.25" opacity="0.1" transform="rotate(45, 50, 50)" />
          <ellipse cx="50" cy="50" rx="45" ry="20" stroke="url(#celestialGold)" strokeWidth="0.25" opacity="0.1" transform="rotate(-45, 50, 50)" />

          <defs>
            <linearGradient id="celestialGold" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#FDE68A" />
              <stop offset="50%" stopColor="#D97706" />
              <stop offset="100%" stopColor="#78350F" />
            </linearGradient>
          </defs>
        </svg>
      </div>

      {showText && (
        <div className="flex flex-col items-center gap-1">
          <h1 className={`font-serif font-bold tracking-[0.6em] uppercase leading-none ${textColor}`} style={{ fontSize: size * 0.22 }}>
            Astro Mason
          </h1>
          <div className="flex items-center gap-2 w-full px-1">
            <div className="h-[1px] flex-1 bg-gradient-to-r from-transparent via-amber-500/30 to-transparent"></div>
            <p className="text-[7px] uppercase tracking-[0.4em] text-amber-500/60 font-black whitespace-nowrap">
              The Deep Archives
            </p>
            <div className="h-[1px] flex-1 bg-gradient-to-r from-transparent via-amber-500/30 to-transparent"></div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Logo;
