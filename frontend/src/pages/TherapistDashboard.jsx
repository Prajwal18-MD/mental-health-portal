// frontend/src/pages/TherapistDashboard.jsx
import { useEffect, useState } from "react";
import { getTherapistPatients, getPatientDetail, createBooking, listBookingsApi, createSessionApi, listSessionsApi } from "../services/api";

export default function TherapistDashboard({ token }) {
  const [patients, setPatients] = useState([]);
  const [selected, setSelected] = useState(null);
  const [detail, setDetail] = useState(null);

  useEffect(()=> {
    if(!token) return;
    getTherapistPatients(token).then(setPatients).catch(err=>console.error(err));
  }, [token]);

  async function openPatient(id) {
    setSelected(id);
    const d = await getPatientDetail(token, id);
    setDetail(d);
  }

  return (
    <div className="p-4">
      <h2 className="text-xl font-semibold mb-3">Therapist Dashboard</h2>
      <div className="grid grid-cols-3 gap-4">
        <div className="col-span-1">
          <h3 className="font-semibold mb-2">Patients</h3>
          <div className="space-y-2">
            {patients.map(p=>(
              <div key={p.id} className="p-2 border rounded flex justify-between items-center">
                <div>
                  <div className="font-semibold">{p.name}</div>
                  <div className="text-xs text-gray-600">{p.email}</div>
                  <div className="text-xs mt-1">Latest: {p.latest_mood_value ?? "—"} <span className="ml-2 text-xs text-gray-500">risk: {p.latest_mood_risk ?? "—"}</span></div>
                </div>
                <button onClick={()=>openPatient(p.id)} className="px-2 py-1 bg-sky-600 text-white rounded">Open</button>
              </div>
            ))}
          </div>
        </div>

        <div className="col-span-2">
          {detail ? (
            <div className="space-y-3">
              <div className="p-3 border rounded">
                <h3 className="font-semibold">{detail.name} — {detail.email}</h3>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="p-3 border rounded">
                  <h4 className="font-semibold mb-2">Mood timeline</h4>
                  {detail.moods.length === 0 ? <div className="text-sm text-gray-500">No moods yet</div> :
                    <ul className="space-y-2">
                      {detail.moods.map(m => (
                        <li key={m.id} className="p-2 border rounded">
                          <div className="text-sm text-gray-600">{new Date(m.date).toLocaleString()}</div>
                          <div className="font-semibold">Mood: {m.mood_value} — Risk: {m.risk}</div>
                          <div className="text-sm mt-1">{m.text}</div>
                        </li>
                      ))}
                    </ul>
                  }
                </div>

                <div className="p-3 border rounded">
                  <h4 className="font-semibold mb-2">Sessions</h4>
                  {detail.sessions.length === 0 ? <div className="text-sm text-gray-500">No sessions yet</div> :
                    <ul className="space-y-2">
                      {detail.sessions.map(s=>(
                        <li key={s.id} className="p-2 border rounded">
                          <div className="text-sm text-gray-600">{new Date(s.session_at).toLocaleString()}</div>
                          <div className="font-semibold">{s.outcome || "No outcome"}</div>
                          <div className="text-sm mt-1">{s.notes}</div>
                        </li>
                      ))}
                    </ul>
                  }
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <BookingForm token={token} patientId={detail.id} therapistId={null} onSaved={()=>openPatient(detail.id)} />
                <SessionForm token={token} patientId={detail.id} therapistId={null} onSaved={()=>openPatient(detail.id)} />
              </div>

              <div className="p-3 border rounded">
                <h4 className="font-semibold">Upcoming Bookings</h4>
                {detail.bookings.length === 0 ? <div className="text-sm text-gray-500">No bookings</div> :
                  <ul className="space-y-2">
                    {detail.bookings.map(b=>(
                      <li key={b.id} className="p-2 border rounded">
                        <div className="text-sm text-gray-600">{new Date(b.datetime).toLocaleString()}</div>
                        <div className="font-semibold">Status: {b.status}</div>
                        <div className="text-sm mt-1">{b.notes}</div>
                      </li>
                    ))}
                  </ul>
                }
              </div>
            </div>
          ) : (
            <div className="p-6 text-center text-gray-500">Select a patient to view details</div>
          )}
        </div>
      </div>
    </div>
  );
}

// Small BookingForm & SessionForm used inside dashboard (kept here for simplicity)
function BookingForm({ token, patientId, therapistId, onSaved }) {
  const [dt, setDt] = useState("");
  const [notes, setNotes] = useState("");
  const onSubmit = async (e) => {
    e.preventDefault();
    const payload = { patient_id: patientId, therapist_id: therapistId || undefined, datetime: dt, notes };
    const res = await fetch("http://127.0.0.1:8000/api/bookings", {
      method: "POST",
      headers: {"Content-Type":"application/json", "Authorization": `Bearer ${token}`},
      body: JSON.stringify(payload)
    });
    const data = await res.json();
    if (res.ok) {
      alert("Booking created");
      onSaved && onSaved(data);
    } else {
      alert(data.detail || JSON.stringify(data));
    }
  };
  return (
    <form onSubmit={onSubmit} className="p-3 border rounded space-y-2">
      <h4 className="font-semibold">Create Booking</h4>
      <input type="datetime-local" required value={dt} onChange={e=>setDt(e.target.value)} className="w-full p-2 border rounded" />
      <textarea value={notes} onChange={e=>setNotes(e.target.value)} placeholder="Notes" className="w-full p-2 border rounded" />
      <button className="px-3 py-1 bg-green-600 text-white rounded">Create</button>
    </form>
  );
}

function SessionForm({ token, patientId, therapistId, onSaved }) {
  const [notes, setNotes] = useState("");
  const [outcome, setOutcome] = useState("");
  const onSubmit = async (e) => {
    e.preventDefault();
    const payload = { booking_id: null, patient_id: patientId, therapist_id: therapistId || undefined, notes, outcome };
    const res = await fetch("http://127.0.0.1:8000/api/sessions", {
      method: "POST",
      headers: {"Content-Type":"application/json", "Authorization": `Bearer ${token}`},
      body: JSON.stringify(payload)
    });
    const data = await res.json();
    if (res.ok) {
      alert("Session recorded");
      onSaved && onSaved(data);
    } else {
      alert(data.detail || JSON.stringify(data));
    }
  };
  return (
    <form onSubmit={onSubmit} className="p-3 border rounded space-y-2">
      <h4 className="font-semibold">Record Session</h4>
      <textarea value={notes} onChange={e=>setNotes(e.target.value)} placeholder="Session notes" className="w-full p-2 border rounded" />
      <input value={outcome} onChange={e=>setOutcome(e.target.value)} placeholder="Outcome" className="w-full p-2 border rounded" />
      <button className="px-3 py-1 bg-blue-600 text-white rounded">Save Session</button>
    </form>
  );
}
