import { useState } from "react";

export default function MoodEntry({ token, onSaved }) {
  const [text, setText] = useState("");
  const [mood, setMood] = useState(5);
  const [loading, setLoading] = useState(false);

  async function submit(e) {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch("http://127.0.0.1:8000/api/mood", {
        method: "POST",
        headers: { "Content-Type":"application/json", "Authorization": `Bearer ${token}` },
        body: JSON.stringify({ text, mood_value: mood })
      });
      const data = await res.json();
      if (res.ok) {
        setText("");
        setMood(5);
        onSaved && onSaved(data);
        alert("Mood saved");
      } else {
        alert(data.detail || JSON.stringify(data));
      }
    } catch (err) {
      console.error(err);
      alert("Network error");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={submit} className="p-4 border rounded space-y-3">
      <h3 className="font-semibold">Add mood entry</h3>
      <textarea value={text} onChange={e=>setText(e.target.value)} placeholder="Write a short journal..." className="w-full p-2 border rounded" rows={4}/>
      <div>
        <label className="block text-sm mb-1">Mood: {mood}</label>
        <input type="range" min="1" max="10" value={mood} onChange={e=>setMood(parseInt(e.target.value))} />
      </div>
      <button className="px-4 py-2 bg-green-600 text-white rounded" disabled={loading}>{loading? "Saving...":"Save entry"}</button>
    </form>
  );
}
