import React from 'react';
import { Lock, Check } from 'lucide-react';

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
      {/* Soft Ground Ambient Shadow (Natural, eye-friendly) */}
      <div 
        className={`absolute bottom-0 w-[78%] h-2.5 rounded-full transition-all duration-200 ${
          isOnPlate
            ? 'bg-emerald-950/25 blur-[2.5px]'
            : 'bg-slate-900/20 blur-[2px]'
        }`} 
      />

      {/* Geometric Isometric Hollow Cube with Floating Glowing Core */}
      <div className="relative w-[92%] h-[92%] flex items-center justify-center">
        {isFixed ? (
          /* Fixed Barrier: Solid Carved Granite/Steel Block */
          <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow-md">
            {/* Top Face */}
            <polygon points="50,12 88,34 50,54 12,34" fill="#64748b" stroke="#94a3b8" strokeWidth="0.8" />
            {/* Left Face */}
            <polygon points="12,34 50,54 50,92 12,72" fill="#475569" stroke="#334155" strokeWidth="0.8" />
            {/* Right Face */}
            <polygon points="50,54 88,34 88,72 50,92" fill="#1e293b" stroke="#0f172a" strokeWidth="0.8" />
            {/* Lock Emblem on Front Center */}
            <circle cx="50" cy="54" r="10" fill="#0f172a" opacity="0.7" />
            <path d="M 47 52 L 47 48 C 47 46 53 46 53 48 L 53 52 Z" fill="none" stroke="#e2e8f0" strokeWidth="1.5" />
            <rect x="45" y="52" width="10" height="7" rx="1.5" fill="#f8fafc" />
          </svg>
        ) : (
          /* Movable Core: Exact Isometric Hollow Slate Cube with Glowing Amber (or Docked Emerald) Core */
          <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow-md">
            {/* --- 1. Inner Core (Visible through the hollow windows) --- */}
            {/* Left face of inner core */}
            <polygon
              points="36,49 50,57 50,73 36,65"
              fill={isOnPlate ? '#10b981' : isEnergy ? '#fb8c00' : '#f57c00'}
            />
            {/* Right face of inner core */}
            <polygon
              points="50,57 64,49 64,65 50,73"
              fill={isOnPlate ? '#047857' : isEnergy ? '#d97706' : '#ea580c'}
            />
            {/* Top face of inner core */}
            <polygon
              points="50,41 64,49 50,57 36,49"
              fill={isOnPlate ? '#6ee7b7' : isEnergy ? '#fcd34d' : '#ffb300'}
            />

            {/* --- 2. Inner Window Thickness Jambs (Depth Reveals) --- */}
            {/* Top window right jamb */}
            <polygon points="64,36 64,49 50,57 50,44" fill="#50555e" opacity="0.95" />
            {/* Top window left jamb */}
            <polygon points="36,36 50,44 50,57 36,49" fill="#383c44" opacity="0.95" />

            {/* Left window top jamb */}
            <polygon points="21,45 34,53 34,57 21,49" fill="#787e88" />
            {/* Left window right jamb */}
            <polygon points="44,58 44,74 50,70 50,63" fill="#2b2d33" opacity="0.85" />

            {/* Right window top jamb */}
            <polygon points="56,58 69,50 69,54 56,62" fill="#50555e" />
            {/* Right window left jamb */}
            <polygon points="56,58 56,74 50,70 50,63" fill="#787e88" opacity="0.85" />

            {/* --- 3. Outer Slate-Grey Geometric Faces (with window cutouts) --- */}
            {/* Top Face (#767c87) */}
            <path
              d="M 50 12 L 88 34 L 50 54 L 12 34 Z M 50 21 L 36 36 L 50 44 L 64 36 Z"
              fill="#767c87"
              fillRule="evenodd"
            />

            {/* Left Face (#50555e) */}
            <path
              d="M 12 34 L 50 54 L 50 92 L 12 72 Z M 21 45 L 41 57 L 41 78 L 21 66 Z"
              fill="#50555e"
              fillRule="evenodd"
            />

            {/* Right Face (#282a30) */}
            <path
              d="M 50 54 L 88 34 L 88 72 L 50 92 Z M 59 57 L 79 45 L 79 66 L 59 78 Z"
              fill="#282a30"
              fillRule="evenodd"
            />

            {/* Subtle Edge Highlight Line along Top Ridge */}
            <line x1="50" y1="12" x2="88" y2="34" stroke="#9ba2ad" strokeWidth="0.8" opacity="0.7" />
            <line x1="50" y1="12" x2="12" y2="34" stroke="#9ba2ad" strokeWidth="0.8" opacity="0.7" />

            {/* Docked Status Checkmark Indicator (Small, crisp on top corner) */}
            {isOnPlate && (
              <g transform="translate(42, 45)">
                <circle cx="8" cy="8" r="6" fill="#10b981" />
                <path d="M 5 8 L 7.5 10.5 L 11 6" fill="none" stroke="#ffffff" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
              </g>
            )}
          </svg>
        )}
      </div>
    </div>
  );
};
