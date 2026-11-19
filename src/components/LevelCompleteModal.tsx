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
        colors: ['#14B8A6', '#F59E0B', '#3B82F6', '#10B981', '#FBBF24'],
      });
    } catch {
      // Fallback
    }
  }, []);

  return (
    <div className="fixed inset-0 z-50 bg-[#050a14]/75 backdrop-blur-sm flex items-center justify-center p-4 select-none animate-in fade-in duration-200">
      <div className="w-full max-w-sm bg-[#14233c] border border-[#2a4269] rounded-3xl p-6 flex flex-col items-center text-center shadow-2xl relative overflow-hidden">
        <div className="w-24 h-24 mb-2 flex items-center justify-center">
          <AndroidMascot direction="DOWN" isVictorious={true} />
        </div>

        <h2 className="text-2xl font-extrabold text-[#edf3fc] tracking-tight mb-0.5">
          Chamber Cleared
        </h2>
        <p className="text-xs text-[#2dd4bf] font-bold mb-4 font-mono">
          Chapter {chapter} · Level {level}
        </p>

        {/* 3-Star Rating */}
        <div className="flex items-center gap-2 mb-4">
          {[1, 2, 3].map(s => (
            <div
              key={s}
              className={`p-2 rounded-2xl border transition-all duration-300 ${
                s <= stars
                  ? 'bg-[#38230a] border-[#f59e0b]/60 scale-105 shadow-xs'
                  : 'bg-[#101c31] border-[#22385c] opacity-40'
              }`}
            >
              <Star
                className={`w-6 h-6 ${
                  s <= stars ? 'fill-[#f59e0b] text-[#fbbf24]' : 'text-[#52698f]'
                }`}
              />
            </div>
          ))}
        </div>

        {/* Metrics */}
        <div className="w-full grid grid-cols-2 gap-2.5 mb-4">
          <div className="p-2.5 rounded-xl bg-[#1a2c4a] border border-[#2b436b] flex flex-col items-center">
            <span className="text-[11px] text-[#90a7c7] font-medium">Moves</span>
            <span className="text-base font-bold font-mono text-[#edf3fc] tabular-nums">
              {moves} <span className="text-xs text-[#6d83a6]">/ {parMoves}</span>
            </span>
          </div>

          <div className="p-2.5 rounded-xl bg-[#38230a]/75 border border-[#d97706]/50 flex flex-col items-center">
            <span className="text-[11px] text-[#fde68a] font-medium">Earned</span>
            <div className="flex items-center gap-1">
              <Award className="w-4 h-4 text-[#f59e0b]" />
              <span className="text-base font-bold font-mono text-[#fcd34d] tabular-nums">
                +{pointsEarned} pt
              </span>
            </div>
          </div>
        </div>

        <div className="w-full text-xs text-[#90a7c7] mb-5 flex items-center justify-center gap-1.5 font-mono tabular-nums">
          <span>Balance:</span>
          <span className="text-[#fcd34d] font-bold">{totalPoints} pts</span>
          <span className="text-[#354f7a]">·</span>
          <span className="text-[#2dd4bf] font-semibold">10 pts = 1 hint</span>
        </div>

        <button
          onClick={onNextLevel}
          className="w-full py-3.5 px-6 rounded-2xl bg-[#0f766e] hover:bg-[#115e59] text-white font-extrabold text-sm shadow-[0_4px_0_#073d39] active:translate-y-[1px] active:shadow-none transition-all flex items-center justify-center gap-2 mb-2.5 cursor-pointer"
        >
          <span>Next Chamber</span>
          <ArrowRight className="w-4 h-4" />
        </button>

        <div className="w-full flex items-center gap-2">
          <button
            onClick={onReplay}
            className="flex-1 py-2.5 px-3 rounded-xl bg-[#1b2f50] hover:bg-[#233b63] text-[#edf3fc] text-xs font-bold flex items-center justify-center gap-1.5 transition-all border border-[#2f4b78] cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Replay</span>
          </button>

          <button
            onClick={onMainMenu}
            className="flex-1 py-2.5 px-3 rounded-xl bg-[#1b2f50] hover:bg-[#233b63] text-[#edf3fc] text-xs font-bold flex items-center justify-center gap-1.5 transition-all border border-[#2f4b78] cursor-pointer"
          >
            <Home className="w-3.5 h-3.5" />
            <span>Menu</span>
          </button>
        </div>
      </div>
    </div>
  );
};
