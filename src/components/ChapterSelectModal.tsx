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
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 select-none animate-in fade-in duration-200">
      <div className="w-full max-w-lg bg-white border border-slate-200 rounded-3xl flex flex-col max-h-[85vh] overflow-hidden shadow-2xl">
        {/* Modal Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100 bg-slate-50/80">
          <div>
            <h2 className="text-lg font-bold text-slate-900">Select Chapter</h2>
            <p className="text-xs text-slate-500">20 Unique Chapters · 100 Chambers Each</p>
          </div>
          <button
            onClick={onClose}
            aria-label="Close"
            className="p-1.5 rounded-xl bg-slate-100 text-slate-500 hover:text-slate-900 hover:bg-slate-200 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Chapter List */}
        <div className="flex-1 overflow-y-auto p-4 space-y-2">
          {CHAPTERS.map(chapter => {
            const stats = getChapterProgress(chapter.id, progress.levelsCompleted);
            const isUnlocked = chapter.id <= (progress.unlockedChapter || 1);
            const isCurrent = progress.currentChapter === chapter.id;

            return (
              <div
                key={`chapter-${chapter.id}`}
                onClick={() => isUnlocked && onSelectChapter(chapter.id)}
                className={`p-3.5 rounded-2xl border transition-all flex items-center justify-between ${
                  !isUnlocked
                    ? 'bg-slate-50/70 border-slate-200/60 opacity-60 cursor-not-allowed'
                    : isCurrent
                    ? 'bg-emerald-50/60 border-emerald-400 shadow-xs cursor-pointer hover:bg-emerald-50'
                    : 'bg-white border-slate-200 hover:border-slate-300 hover:bg-slate-50 cursor-pointer shadow-xs'
                }`}
              >
                {/* Left: Chapter Number & Title */}
                <div className="flex items-center gap-3.5">
                  <div
                    className={`w-10 h-10 rounded-xl flex items-center justify-center font-bold text-sm font-mono ${
                      !isUnlocked
                        ? 'bg-slate-100 text-slate-400'
                        : isCurrent
                        ? 'bg-emerald-600 text-white font-black shadow-xs'
                        : 'bg-slate-100 text-slate-700'
                    }`}
                  >
                    {!isUnlocked ? <Lock className="w-4 h-4 text-slate-400" /> : chapter.id}
                  </div>

                  <div className="flex flex-col">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-bold text-slate-900">{chapter.title}</span>
                      {stats.isCompleted && (
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                      )}
                    </div>
                    <span className="text-xs text-slate-500">{chapter.subtitle}</span>
                  </div>
                </div>

                {/* Right: Progress bar & Count */}
                <div className="flex items-center gap-3">
                  <div className="flex flex-col items-end">
                    <span className="text-xs font-mono font-medium text-slate-600">
                      {stats.completedCount} / 100
                    </span>
                    <div className="w-16 h-1.5 bg-slate-200 rounded-full mt-1 overflow-hidden">
                      <div
                        className="h-full bg-emerald-500 rounded-full transition-all"
                        style={{ width: `${(stats.completedCount / 100) * 100}%` }}
                      />
                    </div>
                  </div>
                  <ChevronRight className="w-4 h-4 text-slate-400" />
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
