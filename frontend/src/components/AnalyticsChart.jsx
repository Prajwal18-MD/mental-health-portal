// frontend/src/components/AnalyticsChart.jsx
import { useEffect, useState } from "react";
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, BarChart, Bar, Legend } from 'recharts';

export default function AnalyticsChart({ token, range=7 }) {
  const [data, setData] = useState([]);
  useEffect(()=>{
    if(!token) return;
    fetch(`http://127.0.0.1:8000/api/analytics/chart-data?range=${range}`, { headers: { "Authorization": `Bearer ${token}` }})
      .then(r=>r.json()).then(setData).catch(err=>console.error(err));
  }, [token, range]);

  if(!token) return null;
  return (
    <div className="p-3 border rounded">
      <h3 className="font-semibold mb-2">Mood analytics (last {range} days)</h3>
      <div style={{ width: '100%', height: 200 }}>
        <ResponsiveContainer>
          <LineChart data={data}>
            <XAxis dataKey="date" />
            <YAxis domain={[0, 10]} />
            <Tooltip />
            <Line type="monotone" dataKey="avg" stroke="#8884d8" />
          </LineChart>
        </ResponsiveContainer>
      </div>

      <div style={{ width: '100%', height: 120 }} className="mt-3">
        <ResponsiveContainer>
          <BarChart data={data}>
            <XAxis dataKey="date" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="high" name="HIGH" />
            <Bar dataKey="medium" name="MEDIUM" />
            <Bar dataKey="low" name="LOW" />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}
