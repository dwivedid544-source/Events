import React from 'react';
import { useApp } from '../../context/AppContext';
import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react';

export const ToastContainer = () => {
  const { toasts, removeToast } = useApp();

  if (!toasts || toasts.length === 0) return null;

  return (
    <div className="fixed top-20 right-6 z-[9999] flex flex-col gap-2.5 max-w-sm w-full pointer-events-none px-2 sm:px-0">
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className={`pointer-events-auto flex items-center justify-between gap-3 p-3.5 rounded-xl shadow-2xl border transition-all animate-fade-in text-xs font-bold ${
            toast.type === 'success'
              ? 'bg-forest-900 text-white border-forest-700 shadow-forest-950/40'
              : toast.type === 'error'
              ? 'bg-red-950 text-white border-red-800 shadow-red-950/40'
              : 'bg-tan-700 text-white border-tan-600 shadow-tan-950/40'
          }`}
        >
          <div className="flex items-center gap-2.5 min-w-0">
            {toast.type === 'success' && <CheckCircle2 className="w-4 h-4 text-tan-400 shrink-0" />}
            {toast.type === 'error' && <AlertCircle className="w-4 h-4 text-red-400 shrink-0" />}
            {toast.type === 'info' && <Info className="w-4 h-4 text-tan-300 shrink-0" />}
            <span className="truncate">{toast.message}</span>
          </div>
          <button
            onClick={() => removeToast && removeToast(toast.id)}
            className="text-white/60 hover:text-white shrink-0 p-1 rounded hover:bg-white/10 transition-colors"
            title="Dismiss notification"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      ))}
    </div>
  );
};

