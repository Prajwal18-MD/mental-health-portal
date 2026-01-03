// src/pages/TherapistDashboard.jsx
import { useEffect, useState } from "react";
import PatientList from "../components/therapist/PatientList";
import BookingList from "../components/therapist/BookingList";
import PatientModal from "../components/therapist/PatientModal";

// === Correct functions from your services/api.js ===
// getTherapistPatients -> returns patients list (your API route: /therapist/patients)
// listBookingsApi -> general listing function for bookings (your API route: /bookings?...)
import { getTherapistPatients, listBookingsApi } from "../services/api";

export default function TherapistDashboard({ token }) {
  const [patients, setPatients] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedPatient, setSelectedPatient] = useState(null);

  useEffect(() => {
    let mounted = true;

    async function load() {
      setLoading(true);

      // 1) fetch patients assigned / visible to this therapist (backend should infer from token)
      try {
        const res = await getTherapistPatients(token);
        // normalize: accept array or { patients: [...] } or { data: [...] }
        let list = [];
        if (Array.isArray(res)) list = res;
        else if (res && Array.isArray(res.patients)) list = res.patients;
        else if (res && Array.isArray(res.data)) list = res.data;
        else list = []; // empty if unexpected
        if (mounted) setPatients(list);
      } catch (err) {
        console.error("Error fetching therapist patients:", err);
        if (mounted) setPatients([]);
      }

      // 2) fetch upcoming bookings (server should infer therapist via token)
      try {
        // use your listBookingsApi; pass status=scheduled to get upcoming appointments
        const bres = await listBookingsApi(token, { status: "scheduled" });
        let blist = [];
        if (Array.isArray(bres)) blist = bres;
        else if (bres && Array.isArray(bres.bookings)) blist = bres.bookings;
        else if (bres && Array.isArray(bres.data)) blist = bres.data;
        else blist = [];

        if (mounted) setBookings(blist);
      } catch (err) {
        console.error("Error fetching bookings:", err);
        if (mounted) setBookings([]);
      }

      if (mounted) setLoading(false);
    }

    load();
    return () => { mounted = false; };
  }, [token]);

  function onPatientClick(p) {
    setSelectedPatient(p);
  }

  function handleModalSaved(updated) {
    // refresh bookings & patients after an action in modal
    listBookingsApi(token, { status: "scheduled" })
      .then(r => {
        const bl = Array.isArray(r) ? r : (r?.bookings || r?.data || []);
        setBookings(bl);
      })
      .catch(()=>{});
    getTherapistPatients(token)
      .then(r => {
        const pl = Array.isArray(r) ? r : (r?.patients || r?.data || []);
        setPatients(pl);
      })
      .catch(()=>{});
    setSelectedPatient(null);
  }

  return (
    <div>
      <div className="grid grid-cols-3 gap-4">
        <div className="col-span-1">
          <div className="p-3 bg-white rounded-xl shadow">
            <h3 className="text-lg font-semibold text-[#4D2B8C] mb-2">Patients</h3>

            {loading ? (
              <div className="text-sm text-gray-500">Loading patients…</div>
            ) : patients.length === 0 ? (
              <div className="text-sm text-gray-500">No patients assigned yet.</div>
            ) : (
              <PatientList patients={patients} loading={loading} onSelect={onPatientClick} />
            )}
          </div>
        </div>

        <div className="col-span-2">
          <div className="p-3 bg-white rounded-xl shadow">
            <h3 className="text-lg font-semibold text-[#4D2B8C] mb-2">Upcoming bookings</h3>

            {loading ? (
              <div className="text-sm text-gray-500">Loading bookings…</div>
            ) : bookings.length === 0 ? (
              <div className="text-sm text-gray-500">No upcoming bookings.</div>
            ) : (
              <BookingList bookings={bookings} token={token} refresh={()=>{
                listBookingsApi(token, { status: "scheduled" })
                  .then(r => { const bl = Array.isArray(r) ? r : (r?.bookings || r?.data || []); setBookings(bl); })
                  .catch(()=>{});
              }} />
            )}
          </div>
        </div>
      </div>

      {selectedPatient && (
        <PatientModal
          open={!!selectedPatient}
          onClose={() => setSelectedPatient(null)}
          patient={selectedPatient}
          token={token}
          onSaved={handleModalSaved}
        />
      )}
    </div>
  );
}
