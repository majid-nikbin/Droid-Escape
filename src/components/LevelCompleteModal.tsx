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
        particleCount: 60,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#10B981', '#34D399', '#F59E0B', '#38BDF8', '#FFFFFF'],
      });
    } catch {
      // Fallback
    }
  }, []);

  return (
    <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4 select-none animate-in fade-in duration-200">
      <div className="w-full max-w-sm bg-slate-900 border border-slate-700/80 rounded-3xl p-6 flex flex-col items-center text-center shadow-2xl relative overflow-hidden">
        {/* Glow backdrop */}
        <div className="absolute top-0 w-full h-32 bg-emerald-500/10 blur-2xl pointer-events-none" />

        {/* Celebrating Android Mascot */}
        <div className="w-24 h-24 mb-2 flex items-center justify-center">
          <AndroidMascot direction="DOWN" isVictorious={true} />
        </div>

        {/* Victory Headline */}
        <h2 className="text-2xl font-black text-white tracking-tight mb-0.5">
          CHAMBER CLEARED!
        </h2>
        <p className="text-xs text-emerald-400 font-semibold mb-4">
          Chapter {chapter} · Level {level} Complete
        </p>

        {/* 3-Star Rating */}
        <div className="flex items-center gap-2 mb-4">
          {[1, 2, 3].map(s => (
            <div
              key={s}
              className={`p-2 rounded-2xl border transition-all duration-300 ${
                s <= stars
                  ? 'bg-amber-500/20 border-amber-400/50 scale-105 shadow-md shadow-amber-500/20'
                  : 'bg-slate-800/40 border-slate-800 opacity-40'
              }`}
            >
              <Star
                className={`w-6 h-6 ${
                  s <= stars ? 'fill-amber-400 text-amber-300' : 'text-slate-600'
                }`}
              />
            </div>
          ))}
        </div>

        {/* Stats Grid */}
        <div className="w-full grid grid-cols-2 gap-2 mb-4">
          <div className="p-2.5 rounded-xl bg-slate-950/70 border border-slate-800 flex flex-col items-center">
            <span className="text-[11px] text-slate-400">Moves Taken</span>
            <span className="text-base font-bold font-mono text-slate-200 tabular-nums">
              {moves} <span className="text-xs text-slate-500">/ {parMoves}</span>
            </span>
          </div>

          <div className="p-2.5 rounded-xl bg-amber-500/10 border border-amber-500/20 flex flex-col items-center">
            <span className="text-[11px] text-amber-300/80">Reward Point</span>
            <div className="flex items-center gap-1">
              <Award className="w-4 h-4 text-amber-400" />
              <span className="text-base font-bold font-mono text-amber-300 tabular-nums">
                +{pointsEarned} PTS
              </span>
            </div>
          </div>
        </div>

        {/* Total Points Balance Reminder */}
        <div className="w-full text-xs text-slate-400 mb-5 flex items-center justify-center gap-1.5 font-mono">
          <span>Total Balance:</span>
          <span className="text-amber-400 font-bold">{totalPoints} Points</span>
          <span className="text-slate-600">·</span>
          <span className="text-emerald-400">10 Pts = 1 Help</span>
        </div>

        {/* Primary Next Level Button */}
        <button
          onClick={onNextLevel}
          className="w-full py-3.5 px-6 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 font-black text-sm tracking-wide shadow-lg shadow-emerald-500/25 active:scale-[0.98] transition-all flex items-center justify-center gap-2 mb-2.5"
        >
          <span>NEXT CHAMBER</span>
          <ArrowRight className="w-4 h-4" />
        </button>

        {/* Secondary Buttons */}
        <div className="w-full flex items-center gap-2">
          <button
            onClick={onReplay}
            className="flex-1 py-2.5 px-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold flex items-center justify-center gap-1.5 transition-all active:scale-95 border border-slate-700"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Replay</span>
          </button>

          <button
            onClick={onMainMenu}
            className="flex-1 py-2.5 px-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold flex items-center justify-center gap-1.5 transition-all active:scale-95 border border-slate-700"
          >
            <Home className="w-3.5 h-3.5" />
            <span>Main Menu</span>
          </button>
        </div>
      </div>
    </div>
  );
};
