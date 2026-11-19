import React, { useEffect } from 'react';
import { Star, Award, ArrowRight, RotateCcw, Home } from 'lucide-react';
import confetti from 'canvas-confetti';
import { AndroidMascot } from './AndroidMascot';

interface LevelCompleteModalProps {
  chapter: number;
  level: number;
  moves: number;
  parMoves: number;
  pointsEarned: number;
  totalPoints: number;
  onNextLevel: () => void;
  onReplay: () => void;
  onMainMenu: () => void;
}

export const LevelCompleteModal: React.FC<LevelCompleteModalProps> = ({
  chapter,
  level,
  moves,
  parMoves,
  pointsEarned,
  totalPoints,
  onNextLevel,
  onReplay,
  onMainMenu,
}) => {
  const stars = moves <= parMoves ? 3 : moves <= parMoves + 4 ? 2 : 1;

  useEffect(() => {
    try {
      confetti({
        particleCount: 60,
        spread: 65,
        origin: { y: 0.6 },
        colors: ['#0D9488', '#D97706', '#272D37', '#10B981', '#F59E0B'],
      });
    } catch {
      // Fallback
    }
  }, []);

  return (
    <div className="fixed inset-0 z-50 bg-[#1f242c]/60 backdrop-blur-sm flex items-center justify-center p-4 select-none animate-in fade-in duration-200">
      <div className="w-full max-w-sm bg-[#f7f4ed] border border-[#d5cdc0] rounded-3xl p-6 flex flex-col items-center text-center shadow-2xl relative overflow-hidden">
        <div className="w-24 h-24 mb-2 flex items-center justify-center">
          <AndroidMascot direction="DOWN" isVictorious={true} />
        </div>

        <h2 className="text-2xl font-extrabold text-[#1f242c] tracking-tight mb-0.5">
          Chamber Cleared
        </h2>
        <p className="text-xs text-[#0f766e] font-bold mb-4 font-mono">
          Chapter {chapter} · Level {level}
        </p>

        {/* 3-Star Rating */}
        <div className="flex items-center gap-2 mb-4">
          {[1, 2, 3].map(s => (
            <div
              key={s}
              className={`p-2 rounded-2xl border transition-all duration-300 ${
                s <= stars
                  ? 'bg-[#fef3c7] border-[#f59e0b]/60 scale-105 shadow-xs'
                  : 'bg-[#eae4d7] border-[#d5cdc0] opacity-40'
              }`}
            >
              <Star
                className={`w-6 h-6 ${
                  s <= stars ? 'fill-[#d97706] text-[#b45309]' : 'text-[#8c8374]'
                }`}
              />
            </div>
          ))}
        </div>

        {/* Metrics */}
        <div className="w-full grid grid-cols-2 gap-2.5 mb-4">
          <div className="p-2.5 rounded-xl bg-white/85 border border-[#d8d0c2] flex flex-col items-center">
            <span className="text-[11px] text-[#665f54] font-medium">Moves</span>
            <span className="text-base font-bold font-mono text-[#1f242c] tabular-nums">
              {moves} <span className="text-xs text-[#8c8374]">/ {parMoves}</span>
            </span>
          </div>

          <div className="p-2.5 rounded-xl bg-[#fef3c7]/80 border border-[#f59e0b]/40 flex flex-col items-center">
            <span className="text-[11px] text-[#78350f] font-medium">Earned</span>
            <div className="flex items-center gap-1">
              <Award className="w-4 h-4 text-[#d97706]" />
              <span className="text-base font-bold font-mono text-[#92400e] tabular-nums">
                +{pointsEarned} pt
              </span>
            </div>
          </div>
        </div>

        <div className="w-full text-xs text-[#665f54] mb-5 flex items-center justify-center gap-1.5 font-mono tabular-nums">
          <span>Balance:</span>
          <span className="text-[#92400e] font-bold">{totalPoints} pts</span>
          <span className="text-[#c0b7a7]">·</span>
          <span className="text-[#0f766e] font-semibold">10 pts = 1 hint</span>
        </div>

        <button
          onClick={onNextLevel}
          className="w-full py-3.5 px-6 rounded-2xl bg-[#0f766e] hover:bg-[#115e59] text-white font-extrabold text-sm shadow-[0_4px_0_#094c47] active:translate-y-[1px] active:shadow-none transition-all flex items-center justify-center gap-2 mb-2.5 cursor-pointer"
        >
          <span>Next Chamber</span>
          <ArrowRight className="w-4 h-4" />
        </button>

        <div className="w-full flex items-center gap-2">
          <button
            onClick={onReplay}
            className="flex-1 py-2.5 px-3 rounded-xl bg-[#eae4d7] hover:bg-[#e1d9c9] text-[#282e37] text-xs font-bold flex items-center justify-center gap-1.5 transition-all border border-[#ccc3b3] cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Replay</span>
          </button>

          <button
            onClick={onMainMenu}
            className="flex-1 py-2.5 px-3 rounded-xl bg-[#eae4d7] hover:bg-[#e1d9c9] text-[#282e37] text-xs font-bold flex items-center justify-center gap-1.5 transition-all border border-[#ccc3b3] cursor-pointer"
          >
            <Home className="w-3.5 h-3.5" />
            <span>Menu</span>
          </button>
        </div>
      </div>
    </div>
  );
};
