// frontend/src/components/AnalyticsChart.jsx
import { useEffect, useState } from "react";
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, BarChart, Bar, Legend } from 'recharts';

export default function AnalyticsChart({ token, range=7 }) {
  const [data, setData] = useState([]);
  const [raw, setRaw] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(()=>{
    if(!token) return;
    setLoading(true);
    fetch(`http://127.0.0.1:8000/api/analytics/chart-data?range=${range}`, { headers: { "Authorization": `Bearer ${token}` }})
      .then(r=>{
        if(!r.ok) throw new Error("Failed to fetch analytics: "+r.status);
        return r.json();
      })
      .then(rawJson=>{
        console.log("Analytics API raw:", rawJson);
        setRaw(rawJson);
        // Normalize: expect array of {date, avg, high, medium, low}
        const mapped = rawJson.map(d => {
          // avg may be null/undefined — keep null for gap behaviour
          const avg = (d.avg === null || d.avg === undefined) ? null : Number(d.avg);
          return {
            date: d.date, // expect YYYY-MM-DD
            avg: avg,
            high: Number(d.high || 0),
            medium: Number(d.medium || 0),
            low: Number(d.low || 0),
            count: Number(d.count || 0)
          };
        });
        setData(mapped);
      })
      .catch(err=> {
        console.error(err);
        setRaw({ error: String(err) });
        setData([]);
      })
      .finally(()=> setLoading(false));
  }, [token, range]);

  // count total mood entries in range
  const totalEntries = data.reduce((acc, x) => acc + (x.count || 0), 0);

  if(!token) return null;
  return (
    <div className="p-3 border rounded">
      <h3 className="font-semibold mb-2">Mood analytics (last {range} days)</h3>

      {loading && <div className="text-sm text-gray-500 mb-2">Loading...</div>}

      {totalEntries === 0 ? (
        <div className="p-4 bg-yellow-50 text-sm rounded mb-3">No mood entries in the selected range. Add an entry to populate the chart.</div>
      ) : null}

      <div style={{ width: '100%', height: 220 }}>
        <ResponsiveContainer>
          <LineChart data={data}>
            <XAxis dataKey="date" />
            <YAxis domain={[0, 10]} />
            <Tooltip />
            {/* show line with dots; do not connect nulls so missing days are gaps */}
            <Line
              connectNulls={false}
              type="monotone"
              dataKey="avg"
              stroke="#4D2B8C"       /* deep purple primary */
              strokeWidth={2}
              dot={{ r: 4, stroke: "#EEA727", strokeWidth: 2, fill: "#fff" }} /* golden accent outline */
              activeDot={{ r: 6 }}
              isAnimationActive={false}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      <div style={{ width: '100%', height: 140 }} className="mt-3">
        <ResponsiveContainer>
          <BarChart data={data}>
            <XAxis dataKey="date" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="high" name="HIGH" fill="#e11d48" />    {/* red for high */}
            <Bar dataKey="medium" name="MEDIUM" fill="#f59e0b" />{/* amber */}
            <Bar dataKey="low" name="LOW" fill="#10b981" />     {/* green */}
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div className="mt-3">
        <div className="font-medium mb-1">Debug — raw API response</div>
        <pre style={{ maxHeight: 180, overflow: 'auto', background: '#f7f7f7', padding: 10, borderRadius: 6 }}>
          { raw ? JSON.stringify(raw, null, 2) : 'No raw data fetched yet.' }
        </pre>
      </div>
    </div>
  )
}
