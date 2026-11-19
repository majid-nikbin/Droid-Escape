import React from 'react';
import { ChevronLeft, Volume2, VolumeX, Music, ShoppingBag, Settings, Award, Flame, Lightbulb } from 'lucide-react';
import { SoundSettings } from '../types/game';

interface TopBarProps {
  chapter: number;
  level: number;
  moves: number;
  parMoves: number;
  points: number;
  helps: number;
  soundSettings: SoundSettings;
  isHardcore?: boolean;
  onToggleHardcore?: () => void;
  onBack: () => void;
  onOpenShop: () => void;
  onOpenSettings: () => void;
  onToggleMusic: () => void;
  onToggleSfx: () => void;
}

export const TopBar: React.FC<TopBarProps> = ({
  chapter,
  level,
  moves,
  parMoves,
  points,
  helps,
  soundSettings,
  isHardcore = false,
  onToggleHardcore,
  onBack,
  onOpenShop,
  onOpenSettings,
  onToggleMusic,
  onToggleSfx,
}) => {
  return (
    <header className="w-full max-w-xl mx-auto px-3 sm:px-4 py-2.5 flex items-center justify-between gap-2 border-b border-[#d5cdc0] bg-[#f7f4ec]/95 backdrop-blur-md select-none">
      {/* Zone 1: Back & Chamber Coordinates */}
      <div className="flex items-center gap-2.5 min-w-0">
        <button
          onClick={onBack}
          aria-label="Back to Main Menu"
          className="w-9 h-9 rounded-xl bg-[#eae4d7] border border-[#ccc3b3] text-[#282e37] hover:bg-[#e1d9c9] active:scale-95 transition-all flex items-center justify-center shrink-0 cursor-pointer"
          title="Back to Main Menu"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>

        <div className="flex flex-col leading-tight">
          <div className="flex items-center gap-1.5 text-xs font-bold tracking-tight whitespace-nowrap">
            <span className={isHardcore ? 'text-rose-700' : 'text-[#1f242c]'}>
              Ch {chapter} · Lvl {level}
            </span>
            {isHardcore && (
              <span className="text-[10px] font-extrabold text-rose-700 uppercase">· PRO</span>
            )}
          </div>
          <div className="text-[11px] text-[#665f54] font-mono tabular-nums whitespace-nowrap">
            Moves <span className={moves > parMoves ? 'text-[#b45309] font-bold' : 'text-[#1f242c] font-semibold'}>{moves}</span>/{parMoves}
          </div>
        </div>
      </div>

      {/* Zone 2: Pro Toggle + Points & Hints */}
      <div className="flex items-center gap-1.5 shrink-0">
        {onToggleHardcore && (
          <button
            onClick={onToggleHardcore}
            className={`flex items-center gap-1 px-2.5 py-1.5 rounded-lg border text-xs font-bold transition-all active:scale-95 whitespace-nowrap cursor-pointer ${
              isHardcore
                ? 'bg-rose-50 border-rose-300 text-rose-700'
                : 'bg-[#eae4d7] border-[#ccc3b3] text-[#4e483e] hover:bg-[#e1d9c9]'
            }`}
            title={isHardcore ? 'Pro Mode Active' : 'Switch to Pro Mode'}
          >
            <Flame className={`w-3.5 h-3.5 ${isHardcore ? 'text-rose-600' : 'text-[#7b7365]'}`} />
            <span className="text-[11px] uppercase hidden sm:inline">
              {isHardcore ? 'Pro' : 'Std'}
            </span>
          </button>
        )}

        <button
          onClick={onOpenShop}
          className="flex items-center gap-2 px-2.5 py-1.5 rounded-lg bg-[#eae4d7] border border-[#ccc3b3] hover:bg-[#e1d9c9] active:scale-95 transition-all text-xs font-mono font-bold tabular-nums whitespace-nowrap cursor-pointer"
          title="Points & Hints Shop"
        >
          <span className="flex items-center gap-1 text-[#92400e]">
            <Award className="w-3.5 h-3.5 text-[#d97706]" />
            {points}
          </span>
          <span className="text-[#b8afa0]">/</span>
          <span className="flex items-center gap-1 text-[#0f766e]">
            <Lightbulb className="w-3.5 h-3.5 text-[#0d9488]" />
            {helps}
          </span>
        </button>
      </div>

      {/* Zone 3: Quick Audio & Utility Controls */}
      <div className="flex items-center gap-1 shrink-0">
        <button
          onClick={onToggleMusic}
          aria-label={soundSettings.musicEnabled ? 'Mute Music' : 'Unmute Music'}
          className={`w-8 h-8 rounded-lg border flex items-center justify-center transition-all cursor-pointer ${
            soundSettings.musicEnabled
              ? 'bg-[#e6f4f1] border-[#99d6cb] text-[#0f766e]'
              : 'bg-[#eae4d7] border-[#ccc3b3] text-[#8c8374]'
          }`}
          title="Toggle Ambient Music"
        >
          <Music className="w-4 h-4" />
        </button>

        <button
          onClick={onToggleSfx}
          aria-label={soundSettings.sfxEnabled ? 'Mute SFX' : 'Unmute SFX'}
          className={`w-8 h-8 rounded-lg border flex items-center justify-center transition-all cursor-pointer ${
            soundSettings.sfxEnabled
              ? 'bg-[#e6f4f1] border-[#99d6cb] text-[#0f766e]'
              : 'bg-[#eae4d7] border-[#ccc3b3] text-[#8c8374]'
          }`}
          title="Toggle Sound Effects"
        >
          {soundSettings.sfxEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
        </button>

        <button
          onClick={onOpenShop}
          aria-label="Open Reward Shop"
          className="w-8 h-8 rounded-lg bg-[#eae4d7] border border-[#ccc3b3] text-[#4e483e] hover:text-[#1f242c] flex items-center justify-center active:scale-95 transition-all cursor-pointer"
          title="Shop"
        >
          <ShoppingBag className="w-4 h-4" />
        </button>

        <button
          onClick={onOpenSettings}
          aria-label="Open Settings"
          className="w-8 h-8 rounded-lg bg-[#eae4d7] border border-[#ccc3b3] text-[#4e483e] hover:text-[#1f242c] flex items-center justify-center active:scale-95 transition-all cursor-pointer"
          title="Settings"
        >
          <Settings className="w-4 h-4" />
        </button>
      </div>
    </header>
  );
};
