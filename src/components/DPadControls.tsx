import React from 'react';
import { RotateCcw, Undo2, Lightbulb, Hand } from 'lucide-react';

interface GameActionBarProps {
  onUndo: () => void;
  onReset: () => void;
  onHint: () => void;
  canUndo: boolean;
  hintsRemaining: number;
}

export const DPadControls: React.FC<GameActionBarProps> = ({
  onUndo,
  onReset,
  onHint,
  canUndo,
  hintsRemaining,
}) => {
  return (
    <div className="w-full max-w-sm mx-auto flex flex-col items-center gap-1.5 px-4 pb-3 pt-1 select-none">
      {/* Sleek Floating Action Pills: Undo, Reset, Hint */}
      <div className="flex items-center justify-center gap-4 bg-slate-900/90 border border-slate-800/90 py-2 px-5 rounded-2xl shadow-xl backdrop-blur-md">
        {/* Undo Button */}
        <button
          onClick={onUndo}
          disabled={!canUndo}
          aria-label="Undo move"
          className={`flex items-center gap-1.5 px-3 py-2 rounded-xl border text-xs font-semibold transition-all active:scale-95 ${
            canUndo
              ? 'bg-slate-800 border-slate-700 text-slate-200 hover:bg-slate-700 hover:text-white shadow'
              : 'bg-slate-900/50 border-slate-800/60 text-slate-600 cursor-not-allowed'
          }`}
          title="Undo last move (Z)"
        >
          <Undo2 className="w-4 h-4" />
          <span>Undo</span>
        </button>

        {/* Reset Button */}
        <button
          onClick={onReset}
          aria-label="Reset puzzle"
          className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-800 border border-slate-700 text-slate-300 hover:text-rose-400 hover:bg-slate-700 active:scale-95 transition-all text-xs font-semibold shadow"
          title="Restart chamber (R)"
        >
          <RotateCcw className="w-4 h-4" />
          <span>Reset</span>
        </button>

        {/* Hint / Help Button */}
        <button
          onClick={onHint}
          aria-label="Use hint"
          className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-amber-500/15 border border-amber-500/40 text-amber-300 hover:bg-amber-500/25 active:scale-95 transition-all text-xs font-bold shadow"
          title="Get a hint (H)"
        >
          <Lightbulb className="w-4 h-4 text-amber-400" />
          <span>Hint</span>
          <span className="ml-0.5 px-1.5 py-0.2 rounded-full bg-amber-400 text-slate-950 text-[10px] font-black font-mono">
            {hintsRemaining}
          </span>
        </button>
      </div>

      {/* Touch instruction hint */}
      <div className="flex items-center gap-1 text-[11px] text-slate-400/80 font-medium">
        <Hand className="w-3 h-3 text-emerald-400" />
        <span>Tap tile or swipe anywhere to move and push cubes</span>
      </div>
    </div>
  );
};
