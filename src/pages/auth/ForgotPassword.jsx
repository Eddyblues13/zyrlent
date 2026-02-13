'use client'

import { useState } from 'react'
import { Mail } from 'lucide-react'
import { Link } from 'react-router-dom'
import Navbar from '../../components/Navbar'
import Footer from '../../components/Footer'
import Background from '../../components/Background'

export default function ForgotPassword() {
  const [email, setEmail] = useState('')
  const [submitted, setSubmitted] = useState(false)

  const handleSubmit = (e) => {
    e.preventDefault()
    setSubmitted(true)
  }

  return (
    <div className="min-h-screen w-full flex flex-col relative overflow-hidden">
      <Background />
      <Navbar />

      {/* Forgot Password Card */}
      <div className="relative z-10 flex-1 flex items-center justify-center w-full max-w-md mx-auto px-4 py-10">
        <div className="flex flex-col items-center w-full">

          {/* Title */}
          <h1 className="text-3xl font-bold text-white mb-2 tracking-wide" style={{ fontFamily: "'Poppins', sans-serif" }}>
            Reset Password
          </h1>

          {/* Accent line */}
          <div className="w-48 h-[2px] bg-gradient-to-r from-transparent via-[#7B68EE] to-transparent mb-4" />

          {!submitted ? (
            <>
              {/* Subtitle */}
              <p className="text-white/80 text-base mb-2 text-center">
                Forgot your password? No worries.
              </p>

              <p className="text-white/60 text-sm mb-8 text-center">
                Enter your email and we'll send you a reset link.
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
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="w-full pl-12 pr-4 py-3.5 rounded-xl bg-white/90 text-gray-700 placeholder-gray-400 text-sm font-medium outline-none focus:ring-2 focus:ring-purple-400 transition"
                  />
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  className="w-full py-3.5 rounded-xl bg-gradient-to-r from-[#7B68EE] to-[#9B59B6] text-white font-bold text-base tracking-wide shadow-lg shadow-purple-500/30 hover:shadow-purple-500/50 hover:scale-[1.02] transition-all mt-2"
                >
                  Send Reset Link
                </button>
              </form>
            </>
          ) : (
            <>
              {/* Success state */}
              <div className="flex flex-col items-center mt-4">
                <div className="w-16 h-16 rounded-full bg-green-500/20 flex items-center justify-center mb-6">
                  <svg className="w-8 h-8 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <p className="text-white/80 text-base mb-2 text-center">
                  Reset link sent!
                </p>
                <p className="text-white/60 text-sm text-center mb-6">
                  Check your email at <span className="text-white font-medium">{email}</span> for a link to reset your password.
                </p>
                <button
                  onClick={() => setSubmitted(false)}
                  className="text-purple-300 text-sm font-medium hover:text-purple-200 transition"
                >
                  Didn't receive it? Send again
                </button>
              </div>
            </>
          )}

          {/* Back to login link */}
          <p className="text-white/70 text-sm mt-8">
            Remember your password?{' '}
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
