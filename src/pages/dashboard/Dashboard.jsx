'use client'

import { useState, useEffect } from 'react'
import { Menu, Bell, User as UserIcon, Plus, ChevronDown, CheckCircle2, History, ShoppingBag, Search, FileText, ArrowRight, ArrowLeft } from 'lucide-react'
import { useAuth } from '../../context/AuthContext'
import { useNavigate } from 'react-router-dom'
import api from '../../lib/axios'
import Background from '../../components/Background'
import Sidebar from './Sidebar'

import logo from '../../assets/logo.png'

export default function Dashboard() {
    const { user, isLoading } = useAuth()
    const navigate = useNavigate()

    const [isSidebarOpen, setIsSidebarOpen] = useState(false)
    const [wallet, setWallet] = useState(0)
    const [stats, setStats] = useState({
        transactions: 0,
        verifications: 0,
        total_spent: 0,
        pending_sms: 0
    })

    useEffect(() => {
        if (!isLoading && !user) {
            navigate('/login')
        } else if (user) {
            loadDashboardData()
        }
    }, [user, isLoading, navigate])

    const loadDashboardData = async () => {
        try {
            const res = await api.get('/api/dashboard')
            setWallet(res.data.wallet_balance)
            setStats(res.data.stats)
        } catch (e) {
            console.error("Failed to load dashboard data", e)
        }
    }

    if (isLoading || !user) {
        return <div className="min-h-screen bg-[#0A0A0B] flex items-center justify-center text-white">Loading...</div>
    }

    // Formatting utility
    const formatNaira = (amount) => {
        return new Intl.NumberFormat('en-NG', { style: 'currency', currency: 'NGN' }).format(amount || 0)
    }

    return (
        <div className="min-h-screen w-full relative overflow-hidden bg-[#0A0A0B] pb-24 font-sans text-white">
            <Background />

            <Sidebar
                isOpen={isSidebarOpen}
                onClose={() => setIsSidebarOpen(false)}
                walletBalance={wallet}
            />

            <div className="relative z-10 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 lg:pl-[300px] pt-6 pb-20 flex flex-col h-full min-h-screen">
                {/* Header section matches sketch: Menu icon, "Zyrlent", profile/bell icons, "Hi, [Name]" inside the body below */}
                <header className="flex justify-between items-center mb-6">
                    <div className="flex items-center gap-3">
                        <button
                            onClick={() => setIsSidebarOpen(true)}
                            className="p-2 -ml-2 rounded-lg hover:bg-white/10 transition lg:hidden"
                        >
                            <Menu className="w-6 h-6 text-white" />
                        </button>
                        <img src={logo} alt="Zyrlent Logo" className="h-8 object-contain lg:hidden" />
                    </div>

                    <div className="flex items-center gap-3">
                        <button className="flex items-center gap-1.5 px-3 py-1.5 bg-white/10 hover:bg-white/20 transition rounded-full text-sm font-medium border border-white/20">
                            <span className="text-[#00FFFF] font-bold">₦</span> {wallet}
                        </button>
                        <button className="p-2 rounded-full hover:bg-white/10 transition">
                            <Bell className="w-5 h-5" />
                        </button>
                        <button className="p-2 rounded-full hover:bg-white/10 transition bg-gradient-to-br from-[#33CCFF] to-[#0099FF] shadow-[0_0_10px_rgba(0,255,255,0.3)]">
                            <UserIcon className="w-5 h-5" />
                        </button>
                    </div>
                </header>

                {/* Main Desktop Grid */}
                <div className="flex flex-col lg:grid lg:grid-cols-12 lg:gap-8 lg:items-start w-full">

                    {/* Left Column (Main Action Area) */}
                    <div className="lg:col-span-7 xl:col-span-8 flex flex-col order-2 lg:order-1">
                        {/* Greeting */}
                        <div className="mb-6 hidden lg:block">
                            <h2 className="text-3xl font-bold flex items-center gap-2">
                                <span role="img" aria-label="wave">👋</span> Hi, {user.name.split(' ')[0]}
                            </h2>
                            <p className="text-white/60 mt-1">Ready to verify some numbers today?</p>
                        </div>

                        {/* Get Verified Form Area */}
                        <section className="mb-8">
                            <h3 className="text-xl font-bold mb-2 text-[#FFFFFF]">Get verified Now</h3>
                            <p className="text-sm text-white/60 mb-6 leading-relaxed lg:max-w-md">
                                Select the platform you want to verify and your preferred country. Credits are deducted only after a successful code delivery.
                            </p>

                            <div className="flex flex-col gap-4">
                                {/* Service Input */}
                                <div>
                                    <label className="text-sm font-medium text-white/80 ml-1 mb-2 block">Select Service</label>
                                    <div className="relative cursor-pointer transition-all hover:border-[rgba(0,255,255,0.4)] border border-[rgba(255,255,255,0.1)] bg-[rgba(255,255,255,0.05)] rounded-xl p-4 flex items-center justify-between">
                                        <div className="flex items-center gap-3">
                                            {/* Placeholder icon representing Whatsapp */}
                                            <div className="w-8 h-8 rounded-full bg-[#25D366]/20 flex items-center justify-center">
                                                <div className="w-4 h-4 bg-[#25D366] rounded flex items-center justify-center text-[10px] font-bold">W</div>
                                            </div>
                                            <span className="font-semibold text-white/90">WhatsApp messaging</span>
                                        </div>
                                        <div className="flex items-center gap-2 text-white/50">
                                            <Search className="w-5 h-5" />
                                            <ChevronDown className="w-5 h-5 ml-1" />
                                        </div>
                                    </div>
                                </div>

                                {/* Country Input */}
                                <div>
                                    <label className="text-sm font-medium text-white/80 ml-1 mb-2 block">Select Country</label>
                                    <div className="relative cursor-pointer transition-all hover:border-[rgba(0,255,255,0.4)] border border-[rgba(255,255,255,0.1)] bg-[rgba(255,255,255,0.05)] rounded-xl p-4 flex items-center justify-between">
                                        <div className="flex items-center gap-3">
                                            {/* Placeholder icon representing US Flag */}
                                            <span className="text-2xl rounded shadow-sm">🇺🇸</span>
                                            <div className="flex flex-col">
                                                <span className="font-semibold text-white/90">United States</span>
                                                <span className="text-xs text-[#00FFFF]">+1 98% Success</span>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-2 text-white/50">
                                            <Search className="w-5 h-5" />
                                            <ChevronDown className="w-5 h-5 ml-1" />
                                        </div>
                                    </div>
                                </div>

                                <div className="flex flex-col sm:flex-row gap-3 mt-4 lg:mt-6">
                                    <button className="flex-1 py-4 rounded-xl border border-[rgba(0,255,255,0.4)] bg-[rgba(0,255,255,0.05)] text-[#00FFFF] font-bold text-base hover:bg-[rgba(0,255,255,0.1)] transition-all flex items-center justify-center gap-2 group">
                                        Get number
                                        <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                                    </button>

                                    <button className="sm:w-32 py-4 rounded-xl border border-white/20 bg-transparent text-white/80 font-bold text-base hover:bg-white/5 transition-all text-center">
                                        Back
                                    </button>
                                </div>
                            </div>
                        </section>
                    </div>

                    {/* Right Column (Wallet & Stats) */}
                    <div className="lg:col-span-5 xl:col-span-4 flex flex-col order-1 lg:order-2">

                        {/* Greeting (Mobile Only) */}
                        <div className="mb-4 lg:hidden">
                            <h2 className="text-2xl font-semibold flex items-center gap-2">
                                <span role="img" aria-label="wave">👋</span> Hi, {user.name.split(' ')[0]}
                            </h2>
                        </div>

                        {/* Wallet Balance Card */}
                        <section className="relative w-full rounded-2xl bg-gradient-to-br from-[rgba(15,20,60,0.9)] to-[rgba(10,11,61,0.95)] border border-[rgba(0,255,255,0.2)] p-6 mb-8 lg:mb-6 overflow-hidden">
                            {/* Card subtle glow background */}
                            <div className="absolute -top-10 -right-10 w-32 h-32 bg-[#00FFFF]/20 blur-3xl rounded-full"></div>

                            <div className="relative z-10">
                                <p className="text-sm font-medium text-white/70 mb-1">Wallet Balance</p>
                                <h1 className="text-4xl font-bold mb-6 tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-white to-[#00FFFF]">
                                    {formatNaira(wallet)}
                                </h1>

                                <button className="w-full py-3.5 rounded-xl bg-gradient-to-r from-[#33CCFF] to-[#0099FF] text-white font-bold text-[15px] shadow-[0_0_15px_rgba(0,255,255,0.3)] hover:scale-[1.02] hover:shadow-[0_0_20px_rgba(0,255,255,0.5)] transition-all flex items-center justify-center gap-2">
                                    <Plus className="w-5 h-5" />
                                    Fund Wallet
                                </button>
                            </div>
                        </section>

                        {/* Stats Grid */}
                        <section className="grid grid-cols-2 gap-4 mb-8 lg:mb-0">
                            {/* Transactions */}
                            <div className="rounded-xl border border-[rgba(255,255,255,0.1)] bg-[rgba(15,20,60,0.4)] p-4 hover:border-[rgba(0,255,255,0.3)] transition">
                                <FileText className="w-5 h-5 text-white/60 mb-2" />
                                <p className="text-xs font-medium text-white/60 mb-1 uppercase tracking-wider">Transactions</p>
                                <h4 className="text-xl font-bold text-white">{stats.transactions}</h4>
                            </div>

                            {/* Verifications */}
                            <div className="rounded-xl border border-[rgba(255,255,255,0.1)] bg-[rgba(15,20,60,0.4)] p-4 hover:border-[rgba(0,255,255,0.3)] transition">
                                <CheckCircle2 className="w-5 h-5 text-white/60 mb-2" />
                                <p className="text-xs font-medium text-white/60 mb-1 uppercase tracking-wider">Verifications</p>
                                <h4 className="text-xl font-bold text-white">{stats.verifications}</h4>
                            </div>

                            {/* Total Spent */}
                            <div className="rounded-xl border border-[rgba(255,255,255,0.1)] bg-[rgba(15,20,60,0.4)] p-4 hover:border-[rgba(0,255,255,0.3)] transition">
                                <div className="w-5 h-5 flex items-center justify-center rounded text-[12px] font-bold text-white/60 bg-white/10 mb-2">₦</div>
                                <p className="text-xs font-medium text-white/60 mb-1 uppercase tracking-wider">Total Spent</p>
                                <h4 className="text-lg font-bold text-white truncate">{formatNaira(stats.total_spent)}</h4>
                            </div>

                            {/* Pending SMS */}
                            <div className="rounded-xl border border-[rgba(255,255,255,0.1)] bg-[rgba(15,20,60,0.4)] p-4 hover:border-[rgba(0,255,255,0.3)] transition">
                                <div className="w-5 h-5 flex items-center justify-center rounded text-[16px] mb-2 bg-[#00FFFF]/10 text-[#00FFFF]">↻</div>
                                <p className="text-xs font-medium text-white/60 mb-1 uppercase tracking-wider">Pending SMS</p>
                                <h4 className="text-xl font-bold text-white">{stats.pending_sms}</h4>
                            </div>
                        </section>
                    </div>
                </div>
            </div>

            {/* Fixed Bottom Navigation matching sketch */}
            <nav className="fixed bottom-0 left-0 w-full bg-[#0A0B3D] border-t border-[rgba(255,255,255,0.1)] pb-safe z-50 md:hidden">
                <div className="max-w-lg mx-auto flex justify-between items-center px-6 py-4">

                    <button className="flex flex-col items-center gap-1 opacity-60 hover:opacity-100 transition text-[#00FFFF]">
                        <div className="relative w-6 h-6 flex items-center justify-center">
                            {/* Sketch box icon */}
                            <ShoppingBag className="w-6 h-6" />
                        </div>
                        <span className="text-[10px] font-medium tracking-wide">Total Orders</span>
                    </button>

                    <button className="flex flex-col items-center gap-1 opacity-60 hover:opacity-100 transition">
                        <div className="relative w-6 h-6 flex items-center justify-center">
                            <Plus className="w-6 h-6 absolute -top-1 -right-1" />
                            <ShoppingBag className="w-5 h-5 outline outline-2 outline-offset-1 rounded-sm" />
                        </div>
                        <span className="text-[10px] font-medium tracking-wide">Purchase number</span>
                    </button>

                    <button className="flex flex-col items-center gap-1 opacity-60 hover:opacity-100 transition">
                        <div className="relative w-6 h-6 flex items-center justify-center">
                            <div className="w-5 h-5 border-[1.5px] border-current rounded-sm flex items-center justify-center">
                                <div className="w-1.5 h-1.5 bg-current rounded-full"></div>
                            </div>
                        </div>
                        <span className="text-[10px] font-medium tracking-wide">Fund wallet</span>
                    </button>

                    <button className="flex flex-col items-center gap-1 opacity-60 hover:opacity-100 transition">
                        <div className="relative w-6 h-6 flex items-center justify-center">
                            <History className="w-5 h-5" />
                            <div className="absolute top-1 right-1 w-1 h-1 bg-current rounded-full"></div>
                        </div>
                        <span className="text-[10px] font-medium tracking-wide">Purchase History</span>
                    </button>

                </div>
            </nav>
        </div>
    )
}
