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
    <div className="fixed inset-0 z-50 bg-[#050a14]/75 backdrop-blur-sm flex items-center justify-center p-3 select-none animate-in fade-in duration-200">
      <div className="w-full max-w-lg bg-[#14233c] border border-[#2a4269] rounded-3xl flex flex-col max-h-[90vh] overflow-hidden shadow-2xl">
        <div className="flex items-center justify-between px-5 py-3.5 border-b border-[#22385c] bg-[#101c31]">
          <div className="flex items-center gap-2">
            <button
              onClick={() => onChangeChapter(-1)}
              disabled={chapterId <= 1}
              aria-label="Previous Chapter"
              className="p-1.5 rounded-xl bg-[#1b2f50] text-[#edf3fc] disabled:opacity-30 disabled:cursor-not-allowed hover:bg-[#233b63] cursor-pointer"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>

            <div>
              <h2 className="text-sm font-extrabold text-[#edf3fc]">
                Chapter {chapterId}: {chapter.title}
              </h2>
              <p className="text-[11px] text-[#90a7c7]">Select Chamber (1–100)</p>
            </div>

            <button
              onClick={() => onChangeChapter(1)}
              disabled={chapterId >= CHAPTERS.length}
              aria-label="Next Chapter"
              className="p-1.5 rounded-xl bg-[#1b2f50] text-[#edf3fc] disabled:opacity-30 disabled:cursor-not-allowed hover:bg-[#233b63] cursor-pointer"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>

          <button
            onClick={onClose}
            aria-label="Close"
            className="p-1.5 rounded-xl bg-[#1b2f50] text-[#9bb0cf] hover:text-white cursor-pointer"
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
                      ? 'bg-[#d97706] text-white shadow-md scale-105 border border-[#fbbf24]'
                      : completedData
                      ? 'bg-[#0e393a] border border-[#14b8a6]/60 text-[#5eead4] hover:bg-[#134a4b]'
                      : 'bg-[#1a2c4a] border border-[#2b436b] text-[#edf3fc] hover:bg-[#22395e]'
                  }`}
                >
                  <span>{lvl}</span>
                  {completedData && (
                    <div className="flex items-center gap-0.5 mt-0.5">
                      {Array.from({ length: Math.min(completedData.stars || 1, 3) }).map((_, sIdx) => (
                        <Star key={sIdx} className="w-2 h-2 fill-[#fbbf24] text-[#fbbf24]" />
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
