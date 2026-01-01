// frontend/src/pages/TherapistDashboard.jsx
import { useEffect, useState } from "react";
import { getTherapistPatients, getPatientDetail, fetchMe } from "../services/api";

/* -------------------- BookingForm -------------------- */
function BookingForm({ token, patientId, therapistId: propTherapistId, onSaved }) {
  const [dt, setDt] = useState("");
  const [notes, setNotes] = useState("");
  const [therapistId, setTherapistId] = useState(propTherapistId || null);

  useEffect(()=> {
    if(!therapistId && token) {
      // fetch current user to resolve therapist id
      fetchMe(token).then(me => {
        if(me && me.id && me.role === "therapist") setTherapistId(me.id);
      }).catch(()=>{});
    }
  }, [token, therapistId]);

  const onSubmit = async (e) => {
    e.preventDefault();
    if(!therapistId) {
      alert("Could not determine therapist id. Ensure you are logged in as a therapist.");
      return;
    }
    if(!dt) {
      alert("Please select date & time");
      return;
    }
    const payload = { patient_id: patientId, therapist_id: therapistId, datetime: dt, notes };
    try {
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
    } catch (err) {
      console.error(err);
      alert("Network or server error");
    }
  };
  return (
    <form onSubmit={onSubmit} className="p-3 border rounded space-y-2">
      <h4 className="font-semibold">Create Booking</h4>
      <input type="datetime-local" required value={dt} onChange={e=>setDt(e.target.value)} className="w-full p-2 border rounded" />
      <textarea value={notes} onChange={e=>setNotes(e.target.value)} placeholder="Notes" className="w-full p-2 border rounded" />
      <button type="submit" className="px-3 py-1 bg-green-600 text-white rounded">Create</button>
    </form>
  );
}

/* -------------------- SessionForm -------------------- */
function SessionForm({ token, patientId, therapistId: propTherapistId, onSaved }) {
  const [notes, setNotes] = useState("");
  const [outcome, setOutcome] = useState("");
  const [therapistId, setTherapistId] = useState(propTherapistId || null);

  useEffect(()=> {
    if(!therapistId && token) {
      fetchMe(token).then(me => {
        if(me && me.id && me.role === "therapist") setTherapistId(me.id);
      }).catch(()=>{});
    }
  }, [token, therapistId]);

  const onSubmit = async (e) => {
    e.preventDefault();
    if(!therapistId) {
      alert("Could not determine therapist id. Ensure you are logged in as a therapist.");
      return;
    }
    const payload = { booking_id: null, patient_id: patientId, therapist_id: therapistId, notes, outcome };
    try {
      const res = await fetch("http://127.0.0.1:8000/api/sessions", {
        method: "POST",
        headers: {"Content-Type":"application/json", "Authorization": `Bearer ${token}`},
        body: JSON.stringify(payload)
      });
      const data = await res.json();
      if(res.ok) {
        alert("Session recorded");
        onSaved && onSaved(data);
      } else {
        alert(data.detail || JSON.stringify(data));
      }
    } catch (err) {
      console.error(err);
      alert("Network error");
    }
  };

  return (
    <form onSubmit={onSubmit} className="p-3 border rounded space-y-2">
      <h4 className="font-semibold">Record Session</h4>
      <textarea value={notes} onChange={e=>setNotes(e.target.value)} placeholder="Session notes" className="w-full p-2 border rounded" />
      <input value={outcome} onChange={e=>setOutcome(e.target.value)} placeholder="Outcome" className="w-full p-2 border rounded" />
      <button type="submit" className="px-3 py-1 bg-blue-600 text-white rounded">Save Session</button>
    </form>
  );
}

/* -------------------- TherapistDashboard (default export) -------------------- */
export default function TherapistDashboard({ token }) {
  const [patients, setPatients] = useState([]);
  const [selectedId, setSelectedId] = useState(null);
  const [detail, setDetail] = useState(null);
  const [refreshFlag, setRefreshFlag] = useState(0);

  useEffect(()=> {
    if(!token) return;
    getTherapistPatients(token)
      .then(list => setPatients(list || []))
      .catch(err => {
        console.error("Failed to load patients", err);
        setPatients([]);
      });
  }, [token, refreshFlag]);

  async function openPatient(id) {
    setSelectedId(id);
    try {
      const d = await getPatientDetail(token, id);
      setDetail(d);
    } catch (err) {
      console.error(err);
      alert("Failed to load patient details");
    }
  }

  function handleSavedSomething() {
    // used to re-fetch lists/details after creating bookings/sessions
    setRefreshFlag(f=>f+1);
    if(selectedId) openPatient(selectedId);
  }

  return (
    <div className="p-4">
      <h2 className="text-xl font-semibold mb-3">Therapist Dashboard</h2>
      <div className="grid grid-cols-3 gap-4">
        <div className="col-span-1">
          <h3 className="font-semibold mb-2">Patients</h3>
          <div className="space-y-2 max-h-[60vh] overflow-auto">
            {patients.length === 0 ? (
              <div className="text-sm text-gray-500">No patients yet.</div>
            ) : patients.map(p => (
              <div key={p.id} className={`p-2 border rounded flex justify-between items-center ${selectedId === p.id ? "ring-2 ring-sky-300" : ""}`}>
                <div>
                  <div className="font-semibold">{p.name}</div>
                  <div className="text-xs text-gray-600">{p.email}</div>
                  <div className="text-xs mt-1">Latest: {p.latest_mood_value ?? "—"}</div>
                </div>
                <div>
                  <button onClick={()=>openPatient(p.id)} className="px-2 py-1 bg-sky-600 text-white rounded">Open</button>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="col-span-2">
          {detail ? (
            <div className="space-y-3">
              <div className="p-3 border rounded flex items-center justify-between">
                <div>
                  <h3 className="font-semibold">{detail.name} — {detail.email}</h3>
                  <div className="text-sm text-gray-600">ID: {detail.id}</div>
                </div>
                <div>
                  <button onClick={()=>openPatient(detail.id)} className="px-2 py-1 bg-gray-200 rounded">Refresh</button>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="p-3 border rounded">
                  <h4 className="font-semibold mb-2">Mood timeline</h4>
                  {(!detail.moods || detail.moods.length===0) ? (
                    <div className="text-sm text-gray-500">No moods yet</div>
                  ) : (
                    <ul className="space-y-2">
                      {detail.moods.map(m => (
                        <li key={m.id} className="p-2 border rounded">
                          <div className="text-sm text-gray-600">{new Date(m.date).toLocaleString()}</div>
                          <div className="font-semibold">Mood: {m.mood_value} — Risk: {m.risk}</div>
                          <div className="text-sm mt-1">{m.text}</div>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>

                <div className="p-3 border rounded">
                  <h4 className="font-semibold mb-2">Sessions</h4>
                  {(!detail.sessions || detail.sessions.length===0) ? (
                    <div className="text-sm text-gray-500">No sessions yet</div>
                  ) : (
                    <ul className="space-y-2">
                      {detail.sessions.map(s=>(
                        <li key={s.id} className="p-2 border rounded">
                          <div className="text-sm text-gray-600">{new Date(s.session_at).toLocaleString()}</div>
                          <div className="font-semibold">{s.outcome || "No outcome"}</div>
                          <div className="text-sm mt-1">{s.notes}</div>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <BookingForm token={token} patientId={detail.id} onSaved={(d)=>{ handleSavedSomething(); }} />
                <SessionForm token={token} patientId={detail.id} onSaved={(d)=>{ handleSavedSomething(); }} />
              </div>

              <div className="p-3 border rounded">
                <h4 className="font-semibold">Bookings</h4>
                {(!detail.bookings || detail.bookings.length===0) ? (
                  <div className="text-sm text-gray-500">No bookings</div>
                ) : (
                  <ul className="space-y-2">
                    {detail.bookings.map(b=>(
                      <li key={b.id} className="p-2 border rounded">
                        <div className="text-sm text-gray-600">{new Date(b.datetime).toLocaleString()}</div>
                        <div className="font-semibold">Status: {b.status}</div>
                        <div className="text-sm mt-1">{b.notes}</div>
                      </li>
                    ))}
                  </ul>
                )}
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
