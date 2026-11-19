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
      {/* Crisp Floor Contact Shadow */}
      <div
        className={`absolute bottom-0.5 w-3/4 h-2.5 rounded-full blur-[2px] transition-all duration-200 ${
          isVictorious
            ? 'bg-amber-600/30'
            : isMoving
            ? 'bg-teal-800/30'
            : 'bg-[#1f242c]/25'
        }`}
      />

      <div className="relative w-full h-full flex items-center justify-center">
        <svg
          viewBox="0 0 100 115"
          className="w-full h-full drop-shadow-[0_3px_5px_rgba(31,36,44,0.2)]"
          style={{
            transform: `rotate(${getHeadTilt()}deg)`,
            transition: 'transform 0.15s ease-out',
          }}
        >
          <defs>
            <linearGradient id="droidHeadGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#6ee7b7" />
              <stop offset="40%" stopColor="#10b981" />
              <stop offset="100%" stopColor="#047857" />
            </linearGradient>

            <linearGradient id="droidBodyGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#34d399" />
              <stop offset="45%" stopColor="#059669" />
              <stop offset="100%" stopColor="#0f766e" />
            </linearGradient>

            <linearGradient id="droidLimbGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#34d399" />
              <stop offset="100%" stopColor="#065f46" />
            </linearGradient>
          </defs>

          {/* Antennas */}
          <g stroke="#059669" strokeWidth="4.2" strokeLinecap="round">
            <line
              x1="36"
              y1="22"
              x2={direction === 'LEFT' ? '24' : isMoving ? '26' : '28'}
              y2={isMoving ? '12' : '9'}
            />
            <line
              x1="64"
              y1="22"
              x2={direction === 'RIGHT' ? '76' : isMoving ? '74' : '72'}
              y2={isMoving ? '12' : '9'}
            />
          </g>

          <circle
            cx={direction === 'LEFT' ? 24 : isMoving ? 26 : 28}
            cy={isMoving ? 12 : 9}
            r="3"
            fill="#fbbf24"
          />
          <circle
            cx={direction === 'RIGHT' ? 76 : isMoving ? 74 : 72}
            cy={isMoving ? 12 : 9}
            r="3"
            fill="#fbbf24"
          />

          {/* Semi-Circle Head */}
          <path d="M 23,42 A 27,27 0 0,1 77,42 Z" fill="url(#droidHeadGrad)" />
          <path
            d="M 28,37 A 23,23 0 0,1 72,37"
            fill="none"
            stroke="rgba(255,255,255,0.55)"
            strokeWidth="2"
            strokeLinecap="round"
          />

          {/* Eyes */}
          {direction !== 'UP' ? (
            <g transform={`translate(${getEyeOffset()}, 0)`} className="transition-transform duration-150">
              {isBlinking ? (
                <>
                  <line x1="36" y1="33" x2="42" y2="33" stroke="#FFFFFF" strokeWidth="2.5" strokeLinecap="round" />
                  <line x1="58" y1="33" x2="64" y2="33" stroke="#FFFFFF" strokeWidth="2.5" strokeLinecap="round" />
                </>
              ) : (
                <>
                  <circle cx="39" cy="32.5" r="3.6" fill="#FFFFFF" />
                  <circle cx="38" cy="31.5" r="1.2" fill="#0f766e" />
                  <circle cx="61" cy="32.5" r="3.6" fill="#FFFFFF" />
                  <circle cx="60" cy="31.5" r="1.2" fill="#0f766e" />
                </>
              )}
            </g>
          ) : (
            <line x1="50" y1="18" x2="50" y2="38" stroke="rgba(6,95,70,0.55)" strokeWidth="2" strokeDasharray="3 2" />
          )}

          {/* Torso */}
          <rect x="24" y="46" width="52" height="38" rx="7" fill="url(#droidBodyGrad)" />
          <path d="M 27,48 L 73,48" stroke="rgba(255,255,255,0.4)" strokeWidth="1.5" strokeLinecap="round" />
          <circle cx="50" cy="65" r="5" fill="#134e4a" />
          <circle cx="50" cy="65" r="2.8" fill="#fbbf24" />

          <line x1="31" y1="56" x2="69" y2="56" stroke="rgba(255,255,255,0.25)" strokeWidth="1" strokeLinecap="round" />
          <line x1="31" y1="74" x2="43" y2="74" stroke="rgba(255,255,255,0.2)" strokeWidth="1" strokeLinecap="round" />
          <line x1="57" y1="74" x2="69" y2="74" stroke="rgba(255,255,255,0.2)" strokeWidth="1" strokeLinecap="round" />

          {/* Arms */}
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

          {/* Legs */}
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
