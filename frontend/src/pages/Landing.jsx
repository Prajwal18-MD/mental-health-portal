// src/pages/Landing.jsx
import React from 'react';
import Button from '../components/ui/Button';
import welnesss1 from '../assets/welnesss1.png';
import welnesss2 from '../assets/welnesss2.png';
import welnesss3 from '../assets/welnesss3.png';

export default function Landing({ onLogin }){
  return (
    <div className="min-h-screen flex items-start justify-center p-8">
      <div className="w-full max-w-5xl">
        <div className="text-center py-10">
          <div className="inline-block p-4 rounded-2xl bg-white shadow-soft">
            <h1 className="text-3xl font-bold text-[#4D2B8C]">Mental Health Portal</h1>
            <p className="text-sm text-gray-600 mt-3 max-w-2xl mx-auto">"From your heavy days to your hopeful moments, we are with you. Navigate your feelings and find your path to peace."</p>
            <div className="mt-6 flex items-center justify-center gap-3">
              <Button onClick={onLogin}>Login</Button>
              <Button variant="accent" onClick={onLogin}>Register</Button>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-4">
          <img src={welnesss1} alt="wellness1" className="rounded shadow-soft object-cover w-full h-40"/>
          <img src={welnesss2} alt="wellness2" className="rounded shadow-soft object-cover w-full h-40"/>
          <img src={welnesss3} alt="wellness3" className="rounded shadow-soft object-cover w-full h-40"/>
        </div>

      </div>
    </div>
  )
}
