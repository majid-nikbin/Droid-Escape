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
    <div className="fixed inset-0 z-50 bg-[#1f242c]/60 backdrop-blur-sm flex items-center justify-center p-4 select-none animate-in fade-in duration-200">
      <div className="w-full max-w-sm bg-[#f7f4ed] border border-[#d5cdc0] rounded-3xl flex flex-col overflow-hidden shadow-2xl">
        <div className="flex items-center justify-between px-5 py-4 border-b border-[#e4ddd0] bg-[#efeae0]">
          <h2 className="text-base font-extrabold text-[#1f242c]">Audio & Settings</h2>
          <button
            onClick={onClose}
            aria-label="Close"
            className="p-1.5 rounded-xl bg-[#e3dccf] text-[#4e483e] hover:text-[#1f242c] transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-5 space-y-4">
          {/* Ambient Music */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-[#e6f4f1] border border-[#99d6cb] flex items-center justify-center text-[#0f766e]">
                <Music className="w-4 h-4" />
              </div>
              <div className="flex flex-col">
                <span className="text-sm font-bold text-[#1f242c]">Ambient Music</span>
                <span className="text-xs text-[#665f54]">Calm background synth</span>
              </div>
            </div>

            <button
              onClick={() => onUpdateSettings({ ...settings, musicEnabled: !settings.musicEnabled })}
              aria-label="Toggle Ambient Music"
              className={`w-12 h-6 rounded-full transition-colors relative p-0.5 cursor-pointer ${
                settings.musicEnabled ? 'bg-[#0f766e]' : 'bg-[#cbc2b2]'
              }`}
            >
              <div
                className={`w-5 h-5 rounded-full bg-white shadow-xs transition-transform ${
                  settings.musicEnabled ? 'translate-x-6' : 'translate-x-0'
                }`}
              />
            </button>
          </div>

          {/* Sound Effects */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-[#e6f4f1] border border-[#99d6cb] flex items-center justify-center text-[#0f766e]">
                <Volume2 className="w-4 h-4" />
              </div>
              <div className="flex flex-col">
                <span className="text-sm font-bold text-[#1f242c]">Sound Effects</span>
                <span className="text-xs text-[#665f54]">Core knocks and footsteps</span>
              </div>
            </div>

            <button
              onClick={() => onUpdateSettings({ ...settings, sfxEnabled: !settings.sfxEnabled })}
              aria-label="Toggle Sound Effects"
              className={`w-12 h-6 rounded-full transition-colors relative p-0.5 cursor-pointer ${
                settings.sfxEnabled ? 'bg-[#0f766e]' : 'bg-[#cbc2b2]'
              }`}
            >
              <div
                className={`w-5 h-5 rounded-full bg-white shadow-xs transition-transform ${
                  settings.sfxEnabled ? 'translate-x-6' : 'translate-x-0'
                }`}
              />
            </button>
          </div>

          {/* Haptics */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-[#fef3c7] border border-[#f59e0b]/40 flex items-center justify-center text-[#b45309]">
                <Vibrate className="w-4 h-4" />
              </div>
              <div className="flex flex-col">
                <span className="text-sm font-bold text-[#1f242c]">Tactile Vibration</span>
                <span className="text-xs text-[#665f54]">Haptic feedback on impact</span>
              </div>
            </div>

            <button
              onClick={() => onUpdateSettings({ ...settings, hapticsEnabled: !settings.hapticsEnabled })}
              aria-label="Toggle Tactile Vibration"
              className={`w-12 h-6 rounded-full transition-colors relative p-0.5 cursor-pointer ${
                settings.hapticsEnabled ? 'bg-[#0f766e]' : 'bg-[#cbc2b2]'
              }`}
            >
              <div
                className={`w-5 h-5 rounded-full bg-white shadow-xs transition-transform ${
                  settings.hapticsEnabled ? 'translate-x-6' : 'translate-x-0'
                }`}
              />
            </button>
          </div>

          <div className="pt-3 border-t border-[#e4ddd0]">
            <button
              onClick={() => {
                if (window.confirm('Reset all progress and points back to initial state?')) {
                  onResetAllData();
                  onClose();
                }
              }}
              className="w-full py-2.5 px-4 rounded-xl border border-rose-300 text-rose-800 bg-rose-50 hover:bg-rose-100 active:scale-95 transition-all text-xs font-bold flex items-center justify-center gap-2 cursor-pointer"
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
