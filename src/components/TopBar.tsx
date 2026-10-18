import React from 'react';
import { ChevronLeft, Volume2, VolumeX, Music, ShoppingBag, Settings, Award, Flame } from 'lucide-react';
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
    <header className="w-full max-w-xl mx-auto px-4 py-2.5 flex items-center justify-between border-b border-slate-200 bg-white/90 backdrop-blur-md select-none shadow-sm rounded-b-2xl">
      {/* Zone 1: Back Navigation & Level Title */}
      <div className="flex items-center gap-2.5">
        <button
          onClick={onBack}
          aria-label="Previous Level / Back"
          className="p-1.5 rounded-xl bg-slate-100 border border-slate-200 text-slate-700 hover:text-slate-900 hover:bg-slate-200 active:scale-95 transition-all flex items-center justify-center shadow-xs"
          title="Previous Level (Go back one chamber)"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>

        <div className="flex flex-col">
          <div className="flex items-center gap-1.5 text-xs font-bold tracking-wide">
            <span className={isHardcore ? 'text-rose-600' : 'text-emerald-700'}>CH {chapter}</span>
            <span className="text-slate-400">/</span>
            <span className={isHardcore ? 'text-rose-600' : 'text-emerald-700'}>LVL {level}</span>
            {isHardcore && (
              <span className="text-[9px] px-1.5 py-0.2 rounded bg-rose-100 text-rose-700 border border-rose-300 font-extrabold uppercase tracking-wider">
                PRO
              </span>
            )}
          </div>
          <div className="text-[11px] text-slate-500 font-mono tabular-nums">
            Moves: <span className={moves > parMoves ? 'text-amber-600 font-bold' : 'text-slate-800 font-semibold'}>{moves}</span> / {parMoves}
          </div>
        </div>
      </div>

      {/* Zone 2: Mode Toggle & Player Stats */}
      <div className="flex items-center gap-2">
        {onToggleHardcore && (
          <button
            onClick={onToggleHardcore}
            className={`flex items-center gap-1 px-2.5 py-1 rounded-xl border text-xs font-bold transition-all active:scale-95 ${
              isHardcore
                ? 'bg-rose-50 border-rose-300 text-rose-700 shadow-xs'
                : 'bg-slate-100 border-slate-200 text-slate-600 hover:text-slate-900'
            }`}
            title={isHardcore ? 'Pro Mode Active (Tap for Normal)' : 'Activate Pro Mode (Ultra Hard)'}
          >
            <Flame className={`w-3.5 h-3.5 ${isHardcore ? 'text-rose-600 animate-pulse' : 'text-slate-400'}`} />
            <span className="text-[10px] tracking-wider uppercase hidden sm:inline">
              {isHardcore ? 'PRO' : 'NORMAL'}
            </span>
          </button>
        )}

        {/* Points Counter */}
        <button
          onClick={onOpenShop}
          className="flex items-center gap-1 px-2.5 py-1 rounded-xl bg-amber-50 border border-amber-200 text-amber-800 hover:bg-amber-100 active:scale-95 transition-all text-xs font-semibold shadow-xs"
          title="Points (1 per level · 10 pts = 1 hint in shop)"
        >
          <Award className="w-3.5 h-3.5 text-amber-600" />
          <span className="font-mono tabular-nums font-bold">{points}</span>
        </button>

        {/* Hints Counter */}
        <button
          onClick={onOpenShop}
          className="flex items-center gap-1 px-2.5 py-1 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 hover:bg-emerald-100 active:scale-95 transition-all text-xs font-semibold shadow-xs"
          title="Hints remaining (3 available to test/solve chambers)"
        >
          <span className="text-[11px]">💡</span>
          <span className="font-mono tabular-nums font-bold">{helps}</span>
        </button>
      </div>

      {/* Zone 3: Quick Action Controls */}
      <div className="flex items-center gap-1.5">
        <button
          onClick={onToggleMusic}
          aria-label={soundSettings.musicEnabled ? 'Mute Music' : 'Unmute Music'}
          className={`p-1.5 rounded-xl border transition-all ${
            soundSettings.musicEnabled
              ? 'bg-teal-50 border-teal-200 text-teal-700 shadow-xs'
              : 'bg-slate-100 border-slate-200 text-slate-400'
          }`}
          title="Toggle Ambient Music"
        >
          <Music className="w-4 h-4" />
        </button>

        <button
          onClick={onToggleSfx}
          aria-label={soundSettings.sfxEnabled ? 'Mute SFX' : 'Unmute SFX'}
          className={`p-1.5 rounded-xl border transition-all ${
            soundSettings.sfxEnabled
              ? 'bg-emerald-50 border-emerald-200 text-emerald-700 shadow-xs'
              : 'bg-slate-100 border-slate-200 text-slate-400'
          }`}
          title="Toggle Sound Effects (Authentic Box Knocks)"
        >
          {soundSettings.sfxEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
        </button>

        <button
          onClick={onOpenShop}
          aria-label="Open Reward Shop"
          className="p-1.5 rounded-xl bg-slate-100 border border-slate-200 text-slate-600 hover:text-slate-900 active:scale-95 transition-all"
          title="Shop (Exchange Points for Helps)"
        >
          <ShoppingBag className="w-4 h-4" />
        </button>

        <button
          onClick={onOpenSettings}
          aria-label="Open Settings"
          className="p-1.5 rounded-xl bg-slate-100 border border-slate-200 text-slate-600 hover:text-slate-900 active:scale-95 transition-all"
          title="Settings"
        >
          <Settings className="w-4 h-4" />
        </button>
      </div>
    </header>
  );
};
