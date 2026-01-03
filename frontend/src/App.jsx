// src/App.jsx
import { useEffect, useState } from "react";
import { health, fetchMe } from "./services/api";

/* UI */
import Navbar from "./components/ui/Navbar";
import MoodActionsBar from "./components/MoodActionsBar";

/* Patient */
import MoodEntry from "./components/MoodEntry";

/* Therapist */
import TherapistDashboard from "./pages/TherapistDashboard";

/* Pages & Modals */
import Landing from "./pages/Landing";
import AuthModal from "./components/AuthModal";
import MoodHistoryModal from "./components/MoodHistoryModal";
import AnalyticsModal from "./components/AnalyticsModal";
import RecommendationsModal from "./components/RecommendationsModal";
import BookingModal from "./components/BookingModal";
import ChatModal from "./components/ChatModal";

function App() {
  const [status, setStatus] = useState(null);
  const [token, setToken] = useState(localStorage.getItem("mh_token") || "");
  const [me, setMe] = useState(null);

  /* modals (PATIENT ONLY) */
  const [authOpen, setAuthOpen] = useState(false);
  const [historyOpen, setHistoryOpen] = useState(false);
  const [analyticsOpen, setAnalyticsOpen] = useState(false);
  const [recoOpen, setRecoOpen] = useState(false);
  const [chatOpen, setChatOpen] = useState(false);
  const [bookingOpen, setBookingOpen] = useState(false);

  useEffect(() => {
    health().then(setStatus).catch(() => {});

    if (token) {
      fetchMe(token)
        .then(data => {
          if (data?.email) setMe(data);
          else logout();
        })
        .catch(logout);
    } else {
      setMe(null);
    }
  }, [token]);

  function logout() {
    localStorage.removeItem("mh_token");
    setToken("");
    setMe(null);
    setAuthOpen(false);
  }

  function handleAuthSuccess(newToken) {
    if (!newToken) return;
    localStorage.setItem("mh_token", newToken);
    setToken(newToken);
    setAuthOpen(false);
  }

  function handleMoodResult(level) {
    if (level === "MEDIUM") setChatOpen(true);
    if (level === "HIGH") setBookingOpen(true);
  }

  return (
    <div className="min-h-screen bg-[#F6F7FB]">
      {/* NAVBAR ALWAYS */}
      <Navbar me={me} onLoginClick={() => setAuthOpen(true)} onLogout={logout} />

      {/* NOT LOGGED IN */}
      {!me && (
        <>
          <Landing onLogin={() => setAuthOpen(true)} />
          <AuthModal
            open={authOpen}
            onClose={() => setAuthOpen(false)}
            onAuthSuccess={handleAuthSuccess}
          />
        </>
      )}

      {/* ===================== PATIENT ===================== */}
      {me && me.role === "patient" && (
        <>
          <MoodActionsBar
            onHistory={() => setHistoryOpen(true)}
            onAnalytics={() => setAnalyticsOpen(true)}
            onReco={() => setRecoOpen(true)}
            onExport={() => setHistoryOpen(true)}
          />

          <div className="max-w-4xl mx-auto mt-10 px-4">
            <MoodEntry token={token} onResult={handleMoodResult} />
          </div>

          {/* PATIENT MODALS */}
          <MoodHistoryModal open={historyOpen} onClose={() => setHistoryOpen(false)} token={token} />
          <AnalyticsModal open={analyticsOpen} onClose={() => setAnalyticsOpen(false)} token={token} />
          <RecommendationsModal open={recoOpen} onClose={() => setRecoOpen(false)} />
          <ChatModal
            open={chatOpen}
            onClose={() => setChatOpen(false)}
            onNotSatisfied={() => {
              setChatOpen(false);
              setBookingOpen(true);
            }}
          />
          <BookingModal open={bookingOpen} onClose={() => setBookingOpen(false)} token={token} />
        </>
      )}

      {/* ===================== THERAPIST ===================== */}
      {me && me.role === "therapist" && (
        <div className="max-w-6xl mx-auto p-6">
          <TherapistDashboard token={token} />
        </div>
      )}
    </div>
  );
}

export default App;
