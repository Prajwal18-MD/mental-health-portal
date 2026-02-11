// src/pages/Landing.jsx
import React from 'react';
import Button from '../components/ui/Button';
import welnesss1 from '../assets/welnesss1.png';
import welnesss2 from '../assets/welnesss2.png';
import welnesss3 from '../assets/welnesss3.png';

export default function Landing({ onLogin }) {
  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Animated Gradient Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50 animate-gradient bg-[length:200%_200%]" />

      {/* Floating Orbs for Visual Interest */}
      <div className="absolute top-20 left-10 w-72 h-72 bg-primary-300 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-float" />
      <div className="absolute top-40 right-10 w-96 h-96 bg-accent-400 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-float" style={{ animationDelay: '2s' }} />
      <div className="absolute -bottom-32 left-1/3 w-80 h-80 bg-primary-400 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-float" style={{ animationDelay: '4s' }} />

      {/* Main Content */}
      <div className="relative flex items-center justify-center min-h-screen p-8">
        <div className="w-full max-w-6xl">
          {/* Hero Section */}
          <div className="text-center py-16 animate-slideUp">
            <div className="inline-block px-8 py-12 rounded-3xl glass-card shadow-large hover-lift">
              {/* Badge */}
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-primary text-white text-sm font-semibold mb-6 shadow-glow">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                </svg>
                Your Mental Health Companion
              </div>

              {/* Main Heading */}
              <h1 className="text-6xl font-display font-bold mb-6 leading-tight">
                <span className="gradient-text">Mental Health Portal</span>
              </h1>

              {/* Subheading */}
              <p className="text-xl text-gray-700 font-medium max-w-2xl mx-auto mb-4 leading-relaxed">
                Navigate your feelings and find your path to peace
              </p>

              <p className="text-base text-gray-600 max-w-xl mx-auto mb-10">
                From your heavy days to your hopeful moments, we're with you every step of the way.
                Professional support, mood tracking, and personalized recommendations—all in one place.
              </p>

              {/* CTA Buttons */}
              <div className="flex items-center justify-center gap-4 flex-wrap">
                <button
                  onClick={onLogin}
                  className="btn-primary text-lg px-8 py-4 hover-scale inline-flex items-center gap-2"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
                  </svg>
                  Sign In
                </button>
                <button
                  onClick={onLogin}
                  className="btn-glass text-lg px-8 py-4 hover-scale inline-flex items-center gap-2"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
                  </svg>
                  Get Started
                </button>
              </div>
            </div>
          </div>

          {/* Feature Showcase Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12 animate-slideUp" style={{ animationDelay: '0.2s' }}>
            {/* Card 1 */}
            <div className="group relative overflow-hidden rounded-2xl glass-card hover-lift cursor-pointer">
              <div className="relative h-64 overflow-hidden">
                <img
                  src={welnesss1}
                  alt="Mood Tracking"
                  className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-primary-900/80 via-primary-700/40 to-transparent" />
              </div>
              <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
                <h3 className="text-2xl font-display font-bold mb-2">Track Your Mood</h3>
                <p className="text-sm text-gray-100">Daily journaling and mood tracking with AI insights</p>
              </div>
            </div>

            {/* Card 2 */}
            <div className="group relative overflow-hidden rounded-2xl glass-card hover-lift cursor-pointer">
              <div className="relative h-64 overflow-hidden">
                <img
                  src={welnesss2}
                  alt="Professional Support"
                  className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-accent-600/80 via-accent-500/40 to-transparent" />
              </div>
              <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
                <h3 className="text-2xl font-display font-bold mb-2">Expert Guidance</h3>
                <p className="text-sm text-gray-100">Connect with licensed therapists and counselors</p>
              </div>
            </div>

            {/* Card 3 */}
            <div className="group relative overflow-hidden rounded-2xl glass-card hover-lift cursor-pointer">
              <div className="relative h-64 overflow-hidden">
                <img
                  src={welnesss3}
                  alt="Analytics & Insights"
                  className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-primary-800/80 via-primary-600/40 to-transparent" />
              </div>
              <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
                <h3 className="text-2xl font-display font-bold mb-2">Personal Insights</h3>
                <p className="text-sm text-gray-100">Visual analytics and personalized recommendations</p>
              </div>
            </div>
          </div>

          {/* Trust Indicators */}
          <div className="mt-16 text-center animate-fadeIn" style={{ animationDelay: '0.4s' }}>
            <p className="text-sm text-gray-600 mb-4 font-medium">Trusted by thousands for their mental wellness journey</p>
            <div className="flex items-center justify-center gap-8 flex-wrap">
              <div className="text-center">
                <div className="text-3xl font-display font-bold gradient-text">24/7</div>
                <div className="text-sm text-gray-600">Support Available</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-display font-bold gradient-text">100%</div>
                <div className="text-sm text-gray-600">Confidential</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-display font-bold gradient-text">1000+</div>
                <div className="text-sm text-gray-600">Happy Users</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

