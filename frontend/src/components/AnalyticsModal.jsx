// src/components/AnalyticsModal.jsx
import React from "react";
import Modal from "./ui/Modal";
import AnalyticsChart from "./AnalyticsChart";

export default function AnalyticsModal({ token, open, onClose }) {
  return (
    <Modal open={open} onClose={onClose} title="📊 Mood Analytics" size="lg">
      <div className="space-y-4">
        <div className="p-4 bg-primary-50 rounded-xl">
          <p className="text-sm text-primary-900 font-medium">📊 Your Emotional Journey</p>
          <p className="text-xs text-primary-600 mt-1">Track patterns and trends in your mood over time</p>
        </div>
        <div style={{ minHeight: 350 }} className="glass-card rounded-2xl p-4">
          <AnalyticsChart token={token} range={30} />
        </div>
      </div>
    </Modal>
  );
}
