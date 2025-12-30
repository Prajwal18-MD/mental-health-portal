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

