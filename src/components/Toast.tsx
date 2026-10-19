import React from 'react';

interface ToastProps {
  message: string | null;
  type?: 'info' | 'warning' | 'success';
}

export const Toast: React.FC<ToastProps> = ({ message, type = 'info' }) => {
  if (!message) return null;

  return (
    <div className="fixed top-14 left-1/2 -translate-x-1/2 z-50 pointer-events-none animate-in fade-in slide-in-from-top-2 duration-150 max-w-sm w-full px-4">
      <div
        className={`w-full py-2.5 px-4 rounded-2xl border text-xs font-semibold text-center shadow-lg backdrop-blur-md ${
          type === 'warning'
            ? 'bg-amber-50 border-amber-300 text-amber-950'
            : type === 'success'
            ? 'bg-emerald-50 border-emerald-300 text-emerald-950'
            : 'bg-slate-900 border-slate-700 text-white'
        }`}
      >
        {message}
      </div>
    </div>
  );
};
