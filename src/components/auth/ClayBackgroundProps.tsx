import React from 'react';
import { motion } from 'motion/react';

export const ClayCloud: React.FC<{
  className?: string;
  delay?: number;
  scale?: number;
}> = ({ className = '', delay = 0, scale = 1 }) => {
  return (
    <motion.div
      className={`absolute select-none pointer-events-none drop-shadow-[0_12px_24px_rgba(74,35,74,0.14)] ${className}`}
      initial={{ y: 0 }}
      animate={{ y: [-4, 6, -4] }}
      transition={{
        duration: 4.5,
        repeat: Infinity,
        ease: 'easeInOut',
        delay,
      }}
      style={{ transform: `scale(${scale})` }}
      aria-hidden="true"
    >
      <svg width="100" height="60" viewBox="0 0 100 60" fill="none">
        <defs>
          <radialGradient id="cloudGrad" cx="40%" cy="30%" r="70%">
            <stop offset="0%" stopColor="#FFFFFF" />
            <stop offset="65%" stopColor="#F9F5FB" />
            <stop offset="100%" stopColor="#EADBEE" />
          </radialGradient>
        </defs>
        {/* Soft rounded clay bubbles */}
        <circle cx="28" cy="38" r="18" fill="url(#cloudGrad)" />
        <circle cx="50" cy="28" r="22" fill="url(#cloudGrad)" />
        <circle cx="74" cy="36" r="16" fill="url(#cloudGrad)" />
        <rect x="24" y="32" width="54" height="22" rx="11" fill="url(#cloudGrad)" />
      </svg>
    </motion.div>
  );
};

export const ClayPottedPlant: React.FC<{ className?: string }> = ({ className = '' }) => {
  return (
    <div
      className={`absolute select-none pointer-events-none drop-shadow-[0_20px_35px_rgba(74,35,74,0.22)] ${className}`}
      aria-hidden="true"
    >
      <svg width="120" height="230" viewBox="0 0 120 230" fill="none">
        <defs>
          {/* Leaf Gradients */}
          <linearGradient id="leafGrad1" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#9BC28D" />
            <stop offset="50%" stopColor="#7DA86E" />
            <stop offset="100%" stopColor="#557F48" />
          </linearGradient>
          <linearGradient id="leafGrad2" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#88B87B" />
            <stop offset="100%" stopColor="#4A743E" />
          </linearGradient>
          {/* Pot Clay Gradient */}
          <linearGradient id="clayPotGrad" x1="20%" y1="0%" x2="80%" y2="100%">
            <stop offset="0%" stopColor="#EAD7C5" />
            <stop offset="50%" stopColor="#D8BEA6" />
            <stop offset="100%" stopColor="#BBA086" />
          </linearGradient>
        </defs>

        {/* Stem */}
        <path d="M60 170 C60 120 62 80 62 30" stroke="#5E8352" strokeWidth="5.5" strokeLinecap="round" />

        {/* Leaves Layered */}
        {/* Leaf 1 (Top Left) */}
        <path
          d="M60 40 C40 30 18 45 22 70 C30 85 58 60 60 40 Z"
          fill="url(#leafGrad1)"
        />
        {/* Leaf 2 (Top Right) */}
        <path
          d="M62 55 C82 45 104 55 100 80 C92 95 64 72 62 55 Z"
          fill="url(#leafGrad2)"
        />
        {/* Leaf 3 (Middle Left) */}
        <path
          d="M60 90 C32 80 8 100 12 125 C20 142 56 112 60 90 Z"
          fill="url(#leafGrad1)"
        />
        {/* Leaf 4 (Middle Right) */}
        <path
          d="M62 110 C90 100 114 115 110 140 C102 158 66 130 62 110 Z"
          fill="url(#leafGrad2)"
        />
        {/* Leaf 5 (Bottom Left) */}
        <path
          d="M60 145 C35 140 16 160 22 178 C35 190 58 165 60 145 Z"
          fill="url(#leafGrad1)"
        />

        {/* Terracotta/Cream Clay Pot */}
        <path
          d="M28 170 C28 165 92 165 92 170 L86 215 C85 222 78 226 60 226 C42 226 35 222 34 215 L28 170 Z"
          fill="url(#clayPotGrad)"
        />
        {/* Pot Rim */}
        <ellipse cx="60" cy="170" rx="33" ry="7" fill="#F0DFCE" />
        <ellipse cx="60" cy="170" rx="29" ry="5" fill="#4A3424" opacity="0.4" />
      </svg>
    </div>
  );
};

export const ClayPottedFlower: React.FC<{ className?: string }> = ({ className = '' }) => {
  return (
    <div
      className={`absolute select-none pointer-events-none drop-shadow-[0_20px_35px_rgba(74,35,74,0.22)] ${className}`}
      aria-hidden="true"
    >
      <svg width="110" height="200" viewBox="0 0 110 200" fill="none">
        <defs>
          <linearGradient id="flowerPetalGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#FFA6B8" />
            <stop offset="50%" stopColor="#F5869E" />
            <stop offset="100%" stopColor="#E26A84" />
          </linearGradient>
          <radialGradient id="flowerCenterGrad" cx="40%" cy="35%" r="60%">
            <stop offset="0%" stopColor="#FFF2A3" />
            <stop offset="60%" stopColor="#F5D056" />
            <stop offset="100%" stopColor="#D9A822" />
          </radialGradient>
          <linearGradient id="flowerPotGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#EFA49A" />
            <stop offset="60%" stopColor="#D88377" />
            <stop offset="100%" stopColor="#BD685D" />
          </linearGradient>
        </defs>

        {/* Stem */}
        <path d="M55 145 C55 105 57 85 55 60" stroke="#68935C" strokeWidth="4.5" strokeLinecap="round" />
        {/* Leaf on stem */}
        <path d="M56 100 C72 90 82 104 74 116 C64 122 56 112 56 100 Z" fill="#7BA66F" />
        <path d="M54 118 C38 112 30 126 38 136 C48 140 54 130 54 118 Z" fill="#7BA66F" />

        {/* Flower Petals (5 Rounded 3D Clay Petals) */}
        {/* Top */}
        <circle cx="55" cy="40" r="13" fill="url(#flowerPetalGrad)" />
        {/* Top Right */}
        <circle cx="70" cy="52" r="13" fill="url(#flowerPetalGrad)" />
        {/* Bottom Right */}
        <circle cx="64" cy="70" r="13" fill="url(#flowerPetalGrad)" />
        {/* Bottom Left */}
        <circle cx="46" cy="70" r="13" fill="url(#flowerPetalGrad)" />
        {/* Top Left */}
        <circle cx="40" cy="52" r="13" fill="url(#flowerPetalGrad)" />

        {/* Flower Center Center Pistil */}
        <circle cx="55" cy="57" r="11" fill="url(#flowerCenterGrad)" />
        <circle cx="53" cy="55" r="3" fill="#FFFFFF" opacity="0.6" />

        {/* Flower Pot */}
        <path
          d="M28 146 C28 142 82 142 82 146 L76 186 C75 192 68 196 55 196 C42 196 35 192 34 186 L28 146 Z"
          fill="url(#flowerPotGrad)"
        />
        {/* Pot Rim */}
        <ellipse cx="55" cy="146" rx="28" ry="6.5" fill="#F8B6AC" />
        <ellipse cx="55" cy="146" rx="24" ry="4.5" fill="#4A3424" opacity="0.35" />
      </svg>
    </div>
  );
};
