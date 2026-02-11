// frontend/src/components/MoodEntry.jsx
import { useState } from "react";

export default function MoodEntry({ token, onResult }) {
  const [text, setText] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  async function saveMood() {
    if (!token) { alert("Please log in"); return; }
    if (!text.trim()) { alert("Please write something about how you're feeling"); return; }

    setBusy(true);
    setError("");
    setSuccess(false);

    try {
      const r = await fetch("http://127.0.0.1:8000/api/mood", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ text })
      });
      const j = await r.json();

      if (!r.ok) {
        console.error("save mood failed", j);
        setError(j.detail || "Failed to save mood");
        return;
      }

      // Get server-provided risk level
      const serverRisk = (j.risk || "").toString().toUpperCase();

      // call parent callback (to open chat/booking)
      onResult && onResult(serverRisk);

      setText("");
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    } catch (err) {
      console.error(err);
      setError("Network error while saving mood");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="glass-card rounded-3xl shadow-large p-8 hover-lift animate-slideUp">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-12 h-12 rounded-2xl bg-gradient-primary flex items-center justify-center shadow-glow">
          <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
        <div>
          <h2 className="text-2xl font-display font-bold text-primary-700">How are you feeling today?</h2>
          <p className="text-sm text-gray-600">Share your thoughts and emotions freely</p>
        </div>
      </div>

      <div className="relative">
        <textarea
          value={text}
          onChange={e => setText(e.target.value)}
          className="w-full h-48 p-5 border-2 border-gray-200 rounded-2xl focus:border-primary-500 focus:ring-4 focus:ring-primary-100 transition-all duration-200 resize-none font-sans text-gray-700 placeholder-gray-400"
          placeholder="Write freely about your thoughts and feelings... There's no right or wrong way to express yourself."
          disabled={busy}
        />
        <div className="absolute bottom-4 right-4 text-xs text-gray-400">
          {text.length} characters
        </div>
      </div>

      {error && (
        <div className="mt-4 p-4 bg-red-50 border-l-4 border-red-500 rounded-lg animate-slideDown">
          <div className="flex items-center gap-2">
            <svg className="w-5 h-5 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span className="text-sm text-red-700 font-medium">{error}</span>
          </div>
        </div>
      )}

      {success && (
        <div className="mt-4 p-4 bg-green-50 border-l-4 border-green-500 rounded-lg animate-slideDown">
          <div className="flex items-center gap-2">
            <svg className="w-5 h-5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span className="text-sm text-green-700 font-medium">Mood entry recorded successfully!</span>
          </div>
        </div>
      )}

      <button
        onClick={saveMood}
        disabled={busy || !text.trim()}
        className="mt-6 btn-primary text-base px-8 py-4 w-full sm:w-auto inline-flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {busy ? (
          <>
            <svg className="animate-spin h-5 w-5" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
            </svg>
            Saving...
          </>
        ) : (
          <>
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
            Save Mood Entry
          </>
        )}
      </button>
    </div>
  );
}
