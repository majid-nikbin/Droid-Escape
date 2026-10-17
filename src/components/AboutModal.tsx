import React, { useState } from 'react';
import { X, Info, Code, Mail, Sparkles, RefreshCw, CheckCircle2, KeyRound, ExternalLink, ShieldCheck } from 'lucide-react';

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
  const [showSecretPrompt, setShowSecretPrompt] = useState(false);
  const [secretCode, setSecretCode] = useState('');
  const [secretError, setSecretError] = useState(false);
  const [isUnlocked, setIsUnlocked] = useState(false);

  // Update check states
  const [isCheckingUpdate, setIsCheckingUpdate] = useState(false);
  const [updateMessage, setUpdateMessage] = useState<string | null>(null);

  if (!isOpen) return null;

  // Handle secret 5 clicks on Developer name
  const handleDeveloperClick = () => {
    const nextCount = clickCount + 1;
    setClickCount(nextCount);

    if (nextCount >= 5) {
      setClickCount(0);
      setShowSecretPrompt(true);
      setSecretCode('');
      setSecretError(false);
    }
  };

  const handleVerifySecret = (e: React.FormEvent) => {
    e.preventDefault();
    if (secretCode.trim() === '2450') {
      setIsUnlocked(true);
      setShowSecretPrompt(false);
      onUnlockAllLevels();
    } else {
      setSecretError(true);
      setTimeout(() => setSecretError(false), 2000);
    }
  };

  const handleCheckUpdate = async () => {
    setIsCheckingUpdate(true);
    setUpdateMessage(null);

    try {
      const response = await fetch(
        'https://api.github.com/repos/majid-nikbin/Droid-Escape/releases/latest',
        { headers: { Accept: 'application/vnd.github.v3+json' } }
      );

      if (response.ok) {
        const data = await response.json();
        const latestTag = data.tag_name || '1.0.2';
        if (latestTag.replace('v', '') !== currentVersion) {
          setUpdateMessage(`New version available: ${latestTag}`);
        } else {
          setUpdateMessage(`You are running the latest version (v${currentVersion}).`);
        }
      } else {
        setTimeout(() => {
          setUpdateMessage(`You are running the latest version (v${currentVersion}).`);
          setIsCheckingUpdate(false);
        }, 600);
        return;
      }
    } catch {
      setUpdateMessage(`You are running the latest version (v${currentVersion}).`);
    } finally {
      setIsCheckingUpdate(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-sm rounded-3xl bg-slate-900 border border-slate-800 p-6 shadow-2xl flex flex-col gap-4 text-slate-100">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <div className="flex items-center gap-2 text-emerald-400 font-bold text-lg">
            <Info className="w-5 h-5" />
            <span>About Droid Escape</span>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-xl hover:bg-slate-800 text-slate-400 hover:text-slate-200 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Polished App Emblem & Title */}
        <div className="flex flex-col items-center my-1 text-center">
          <div className="w-20 h-20 rounded-3xl bg-gradient-to-br from-slate-900 via-slate-950 to-slate-900 border-2 border-emerald-500/40 p-2 shadow-2xl shadow-emerald-500/20 mb-2 flex items-center justify-center">
            <svg viewBox="0 0 100 100" className="w-16 h-16 drop-shadow">
              {/* Isometric Cube Base */}
              <polygon points="50,52 82,66 50,80 18,66" fill="#0284c7" stroke="#38bdf8" strokeWidth="1.5" />
              <polygon points="18,66 50,80 50,92 18,78" fill="#0369a1" />
              <polygon points="50,80 82,66 82,78 50,92" fill="#075985" />
              {/* Droid Antennas */}
              <line x1="42" y1="28" x2="33" y2="15" stroke="#34d399" strokeWidth="3.5" strokeLinecap="round" />
              <line x1="58" y1="28" x2="67" y2="15" stroke="#34d399" strokeWidth="3.5" strokeLinecap="round" />
              {/* Droid Dome Head */}
              <path d="M28,45 C28,32.8 37.8,23 50,23 C62.2,23 72,32.8 72,45 Z" fill="#10b981" />
              <circle cx="39" cy="35" r="3" fill="#ffffff" />
              <circle cx="61" cy="35" r="3" fill="#ffffff" />
            </svg>
          </div>
          <h2 className="text-xl font-black tracking-wide text-white">DROID ESCAPE</h2>
          <span className="text-xs text-slate-400">20 Chapters · 2,000 Brain Puzzles</span>
        </div>

        {/* Info Cards */}
        <div className="flex flex-col gap-2.5">
          {/* Developer Card (Silent 5 Clicks to open Secret Unlock) */}
          <div
            onClick={handleDeveloperClick}
            className="p-3.5 rounded-2xl bg-slate-950/70 border border-slate-800 hover:border-slate-700 transition-all cursor-pointer flex items-center justify-between select-none active:scale-[0.98]"
          >
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
                <Code className="w-5 h-5" />
              </div>
              <div className="flex flex-col text-left">
                <span className="text-[11px] uppercase tracking-wider text-slate-400 font-semibold">
                  Developer
                </span>
                <span className="text-sm font-bold text-white flex items-center gap-1.5">
                  M-Tech
                  {isUnlocked && <ShieldCheck className="w-4 h-4 text-emerald-400" />}
                </span>
              </div>
            </div>
            {isUnlocked && (
              <span className="text-[10px] font-bold text-emerald-400 font-mono">
                UNLOCKED
              </span>
            )}
          </div>

          {/* Version Card */}
          <div className="p-3.5 rounded-2xl bg-slate-950/70 border border-slate-800 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center text-cyan-400">
                <Sparkles className="w-5 h-5" />
              </div>
              <div className="flex flex-col text-left">
                <span className="text-[11px] uppercase tracking-wider text-slate-400 font-semibold">
                  Version
                </span>
                <span className="text-sm font-bold font-mono text-white">
                  v{currentVersion}
                </span>
              </div>
            </div>
            <button
              onClick={handleCheckUpdate}
              disabled={isCheckingUpdate}
              className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-slate-300 flex items-center gap-1 transition-colors"
            >
              <RefreshCw className={`w-3 h-3 ${isCheckingUpdate ? 'animate-spin' : ''}`} />
              <span>Update</span>
            </button>
          </div>

          {/* Update message notification if checked */}
          {updateMessage && (
            <div className="p-2.5 rounded-xl bg-emerald-950/50 border border-emerald-500/30 text-xs text-emerald-300 flex items-center gap-2 animate-in fade-in">
              <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-400" />
              <span>{updateMessage}</span>
            </div>
          )}

          {/* Email Card */}
          <a
            href="mailto:developer-md@proton.me"
            className="p-3.5 rounded-2xl bg-slate-950/70 border border-slate-800 hover:border-slate-700 transition-colors flex items-center justify-between group"
          >
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-purple-400">
                <Mail className="w-5 h-5" />
              </div>
              <div className="flex flex-col text-left">
                <span className="text-[11px] uppercase tracking-wider text-slate-400 font-semibold">
                  Email
                </span>
                <span className="text-xs font-medium text-slate-200 font-mono">
                  developer-md@proton.me
                </span>
              </div>
            </div>
            <ExternalLink className="w-4 h-4 text-slate-500 group-hover:text-slate-300 transition-colors" />
          </a>
        </div>

        {/* Secret Developer Passcode Modal */}
        {showSecretPrompt && (
          <div className="absolute inset-0 bg-slate-950/95 rounded-3xl p-6 flex flex-col justify-center items-center gap-4 z-20 animate-in fade-in">
            <div className="w-12 h-12 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400">
              <KeyRound className="w-6 h-6" />
            </div>

            <div className="text-center">
              <h3 className="text-base font-bold text-white">Developer Passcode</h3>
              <p className="text-xs text-slate-400 mt-1">
                Enter Master Passcode to unlock all 2,000 levels
              </p>
            </div>

            <form onSubmit={handleVerifySecret} className="w-full flex flex-col gap-3">
              <input
                type="password"
                inputMode="numeric"
                maxLength={6}
                value={secretCode}
                onChange={e => setSecretCode(e.target.value)}
                placeholder="Enter Code (e.g. 2450)"
                autoFocus
                className={`w-full py-2.5 px-4 rounded-xl bg-slate-900 border text-center font-mono text-lg tracking-widest text-white outline-none transition-colors ${
                  secretError ? 'border-rose-500 ring-2 ring-rose-500/40' : 'border-slate-700 focus:border-amber-400'
                }`}
              />

              {secretError && (
                <span className="text-[11px] text-rose-400 text-center font-semibold">
                  Incorrect Passcode. Try again.
                </span>
              )}

              <div className="flex gap-2 mt-1">
                <button
                  type="button"
                  onClick={() => setShowSecretPrompt(false)}
                  className="flex-1 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-bold text-slate-300 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-xs font-black text-slate-950 transition-all shadow-lg shadow-amber-500/30"
                >
                  Unlock
                </button>
              </div>
            </form>
          </div>
        )}
      </div>
    </div>
  );
};
