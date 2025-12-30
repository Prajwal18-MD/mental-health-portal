import { useEffect, useState } from "react";

function RiskBadge({ risk }) {
  const map = {
    HIGH: "bg-red-200 text-red-800",
    MEDIUM: "bg-yellow-200 text-yellow-800",
    LOW: "bg-green-200 text-green-800"
  };
  return <span className={`px-2 py-1 rounded text-xs font-semibold ${map[risk] || "bg-slate-100"}`}>{risk || "—"}</span>;
}

export default function MoodHistory({ token }) {
  const [rows, setRows] = useState([]);
  useEffect(()=> {
    if(!token) return;
    fetch("http://127.0.0.1:8000/api/mood", {
      headers: { "Authorization": `Bearer ${token}` }
    }).then(r=>r.json()).then(data=>{
      setRows(data || []);
    }).catch(err=>console.error(err));
  }, [token]);

  if(!token) return null;
  return (
    <div className="p-4 border rounded">
      <h3 className="font-semibold mb-2">Mood history</h3>
      {rows.length===0 ? <div className="text-sm text-gray-500">No entries yet.</div> :
        <ul className="space-y-2">
          {rows.map(r=>(
            <li key={r.id} className="p-2 border rounded">
              <div className="flex justify-between items-start">
                <div>
                  <div className="text-sm text-gray-600">{new Date(r.date).toLocaleString()}</div>
                  <div className="font-semibold">Mood: {r.mood_value}</div>
                  {r.text ? <div className="mt-1 text-sm">{r.text}</div> : null}
                </div>
                <div className="text-right space-y-1">
                  <div><RiskBadge risk={r.risk} /></div>
                  <div className="text-xs text-gray-500">sentiment {r.sentiment ?? "—"}</div>
                </div>
              </div>
            </li>
          ))}
        </ul>
      }
    </div>
  );
}
