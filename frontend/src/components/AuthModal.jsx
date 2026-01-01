// src/components/AuthModal.jsx
import React, { useState } from "react";
import Modal from "./ui/Modal";
import FloatingInput from "./ui/FloatingInput";
import { loginUser, registerUser } from "../services/api";

/**
 * Props:
 * - open (bool)
 * - onClose (fn)
 * - onAuthSuccess(token) (fn)  -> called when login/register succeed
 */
export default function AuthModal({ open, onClose, onAuthSuccess }) {
  const [mode, setMode] = useState("login"); // or 'register'
  const [loading, setLoading] = useState(false);

  const [name, setName] = useState("");
  const [role, setRole] = useState("patient");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPwd, setShowPwd] = useState(false);

  function resetFields() {
    setName("");
    setRole("patient");
    setEmail("");
    setPassword("");
    setShowPwd(false);
  }

  function validateEmail(e) {
    // simple regex
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(e);
  }

  async function handleLogin(e) {
    e.preventDefault();
    if (!validateEmail(email)) {
      alert("Please enter a valid email address.");
      return;
    }
    if (password.length < 6) {
      alert("Password must be at least 6 characters.");
      return;
    }
    setLoading(true);
    try {
      const res = await loginUser(email, password);
      if (res && res.access_token) {
        onAuthSuccess(res.access_token);
        resetFields();
      } else {
        alert(res?.detail || JSON.stringify(res));
      }
    } catch (err) {
      console.error(err);
      alert("Network or server error during login.");
    } finally {
      setLoading(false);
    }
  }

  async function handleRegister(e) {
    e.preventDefault();
    if (!name || name.length < 2) {
      alert("Please enter your full name.");
      return;
    }
    if (!validateEmail(email)) {
      alert("Please enter a valid email address.");
      return;
    }
    if (password.length < 6) {
      alert("Password must be at least 6 characters.");
      return;
    }
    setLoading(true);
    try {
      const res = await registerUser(name, email, password, role);
      if (res && res.id) {
        // auto-login after register: call loginUser to fetch token
        const li = await loginUser(email, password);
        if (li && li.access_token) {
          onAuthSuccess(li.access_token);
          resetFields();
        } else {
          alert("Registered but failed to log in automatically. Try logging in.");
          setMode("login");
        }
      } else {
        alert(res?.detail || JSON.stringify(res));
      }
    } catch (err) {
      console.error(err);
      alert("Network or server error during registration.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <Modal open={open} onClose={onClose} title={mode === "login" ? "Login" : "Register"}>
      <div className="space-y-4">
        <div className="flex gap-2">
          <button
            className={`px-3 py-1 rounded ${mode === "login" ? "bg-primary text-white" : "bg-slate-100"}`}
            onClick={() => setMode("login")}
            aria-pressed={mode === "login"}
          >
            Login
          </button>
          <button
            className={`px-3 py-1 rounded ${mode === "register" ? "bg-primary text-white" : "bg-slate-100"}`}
            onClick={() => setMode("register")}
            aria-pressed={mode === "register"}
          >
            Register
          </button>
        </div>

        {mode === "register" ? (
          <form onSubmit={handleRegister} className="space-y-3" aria-label="Register form">
            <FloatingInput id="reg-name" label="Full name" value={name} onChange={e => setName(e.target.value)} required autoFocus />
            <FloatingInput id="reg-email" label="Email" type="email" value={email} onChange={e => setEmail(e.target.value)} required />
            <div style={{ position: "relative" }}>
              <FloatingInput id="reg-password" label="Password" type={showPwd ? "text" : "password"} value={password} onChange={e => setPassword(e.target.value)} required />
              <div className="input-eye" style={{ right: 12 }} onClick={() => setShowPwd(s => !s)} aria-hidden>
                {showPwd ? "🙈" : "👁️"}
              </div>
            </div>

            <div className="input-float">
              <select value={role} onChange={e => setRole(e.target.value)} className="w-full p-2 border rounded">
                <option value="patient">Patient</option>
                <option value="therapist">Therapist</option>
              </select>
              <label style={{ left: 12, top: -8, fontSize: "0.75rem", color: "#6b7280", pointerEvents: "none" }}>Role</label>
            </div>

            <div className="pt-2">
              <button type="submit" disabled={loading} className="w-full btn-primary">
                {loading ? "Creating..." : "Create account"}
              </button>
            </div>
          </form>
        ) : (
          <form onSubmit={handleLogin} className="space-y-3" aria-label="Login form">
            <FloatingInput id="login-email" label="Email" type="email" value={email} onChange={e => setEmail(e.target.value)} required autoFocus />
            <div style={{ position: "relative" }}>
              <FloatingInput id="login-password" label="Password" type={showPwd ? "text" : "password"} value={password} onChange={e => setPassword(e.target.value)} required />
              <div className="input-eye" style={{ right: 12 }} onClick={() => setShowPwd(s => !s)} aria-hidden>
                {showPwd ? "🙈" : "👁️"}
              </div>
            </div>

            <div className="pt-2">
              <button type="submit" disabled={loading} className="w-full btn-primary">
                {loading ? "Signing in..." : "Sign in"}
              </button>
            </div>
          </form>
        )}

        <div className="text-xs text-gray-500">
          By using this app locally you keep your data private. For testing use sample accounts shown in the app.
        </div>
      </div>
    </Modal>
  );
}
