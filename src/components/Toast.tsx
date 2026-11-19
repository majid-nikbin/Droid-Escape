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
        className={`w-full py-2.5 px-4 rounded-xl border text-xs font-semibold text-center shadow-xl backdrop-blur-md ${
          type === 'warning'
            ? 'bg-[#36220a]/95 border-[#d97706]/60 text-[#fde68a]'
            : type === 'success'
            ? 'bg-[#0b3332]/95 border-[#14b8a6]/55 text-[#99f6e4]'
            : 'bg-[#182946]/95 border-[#34517d] text-[#edf3fc]'
        }`}
      >
        {message}
      </div>
    </div>
  );
};
