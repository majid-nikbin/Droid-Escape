import React from 'react';
import { Lock, Zap, Check } from 'lucide-react';

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
      className={`relative w-full h-full flex items-center justify-center transition-transform duration-150 ${
        isJustMoved ? 'scale-105' : 'scale-100 hover:scale-[1.02]'
      }`}
    >
      {/* Soft Ground Ambient Shadow (Natural, no harsh neon blur) */}
      <div 
        className={`absolute -bottom-1 w-[80%] h-2.5 rounded-full transition-all duration-200 ${
          isOnPlate
            ? 'bg-emerald-900/25 blur-[3px]'
            : isEnergy
            ? 'bg-amber-900/25 blur-[3px]'
            : 'bg-slate-800/20 blur-[2px]'
        }`} 
      />

      {/* 3D Tactile Cube Body with Beveled Isometric Depth */}
      <div className="relative w-[88%] h-[88%] flex flex-col items-center justify-center">
        <div
          className={`relative w-full h-full rounded-2xl transition-all duration-200 flex flex-col justify-between p-1.5 shadow-md overflow-hidden ${
            isFixed
              ? 'bg-gradient-to-b from-slate-400 via-slate-500 to-slate-700 border-2 border-slate-300 shadow-slate-400/30'
              : isOnPlate
              ? 'bg-gradient-to-b from-emerald-400 via-emerald-500 to-emerald-600 border-2 border-emerald-200 shadow-emerald-700/25'
              : isEnergy
              ? 'bg-gradient-to-b from-amber-400 via-amber-500 to-amber-600 border-2 border-amber-200 shadow-amber-600/30'
              : 'bg-gradient-to-b from-sky-400 via-blue-500 to-blue-600 border-2 border-sky-200 shadow-blue-600/25'
          }`}
          style={{
            transform: 'perspective(400px) rotateX(6deg)',
          }}
        >
          {/* Top Bevel Highlight (Clean warm specular sheen) */}
          <div
            className={`w-full h-2 rounded-t-xl transition-all ${
              isFixed
                ? 'bg-gradient-to-r from-slate-200/40 via-white/30 to-transparent'
                : isOnPlate
                ? 'bg-gradient-to-r from-emerald-100/60 via-white/40 to-transparent'
                : isEnergy
                ? 'bg-gradient-to-r from-amber-100/70 via-white/50 to-transparent'
                : 'bg-gradient-to-r from-sky-100/60 via-white/40 to-transparent'
            }`}
          />

          {/* Corner Structural Inset Brackets */}
          <div className="absolute top-1 left-1 w-2 h-2 border-t-2 border-l-2 border-white/40 rounded-tl pointer-events-none" />
          <div className="absolute top-1 right-1 w-2 h-2 border-t-2 border-r-2 border-white/40 rounded-tr pointer-events-none" />
          <div className="absolute bottom-1 left-1 w-2 h-2 border-b-2 border-l-2 border-black/15 rounded-bl pointer-events-none" />
          <div className="absolute bottom-1 right-1 w-2 h-2 border-b-2 border-r-2 border-black/15 rounded-br pointer-events-none" />

          {/* Core Visual Glyphs */}
          {isFixed ? (
            /* Fixed Granite / Steel Obstacle */
            <div className="flex-1 flex flex-col items-center justify-center gap-0.5">
              <div className="w-5 h-5 rounded-lg bg-slate-600 border border-slate-400 flex items-center justify-center shadow-inner">
                <Lock className="w-3 h-3 text-white" />
              </div>
              <div className="w-8 h-1 rounded bg-slate-700/80 flex items-center justify-around overflow-hidden px-0.5">
                <div className="w-1 h-2 bg-amber-300 -rotate-12" />
                <div className="w-1 h-2 bg-slate-600 -rotate-12" />
                <div className="w-1 h-2 bg-amber-300 -rotate-12" />
              </div>
            </div>
          ) : (
            /* Movable Power Core */
            <div className="flex-1 flex flex-col items-center justify-center">
              <div 
                className={`w-6 h-6 rounded-lg flex items-center justify-center shadow-inner transition-all ${
                  isOnPlate
                    ? 'bg-emerald-300/40 border border-emerald-100 text-white'
                    : isEnergy
                    ? 'bg-amber-300/40 border border-amber-100 text-amber-900'
                    : 'bg-white/30 border border-white/40 text-white'
                }`}
              >
                {isOnPlate ? (
                  <Check className="w-4 h-4 text-white stroke-[3.5]" />
                ) : isEnergy ? (
                  <Zap className="w-4 h-4 text-amber-950 fill-amber-300 stroke-[2.5]" />
                ) : (
                  <div className="w-2.5 h-2.5 rounded-sm bg-white" />
                )}
              </div>
            </div>
          )}

          {/* Subtle Bottom Bevel Rim */}
          <div className="w-full h-1 bg-black/15 rounded-b-xl" />
        </div>
      </div>
    </div>
  );
};
