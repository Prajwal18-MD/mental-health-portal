// src/components/ExportData.jsx
import React from "react";

function toCSV(rows) {
  if (!rows || !rows.length) return "";
  const keys = ["id","date","sentiment","risk","text","created_at"];
  const header = keys.join(",") + "\n";
  const body = rows.map(r => keys.map(k => `"${String(r[k] ?? "").replace(/"/g,'""')}"`).join(",")).join("\n");
  return header + body;
}

export default function ExportData({ data, filename="export.csv" }) {
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

  return <button onClick={handleExport} className="px-3 py-1 bg-slate-100 rounded text-sm">Export CSV</button>;
}
