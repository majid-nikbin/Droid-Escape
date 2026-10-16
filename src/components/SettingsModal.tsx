import React from 'react';
import { X, Volume2, Music, Vibrate, RotateCcw } from 'lucide-react';
import { SoundSettings } from '../types/game';

interface SettingsModalProps {
  settings: SoundSettings;
  onUpdateSettings: (newSettings: SoundSettings) => void;
  onResetAllData: () => void;
  onClose: () => void;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({
  settings,
  onUpdateSettings,
  onResetAllData,
  onClose,
}) => {
  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 select-none">
      <div className="w-full max-w-sm bg-slate-900 border border-slate-800 rounded-2xl flex flex-col overflow-hidden shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-slate-800 bg-slate-950/60">
          <h2 className="text-base font-bold text-white">Game Settings</h2>
          <button
            onClick={onClose}
            aria-label="Close"
            className="p-1.5 rounded-lg bg-slate-800 text-slate-400 hover:text-white"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Settings Options */}
        <div className="p-5 space-y-4">
          {/* Ambient Music Toggle */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-teal-500/10 border border-teal-500/20 flex items-center justify-center text-teal-400">
                <Music className="w-4 h-4" />
              </div>
              <div className="flex flex-col">
                <span className="text-sm font-semibold text-white">Ambient Music</span>
                <span className="text-xs text-slate-400">Gentle relaxing background synth</span>
              </div>
            </div>

            <button
              onClick={() => onUpdateSettings({ ...settings, musicEnabled: !settings.musicEnabled })}
              className={`w-12 h-6 rounded-full transition-colors relative p-0.5 ${
                settings.musicEnabled ? 'bg-emerald-500' : 'bg-slate-700'
              }`}
            >
              <div
                className={`w-5 h-5 rounded-full bg-white transition-transform ${
                  settings.musicEnabled ? 'translate-x-6' : 'translate-x-0'
                }`}
              />
            </button>
          </div>

          {/* Sound FX & Knock Sound Toggle */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
                <Volume2 className="w-4 h-4" />
              </div>
              <div className="flex flex-col">
                <span className="text-sm font-semibold text-white">Sound Effects</span>
                <span className="text-xs text-slate-400">Box knock and droid steps</span>
              </div>
            </div>

            <button
              onClick={() => onUpdateSettings({ ...settings, sfxEnabled: !settings.sfxEnabled })}
              className={`w-12 h-6 rounded-full transition-colors relative p-0.5 ${
                settings.sfxEnabled ? 'bg-emerald-500' : 'bg-slate-700'
              }`}
            >
              <div
                className={`w-5 h-5 rounded-full bg-white transition-transform ${
                  settings.sfxEnabled ? 'translate-x-6' : 'translate-x-0'
                }`}
              />
            </button>
          </div>

          {/* Haptic Vibration Toggle */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400">
                <Vibrate className="w-4 h-4" />
              </div>
              <div className="flex flex-col">
                <span className="text-sm font-semibold text-white">Tactile Vibration</span>
                <span className="text-xs text-slate-400">Haptics on box impact</span>
              </div>
            </div>

            <button
              onClick={() => onUpdateSettings({ ...settings, hapticsEnabled: !settings.hapticsEnabled })}
              className={`w-12 h-6 rounded-full transition-colors relative p-0.5 ${
                settings.hapticsEnabled ? 'bg-emerald-500' : 'bg-slate-700'
              }`}
            >
              <div
                className={`w-5 h-5 rounded-full bg-white transition-transform ${
                  settings.hapticsEnabled ? 'translate-x-6' : 'translate-x-0'
                }`}
              />
            </button>
          </div>

          <div className="pt-2 border-t border-slate-800">
            <button
              onClick={onResetAllData}
              className="w-full py-2.5 px-4 rounded-xl border border-rose-900/60 bg-rose-950/20 hover:bg-rose-950/40 text-rose-300 text-xs font-semibold flex items-center justify-center gap-2 transition-all active:scale-95"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset Game Data & Progress</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
