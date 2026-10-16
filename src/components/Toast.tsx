import React from 'react';

interface ToastProps {
  message: string | null;
  type?: 'info' | 'warning' | 'success';
}

export const Toast: React.FC<ToastProps> = ({ message, type = 'info' }) => {
  if (!message) return null;

  return (
    <div className="fixed top-14 left-1/2 -translate-x-1/2 z-50 pointer-events-none animate-in fade-in slide-in-from-top-2 duration-150 max-w-xs w-full px-4">
      <div
        className={`w-full py-2.5 px-4 rounded-xl border text-xs font-semibold text-center shadow-xl backdrop-blur-md ${
          type === 'warning'
            ? 'bg-amber-950/90 border-amber-500/50 text-amber-200'
            : type === 'success'
            ? 'bg-emerald-950/90 border-emerald-500/50 text-emerald-200'
            : 'bg-slate-900/90 border-slate-700/80 text-slate-100'
        }`}
      >
        {message}
      </div>
    </div>
  );
};
