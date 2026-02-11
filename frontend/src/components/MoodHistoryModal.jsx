// src/components/MoodHistoryModal.jsx
import { useEffect, useState } from "react";
import Modal from "./ui/Modal";
import ExportData from "./ExportData";

export default function MoodHistoryModal({ token, open, onClose }) {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => { if (open) fetchHistory(); }, [open]);

  async function fetchHistory() {
    if (!token) return;
    setLoading(true);
    try {
      const r = await fetch("http://127.0.0.1:8000/api/mood", { headers: { Authorization: `Bearer ${token}` } });
      const j = await r.json();
      if (r.ok) setItems(j || []);
      else setItems([]);
    } catch (err) {
      console.error(err);
      setItems([]);
    } finally {
      setLoading(false);
    }
  }

  function formatDate(dateStr) {
    if (!dateStr) return "Unknown date";
    try {
      const date = new Date(dateStr);
      if (isNaN(date.getTime())) return dateStr;
      return date.toLocaleString('en-US', {
        weekday: 'short',
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch (e) {
      return dateStr;
    }
  }

  const getRiskColor = (risk) => {
    const r = (risk || "").toString().toUpperCase();
    if (r === "HIGH") return "bg-red-100 border-red-300 text-red-800";
    if (r === "MEDIUM") return "bg-yellow-100 border-yellow-300 text-yellow-800";
    return "bg-green-100 border-green-300 text-green-800";
  };

  const getRiskLabel = (risk) => {
    const r = (risk || "").toString().toUpperCase();
    if (r === "HIGH") return "High Risk";
    if (r === "MEDIUM") return "Medium Risk";
    if (r === "LOW") return "Low Risk";
    return "Unknown";
  };

  return (
    <Modal open={open} onClose={onClose} title="📝 Mood History" size="lg">
      <div className="space-y-4">
        {/* Header with count and export */}
        <div className="flex justify-between items-center p-4 bg-primary-50 rounded-xl">
          <div className="flex items-center gap-3">
            <svg className="w-6 h-6 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
            </svg>
            <div>
              <div className="font-bold text-lg text-primary-800">📊 {items.length} Total Entries</div>
              <div className="text-sm font-semibold text-primary-700">💭 Track your emotional journey</div>
            </div>
          </div>
          <ExportData data={items} filename={`mood-data-${new Date().toISOString().slice(0, 10)}.csv`} />
        </div>

        {/* Loading State */}
        {loading && (
          <div className="flex items-center justify-center py-12">
            <div className="text-center">
              <svg className="animate-spin h-10 w-10 text-primary-500 mx-auto mb-3" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
              </svg>
              <div className="text-sm text-gray-600">Loading your mood history...</div>
            </div>
          </div>
        )}

        {/* Empty State */}
        {!loading && items.length === 0 && (
          <div className="text-center py-12">
            <svg className="w-16 h-16 text-gray-300 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            <div className="text-base font-medium text-gray-700 mb-1">No mood entries yet</div>
            <div className="text-sm text-gray-500">Start tracking your feelings to see your history here</div>
          </div>
        )}

        {/* Entries List */}
        {!loading && items.length > 0 && (
          <ul className="space-y-3 max-h-[60vh] overflow-auto pr-2">
            {items.map((entry, idx) => (
              <div
                key={entry.id}
                className="p-4 bg-white rounded-xl border-2 border-gray-100 hover:border-primary-200 hover:shadow-medium transition-all animate-slideUp"
                style={{ animationDelay: `${idx * 50}ms` }}
              >
                {/* Date and Risk Badge */}
                <div className="flex items-start justify-between gap-3 mb-3">
                  <div className="text-sm font-semibold text-gray-700 flex-1">
                    {formatDate(entry.date || entry.created_at || entry.createdAt)}
                  </div>
                  <span className={`px-3 py-1 rounded-full text-xs font-bold border ${getRiskColor(entry.risk ?? entry.risk_level)}`}>
                    {getRiskLabel(entry.risk ?? entry.risk_level)}
                  </span>
                </div>

                {/* Mood Text */}
                <div className="text-sm text-gray-800 leading-relaxed mb-3 bg-white/50 p-3 rounded-lg">
                  {entry.text || <span className="text-gray-400 italic">— no note —</span>}
                </div>

                {/* Sentiment Indicator */}
                {entry.sentiment !== undefined && entry.sentiment !== null && (
                  <div className="flex items-center gap-2">
                    <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
                      <div
                        className={`h-full ${entry.sentiment > 0 ? 'bg-green-500' : 'bg-red-500'}`}
                        style={{ width: `${Math.abs(entry.sentiment) * 100}%` }}
                      />
                    </div>
                    <span className="text-xs font-medium text-gray-600">
                      {entry.sentiment > 0 ? "Positive" : "Negative"} ({Math.abs(entry.sentiment).toFixed(2)})
                    </span>
                  </div>
                )}
              </div>
            ))}
          </ul>
        )}
      </div>
    </Modal>
  );
}
