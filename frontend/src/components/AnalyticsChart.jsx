// frontend/src/components/AnalyticsChart.jsx
import { useEffect, useState } from "react";
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, BarChart, Bar, Legend, CartesianGrid, Area, AreaChart } from 'recharts';

export default function AnalyticsChart({ token, range = 7 }) {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!token) return;
    setLoading(true);
    fetch(`http://127.0.0.1:8000/api/analytics/chart-data?range=${range}`, { headers: { "Authorization": `Bearer ${token}` } })
      .then(r => {
        if (!r.ok) throw new Error("Failed to fetch analytics: " + r.status);
        return r.json();
      })
      .then(rawJson => {
        const mapped = (Array.isArray(rawJson) ? rawJson : []).map(d => {
          const avg = (d.avg === null || d.avg === undefined) ? null : Number(d.avg);
          let display = d.date;
          try {
            const dt = new Date(d.date);
            if (!Number.isNaN(dt.getTime())) {
              display = dt.toLocaleDateString(undefined, { month: "short", day: "numeric" });
            }
          } catch (e) { }
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

  const totalEntries = data.reduce((acc, x) => acc + (x.count || 0), 0);

  // Custom Tooltip Component
  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="glass-card p-3 rounded-xl shadow-large border-2 border-primary-200">
          <p className="font-semibold text-primary-900 mb-2">{label}</p>
          {payload.map((entry, index) => (
            <p key={index} className="text-sm" style={{ color: entry.color }}>
              <span className="font-medium">{entry.name}:</span> {entry.value.toFixed(2)}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  if (!token) return null;

  return (
    <div className="space-y-6">
      {/* Header with Stats */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-2xl font-display font-bold text-gray-900">
            📊 Mood Analytics
          </h3>
          <p className="text-sm font-bold text-primary-700 mt-1">📅 Last {range} days analysis</p>
        </div>
        <div className="glass-card px-5 py-3 rounded-xl border-2 border-primary-200">
          <div className="text-sm font-bold text-primary-700">📈 Total Entries</div>
          <div className="text-3xl font-bold text-gray-900">
            {totalEntries}
          </div>
        </div>
      </div>

      {loading && (
        <div className="flex items-center justify-center py-12">
          <div className="text-center">
            <svg className="animate-spin h-10 w-10 text-primary-500 mx-auto mb-3" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
            </svg>
            <p className="text-sm text-gray-600">Loading analytics...</p>
          </div>
        </div>
      )}

      {!loading && totalEntries === 0 && (
        <div className="glass-card p-8 rounded-2xl text-center">
          <svg className="w-16 h-16 text-gray-300 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
          </svg>
          <h4 className="text-lg font-semibold text-gray-700 mb-2">No Data Available</h4>
          <p className="text-sm text-gray-500">Add mood entries to see your analytics here</p>
        </div>
      )}

      {!loading && totalEntries > 0 && (
        <>
          {/* Bar Chart for Risk Levels */}
          <div className="glass-card p-6 rounded-2xl border-2 border-primary-100">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-2 h-2 rounded-full bg-gradient-accent" />
              <h4 className="font-bold text-lg text-gray-900">⚠️ Risk Level Distribution</h4>
            </div>
            <div style={{ width: '100%', height: 260 }}>
              <ResponsiveContainer>
                <BarChart data={data}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                  <XAxis
                    dataKey="displayDate"
                    stroke="#6b7280"
                    style={{ fontSize: '12px', fontWeight: 500 }}
                  />
                  <YAxis
                    stroke="#6b7280"
                    style={{ fontSize: '12px', fontWeight: 500 }}
                  />
                  <Tooltip content={<CustomTooltip />} />
                  <Legend
                    wrapperStyle={{ fontSize: '13px', fontWeight: 600 }}
                    iconType="circle"
                  />
                  <Bar
                    dataKey="high"
                    name="High Risk"
                    fill="#ef4444"
                    radius={[8, 8, 0, 0]}
                    animationDuration={1000}
                  />
                  <Bar
                    dataKey="medium"
                    name="Medium Risk"
                    fill="#f59e0b"
                    radius={[8, 8, 0, 0]}
                    animationDuration={1000}
                    animationDelay={200}
                  />
                  <Bar
                    dataKey="low"
                    name="Low Risk"
                    fill="#10b981"
                    radius={[8, 8, 0, 0]}
                    animationDuration={1000}
                    animationDelay={400}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Stats Summary */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="glass-card p-5 rounded-2xl hover-lift">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl bg-red-100 flex items-center justify-center">
                  <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                  </svg>
                </div>
                <div>
                  <div className="text-sm font-bold text-red-700">🔴 High Risk</div>
                  <div className="text-2xl font-bold text-red-600">
                    {data.reduce((acc, d) => acc + d.high, 0)}
                  </div>
                </div>
              </div>
            </div>

            <div className="glass-card p-5 rounded-2xl hover-lift">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl bg-yellow-100 flex items-center justify-center">
                  <svg className="w-6 h-6 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div>
                  <div className="text-sm font-bold text-yellow-700">🟡 Medium Risk</div>
                  <div className="text-2xl font-bold text-yellow-600">
                    {data.reduce((acc, d) => acc + d.medium, 0)}
                  </div>
                </div>
              </div>
            </div>

            <div className="glass-card p-5 rounded-2xl hover-lift">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl bg-green-100 flex items-center justify-center">
                  <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div>
                  <div className="text-sm font-bold text-green-700">🟢 Low Risk</div>
                  <div className="text-2xl font-bold text-green-600">
                    {data.reduce((acc, d) => acc + d.low, 0)}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
