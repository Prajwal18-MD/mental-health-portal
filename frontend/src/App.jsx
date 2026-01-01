import { useEffect, useState } from "react";
import { health, fetchMe } from "./services/api";

import MoodEntry from "./components/MoodEntry";
import MoodHistory from "./components/MoodHistory";
import TherapistDashboard from "./pages/TherapistDashboard";
import ChatWidget from "./components/ChatWidget";
import Recommendations from "./components/Recommendations";
import AnalyticsChart from "./components/AnalyticsChart";
import PrivacyPanel from "./components/PrivacyPanel";

/* Phase-2 Auth */
import Navbar from "./components/ui/Navbar";
import Landing from "./pages/Landing";
import AuthModal from "./components/AuthModal";

function App() {
  const [status, setStatus] = useState(null);
  const [token, setToken] = useState(localStorage.getItem("mh_token") || "");
  const [me, setMe] = useState(null);
  const [analytics, setAnalytics] = useState(null);

  /* auth modal control */
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

  function handleAuthSuccess(newToken) {
    if (!newToken) return;
    localStorage.setItem("mh_token", newToken);
    setToken(newToken);
    setAuthOpen(false);
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
      {/* NOT AUTHENTICATED */}
      {!me && (
        <>
          <Navbar onLoginClick={() => setAuthOpen(true)} />
          <Landing onLogin={() => setAuthOpen(true)} />

          <AuthModal open={authOpen} onClose={() => setAuthOpen(false)} onAuthSuccess={handleAuthSuccess} />
        </>
      )}

      {/* AUTHENTICATED */}
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
