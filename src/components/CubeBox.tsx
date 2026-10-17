import React from 'react';
import { Lock, Zap } from 'lucide-react';

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
      className={`relative w-full h-full flex items-center justify-center transition-all duration-150 ${
        isJustMoved ? 'scale-105' : 'scale-100 hover:scale-[1.03]'
      }`}
    >
      {/* Ground Cast Ambient Shadow */}
      <div 
        className={`absolute -bottom-1 w-[85%] h-3 rounded-full blur-[3px] transition-all duration-200 ${
          isOnPlate
            ? 'bg-emerald-950/80 shadow-[0_0_10px_#10b981]'
            : isEnergy
            ? 'bg-amber-950/80 shadow-[0_0_8px_#f59e0b]'
            : 'bg-black/70 shadow-[0_0_6px_rgba(0,0,0,0.8)]'
        }`} 
      />

      {/* 3D Isometric Cube Container */}
      <div className="relative w-[90%] h-[90%] flex flex-col items-center justify-center">
        {/* Main 3D Cube Body */}
        <div
          className={`relative w-full h-full rounded-2xl transition-all duration-200 flex flex-col justify-between p-1.5 shadow-xl overflow-hidden ${
            isFixed
              ? 'bg-gradient-to-br from-zinc-700 via-neutral-800 to-zinc-950 border-2 border-zinc-500 shadow-zinc-950/80'
              : isOnPlate
              ? 'bg-gradient-to-br from-emerald-500 via-teal-600 to-emerald-950 border-2 border-emerald-300 shadow-emerald-500/50'
              : isEnergy
              ? 'bg-gradient-to-br from-amber-500 via-orange-600 to-amber-950 border-2 border-amber-300 shadow-amber-500/40'
              : 'bg-gradient-to-br from-cyan-500 via-slate-800 to-slate-950 border-2 border-cyan-400 shadow-cyan-900/60'
          }`}
          style={{
            transform: 'perspective(500px) rotateX(10deg)',
          }}
        >
          {/* Top Bevel Glass Reflection Highlight */}
          <div
            className={`w-full h-2 rounded-t-xl transition-all ${
              isFixed
                ? 'bg-gradient-to-r from-zinc-400/40 via-zinc-200/20 to-transparent'
                : isOnPlate
                ? 'bg-gradient-to-r from-emerald-200/60 via-white/40 to-transparent'
                : isEnergy
                ? 'bg-gradient-to-r from-amber-200/60 via-white/40 to-transparent'
                : 'bg-gradient-to-r from-cyan-200/60 via-white/40 to-transparent'
            }`}
          />

          {/* Corner Cyber Brackets */}
          <div className="absolute top-1 left-1 w-2 h-2 border-t border-l border-white/50 rounded-tl pointer-events-none" />
          <div className="absolute top-1 right-1 w-2 h-2 border-t border-r border-white/50 rounded-tr pointer-events-none" />
          <div className="absolute bottom-1 left-1 w-2 h-2 border-b border-l border-white/30 rounded-bl pointer-events-none" />
          <div className="absolute bottom-1 right-1 w-2 h-2 border-b border-r border-white/30 rounded-br pointer-events-none" />

          {/* Core Content Visual */}
          {isFixed ? (
            /* Fixed Immovable Steel Barrier */
            <div className="flex-1 flex flex-col items-center justify-center gap-0.5">
              <div className="w-5 h-5 rounded-full bg-zinc-900/90 border border-zinc-600 flex items-center justify-center shadow-inner">
                <Lock className="w-3 h-3 text-zinc-300" />
              </div>
              <div className="w-10 h-1.5 rounded-sm bg-amber-500/20 border border-amber-500/50 flex items-center justify-around overflow-hidden px-0.5 mt-0.5">
                <div className="w-1 h-3 bg-amber-400/90 -rotate-12" />
                <div className="w-1 h-3 bg-zinc-900 -rotate-12" />
                <div className="w-1 h-3 bg-amber-400/90 -rotate-12" />
                <div className="w-1 h-3 bg-zinc-900 -rotate-12" />
              </div>
            </div>
          ) : (
            /* Pushable Tactical Energy Cyber-Cube */
            <div className="flex-1 flex flex-col items-center justify-center gap-1">
              {/* Central Glowing Core Reactor */}
              <div 
                className={`relative w-6 h-6 rounded-lg flex items-center justify-center shadow-inner transition-all ${
                  isOnPlate
                    ? 'bg-emerald-400/30 border border-emerald-300 shadow-[0_0_10px_#34d399]'
                    : isEnergy
                    ? 'bg-amber-400/30 border border-amber-300 shadow-[0_0_10px_#fbbf24]'
                    : 'bg-cyan-400/30 border border-cyan-300 shadow-[0_0_10px_#38bdf8]'
                }`}
              >
                {isEnergy ? (
                  <Zap className="w-3.5 h-3.5 text-amber-300 animate-pulse" />
                ) : (
                  <div
                    className={`w-2 h-2 rounded-full transition-colors ${
                      isOnPlate
                        ? 'bg-white shadow-[0_0_8px_#ffffff]'
                        : 'bg-cyan-200 shadow-[0_0_6px_#67e8f9]'
                    }`}
                  />
                )}
              </div>

              {/* Tactile Push Grip Lines */}
              <div className="flex items-center gap-1 opacity-70">
                <div className="w-1 h-1 rounded-full bg-white/60" />
                <div className="w-6 h-0.5 rounded bg-white/40" />
                <div className="w-1 h-1 rounded-full bg-white/60" />
              </div>
            </div>
          )}

          {/* Bottom Edge Shadow Bar */}
          <div className="w-full h-1 bg-black/40 rounded-b-lg" />
        </div>
      </div>
    </div>
  );
};
