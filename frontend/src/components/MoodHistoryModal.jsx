// src/components/MoodHistoryModal.jsx
import { useEffect, useState } from "react";
import Modal from "./ui/Modal";
import ExportData from "./ExportData";

export default function MoodHistoryModal({ token, open, onClose }) {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(()=>{ if (open) fetchHistory(); }, [open]);

  async function fetchHistory() {
    if (!token) return;
    setLoading(true);
    try {
      const r = await fetch("http://127.0.0.1:8000/api/mood", { headers: { Authorization: `Bearer ${token}` }});
      const j = await r.json();
      if (r.ok) setItems(j || []);
      else setItems([]);
    } catch (err) {
      console.error(err);
      setItems([]);
    } finally {
      setLoading(false);
    }
  }

  return (
    <Modal open={open} onClose={onClose} title="Mood history">
      <div className="space-y-3">
        <div className="flex justify-between items-center">
          <div className="text-sm text-gray-600">{items.length} entries</div>
          <ExportData data={items} filename={`mood-data-${new Date().toISOString().slice(0,10)}.csv`} />
        </div>

        {loading && <div className="text-sm text-gray-500">Loading...</div>}
        {!loading && items.length === 0 && <div className="text-sm text-gray-500">No mood entries yet.</div>}

        <ul className="space-y-2 max-h-[55vh] overflow-auto">
          {items.map(it => (
            <li key={it.id} className="p-2 border rounded">
              <div className="text-xs text-gray-500">{new Date(it.date || it.created_at || it.createdAt).toLocaleString()}</div>
              <div className="font-semibold">Mood: {it.mood_value}</div>
              <div className="text-sm mt-1">{it.text || <span className="text-gray-400">— no note —</span>}</div>
              <div className="text-xs mt-1 text-gray-600">Risk: {it.risk ?? it.risk_level ?? "—"}</div>
            </li>
          ))}
        </ul>
      </div>
    </Modal>
  );
}
