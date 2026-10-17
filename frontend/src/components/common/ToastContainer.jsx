import React from 'react';
import { useApp } from '../../context/AppContext';
import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react';

export const ToastContainer = () => {
  const { toasts } = useApp();

  if (toasts.length === 0) return null;

  return (
    <div className="fixed bottom-5 right-5 z-50 flex flex-col gap-2 max-w-md w-full px-4">
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className={`flex items-center gap-3 p-4 rounded-lg shadow-ambient border transition-all animate-bounce-short text-sm font-medium ${
            toast.type === 'success'
              ? 'bg-forest-800 text-white border-forest-700'
              : toast.type === 'error'
              ? 'bg-red-900 text-white border-red-800'
              : 'bg-tan-600 text-white border-tan-700'
          }`}
        >
          {toast.type === 'success' && <CheckCircle2 className="w-5 h-5 text-tan-300 shrink-0" />}
          {toast.type === 'error' && <AlertCircle className="w-5 h-5 text-red-300 shrink-0" />}
          {toast.type === 'info' && <Info className="w-5 h-5 text-tan-200 shrink-0" />}
          <div className="flex-1">{toast.message}</div>
        </div>
      ))}
    </div>
  );
};
