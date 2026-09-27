import React from 'react';

interface ClearlyLogoProps {
  size?: number;
  className?: string;
}

export const ClearlyLogo: React.FC<ClearlyLogoProps> = ({ size = 32, className = '' }) => {
  return (
    <div
      className={`relative inline-flex items-center justify-center rounded-xl bg-[#141412] border border-white/15 shadow-inner select-none overflow-hidden ${className}`}
      style={{ width: size, height: size }}
    >
      <svg
        viewBox="0 0 36 36"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        style={{ width: size * 0.75, height: size * 0.75 }}
      >
        {/* Cute Bot Face Base */}
        <rect x="4" y="8" width="28" height="22" rx="7" fill="#E1993B" />
        
        {/* Antennas / Ear Details */}
        <rect x="16" y="3" width="4" height="6" rx="2" fill="#E1993B" />
        <circle cx="18" cy="3" r="2.5" fill="#E1993B" />

        {/* Screen / Visor Area */}
        <rect x="8" y="13" width="20" height="12" rx="4" fill="#141412" />

        {/* Glowing Eyes */}
        <circle cx="14" cy="19" r="2.2" fill="#FAF9F5" />
        <circle cx="22" cy="19" r="2.2" fill="#FAF9F5" />
        <circle cx="14.6" cy="18.4" r="0.8" fill="#E1993B" />
        <circle cx="22.6" cy="18.4" r="0.8" fill="#E1993B" />
      </svg>
    </div>
  );
};
