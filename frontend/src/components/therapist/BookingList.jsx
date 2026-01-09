// src/components/therapist/BookingList.jsx
import React, { useState } from "react";

function human(dt) {
  try {
    return new Date(dt).toLocaleString();
  } catch (e) {
    return dt;
  }
}

export default function BookingList({ bookings = [], token, refresh }) {
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [sessionNotes, setSessionNotes] = useState("");
  const [sessionOutcome, setSessionOutcome] = useState("");
  const [completing, setCompleting] = useState(false);

  async function completeSession() {
    if (!selectedBooking) return;
    
    setCompleting(true);
    try {
      const r = await fetch(`http://127.0.0.1:8000/api/bookings/${selectedBooking.id}/complete`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          session_notes: sessionNotes,
          session_outcome: sessionOutcome
        })
      });

      if (!r.ok) {
        const j = await r.json();
        alert(j.detail || "Failed to complete session");
        return;
      }

      alert("Session completed and recorded successfully!");
      setSelectedBooking(null);
      setSessionNotes("");
      setSessionOutcome("");
      refresh && refresh();
    } catch (err) {
      console.error(err);
      alert("Network error while completing session");
    } finally {
      setCompleting(false);
    }
  }

  if (!bookings || bookings.length === 0) return <div className="text-sm text-gray-500">No upcoming bookings.</div>;

  return (
    <>
      <div className="space-y-3">
        {bookings.map(b => (
          <div key={b.id} className="p-3 border rounded flex items-center justify-between">
            <div>
              <div className="font-semibold text-[#4D2B8C]">{b.patient_name || `Patient ${b.patient_id}`}</div>
              <div className="text-xs text-gray-500">{human(b.datetime)}</div>
              <div className="text-sm text-gray-600 mt-1">{b.notes}</div>
            </div>
            <div className="space-y-2 text-right">
              <div className={`inline-block px-2 py-1 rounded ${b.status === 'scheduled' ? 'bg-[#FFEF5F] text-[#4D2B8C]' : b.status === 'completed' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'}`}>
                {b.status}
              </div>
              {b.status === 'scheduled' && (
                <button
                  onClick={() => setSelectedBooking(b)}
                  className="block w-full px-3 py-1 bg-[#4D2B8C] text-white text-sm rounded hover:bg-[#85409D]"
                >
                  End Session
                </button>
              )}
            </div>
          </div>
        ))}
      </div>

      {selectedBooking && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-lg p-6 max-w-md w-full mx-4">
            <h3 className="text-lg font-semibold text-[#4D2B8C] mb-4">
              Complete Session - {selectedBooking.patient_name || `Patient ${selectedBooking.patient_id}`}
            </h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Session Notes</label>
                <textarea
                  value={sessionNotes}
                  onChange={e => setSessionNotes(e.target.value)}
                  className="w-full h-24 p-2 border rounded-lg"
                  placeholder="Record notes from the session..."
                  disabled={completing}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Session Outcome</label>
                <textarea
                  value={sessionOutcome}
                  onChange={e => setSessionOutcome(e.target.value)}
                  className="w-full h-20 p-2 border rounded-lg"
                  placeholder="Summary of session outcome and recommendations..."
                  disabled={completing}
                />
              </div>

              <div className="flex gap-2 justify-end">
                <button
                  onClick={() => {
                    setSelectedBooking(null);
                    setSessionNotes("");
                    setSessionOutcome("");
                  }}
                  disabled={completing}
                  className="px-4 py-2 border rounded-lg hover:bg-gray-50 disabled:opacity-60"
                >
                  Cancel
                </button>
                <button
                  onClick={completeSession}
                  disabled={completing}
                  className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-60"
                >
                  {completing ? "Saving..." : "Complete & Record"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
