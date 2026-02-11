// src/components/therapist/BookingList.jsx
import React, { useState } from "react";

function human(dt) {
  try {
    return new Date(dt).toLocaleString('en-US', {
      weekday: 'short',
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
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

      alert("✓ Session completed and recorded successfully!");
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

  const getStatusBadge = (status) => {
    if (status === 'scheduled') {
      return <span className="px-3 py-1 rounded-full text-xs font-bold bg-accent-100 text-accent-700 border border-accent-300">Scheduled</span>;
    } else if (status === 'completed') {
      return <span className="px-3 py-1 rounded-full text-xs font-bold bg-green-100 text-green-700 border border-green-300">Completed</span>;
    }
    return <span className="px-3 py-1 rounded-full text-xs font-bold bg-gray-100 text-gray-700">{status}</span>;
  };

  return (
    <>
      <div className="space-y-3 max-h-[600px] overflow-y-auto pr-2">
        {bookings.map((b, idx) => (
          <div
            key={b.id}
            className="bg-white p-5 rounded-xl border-2 border-gray-100 hover:border-primary-300 hover:shadow-medium transition-all animate-slideUp"
            style={{ animationDelay: `${idx * 50}ms` }}
          >
            <div className="flex items-start justify-between gap-4">
              {/* Left Content */}
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-3">
                  {/* Avatar */}
                  <div className="w-10 h-10 rounded-full bg-gradient-accent flex items-center justify-center text-gray-900 font-bold text-sm">
                    {(b.patient_name || "P")[0].toUpperCase()}
                  </div>
                  <div>
                    <div className="font-semibold text-gray-900">{b.patient_name || `Patient ${b.patient_id}`}</div>
                    <div className="text-xs text-gray-500 flex items-center gap-1">
                      <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                      {human(b.datetime)}
                    </div>
                  </div>
                </div>

                {/* Notes */}
                {b.notes && (
                  <div className="p-3 bg-blue-50 rounded-lg border border-blue-200 mt-3">
                    <p className="text-xs font-semibold text-blue-900 mb-1">Patient Notes:</p>
                    <p className="text-sm text-gray-700">{b.notes}</p>
                  </div>
                )}
              </div>

              {/* Right Actions */}
              <div className="flex flex-col items-end gap-3">
                {getStatusBadge(b.status)}

                {b.status === 'scheduled' && (
                  <button
                    onClick={() => setSelectedBooking(b)}
                    className="btn-primary px-4 py-2 text-sm flex items-center gap-2"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    Complete Session
                  </button>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Complete Session Modal */}
      {selectedBooking && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fadeIn">
          <div className="glass-card rounded-3xl shadow-large max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
            {/* Modal Header */}
            <div className="p-6 border-b border-gray-200">
              <h3 className="text-2xl font-display font-bold text-gray-900 mb-2">
                Complete Session
              </h3>
              <p className="text-sm text-gray-600">
                {selectedBooking.patient_name || `Patient ${selectedBooking.patient_id}`} • {human(selectedBooking.datetime)}
              </p>
            </div>

            {/*Modal Content */}
            <div className="p-6 space-y-5">
              {/* Session Notes */}
              <div>
                <label className="flex items-center gap-2 mb-3 font-semibold text-gray-800">
                  <svg className="w-5 h-5 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                  </svg>
                  Session Notes
                </label>
                <textarea
                  value={sessionNotes}
                  onChange={e => setSessionNotes(e.target.value)}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-primary-500 focus:ring-4 focus:ring-primary-100 transition-all resize-none"
                  rows="6"
                  placeholder="Record detailed notes from the session..."
                  disabled={completing}
                />
                <p className="text-xs text-gray-400 mt-2">{sessionNotes.length} characters</p>
              </div>

              {/* Session Outcome */}
              <div>
                <label className="flex items-center gap-2 mb-3 font-semibold text-gray-800">
                  <svg className="w-5 h-5 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  Session Outcome & Recommendations
                </label>
                <textarea
                  value={sessionOutcome}
                  onChange={e => setSessionOutcome(e.target.value)}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-primary-500 focus:ring-4 focus:ring-primary-100 transition-all resize-none"
                  rows="4"
                  placeholder="Summarize the outcome and any recommendations..."
                  disabled={completing}
                />
                <p className="text-xs text-gray-400 mt-2">{sessionOutcome.length} characters</p>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="p-6 border-t border-gray-200 flex gap-3">
              <button
                onClick={() => {
                  setSelectedBooking(null);
                  setSessionNotes("");
                  setSessionOutcome("");
                }}
                disabled={completing}
                className="flex-1 px-6 py-3 rounded-xl border-2 border-gray-300 text-gray-700 font-semibold hover:bg-gray-50 transition-all disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                onClick={completeSession}
                disabled={completing}
                className="flex-1 btn-primary py-3 flex items-center justify-center gap-2 disabled:opacity-50"
              >
                {completing ? (
                  <>
                    <svg className="animate-spin h-5 w-5" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                    </svg>
                    Saving...
                  </>
                ) : (
                  <>
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    Complete & Record
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
