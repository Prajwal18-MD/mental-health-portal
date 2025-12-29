import { useEffect, useState } from "react";
import { health, registerUser, loginUser, fetchMe } from "./services/api";

function App() {
  const [status, setStatus] = useState(null);
  const [mode, setMode] = useState("login"); // or "register"
  const [form, setForm] = useState({ name: "", email: "", password: "", role: "patient" });
  const [token, setToken] = useState(localStorage.getItem("mh_token") || "");
  const [me, setMe] = useState(null);

  useEffect(() => {
    health().then(setStatus).catch(err => console.error(err));
    if (token) {
      fetchMe(token).then(data => {
        if (data && data.email) setMe(data);
      }).catch(err => {
        console.error(err);
        setToken("");
        localStorage.removeItem("mh_token");
      });
    }
  }, [token]);

  async function onRegister(e) {
    e.preventDefault();
    const res = await registerUser(form.name, form.email, form.password, form.role);
    if (res && res.id) {
      alert("Registered! Now login.");
      setMode("login");
      setForm({ name: "", email: "", password: "", role: "patient" });
    } else {
      alert(res.detail || JSON.stringify(res));
    }
  }

  async function onLogin(e) {
    e.preventDefault();
    const res = await loginUser(form.email, form.password);
    if (res && res.access_token) {
      const t = res.access_token;
      localStorage.setItem("mh_token", t);
      setToken(t);
      setForm({ name: "", email: "", password: "", role: "patient" });
    } else {
      alert(res.detail || JSON.stringify(res));
    }
  }

  function logout() {
    localStorage.removeItem("mh_token");
    setToken("");
    setMe(null);
  }

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6">
      <div className="w-full max-w-2xl bg-white rounded-xl shadow-md p-6">
        <h1 className="text-2xl font-semibold mb-4 text-center">Mental Health Portal — Phase 1</h1>

        <div className="mb-4">
          <strong>Backend status:</strong> {status ? status.message : "Connecting..."}
          <div className="text-xs text-gray-500">{status ? status.time : ""}</div>
        </div>

        {me ? (
          <div>
            <div className="mb-4 p-4 border rounded">
              <h2 className="font-semibold">Logged in as {me.name} ({me.role})</h2>
              <div className="text-sm text-gray-600">{me.email}</div>
            </div>
            <button onClick={logout} className="px-4 py-2 bg-red-500 text-white rounded">Logout</button>
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-6">
            <div>
              <div className="flex gap-2 mb-2">
                <button className={`px-3 py-1 rounded ${mode==="login" ? "bg-sky-600 text-white":"bg-slate-100"}`} onClick={()=>setMode("login")}>Login</button>
                <button className={`px-3 py-1 rounded ${mode==="register" ? "bg-sky-600 text-white":"bg-slate-100"}`} onClick={()=>setMode("register")}>Register</button>
              </div>

              {mode === "register" ? (
                <form onSubmit={onRegister} className="space-y-3">
                  <input required value={form.name} onChange={e=>setForm({...form,name:e.target.value})} placeholder="Full name" className="w-full p-2 border rounded" />
                  <input required value={form.email} onChange={e=>setForm({...form,email:e.target.value})} placeholder="Email" className="w-full p-2 border rounded" />
                  <input required value={form.password} onChange={e=>setForm({...form,password:e.target.value})} type="password" placeholder="Password" className="w-full p-2 border rounded" />
                  <select value={form.role} onChange={e=>setForm({...form,role:e.target.value})} className="w-full p-2 border rounded">
                    <option value="patient">Patient</option>
                    <option value="therapist">Therapist</option>
                  </select>
                  <button type="submit" className="w-full px-4 py-2 bg-green-600 text-white rounded">Register</button>
                </form>
              ) : (
                <form onSubmit={onLogin} className="space-y-3">
                  <input required value={form.email} onChange={e=>setForm({...form,email:e.target.value})} placeholder="Email" className="w-full p-2 border rounded" />
                  <input required value={form.password} onChange={e=>setForm({...form,password:e.target.value})} type="password" placeholder="Password" className="w-full p-2 border rounded" />
                  <button type="submit" className="w-full px-4 py-2 bg-blue-600 text-white rounded">Login</button>
                </form>
              )}
            </div>

            <div>
              <div className="p-4 border rounded mb-3">
                <h3 className="font-semibold">Quick Test</h3>
                <p className="text-sm text-gray-600">Register a patient and a therapist. Then login to see your profile. Token is stored in localStorage.</p>
              </div>

              <div className="p-4 border rounded">
                <h4 className="font-semibold mb-2">Example test accounts</h4>
                <div className="text-sm">
                  <div><strong>Patient</strong>: name=Test Patient, email=patient@example.com, pass=Pass1234</div>
                  <div><strong>Therapist</strong>: name=Dr. Care, email=therapist@example.com, pass=Pass1234</div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
