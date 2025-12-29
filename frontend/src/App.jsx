import { useEffect, useState } from "react";

function App() {
  const [health, setHealth] = useState(null);

  useEffect(() => {
    fetch("http://127.0.0.1:8000/api/health")
      .then(res => res.json())
      .then(data => setHealth(data))
      .catch(err => console.error(err));
  }, []);

  return (
    <div className="min-h-screen bg-slate-100 flex items-center justify-center">
      <div className="bg-white p-6 rounded-xl shadow-md w-100">
        <h1 className="text-2xl font-bold text-center mb-4">
          Mental Health Portal
        </h1>

        {health ? (
          <div className="text-green-600 text-center">
            <p>{health.message}</p>
            <p className="text-sm text-gray-500 mt-2">
              {health.time}
            </p>
          </div>
        ) : (
          <p className="text-center text-gray-500">
            Connecting to backend...
          </p>
        )}
      </div>
    </div>
  );
}

export default App;
