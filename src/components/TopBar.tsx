import React from 'react';
import { ChevronLeft, Volume2, VolumeX, Music, ShoppingBag, Settings, Award } from 'lucide-react';
import { SoundSettings } from '../types/game';

interface TopBarProps {
  chapter: number;
  level: number;
  moves: number;
  parMoves: number;
  points: number;
  helps: number;
  soundSettings: SoundSettings;
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
  onBack,
  onOpenShop,
  onOpenSettings,
  onToggleMusic,
  onToggleSfx,
}) => {
  return (
    <header className="w-full max-w-xl mx-auto px-4 py-2.5 flex items-center justify-between border-b border-slate-800/80 bg-slate-950/80 backdrop-blur select-none">
      {/* Zone 1: Back Navigation & Level Title */}
      <div className="flex items-center gap-2">
        <button
          onClick={onBack}
          aria-label="Previous Level / Back"
          className="p-1.5 rounded-lg bg-slate-900 border border-slate-800 text-slate-300 hover:text-white hover:bg-slate-800 active:scale-95 transition-all flex items-center justify-center"
          title="Previous Level (Go back one chamber)"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>

        <div className="flex flex-col">
          <div className="flex items-center gap-1.5 text-xs text-emerald-400 font-semibold tracking-wide">
            <span>CH {chapter}</span>
            <span className="text-slate-600">/</span>
            <span>LVL {level}</span>
          </div>
          <div className="text-[11px] text-slate-400 font-mono tabular-nums">
            Moves: <span className={moves > parMoves ? 'text-amber-400' : 'text-slate-200'}>{moves}</span> / {parMoves}
          </div>
        </div>
      </div>

      {/* Zone 2: Player Stats (Points & Helps) */}
      <div className="flex items-center gap-3">
        {/* Points Counter */}
        <button
          onClick={onOpenShop}
          className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-amber-500/10 border border-amber-500/20 text-amber-300 hover:bg-amber-500/20 active:scale-95 transition-all text-xs font-medium"
          title="Points (1 per level · 10 pts = 1 hint in shop)"
        >
          <Award className="w-3.5 h-3.5 text-amber-400" />
          <span className="font-mono tabular-nums font-bold">{points}</span>
          <span className="text-[10px] text-amber-400/80 hidden sm:inline">PTS</span>
        </button>

        {/* Hints Counter */}
        <button
          onClick={onOpenShop}
          className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-300 hover:bg-emerald-500/20 active:scale-95 transition-all text-xs font-medium"
          title="Hints remaining"
        >
          <span className="text-[11px]">💡</span>
          <span className="font-mono tabular-nums font-bold">{helps}</span>
          <span className="text-[10px] text-emerald-400/80 hidden sm:inline">HELPS</span>
        </button>
      </div>

      {/* Zone 3: Quick Action Controls */}
      <div className="flex items-center gap-1.5">
        <button
          onClick={onToggleMusic}
          aria-label={soundSettings.musicEnabled ? 'Mute Music' : 'Unmute Music'}
          className={`p-1.5 rounded-lg border transition-all ${
            soundSettings.musicEnabled
              ? 'bg-slate-900 border-slate-700 text-teal-400'
              : 'bg-slate-950 border-slate-800 text-slate-600'
          }`}
          title="Toggle Ambient Music"
        >
          <Music className="w-4 h-4" />
        </button>

        <button
          onClick={onToggleSfx}
          aria-label={soundSettings.sfxEnabled ? 'Mute Sound Effects' : 'Unmute Sound Effects'}
          className={`p-1.5 rounded-lg border transition-all ${
            soundSettings.sfxEnabled
              ? 'bg-slate-900 border-slate-700 text-emerald-400'
              : 'bg-slate-950 border-slate-800 text-slate-600'
          }`}
          title="Toggle Knock & Sound FX"
        >
          {soundSettings.sfxEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
        </button>

        <button
          onClick={onOpenShop}
          aria-label="Open Shop"
          className="p-1.5 rounded-lg bg-slate-900 border border-slate-800 text-slate-300 hover:text-amber-400 hover:bg-slate-800 transition-all"
          title="Hint Shop"
        >
          <ShoppingBag className="w-4 h-4" />
        </button>

        <button
          onClick={onOpenSettings}
          aria-label="Open Settings"
          className="p-1.5 rounded-lg bg-slate-900 border border-slate-800 text-slate-300 hover:text-white hover:bg-slate-800 transition-all"
          title="Game Settings"
        >
          <Settings className="w-4 h-4" />
        </button>
      </div>
    </header>
  );
};
