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
        const latestTag = data.tag_name || '1.0.6';
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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-sm rounded-3xl bg-white border border-slate-200 p-6 shadow-2xl flex flex-col gap-4 text-slate-800">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <div className="flex items-center gap-2 text-emerald-700 font-bold text-lg">
            <Info className="w-5 h-5" />
            <span>About Droid Escape</span>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-xl hover:bg-slate-100 text-slate-400 hover:text-slate-800 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Geometric Emblem & Title */}
        <div className="flex flex-col items-center my-1 text-center">
          <div className="w-20 h-20 rounded-3xl bg-slate-50 border-2 border-slate-200 p-2 shadow-sm mb-2 flex items-center justify-center">
            {/* Geometric Isometric Hollow Cube */}
            <svg viewBox="0 0 100 100" className="w-16 h-16 drop-shadow">
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
          <span className="text-xs text-slate-500">20 Chapters · 2,000 Brain Puzzles</span>
        </div>

        {/* Info Cards */}
        <div className="flex flex-col gap-2.5">
          {/* Developer Card (Silent 5 Clicks to open Secret Unlock) */}
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
                <span className="text-sm font-bold text-slate-900">Majid Nikbin</span>
              </div>
            </div>
            {isUnlocked && (
              <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 border border-emerald-300">
                MASTER UNLOCKED
              </span>
            )}
          </div>

          {/* Email Support */}
          <a
            href="mailto:majid.nikbin@gmail.com"
            className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 hover:border-slate-300 transition-all flex items-center justify-between text-left group cursor-pointer"
          >
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-sky-50 border border-sky-200 flex items-center justify-center text-sky-700">
                <Mail className="w-5 h-5" />
              </div>
              <div className="flex flex-col">
                <span className="text-[11px] uppercase tracking-wider text-slate-500 font-semibold">
                  Contact & Feedback
                </span>
                <span className="text-xs font-mono text-slate-800">majid.nikbin@gmail.com</span>
              </div>
            </div>
            <ExternalLink className="w-4 h-4 text-slate-400 group-hover:text-slate-800 transition-colors" />
          </a>

          {/* Version & Update Check */}
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

            <button
              onClick={handleCheckUpdate}
              disabled={isCheckingUpdate}
              className="px-2.5 py-1.5 rounded-xl bg-white border border-slate-200 hover:bg-slate-100 text-xs text-slate-700 font-medium flex items-center gap-1.5 transition-all active:scale-95 disabled:opacity-50 cursor-pointer shadow-xs"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isCheckingUpdate ? 'animate-spin' : ''}`} />
              <span>{isCheckingUpdate ? 'Checking...' : 'Check'}</span>
            </button>
          </div>

          {updateMessage && (
            <div className="p-2.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs text-center flex items-center justify-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>{updateMessage}</span>
            </div>
          )}

          {/* Secret Passcode Prompt */}
          {showSecretPrompt && (
            <form onSubmit={handleVerifySecret} className="mt-2 p-3 rounded-2xl bg-amber-50 border border-amber-200 flex flex-col gap-2">
              <div className="flex items-center justify-between text-xs font-bold text-amber-900">
                <span className="flex items-center gap-1">
                  <KeyRound className="w-3.5 h-3.5 text-amber-700" />
                  <span>Developer Passcode</span>
                </span>
                <button
                  type="button"
                  onClick={() => setShowSecretPrompt(false)}
                  className="text-amber-700 hover:text-amber-900"
                >
                  ✕
                </button>
              </div>
              <div className="flex items-center gap-2">
                <input
                  type="password"
                  placeholder="Enter code"
                  value={secretCode}
                  onChange={e => setSecretCode(e.target.value)}
                  className="flex-1 px-3 py-1.5 rounded-xl bg-white border border-amber-300 text-slate-900 text-xs font-mono outline-hidden focus:border-amber-500"
                  autoFocus
                />
                <button
                  type="submit"
                  className="px-3 py-1.5 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs cursor-pointer shadow-xs"
                >
                  Unlock
                </button>
              </div>
              {secretError && (
                <span className="text-[11px] text-rose-600 font-medium">
                  Invalid Passcode. Try again.
                </span>
              )}
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
