// frontend/src/components/ChatModal.jsx
import React from "react";
import Modal from "./ui/Modal";
import ChatWidget from "./ChatWidget";

/**
 * ChatModal
 * Props:
 *  - open (bool)            : whether modal is visible
 *  - onClose (fn)          : close modal
 *  - onNotSatisfied (fn)   : called when user chooses to escalate to booking
 *  - token (string)        : auth token (passed into ChatWidget)
 */
export default function ChatModal({ open, onClose, onNotSatisfied, token }) {
  return (
    <Modal open={open} onClose={onClose} title="Quick Support Chat" size="lg">
      <div className="space-y-5">
        {/* Info Banner */}
        <div className="p-4 bg-blue-50 border-l-4 border-blue-500 rounded-lg">
          <div className="flex items-start gap-3">
            <svg className="w-5 h-5 text-blue-600 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <div className="flex-1">
              <p className="text-sm text-blue-900 font-medium">Quick Coping Support</p>
              <p className="text-xs text-blue-700 mt-1">
                Get brief suggestions and coping strategies. If you need more support, you can request a therapist session below.
              </p>
            </div>
          </div>
        </div>

        {/* Chat Widget */}
        <div className="glass-card rounded-2xl overflow-hidden" style={{ height: 400 }}>
          <ChatWidget token={token} />
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row justify-end gap-3">
          <button
            onClick={onClose}
            className="px-6 py-3 rounded-xl border-2 border-gray-300 text-gray-700 font-semibold hover:bg-gray-50 transition-all"
          >
            Close Chat
          </button>

          <button
            onClick={() => {
              if (typeof onNotSatisfied === "function") onNotSatisfied();
            }}
            className="px-6 py-3 rounded-xl bg-gradient-accent text-gray-900 font-semibold hover:shadow-glow-accent transition-all flex items-center justify-center gap-2"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            Book Therapist Session
          </button>
        </div>
      </div>
    </Modal>
  );
}
