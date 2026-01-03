// src/components/therapist/PatientModal.jsx
import { useEffect, useState } from "react";
import Modal from "../ui/Modal";
import AnalyticsChart from "../AnalyticsChart";
// NOTE: use the exact function name from your services/api.js
import { listSessionsApi } from "../../services/api";
import BookingForm from "./BookingForm";
import SessionForm from "./SessionForm";

export default function PatientModal({ open, onClose, patient, token, onSaved }) {
  const [sessions, setSessions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(()=> {
    if (!patient || !token) {
      setSessions([]);
      setLoading(false);
      return;
    }

    let mounted = true;
    setLoading(true);

    // listSessionsApi(token, { patient_id: <id> }) is the correct API call in your api.js
    listSessionsApi(token, { patient_id: patient.id })
      .then(result => {
        if (!mounted) return;

        // API may return:
        // 1) an array directly
        // 2) { sessions: [...] }
        // 3) { data: [...] }
        // 4) { ... } with another shape
        let arr = [];
        if (Array.isArray(result)) arr = result;
        else if (result && Array.isArray(result.sessions)) arr = result.sessions;
        else if (result && Array.isArray(result.data)) arr = result.data;
        else arr = [];

        setSessions(arr);
      })
      .catch(err => {
        console.error("Failed to load sessions for patient:", err);
        setSessions([]);
      })
      .finally(() => {
        if (mounted) setLoading(false);
      });

    return () => { mounted = false; };
  }, [patient, token]);

  return (
    <Modal open={open} onClose={onClose} title={`${patient?.name || "Patient"} — details`}>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <h4 className="font-semibold text-[#4D2B8C]">Mood timeline</h4>
          {/* Ensure AnalyticsChart supports patientId (see optional patch below). */}
          <AnalyticsChart token={token} range={30} patientId={patient?.id} />
        </div>

        <div>
          <h4 className="font-semibold text-[#4D2B8C] mb-2">Past sessions</h4>
          {loading ? (
            <div className="text-sm text-gray-500">Loading sessions...</div>
          ) : (
            <div className="space-y-2 max-h-56 overflow-auto">
              {sessions.length === 0 && <div className="text-sm text-gray-500">No sessions recorded.</div>}
              {sessions.map(s => (
                <div key={s.id} className="p-2 border rounded bg-white">
                  <div className="text-sm font-medium">{ new Date(s.session_at || s.created_at || s.createdAt || Date.now()).toLocaleString() }</div>
                  <div className="text-xs text-gray-600 mt-1">{s.notes}</div>
                  {s.outcome && <div className="text-xs text-gray-500 mt-1">Outcome: {s.outcome}</div>}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <BookingForm token={token} patientId={patient?.id} onSaved={(b)=>{ onSaved && onSaved(b); }} />
        </div>
        <div>
          <SessionForm token={token} patientId={patient?.id} onSaved={(s)=>{ onSaved && onSaved(s); }} />
        </div>
      </div>
    </Modal>
  );
}
