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
    <nav className="w-full py-3 px-6 flex items-center justify-between bg-white border-b sticky top-0 z-40">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-full bg-linear-to-br from-[#4D2B8C] to-[#85409D] flex items-center justify-center text-white font-bold">M</div>
        <div className="font-semibold text-lg">Mental Health Portal</div>
      </div>

      <div className="relative">
        {!me ? (
          <button onClick={onLoginClick} className="btn-primary">Login</button>
        ) : (
          <div>
            <button onClick={() => setOpen(o => !o)} className="flex items-center gap-2 px-3 py-1 border rounded bg-white">
              <div className="w-8 h-8 rounded-full bg-slate-200 flex items-center justify-center text-sm">{(me.name||"U").slice(0,1)}</div>
              <div className="text-sm">{me.name}</div>
            </button>

            {open && (
              <div className="absolute right-0 mt-2 w-72 bg-white p-3 rounded shadow-soft z-50">
                <div className="text-sm font-semibold">{me.name}</div>
                <div className="text-xs text-gray-500">{me.email}</div>

                <div className="mt-3 space-y-2">
                  <button
                    onClick={() => { setOpen(false); onDelete && onDelete(); }}
                    className="w-full text-left px-2 py-1 rounded hover:bg-slate-100 text-red-600"
                  >
                    Delete account
                  </button>
                  <button
                    onClick={() => { setOpen(false); onLogout && onLogout(); }}
                    className="w-full text-left px-2 py-1 rounded hover:bg-slate-100"
                  >
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
