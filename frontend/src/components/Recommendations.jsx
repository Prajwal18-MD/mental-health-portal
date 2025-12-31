// frontend/src/components/Recommendations.jsx
import { useEffect, useState } from "react";

export default function Recommendations({ token }) {
  const [recs, setRecs] = useState([]);
  const [context, setContext] = useState(null);

  useEffect(()=>{
    if(!token) return;
    fetch("http://127.0.0.1:8000/api/recommendations", { headers: { "Authorization": `Bearer ${token}` }})
      .then(r=>r.json()).then(data=>{
        setContext(data.context);
        setRecs(data.recommendations || []);
      }).catch(err=>console.error(err));
  }, [token]);

  if(!token) return null;
  return (
    <div className="p-3 border rounded">
      <h3 className="font-semibold mb-2">Personalized recommendations</h3>
      {recs.length===0 ? <div className="text-sm text-gray-500">No recommendations yet.</div> : (
        <div className="space-y-2">
          {recs.map(r=> (
            <div key={r.id} className="p-2 border rounded">
              <div className="font-semibold">{r.title}</div>
              <div className="text-sm text-gray-600">{r.desc}</div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
