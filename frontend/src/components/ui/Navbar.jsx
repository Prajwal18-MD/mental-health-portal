// src/components/ui/Navbar.jsx
import React, { useState } from "react";

/**
 * Props:
 *  - me: { name, email } or null
 *  - onLoginClick()
 *  - onLogout()
 *  - onDelete()
 */
export default function Navbar({ me, onLoginClick, onLogout, onDelete }) {
  const [open, setOpen] = useState(false);

  return (
    <nav className="w-full py-4 px-4 sm:px-6 flex items-center justify-between glass-navbar sticky top-0 z-40 shadow-soft">
      <div className="flex items-center gap-2 sm:gap-3 min-w-0 flex-1 mr-4">
        {/* Gradient Logo */}
        <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-2xl bg-gradient-primary flex items-center justify-center text-white font-display font-bold text-lg sm:text-xl shadow-glow hover-scale cursor-pointer flex-shrink-0">
          M
        </div>
        <div className="font-display font-bold text-sm sm:text-base md:text-lg lg:text-xl text-purple-700 break-words leading-tight">
          Mental Health Portal
        </div>
      </div>

      <div className="relative">
        {!me ? (
          <button onClick={onLoginClick} className="btn-primary px-6 py-2.5 text-sm">
            Sign In
          </button>
        ) : (
          <div>
            <button
              onClick={() => setOpen(o => !o)}
              className="flex items-center gap-3 px-4 py-2.5 glass-card rounded-xl hover:shadow-medium transition-all"
            >
              <div className="w-9 h-9 rounded-xl bg-gradient-primary flex items-center justify-center text-white font-semibold text-sm shadow-sm">
                {(me.name || "U").slice(0, 1).toUpperCase()}
              </div>
              <div className="text-sm font-semibold text-gray-700">{me.name}</div>
              <svg
                className={`w-4 h-4 text-gray-500 transition-transform ${open ? 'rotate-180' : ''}`}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>

            {open && (
              <div className="absolute right-0 mt-3 w-72 glass-card rounded-2xl p-4 shadow-large z-50 animate-slideDown">
                <div className="flex items-center gap-3 pb-4 border-b border-gray-200">
                  <div className="w-12 h-12 rounded-xl bg-gradient-primary flex items-center justify-center text-white font-bold text-lg shadow-sm">
                    {(me.name || "U").slice(0, 1).toUpperCase()}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-bold text-gray-800 truncate">{me.name}</div>
                    <div className="text-xs text-gray-500 truncate">{me.email}</div>
                  </div>
                </div>

                <div className="mt-3 space-y-1">
                  <button
                    onClick={() => { setOpen(false); onDelete && onDelete(); }}
                    className="w-full text-left px-4 py-2.5 rounded-xl hover:bg-red-50 text-red-600 font-medium transition-colors flex items-center gap-2 text-sm"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                    Delete Account
                  </button>
                  <button
                    onClick={() => { setOpen(false); onLogout && onLogout(); }}
                    className="w-full text-left px-4 py-2.5 rounded-xl hover:bg-gray-100 text-gray-700 font-medium transition-colors flex items-center gap-2 text-sm"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                    </svg>
                    Logout
                  </button>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </nav>
  );
}
