// src/components/therapist/SessionForm.jsx
import { useState } from "react";
import { createSessionApi } from "../../services/api";

export default function SessionForm({ token, patientId, onSaved }) {
  const [notes, setNotes] = useState("");
  const [outcome, setOutcome] = useState("");
  const [busy, setBusy] = useState(false);

  async function submit(e) {
    e && e.preventDefault();
    if (!patientId) { alert("Missing patient id"); return; }
    setBusy(true);
    try {
      const payload = { patient_id: patientId, notes, outcome };
      const res = await createSessionApi(token, payload);
      if (res && res.id) {
        alert("Session saved");
        onSaved && onSaved(res);
        setNotes(""); setOutcome("");
      } else {
        alert(res.detail || "Failed to save session");
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
      <h4 className="font-semibold text-[#4D2B8C]">Record Session</h4>
      <textarea value={notes} onChange={e=>setNotes(e.target.value)} placeholder="Session notes" className="w-full p-2 border rounded mt-2" />
      <input value={outcome} onChange={e=>setOutcome(e.target.value)} placeholder="Outcome (summary)" className="w-full p-2 border rounded mt-2" />
      <button type="submit" disabled={busy} className="mt-3 px-4 py-2 bg-[#4D2B8C] text-white rounded">
        {busy ? "Saving..." : "Save Session"}
      </button>
    </form>
  );
}
