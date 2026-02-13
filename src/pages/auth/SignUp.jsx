'use client'

import { useState } from 'react'
import { User, Mail, Phone, Lock } from 'lucide-react'
import { Link } from 'react-router-dom'
import Navbar from '../../components/Navbar'
import Footer from '../../components/Footer'
import Background from '../../components/Background'

export default function SignUp() {
  const [rememberMe, setRememberMe] = useState(true)
  const [showPassword, setShowPassword] = useState(false)
  const [form, setForm] = useState({
    username: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
  })

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const handleSubmit = (e) => {
    e.preventDefault()
  }

  return (
    <div className="min-h-screen w-full flex flex-col relative overflow-hidden">
      <Background />
      <Navbar />

      {/* Sign Up Card */}
      <div className="relative z-10 flex-1 flex items-center justify-center w-full max-w-md mx-auto px-4 py-10">
        <div className="flex flex-col items-center w-full">

          {/* Title */}
          <h1 className="text-3xl font-bold text-white mb-2 tracking-wide" style={{ fontFamily: "'Poppins', sans-serif" }}>
            Join Zyrlent
          </h1>

          {/* Accent line */}
          <div className="w-48 h-[2px] bg-gradient-to-r from-transparent via-[#7B68EE] to-transparent mb-4" />

          {/* Subtitle */}
          <p className="text-white/80 text-base mb-2">
            Create your account and get <span className="font-semibold text-white">verified.</span>
          </p>

          <p className="text-white/60 text-sm mb-8">
            Please complete all fields to proceed.
          </p>

          {/* Form */}
          <form onSubmit={handleSubmit} className="w-full flex flex-col gap-4">
            {/* Username */}
            <div className="relative">
              <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
                <User className="h-5 w-5" />
              </div>
              <input
                type="text"
                name="username"
                placeholder="Username"
                value={form.username}
                onChange={handleChange}
                className="w-full pl-12 pr-4 py-3.5 rounded-xl bg-white/90 text-gray-700 placeholder-gray-400 text-sm font-medium outline-none focus:ring-2 focus:ring-purple-400 transition"
              />
            </div>

            {/* Email */}
            <div className="relative">
              <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
                <Mail className="h-5 w-5" />
              </div>
              <input
                type="email"
                name="email"
                placeholder="Email Address"
                value={form.email}
                onChange={handleChange}
                className="w-full pl-12 pr-4 py-3.5 rounded-xl bg-white/90 text-gray-700 placeholder-gray-400 text-sm font-medium outline-none focus:ring-2 focus:ring-purple-400 transition"
              />
            </div>

            {/* Phone */}
            <div className="relative">
              <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
                <Phone className="h-5 w-5" />
              </div>
              <input
                type="tel"
                name="phone"
                placeholder="Phone Number"
                value={form.phone}
                onChange={handleChange}
                className="w-full pl-12 pr-4 py-3.5 rounded-xl bg-white/90 text-gray-700 placeholder-gray-400 text-sm font-medium outline-none focus:ring-2 focus:ring-purple-400 transition"
              />
            </div>

            {/* Password + Confirm Password (side by side) */}
            <div className="relative flex rounded-xl bg-white/90 overflow-hidden focus-within:ring-2 focus-within:ring-purple-400 transition">
              <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
                <Lock className="h-5 w-5" />
              </div>
              <input
                type={showPassword ? 'text' : 'password'}
                name="password"
                placeholder="Password"
                value={form.password}
                onChange={handleChange}
                className="w-1/2 pl-12 pr-2 py-3.5 bg-transparent text-gray-700 placeholder-gray-400 text-sm font-medium outline-none border-r border-gray-200"
              />
              <input
                type={showPassword ? 'text' : 'password'}
                name="confirmPassword"
                placeholder="Confirm Password"
                value={form.confirmPassword}
                onChange={handleChange}
                className="w-1/2 pl-4 pr-4 py-3.5 bg-transparent text-gray-700 placeholder-gray-400 text-sm font-medium outline-none"
              />
            </div>

            {/* Password hint */}
            <p className="text-white/50 text-xs -mt-1 ml-1">
              Password must be at least 8 characters and contain uppercase, lowercase, and a number
            </p>

            {/* Continue with Google */}
            <button
              type="button"
              className="w-full flex items-center justify-center gap-3 py-3.5 rounded-xl bg-white/20 backdrop-blur-sm border border-white/20 text-white font-semibold text-sm hover:bg-white/30 transition mt-1"
            >
              <svg viewBox="0 0 24 24" className="h-5 w-5" aria-hidden="true">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 01-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" />
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
              </svg>
              Continue with Google
            </button>

            {/* Remember me */}
            <label className="flex items-center gap-3 cursor-pointer mt-1">
              <div
                className={`w-5 h-5 rounded flex items-center justify-center transition ${rememberMe ? 'bg-blue-500' : 'bg-white/20 border border-white/40'}`}
                onClick={() => setRememberMe(!rememberMe)}
              >
                {rememberMe && (
                  <svg className="w-3.5 h-3.5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                  </svg>
                )}
              </div>
              <span className="text-white/80 text-sm font-medium">Remember me</span>
            </label>

            {/* Register Button */}
            <button
              type="submit"
              className="w-full py-3.5 rounded-xl bg-gradient-to-r from-[#7B68EE] to-[#9B59B6] text-white font-bold text-base tracking-wide shadow-lg shadow-purple-500/30 hover:shadow-purple-500/50 hover:scale-[1.02] transition-all mt-2"
            >
              Register
            </button>
          </form>

          {/* Sign in link */}
          <p className="text-white/70 text-sm mt-6">
            Already have an account?{' '}
            <Link to="/login" className="text-white font-semibold underline underline-offset-2 hover:text-purple-300 transition">
              Sign in
            </Link>
          </p>
        </div>
      </div>

      <Footer />
    </div>
  )
}
