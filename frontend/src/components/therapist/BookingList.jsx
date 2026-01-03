// src/components/therapist/BookingList.jsx
import React from "react";

function human(dt) {
  try {
    return new Date(dt).toLocaleString();
  } catch (e) {
    return dt;
  }
}

export default function BookingList({ bookings = [], token, refresh }) {
  if (!bookings || bookings.length === 0) return <div className="text-sm text-gray-500">No upcoming bookings.</div>;

  return (
    <div className="space-y-3">
      {bookings.map(b => (
        <div key={b.id} className="p-3 border rounded flex items-center justify-between">
          <div>
            <div className="font-semibold text-[#4D2B8C]">{b.patient_name || `Patient ${b.patient_id}`}</div>
            <div className="text-xs text-gray-500">{human(b.datetime)}</div>
            <div className="text-sm text-gray-600 mt-1">{b.notes}</div>
          </div>
          <div className="space-y-2 text-right">
            <div className={`inline-block px-2 py-1 rounded ${b.status === 'scheduled' ? 'bg-[#FFEF5F] text-[#4D2B8C]' : 'bg-gray-100 text-gray-700'}`}>
              {b.status}
            </div>
            <div>
              {/* future: add accept/decline actions */}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
