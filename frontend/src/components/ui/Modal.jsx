// src/components/ui/Modal.jsx
import React from 'react';

export default function Modal({ open, onClose, title, children, footer }) {
  if (!open) return null;

  return (
    <div className="modal-backdrop" onMouseDown={onClose} role="dialog" aria-modal="true">
      <div className="modal-container" onMouseDown={e => e.stopPropagation()}>
        <div className="bg-primary-gradient p-4 text-white">
          <div className="flex items-center justify-between">
            <div className="font-semibold">{title}</div>
            <button onClick={onClose} aria-label="Close modal" className="px-2 py-1 rounded hover:bg-white/10">✕</button>
          </div>
        </div>
        <div className="p-6">
          {children}
        </div>
        {footer ? <div className="p-4 border-t">{footer}</div> : null}
      </div>
    </div>
  );
}
