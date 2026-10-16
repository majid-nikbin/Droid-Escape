import React from 'react';
import { X, Lock, CheckCircle2, ChevronRight } from 'lucide-react';
import { CHAPTERS, getChapterProgress } from '../utils/levelGenerator';
import { UserProgress } from '../types/game';

interface ChapterSelectModalProps {
  progress: UserProgress;
  onSelectChapter: (chapterId: number) => void;
  onClose: () => void;
}

export const ChapterSelectModal: React.FC<ChapterSelectModalProps> = ({
  progress,
  onSelectChapter,
  onClose,
}) => {
  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 select-none">
      <div className="w-full max-w-lg bg-slate-900 border border-slate-800 rounded-2xl flex flex-col max-h-[85vh] overflow-hidden shadow-2xl">
        {/* Modal Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-slate-800 bg-slate-950/60">
          <div>
            <h2 className="text-lg font-bold text-white">Select Chapter</h2>
            <p className="text-xs text-slate-400">20 Unique Chapters · 100 Levels Each</p>
          </div>
          <button
            onClick={onClose}
            aria-label="Close"
            className="p-1.5 rounded-lg bg-slate-800 text-slate-400 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Chapter List */}
        <div className="flex-1 overflow-y-auto p-4 space-y-2.5">
          {CHAPTERS.map(chapter => {
            const stats = getChapterProgress(chapter.id, progress.levelsCompleted);
            const isUnlocked = chapter.id <= (progress.unlockedChapter || 1);
            const isCurrent = progress.currentChapter === chapter.id;

            return (
              <div
                key={`chapter-${chapter.id}`}
                onClick={() => isUnlocked && onSelectChapter(chapter.id)}
                className={`p-3.5 rounded-xl border transition-all flex items-center justify-between ${
                  !isUnlocked
                    ? 'bg-slate-950/50 border-slate-800/60 opacity-60 cursor-not-allowed'
                    : isCurrent
                    ? 'bg-slate-800/90 border-emerald-500/80 shadow-md shadow-emerald-500/10 cursor-pointer hover:bg-slate-800'
                    : 'bg-slate-900/80 border-slate-800 hover:border-slate-700 hover:bg-slate-800/50 cursor-pointer'
                }`}
              >
                {/* Left: Chapter Number & Title */}
                <div className="flex items-center gap-3.5">
                  <div
                    className={`w-10 h-10 rounded-xl flex items-center justify-center font-bold text-sm font-mono ${
                      !isUnlocked
                        ? 'bg-slate-800 text-slate-500'
                        : isCurrent
                        ? 'bg-emerald-500 text-slate-950 font-black'
                        : 'bg-slate-800 text-slate-200'
                    }`}
                  >
                    {!isUnlocked ? <Lock className="w-4 h-4" /> : chapter.id}
                  </div>

                  <div className="flex flex-col">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-bold text-white">{chapter.title}</span>
                      {stats.isCompleted && (
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                      )}
                    </div>
                    <span className="text-xs text-slate-400">{chapter.subtitle}</span>
                  </div>
                </div>

                {/* Right: Progress bar & Count */}
                <div className="flex items-center gap-3">
                  <div className="flex flex-col items-end">
                    <span className="text-xs font-mono font-medium text-slate-300">
                      {stats.completedCount} / 100
                    </span>
                    <div className="w-16 h-1.5 bg-slate-800 rounded-full mt-1 overflow-hidden">
                      <div
                        className="h-full bg-emerald-500 rounded-full transition-all"
                        style={{ width: `${(stats.completedCount / 100) * 100}%` }}
                      />
                    </div>
                  </div>
                  <ChevronRight className="w-4 h-4 text-slate-500" />
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
