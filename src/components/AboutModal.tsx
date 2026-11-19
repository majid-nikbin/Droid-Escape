import React, { useState } from 'react';
import { X, Info, Code, Mail, ShieldCheck, KeyRound, CheckCircle2 } from 'lucide-react';

interface AboutModalProps {
  isOpen: boolean;
  onClose: () => void;
  onUnlockAllLevels: () => void;
  currentVersion?: string;
}

export const CURRENT_APP_VERSION = '1.0.6';

export const AboutModal: React.FC<AboutModalProps> = ({
  isOpen,
  onClose,
  onUnlockAllLevels,
  currentVersion = CURRENT_APP_VERSION,
}) => {
  const [clickCount, setClickCount] = useState(0);
  const [isPasswordRevealed, setIsPasswordRevealed] = useState(false);
  const [isUnlocked, setIsUnlocked] = useState(false);

  if (!isOpen) return null;

  // 5 clicks on Developer reveals the password in the background
  const handleDeveloperClick = () => {
    const nextCount = clickCount + 1;
    setClickCount(nextCount);

    if (nextCount >= 5) {
      setClickCount(0);
      setIsPasswordRevealed(true);
    }
  };

  const handleUnlock = () => {
    setIsUnlocked(true);
    onUnlockAllLevels();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200 select-none">
      <div className="relative w-full max-w-sm rounded-3xl bg-white border border-slate-200 p-6 shadow-2xl flex flex-col gap-4 text-slate-800">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <div className="flex items-center gap-2 text-emerald-700 font-bold text-lg">
            <Info className="w-5 h-5" />
            <span>About Droid Escape</span>
          </div>
          <button
            onClick={onClose}
            aria-label="Close"
            className="p-1.5 rounded-xl hover:bg-slate-100 text-slate-400 hover:text-slate-800 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Minimal Cube Emblem & Title */}
        <div className="flex flex-col items-center my-1 text-center">
          <div className="w-16 h-16 rounded-2xl bg-slate-900 border border-slate-700 p-2 shadow-md mb-2 flex items-center justify-center">
            {/* Geometric Isometric Hollow Cube with Radiant Amber Core */}
            <svg viewBox="0 0 100 100" className="w-12 h-12 drop-shadow">
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
          <h2 className="text-xl font-black tracking-wide text-slate-900">DROID ESCAPE</h2>
        </div>

        {/* Info Cards (Only Developer, Email, Version - No extra text) */}
        <div className="flex flex-col gap-2.5">
          {/* Developer: M-tech (5 Clicks reveals password in background) */}
          <div
            onClick={handleDeveloperClick}
            className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 hover:border-slate-300 transition-all cursor-pointer flex items-center justify-between select-none active:scale-[0.98]"
          >
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-emerald-50 border border-emerald-200 flex items-center justify-center text-emerald-700">
                <Code className="w-5 h-5" />
              </div>
              <div className="flex flex-col text-left">
                <span className="text-[11px] uppercase tracking-wider text-slate-500 font-semibold">
                  Developer
                </span>
                <span className="text-sm font-bold text-slate-900">M-tech</span>
              </div>
            </div>

            {isUnlocked && (
              <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 border border-emerald-300">
                MASTER UNLOCKED
              </span>
            )}
          </div>

          {/* Email: developer-md@proton.me */}
          <a
            href="mailto:developer-md@proton.me"
            className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 hover:border-slate-300 transition-all flex items-center justify-between text-left group cursor-pointer"
          >
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-sky-50 border border-sky-200 flex items-center justify-center text-sky-700">
                <Mail className="w-5 h-5" />
              </div>
              <div className="flex flex-col">
                <span className="text-[11px] uppercase tracking-wider text-slate-500 font-semibold">
                  Email
                </span>
                <span className="text-xs font-mono text-slate-800 font-medium">developer-md@proton.me</span>
              </div>
            </div>
          </a>

          {/* Version: v1.0.6 */}
          <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-slate-100 border border-slate-200 flex items-center justify-center text-slate-600">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <div className="flex flex-col">
                <span className="text-[11px] uppercase tracking-wider text-slate-500 font-semibold">
                  Version
                </span>
                <span className="text-xs font-bold text-slate-900">v{currentVersion}</span>
              </div>
            </div>
          </div>

          {/* Background Revealed Password (Triggered after 5 clicks on Developer) */}
          {isPasswordRevealed && (
            <div className="mt-1 p-3.5 rounded-2xl bg-gradient-to-r from-amber-50 to-orange-50 border-2 border-amber-300 flex items-center justify-between animate-in fade-in duration-300 shadow-sm">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-amber-500 text-white flex items-center justify-center">
                  <KeyRound className="w-4 h-4" />
                </div>
                <div className="flex flex-col text-left">
                  <span className="text-[10px] uppercase font-bold text-amber-700 tracking-wider">
                    Password
                  </span>
                  <span className="text-base font-mono font-black text-amber-900 tracking-widest">
                    2450
                  </span>
                </div>
              </div>

              {!isUnlocked ? (
                <button
                  onClick={handleUnlock}
                  className="px-3 py-1.5 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs shadow-xs active:scale-95 transition-all cursor-pointer"
                >
                  Unlock All Levels
                </button>
              ) : (
                <div className="flex items-center gap-1 text-emerald-700 text-xs font-bold">
                  <CheckCircle2 className="w-4 h-4" />
                  <span>All Unlocked</span>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
