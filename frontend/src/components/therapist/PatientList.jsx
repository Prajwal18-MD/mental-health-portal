// src/components/therapist/PatientList.jsx
import React from "react";

export default function PatientList({ patients = [], loading = false, onSelect }) {
  if (loading) return <div className="text-sm text-gray-500">Loading patients...</div>;
  if (!patients || patients.length === 0) return <div className="text-sm text-gray-500">No patients yet.</div>;

  const getRiskColor = (risk) => {
    const r = (risk || "").toLowerCase();
    if (r === "high") return { bg: "bg-red-100", text: "text-red-700", border: "border-red-300" };
    if (r === "medium") return { bg: "bg-yellow-100", text: "text-yellow-700", border: "border-yellow-300" };
    return { bg: "bg-green-100", text: "text-green-700", border: "border-green-300" };
  };

  const getSentimentIcon = (sentiment) => {
    if (sentiment > 0) {
      return (
        <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      );
    } else if (sentiment < 0) {
      return (
        <svg className="w-5 h-5 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      );
    }
    return (
      <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    );
  };

  return (
    <div className="space-y-3 max-h-[600px] overflow-y-auto pr-2">
      {patients.map((p, idx) => {
        const riskColors = getRiskColor(p.latest_mood_risk);
        return (
          <div
            key={p.id}
            className="bg-white p-4 rounded-xl border-2 border-gray-100 hover:border-primary-300 hover:shadow-medium transition-all cursor-pointer animate-slideUp"
            style={{ animationDelay: `${idx * 50}ms` }}
            onClick={() => onSelect && onSelect(p)}
          >
            <div className="flex items-start gap-3">
              {/* Avatar */}
              <div className="w-12 h-12 rounded-full bg-gradient-primary flex items-center justify-center flex-shrink-0 text-white font-bold">
                {(p.name || "U")[0].toUpperCase()}
              </div>

              {/* Content */}
              <div className="flex-1 min-w-0">
                <div className="font-semibold text-gray-900 mb-1">{p.name || "Unknown"}</div>
                <div className="text-xs text-gray-500 mb-2 break-all">{p.email}</div>

                {/* Status Row */}
                <div className="flex flex-wrap items-center gap-2">
                  {/* Sentiment */}
                  <div className="flex items-center gap-1">
                    {getSentimentIcon(p.latest_mood_sentiment)}
                  </div>

                  {/* Risk Badge */}
                  <span className={`px-2 py-1 rounded-lg text-xs font-semibold ${riskColors.bg} ${riskColors.text} border ${riskColors.border}`}>
                    {p.latest_mood_risk || "—"}
                  </span>
                </div>
              </div>

              {/* Arrow Icon */}
              <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </div>
          </div>
        );
      })}
    </div>
  );
}
