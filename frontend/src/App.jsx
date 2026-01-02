// src/App.jsx
import { useEffect, useState } from "react";
import { health, fetchMe } from "./services/api";

/* UI */
import Navbar from "./components/ui/Navbar";
import MoodActionsBar from "./components/MoodActionsBar";

/* Main */
import MoodEntry from "./components/MoodEntry";

/* Modals & pages */
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

  /* modal controls */
  const [authOpen, setAuthOpen] = useState(false);
  const [historyOpen, setHistoryOpen] = useState(false);
  const [analyticsOpen, setAnalyticsOpen] = useState(false);
  const [recoOpen, setRecoOpen] = useState(false);
  const [chatOpen, setChatOpen] = useState(false);
  const [bookingOpen, setBookingOpen] = useState(false);

  useEffect(() => {
    health().then(setStatus).catch(() => {});

    // If there's a token, attempt to fetch profile
    if (token) {
      fetchMe(token)
        .then(data => {
          if (data?.email) setMe(data);
          else {
            // invalid token: clear
            localStorage.removeItem("mh_token");
            setToken("");
            setMe(null);
          }
        })
        .catch(() => {
          localStorage.removeItem("mh_token");
          setToken("");
          setMe(null);
        });
    } else {
      setMe(null);
    }
  }, [token]);

  function logout() {
    localStorage.removeItem("mh_token");
    setToken("");
    setMe(null);
    // keep user on landing; close modals
    setAuthOpen(false);
  }

  // Called after mood is saved in MoodEntry
  function handleMoodResult(level) {
    if (level === "MEDIUM") setChatOpen(true);
    if (level === "HIGH") setBookingOpen(true);
  }

  // Called when AuthModal returns a token (successful login/register)
  function handleAuthSuccess(newToken) {
    if (!newToken) return;
    localStorage.setItem("mh_token", newToken);
    setToken(newToken);
    setAuthOpen(false);
    // fetchMe will run automatically due to token change
  }

  return (
    <div className="min-h-screen bg-[#F6F7FB]">
      {/* Navbar always visible; pass me (or null) and login/logout handlers */}
      <Navbar me={me} onLoginClick={() => setAuthOpen(true)} onLogout={logout} />

      {/* If not logged in: show landing + auth modal */}
      {!me && (
        <>
          <Landing onLogin={() => setAuthOpen(true)} />
          <AuthModal open={authOpen} onClose={() => setAuthOpen(false)} onAuthSuccess={handleAuthSuccess} />
        </>
      )}

      {/* When logged in: show Phase-3 UI */}
      {me && (
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

          {/* Modals */}
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
