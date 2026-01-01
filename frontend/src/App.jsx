import { useEffect, useState } from "react";
import { health, registerUser, loginUser, fetchMe } from "./services/api";

import MoodEntry from "./components/MoodEntry";
import MoodHistory from "./components/MoodHistory";
import TherapistDashboard from "./pages/TherapistDashboard";
import ChatWidget from "./components/ChatWidget";
import Recommendations from "./components/Recommendations";
import AnalyticsChart from "./components/AnalyticsChart";
import PrivacyPanel from "./components/PrivacyPanel";

/* Phase-1 UI */
import Navbar from "./components/ui/Navbar";
import Landing from "./pages/Landing";
import Modal from "./components/ui/Modal";

function App() {
  const [status, setStatus] = useState(null);
  const [mode, setMode] = useState("login");
  const [form, setForm] = useState({ name: "", email: "", password: "", role: "patient" });
  const [token, setToken] = useState(localStorage.getItem("mh_token") || "");
  const [me, setMe] = useState(null);
  const [analytics, setAnalytics] = useState(null);

  /* Phase-1 modal control */
  const [authOpen, setAuthOpen] = useState(false);

  useEffect(() => {
    health().then(setStatus).catch(() => {});

    if (token) {
      fetchMe(token)
        .then(data => {
          if (data && data.email) setMe(data);
          else {
            localStorage.removeItem("mh_token");
            setToken("");
          }
        })
        .catch(() => {
          localStorage.removeItem("mh_token");
          setToken("");
        });

      fetch("http://127.0.0.1:8000/api/mood/analytics", {
        headers: { Authorization: `Bearer ${token}` }
      })
        .then(r => r.json())
        .then(setAnalytics)
        .catch(() => {});
    }
  }, [token]);

  async function onRegister(e) {
    e.preventDefault();
    const res = await registerUser(form.name, form.email, form.password, form.role);
    if (res && res.id) {
      alert("Registered! Now login.");
      setMode("login");
      setForm({ name: "", email: "", password: "", role: "patient" });
    } else {
      alert(res?.detail || JSON.stringify(res));
    }
  }

  async function onLogin(e) {
    e.preventDefault();
    const res = await loginUser(form.email, form.password);
    if (res && res.access_token) {
      localStorage.setItem("mh_token", res.access_token);
      setToken(res.access_token);
      setAuthOpen(false);
      setForm({ name: "", email: "", password: "", role: "patient" });
    } else {
      alert(res?.detail || JSON.stringify(res));
    }
  }

  function logout() {
    localStorage.removeItem("mh_token");
    setToken("");
    setMe(null);
    setAnalytics(null);
  }

  function handleAccountDeleted() {
    localStorage.removeItem("mh_token");
    window.location.reload();
  }

  return (
    <div className="min-h-screen bg-slate-50">
      {/* ================= LANDING (NOT LOGGED IN) ================= */}
      {!me && (
        <>
          <Navbar onLoginClick={() => setAuthOpen(true)} />
          <Landing onLogin={() => setAuthOpen(true)} />

          {/* Auth Modal (Phase-2 will upgrade UI here) */}
          <Modal
            open={authOpen}
            onClose={() => setAuthOpen(false)}
            title={mode === "login" ? "Login" : "Register"}
          >
            <div className="flex gap-2 mb-4">
              <button
                className={`px-3 py-1 rounded ${mode === "login" ? "bg-primary text-white" : "bg-slate-100"}`}
                onClick={() => setMode("login")}
              >
                Login
              </button>
              <button
                className={`px-3 py-1 rounded ${mode === "register" ? "bg-primary text-white" : "bg-slate-100"}`}
                onClick={() => setMode("register")}
              >
                Register
              </button>
            </div>

            {mode === "register" ? (
              <form onSubmit={onRegister} className="space-y-3">
                <input required placeholder="Full name" value={form.name}
                  onChange={e => setForm({ ...form, name: e.target.value })}
                  className="w-full p-2 border rounded" />
                <input required placeholder="Email" value={form.email}
                  onChange={e => setForm({ ...form, email: e.target.value })}
                  className="w-full p-2 border rounded" />
                <input required type="password" placeholder="Password" value={form.password}
                  onChange={e => setForm({ ...form, password: e.target.value })}
                  className="w-full p-2 border rounded" />
                <select value={form.role}
                  onChange={e => setForm({ ...form, role: e.target.value })}
                  className="w-full p-2 border rounded">
                  <option value="patient">Patient</option>
                  <option value="therapist">Therapist</option>
                </select>
                <button className="w-full btn-primary">Register</button>
              </form>
            ) : (
              <form onSubmit={onLogin} className="space-y-3">
                <input required placeholder="Email" value={form.email}
                  onChange={e => setForm({ ...form, email: e.target.value })}
                  className="w-full p-2 border rounded" />
                <input required type="password" placeholder="Password" value={form.password}
                  onChange={e => setForm({ ...form, password: e.target.value })}
                  className="w-full p-2 border rounded" />
                <button className="w-full btn-primary">Login</button>
              </form>
            )}
          </Modal>
        </>
      )}

      {/* ================= LOGGED-IN APP ================= */}
      {me && (
        <div className="flex items-start justify-center p-6">
          <div className="w-full max-w-5xl bg-white rounded-xl shadow-md p-6 space-y-4">
            <h1 className="text-2xl font-semibold text-center">Mental Health Portal</h1>

            <div className="mb-4 text-sm text-gray-600">
              Backend status: {status?.message || "Connecting..."}
            </div>

            <div className="mb-4 p-3 border rounded flex justify-between items-center">
              <div>
                <strong>{me.name}</strong> ({me.role})
                <div className="text-xs text-gray-600">{me.email}</div>
              </div>
              <button onClick={logout} className="px-3 py-1 bg-red-500 text-white rounded">Logout</button>
            </div>

            {me.role === "therapist" ? (
              <TherapistDashboard token={token} />
            ) : (
              <div className="grid grid-cols-3 gap-4">
                <div className="space-y-4">
                  <MoodEntry token={token} />
                  <Recommendations token={token} />
                  <PrivacyPanel token={token} onAccountDeleted={handleAccountDeleted} />
                </div>

                <div className="col-span-2 space-y-4">
                  <AnalyticsChart token={token} range={7} />
                  <MoodHistory token={token} />
                  <ChatWidget token={token} />
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
