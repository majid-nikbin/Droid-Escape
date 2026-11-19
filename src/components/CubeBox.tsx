import React from 'react';

interface CubeBoxProps {
  id: number;
  type?: 'STANDARD' | 'HEAVY' | 'ENERGY' | 'FIXED';
  isOnPlate?: boolean;
  isJustMoved?: boolean;
}

export const CubeBox: React.FC<CubeBoxProps> = ({
  type = 'STANDARD',
  isOnPlate = false,
  isJustMoved = false,
}) => {
  const isFixed = type === 'FIXED';
  const isEnergy = type === 'ENERGY';

  return (
    <div
      className={`relative w-full h-full flex items-center justify-center select-none transition-transform duration-150 ${
        isJustMoved ? 'scale-105' : 'scale-100 hover:scale-[1.03]'
      }`}
    >
      {/* Tactile ambient floor shadow */}
      <div
        className={`absolute bottom-0.5 w-[76%] h-2.5 rounded-full transition-all duration-200 ${
          isOnPlate
            ? 'bg-[#0f766e]/30 blur-[2.5px]'
            : 'bg-[#1f242c]/25 blur-[2px]'
        }`}
      />

      {/* Geometric Isometric Hollow Cube with Floating Radiant Core */}
      <div className="relative w-[92%] h-[92%] flex items-center justify-center">
        {isFixed ? (
          <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow-sm">
            <polygon points="50,12 88,34 50,54 12,34" fill="#6b7482" stroke="#98a1af" strokeWidth="0.9" />
            <polygon points="12,34 50,54 50,92 12,72" fill="#4c535e" stroke="#363b44" strokeWidth="0.9" />
            <polygon points="50,54 88,34 88,72 50,92" fill="#292e36" stroke="#181b20" strokeWidth="0.9" />
            <circle cx="50" cy="54" r="10" fill="#181b20" opacity="0.78" />
            <path d="M 47 52 L 47 48 C 47 46 53 46 53 48 L 53 52 Z" fill="none" stroke="#e5e7eb" strokeWidth="1.6" />
            <rect x="45" y="52" width="10" height="7" rx="1.5" fill="#f9fafb" />
          </svg>
        ) : (
          <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow-[0_3px_4px_rgba(31,36,44,0.22)]">
            {/* 1. Inner Radiant Core */}
            <polygon
              points="36,49 50,57 50,73 36,65"
              fill={isOnPlate ? '#0d9488' : isEnergy ? '#f59e0b' : '#ea580c'}
            />
            <polygon
              points="50,57 64,49 64,65 50,73"
              fill={isOnPlate ? '#0f766e' : isEnergy ? '#d97706' : '#c2410c'}
            />
            <polygon
              points="50,41 64,49 50,57 36,49"
              fill={isOnPlate ? '#5eead4' : isEnergy ? '#fde68a' : '#fbbf24'}
            />

            {/* 2. Inner Window Depth Jambs */}
            <polygon points="64,36 64,49 50,57 50,44" fill="#4b515b" opacity="0.95" />
            <polygon points="36,36 50,44 50,57 36,49" fill="#353a42" opacity="0.95" />

            <polygon points="21,45 34,53 34,57 21,49" fill="#7c838f" />
            <polygon points="44,58 44,74 50,70 50,63" fill="#24282e" opacity="0.88" />

            <polygon points="56,58 69,50 69,54 56,62" fill="#4b515b" />
            <polygon points="56,58 56,74 50,70 50,63" fill="#7c838f" opacity="0.88" />

            {/* 3. Outer Architectural Slate Frame */}
            <path
              d="M 50 12 L 88 34 L 50 54 L 12 34 Z M 50 21 L 36 36 L 50 44 L 64 36 Z"
              fill="#7c838f"
              fillRule="evenodd"
            />
            <path
              d="M 12 34 L 50 54 L 50 92 L 12 72 Z M 21 45 L 41 57 L 41 78 L 21 66 Z"
              fill="#4e545e"
              fillRule="evenodd"
            />
            <path
              d="M 50 54 L 88 34 L 88 72 L 50 92 Z M 59 57 L 79 45 L 79 66 L 59 78 Z"
              fill="#272b33"
              fillRule="evenodd"
            />

            {/* Crisp Top Rim Bevel */}
            <line x1="50" y1="12" x2="88" y2="34" stroke="#b0b6c0" strokeWidth="0.9" opacity="0.8" />
            <line x1="50" y1="12" x2="12" y2="34" stroke="#b0b6c0" strokeWidth="0.9" opacity="0.8" />
            <line x1="50" y1="54" x2="50" y2="92" stroke="#181b20" strokeWidth="0.8" opacity="0.5" />

            {/* Docked Status Checkmark */}
            {isOnPlate && (
              <g transform="translate(42, 44)">
                <circle cx="8" cy="8" r="6.5" fill="#0d9488" stroke="#ffffff" strokeWidth="1.2" />
                <path d="M 5 8 L 7.4 10.4 L 11.2 5.8" fill="none" stroke="#ffffff" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" />
              </g>
            )}
          </svg>
        )}
      </div>
    </div>
  );
};
