'use client'

import { useState } from 'react'
import { Mail, Lock, Eye, EyeOff } from 'lucide-react'
// import logo from '../../assets/logo.png'
import { Link } from 'react-router-dom'
// import Navbar from '../../components/Navbar'
// import Footer from '../../components/Footer'
import Background from '../../components/Background'

export default function Login() {
  const [rememberMe, setRememberMe] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [form, setForm] = useState({
    email: '',
    password: '',
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

      {/* Login Card */}
      <div className="relative z-10 flex-1 flex items-center justify-center w-full max-w-md mx-auto px-4 py-10">
        <div className="flex flex-col items-center w-full">


          {/* Title */}
          <h1 className="text-3xl font-bold text-white mb-2 tracking-wide" style={{ fontFamily: "'Poppins', sans-serif" }}>
            Welcome Back
          </h1>

          {/* Accent line */}
          <div className="w-48 h-[2px] bg-gradient-to-r from-transparent via-[#7B68EE] to-transparent mb-4" />

          {/* Subtitle */}
          <p className="text-white/80 text-base mb-2">
            Sign in to your <span className="font-semibold text-white">Zyrlent</span> account.
          </p>

          <p className="text-white/60 text-sm mb-8">
            Enter your credentials to continue.
          </p>

          {/* Form */}
          <form onSubmit={handleSubmit} className="w-full flex flex-col gap-4">
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

            {/* Password */}
            <div className="relative">
              <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
                <Lock className="h-5 w-5" />
              </div>
              <input
                type={showPassword ? 'text' : 'password'}
                name="password"
                placeholder="Password"
                value={form.password}
                onChange={handleChange}
                className="w-full pl-12 pr-10 py-3.5 rounded-xl bg-white/90 text-gray-700 placeholder-gray-400 text-sm font-medium outline-none focus:ring-2 focus:ring-purple-400 transition"
              />
              {/* Eye icon for password */}
              <button
                type="button"
                className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 focus:outline-none"
                tabIndex={-1}
                onClick={() => setShowPassword((v) => !v)}
              >
                {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
              </button>
            </div>

            {/* Forgot password */}
            <div className="flex justify-end">
              <Link to="/forgot-password" className="text-white/60 text-xs hover:text-purple-300 transition">
                Forgot password?
              </Link>
            </div>



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

            {/* Login Button */}
            <button
              type="submit"
              className="w-full py-3.5 rounded-xl bg-gradient-to-r from-[#33CCFF] to-[#0099FF] text-white font-bold text-base tracking-wide shadow-[0_0_15px_rgba(0,255,255,0.4)] hover:scale-105 hover:shadow-[0_0_25px_rgba(0,255,255,0.6)] transition-all mt-2 uppercase"
            >
              SIGN IN
            </button>
          </form>

          {/* Sign up link */}
          <p className="text-white/70 text-sm mt-6">
            Don't have an account?{' '}
            <Link to="/signup" className="text-white font-semibold underline underline-offset-2 hover:text-purple-300 transition">
              Register
            </Link>
          </p>
        </div>
      </div>

  {/* No Footer on auth pages */}
    </div>
  )
}
