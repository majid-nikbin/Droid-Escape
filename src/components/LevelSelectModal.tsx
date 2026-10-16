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
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-3 select-none">
      <div className="w-full max-w-lg bg-slate-900 border border-slate-800 rounded-2xl flex flex-col max-h-[90vh] overflow-hidden shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-3.5 border-b border-slate-800 bg-slate-950/60">
          <div className="flex items-center gap-2">
            <button
              onClick={() => onChangeChapter(-1)}
              disabled={chapterId <= 1}
              aria-label="Previous Chapter"
              className="p-1 rounded-lg bg-slate-800 text-slate-300 disabled:opacity-30 disabled:cursor-not-allowed hover:bg-slate-700"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>

            <div>
              <h2 className="text-sm font-bold text-white">
                Chapter {chapterId}: {chapter.title}
              </h2>
              <p className="text-[11px] text-slate-400">Select Level (1 - 100)</p>
            </div>

            <button
              onClick={() => onChangeChapter(1)}
              disabled={chapterId >= CHAPTERS.length}
              aria-label="Next Chapter"
              className="p-1 rounded-lg bg-slate-800 text-slate-300 disabled:opacity-30 disabled:cursor-not-allowed hover:bg-slate-700"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>

          <button
            onClick={onClose}
            aria-label="Close"
            className="p-1.5 rounded-lg bg-slate-800 text-slate-400 hover:text-white"
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
                  className={`aspect-square rounded-xl flex flex-col items-center justify-center p-1 text-xs font-mono font-bold transition-all relative ${
                    isCurrent
                      ? 'bg-emerald-500 text-slate-950 shadow-md shadow-emerald-500/30 scale-105'
                      : completedData
                      ? 'bg-slate-800 border border-emerald-500/40 text-emerald-300 hover:bg-slate-700'
                      : 'bg-slate-950/80 border border-slate-800/80 text-slate-400 hover:bg-slate-800 hover:text-white'
                  }`}
                >
                  <span>{lvl}</span>
                  {completedData && (
                    <div className="flex items-center gap-0.5 mt-0.5">
                      {Array.from({ length: Math.min(completedData.stars || 1, 3) }).map((_, sIdx) => (
                        <Star key={sIdx} className="w-2 h-2 fill-amber-400 text-amber-400" />
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
