import React, { useState } from 'react';
import { RotateCcw, Undo2, Lightbulb, Hand, ChevronUp, ChevronDown, ChevronLeft, ChevronRight, Gamepad2 } from 'lucide-react';
import { Direction } from '../types/game';

interface GameActionBarProps {
  onUndo: () => void;
  onReset: () => void;
  onHint: () => void;
  onMove?: (dir: Direction) => void;
  canUndo: boolean;
  hintsRemaining: number;
}

export const DPadControls: React.FC<GameActionBarProps> = ({
  onUndo,
  onReset,
  onHint,
  onMove,
  canUndo,
  hintsRemaining,
}) => {
  const [showVirtualPad, setShowVirtualPad] = useState(true);

  return (
    <div className="w-full max-w-sm mx-auto flex flex-col items-center gap-2 px-3 pb-3 pt-1 select-none">
      {/* Sleek Action Bar: Undo, Reset, Hint, D-Pad Toggle */}
      <div className="w-full flex items-center justify-between gap-2 bg-slate-900/90 border border-slate-800/90 py-1.5 px-3 rounded-2xl shadow-xl backdrop-blur-md">
        {/* Undo Button */}
        <button
          onClick={onUndo}
          disabled={!canUndo}
          aria-label="Undo move"
          className={`flex-1 flex items-center justify-center gap-1.5 py-2 px-2 rounded-xl border text-xs font-semibold transition-all active:scale-95 ${
            canUndo
              ? 'bg-slate-800 border-slate-700 text-slate-200 hover:bg-slate-700 hover:text-white shadow'
              : 'bg-slate-900/50 border-slate-800/60 text-slate-600 cursor-not-allowed'
          }`}
          title="Undo last move (Z)"
        >
          <Undo2 className="w-4 h-4 text-cyan-400" />
          <span>بازگشت</span>
        </button>

        {/* Reset Button */}
        <button
          onClick={onReset}
          aria-label="Reset puzzle"
          className="flex-1 flex items-center justify-center gap-1.5 py-2 px-2 rounded-xl bg-slate-800 border border-slate-700 text-slate-300 hover:text-rose-400 hover:bg-slate-700 active:scale-95 transition-all text-xs font-semibold shadow"
          title="Restart chamber (R)"
        >
          <RotateCcw className="w-4 h-4 text-rose-400" />
          <span>شروع مجدد</span>
        </button>

        {/* Hint / Help Button */}
        <button
          onClick={onHint}
          aria-label="Use hint"
          className="flex-1 flex items-center justify-center gap-1.5 py-2 px-2 rounded-xl bg-amber-500/15 border border-amber-500/40 text-amber-300 hover:bg-amber-500/25 active:scale-95 transition-all text-xs font-bold shadow"
          title="Get a hint (H)"
        >
          <Lightbulb className="w-4 h-4 text-amber-400" />
          <span>راهنما</span>
          <span className="px-1.5 py-0.5 rounded-full bg-amber-400 text-slate-950 text-[10px] font-black font-mono">
            {hintsRemaining}
          </span>
        </button>

        {/* D-Pad Toggle */}
        {onMove && (
          <button
            onClick={() => setShowVirtualPad(prev => !prev)}
            aria-label="Toggle directional pad"
            className={`p-2 rounded-xl border transition-all active:scale-95 ${
              showVirtualPad
                ? 'bg-emerald-500/20 border-emerald-500/40 text-emerald-400'
                : 'bg-slate-800 border-slate-700 text-slate-400'
            }`}
            title="Toggle D-Pad controller"
          >
            <Gamepad2 className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* Tactile Virtual 4-Way D-Pad for Precise Control */}
      {showVirtualPad && onMove && (
        <div className="relative w-40 h-28 flex items-center justify-center my-0.5 animate-fadeIn">
          {/* UP Button */}
          <button
            onClick={() => onMove('UP')}
            aria-label="Move Up"
            className="absolute top-0 w-12 h-10 rounded-xl bg-gradient-to-b from-slate-800 to-slate-900 border border-slate-700/80 shadow-[0_3px_0_#0f172a] text-slate-200 active:translate-y-0.5 active:shadow-none flex items-center justify-center transition-all hover:bg-slate-750"
          >
            <ChevronUp className="w-6 h-6 text-emerald-400" />
          </button>

          {/* DOWN Button */}
          <button
            onClick={() => onMove('DOWN')}
            aria-label="Move Down"
            className="absolute bottom-0 w-12 h-10 rounded-xl bg-gradient-to-b from-slate-800 to-slate-900 border border-slate-700/80 shadow-[0_3px_0_#0f172a] text-slate-200 active:translate-y-0.5 active:shadow-none flex items-center justify-center transition-all hover:bg-slate-750"
          >
            <ChevronDown className="w-6 h-6 text-emerald-400" />
          </button>

          {/* LEFT Button */}
          <button
            onClick={() => onMove('LEFT')}
            aria-label="Move Left"
            className="absolute left-1 w-12 h-10 rounded-xl bg-gradient-to-b from-slate-800 to-slate-900 border border-slate-700/80 shadow-[0_3px_0_#0f172a] text-slate-200 active:translate-y-0.5 active:shadow-none flex items-center justify-center transition-all hover:bg-slate-750"
          >
            <ChevronLeft className="w-6 h-6 text-emerald-400" />
          </button>

          {/* RIGHT Button */}
          <button
            onClick={() => onMove('RIGHT')}
            aria-label="Move Right"
            className="absolute right-1 w-12 h-10 rounded-xl bg-gradient-to-b from-slate-800 to-slate-900 border border-slate-700/80 shadow-[0_3px_0_#0f172a] text-slate-200 active:translate-y-0.5 active:shadow-none flex items-center justify-center transition-all hover:bg-slate-750"
          >
            <ChevronRight className="w-6 h-6 text-emerald-400" />
          </button>

          {/* Center Hub Indicator */}
          <div className="w-6 h-6 rounded-full bg-slate-950/80 border border-slate-800 flex items-center justify-center pointer-events-none">
            <div className="w-2 h-2 rounded-full bg-emerald-500/50" />
          </div>
        </div>
      )}

      {/* Touch & gesture instruction */}
      <div className="flex items-center gap-1.5 text-[11px] text-slate-400/90 font-medium">
        <Hand className="w-3.5 h-3.5 text-emerald-400" />
        <span>قابلیت سوایپ روی صفحه، لمس خانه‌ها، یا استفاده از کلیدهای جهت‌نما</span>
      </div>
    </div>
  );
};
