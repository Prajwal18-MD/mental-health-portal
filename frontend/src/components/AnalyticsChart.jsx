// frontend/src/components/AnalyticsChart.jsx
import { useEffect, useState } from "react";
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, BarChart, Bar, Legend } from 'recharts';

export default function AnalyticsChart({ token, range = 7 }) {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!token) return;
    setLoading(true);
    fetch(`http://127.0.0.1:8000/api/analytics/chart-data?range=${range}`, { headers: { "Authorization": `Bearer ${token}` }})
      .then(r => {
        if (!r.ok) throw new Error("Failed to fetch analytics: " + r.status);
        return r.json();
      })
      .then(rawJson => {
        // Normalize: expect array of {date, avg, high, medium, low, count}
        const mapped = (Array.isArray(rawJson) ? rawJson : []).map(d => {
          const avg = (d.avg === null || d.avg === undefined) ? null : Number(d.avg);
          // create a human-friendly label for X axis (e.g., "Dec 05")
          let display = d.date;
          try {
            const dt = new Date(d.date);
            if (!Number.isNaN(dt.getTime())) {
              display = dt.toLocaleDateString(undefined, { month: "short", day: "numeric" });
            }
          } catch (e) {}
          return {
            date: d.date,
            displayDate: display,
            avg: avg,
            high: Number(d.high || 0),
            medium: Number(d.medium || 0),
            low: Number(d.low || 0),
            count: Number(d.count || 0)
          };
        });
        setData(mapped);
      })
      .catch(err => {
        console.error(err);
        setData([]);
      })
      .finally(() => setLoading(false));
  }, [token, range]);

  // count total mood entries in range
  const totalEntries = data.reduce((acc, x) => acc + (x.count || 0), 0);

  if (!token) return null;
  return (
    <div className="p-3 border rounded bg-white">
      <h3 className="font-semibold mb-2 text-[#4D2B8C]">Mood analytics (last {range} days)</h3>

      {loading && <div className="text-sm text-gray-500 mb-2">Loading...</div>}

      {totalEntries === 0 ? (
        <div className="p-4 bg-yellow-50 text-sm rounded mb-3">No mood entries in the selected range. Add an entry to populate the chart.</div>
      ) : null}

      <div style={{ width: '100%', height: 220 }}>
        <ResponsiveContainer>
          <LineChart data={data}>
            <XAxis dataKey="displayDate" />
            <YAxis domain={[0, 10]} />
            <Tooltip />
            <Line
              connectNulls={false}
              type="monotone"
              dataKey="avg"
              stroke="#4D2B8C"
              strokeWidth={2}
              dot={{ r: 4, stroke: "#EEA727", strokeWidth: 2, fill: "#fff" }}
              activeDot={{ r: 6 }}
              isAnimationActive={false}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      <div style={{ width: '100%', height: 140 }} className="mt-3">
        <ResponsiveContainer>
          <BarChart data={data}>
            <XAxis dataKey="displayDate" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="high" name="HIGH" fill="#ef4444" />
            <Bar dataKey="medium" name="MEDIUM" fill="#f59e0b" />
            <Bar dataKey="low" name="LOW" fill="#10b981" />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
