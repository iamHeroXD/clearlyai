import React from 'react';
import { ToastNotification } from '../types';

interface ModalsProps {
  toasts: ToastNotification[];
  onDismissToast: (id: string) => void;
}

export const Modals: React.FC<ModalsProps> = ({ toasts, onDismissToast }) => {
  return (
    <div className="fixed bottom-5 right-5 z-50 flex flex-col gap-2 pointer-events-none select-none">
      {toasts.map((toast) => (
        <div
          key={toast.id}
          onClick={() => onDismissToast(toast.id)}
          className={`pointer-events-auto px-4 py-3 rounded-2xl border shadow-xl flex items-center gap-3 backdrop-blur-2xl animate-fade-in cursor-pointer text-xs font-medium transition-all ${
            toast.type === 'success'
              ? 'bg-[var(--paper-card)] border-emerald-500/40 text-emerald-700'
              : toast.type === 'error'
              ? 'bg-[var(--paper-card)] border-red-500/40 text-red-700'
              : 'bg-[var(--paper-card)] border-[var(--line)] text-[var(--ink)]'
          }`}
        >
          <span className="w-2 h-2 rounded-full bg-current" />
          <span>{toast.message}</span>
        </div>
      ))}
    </div>
  );
};
