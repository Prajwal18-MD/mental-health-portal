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

  useEffect(() => {
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
    <Modal open={open} onClose={onClose} title={`${patient?.name || "Patient"} - Details`} size="xl">
      <div className="space-y-6">
        {/* Mood Analytics Section */}
        <div className="glass-card p-5 rounded-2xl">
          <h4 className="font-display font-bold text-xl text-gray-900 mb-4 flex items-center gap-2">
            <svg className="w-6 h-6 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
            </svg>
            📈 Mood Timeline
          </h4>
          <AnalyticsChart token={token} range={30} patientId={patient?.id} />
        </div>

        {/* Past Sessions Section */}
        <div className="glass-card p-5 rounded-2xl">
          <h4 className="font-display font-bold text-xl text-primary-800 mb-4 flex items-center gap-2">
            <svg className="w-6 h-6 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            🕐 Past Sessions
          </h4>
          {loading ? (
            <div className="flex items-center justify-center py-8">
              <svg className="animate-spin h-8 w-8 text-primary-500" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
              </svg>
            </div>
          ) : (
            <div className="space-y-3 max-h-64 overflow-y-auto pr-2">
              {sessions.length === 0 && (
                <div className="text-center py-8">
                  <svg className="w-12 h-12 text-gray-300 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <p className="text-sm text-gray-500">No sessions recorded yet</p>
                </div>
              )}
              {sessions.map(s => (
                <div key={s.id} className="p-4 bg-white border-2 border-gray-100 rounded-xl hover:border-primary-200 transition-all">
                  <div className="text-sm font-semibold text-gray-900 mb-2">
                    {new Date(s.session_at || s.created_at || s.createdAt || Date.now()).toLocaleString('en-US', {
                      weekday: 'short',
                      year: 'numeric',
                      month: 'short',
                      day: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </div>
                  {s.notes && <div className="text-sm text-gray-700 mb-2">{s.notes}</div>}
                  {s.outcome && (
                    <div className="mt-2 p-2 bg-green-50 rounded-lg border border-green-200">
                      <div className="text-xs font-semibold text-green-900">Outcome:</div>
                      <div className="text-xs text-green-800 mt-1">{s.outcome}</div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Actions Section */}
        <div className="glass-card p-5 rounded-2xl">
          <h4 className="font-display font-bold text-xl text-primary-800 mb-4 flex items-center gap-2">
            <svg className="w-6 h-6 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            </svg>
            ⚡ Quick Actions
          </h4>
          <div className="space-y-4">
            <BookingForm token={token} patientId={patient?.id} onSaved={(b) => { onSaved && onSaved(b); }} />
            <SessionForm token={token} patientId={patient?.id} onSaved={(s) => { onSaved && onSaved(s); }} />
          </div>
        </div>
      </div>
    </Modal>
  );
}
