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
      {/* Quiet Top Metadata Strip */}
      <div className="w-full flex items-center justify-between text-xs text-[#93a8c7] font-medium">
        <span className="tracking-wide font-semibold text-[#c9d7ee]">
          20 Chapters · 2,000 Chambers
        </span>
        <div className="flex items-center gap-2 font-mono tabular-nums text-[#c9d7ee]">
          <span className="text-[#fcd34d]">{progress.points} pts</span>
          <span aria-hidden="true" className="text-[#354f7a]">·</span>
          <span className="text-[#2dd4bf] font-bold">{progress.helpsRemaining} hints</span>
        </div>
      </div>

      {/* Hero Cube Plinth & Title */}
      <div className="flex flex-col items-center my-6 text-center">
        <div className="relative w-28 h-28 mb-4 rounded-[28px] bg-[#14243e] border border-[#2d4875] shadow-[0_20px_44px_rgba(4,9,20,0.65),inset_0_1px_0_rgba(148,180,235,0.18)] flex items-center justify-center">
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

        <h1 className="text-3xl font-extrabold tracking-tight text-[#edf3fc] mb-2">
          Droid Escape
        </h1>
        <p className="text-sm text-[#9bb0cf] max-w-xs leading-relaxed">
          Slide isometric energy cores onto docking pads to unseal every chamber vault.
        </p>
      </div>

      {/* Action Surface */}
      <div className="w-full flex flex-col gap-3 my-2">
        {/* Focal Primary CTA */}
        <button
          onClick={onContinue}
          className="w-full py-4 px-5 rounded-2xl bg-[#1a2f52] hover:bg-[#213a63] border border-[#345487] text-[#edf3fc] shadow-[0_6px_0_#08101f,0_14px_28px_rgba(4,9,20,0.45)] active:translate-y-[2px] active:shadow-[0_3px_0_#08101f] transition-all flex items-center justify-between group cursor-pointer"
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
          <span className="text-xs font-bold px-3 py-1.5 rounded-lg bg-[#274372] border border-[#3c609c] text-[#edf3fc] group-hover:translate-x-0.5 transition-transform whitespace-nowrap">
            Play →
          </span>
        </button>

        {/* Secondary Deep-Blue Panel Rows */}
        <div className="w-full rounded-2xl bg-[#14233c] border border-[#263c61] divide-y divide-[#1f3354] shadow-lg overflow-hidden mt-1">
          <button
            onClick={onOpenChapters}
            className="w-full py-3.5 px-4 hover:bg-[#192b4a] transition-colors flex items-center justify-between text-left cursor-pointer"
          >
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-[#0e393a] border border-[#14b8a6]/45 flex items-center justify-center text-[#2dd4bf]">
                <Grid className="w-4 h-4" />
              </div>
              <div className="flex flex-col">
                <span className="text-sm font-bold text-[#edf3fc]">Chapters & Levels</span>
                <span className="text-xs text-[#90a7c7] tabular-nums">
                  {completedTotal} / 2,000 Completed
                </span>
              </div>
            </div>
            <ChevronRight className="w-4 h-4 text-[#6d83a6]" />
          </button>

          <button
            onClick={onOpenShop}
            className="w-full py-3.5 px-4 hover:bg-[#192b4a] transition-colors flex items-center justify-between text-left cursor-pointer"
          >
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-[#38230a] border border-[#d97706]/50 flex items-center justify-center text-[#fbbf24]">
                <ShoppingBag className="w-4 h-4" />
              </div>
              <div className="flex flex-col">
                <span className="text-sm font-bold text-[#edf3fc]">Hint Shop</span>
                <span className="text-xs text-[#90a7c7]">
                  Redeem 10 points for 1 chamber hint
                </span>
              </div>
            </div>
            <span className="text-xs font-mono font-bold text-[#fcd34d] tabular-nums">
              {progress.points} pts
            </span>
          </button>

          <button
            onClick={onOpenSettings}
            className="w-full py-3.5 px-4 hover:bg-[#192b4a] transition-colors flex items-center justify-between text-left cursor-pointer"
          >
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-[#1b2f50] border border-[#2f4b78] flex items-center justify-center text-[#b4c6e0]">
                <Settings className="w-4 h-4" />
              </div>
              <div className="flex flex-col">
                <span className="text-sm font-bold text-[#edf3fc]">Audio & Settings</span>
                <span className="text-xs text-[#90a7c7]">Sound effects, music & haptics</span>
              </div>
            </div>
            <ChevronRight className="w-4 h-4 text-[#6d83a6]" />
          </button>
        </div>
      </div>

      {/* Quiet Footer */}
      <footer className="w-full flex items-center justify-between text-xs text-[#8ba2c4] pt-4 border-t border-[#1e3252]">
        <span className="font-mono">v1.0.6</span>
        <button
          onClick={onOpenAbout}
          className="hover:text-[#edf3fc] transition-colors flex items-center gap-1.5 font-semibold cursor-pointer"
        >
          <Info className="w-3.5 h-3.5" />
          <span>About</span>
        </button>
      </footer>
    </div>
  );
};
