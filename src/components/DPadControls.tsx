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
    <div className="w-full max-w-[440px] mx-auto flex flex-col items-center gap-2 px-3 pb-3 pt-1 select-none">
      {/* Tactile Keycap Dock: Undo, Reset, Hint */}
      <div className="w-full flex items-center justify-between gap-2.5 bg-[#e6e0d4] border border-[#cbc2b2] p-2 rounded-2xl shadow-sm">
        <button
          onClick={onUndo}
          disabled={!canUndo}
          aria-label="Undo move"
          className={`flex-1 flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-xl border text-xs font-bold transition-all whitespace-nowrap cursor-pointer ${
            canUndo
              ? 'bg-[#faf7f0] border-[#d3cab9] text-[#1f242c] hover:bg-white shadow-[0_2px_0_#c6beb0] active:translate-y-[1px] active:shadow-none'
              : 'bg-[#eee9de]/60 border-[#dbd3c5] text-[#a39a8b] cursor-not-allowed'
          }`}
          title="Undo last move (Z)"
        >
          <Undo2 className={`w-4 h-4 ${canUndo ? 'text-[#0284c7]' : 'text-[#b5ac9d]'}`} />
          <span>Undo</span>
        </button>

        <button
          onClick={onReset}
          aria-label="Reset chamber"
          className="flex-1 flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-xl bg-[#faf7f0] border border-[#d3cab9] text-[#1f242c] hover:bg-white shadow-[0_2px_0_#c6beb0] active:translate-y-[1px] active:shadow-none transition-all text-xs font-bold whitespace-nowrap cursor-pointer"
          title="Restart chamber (R)"
        >
          <RotateCcw className="w-4 h-4 text-[#b91c1c]" />
          <span>Reset</span>
        </button>

        <button
          onClick={onHint}
          aria-label="Show solution hint"
          className="flex-1 flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-xl bg-[#d97706] hover:bg-[#b45309] border border-[#b45309] text-white shadow-[0_2px_0_#92400e] active:translate-y-[1px] active:shadow-none transition-all text-xs font-bold whitespace-nowrap cursor-pointer"
          title="Show cube push solution (H)"
        >
          <Lightbulb className="w-4 h-4 text-amber-100" />
          <span>Hint ({hintsRemaining})</span>
        </button>
      </div>

      {/* Concise Touch Gesture Tip */}
      <div className="flex items-center gap-1.5 text-[11px] text-[#6b6356] font-medium text-center">
        <Hand className="w-3.5 h-3.5 text-[#b45309] shrink-0" />
        <span>Swipe to push · Double-tap any tile to walk</span>
      </div>
    </div>
  );
};
