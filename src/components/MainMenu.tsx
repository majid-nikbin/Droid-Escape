import React from 'react';
import { Play, Grid, ShoppingBag, Settings, Info, ChevronRight } from 'lucide-react';
import { UserProgress } from '../types/game';

interface MainMenuProps {
  progress: UserProgress;
  onContinue: () => void;
  onOpenChapters: () => void;
  onOpenShop: () => void;
  onOpenSettings: () => void;
  onOpenAbout: () => void;
  onStartNewGame: () => void;
}

export const MainMenu: React.FC<MainMenuProps> = ({
  progress,
  onContinue,
  onOpenChapters,
  onOpenShop,
  onOpenSettings,
  onOpenAbout,
}) => {
  const completedTotal = Object.keys(progress.levelsCompleted).length;

  return (
    <div className="w-full max-w-md mx-auto flex flex-col items-center justify-between min-h-screen px-5 py-7 select-none">
      {/* Quiet Top Metadata Strip (Zero Pill Clutter) */}
      <div className="w-full flex items-center justify-between text-xs text-[#615a4e] font-medium">
        <span className="tracking-wide font-semibold text-[#3f3a32]">
          20 Chapters · 2,000 Chambers
        </span>
        <div className="flex items-center gap-2 font-mono tabular-nums text-[#3f3a32]">
          <span>{progress.points} pts</span>
          <span aria-hidden="true" className="text-[#c0b7a7]">·</span>
          <span className="text-[#0f766e] font-bold">{progress.helpsRemaining} hints</span>
        </div>
      </div>

      {/* Hero Cube Plinth & Title */}
      <div className="flex flex-col items-center my-6 text-center">
        <div className="relative w-28 h-28 mb-4 rounded-[28px] bg-[#2a303a] border border-[#434c5c] shadow-[0_18px_36px_rgba(31,36,44,0.18),inset_0_1px_0_rgba(255,255,255,0.14)] flex items-center justify-center">
          <svg viewBox="0 0 100 100" className="w-20 h-20 drop-shadow-md">
            <polygon points="36,49 50,57 50,73 36,65" fill="#ea580c" />
            <polygon points="50,57 64,49 64,65 50,73" fill="#c2410c" />
            <polygon points="50,41 64,49 50,57 36,49" fill="#fbbf24" />
            <polygon points="64,36 64,49 50,57 50,44" fill="#4b515b" />
            <polygon points="36,36 50,44 50,57 36,49" fill="#353a42" />
            <path d="M 50 12 L 88 34 L 50 54 L 12 34 Z M 50 21 L 36 36 L 50 44 L 64 36 Z" fill="#828995" fillRule="evenodd" />
            <path d="M 12 34 L 50 54 L 50 92 L 12 72 Z M 21 45 L 41 57 L 41 78 L 21 66 Z" fill="#4e545e" fillRule="evenodd" />
            <path d="M 50 54 L 88 34 L 88 72 L 50 92 Z M 59 57 L 79 45 L 79 66 L 59 78 Z" fill="#272b33" fillRule="evenodd" />
          </svg>
        </div>

        <h1 className="text-3xl font-extrabold tracking-tight text-[#1f242c] mb-2">
          Droid Escape
        </h1>
        <p className="text-sm text-[#5c5549] max-w-xs leading-relaxed">
          Slide isometric energy cores onto brass docking pads to unseal every chamber vault.
        </p>
      </div>

      {/* Action Surface */}
      <div className="w-full flex flex-col gap-3 my-2">
        {/* Focal Primary CTA */}
        <button
          onClick={onContinue}
          className="w-full py-4 px-5 rounded-2xl bg-[#272d37] hover:bg-[#1f242c] text-[#f9f6ef] shadow-[0_6px_0_#14181f,0_12px_24px_rgba(31,36,44,0.18)] active:translate-y-[2px] active:shadow-[0_3px_0_#14181f] transition-all flex items-center justify-between group cursor-pointer"
        >
          <div className="flex items-center gap-3.5">
            <div className="w-11 h-11 rounded-xl bg-[#d97706] text-white flex items-center justify-center shadow-inner">
              <Play className="w-5 h-5 fill-current ml-0.5" />
            </div>
            <div className="flex flex-col text-left">
              <span className="text-[11px] uppercase tracking-wider font-bold text-[#fbbf24]">
                Continue Puzzle
              </span>
              <span className="text-base font-bold text-white tabular-nums">
                Chapter {progress.currentChapter} · Level {progress.currentLevel}
              </span>
            </div>
          </div>
          <span className="text-xs font-bold px-3 py-1.5 rounded-lg bg-white/10 text-white group-hover:translate-x-0.5 transition-transform whitespace-nowrap">
            Play →
          </span>
        </button>

        {/* Secondary Stone Panel Rows */}
        <div className="w-full rounded-2xl bg-[#f7f4ed] border border-[#d5cdc0] divide-y divide-[#e4ddd0] shadow-xs overflow-hidden mt-1">
          <button
            onClick={onOpenChapters}
            className="w-full py-3.5 px-4 hover:bg-[#fcfaf5] transition-colors flex items-center justify-between text-left cursor-pointer"
          >
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-[#eae4d7] border border-[#d4cbb9] flex items-center justify-center text-[#0f766e]">
                <Grid className="w-4 h-4" />
              </div>
              <div className="flex flex-col">
                <span className="text-sm font-bold text-[#1f242c]">Chapters & Levels</span>
                <span className="text-xs text-[#665f54] tabular-nums">
                  {completedTotal} / 2,000 Completed
                </span>
              </div>
            </div>
            <ChevronRight className="w-4 h-4 text-[#8c8374]" />
          </button>

          <button
            onClick={onOpenShop}
            className="w-full py-3.5 px-4 hover:bg-[#fcfaf5] transition-colors flex items-center justify-between text-left cursor-pointer"
          >
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-[#fef3c7] border border-[#f59e0b]/40 flex items-center justify-center text-[#b45309]">
                <ShoppingBag className="w-4 h-4" />
              </div>
              <div className="flex flex-col">
                <span className="text-sm font-bold text-[#1f242c]">Hint Shop</span>
                <span className="text-xs text-[#665f54]">
                  Redeem 10 points for 1 chamber hint
                </span>
              </div>
            </div>
            <span className="text-xs font-mono font-bold text-[#92400e] tabular-nums">
              {progress.points} pts
            </span>
          </button>

          <button
            onClick={onOpenSettings}
            className="w-full py-3.5 px-4 hover:bg-[#fcfaf5] transition-colors flex items-center justify-between text-left cursor-pointer"
          >
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-[#eae4d7] border border-[#d4cbb9] flex items-center justify-center text-[#4e483e]">
                <Settings className="w-4 h-4" />
              </div>
              <div className="flex flex-col">
                <span className="text-sm font-bold text-[#1f242c]">Audio & Settings</span>
                <span className="text-xs text-[#665f54]">Sound effects, music & haptics</span>
              </div>
            </div>
            <ChevronRight className="w-4 h-4 text-[#8c8374]" />
          </button>
        </div>
      </div>

      {/* Quiet Footer */}
      <footer className="w-full flex items-center justify-between text-xs text-[#665f54] pt-4 border-t border-[#d5cdc0]">
        <span className="font-mono">v1.0.6</span>
        <button
          onClick={onOpenAbout}
          className="hover:text-[#1f242c] transition-colors flex items-center gap-1.5 font-semibold cursor-pointer"
        >
          <Info className="w-3.5 h-3.5" />
          <span>About</span>
        </button>
      </footer>
    </div>
  );
};
