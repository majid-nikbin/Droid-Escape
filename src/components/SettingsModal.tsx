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
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 select-none animate-in fade-in duration-200">
      <div className="w-full max-w-sm bg-white border border-slate-200 rounded-3xl flex flex-col overflow-hidden shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100 bg-slate-50/80">
          <h2 className="text-base font-bold text-slate-900">Game Settings</h2>
          <button
            onClick={onClose}
            aria-label="Close"
            className="p-1.5 rounded-xl bg-slate-100 text-slate-500 hover:text-slate-900 hover:bg-slate-200 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Settings Options */}
        <div className="p-5 space-y-4">
          {/* Ambient Music Toggle */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-teal-50 border border-teal-200 flex items-center justify-center text-teal-700">
                <Music className="w-4 h-4" />
              </div>
              <div className="flex flex-col">
                <span className="text-sm font-semibold text-slate-900">Ambient Music</span>
                <span className="text-xs text-slate-500">Gentle relaxing background soundtrack</span>
              </div>
            </div>

            <button
              onClick={() => onUpdateSettings({ ...settings, musicEnabled: !settings.musicEnabled })}
              className={`w-12 h-6 rounded-full transition-colors relative p-0.5 cursor-pointer ${
                settings.musicEnabled ? 'bg-emerald-600' : 'bg-slate-300'
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
              <div className="w-9 h-9 rounded-xl bg-emerald-50 border border-emerald-200 flex items-center justify-center text-emerald-700">
                <Volume2 className="w-4 h-4" />
              </div>
              <div className="flex flex-col">
                <span className="text-sm font-semibold text-slate-900">Sound Effects</span>
                <span className="text-xs text-slate-500">Authentic box knock and droid footsteps</span>
              </div>
            </div>

            <button
              onClick={() => onUpdateSettings({ ...settings, sfxEnabled: !settings.sfxEnabled })}
              className={`w-12 h-6 rounded-full transition-colors relative p-0.5 cursor-pointer ${
                settings.sfxEnabled ? 'bg-emerald-600' : 'bg-slate-300'
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
              <div className="w-9 h-9 rounded-xl bg-amber-50 border border-amber-200 flex items-center justify-center text-amber-700">
                <Vibrate className="w-4 h-4" />
              </div>
              <div className="flex flex-col">
                <span className="text-sm font-semibold text-slate-900">Tactile Vibration</span>
                <span className="text-xs text-slate-500">Haptic pulse on box impact</span>
              </div>
            </div>

            <button
              onClick={() => onUpdateSettings({ ...settings, hapticsEnabled: !settings.hapticsEnabled })}
              className={`w-12 h-6 rounded-full transition-colors relative p-0.5 cursor-pointer ${
                settings.hapticsEnabled ? 'bg-emerald-600' : 'bg-slate-300'
              }`}
            >
              <div
                className={`w-5 h-5 rounded-full bg-white transition-transform ${
                  settings.hapticsEnabled ? 'translate-x-6' : 'translate-x-0'
                }`}
              />
            </button>
          </div>

          <div className="pt-2 border-t border-slate-100">
            <button
              onClick={() => {
                if (window.confirm('Reset all progress and points back to initial state?')) {
                  onResetAllData();
                  onClose();
                }
              }}
              className="w-full py-2.5 px-4 rounded-xl border border-rose-200 text-rose-700 bg-rose-50 hover:bg-rose-100 active:scale-95 transition-all text-xs font-semibold flex items-center justify-center gap-2 cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset Game Progress</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
