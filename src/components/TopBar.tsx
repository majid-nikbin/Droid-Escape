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
    <header className="w-full max-w-xl mx-auto px-3 sm:px-4 py-2.5 flex items-center justify-between gap-2 border-b border-[#253b60] bg-[#122038]/95 backdrop-blur-md select-none">
      {/* Zone 1: Back & Chamber Coordinates */}
      <div className="flex items-center gap-2.5 min-w-0">
        <button
          onClick={onBack}
          aria-label="Back to Main Menu"
          className="w-9 h-9 rounded-xl bg-[#1b2f50] border border-[#2f4b78] text-[#dbe7fa] hover:bg-[#233b63] active:scale-95 transition-all flex items-center justify-center shrink-0 cursor-pointer"
          title="Back to Main Menu"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>

        <div className="flex flex-col leading-tight">
          <div className="flex items-center gap-1.5 text-xs font-bold tracking-tight whitespace-nowrap">
            <span className={isHardcore ? 'text-rose-400' : 'text-[#edf3fc]'}>
              Ch {chapter} · Lvl {level}
            </span>
            {isHardcore && (
              <span className="text-[10px] font-extrabold text-rose-400 uppercase">· PRO</span>
            )}
          </div>
          <div className="text-[11px] text-[#90a7c7] font-mono tabular-nums whitespace-nowrap">
            Moves <span className={moves > parMoves ? 'text-[#fbbf24] font-bold' : 'text-[#edf3fc] font-semibold'}>{moves}</span>/{parMoves}
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
                ? 'bg-[#3b1523] border-rose-500/50 text-rose-300'
                : 'bg-[#1b2f50] border-[#2f4b78] text-[#b4c6e0] hover:bg-[#233b63]'
            }`}
            title={isHardcore ? 'Pro Mode Active' : 'Switch to Pro Mode'}
          >
            <Flame className={`w-3.5 h-3.5 ${isHardcore ? 'text-rose-400' : 'text-[#849cc0]'}`} />
            <span className="text-[11px] uppercase hidden sm:inline">
              {isHardcore ? 'Pro' : 'Std'}
            </span>
          </button>
        )}

        <button
          onClick={onOpenShop}
          className="flex items-center gap-2 px-2.5 py-1.5 rounded-lg bg-[#1b2f50] border border-[#2f4b78] hover:bg-[#233b63] active:scale-95 transition-all text-xs font-mono font-bold tabular-nums whitespace-nowrap cursor-pointer"
          title="Points & Hints Shop"
        >
          <span className="flex items-center gap-1 text-[#fcd34d]">
            <Award className="w-3.5 h-3.5 text-[#f59e0b]" />
            {points}
          </span>
          <span className="text-[#4a6694]">/</span>
          <span className="flex items-center gap-1 text-[#5eead4]">
            <Lightbulb className="w-3.5 h-3.5 text-[#14b8a6]" />
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
              ? 'bg-[#0e393a] border-[#14b8a6]/45 text-[#5eead4]'
              : 'bg-[#1b2f50] border-[#2f4b78] text-[#7890b5]'
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
              ? 'bg-[#0e393a] border-[#14b8a6]/45 text-[#5eead4]'
              : 'bg-[#1b2f50] border-[#2f4b78] text-[#7890b5]'
          }`}
          title="Toggle Sound Effects"
        >
          {soundSettings.sfxEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
        </button>

        <button
          onClick={onOpenShop}
          aria-label="Open Reward Shop"
          className="w-8 h-8 rounded-lg bg-[#1b2f50] border border-[#2f4b78] text-[#b4c6e0] hover:text-[#edf3fc] flex items-center justify-center active:scale-95 transition-all cursor-pointer"
          title="Shop"
        >
          <ShoppingBag className="w-4 h-4" />
        </button>

        <button
          onClick={onOpenSettings}
          aria-label="Open Settings"
          className="w-8 h-8 rounded-lg bg-[#1b2f50] border border-[#2f4b78] text-[#b4c6e0] hover:text-[#edf3fc] flex items-center justify-center active:scale-95 transition-all cursor-pointer"
          title="Settings"
        >
          <Settings className="w-4 h-4" />
        </button>
      </div>
    </header>
  );
};
