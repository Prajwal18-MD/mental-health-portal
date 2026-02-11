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
    health().then(setStatus).catch(() => { });

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
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50">
      {/* Navbar */}
      <Navbar
        me={me}
        onLoginClick={() => setAuthOpen(true)}
        onLogout={logout}
      />

      {/* Main Content Area */}
      <main className="flex-1 w-full">
        {/* NOT LOGGED IN */}
        {!me && <Landing onLogin={() => setAuthOpen(true)} />}

        {/* PATIENT VIEW */}
        {me && me.role === "patient" && (
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
            <MoodEntry token={token} onResult={handleMoodResult} />
            <MoodActionsBar
              onHistory={() => setHistoryOpen(true)}
              onAnalytics={() => setAnalyticsOpen(true)}
              onReco={() => setRecoOpen(true)}
              onExport={() => setHistoryOpen(true)}
            />
          </div>
        )}

        {/* THERAPIST VIEW */}
        {me && me.role === "therapist" && (
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
            <TherapistDashboard token={token} />
          </div>
        )}
      </main>

      {/* Auth Modal - Always available */}
      <AuthModal
        open={authOpen}
        onClose={() => setAuthOpen(false)}
        onAuthSuccess={handleAuthSuccess}
      />

      {/* PATIENT MODALS */}
      {me && me.role === "patient" && (
        <>
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
    </div>
  );
}

export default App;
