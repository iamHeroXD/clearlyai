import React, { useEffect, useState } from 'react';
import { Logo } from './Logo';

interface LoadingScreenProps {
  onLoaded: () => void;
}

export const LoadingScreen: React.FC<LoadingScreenProps> = ({ onLoaded }) => {
  const [progress, setProgress] = useState(0);
  const [isFading, setIsFading] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setTimeout(() => {
            setIsFading(true);
            setTimeout(onLoaded, 500);
          }, 200);
          return 100;
        }
        const diff = Math.random() * 25 + 15;
        return Math.min(prev + diff, 100);
      });
    }, 60);

    return () => clearInterval(interval);
  }, [onLoaded]);

  return (
    <div
      className={`fixed inset-0 z-[100] bg-[#000000] flex flex-col items-center justify-center transition-opacity duration-500 ${
        isFading ? 'opacity-0 pointer-events-none' : 'opacity-100'
      }`}
    >
      {/* Radiant Glow */}
      <div className="absolute w-96 h-96 bg-gradient-to-tr from-indigo-600/30 via-cyan-500/30 to-purple-600/20 blur-[100px] rounded-full pointer-events-none" />

      {/* Crystal Logo animation */}
      <div className="relative mb-8 scale-125 animate-pulse">
        <Logo size="lg" showText={false} />
      </div>

      {/* Brand Text */}
      <div className="text-center relative z-10 mb-6">
        <div className="text-3xl font-display font-extrabold text-white tracking-tight">
          Clearly
        </div>
        <div className="text-xs font-mono uppercase tracking-widest text-cyan-400 mt-1">
          Initializing Liquid Glass Engine...
        </div>
      </div>

      {/* Progress Bar Frame */}
      <div className="w-64 sm:w-80 h-1.5 bg-white/10 rounded-full overflow-hidden p-[1px] border border-white/10 relative z-10">
        <div
          className="h-full bg-gradient-to-r from-cyan-400 via-indigo-500 to-purple-500 rounded-full transition-all duration-150 shadow-[0_0_12px_#00f5ff]"
          style={{ width: `${progress}%` }}
        />
      </div>

      {/* Progress percentage */}
      <div className="text-[11px] font-mono font-bold text-slate-500 mt-3 relative z-10">
        {Math.round(progress)}%
      </div>
    </div>
  );
};
