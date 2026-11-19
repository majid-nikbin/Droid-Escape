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
      <div className="w-full flex items-center justify-between gap-2.5 bg-[#14233c] border border-[#263c61] p-2 rounded-2xl shadow-lg">
        <button
          onClick={onUndo}
          disabled={!canUndo}
          aria-label="Undo move"
          className={`flex-1 flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-xl border text-xs font-bold transition-all whitespace-nowrap cursor-pointer ${
            canUndo
              ? 'bg-[#1d3154] border-[#335080] text-[#edf3fc] hover:bg-[#243c66] shadow-[0_2px_0_#08101e] active:translate-y-[1px] active:shadow-none'
              : 'bg-[#111e34]/70 border-[#213557] text-[#566d91] cursor-not-allowed'
          }`}
          title="Undo last move (Z)"
        >
          <Undo2 className={`w-4 h-4 ${canUndo ? 'text-[#38bdf8]' : 'text-[#4e6487]'}`} />
          <span>Undo</span>
        </button>

        <button
          onClick={onReset}
          aria-label="Reset chamber"
          className="flex-1 flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-xl bg-[#1d3154] border border-[#335080] text-[#edf3fc] hover:bg-[#243c66] shadow-[0_2px_0_#08101e] active:translate-y-[1px] active:shadow-none transition-all text-xs font-bold whitespace-nowrap cursor-pointer"
          title="Restart chamber (R)"
        >
          <RotateCcw className="w-4 h-4 text-[#fb7185]" />
          <span>Reset</span>
        </button>

        <button
          onClick={onHint}
          aria-label="Show solution hint"
          className="flex-1 flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-xl bg-[#d97706] hover:bg-[#b45309] border border-[#f59e0b]/60 text-white shadow-[0_2px_0_#78350f] active:translate-y-[1px] active:shadow-none transition-all text-xs font-bold whitespace-nowrap cursor-pointer tabular-nums"
          title="Show cube push solution (H)"
        >
          <Lightbulb className="w-4 h-4 text-amber-100" />
          <span>Hint ({hintsRemaining})</span>
        </button>
      </div>

      {/* Concise Touch Gesture Tip */}
      <div className="flex items-center gap-1.5 text-[11px] text-[#8ba2c4] font-medium text-center">
        <Hand className="w-3.5 h-3.5 text-[#f59e0b] shrink-0" />
        <span>Swipe to push · Double-tap any tile to walk</span>
      </div>
    </div>
  );
};
