import React from 'react';
import { Play, Grid, ShoppingBag, Settings, Award, Sparkles, BookOpen, Info } from 'lucide-react';
import { AndroidMascot } from './AndroidMascot';
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
    <div className="w-full max-w-md mx-auto flex flex-col items-center justify-between min-h-screen px-4 py-8 select-none">
      {/* Top Header Information */}
      <div className="w-full flex items-center justify-between text-xs text-slate-600">
        <div className="flex items-center gap-1.5 font-bold text-emerald-700">
          <Sparkles className="w-4 h-4 text-emerald-600" />
          <span>20 CHAPTERS · 2,000 LEVELS</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1 text-amber-800 font-mono font-bold bg-amber-50 px-2 py-0.5 rounded-lg border border-amber-200">
            <Award className="w-3.5 h-3.5 text-amber-600" />
            <span>{progress.points} pts</span>
          </div>
          <span className="text-slate-300">·</span>
          <div className="text-emerald-800 font-mono font-bold bg-emerald-50 px-2 py-0.5 rounded-lg border border-emerald-200">
            💡 <span>{progress.helpsRemaining}</span>
          </div>
        </div>
      </div>

      {/* Hero Logo Emblem & Title Section */}
      <div className="flex flex-col items-center my-5 text-center">
        {/* Geometric Isometric Hollow Cube Emblem (from uploaded image) */}
        <div className="relative w-28 h-28 mb-3 flex items-center justify-center">
          <div className="absolute inset-0 bg-amber-500/10 rounded-full blur-xl" />
          <div className="w-24 h-24 p-2 bg-white rounded-3xl border border-slate-200/90 shadow-md flex items-center justify-center">
            <svg viewBox="0 0 100 100" className="w-20 h-20 drop-shadow-sm">
              <polygon points="36,49 50,57 50,73 36,65" fill="#f57c00" />
              <polygon points="50,57 64,49 64,65 50,73" fill="#e65100" />
              <polygon points="50,41 64,49 50,57 36,49" fill="#ffb300" />
              <polygon points="64,36 64,49 50,57 50,44" fill="#50555e" />
              <polygon points="36,36 50,44 50,57 36,49" fill="#383c44" />
              <path d="M 50 12 L 88 34 L 50 54 L 12 34 Z M 50 21 L 36 36 L 50 44 L 64 36 Z" fill="#767c87" fillRule="evenodd" />
              <path d="M 12 34 L 50 54 L 50 92 L 12 72 Z M 21 45 L 41 57 L 41 78 L 21 66 Z" fill="#50555e" fillRule="evenodd" />
              <path d="M 50 54 L 88 34 L 88 72 L 50 92 Z M 59 57 L 79 45 L 79 66 L 59 78 Z" fill="#282a30" fillRule="evenodd" />
            </svg>
          </div>
        </div>

        <h1 className="text-3xl font-extrabold tracking-tight text-slate-900 mb-1.5">
          DROID ESCAPE
        </h1>
        <p className="text-sm text-slate-600 max-w-xs leading-relaxed font-medium">
          Slide and push cubic cores onto target docks to unlock the exit gate across 2,000 puzzle chambers.
        </p>
      </div>


      {/* Main Action Buttons */}
      <div className="w-full flex flex-col gap-3 my-2">
        {/* Continue Button */}
        <button
          onClick={onContinue}
          className="w-full py-4 px-6 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-white font-extrabold text-base shadow-md shadow-emerald-500/20 active:scale-[0.98] transition-all flex items-center justify-between group cursor-pointer"
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center">
              <Play className="w-5 h-5 fill-current" />
            </div>
            <div className="flex flex-col text-left">
              <span className="text-xs uppercase tracking-wider font-extrabold opacity-80">
                Resume Chamber
              </span>
              <span className="text-sm font-black text-white">
                Chapter {progress.currentChapter} · Level {progress.currentLevel}
              </span>
            </div>
          </div>
          <span className="text-xs font-bold px-2.5 py-1 rounded-lg bg-white/20 text-white group-hover:translate-x-1 transition-transform">
            PLAY →
          </span>
        </button>

        {/* Chapters & Levels Grid */}
        <button
          onClick={onOpenChapters}
          className="w-full py-3.5 px-5 rounded-2xl bg-white border border-slate-200 hover:border-slate-300 hover:bg-slate-50 active:scale-[0.98] transition-all flex items-center justify-between text-slate-800 shadow-xs cursor-pointer"
        >
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-sky-50 border border-sky-200 flex items-center justify-center text-sky-700">
              <Grid className="w-5 h-5" />
            </div>
            <div className="flex flex-col text-left">
              <span className="text-sm font-bold text-slate-900">Select Chapter & Level</span>
              <span className="text-xs text-slate-500">
                {completedTotal} / 2,000 Levels Completed
              </span>
            </div>
          </div>
          <BookOpen className="w-4 h-4 text-slate-400" />
        </button>

        {/* Shop Button */}
        <button
          onClick={onOpenShop}
          className="w-full py-3.5 px-5 rounded-2xl bg-white border border-slate-200 hover:border-slate-300 hover:bg-slate-50 active:scale-[0.98] transition-all flex items-center justify-between text-slate-800 shadow-xs cursor-pointer"
        >
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-amber-50 border border-amber-200 flex items-center justify-center text-amber-700">
              <ShoppingBag className="w-5 h-5" />
            </div>
            <div className="flex flex-col text-left">
              <span className="text-sm font-bold text-slate-900">Hint & Reward Shop</span>
              <span className="text-xs text-slate-500">
                Exchange 10 Points for 1 Help
              </span>
            </div>
          </div>
          <div className="px-2.5 py-1 rounded-md bg-amber-50 border border-amber-200 text-amber-800 text-xs font-mono font-bold">
            {progress.points} PTS
          </div>
        </button>

        {/* Settings Button */}
        <button
          onClick={onOpenSettings}
          className="w-full py-3 px-5 rounded-2xl bg-white/70 border border-slate-200 hover:bg-white active:scale-[0.98] transition-all flex items-center justify-between text-slate-700 text-sm font-medium shadow-xs cursor-pointer"
        >
          <div className="flex items-center gap-2.5">
            <Settings className="w-4 h-4 text-slate-500" />
            <span>Audio & Controls</span>
          </div>
          <span className="text-xs text-slate-400">Configure</span>
        </button>
      </div>

      {/* Footer Info & Developer Link */}
      <footer className="w-full flex items-center justify-between text-[11px] text-slate-500 pt-4 border-t border-slate-200">
        <span>Droid Escape v1.0.6</span>
        <button
          onClick={onOpenAbout}
          className="hover:text-slate-800 transition-colors flex items-center gap-1 font-medium cursor-pointer"
        >
          <Info className="w-3.5 h-3.5" />
          <span>About Game</span>
        </button>
      </footer>
    </div>
  );
};
