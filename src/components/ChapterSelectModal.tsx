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
    <div className="fixed inset-0 z-50 bg-[#1f242c]/60 backdrop-blur-sm flex items-center justify-center p-4 select-none animate-in fade-in duration-200">
      <div className="w-full max-w-lg bg-[#f7f4ed] border border-[#d5cdc0] rounded-3xl flex flex-col max-h-[85vh] overflow-hidden shadow-2xl">
        <div className="flex items-center justify-between px-5 py-4 border-b border-[#e4ddd0] bg-[#efeae0]">
          <div>
            <h2 className="text-lg font-extrabold text-[#1f242c]">Select Chapter</h2>
            <p className="text-xs text-[#665f54]">20 Chapters · 100 Chambers Each</p>
          </div>
          <button
            onClick={onClose}
            aria-label="Close"
            className="p-1.5 rounded-xl bg-[#e3dccf] text-[#4e483e] hover:text-[#1f242c] transition-colors cursor-pointer"
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
                    ? 'bg-[#efeae0]/70 border-[#ded7c8] opacity-60 cursor-not-allowed'
                    : isCurrent
                    ? 'bg-[#e6f4f1] border-[#0d9488] shadow-xs cursor-pointer'
                    : 'bg-white/85 border-[#d8d0c2] hover:border-[#b9b09f] hover:bg-white cursor-pointer'
                }`}
              >
                <div className="flex items-center gap-3.5">
                  <div
                    className={`w-10 h-10 rounded-xl flex items-center justify-center font-bold text-sm font-mono tabular-nums ${
                      !isUnlocked
                        ? 'bg-[#e3dccf] text-[#8c8374]'
                        : isCurrent
                        ? 'bg-[#0f766e] text-white font-black'
                        : 'bg-[#eae4d7] text-[#282e37]'
                    }`}
                  >
                    {!isUnlocked ? <Lock className="w-4 h-4 text-[#8c8374]" /> : chapter.id}
                  </div>

                  <div className="flex flex-col">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-bold text-[#1f242c]">{chapter.title}</span>
                      {stats.isCompleted && (
                        <CheckCircle2 className="w-3.5 h-3.5 text-[#0f766e]" />
                      )}
                    </div>
                    <span className="text-xs text-[#665f54]">{chapter.subtitle}</span>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="flex flex-col items-end">
                    <span className="text-xs font-mono font-semibold text-[#4e483e] tabular-nums">
                      {stats.completedCount}/100
                    </span>
                    <div className="w-16 h-1.5 bg-[#dfd8ca] rounded-full mt-1 overflow-hidden">
                      <div
                        className="h-full bg-[#0d9488] rounded-full transition-all"
                        style={{ width: `${stats.completedCount}%` }}
                      />
                    </div>
                  </div>
                  <ChevronRight className="w-4 h-4 text-[#8c8374]" />
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
