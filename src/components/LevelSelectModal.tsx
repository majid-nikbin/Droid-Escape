import React from 'react';
import { X, ChevronLeft, ChevronRight, Star } from 'lucide-react';
import { CHAPTERS } from '../utils/levelGenerator';
import { UserProgress } from '../types/game';

interface LevelSelectModalProps {
  chapterId: number;
  progress: UserProgress;
  onSelectLevel: (chapterId: number, levelId: number) => void;
  onChangeChapter: (delta: number) => void;
  onClose: () => void;
}

export const LevelSelectModal: React.FC<LevelSelectModalProps> = ({
  chapterId,
  progress,
  onSelectLevel,
  onChangeChapter,
  onClose,
}) => {
  const chapter = CHAPTERS[chapterId - 1] || CHAPTERS[0];

  return (
    <div className="fixed inset-0 z-50 bg-[#1f242c]/60 backdrop-blur-sm flex items-center justify-center p-3 select-none animate-in fade-in duration-200">
      <div className="w-full max-w-lg bg-[#f7f4ed] border border-[#d5cdc0] rounded-3xl flex flex-col max-h-[90vh] overflow-hidden shadow-2xl">
        <div className="flex items-center justify-between px-5 py-3.5 border-b border-[#e4ddd0] bg-[#efeae0]">
          <div className="flex items-center gap-2">
            <button
              onClick={() => onChangeChapter(-1)}
              disabled={chapterId <= 1}
              aria-label="Previous Chapter"
              className="p-1.5 rounded-xl bg-[#e3dccf] text-[#282e37] disabled:opacity-30 disabled:cursor-not-allowed hover:bg-[#d8d0c2] cursor-pointer"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>

            <div>
              <h2 className="text-sm font-extrabold text-[#1f242c]">
                Chapter {chapterId}: {chapter.title}
              </h2>
              <p className="text-[11px] text-[#665f54]">Select Chamber (1–100)</p>
            </div>

            <button
              onClick={() => onChangeChapter(1)}
              disabled={chapterId >= CHAPTERS.length}
              aria-label="Next Chapter"
              className="p-1.5 rounded-xl bg-[#e3dccf] text-[#282e37] disabled:opacity-30 disabled:cursor-not-allowed hover:bg-[#d8d0c2] cursor-pointer"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>

          <button
            onClick={onClose}
            aria-label="Close"
            className="p-1.5 rounded-xl bg-[#e3dccf] text-[#4e483e] hover:text-[#1f242c] cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-4">
          <div className="grid grid-cols-5 sm:grid-cols-10 gap-2">
            {Array.from({ length: 100 }, (_, i) => i + 1).map(lvl => {
              const key = `${chapterId}-${lvl}`;
              const completedData = progress.levelsCompleted[key];
              const isCurrent = progress.currentChapter === chapterId && progress.currentLevel === lvl;

              return (
                <button
                  key={`lvl-btn-${lvl}`}
                  onClick={() => onSelectLevel(chapterId, lvl)}
                  className={`aspect-square rounded-xl flex flex-col items-center justify-center p-1 text-xs font-mono font-bold tabular-nums transition-all cursor-pointer ${
                    isCurrent
                      ? 'bg-[#272d37] text-white shadow-md scale-105 border border-[#d97706]'
                      : completedData
                      ? 'bg-[#e6f4f1] border border-[#0d9488]/60 text-[#0f766e] hover:bg-[#d5ede8]'
                      : 'bg-white/85 border border-[#d8d0c2] text-[#282e37] hover:bg-white'
                  }`}
                >
                  <span>{lvl}</span>
                  {completedData && (
                    <div className="flex items-center gap-0.5 mt-0.5">
                      {Array.from({ length: Math.min(completedData.stars || 1, 3) }).map((_, sIdx) => (
                        <Star key={sIdx} className="w-2 h-2 fill-[#d97706] text-[#d97706]" />
                      ))}
                    </div>
                  )}
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};
