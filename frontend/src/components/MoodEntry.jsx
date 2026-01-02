// frontend/src/components/MoodEntry.jsx
import { useState } from "react";

export default function MoodEntry({ token, onResult }) {
  const [text, setText] = useState("");
  const [mood, setMood] = useState(5);
  const [busy, setBusy] = useState(false);

  function mapLocalRisk(value) {
    const v = Number(value);
    if (v <= 3) return "LOW";
    if (v <= 6) return "MEDIUM";
    return "HIGH";
  }

  async function saveMood() {
    if (!token) { alert("Please log in"); return; }
    setBusy(true);
    try {
      const r = await fetch("http://127.0.0.1:8000/api/mood", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ text, mood_value: Number(mood) })
      });
      const j = await r.json();

      if (!r.ok) {
        console.error("save mood failed", j);
        alert(j.detail || "Failed to save mood");
        return;
      }

      // Prefer server-provided risk if available
      const serverRisk = (j.risk || j.risk_level || "").toString().toUpperCase();
      const risk = serverRisk || mapLocalRisk(mood);

      // call parent callback (to open chat/booking)
      onResult && onResult(risk);

      setText("");
      setMood(5);
      alert("Mood saved");
    } catch (err) {
      console.error(err);
      alert("Network error while saving mood");
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
        placeholder="Write freely about your thoughts..."
      />
      <div className="mt-6">
        <label className="font-medium text-[#4D2B8C]">Mood: {mood}/10</label>
        <input
          type="range"
          min="1"
          max="10"
          value={mood}
          onChange={e => setMood(Number(e.target.value))}
          className="w-full mt-2 accent-[#EEA727]"
        />
      </div>
      <button
        onClick={saveMood}
        disabled={busy}
        className="mt-6 px-6 py-2 bg-[#4D2B8C] text-white rounded-lg hover:bg-[#85409D] disabled:opacity-60"
      >
        {busy ? "Saving..." : "Save Mood"}
      </button>
    </div>
  );
}
