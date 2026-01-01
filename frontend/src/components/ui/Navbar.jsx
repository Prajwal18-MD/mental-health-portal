// src/components/ui/Navbar.jsx
import React from 'react';

export default function Navbar({ onLoginClick }) {
  return (
    <nav className="w-full py-3 px-6 flex items-center justify-between bg-transparent">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-full bg-linear-to-br from-[#4D2B8C] to-[#85409D] flex items-center justify-center text-white font-bold">M</div>
        <div className="font-semibold text-lg">Mental Health Portal</div>
      </div>

      <div>
        <button onClick={onLoginClick} className="btn-primary">Login</button>
      </div>
    </nav>
  )
}
