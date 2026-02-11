// src/components/PatientBookingForm.jsx
import React, { useState } from "react";

/**
 * Props:
 *  - token
 *  - onSaved(booking)
 *  - onCancel()
 */
export default function PatientBookingForm({ token, onSaved, onCancel }) {
  const [dt, setDt] = useState("");
  const [notes, setNotes] = useState("");
  const [loading, setLoading] = useState(false);

  async function submitRequest(e) {
    e && e.preventDefault();
    if (!token) { alert("Please login"); return; }
    if (!dt) { alert("Please choose date & time"); return; }

    setLoading(true);
    try {
      const payload = { datetime: dt, notes };
      const r = await fetch("http://127.0.0.1:8000/api/bookings", {
        method: "POST",
        headers: { "Content-Type": "application/json", "Authorization": `Bearer ${token}` },
        body: JSON.stringify(payload)
      });
      const j = await r.json();
      if (r.ok) {
        onSaved && onSaved(j);
        return;
      }

      // fallback to auto endpoint
      console.warn("Bookings POST failed, falling back to auto:", j);
      const rb = await fetch("http://127.0.0.1:8000/api/bookings/auto", {
        method: "POST",
        headers: { "Authorization": `Bearer ${token}` }
      });
      const jr = await rb.json();
      if (rb.ok) onSaved && onSaved(jr);
      else alert(jr.detail || JSON.stringify(jr));
    } catch (err) {
      console.error(err);
      alert("Network error while creating booking");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={submitRequest} className="space-y-5">
      {/* Date & Time Picker */}
      <div className="glass-card p-5 rounded-2xl">
        <label className="flex items-center gap-2 mb-3 font-semibold text-gray-800">
          <svg className="w-5 h-5 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
          Select Date & Time
        </label>
        <input
          type="datetime-local"
          value={dt}
          onChange={e => setDt(e.target.value)}
          className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-primary-500 focus:ring-4 focus:ring-primary-100 transition-all"
          min={new Date().toISOString().slice(0, 16)}
        />
        <p className="text-xs text-gray-500 mt-2 flex items-center gap-1">
          <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          Choose a time that works best for you
        </p>
      </div>

      {/* Notes Textarea */}
      <div className="glass-card p-5 rounded-2xl">
        <label className="flex items-center gap-2 mb-3 font-semibold text-gray-800">
          <svg className="w-5 h-5 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z" />
          </svg>
          Additional Notes <span className="text-gray-400 font-normal text-sm">(Optional)</span>
        </label>
        <textarea
          value={notes}
          onChange={e => setNotes(e.target.value)}
          rows={4}
          className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-primary-500 focus:ring-4 focus:ring-primary-100 transition-all resize-none"
          placeholder="Describe what you'd like to discuss or any specific concerns..."
        />
        <div className="flex items-center justify-between mt-2">
          <p className="text-xs text-gray-500 flex items-center gap-1">
            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
            Your information is confidential
          </p>
          <p className="text-xs text-gray-400">
            {notes.length} characters
          </p>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row gap-3">
        <button
          type="submit"
          disabled={loading || !dt}
          className="flex-1 btn-primary py-4 text-lg flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? (
            <>
              <svg className="animate-spin h-5 w-5" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
              </svg>
              Requesting Session...
            </>
          ) : (
            <>
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              Request Booking
            </>
          )}
        </button>

        {onCancel && (
          <button
            type="button"
            onClick={() => onCancel && onCancel()}
            className="px-6 py-4 rounded-xl border-2 border-gray-300 text-gray-700 font-semibold hover:bg-gray-50 transition-all"
          >
            Cancel
          </button>
        )}
      </div>

      {/* Help Text */}
      <div className="p-4 bg-purple-50 rounded-xl border border-purple-200">
        <p className="text-sm text-purple-900">
          <strong>📌 What happens next:</strong> A therapist will be assigned to your booking. You'll receive confirmation once approved.
        </p>
      </div>
    </form>
  );
}
