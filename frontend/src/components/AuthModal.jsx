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
  const [mode, setMode] = useState("login");
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
    <Modal
      open={open}
      onClose={onClose}
      title={mode === "login" ? "Welcome Back" : "Create Account"}
      size="md"
    >
      <div className="space-y-6">
        {/* Tab Switcher */}
        <div className="flex gap-2 p-1 bg-gray-100 rounded-xl">
          <button
            className={`flex-1 px-6 py-3 rounded-lg font-semibold transition-all ${mode === "login"
                ? "bg-gradient-primary text-white shadow-glow"
                : "text-gray-600 hover:text-gray-900"
              }`}
            onClick={() => setMode("login")}
            aria-pressed={mode === "login"}
          >
            Login
          </button>
          <button
            className={`flex-1 px-6 py-3 rounded-lg font-semibold transition-all ${mode === "register"
                ? "bg-gradient-primary text-white shadow-glow"
                : "text-gray-600 hover:text-gray-900"
              }`}
            onClick={() => setMode("register")}
            aria-pressed={mode === "register"}
          >
            Register
          </button>
        </div>

        {mode === "register" ? (
          <form onSubmit={handleRegister} className="space-y-4" aria-label="Register form">
            <FloatingInput
              id="reg-name"
              label="Full name"
              value={name}
              onChange={e => setName(e.target.value)}
              required
              autoFocus
            />

            <FloatingInput
              id="reg-email"
              label="Email"
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              required
            />

            <div style={{ position: "relative" }}>
              <FloatingInput
                id="reg-password"
                label="Password"
                type={showPwd ? "text" : "password"}
                value={password}
                onChange={e => setPassword(e.target.value)}
                required
              />
              <div
                className="input-eye"
                style={{ right: 12 }}
                onClick={() => setShowPwd(s => !s)}
                aria-hidden
              >
                {showPwd ? "🙈" : "👁️"}
              </div>
            </div>

            <div className="input-float">
              <select
                value={role}
                onChange={e => setRole(e.target.value)}
                className="w-full p-3 border-2 border-gray-200 rounded-xl focus:border-primary-500 focus:ring-4 focus:ring-primary-100 transition-all"
              >
                <option value="patient">Patient</option>
                <option value="therapist">Therapist</option>
              </select>
              <label className="text-xs text-gray-600 font-semibold ml-3 -mt-1 block">Role</label>
            </div>

            <div className="pt-2">
              <button
                type="submit"
                disabled={loading}
                className="w-full btn-primary py-4 text-lg"
              >
                {loading ? (
                  <>
                    <svg className="animate-spin h-5 w-5" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                    </svg>
                    Creating account...
                  </>
                ) : "Create Account"}
              </button>
            </div>
          </form>
        ) : (
          <form onSubmit={handleLogin} className="space-y-4" aria-label="Login form">
            <FloatingInput
              id="login-email"
              label="Email"
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              required
              autoFocus
            />

            <div style={{ position: "relative" }}>
              <FloatingInput
                id="login-password"
                label="Password"
                type={showPwd ? "text" : "password"}
                value={password}
                onChange={e => setPassword(e.target.value)}
                required
              />
              <div
                className="input-eye"
                style={{ right: 12 }}
                onClick={() => setShowPwd(s => !s)}
                aria-hidden
              >
                {showPwd ? "🙈" : "👁️"}
              </div>
            </div>

            <div className="pt-2">
              <button
                type="submit"
                disabled={loading}
                className="w-full btn-primary py-4 text-lg"
              >
                {loading ? (
                  <>
                    <svg className="animate-spin h-5 w-5" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                    </svg>
                    Signing in...
                  </>
                ) : "Sign In"}
              </button>
            </div>
          </form>
        )}

        <div className="pt-4 px-4 py-3 bg-blue-50 border-l-4 border-blue-500 rounded-lg">
          <p className="text-xs text-blue-900 leading-relaxed">
            <strong>Privacy Note:</strong> Your data is stored locally and remains completely private.
            This is a secure testing environment.
          </p>
        </div>
      </div>
    </Modal>
  );
}
