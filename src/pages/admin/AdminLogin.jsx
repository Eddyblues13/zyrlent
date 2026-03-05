import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAdminAuth } from '../../context/AdminAuthContext'
import { ShieldCheck, Mail, Lock, Loader2, Eye, EyeOff } from 'lucide-react'
import Background from '../../components/Background'
import logo from '../../assets/logo.png'

export default function AdminLogin() {
    const { login } = useAdminAuth()
    const navigate = useNavigate()
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [loading, setLoading] = useState(false)
    const [showPwd, setShowPwd] = useState(false)

    const handleSubmit = async (e) => {
        e.preventDefault()
        setLoading(true)
        const result = await login(email, password)
        setLoading(false)
        if (result.success) navigate('/admin/dashboard')
    }

    return (
        <Background>
            <div className="min-h-screen flex items-center justify-center px-4 py-10">
                <div className="w-full max-w-md">
                    {/* Logo + Admin Badge */}
                    <div className="text-center mb-8">
                        <img src={logo} alt="Zyrlent" className="h-10 mx-auto mb-4 object-contain" />
                        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[rgba(255,149,0,0.12)] border border-[rgba(255,149,0,0.3)] text-[#FF9500] text-sm font-bold">
                            <ShieldCheck className="w-4 h-4" /> Admin Panel
                        </div>
                    </div>

                    {/* Form Card */}
                    <div className="rounded-2xl border border-[rgba(255,149,0,0.15)] bg-[rgba(15,20,60,0.7)] backdrop-blur-xl p-8 shadow-[0_0_40px_rgba(255,149,0,0.06)]">
                        <h1 className="text-2xl font-bold text-white mb-1">Admin Login</h1>
                        <p className="text-sm text-white/40 mb-6">Sign in to the admin dashboard</p>

                        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                            {/* Email */}
                            <div className="relative">
                                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
                                <input type="email" placeholder="admin@zyrlent.com" required
                                    value={email} onChange={e => setEmail(e.target.value)}
                                    className="w-full pl-10 pr-4 py-3 rounded-xl bg-[rgba(255,255,255,0.05)] border border-[rgba(255,255,255,0.1)] text-white placeholder-white/25 text-sm focus:outline-none focus:border-[rgba(255,149,0,0.5)] transition" />
                            </div>

                            {/* Password */}
                            <div className="relative">
                                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
                                <input type={showPwd ? 'text' : 'password'} placeholder="Password" required
                                    value={password} onChange={e => setPassword(e.target.value)}
                                    className="w-full pl-10 pr-10 py-3 rounded-xl bg-[rgba(255,255,255,0.05)] border border-[rgba(255,255,255,0.1)] text-white placeholder-white/25 text-sm focus:outline-none focus:border-[rgba(255,149,0,0.5)] transition" />
                                <button type="button" onClick={() => setShowPwd(v => !v)} className="absolute right-3 top-1/2 -translate-y-1/2 text-white/30 hover:text-white/60 transition">
                                    {showPwd ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                </button>
                            </div>

                            {/* Submit */}
                            <button type="submit" disabled={loading}
                                className="w-full py-3.5 rounded-xl font-bold text-base flex items-center justify-center gap-2 bg-gradient-to-r from-[#FF9500] to-[#FF6B00] text-white shadow-[0_0_20px_rgba(255,149,0,0.3)] hover:shadow-[0_0_30px_rgba(255,149,0,0.5)] hover:scale-[1.01] transition-all disabled:opacity-50 disabled:cursor-not-allowed">
                                {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <><ShieldCheck className="w-5 h-5" />Sign In</>}
                            </button>
                        </form>

                        <p className="text-center text-xs text-white/25 mt-5">Protected area · Authorized personnel only</p>
                    </div>
                </div>
            </div>
        </Background>
    )
}
