const API_BASE = import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000/api';

export async function health() {
  const res = await fetch(`${API_BASE}/health`);
  return res.json();
}

export async function registerUser(name, email, password, role = "patient") {
  const res = await fetch(`${API_BASE}/auth/register`, {
    method: "POST",
    headers: {"Content-Type":"application/json"},
    body: JSON.stringify({name, email, password, role})
  });
  return res.json();
}

export async function loginUser(email, password) {
  const res = await fetch(`${API_BASE}/auth/login`, {
    method: "POST",
    headers: {"Content-Type":"application/json"},
    body: JSON.stringify({email, password})
  });
  return res.json();
}

export async function fetchMe(token) {
  const res = await fetch(`${API_BASE}/auth/me`, {
    headers: {
      "Authorization": `Bearer ${token}`
    }
  });
  return res.json();
}

export async function postMood(token, { text, mood_value, date=null }) {
  const res = await fetch(`${API_BASE}/mood`, {
    method: "POST",
    headers: {
      "Content-Type":"application/json",
      "Authorization": `Bearer ${token}`
    },
    body: JSON.stringify({ text, mood_value, date })
  });
  return res.json();
}

export async function getMoods(token) {
  const res = await fetch(`${API_BASE}/mood`, {
    headers: { "Authorization": `Bearer ${token}` }
  });
  return res.json();
}

export async function getAnalytics(token) {
  const res = await fetch(`${API_BASE}/mood/analytics`, {
    headers: { "Authorization": `Bearer ${token}` }
  });
  return res.json();
}

// Bookings
export async function createBooking(token, { patient_id, therapist_id, datetime, notes }) {
  const res = await fetch(`${API_BASE}/bookings`, {
    method: "POST",
    headers: {"Content-Type":"application/json", "Authorization": `Bearer ${token}`},
    body: JSON.stringify({ patient_id, therapist_id, datetime, notes })
  });
  return res.json();
}

export async function listBookingsApi(token, { therapist_id=null, patient_id=null, status=null } = {}) {
  const params = new URLSearchParams();
  if (therapist_id) params.append("therapist_id", therapist_id);
  if (patient_id) params.append("patient_id", patient_id);
  if (status) params.append("status", status);
  const res = await fetch(`${API_BASE}/bookings?${params.toString()}`, {
    headers: { "Authorization": `Bearer ${token}` }
  });
  return res.json();
}

export async function patchBooking(token, booking_id, patch) {
  const res = await fetch(`${API_BASE}/bookings/${booking_id}`, {
    method: "PATCH",
    headers: {"Content-Type":"application/json", "Authorization": `Bearer ${token}`},
    body: JSON.stringify(patch)
  });
  return res.json();
}

// Sessions
export async function createSessionApi(token, data) {
  const res = await fetch(`${API_BASE}/sessions`, {
    method: "POST",
    headers: {"Content-Type":"application/json", "Authorization": `Bearer ${token}`},
    body: JSON.stringify(data)
  });
  return res.json();
}

export async function listSessionsApi(token, { patient_id=null, therapist_id=null } = {}) {
  const params = new URLSearchParams();
  if (patient_id) params.append("patient_id", patient_id);
  if (therapist_id) params.append("therapist_id", therapist_id);
  const res = await fetch(`${API_BASE}/sessions?${params.toString()}`, {
    headers: { "Authorization": `Bearer ${token}` }
  });
  return res.json();
}

// Therapist utilities
export async function getTherapistPatients(token) {
  const res = await fetch(`${API_BASE}/therapist/patients`, {
    headers: { "Authorization": `Bearer ${token}` }
  });
  return res.json();
}

export async function getPatientDetail(token, patient_id) {
  const res = await fetch(`${API_BASE}/therapist/patient/${patient_id}`, {
    headers: { "Authorization": `Bearer ${token}` }
  });
  return res.json();
}


