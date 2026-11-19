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
  const [showPasscodePrompt, setShowPasscodePrompt] = useState(false);
  const [passcodeInput, setPasscodeInput] = useState('');
  const [passcodeError, setPasscodeError] = useState(false);
  const [isUnlocked, setIsUnlocked] = useState(false);

  if (!isOpen) return null;

  // 5 clicks on Developer opens the hidden passcode input (never reveals the passcode)
  const handleDeveloperClick = () => {
    if (showPasscodePrompt || isUnlocked) return;
    const nextCount = clickCount + 1;
    setClickCount(nextCount);

    if (nextCount >= 5) {
      setClickCount(0);
      setShowPasscodePrompt(true);
      setPasscodeInput('');
      setPasscodeError(false);
    }
  };

  const handlePasscodeSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (passcodeInput.trim() === '2450') {
      setPasscodeError(false);
      setIsUnlocked(true);
      setShowPasscodePrompt(false);
      setPasscodeInput('');
      onUnlockAllLevels();
    } else {
      setPasscodeError(true);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#050a14]/75 backdrop-blur-sm animate-in fade-in duration-200 select-none">
      <div className="relative w-full max-w-sm rounded-3xl bg-[#14233c] border border-[#2a4269] p-6 shadow-2xl flex flex-col gap-4 text-[#edf3fc] overflow-hidden">
        {/* Header */}
        <div className="relative flex items-center justify-between border-b border-[#22385c] pb-3">
          <span className="text-base font-extrabold tracking-tight text-[#edf3fc]">
            Droid Escape
          </span>
          <button
            onClick={onClose}
            aria-label="Close"
            className="p-1.5 rounded-xl bg-[#1b2f50] text-[#9bb0cf] hover:text-white transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Cube Emblem */}
        <div className="relative flex flex-col items-center my-1 text-center">
          <div className="w-16 h-16 rounded-2xl bg-[#1b2f50] border border-[#34517d] p-2 shadow-md flex items-center justify-center">
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
            className="p-3.5 rounded-2xl bg-[#1a2c4a] border border-[#2b436b] hover:border-[#3d5f94] transition-all cursor-pointer flex items-center justify-between active:scale-[0.98]"
          >
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-[#0e393a] border border-[#14b8a6]/45 flex items-center justify-center text-[#2dd4bf]">
                <Code className="w-4 h-4" />
              </div>
              <div className="flex flex-col text-left">
                <span className="text-[11px] uppercase tracking-wider text-[#90a7c7] font-semibold">
                  Developer
                </span>
                <span className="text-sm font-bold text-[#edf3fc]">M-tech</span>
              </div>
            </div>

            {isUnlocked && (
              <span className="flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded bg-[#0e393a] border border-[#14b8a6]/40 text-[#5eead4]">
                <CheckCircle2 className="w-3 h-3" />
                UNLOCKED
              </span>
            )}
          </div>

          {/* Email: developer-md@proton.me */}
          <a
            href="mailto:developer-md@proton.me"
            className="p-3.5 rounded-2xl bg-[#1a2c4a] border border-[#2b436b] hover:border-[#3d5f94] transition-all flex items-center gap-3 text-left cursor-pointer"
          >
            <div className="w-9 h-9 rounded-xl bg-[#13223b] border border-[#2b436b] flex items-center justify-center text-[#b4c6e0]">
              <Mail className="w-4 h-4" />
            </div>
            <div className="flex flex-col">
              <span className="text-[11px] uppercase tracking-wider text-[#90a7c7] font-semibold">
                Email
              </span>
              <span className="text-xs font-mono text-[#edf3fc] font-medium">
                developer-md@proton.me
              </span>
            </div>
          </a>

          {/* Version: v1.0.6 */}
          <div className="p-3.5 rounded-2xl bg-[#1a2c4a] border border-[#2b436b] flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-[#13223b] border border-[#2b436b] flex items-center justify-center text-[#b4c6e0]">
              <ShieldCheck className="w-4 h-4" />
            </div>
            <div className="flex flex-col">
              <span className="text-[11px] uppercase tracking-wider text-[#90a7c7] font-semibold">
                Version
              </span>
              <span className="text-xs font-bold font-mono text-[#edf3fc]">
                v{currentVersion}
              </span>
            </div>
          </div>

          {/* Passcode Input Bar (only shown after 5 clicks on Developer; never reveals passcode beforehand) */}
          {showPasscodePrompt && !isUnlocked && (
            <form
              onSubmit={handlePasscodeSubmit}
              className="mt-1 p-3 rounded-2xl bg-[#101d32] border border-[#34517d] flex flex-col gap-2"
            >
              <div className="flex items-center gap-2">
                <KeyRound className="w-4 h-4 text-[#f59e0b] shrink-0" />
                <input
                  type="password"
                  inputMode="numeric"
                  maxLength={8}
                  value={passcodeInput}
                  onChange={e => {
                    setPasscodeInput(e.target.value);
                    if (passcodeError) setPasscodeError(false);
                  }}
                  placeholder="Enter passcode"
                  autoFocus
                  className="flex-1 bg-[#192b49] border border-[#2f4b78] focus:border-[#d97706] rounded-xl px-3 py-1.5 text-xs font-mono text-[#edf3fc] placeholder-[#6d83a6] outline-none"
                />
                <button
                  type="submit"
                  className="px-3 py-1.5 rounded-xl bg-[#d97706] hover:bg-[#b45309] text-white font-bold text-xs active:scale-95 transition-all cursor-pointer shrink-0"
                >
                  Unlock
                </button>
              </div>
              {passcodeError && (
                <span className="text-[11px] text-rose-400 font-semibold pl-6">
                  Invalid passcode
                </span>
              )}
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
