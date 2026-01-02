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
    <Modal open={open} onClose={onClose} title="Quick chat — short support">
      <div className="space-y-4">
        <div className="text-sm text-gray-600">
          This chat provides brief coping suggestions. If it doesn't help, you can request a therapist below.
        </div>

        <div style={{ height: 360 }} className="border rounded overflow-hidden">
          {/* ChatWidget is expected to manage its scroll / messages internally */}
          <ChatWidget token={token} />
        </div>

        <div className="flex justify-end gap-2 mt-2">
          <button
            onClick={onClose}
            className="px-3 py-1 rounded border bg-white hover:bg-slate-50"
          >
            Close
          </button>

          <button
            onClick={() => {
              if (typeof onNotSatisfied === "function") onNotSatisfied();
            }}
            className="px-3 py-1 rounded bg-[#EEA727] text-[#4D2B8C] font-medium hover:brightness-95"
          >
            Not satisfied — Request therapist
          </button>
        </div>
      </div>
    </Modal>
  );
}
