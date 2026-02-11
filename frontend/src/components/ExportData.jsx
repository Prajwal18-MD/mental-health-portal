// src/components/ExportData.jsx
import React from "react";

function toCSV(rows) {
  if (!rows || !rows.length) return "";
  const keys = ["id", "date", "sentiment", "risk", "text", "created_at"];
  const header = keys.join(",") + "\n";
  const body = rows.map(r => keys.map(k => `"${String(r[k] ?? "").replace(/"/g, '""')}"`).join(",")).join("\n");
  return header + body;
}

export default function ExportData({ data, filename = "export.csv" }) {
  function handleExport() {
    if (!data || data.length === 0) {
      alert("No data to export");
      return;
    }
    const csv = toCSV(data);
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
  }

  return (
    <button
      onClick={handleExport}
      className="btn-glass px-4 py-2 text-sm flex items-center gap-2 hover-scale"
    >
      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
      </svg>
      Export CSV
    </button>
  );
}
