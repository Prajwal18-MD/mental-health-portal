// src/components/AnalyticsModal.jsx
import React from "react";
import Modal from "./ui/Modal";
import AnalyticsChart from "./AnalyticsChart";

export default function AnalyticsModal({ token, open, onClose }) {
  return (
    <Modal open={open} onClose={onClose} title="Mood Analytics">
      <div style={{ minHeight: 300 }}>
        <AnalyticsChart token={token} range={30} />
      </div>
    </Modal>
  );
}
