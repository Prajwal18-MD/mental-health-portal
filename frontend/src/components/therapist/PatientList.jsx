// src/components/therapist/PatientList.jsx
import React from "react";

export default function PatientList({ patients = [], loading=false, onSelect }) {
  if (loading) return <div className="text-sm text-gray-500">Loading patients...</div>;
  if (!patients || patients.length === 0) return <div className="text-sm text-gray-500">No patients yet.</div>;

  return (
    <div className="space-y-2">
      {patients.map(p => (
        <div key={p.id} className="p-3 border rounded flex items-center justify-between hover:shadow-sm">
          <div>
            <div className="font-medium text-[#4D2B8C]">{p.name}</div>
            <div className="text-xs text-gray-500">{p.email}</div>
          </div>
          <div className="text-right">
            <div className="text-sm font-semibold">
              {p.latest_mood_value ? `${p.latest_mood_value}/10` : "—"}
            </div>
            <button onClick={()=>onSelect && onSelect(p)} className="mt-2 px-3 py-1 bg-[#EEA727] text-[#4D2B8C] rounded text-sm">Open</button>
          </div>
        </div>
      ))}
    </div>
  );
}
