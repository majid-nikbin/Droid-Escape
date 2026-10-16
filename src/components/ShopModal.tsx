import React, { useState } from 'react';
import { X, Award, Lightbulb, Check, Sparkles } from 'lucide-react';
import { UserProgress } from '../types/game';
import { sound } from '../utils/audio';

interface ShopModalProps {
  progress: UserProgress;
  onBuyHelp: (amount: number, cost: number) => boolean;
  onClose: () => void;
}

export const ShopModal: React.FC<ShopModalProps> = ({
  progress,
  onBuyHelp,
  onClose,
}) => {
  const [purchaseSuccess, setPurchaseSuccess] = useState<string | null>(null);

  const handlePurchase = (amount: number, cost: number, label: string) => {
    if (progress.points < cost) return;
    const ok = onBuyHelp(amount, cost);
    if (ok) {
      sound.playPurchaseSound();
      setPurchaseSuccess(`Purchased ${label}!`);
      setTimeout(() => setPurchaseSuccess(null), 2500);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 select-none">
      <div className="w-full max-w-md bg-slate-900 border border-slate-800 rounded-2xl flex flex-col overflow-hidden shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-slate-800 bg-slate-950/60">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400">
              <Award className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white">Hint & Reward Shop</h2>
              <p className="text-xs text-slate-400">Earn 1 Pt per level · 10 Pts = 1 Help</p>
            </div>
          </div>
          <button
            onClick={onClose}
            aria-label="Close"
            className="p-1.5 rounded-lg bg-slate-800 text-slate-400 hover:text-white"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Balance Card */}
        <div className="p-4 bg-slate-950/40 border-b border-slate-800 flex items-center justify-around">
          <div className="flex flex-col items-center">
            <span className="text-xs text-slate-400">Your Points</span>
            <div className="flex items-center gap-1.5 mt-0.5">
              <Award className="w-4 h-4 text-amber-400" />
              <span className="text-xl font-bold font-mono text-amber-300 tabular-nums">
                {progress.points}
              </span>
            </div>
          </div>

          <div className="w-px h-8 bg-slate-800" />

          <div className="flex flex-col items-center">
            <span className="text-xs text-slate-400">Available Helps</span>
            <div className="flex items-center gap-1.5 mt-0.5">
              <Lightbulb className="w-4 h-4 text-emerald-400" />
              <span className="text-xl font-bold font-mono text-emerald-300 tabular-nums">
                {progress.helpsRemaining}
              </span>
            </div>
          </div>
        </div>

        {/* Purchase Notification */}
        {purchaseSuccess && (
          <div className="mx-4 mt-3 px-3 py-2 rounded-xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 text-xs flex items-center gap-2">
            <Check className="w-4 h-4" />
            <span>{purchaseSuccess}</span>
          </div>
        )}

        {/* Shop Items */}
        <div className="p-4 space-y-3">
          {/* Item 1: Standard 1 Help for 10 Points */}
          <div className="p-3.5 rounded-xl bg-slate-950/70 border border-slate-800 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 text-lg">
                💡
              </div>
              <div className="flex flex-col">
                <span className="text-sm font-bold text-white">1 Chamber Help</span>
                <span className="text-xs text-slate-400">Reveals optimal move sequence</span>
              </div>
            </div>

            <button
              onClick={() => handlePurchase(1, 10, '1 Help')}
              disabled={progress.points < 10}
              className={`px-3.5 py-2 rounded-xl font-bold text-xs flex items-center gap-1 transition-all ${
                progress.points >= 10
                  ? 'bg-amber-500 hover:bg-amber-400 text-slate-950 active:scale-95 shadow-md shadow-amber-500/20'
                  : 'bg-slate-800 text-slate-500 cursor-not-allowed border border-slate-700/50'
              }`}
            >
              <Award className="w-3.5 h-3.5" />
              <span>10 PTS</span>
            </button>
          </div>

          {/* Item 2: Bundle 3 Helps for 25 Points (Special Offer) */}
          <div className="p-3.5 rounded-xl bg-gradient-to-r from-emerald-950/40 to-slate-950/70 border border-emerald-500/30 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400 text-lg">
                ✨
              </div>
              <div className="flex flex-col">
                <div className="flex items-center gap-1.5">
                  <span className="text-sm font-bold text-white">3 Helps Bundle</span>
                  <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-emerald-500/20 text-emerald-300">
                    SAVE 5 PTS
                  </span>
                </div>
                <span className="text-xs text-slate-400">Great for challenging chapters</span>
              </div>
            </div>

            <button
              onClick={() => handlePurchase(3, 25, '3 Helps Bundle')}
              disabled={progress.points < 25}
              className={`px-3.5 py-2 rounded-xl font-bold text-xs flex items-center gap-1 transition-all ${
                progress.points >= 25
                  ? 'bg-emerald-400 hover:bg-emerald-300 text-slate-950 active:scale-95 shadow-md shadow-emerald-500/20'
                  : 'bg-slate-800 text-slate-500 cursor-not-allowed border border-slate-700/50'
              }`}
            >
              <Award className="w-3.5 h-3.5" />
              <span>25 PTS</span>
            </button>
          </div>

          {/* Item 3: Mega Pack 5 Helps for 40 Points */}
          <div className="p-3.5 rounded-xl bg-slate-950/70 border border-slate-800 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-purple-400 text-lg">
                🚀
              </div>
              <div className="flex flex-col">
                <span className="text-sm font-bold text-white">5 Helps Mega Pack</span>
                <span className="text-xs text-slate-400">Full puzzle assistance</span>
              </div>
            </div>

            <button
              onClick={() => handlePurchase(5, 40, '5 Helps Mega Pack')}
              disabled={progress.points < 40}
              className={`px-3.5 py-2 rounded-xl font-bold text-xs flex items-center gap-1 transition-all ${
                progress.points >= 40
                  ? 'bg-purple-400 hover:bg-purple-300 text-slate-950 active:scale-95 shadow-md shadow-purple-500/20'
                  : 'bg-slate-800 text-slate-500 cursor-not-allowed border border-slate-700/50'
              }`}
            >
              <Award className="w-3.5 h-3.5" />
              <span>40 PTS</span>
            </button>
          </div>
        </div>

        {/* Tip */}
        <div className="px-5 py-3 bg-slate-950/80 border-t border-slate-800/80 flex items-center gap-2 text-xs text-slate-400">
          <Sparkles className="w-3.5 h-3.5 text-amber-400 shrink-0" />
          <span>Every finished level automatically adds +1 Point to your balance.</span>
        </div>
      </div>
    </div>
  );
};
