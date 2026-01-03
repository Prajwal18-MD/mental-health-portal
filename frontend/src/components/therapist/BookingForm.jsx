// src/components/therapist/BookingForm.jsx
import { useEffect, useState } from "react";
import { createBooking } from "../../services/api";

export default function BookingForm({ token, patientId, onSaved }) {
  const [dt, setDt] = useState("");
  const [notes, setNotes] = useState("");
  const [busy, setBusy] = useState(false);

  useEffect(()=> {
    // set a default dt to next hour
    const d = new Date();
    d.setHours(d.getHours()+1, 0, 0, 0);
    setDt(d.toISOString().slice(0,16));
  }, [patientId]);

  async function submit(e) {
    e && e.preventDefault();
    if (!patientId) { alert("Missing patient id"); return; }
    setBusy(true);
    try {
      const payload = { patient_id: patientId, datetime: new Date(dt).toISOString(), notes };
      const res = await createBooking(token, payload);
      if (res && res.id) {
        alert("Booking created");
        onSaved && onSaved(res);
        setNotes("");
      } else {
        alert(res.detail || "Failed to create booking");
      }
    } catch (err) {
      console.error(err);
      alert("Network error");
    } finally {
      setBusy(false);
    }
  }

  return (
    <form onSubmit={submit} className="p-3 border rounded">
      <h4 className="font-semibold text-[#4D2B8C]">Create Booking</h4>
      <input type="datetime-local" value={dt} onChange={e=>setDt(e.target.value)} className="w-full p-2 border rounded mt-2" />
      <textarea value={notes} onChange={e=>setNotes(e.target.value)} placeholder="Notes" className="w-full p-2 border rounded mt-2" />
      <button type="submit" disabled={busy} className="mt-3 px-4 py-2 bg-[#EEA727] text-[#4D2B8C] rounded font-medium">
        {busy ? "Creating..." : "Create Booking"}
      </button>
    </form>
  );
}