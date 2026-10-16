import React from 'react';
import { Direction } from '../types/game';

interface AndroidMascotProps {
  direction: Direction;
  isMoving?: boolean;
  isVictorious?: boolean;
  skin?: string;
}

export const AndroidMascot: React.FC<AndroidMascotProps> = ({
  direction,
  isMoving = false,
  isVictorious = false,
}) => {
  // Eye rotation or antenna lean based on direction
  const getEyeOffset = () => {
    switch (direction) {
      case 'LEFT': return -2.5;
      case 'RIGHT': return 2.5;
      case 'UP': return 0;
      case 'DOWN': return 0;
    }
  };

  const getHeadRotation = () => {
    switch (direction) {
      case 'LEFT': return -4;
      case 'RIGHT': return 4;
      case 'UP': return 0;
      case 'DOWN': return 0;
    }
  };

  return (
    <div 
      className={`relative w-full h-full flex items-center justify-center select-none transition-transform duration-150 ${
        isMoving ? 'scale-95' : 'scale-100'
      } ${isVictorious ? 'animate-bounce' : ''}`}
    >
      {/* Soft Ground Contact Shadow */}
      <div className="absolute bottom-1 w-7/12 h-2 bg-emerald-950/60 rounded-full blur-[2px]" />

      {/* Android Mascot SVG Body */}
      <svg
        viewBox="0 0 100 115"
        className="w-full h-full drop-shadow-[0_4px_8px_rgba(16,185,129,0.35)]"
        style={{
          transform: `rotate(${getHeadRotation()}deg)`,
          transition: 'transform 0.15s ease-out',
        }}
      >
        <defs>
          {/* Android Signature Lime/Emerald Gradients */}
          <linearGradient id="droidHeadGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#4ADE80" />
            <stop offset="60%" stopColor="#22C55E" />
            <stop offset="100%" stopColor="#15803D" />
          </linearGradient>

          <linearGradient id="droidBodyGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#34D399" />
            <stop offset="60%" stopColor="#10B981" />
            <stop offset="100%" stopColor="#047857" />
          </linearGradient>

          <linearGradient id="droidLimbGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#4ADE80" />
            <stop offset="100%" stopColor="#15803D" />
          </linearGradient>

          <filter id="droidGlow" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="2" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>
        </defs>

        {/* --- Antennas --- */}
        <g stroke="#22C55E" strokeWidth="4" strokeLinecap="round">
          {/* Left antenna */}
          <line
            x1="36"
            y1="22"
            x2={direction === 'LEFT' ? '25' : '28'}
            y2="10"
            className="transition-all duration-150"
          />
          {/* Right antenna */}
          <line
            x1="64"
            y1="22"
            x2={direction === 'RIGHT' ? '75' : '72'}
            y2="10"
            className="transition-all duration-150"
          />
        </g>

        {/* Antenna Tips */}
        <circle cx={direction === 'LEFT' ? 25 : 28} cy="10" r="2.5" fill="#4ADE80" />
        <circle cx={direction === 'RIGHT' ? 75 : 72} cy="10" r="2.5" fill="#4ADE80" />

        {/* --- Android Semi-Circle Head --- */}
        <path
          d="M 24,42 A 26,26 0 0,1 76,42 Z"
          fill="url(#droidHeadGrad)"
        />

        {/* Head Bevel Highlight */}
        <path
          d="M 28,38 A 22,22 0 0,1 72,38"
          fill="none"
          stroke="rgba(255,255,255,0.4)"
          strokeWidth="1.8"
          strokeLinecap="round"
        />

        {/* --- Eyes (White glowing android dots) --- */}
        {direction !== 'UP' ? (
          <g transform={`translate(${getEyeOffset()}, 0)`} className="transition-transform duration-150">
            {/* Left Eye */}
            <circle cx="39" cy="33" r="3.2" fill="#FFFFFF" filter="url(#droidGlow)" />
            <circle cx="39.6" cy="32.4" r="1.2" fill="#ECFDF5" />

            {/* Right Eye */}
            <circle cx="61" cy="33" r="3.2" fill="#FFFFFF" filter="url(#droidGlow)" />
            <circle cx="61.6" cy="32.4" r="1.2" fill="#ECFDF5" />
          </g>
        ) : (
          // When facing UP: subtle back-of-head seam
          <line x1="50" y1="20" x2="50" y2="38" stroke="rgba(0,0,0,0.15)" strokeWidth="1.5" strokeDasharray="2 2" />
        )}

        {/* --- Torso Body --- */}
        <rect
          x="25"
          y="46"
          width="50"
          height="38"
          rx="6"
          fill="url(#droidBodyGrad)"
        />

        {/* Torso Tech Seam / Core Glow */}
        <line x1="32" y1="58" x2="68" y2="58" stroke="rgba(255,255,255,0.2)" strokeWidth="1" />
        <circle cx="50" cy="65" r="3.5" fill="#34D399" opacity="0.6" />
        <circle cx="50" cy="65" r="1.5" fill="#FFFFFF" opacity="0.9" />

        {/* --- Left Arm --- */}
        <rect
          x="14"
          y="48"
          width="7"
          height="28"
          rx="3.5"
          fill="url(#droidLimbGrad)"
          style={{
            transformOrigin: '17px 50px',
            transform: isMoving ? 'rotate(-8deg)' : isVictorious ? 'rotate(-35deg)' : 'none',
            transition: 'transform 0.15s ease',
          }}
        />

        {/* --- Right Arm --- */}
        <rect
          x="79"
          y="48"
          width="7"
          height="28"
          rx="3.5"
          fill="url(#droidLimbGrad)"
          style={{
            transformOrigin: '83px 50px',
            transform: isMoving ? 'rotate(8deg)' : isVictorious ? 'rotate(35deg)' : 'none',
            transition: 'transform 0.15s ease',
          }}
        />

        {/* --- Left Leg --- */}
        <rect
          x="35"
          y="84"
          width="8"
          height="18"
          rx="4"
          fill="url(#droidLimbGrad)"
          style={{
            transform: isMoving ? 'translateY(-2px)' : 'none',
          }}
        />

        {/* --- Right Leg --- */}
        <rect
          x="57"
          y="84"
          width="8"
          height="18"
          rx="4"
          fill="url(#droidLimbGrad)"
          style={{
            transform: isMoving ? 'translateY(2px)' : 'none',
          }}
        />
      </svg>
    </div>
  );
};
