import React from 'react';
import { X } from 'lucide-react';

export const Modal = ({ isOpen, onClose, title, children, maxWidth = 'max-w-md' }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-charcoal/60 backdrop-blur-xs animate-fade-in">
      <div
        className={`bg-surface-lowest w-full ${maxWidth} rounded-xl shadow-ambient-lg border border-surface-border overflow-hidden flex flex-col max-h-[90vh]`}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="px-5 py-4 border-b border-surface-border flex items-center justify-between bg-surface-low/50">
          <h3 className="font-extrabold text-base text-forest-800 tracking-tight">{title}</h3>
          <button
            onClick={onClose}
            className="text-charcoal-light hover:text-charcoal p-1 rounded-full hover:bg-surface-low transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-5 overflow-y-auto flex-1">{children}</div>
      </div>
    </div>
  );
};
