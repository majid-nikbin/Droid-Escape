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
    <div className="w-full max-w-sm mx-auto flex flex-col items-center gap-2 px-3 pb-3 pt-1 select-none">
      {/* Sleek Action Bar: Undo, Reset, Hint (No movement arrows) */}
      <div className="w-full flex items-center justify-between gap-3 bg-white border border-slate-200 py-2 px-3.5 rounded-2xl shadow-md">
        {/* Undo Button */}
        <button
          onClick={onUndo}
          disabled={!canUndo}
          aria-label="Undo move"
          className={`flex-1 flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-xl border text-xs font-semibold transition-all active:scale-95 ${
            canUndo
              ? 'bg-slate-50 border-slate-200 text-slate-800 hover:bg-slate-100 shadow-xs'
              : 'bg-slate-50/50 border-slate-100 text-slate-300 cursor-not-allowed'
          }`}
          title="Undo last move (Z)"
        >
          <Undo2 className={`w-4 h-4 ${canUndo ? 'text-sky-600' : 'text-slate-300'}`} />
          <span>Undo</span>
        </button>

        {/* Reset Button */}
        <button
          onClick={onReset}
          aria-label="Reset chamber"
          className="flex-1 flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-xl bg-slate-50 border border-slate-200 text-slate-800 hover:text-rose-700 hover:bg-rose-50 active:scale-95 transition-all text-xs font-semibold shadow-xs"
          title="Restart chamber (R)"
        >
          <RotateCcw className="w-4 h-4 text-rose-600" />
          <span>Reset</span>
        </button>

        {/* Hint / Help Button */}
        <button
          onClick={onHint}
          aria-label="Use hint to view solution"
          className="flex-1 flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-xl bg-amber-50 border border-amber-300 text-amber-900 hover:bg-amber-100 active:scale-95 transition-all text-xs font-bold shadow-xs"
          title="Show cube push solution and auto-solve test (H)"
        >
          <Lightbulb className="w-4 h-4 text-amber-600" />
          <span>Hint</span>
          <span className="px-1.5 py-0.5 rounded-full bg-amber-500 text-white text-[10px] font-black font-mono">
            {hintsRemaining}
          </span>
        </button>
      </div>

      {/* Helpful gesture instructions */}
      <div className="flex items-center gap-1.5 text-[11px] text-slate-500 font-medium text-center">
        <Hand className="w-3.5 h-3.5 text-amber-600 shrink-0" />
        <span>Swipe to push · Double-tap any tile to walk there</span>
      </div>
    </div>
  );
};
