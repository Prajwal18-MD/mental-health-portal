// frontend/src/components/Recommendations.jsx
import { useEffect, useState } from "react";

export default function Recommendations({ token }) {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(()=> {
    setLoading(true);
    fetch("http://127.0.0.1:8000/api/recommendations", {
      headers: token ? { Authorization: `Bearer ${token}` } : {}
    })
      .then(r=>r.json())
      .then(j => { setItems(Array.isArray(j) ? j : []); })
      .catch(err => { console.error(err); setItems([]); })
      .finally(()=>setLoading(false));
  }, [token]);

  return (
    <div className="p-4 border rounded">
      <h4 className="font-semibold mb-2">Personalized recommendations</h4>
      {loading && <div className="text-sm text-gray-500">Loading...</div>}
      {!loading && items.length === 0 && <div className="text-sm text-gray-500">No recommendations available.</div>}
      <div className="space-y-2">
        {items.map((it, idx) => (
          <div key={idx} className="p-3 border rounded bg-white">
            <div className="font-semibold">{it.title}</div>
            <div className="text-sm text-gray-600 mt-1">{it.text}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
