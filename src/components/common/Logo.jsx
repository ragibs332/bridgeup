import React from 'react';

export default function Logo({ size = 'md', variant = 'full', className = '' }) {
  // Size variants
  const sizeClasses = {
    sm: 'h-8 text-lg',
    md: 'h-10 text-xl',
    lg: 'h-14 text-2xl',
    xl: 'h-20 text-4xl',
  };

  const iconSizes = {
    sm: { w: 32, h: 32, viewBox: "0 0 48 48" },
    md: { w: 42, h: 42, viewBox: "0 0 48 48" },
    lg: { w: 56, h: 56, viewBox: "0 0 48 48" },
    xl: { w: 80, h: 80, viewBox: "0 0 48 48" },
  };

  const currentIcon = iconSizes[size] || iconSizes.md;

  return (
    <div className={`inline-flex items-center gap-2.5 font-bold tracking-tight select-none ${className}`}>
      {/* SVG Emblem: Stylized Bridge Arch + Uplifting Hand/Arrow Wings */}
      <div className="relative flex items-center justify-center">
        <svg
          width={currentIcon.w}
          height={currentIcon.h}
          viewBox={currentIcon.viewBox}
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="filter drop-shadow-md transition-transform duration-300 hover:scale-105"
        >
          <defs>
            <linearGradient id="bridgeTeal" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#14B8A6" />
              <stop offset="50%" stopColor="#0D5C5B" />
              <stop offset="100%" stopColor="#083E3D" />
            </linearGradient>
            <linearGradient id="mintGlow" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#48C9B0" />
              <stop offset="100%" stopColor="#2DD4BF" />
            </linearGradient>
            <linearGradient id="amberAccent" x1="0%" y1="100%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#F59E0B" />
              <stop offset="100%" stopColor="#FBBF24" />
            </linearGradient>
          </defs>

          {/* Background Rounded Shield */}
          <rect width="48" height="48" rx="12" fill="url(#bridgeTeal)" />

          {/* Bridge Suspension Cables */}
          <path
            d="M8 32 C16 18, 32 18, 40 32"
            stroke="url(#mintGlow)"
            strokeWidth="3.2"
            strokeLinecap="round"
          />
          <line x1="16" y1="23" x2="16" y2="34" stroke="#48C9B0" strokeWidth="1.8" strokeLinecap="round" strokeOpacity="0.8" />
          <line x1="24" y1="20" x2="24" y2="34" stroke="#48C9B0" strokeWidth="2.2" strokeLinecap="round" />
          <line x1="32" y1="23" x2="32" y2="34" stroke="#48C9B0" strokeWidth="1.8" strokeLinecap="round" strokeOpacity="0.8" />

          {/* Bridge Deck Base */}
          <path
            d="M6 34 L42 34"
            stroke="#ffffff"
            strokeWidth="2.8"
            strokeLinecap="round"
          />

          {/* Uplifting Hand / Rising Heart-Star in Warm Amber */}
          <path
            d="M24 10 L27.5 16 L34 16.8 L29 21.2 L30.5 27.5 L24 24 L17.5 27.5 L19 21.2 L14 16.8 L20.5 16 L24 10 Z"
            fill="url(#amberAccent)"
            className="animate-pulse"
          />
        </svg>
      </div>

      {/* Brand Text */}
      {variant === 'full' && (
        <div className="flex flex-col text-left leading-none">
          <div className="flex items-center">
            <span className="text-brand-teal-800 dark:text-brand-mint-300 font-extrabold tracking-wider">
              BRIDGE
            </span>
            <span className="text-brand-amber-500 font-black tracking-wider">
              UP
            </span>
          </div>
          <span className="text-[10px] tracking-widest text-slate-500 font-semibold uppercase mt-0.5">
            Empower • Connect • Lift
          </span>
        </div>
      )}
    </div>
  );
}
