import React from 'react';

interface ToastProps {
  message: string | null;
  type?: 'info' | 'warning' | 'success';
}

export const Toast: React.FC<ToastProps> = ({ message, type = 'info' }) => {
  if (!message) return null;

  return (
    <div className="fixed top-16 left-1/2 -translate-x-1/2 z-50 pointer-events-none animate-in fade-in slide-in-from-top-2 duration-150 max-w-sm w-full px-4">
      <div
        className={`w-full py-2.5 px-4 rounded-xl border text-xs font-semibold text-center shadow-lg ${
          type === 'warning'
            ? 'bg-[#fffbeb] border-[#f59e0b]/60 text-[#78350f]'
            : type === 'success'
            ? 'bg-[#ecfdf5] border-[#0d9488]/50 text-[#115e59]'
            : 'bg-[#282e37] border-[#3d4552] text-[#f5f3ee]'
        }`}
      >
        {message}
      </div>
    </div>
  );
};
