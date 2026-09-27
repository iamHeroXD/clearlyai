import React from 'react';

interface LogoProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  showText?: boolean;
  className?: string;
}

export const Logo: React.FC<LogoProps> = ({ size = 'md', showText = true, className = '' }) => {
  const sizeMap = {
    sm: { px: 28, text: 'text-base', sub: 'text-[9px]' },
    md: { px: 40, text: 'text-xl', sub: 'text-[10px]' },
    lg: { px: 56, text: 'text-3xl', sub: 'text-xs' },
    xl: { px: 80, text: 'text-5xl', sub: 'text-sm' },
  };

  const { px, text, sub } = sizeMap[size];

  return (
    <div className={`inline-flex items-center space-x-3 select-none group cursor-pointer ${className}`}>
      {/* 3D Prismatic Crystal Icon */}
      <div 
        style={{ width: `${px}px`, height: `${px}px`, minWidth: `${px}px`, maxWidth: `${px}px` }} 
        className="relative shrink-0"
      >
        {/* Ambient Glow */}
        <div className="absolute inset-0 bg-gradient-to-tr from-indigo-600 via-cyan-400 to-purple-500 rounded-2xl blur-md opacity-60 group-hover:opacity-100 group-hover:blur-lg transition-all duration-500" />
        
        {/* Outer Prism Container */}
        <div className="relative w-full h-full rounded-2xl bg-gradient-to-b from-[#16192b] to-[#04050a] p-[1.5px] shadow-2xl border border-white/20 overflow-hidden flex items-center justify-center">
          {/* Subtle moving shine */}
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000 ease-in-out" />
          
          <svg viewBox="0 0 100 100" style={{ width: '100%', height: '100%' }} className="p-1.5" fill="none" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <linearGradient id="prismGradient1" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#00f5ff" />
                <stop offset="50%" stopColor="#6366f1" />
                <stop offset="100%" stopColor="#a855f7" />
              </linearGradient>
              <linearGradient id="prismGradient2" x1="100%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#ec4899" />
                <stop offset="100%" stopColor="#3b82f6" />
              </linearGradient>
              <filter id="neonGlow" x="-20%" y="-20%" width="140%" height="140%">
                <feGaussianBlur stdDeviation="3" result="blur" />
                <feComposite in="SourceGraphic" in2="blur" operator="over" />
              </filter>
            </defs>

            {/* Hexagonal Crystal Facets */}
            <path
              d="M50 12 L84 31 L84 69 L50 88 L16 69 L16 31 Z"
              stroke="url(#prismGradient1)"
              strokeWidth="4"
              strokeLinejoin="round"
              fill="rgba(99, 102, 241, 0.08)"
            />
            {/* Prismatic Internal Refraction Rays */}
            <path d="M50 12 L50 88" stroke="url(#prismGradient1)" strokeWidth="1.5" opacity="0.6" strokeDasharray="3 3" />
            <path d="M16 31 L84 69" stroke="url(#prismGradient2)" strokeWidth="1.5" opacity="0.6" />
            <path d="M84 31 L16 69" stroke="url(#prismGradient1)" strokeWidth="1.5" opacity="0.6" />
            
            {/* Core Neural Light Beam */}
            <circle cx="50" cy="50" r="7" fill="#ffffff" filter="url(#neonGlow)" />
            <circle cx="50" cy="50" r="3" fill="#00f5ff" />
          </svg>
        </div>

        {/* Live Active Dot */}
        <div className="absolute -top-1 -right-1 w-3 h-3 bg-emerald-400 rounded-full border-2 border-black shadow-[0_0_8px_#10b981] animate-pulse" />
      </div>

      {/* Brand Typography */}
      {showText && (
        <div className="flex flex-col">
          <div className="flex items-center space-x-1.5">
            <span className={`font-display font-extrabold tracking-tight text-white group-hover:text-cyan-300 transition-colors ${text}`}>
              Clearly
            </span>
            <span className="px-1.5 py-0.5 rounded-full bg-gradient-to-r from-indigo-500/20 to-cyan-500/20 border border-indigo-500/30 text-[9px] font-mono font-bold text-cyan-300">
              AI
            </span>
          </div>
          <span className={`font-mono uppercase font-semibold tracking-widest text-slate-400 group-hover:text-slate-300 transition-colors ${sub}`}>
            Liquid Glass AI
          </span>
        </div>
      )}
    </div>
  );
};
