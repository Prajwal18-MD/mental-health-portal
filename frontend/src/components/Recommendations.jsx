// frontend/src/components/Recommendations.jsx
import { useEffect, useState } from "react";

function pickRandom(arr, n) {
  const copy = [...arr];
  const res = [];
  while (res.length < n && copy.length > 0) {
    const idx = Math.floor(Math.random() * copy.length);
    res.push(copy.splice(idx, 1)[0]);
  }
  return res;
}

export default function Recommendations({ token }) {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true);
    fetch("http://127.0.0.1:8000/api/recommendations", {
      headers: token ? { Authorization: `Bearer ${token}` } : {}
    })
      .then(r => r.json())
      .then(j => {
        const arr = Array.isArray(j) ? j : (Array.isArray(j.recommendations) ? j.recommendations : []);
        if (arr.length === 0) {
          setItems([]);
        } else {
          setItems(pickRandom(arr, 3));
        }
      })
      .catch(err => {
        console.error(err);
        setItems([]);
      })
      .finally(() => setLoading(false));
  }, [token]);

  // Icon mapping for different recommendation types/categories
  const getIcon = (title) => {
    const lower = (title || "").toLowerCase();
    if (lower.includes("breath") || lower.includes("meditat")) {
      return (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      );
    }
    if (lower.includes("exercise") || lower.includes("walk") || lower.includes("activity")) {
      return (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
        </svg>
      );
    }
    if (lower.includes("sleep") || lower.includes("rest")) {
      return (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
        </svg>
      );
    }
    if (lower.includes("social") || lower.includes("friend") || lower.includes("talk")) {
      return (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
        </svg>
      );
    }
    // Default icon
    return (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    );
  };

  const getColorClass = (index) => {
    const colors = [
      { bg: 'bg-blue-100', text: 'text-blue-700', icon: 'text-blue-600' },
      { bg: 'bg-purple-100', text: 'text-purple-700', icon: 'text-purple-600' },
      { bg: 'bg-green-100', text: 'text-green-700', icon: 'text-green-600' },
    ];
    return colors[index % colors.length];
  };

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-gradient-primary flex items-center justify-center">
          <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
          </svg>
        </div>
        <div>
          <h4 className="font-display font-bold text-lg text-gray-800">Personalized Recommendations</h4>
          <p className="text-xs text-gray-500">Tailored suggestions for your well-being</p>
        </div>
      </div>

      {/* Loading State */}
      {loading && (
        <div className="flex items-center justify-center py-8">
          <div className="text-center">
            <svg className="animate-spin h-10 w-10 text-primary-500 mx-auto mb-3" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
            </svg>
            <p className="text-sm text-gray-600">Loading recommendations...</p>
          </div>
        </div>
      )}

      {/* Empty State */}
      {!loading && items.length === 0 && (
        <div className="glass-card p-8 rounded-2xl text-center">
          <svg className="w-16 h-16 text-gray-300 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
          </svg>
          <h5 className="text-base font-semibold text-gray-700 mb-1">No Recommendations Available</h5>
          <p className="text-sm text-gray-500">Check back later for personalized suggestions</p>
        </div>
      )}

      {/* Recommendations Cards */}
      <div className="space-y-4">
        {items.map((it, idx) => {
          const colors = getColorClass(idx);
          return (
            <div
              key={idx}
              className="glass-card p-5 rounded-2xl hover-lift transition-all animate-slideUp border-l-4 border-primary-400"
              style={{ animationDelay: `${idx * 100}ms` }}
            >
              <div className="flex gap-4">
                {/* Icon */}
                <div className={`w-12 h-12 rounded-xl ${colors.bg} flex items-center justify-center flex-shrink-0`}>
                  <div className={colors.icon}>
                    {getIcon(it.title)}
                  </div>
                </div>

                {/* Content */}
                <div className="flex-1">
                  <h5 className="font-semibold text-gray-900 mb-2 flex items-center gap-2">
                    {it.title}
                    <span className={`px-2 py-0.5 rounded-full text-xs font-bold ${colors.bg} ${colors.text}`}>
                      #{idx + 1}
                    </span>
                  </h5>
                  <p className="text-sm text-gray-600 leading-relaxed">
                    {it.text}
                  </p>

                  {/* Action hint */}
                  <div className="mt-3 flex items-center gap-2 text-xs text-primary-600 font-medium">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                    </svg>
                    Try this today
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
