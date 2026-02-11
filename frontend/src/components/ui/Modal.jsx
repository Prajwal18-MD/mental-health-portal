// src/components/ui/Modal.jsx
import React from "react";

export default function Modal({ open, onClose, title, children, footer, size = 'md' }) {
  if (!open) return null;

  const sizeClasses = {
    sm: 'max-w-md',
    md: 'max-w-2xl',
    lg: 'max-w-4xl',
    xl: 'max-w-6xl',
  };

  return (
    <div className="modal-backdrop" onMouseDown={onClose} role="dialog" aria-modal="true">
      <div
        className={`modal-container ${sizeClasses[size]} mx-4`}
        onMouseDown={e => e.stopPropagation()}
      >
        {/* Header with gradient */}
        <div className="bg-gradient-primary p-5 text-white relative overflow-hidden">
          {/* Decorative gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent" />

          <div className="relative flex items-center justify-between">
            <h2 className="font-display font-bold text-xl text-white drop-shadow-lg">{title}</h2>
            <button
              onClick={onClose}
              aria-label="Close modal"
              className="w-8 h-8 rounded-lg hover:bg-white/20 transition-all flex items-center justify-center group"
            >
              <svg className="w-5 h-5 group-hover:rotate-90 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 max-h-[70vh] overflow-y-auto">
          {children}
        </div>

        {/* Footer */}
        {footer && (
          <div className="p-5 border-t border-gray-200 bg-gray-50/50">
            {footer}
          </div>
        )}
      </div>
    </div>
  );
}
