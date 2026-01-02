// src/components/RecommendationsModal.jsx
import React from "react";
import Modal from "./ui/Modal";
import Recommendations from "./Recommendations";

export default function RecommendationsModal({ token, open, onClose }) {
  return (
    <Modal open={open} onClose={onClose} title="Recommendations">
      <div>
        <Recommendations token={token} />
      </div>
    </Modal>
  );
}
