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
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 select-none animate-in fade-in duration-200">
      <div className="w-full max-w-md bg-white border border-slate-200 rounded-3xl flex flex-col overflow-hidden shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100 bg-slate-50/80">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-amber-50 border border-amber-200 flex items-center justify-center text-amber-700">
              <Award className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-900">Hint & Reward Shop</h2>
              <p className="text-xs text-slate-500">Earn 1 Point per cleared chamber · 10 Pts = 1 Help</p>
            </div>
          </div>
          <button
            onClick={onClose}
            aria-label="Close"
            className="p-1.5 rounded-xl bg-slate-100 text-slate-500 hover:text-slate-900 hover:bg-slate-200 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Balance Card */}
        <div className="p-4 bg-slate-50 border-b border-slate-200/80 flex items-center justify-around">
          <div className="flex flex-col items-center">
            <span className="text-xs text-slate-500 font-medium">Your Points</span>
            <div className="flex items-center gap-1.5 mt-0.5">
              <Award className="w-4 h-4 text-amber-600" />
              <span className="text-xl font-bold font-mono text-amber-800 tabular-nums">
                {progress.points}
              </span>
            </div>
          </div>

          <div className="w-px h-8 bg-slate-200" />

          <div className="flex flex-col items-center">
            <span className="text-xs text-slate-500 font-medium">Available Hints</span>
            <div className="flex items-center gap-1.5 mt-0.5">
              <span className="text-base">💡</span>
              <span className="text-xl font-bold font-mono text-emerald-700 tabular-nums">
                {progress.helpsRemaining}
              </span>
            </div>
          </div>
        </div>

        {/* Purchase Notification */}
        {purchaseSuccess && (
          <div className="mx-4 mt-3 px-3 py-2 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs flex items-center gap-2">
            <Check className="w-4 h-4 text-emerald-600" />
            <span className="font-semibold">{purchaseSuccess}</span>
          </div>
        )}

        {/* Shop Items */}
        <div className="p-4 space-y-2.5">
          {/* Item 1: Standard 1 Help for 10 Points */}
          <div className="p-3.5 rounded-2xl bg-white border border-slate-200 flex items-center justify-between shadow-xs">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-amber-50 border border-amber-200 flex items-center justify-center text-lg">
                💡
              </div>
              <div className="flex flex-col">
                <span className="text-sm font-bold text-slate-900">1 Chamber Solution Help</span>
                <span className="text-xs text-slate-500">Shows cube push arrows & auto-test</span>
              </div>
            </div>

            <button
              onClick={() => handlePurchase(1, 10, '1 Help')}
              disabled={progress.points < 10}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all active:scale-95 cursor-pointer ${
                progress.points >= 10
                  ? 'bg-amber-500 hover:bg-amber-600 text-white shadow-xs'
                  : 'bg-slate-100 text-slate-400 cursor-not-allowed'
              }`}
            >
              10 Pts
            </button>
          </div>

          {/* Item 2: Bundle 3 Helps for 25 Points (Discounted!) */}
          <div className="p-3.5 rounded-2xl bg-white border border-amber-200 flex items-center justify-between shadow-xs relative overflow-hidden">
            <div className="absolute top-0 right-0 px-2 py-0.5 bg-amber-500 text-white text-[9px] font-black uppercase rounded-bl-lg">
              POPULAR
            </div>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-50 border border-emerald-200 flex items-center justify-center text-lg">
                ✨
              </div>
              <div className="flex flex-col">
                <div className="flex items-center gap-1.5">
                  <span className="text-sm font-bold text-slate-900">3 Chamber Helps Pack</span>
                  <span className="text-[10px] px-1.5 py-0.2 bg-emerald-100 text-emerald-800 font-bold rounded">SAVE 5 PTS</span>
                </div>
                <span className="text-xs text-slate-500">3 complete chamber walkthroughs</span>
              </div>
            </div>

            <button
              onClick={() => handlePurchase(3, 25, '3 Helps')}
              disabled={progress.points < 25}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all active:scale-95 cursor-pointer ${
                progress.points >= 25
                  ? 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-xs'
                  : 'bg-slate-100 text-slate-400 cursor-not-allowed'
              }`}
            >
              25 Pts
            </button>
          </div>

          {/* Item 3: Mega 10 Helps for 75 Points */}
          <div className="p-3.5 rounded-2xl bg-white border border-slate-200 flex items-center justify-between shadow-xs">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-indigo-50 border border-indigo-200 flex items-center justify-center text-lg">
                🏆
              </div>
              <div className="flex flex-col">
                <span className="text-sm font-bold text-slate-900">10 Chamber Helps Vault</span>
                <span className="text-xs text-slate-500">Unlimited testing for master levels</span>
              </div>
            </div>

            <button
              onClick={() => handlePurchase(10, 75, '10 Helps')}
              disabled={progress.points < 75}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all active:scale-95 cursor-pointer ${
                progress.points >= 75
                  ? 'bg-slate-900 hover:bg-slate-800 text-white shadow-xs'
                  : 'bg-slate-100 text-slate-400 cursor-not-allowed'
              }`}
            >
              75 Pts
            </button>
          </div>
        </div>

        {/* Tip Footer */}
        <div className="p-3.5 bg-slate-50 border-t border-slate-100 text-center text-xs text-slate-500">
          💡 Solve any chamber to earn +1 Point automatically!
        </div>
      </div>
    </div>
  );
};
