
import React from 'react';

const Logo: React.FC<{ size?: number; className?: string }> = ({ size = 48, className = "" }) => {
  return (
    <div className={`relative flex items-center justify-center ${className}`} style={{ width: size, height: size }}>
      <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full drop-shadow-2xl">
        {/* Outer Celestial Ring */}
        <circle cx="50" cy="50" r="45" stroke="url(#logo_gradient)" strokeWidth="1.5" strokeDasharray="2 4" opacity="0.6" />
        
        {/* The Square (Vinkelen) */}
        <path d="M25 45L50 70L75 45" stroke="url(#logo_gradient)" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
        
        {/* The Compass (Passeren) forming an A */}
        <path d="M30 75L50 25L70 75" stroke="url(#logo_gradient)" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M40 55H60" stroke="url(#logo_gradient)" strokeWidth="1.5" strokeLinecap="round" opacity="0.5" />

        {/* Central Planet / Sun */}
        <circle cx="50" cy="50" r="8" fill="url(#sun_gradient)" className="animate-pulse" />
        
        {/* Orbiting Elements */}
        <circle cx="78" cy="35" r="3" fill="#fbbf24" opacity="0.8" />
        <circle cx="22" cy="35" r="2" fill="#818cf8" opacity="0.8" />

        <defs>
          <linearGradient id="logo_gradient" x1="30" y1="25" x2="70" y2="75" gradientUnits="userSpaceOnUse">
            <stop stopColor="#fbbf24" />
            <stop offset="1" stopColor="#6366f1" />
          </linearGradient>
          <radialGradient id="sun_gradient" cx="0" cy="0" r="1" gradientUnits="userSpaceOnUse" gradientTransform="translate(50 50) rotate(90) scale(12)">
            <stop stopColor="#FFF9C4" />
            <stop offset="0.5" stopColor="#fbbf24" />
            <stop offset="1" stopColor="#d97706" />
          </radialGradient>
        </defs>
      </svg>
    </div>
  );
};

export default Logo;
