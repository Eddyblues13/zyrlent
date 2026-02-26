'use client'

import { useState, useRef, useEffect } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import Background from '../../components/Background'
import toast from 'react-hot-toast'

export default function VerifyEmail() {
    const [code, setCode] = useState(['', '', '', ''])
    const [cooldown, setCooldown] = useState(0)
    const inputRefs = useRef([])
    const location = useLocation()
    const navigate = useNavigate()
    const { verifyEmail, resendCode, isLoading } = useAuth()

    const email = location.state?.email

    // Redirect if no email in state
    useEffect(() => {
        if (!email) {
            navigate('/register')
        }
    }, [email, navigate])

    // Cooldown timer
    useEffect(() => {
        if (cooldown <= 0) return
        const timer = setInterval(() => {
            setCooldown((prev) => prev - 1)
        }, 1000)
        return () => clearInterval(timer)
    }, [cooldown])

    const handleChange = (index, value) => {
        // Only allow digits
        if (value && !/^\d$/.test(value)) return

        const newCode = [...code]
        newCode[index] = value
        setCode(newCode)

        // Auto-focus next input
        if (value && index < 3) {
            inputRefs.current[index + 1]?.focus()
        }
    }

    const handleKeyDown = (index, e) => {
        if (e.key === 'Backspace' && !code[index] && index > 0) {
            inputRefs.current[index - 1]?.focus()
        }
    }

    const handlePaste = (e) => {
        e.preventDefault()
        const pastedData = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, 4)
        if (pastedData.length === 4) {
            const newCode = pastedData.split('')
            setCode(newCode)
            inputRefs.current[3]?.focus()
        }
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        const fullCode = code.join('')
        if (fullCode.length !== 4) {
            return toast.error('Please enter the full 4-digit code.', { position: 'top-center' })
        }

        const success = await verifyEmail(email, fullCode)
        if (success) {
            navigate('/dashboard')
        }
    }

    const handleResend = async () => {
        if (cooldown > 0) return
        const success = await resendCode(email)
        if (success) {
            setCooldown(60)
            setCode(['', '', '', ''])
            inputRefs.current[0]?.focus()
        }
    }

    if (!email) return null

    return (
        <div className="min-h-screen w-full flex flex-col relative overflow-hidden">
            <Background />

            <div className="relative z-10 flex-1 flex items-center justify-center w-full max-w-md mx-auto px-4 py-10">
                <div className="flex flex-col items-center w-full">

                    {/* Title */}
                    <h1 className="text-3xl font-bold text-white mb-2 tracking-wide" style={{ fontFamily: "'Poppins', sans-serif" }}>
                        Verify Your Email
                    </h1>

                    {/* Accent line */}
                    <div className="w-48 h-[2px] bg-gradient-to-r from-transparent via-[#7B68EE] to-transparent mb-4" />

                    {/* Subtitle */}
                    <p className="text-white/80 text-base mb-1 text-center">
                        We've sent a 4-digit code to
                    </p>
                    <p className="text-white font-semibold text-sm mb-8 text-center break-all">
                        {email}
                    </p>

                    {/* Code Inputs */}
                    <form onSubmit={handleSubmit} className="w-full flex flex-col items-center gap-6">
                        <div className="flex gap-3 justify-center">
                            {code.map((digit, index) => (
                                <input
                                    key={index}
                                    ref={(el) => (inputRefs.current[index] = el)}
                                    type="text"
                                    inputMode="numeric"
                                    maxLength={1}
                                    value={digit}
                                    onChange={(e) => handleChange(index, e.target.value)}
                                    onKeyDown={(e) => handleKeyDown(index, e)}
                                    onPaste={index === 0 ? handlePaste : undefined}
                                    className="w-16 h-16 text-center text-2xl font-bold rounded-xl bg-white/90 text-gray-700 outline-none focus:ring-2 focus:ring-purple-400 transition"
                                    autoFocus={index === 0}
                                />
                            ))}
                        </div>

                        {/* Verify Button */}
                        <button
                            type="submit"
                            disabled={isLoading || code.join('').length !== 4}
                            className="w-full py-3.5 rounded-xl bg-gradient-to-r from-[#33CCFF] to-[#0099FF] text-white font-bold text-base tracking-wide shadow-[0_0_15px_rgba(0,255,255,0.4)] hover:scale-105 hover:shadow-[0_0_25px_rgba(0,255,255,0.6)] transition-all uppercase disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {isLoading ? 'VERIFYING...' : 'VERIFY EMAIL'}
                        </button>
                    </form>

                    {/* Resend */}
                    <div className="mt-6 text-center">
                        <p className="text-white/60 text-sm mb-2">Didn't receive the code?</p>
                        <button
                            onClick={handleResend}
                            disabled={cooldown > 0 || isLoading}
                            className="text-white font-semibold text-sm underline underline-offset-2 hover:text-purple-300 transition disabled:opacity-50 disabled:cursor-not-allowed disabled:no-underline"
                        >
                            {cooldown > 0 ? `Resend in ${cooldown}s` : 'Resend Code'}
                        </button>
                    </div>

                    {/* Back to register */}
                    <p className="text-white/50 text-xs mt-8">
                        Wrong email?{' '}
                        <button
                            onClick={() => navigate('/register')}
                            className="text-white/70 underline underline-offset-2 hover:text-purple-300 transition"
                        >
                            Go back
                        </button>
                    </p>
                </div>
            </div>
        </div>
    )
}
