import React, { useState, useEffect } from 'react';
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
  const [isBlinking, setIsBlinking] = useState(false);

  // Natural lively blinking rhythm
  useEffect(() => {
    const blinkInterval = setInterval(() => {
      setIsBlinking(true);
      setTimeout(() => setIsBlinking(false), 140);
    }, 3600 + Math.random() * 2000);

    return () => clearInterval(blinkInterval);
  }, []);

  const getEyeOffset = () => {
    switch (direction) {
      case 'LEFT': return -3;
      case 'RIGHT': return 3;
      case 'UP': return 0;
      case 'DOWN': return 0;
    }
  };

  const getHeadTilt = () => {
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
        isMoving ? 'scale-95' : 'scale-100 hover:scale-105'
      } ${isVictorious ? 'animate-bounce' : ''}`}
    >
      {/* Soft Ground Shadow beneath Droid */}
      <div 
        className={`absolute bottom-0 w-3/4 h-2.5 rounded-full blur-[2px] transition-all duration-200 ${
          isVictorious
            ? 'bg-amber-500/25'
            : isMoving
            ? 'bg-emerald-600/30'
            : 'bg-slate-700/20'
        }`} 
      />

      {/* Floating Droid Body Container */}
      <div 
        className={`relative w-full h-full flex items-center justify-center ${
          !isMoving && !isVictorious ? 'animate-pulse' : ''
        }`}
        style={{
          animationDuration: '2.5s',
        }}
      >
        <svg
          viewBox="0 0 100 115"
          className="w-full h-full drop-shadow-[0_4px_6px_rgba(0,0,0,0.15)]"
          style={{
            transform: `rotate(${getHeadTilt()}deg)`,
            transition: 'transform 0.15s ease-out',
          }}
        >

          <defs>
            {/* Android Signature Lime/Emerald Luxury Gradients */}
            <linearGradient id="droidHeadGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#86EFAC" />
              <stop offset="35%" stopColor="#4ADE80" />
              <stop offset="75%" stopColor="#22C55E" />
              <stop offset="100%" stopColor="#15803D" />
            </linearGradient>

            <linearGradient id="droidBodyGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#4ADE80" />
              <stop offset="40%" stopColor="#22C55E" />
              <stop offset="85%" stopColor="#16A34A" />
              <stop offset="100%" stopColor="#0F766E" />
            </linearGradient>

            <linearGradient id="droidLimbGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#86EFAC" />
              <stop offset="60%" stopColor="#22C55E" />
              <stop offset="100%" stopColor="#15803D" />
            </linearGradient>

            <filter id="droidGlow" x="-30%" y="-30%" width="160%" height="160%">
              <feGaussianBlur stdDeviation="2.5" result="blur" />
              <feComposite in="SourceGraphic" in2="blur" operator="over" />
            </filter>

            <filter id="eyeGlow" x="-50%" y="-50%" width="200%" height="200%">
              <feGaussianBlur stdDeviation="1.5" result="blur" />
              <feComposite in="SourceGraphic" in2="blur" operator="over" />
            </filter>
          </defs>

          {/* --- Antennas with lively bounce --- */}
          <g stroke="#22C55E" strokeWidth="4.5" strokeLinecap="round">
            {/* Left antenna */}
            <line
              x1="36"
              y1="22"
              x2={direction === 'LEFT' ? '24' : isMoving ? '26' : '28'}
              y2={isMoving ? '12' : '9'}
              className="transition-all duration-150"
            />
            {/* Right antenna */}
            <line
              x1="64"
              y1="22"
              x2={direction === 'RIGHT' ? '76' : isMoving ? '74' : '72'}
              y2={isMoving ? '12' : '9'}
              className="transition-all duration-150"
            />
          </g>

          {/* Glowing Antenna Tips */}
          <circle 
            cx={direction === 'LEFT' ? 24 : isMoving ? 26 : 28} 
            cy={isMoving ? 12 : 9} 
            r="3" 
            fill="#86EFAC" 
            filter="url(#droidGlow)" 
          />
          <circle 
            cx={direction === 'RIGHT' ? 76 : isMoving ? 74 : 72} 
            cy={isMoving ? 12 : 9} 
            r="3" 
            fill="#86EFAC" 
            filter="url(#droidGlow)" 
          />

          {/* --- Android Semi-Circle Head --- */}
          <path
            d="M 23,42 A 27,27 0 0,1 77,42 Z"
            fill="url(#droidHeadGrad)"
          />

          {/* Head Specular Top Edge Arc */}
          <path
            d="M 28,37 A 23,23 0 0,1 72,37"
            fill="none"
            stroke="rgba(255,255,255,0.6)"
            strokeWidth="2"
            strokeLinecap="round"
          />

          {/* --- Expressive Cute Eyes --- */}
          {direction !== 'UP' ? (
            <g transform={`translate(${getEyeOffset()}, 0)`} className="transition-transform duration-150">
              {isBlinking ? (
                // Blinking closed eye slits
                <>
                  <line x1="36" y1="33" x2="42" y2="33" stroke="#FFFFFF" strokeWidth="2.5" strokeLinecap="round" />
                  <line x1="58" y1="33" x2="64" y2="33" stroke="#FFFFFF" strokeWidth="2.5" strokeLinecap="round" />
                </>
              ) : (
                // Big luminous cyber eyes with specular highlights
                <>
                  {/* Left Eye */}
                  <circle cx="39" cy="32.5" r="3.6" fill="#FFFFFF" filter="url(#eyeGlow)" />
                  <circle cx="38" cy="31.5" r="1.2" fill="#E0F2FE" />

                  {/* Right Eye */}
                  <circle cx="61" cy="32.5" r="3.6" fill="#FFFFFF" filter="url(#eyeGlow)" />
                  <circle cx="60" cy="31.5" r="1.2" fill="#E0F2FE" />
                </>
              )}
            </g>
          ) : (
            // Back of head cyber seam
            <line x1="50" y1="18" x2="50" y2="38" stroke="rgba(21,128,61,0.5)" strokeWidth="2" strokeDasharray="3 2" />
          )}

          {/* --- Torso Body with Sci-Fi Plates --- */}
          <rect
            x="24"
            y="46"
            width="52"
            height="38"
            rx="7"
            fill="url(#droidBodyGrad)"
          />

          {/* Torso Top Highlight */}
          <path
            d="M 27,48 L 73,48"
            stroke="rgba(255,255,255,0.4)"
            strokeWidth="1.5"
            strokeLinecap="round"
          />

          {/* Torso Core Arc Reactor */}
          <circle cx="50" cy="65" r="4.5" fill="#10B981" filter="url(#droidGlow)" opacity="0.8" />
          <circle cx="50" cy="65" r="2.5" fill="#ECFDF5" />

          {/* Cyber Plate Grooves */}
          <line x1="31" y1="56" x2="69" y2="56" stroke="rgba(255,255,255,0.25)" strokeWidth="1" strokeLinecap="round" />
          <line x1="31" y1="74" x2="43" y2="74" stroke="rgba(255,255,255,0.2)" strokeWidth="1" strokeLinecap="round" />
          <line x1="57" y1="74" x2="69" y2="74" stroke="rgba(255,255,255,0.2)" strokeWidth="1" strokeLinecap="round" />

          {/* --- Left Arm with Walking Pivot --- */}
          <rect
            x="13"
            y="48"
            width="7.5"
            height="29"
            rx="3.75"
            fill="url(#droidLimbGrad)"
            style={{
              transformOrigin: '17px 50px',
              transform: isMoving ? 'rotate(-14deg)' : isVictorious ? 'rotate(-40deg)' : 'none',
              transition: 'transform 0.15s ease',
            }}
          />

          {/* --- Right Arm with Walking Pivot --- */}
          <rect
            x="79.5"
            y="48"
            width="7.5"
            height="29"
            rx="3.75"
            fill="url(#droidLimbGrad)"
            style={{
              transformOrigin: '83px 50px',
              transform: isMoving ? 'rotate(14deg)' : isVictorious ? 'rotate(40deg)' : 'none',
              transition: 'transform 0.15s ease',
            }}
          />

          {/* --- Left Leg --- */}
          <rect
            x="34"
            y="84"
            width="9"
            height="18"
            rx="4.5"
            fill="url(#droidLimbGrad)"
            style={{
              transform: isMoving ? 'translateY(-3px)' : 'none',
              transition: 'transform 0.12s ease',
            }}
          />

          {/* --- Right Leg --- */}
          <rect
            x="57"
            y="84"
            width="9"
            height="18"
            rx="4.5"
            fill="url(#droidLimbGrad)"
            style={{
              transform: isMoving ? 'translateY(3px)' : 'none',
              transition: 'transform 0.12s ease',
            }}
          />
        </svg>
      </div>
    </div>
  );
};
