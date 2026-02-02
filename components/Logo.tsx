
import React from 'react';

const Logo: React.FC<{ size?: number; className?: string }> = ({ size = 48, className = "" }) => {
  return (
    <div 
      className={`relative overflow-hidden rounded-full border border-amber-500/30 shadow-2xl ${className}`} 
      style={{ width: size, height: size }}
    >
      <img 
        src="https://i.imgur.com/M7z6g3A.jpeg" 
        alt="Astro Mason Logo" 
        className="w-full h-full object-cover"
      />
      <div className="absolute inset-0 bg-gradient-to-tr from-amber-500/10 to-transparent pointer-events-none"></div>
    </div>
  );
};

export default Logo;
