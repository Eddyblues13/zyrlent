'use client'

import { useState } from 'react'
import { Lock, Eye, EyeOff } from 'lucide-react'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import Background from '../../components/Background'
import { useAuth } from '../../context/AuthContext'
import toast from 'react-hot-toast'

export default function ResetPassword() {
    const [searchParams] = useSearchParams();
    const email = searchParams.get('email');
    const token = searchParams.get('token');

    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirm, setShowConfirm] = useState(false);

    const { resetPassword, isLoading } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (password !== confirmPassword) {
            return toast.error("Passwords do not match.");
        }
        const success = await resetPassword(email, token, password, confirmPassword);
        if (success) {
            navigate('/login');
        }
    };

    if (!email || !token) {
        return (
            <div className="min-h-screen w-full flex flex-col items-center justify-center relative overflow-hidden bg-[#0A0A0B]">
                <div className="text-white text-center z-10">
                    <h1 className="text-2xl font-bold mb-4">Invalid Reset Link</h1>
                    <p className="text-gray-400 mb-6">The password reset link seems to be invalid or missing parameters.</p>
                    <Link to="/forgot-password" className="text-blue-400 hover:text-blue-300 transition">Request a new link</Link>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen w-full flex flex-col relative overflow-hidden">
            <Background />

            {/* Reset Password Card */}
            <div className="relative z-10 flex-1 flex items-center justify-center w-full max-w-md mx-auto px-4 py-10">
                <div className="flex flex-col items-center w-full">


                    {/* Title */}
                    <h1 className="text-3xl font-bold text-white mb-2 tracking-wide" style={{ fontFamily: "'Poppins', sans-serif" }}>
                        New Password
                    </h1>

                    {/* Accent line */}
                    <div className="w-48 h-[2px] bg-gradient-to-r from-transparent via-[#7B68EE] to-transparent mb-4" />

                    {/* Subtitle */}
                    <p className="text-white/80 text-base mb-2 text-center">
                        Set a new secure password.
                    </p>

                    <p className="text-white/60 text-sm mb-8 text-center">
                        Make sure it's at least 8 characters.
                    </p>

                    {/* Form */}
                    <form onSubmit={handleSubmit} className="w-full flex flex-col gap-4">
                        {/* Password */}
                        <div className="relative">
                            <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
                                <Lock className="h-5 w-5" />
                            </div>
                            <input
                                type={showPassword ? 'text' : 'password'}
                                name="password"
                                placeholder="New Password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
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

                        {/* Confirm Password */}
                        <div className="relative mt-2">
                            <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
                                <Lock className="h-5 w-5" />
                            </div>
                            <input
                                type={showConfirm ? 'text' : 'password'}
                                name="confirm_password"
                                placeholder="Confirm New Password"
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                required
                                className="w-full pl-12 pr-10 py-3.5 rounded-xl bg-white/90 text-gray-700 placeholder-gray-400 text-sm font-medium outline-none focus:ring-2 focus:ring-purple-400 transition"
                            />
                            {/* Eye icon for password */}
                            <button
                                type="button"
                                className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 focus:outline-none"
                                tabIndex={-1}
                                onClick={() => setShowConfirm((v) => !v)}
                            >
                                {showConfirm ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                            </button>
                        </div>

                        {/* Submit Button */}
                        <button
                            type="submit"
                            disabled={isLoading}
                            className="w-full py-3.5 rounded-xl bg-gradient-to-r from-[#33CCFF] to-[#0099FF] text-white font-bold text-base tracking-wide shadow-[0_0_15px_rgba(0,255,255,0.4)] hover:scale-105 hover:shadow-[0_0_25px_rgba(0,255,255,0.6)] transition-all mt-4 uppercase disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {isLoading ? 'SAVING...' : 'RESET PASSWORD'}
                        </button>
                    </form>

                    {/* Back to login link */}
                    <p className="text-white/70 text-sm mt-8">
                        Remembered your password?{' '}
                        <Link to="/login" className="text-white font-semibold underline underline-offset-2 hover:text-purple-300 transition">
                            Sign in
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    )
}
