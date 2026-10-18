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

      {/* Hero Mascot & Title Section */}
      <div className="flex flex-col items-center my-6 text-center">
        {/* Animated Android Droid Mascot Frame */}
        <div className="relative w-36 h-36 mb-4 flex items-center justify-center">
          <div className="absolute inset-0 bg-emerald-100/60 rounded-full blur-xl animate-pulse" />
          <AndroidMascot direction="DOWN" isMoving={false} />
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
