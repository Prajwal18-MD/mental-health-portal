// src/pages/TherapistDashboard.jsx
import { useEffect, useState } from "react";
import PatientList from "../components/therapist/PatientList";
import BookingList from "../components/therapist/BookingList";
import PatientModal from "../components/therapist/PatientModal";
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

      try {
        const res = await getTherapistPatients(token);
        let list = [];
        if (Array.isArray(res)) list = res;
        else if (res && Array.isArray(res.patients)) list = res.patients;
        else if (res && Array.isArray(res.data)) list = res.data;
        else list = [];
        if (mounted) setPatients(list);
      } catch (err) {
        console.error("Error fetching therapist patients:", err);
        if (mounted) setPatients([]);
      }

      try {
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
    listBookingsApi(token, { status: "scheduled" })
      .then(r => {
        const bl = Array.isArray(r) ? r : (r?.bookings || r?.data || []);
        setBookings(bl);
      })
      .catch(() => { });
    getTherapistPatients(token)
      .then(r => {
        const pl = Array.isArray(r) ? r : (r?.patients || r?.data || []);
        setPatients(pl);
      })
      .catch(() => { });
    setSelectedPatient(null);
  }

  return (
    <div className="space-y-6 pb-6">
      {/* Welcome Header */}
      <div className="glass-card p-6 rounded-3xl">
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1 min-w-0">
            <h1 className="text-2xl md:text-3xl font-display font-bold text-gray-900 mb-2">
              Therapist Dashboard
            </h1>
            <p className="text-sm md:text-base text-gray-600">Manage your patients and upcoming sessions</p>
          </div>
          <div className="hidden md:block flex-shrink-0">
            <div className="w-16 h-16 rounded-2xl bg-gradient-primary flex items-center justify-center">
              <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
          </div>
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="glass-card p-6 rounded-2xl hover-lift">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-xl bg-blue-100 flex items-center justify-center flex-shrink-0">
              <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
            </div>
            <div>
              <div className="text-sm font-semibold text-gray-500">Total Patients</div>
              <div className="text-3xl font-bold text-gray-900">{patients.length}</div>
            </div>
          </div>
        </div>

        <div className="glass-card p-6 rounded-2xl hover-lift">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-xl bg-green-100 flex items-center justify-center flex-shrink-0">
              <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
            <div>
              <div className="text-sm font-semibold text-gray-500">Upcoming Sessions</div>
              <div className="text-3xl font-bold text-gray-900">{bookings.length}</div>
            </div>
          </div>
        </div>

        <div className="glass-card p-6 rounded-2xl hover-lift">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-xl bg-purple-100 flex items-center justify-center flex-shrink-0">
              <svg className="w-8 h-8 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div>
              <div className="text-sm font-semibold text-gray-500">Active Status</div>
              <div className="text-xl font-bold text-green-600 inline-flex items-center gap-2 mt-1">
                <div className="w-3 h-3 rounded-full bg-green-500 animate-pulse" />
                Online
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Patients Section */}
        <div className="lg:col-span-1">
          <div className="glass-card p-6 rounded-3xl">
            <div className="flex items-center gap-3 mb-5">
              <div className="w-10 h-10 rounded-xl bg-gradient-primary flex items-center justify-center">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                </svg>
              </div>
              <div>
                <h3 className="text-lg font-display font-bold text-gray-900">My Patients</h3>
                <p className="text-xs text-gray-500">{patients.length} total</p>
              </div>
            </div>

            {loading ? (
              <div className="flex items-center justify-center py-12">
                <div className="text-center">
                  <svg className="animate-spin h-10 w-10 text-primary-500 mx-auto mb-3" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                  <p className="text-sm text-gray-600">Loading patients...</p>
                </div>
              </div>
            ) : patients.length === 0 ? (
              <div className="text-center py-12">
                <svg className="w-16 h-16 text-gray-300 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
                <h4 className="text-base font-semibold text-gray-700 mb-1">No Patients Yet</h4>
                <p className="text-sm text-gray-500">Patients will appear here once assigned</p>
              </div>
            ) : (
              <PatientList patients={patients} loading={loading} onSelect={onPatientClick} />
            )}
          </div>
        </div>

        {/* Bookings Section */}
        <div className="lg:col-span-2">
          <div className="glass-card p-6 rounded-3xl">
            <div className="flex items-center gap-3 mb-5">
              <div className="w-10 h-10 rounded-xl bg-gradient-accent flex items-center justify-center">
                <svg className="w-6 h-6 text-gray-900" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
              <div>
                <h3 className="text-lg font-display font-bold text-gray-900">Upcoming Sessions</h3>
                <p className="text-xs text-gray-500">{bookings.length} scheduled</p>
              </div>
            </div>

            {loading ? (
              <div className="flex items-center justify-center py-12">
                <div className="text-center">
                  <svg className="animate-spin h-10 w-10 text-primary-500 mx-auto mb-3" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                  <p className="text-sm text-gray-600">Loading bookings...</p>
                </div>
              </div>
            ) : bookings.length === 0 ? (
              <div className="text-center py-12">
                <svg className="w-16 h-16 text-gray-300 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                <h4 className="text-base font-semibold text-gray-700 mb-1">No Upcoming Sessions</h4>
                <p className="text-sm text-gray-500">Your schedule is clear</p>
              </div>
            ) : (
              <BookingList
                bookings={bookings}
                token={token}
                refresh={() => {
                  listBookingsApi(token, { status: "scheduled" })
                    .then(r => {
                      const bl = Array.isArray(r) ? r : (r?.bookings || r?.data || []);
                      setBookings(bl);
                    })
                    .catch(() => { });
                }}
              />
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
