import React from 'react';
import { Lock } from 'lucide-react';

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
        isJustMoved ? 'scale-105' : 'scale-100'
      }`}
    >
      {/* Ground cast shadow */}
      <div className="absolute -bottom-1 w-4/5 h-2.5 bg-black/60 rounded-full blur-[2px]" />

      {/* 3D Isometric Cube Container */}
      <div className="relative w-[88%] h-[88%]">
        {/* Front & Top Isometric Cube Faces */}
        <div
          className={`w-full h-full rounded-xl transition-all duration-200 border flex flex-col justify-between p-1.5 shadow-lg ${
            isFixed
              ? 'bg-gradient-to-br from-zinc-700 via-neutral-800 to-zinc-950 border-zinc-500/80 shadow-black/80'
              : isOnPlate
              ? 'bg-gradient-to-br from-emerald-500 via-teal-600 to-emerald-900 border-emerald-300 shadow-emerald-500/40'
              : isEnergy
              ? 'bg-gradient-to-br from-amber-500 via-orange-600 to-amber-900 border-amber-300 shadow-amber-500/30'
              : 'bg-gradient-to-br from-cyan-600 via-slate-700 to-slate-900 border-cyan-400/60 shadow-cyan-900/40'
          }`}
          style={{
            transform: 'perspective(400px) rotateX(12deg)',
          }}
        >
          {/* Top Bevel Highlight */}
          <div
            className={`w-full h-1.5 rounded-t-lg ${
              isFixed ? 'bg-zinc-400/30' : 'bg-white/30'
            }`}
          />

          {/* Core Visual */}
          {isFixed ? (
            /* Fixed Immovable Steel Barrier Crate with Warning Chevrons & Lock */
            <div className="flex-1 flex flex-col items-center justify-center gap-0.5">
              <div className="flex items-center gap-1 text-zinc-400">
                <Lock className="w-3 h-3 text-zinc-300" />
              </div>
              {/* Warning hazard stripes */}
              <div className="w-8 h-2 rounded bg-amber-500/20 border border-amber-500/40 flex items-center justify-around overflow-hidden px-0.5">
                <div className="w-1 h-3 bg-amber-400/80 -rotate-12" />
                <div className="w-1 h-3 bg-zinc-900 -rotate-12" />
                <div className="w-1 h-3 bg-amber-400/80 -rotate-12" />
                <div className="w-1 h-3 bg-zinc-900 -rotate-12" />
              </div>
              <span className="text-[7px] font-black tracking-widest text-zinc-400 uppercase">
                FIXED
              </span>
            </div>
          ) : (
            /* Pushable Tactical Cube */
            <div className="flex-1 flex flex-col items-center justify-center gap-1">
              <div className="flex items-center gap-1">
                <div
                  className={`w-1.5 h-1.5 rounded-full transition-colors ${
                    isOnPlate
                      ? 'bg-white shadow-[0_0_6px_#fff]'
                      : isEnergy
                      ? 'bg-amber-200 shadow-[0_0_4px_#fde68a]'
                      : 'bg-cyan-300 shadow-[0_0_4px_#67e8f9]'
                  }`}
                />
                <div
                  className={`w-5 h-0.5 rounded transition-colors ${
                    isOnPlate ? 'bg-emerald-200' : isEnergy ? 'bg-amber-300' : 'bg-cyan-300/80'
                  }`}
                />
                <div
                  className={`w-1.5 h-1.5 rounded-full transition-colors ${
                    isOnPlate
                      ? 'bg-white shadow-[0_0_6px_#fff]'
                      : isEnergy
                      ? 'bg-amber-200 shadow-[0_0_4px_#fde68a]'
                      : 'bg-cyan-300 shadow-[0_0_4px_#67e8f9]'
                  }`}
                />
              </div>

              {/* Tactile Grip indent */}
              <div className="w-7 h-1 rounded-full bg-black/40 border-t border-white/10" />
            </div>
          )}

          {/* Bottom Solid Edge */}
          <div className="w-full h-1 bg-black/50 rounded-b-md" />
        </div>
      </div>
    </div>
  );
};
