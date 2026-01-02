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
      // try standard bookings endpoint
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
    <form onSubmit={submitRequest} className="space-y-3">
      <div>
        <label className="block text-sm font-medium">Select date & time</label>
        <input type="datetime-local" value={dt} onChange={e=>setDt(e.target.value)} className="w-full p-2 border rounded" />
      </div>

      <div>
        <label className="block text-sm font-medium">Notes (optional)</label>
        <textarea value={notes} onChange={e=>setNotes(e.target.value)} rows={3} className="w-full p-2 border rounded" />
      </div>

      <div className="flex gap-2">
        <button type="submit" disabled={loading} className="btn-primary">{loading ? "Requesting..." : "Request Booking"}</button>
        <button type="button" onClick={()=>onCancel && onCancel()} className="px-3 py-1 bg-slate-100 rounded">Cancel</button>
      </div>
    </form>
  );
}
