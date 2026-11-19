import React, { useState } from 'react';
import { X, Award, Check, Lightbulb, Sparkles, Trophy } from 'lucide-react';
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
      setPurchaseSuccess(`Purchased ${label}`);
      setTimeout(() => setPurchaseSuccess(null), 2500);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-[#1f242c]/60 backdrop-blur-sm flex items-center justify-center p-4 select-none animate-in fade-in duration-200">
      <div className="w-full max-w-md bg-[#f7f4ed] border border-[#d5cdc0] rounded-3xl flex flex-col overflow-hidden shadow-2xl">
        <div className="flex items-center justify-between px-5 py-4 border-b border-[#e4ddd0] bg-[#efeae0]">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-[#fef3c7] border border-[#f59e0b]/40 flex items-center justify-center text-[#b45309]">
              <Award className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-extrabold text-[#1f242c]">Hint Shop</h2>
              <p className="text-xs text-[#665f54]">1 Point per cleared chamber · 10 pts = 1 hint</p>
            </div>
          </div>
          <button
            onClick={onClose}
            aria-label="Close"
            className="p-1.5 rounded-xl bg-[#e3dccf] text-[#4e483e] hover:text-[#1f242c] transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Balance Strip */}
        <div className="p-4 bg-[#f2ede3] border-b border-[#e4ddd0] flex items-center justify-around">
          <div className="flex flex-col items-center">
            <span className="text-xs text-[#665f54] font-medium">Points Balance</span>
            <div className="flex items-center gap-1.5 mt-0.5">
              <Award className="w-4 h-4 text-[#d97706]" />
              <span className="text-xl font-bold font-mono text-[#92400e] tabular-nums">
                {progress.points}
              </span>
            </div>
          </div>

          <div className="w-px h-8 bg-[#d5cdc0]" />

          <div className="flex flex-col items-center">
            <span className="text-xs text-[#665f54] font-medium">Available Hints</span>
            <div className="flex items-center gap-1.5 mt-0.5">
              <Lightbulb className="w-4 h-4 text-[#0d9488]" />
              <span className="text-xl font-bold font-mono text-[#0f766e] tabular-nums">
                {progress.helpsRemaining}
              </span>
            </div>
          </div>
        </div>

        {purchaseSuccess && (
          <div className="mx-4 mt-3 px-3 py-2 rounded-xl bg-[#e6f4f1] border border-[#0d9488]/40 text-[#0f766e] text-xs flex items-center gap-2 font-semibold">
            <Check className="w-4 h-4" />
            <span>{purchaseSuccess}</span>
          </div>
        )}

        <div className="p-4 space-y-2.5">
          {/* 1 Hint */}
          <div className="p-3.5 rounded-2xl bg-white/85 border border-[#d8d0c2] flex items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-[#fef3c7] border border-[#f59e0b]/40 flex items-center justify-center text-[#b45309]">
                <Lightbulb className="w-5 h-5" />
              </div>
              <div className="flex flex-col">
                <span className="text-sm font-bold text-[#1f242c]">1 Chamber Hint</span>
                <span className="text-xs text-[#665f54]">Full push arrows & auto-solve</span>
              </div>
            </div>

            <button
              onClick={() => handlePurchase(1, 10, '1 Hint')}
              disabled={progress.points < 10}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold font-mono tabular-nums whitespace-nowrap transition-all cursor-pointer ${
                progress.points >= 10
                  ? 'bg-[#d97706] hover:bg-[#b45309] text-white active:scale-95'
                  : 'bg-[#e8e2d6] text-[#9b9282] cursor-not-allowed'
              }`}
            >
              10 pts
            </button>
          </div>

          {/* 3 Hints Pack */}
          <div className="p-3.5 rounded-2xl bg-white/95 border border-[#d97706]/50 flex items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-[#e6f4f1] border border-[#0d9488]/40 flex items-center justify-center text-[#0f766e]">
                <Sparkles className="w-5 h-5" />
              </div>
              <div className="flex flex-col">
                <span className="text-sm font-bold text-[#1f242c]">3 Hints Pack · Save 5 pts</span>
                <span className="text-xs text-[#665f54]">Three full chamber solutions</span>
              </div>
            </div>

            <button
              onClick={() => handlePurchase(3, 25, '3 Hints')}
              disabled={progress.points < 25}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold font-mono tabular-nums whitespace-nowrap transition-all cursor-pointer ${
                progress.points >= 25
                  ? 'bg-[#0f766e] hover:bg-[#115e59] text-white active:scale-95'
                  : 'bg-[#e8e2d6] text-[#9b9282] cursor-not-allowed'
              }`}
            >
              25 pts
            </button>
          </div>

          {/* 10 Hints Vault */}
          <div className="p-3.5 rounded-2xl bg-white/85 border border-[#d8d0c2] flex items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-[#eae4d7] border border-[#ccc3b3] flex items-center justify-center text-[#282e37]">
                <Trophy className="w-5 h-5" />
              </div>
              <div className="flex flex-col">
                <span className="text-sm font-bold text-[#1f242c]">10 Hints Vault</span>
                <span className="text-xs text-[#665f54]">Master supply for hard chambers</span>
              </div>
            </div>

            <button
              onClick={() => handlePurchase(10, 75, '10 Hints')}
              disabled={progress.points < 75}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold font-mono tabular-nums whitespace-nowrap transition-all cursor-pointer ${
                progress.points >= 75
                  ? 'bg-[#272d37] hover:bg-[#1f242c] text-white active:scale-95'
                  : 'bg-[#e8e2d6] text-[#9b9282] cursor-not-allowed'
              }`}
            >
              75 pts
            </button>
          </div>
        </div>

        <div className="p-3.5 bg-[#efeae0] border-t border-[#e4ddd0] text-center text-xs text-[#665f54]">
          Solve any chamber to earn +1 point automatically.
        </div>
      </div>
    </div>
  );
};
