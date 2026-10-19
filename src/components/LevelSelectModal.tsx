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
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-3 select-none animate-in fade-in duration-200">
      <div className="w-full max-w-lg bg-white border border-slate-200 rounded-3xl flex flex-col max-h-[90vh] overflow-hidden shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-3.5 border-b border-slate-100 bg-slate-50/80">
          <div className="flex items-center gap-2">
            <button
              onClick={() => onChangeChapter(-1)}
              disabled={chapterId <= 1}
              aria-label="Previous Chapter"
              className="p-1 rounded-xl bg-slate-100 text-slate-600 disabled:opacity-30 disabled:cursor-not-allowed hover:bg-slate-200 cursor-pointer"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>

            <div>
              <h2 className="text-sm font-bold text-slate-900">
                Chapter {chapterId}: {chapter.title}
              </h2>
              <p className="text-[11px] text-slate-500">Select Chamber (1 - 100)</p>
            </div>

            <button
              onClick={() => onChangeChapter(1)}
              disabled={chapterId >= CHAPTERS.length}
              aria-label="Next Chapter"
              className="p-1 rounded-xl bg-slate-100 text-slate-600 disabled:opacity-30 disabled:cursor-not-allowed hover:bg-slate-200 cursor-pointer"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>

          <button
            onClick={onClose}
            aria-label="Close"
            className="p-1.5 rounded-xl bg-slate-100 text-slate-500 hover:text-slate-900 hover:bg-slate-200 cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* 100 Level Grid */}
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
                  className={`aspect-square rounded-xl flex flex-col items-center justify-center p-1 text-xs font-mono font-bold transition-all relative cursor-pointer ${
                    isCurrent
                      ? 'bg-emerald-600 text-white shadow-md scale-105'
                      : completedData
                      ? 'bg-emerald-50 border border-emerald-300 text-emerald-800 hover:bg-emerald-100'
                      : 'bg-slate-50 border border-slate-200 text-slate-700 hover:bg-slate-100'
                  }`}
                >
                  <span>{lvl}</span>
                  {completedData && (
                    <div className="flex items-center gap-0.5 mt-0.5">
                      {Array.from({ length: Math.min(completedData.stars || 1, 3) }).map((_, sIdx) => (
                        <Star key={sIdx} className="w-2 h-2 fill-amber-400 text-amber-500" />
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
