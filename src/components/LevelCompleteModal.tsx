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
  // Calculate stars: 3 if <= parMoves, 2 if <= parMoves + 4, 1 otherwise
  const stars = moves <= parMoves ? 3 : moves <= parMoves + 4 ? 2 : 1;

  useEffect(() => {
    // Launch festive confetti burst
    try {
      confetti({
        particleCount: 65,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#10B981', '#F59E0B', '#3B82F6', '#14B8A6', '#6366F1'],
      });
    } catch {
      // Fallback
    }
  }, []);

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 select-none animate-in fade-in duration-200">
      <div className="w-full max-w-sm bg-white border border-slate-200 rounded-3xl p-6 flex flex-col items-center text-center shadow-2xl relative overflow-hidden">
        {/* Soft top gradient glow */}
        <div className="absolute top-0 w-full h-24 bg-gradient-to-b from-emerald-100/70 to-transparent pointer-events-none" />

        {/* Celebrating Android Mascot */}
        <div className="w-24 h-24 mb-2 flex items-center justify-center">
          <AndroidMascot direction="DOWN" isVictorious={true} />
        </div>

        {/* Victory Headline */}
        <h2 className="text-2xl font-black text-slate-900 tracking-tight mb-0.5">
          CHAMBER CLEARED!
        </h2>
        <p className="text-xs text-emerald-700 font-bold mb-4">
          Chapter {chapter} · Level {level} Complete
        </p>

        {/* 3-Star Rating */}
        <div className="flex items-center gap-2 mb-4">
          {[1, 2, 3].map(s => (
            <div
              key={s}
              className={`p-2 rounded-2xl border transition-all duration-300 ${
                s <= stars
                  ? 'bg-amber-50 border-amber-300 scale-105 shadow-sm'
                  : 'bg-slate-100 border-slate-200 opacity-40'
              }`}
            >
              <Star
                className={`w-6 h-6 ${
                  s <= stars ? 'fill-amber-400 text-amber-500' : 'text-slate-400'
                }`}
              />
            </div>
          ))}
        </div>

        {/* Stats Grid */}
        <div className="w-full grid grid-cols-2 gap-2 mb-4">
          <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200 flex flex-col items-center">
            <span className="text-[11px] text-slate-500 font-medium">Moves Taken</span>
            <span className="text-base font-bold font-mono text-slate-800 tabular-nums">
              {moves} <span className="text-xs text-slate-400">/ {parMoves}</span>
            </span>
          </div>

          <div className="p-2.5 rounded-xl bg-amber-50 border border-amber-200 flex flex-col items-center">
            <span className="text-[11px] text-amber-800 font-medium">Reward Point</span>
            <div className="flex items-center gap-1">
              <Award className="w-4 h-4 text-amber-600" />
              <span className="text-base font-bold font-mono text-amber-800 tabular-nums">
                +{pointsEarned} PTS
              </span>
            </div>
          </div>
        </div>

        {/* Total Points Balance */}
        <div className="w-full text-xs text-slate-600 mb-5 flex items-center justify-center gap-1.5 font-mono">
          <span>Balance:</span>
          <span className="text-amber-700 font-bold">{totalPoints} Pts</span>
          <span className="text-slate-300">·</span>
          <span className="text-emerald-700 font-semibold">10 Pts = 1 Help</span>
        </div>

        {/* Primary Next Level Button */}
        <button
          onClick={onNextLevel}
          className="w-full py-3.5 px-6 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-white font-extrabold text-sm tracking-wide shadow-md shadow-emerald-500/20 active:scale-[0.98] transition-all flex items-center justify-center gap-2 mb-2.5 cursor-pointer"
        >
          <span>NEXT CHAMBER</span>
          <ArrowRight className="w-4 h-4" />
        </button>

        {/* Secondary Buttons */}
        <div className="w-full flex items-center gap-2">
          <button
            onClick={onReplay}
            className="flex-1 py-2.5 px-3 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold flex items-center justify-center gap-1.5 transition-all active:scale-95 border border-slate-200 cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Replay</span>
          </button>

          <button
            onClick={onMainMenu}
            className="flex-1 py-2.5 px-3 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold flex items-center justify-center gap-1.5 transition-all active:scale-95 border border-slate-200 cursor-pointer"
          >
            <Home className="w-3.5 h-3.5" />
            <span>Main Menu</span>
          </button>
        </div>
      </div>
    </div>
  );
};
