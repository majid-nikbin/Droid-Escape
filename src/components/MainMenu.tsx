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
      {/* Top Header Badge */}
      <div className="w-full flex items-center justify-between text-xs text-slate-400">
        <div className="flex items-center gap-1.5 font-medium text-emerald-400">
          <Sparkles className="w-3.5 h-3.5" />
          <span>20 CHAPTERS · 2,000 LEVELS</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1 text-amber-400 font-mono">
            <Award className="w-3.5 h-3.5" />
            <span className="font-bold">{progress.points}</span> pts
          </div>
          <span className="text-slate-600">·</span>
          <div className="text-emerald-400 font-mono">
            💡 <span className="font-bold">{progress.helpsRemaining}</span>
          </div>
        </div>
      </div>

      {/* Hero Mascot & Title Section */}
      <div className="flex flex-col items-center my-6 text-center">
        {/* Animated Android Droid Mascot Frame */}
        <div className="relative w-36 h-36 mb-4 flex items-center justify-center">
          <div className="absolute inset-0 bg-emerald-500/10 rounded-full blur-xl animate-pulse" />
          <AndroidMascot direction="DOWN" isMoving={false} />
        </div>

        <h1 className="text-3xl font-extrabold tracking-tight text-white mb-1.5">
          DROID ESCAPE
        </h1>
        <p className="text-sm text-slate-400 max-w-xs leading-relaxed">
          Move the cubic blocks out of your path to guide the Android droid to the exit chamber.
        </p>
      </div>

      {/* Main Action Buttons */}
      <div className="w-full flex flex-col gap-3 my-2">
        {/* Continue Button */}
        <button
          onClick={onContinue}
          className="w-full py-4 px-6 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-slate-950 font-bold text-base shadow-lg shadow-emerald-500/25 active:scale-[0.98] transition-all flex items-center justify-between group"
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-slate-950/20 flex items-center justify-center">
              <Play className="w-5 h-5 fill-current" />
            </div>
            <div className="flex flex-col text-left">
              <span className="text-xs uppercase tracking-wider font-extrabold opacity-75">
                Resume Chamber
              </span>
              <span className="text-sm font-black text-slate-950">
                Chapter {progress.currentChapter} · Level {progress.currentLevel}
              </span>
            </div>
          </div>
          <span className="text-xs font-semibold px-2.5 py-1 rounded-lg bg-slate-950/20 text-slate-900 group-hover:translate-x-1 transition-transform">
            PLAY →
          </span>
        </button>

        {/* Chapters & Levels Grid */}
        <button
          onClick={onOpenChapters}
          className="w-full py-3.5 px-5 rounded-2xl bg-slate-900/90 border border-slate-800 hover:border-slate-700 hover:bg-slate-800/80 active:scale-[0.98] transition-all flex items-center justify-between text-slate-200"
        >
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center text-cyan-400">
              <Grid className="w-5 h-5" />
            </div>
            <div className="flex flex-col text-left">
              <span className="text-sm font-semibold text-white">Select Chapter & Level</span>
              <span className="text-xs text-slate-400">
                {completedTotal} / 2,000 Levels Completed
              </span>
            </div>
          </div>
          <BookOpen className="w-4 h-4 text-slate-500" />
        </button>

        {/* Shop Button */}
        <button
          onClick={onOpenShop}
          className="w-full py-3.5 px-5 rounded-2xl bg-slate-900/90 border border-slate-800 hover:border-slate-700 hover:bg-slate-800/80 active:scale-[0.98] transition-all flex items-center justify-between text-slate-200"
        >
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400">
              <ShoppingBag className="w-5 h-5" />
            </div>
            <div className="flex flex-col text-left">
              <span className="text-sm font-semibold text-white">Hint Shop</span>
              <span className="text-xs text-slate-400">
                Exchange 10 Points for 1 Help
              </span>
            </div>
          </div>
          <div className="px-2.5 py-1 rounded-md bg-amber-500/10 text-amber-300 text-xs font-mono font-bold">
            {progress.points} PTS
          </div>
        </button>

        {/* Settings Button */}
        <button
          onClick={onOpenSettings}
          className="w-full py-3 px-5 rounded-2xl bg-slate-900/60 border border-slate-800/80 hover:bg-slate-800/60 active:scale-[0.98] transition-all flex items-center justify-between text-slate-300 text-sm font-medium"
        >
          <div className="flex items-center gap-3">
            <Settings className="w-4 h-4 text-slate-400" />
            <span>Audio & Gameplay Settings</span>
          </div>
          <span className="text-xs text-slate-500">Config</span>
        </button>
      </div>

      {/* About Button (Replaces bottom card as requested) */}
      <button
        onClick={onOpenAbout}
        className="w-full mt-4 p-3.5 rounded-2xl bg-slate-900/60 border border-slate-800/90 hover:border-slate-700 hover:bg-slate-800/60 active:scale-[0.98] transition-all flex items-center justify-between text-xs text-slate-300 shadow-lg"
      >
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
            <Info className="w-4 h-4" />
          </div>
          <div className="flex flex-col text-left">
            <span className="text-xs font-bold text-white">About Droid Escape</span>
            <span className="text-[11px] text-slate-400">Developer: M-Tech · v1.0.2</span>
          </div>
        </div>
        <span className="text-[11px] font-semibold text-emerald-400 px-2.5 py-1 rounded-lg bg-emerald-500/10 border border-emerald-500/20 hover:bg-emerald-500/20 transition-colors">
          About →
        </span>
      </button>
    </div>
  );
};
