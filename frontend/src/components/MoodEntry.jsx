// frontend/src/components/MoodEntry.jsx
import { useState } from "react";

export default function MoodEntry({ token, onResult }) {
  const [text, setText] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  async function saveMood() {
    if (!token) { alert("Please log in"); return; }
    if (!text.trim()) { alert("Please write something about how you're feeling"); return; }
    
    setBusy(true);
    setError("");
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
      alert("Mood entry recorded successfully!");
    } catch (err) {
      console.error(err);
      setError("Network error while saving mood");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="bg-white rounded-xl shadow p-6">
      <h2 className="text-xl font-semibold text-[#4D2B8C] mb-4">How are you feeling today?</h2>
      <textarea
        value={text}
        onChange={e => setText(e.target.value)}
        className="w-full h-40 p-4 border rounded-lg"
        placeholder="Write freely about your thoughts and feelings..."
        disabled={busy}
      />
      {error && <div className="mt-2 text-sm text-red-600">{error}</div>}
      <button
        onClick={saveMood}
        disabled={busy || !text.trim()}
        className="mt-6 px-6 py-2 bg-[#4D2B8C] text-white rounded-lg hover:bg-[#85409D] disabled:opacity-60"
      >
        {busy ? "Saving..." : "Save Mood Entry"}
      </button>
    </div>
  );
}
