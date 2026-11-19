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
    <div className="fixed inset-0 z-50 bg-[#050a14]/75 backdrop-blur-sm flex items-center justify-center p-4 select-none animate-in fade-in duration-200">
      <div className="w-full max-w-lg bg-[#14233c] border border-[#2a4269] rounded-3xl flex flex-col max-h-[85vh] overflow-hidden shadow-2xl">
        <div className="flex items-center justify-between px-5 py-4 border-b border-[#22385c] bg-[#101c31]">
          <div>
            <h2 className="text-lg font-extrabold text-[#edf3fc]">Select Chapter</h2>
            <p className="text-xs text-[#90a7c7]">20 Chapters · 100 Chambers Each</p>
          </div>
          <button
            onClick={onClose}
            aria-label="Close"
            className="p-1.5 rounded-xl bg-[#1b2f50] text-[#9bb0cf] hover:text-white transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

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
                    ? 'bg-[#101c31]/80 border-[#1e3252] opacity-55 cursor-not-allowed'
                    : isCurrent
                    ? 'bg-[#0e393a]/70 border-[#14b8a6] shadow-xs cursor-pointer'
                    : 'bg-[#1a2c4a] border-[#2b436b] hover:border-[#3e6096] hover:bg-[#1e3457] cursor-pointer'
                }`}
              >
                <div className="flex items-center gap-3.5">
                  <div
                    className={`w-10 h-10 rounded-xl flex items-center justify-center font-bold text-sm font-mono tabular-nums ${
                      !isUnlocked
                        ? 'bg-[#14233c] text-[#5e7599]'
                        : isCurrent
                        ? 'bg-[#0f766e] text-white font-black'
                        : 'bg-[#22385c] text-[#edf3fc]'
                    }`}
                  >
                    {!isUnlocked ? <Lock className="w-4 h-4 text-[#5e7599]" /> : chapter.id}
                  </div>

                  <div className="flex flex-col">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-bold text-[#edf3fc]">{chapter.title}</span>
                      {stats.isCompleted && (
                        <CheckCircle2 className="w-3.5 h-3.5 text-[#2dd4bf]" />
                      )}
                    </div>
                    <span className="text-xs text-[#90a7c7]">{chapter.subtitle}</span>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="flex flex-col items-end">
                    <span className="text-xs font-mono font-semibold text-[#c9d7ee] tabular-nums">
                      {stats.completedCount}/100
                    </span>
                    <div className="w-16 h-1.5 bg-[#0e192d] rounded-full mt-1 overflow-hidden">
                      <div
                        className="h-full bg-[#14b8a6] rounded-full transition-all"
                        style={{ width: `${stats.completedCount}%` }}
                      />
                    </div>
                  </div>
                  <ChevronRight className="w-4 h-4 text-[#6d83a6]" />
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
