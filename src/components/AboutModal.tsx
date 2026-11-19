import React, { useState } from 'react';
import { X, Code, Mail, ShieldCheck, KeyRound, CheckCircle2 } from 'lucide-react';

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

  // 5 clicks on Developer activates Developer Mode unlock (without displaying any passcode)
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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#1f242c]/60 backdrop-blur-sm animate-in fade-in duration-200 select-none">
      <div className="relative w-full max-w-sm rounded-3xl bg-[#f7f4ed] border border-[#d5cdc0] p-6 shadow-2xl flex flex-col gap-4 text-[#1f242c] overflow-hidden">

        {/* Header */}
        <div className="relative flex items-center justify-between border-b border-[#e4ddd0] pb-3">
          <span className="text-base font-extrabold tracking-tight text-[#1f242c]">
            Droid Escape
          </span>
          <button
            onClick={onClose}
            aria-label="Close"
            className="p-1.5 rounded-xl bg-[#eae4d7] text-[#5c5549] hover:text-[#1f242c] transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Cube Emblem */}
        <div className="relative flex flex-col items-center my-1 text-center">
          <div className="w-16 h-16 rounded-2xl bg-[#272d37] border border-[#434c5c] p-2 shadow-md flex items-center justify-center">
            <svg viewBox="0 0 100 100" className="w-12 h-12">
              <polygon points="36,49 50,57 50,73 36,65" fill="#ea580c" />
              <polygon points="50,57 64,49 64,65 50,73" fill="#c2410c" />
              <polygon points="50,41 64,49 50,57 36,49" fill="#fbbf24" />
              <polygon points="64,36 64,49 50,57 50,44" fill="#4b515b" />
              <polygon points="36,36 50,44 50,57 36,49" fill="#353a42" />
              <path d="M 50 12 L 88 34 L 50 54 L 12 34 Z M 50 21 L 36 36 L 50 44 L 64 36 Z" fill="#828995" fillRule="evenodd" />
              <path d="M 12 34 L 50 54 L 50 92 L 12 72 Z M 21 45 L 41 57 L 41 78 L 21 66 Z" fill="#4e545e" fillRule="evenodd" />
              <path d="M 50 54 L 88 34 L 88 72 L 50 92 Z M 59 57 L 79 45 L 79 66 L 59 78 Z" fill="#272b33" fillRule="evenodd" />
            </svg>
          </div>
        </div>

        {/* Strictly Developer, Email, Version */}
        <div className="relative flex flex-col gap-2.5">
          {/* Developer: M-tech */}
          <div
            onClick={handleDeveloperClick}
            className="p-3.5 rounded-2xl bg-white/80 border border-[#d8d0c2] hover:border-[#b9b09f] transition-all cursor-pointer flex items-center justify-between active:scale-[0.98]"
          >
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-[#e6f4f1] border border-[#99d6cb] flex items-center justify-center text-[#0f766e]">
                <Code className="w-4 h-4" />
              </div>
              <div className="flex flex-col text-left">
                <span className="text-[11px] uppercase tracking-wider text-[#665f54] font-semibold">
                  Developer
                </span>
                <span className="text-sm font-bold text-[#1f242c]">M-tech</span>
              </div>
            </div>

            {isUnlocked && (
              <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-[#d1fae5] text-[#065f46]">
                UNLOCKED
              </span>
            )}
          </div>

          {/* Email: developer-md@proton.me */}
          <a
            href="mailto:developer-md@proton.me"
            className="p-3.5 rounded-2xl bg-white/80 border border-[#d8d0c2] hover:border-[#b9b09f] transition-all flex items-center gap-3 text-left cursor-pointer"
          >
            <div className="w-9 h-9 rounded-xl bg-[#eae4d7] border border-[#d4cbb9] flex items-center justify-center text-[#4e483e]">
              <Mail className="w-4 h-4" />
            </div>
            <div className="flex flex-col">
              <span className="text-[11px] uppercase tracking-wider text-[#665f54] font-semibold">
                Email
              </span>
              <span className="text-xs font-mono text-[#1f242c] font-medium">
                developer-md@proton.me
              </span>
            </div>
          </a>

          {/* Version: v1.0.6 */}
          <div className="p-3.5 rounded-2xl bg-white/80 border border-[#d8d0c2] flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-[#eae4d7] border border-[#d4cbb9] flex items-center justify-center text-[#4e483e]">
              <ShieldCheck className="w-4 h-4" />
            </div>
            <div className="flex flex-col">
              <span className="text-[11px] uppercase tracking-wider text-[#665f54] font-semibold">
                Version
              </span>
              <span className="text-xs font-bold font-mono text-[#1f242c]">
                v{currentVersion}
              </span>
            </div>
          </div>

          {/* Unlocked Action Bar after 5 clicks */}
          {isPasswordRevealed && (
            <div className="mt-1 p-3 rounded-2xl bg-[#fef3c7]/80 border border-[#d97706]/50 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <KeyRound className="w-4 h-4 text-[#b45309]" />
                <span className="text-xs font-bold text-[#78350f] tracking-wide">
                  Developer Mode
                </span>
              </div>

              {!isUnlocked ? (
                <button
                  onClick={handleUnlock}
                  className="px-3 py-1.5 rounded-xl bg-[#d97706] hover:bg-[#b45309] text-white font-bold text-xs active:scale-95 transition-all cursor-pointer"
                >
                  Unlock All Levels
                </button>
              ) : (
                <div className="flex items-center gap-1 text-[#0f766e] text-xs font-bold">
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
