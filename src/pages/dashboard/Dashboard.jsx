'use client'

import { useState, useEffect, useRef } from 'react'
import {
    Menu, Bell, User as UserIcon, LayoutDashboard, Wallet,
    ShoppingCart, History, ArrowLeftRight, Settings, LifeBuoy,
    Plus, ChevronRight, LogOut, ChevronDown
} from 'lucide-react'
import { useAuth } from '../../context/AuthContext'
import { useNavigate, useLocation } from 'react-router-dom'
import api from '../../lib/axios'
import Background from '../../components/Background'
import Sidebar from './Sidebar'

import OverviewSection from './sections/OverviewSection'
import PurchaseHistorySection from './sections/PurchaseHistorySection'
import TransactionsSection from './sections/TransactionsSection'
import FundWalletSection from './sections/FundWalletSection'
import RentNumberSection from './sections/RentNumberSection'
import ServicesSection from './sections/ServicesSection'
import SupportSection from './sections/SupportSection'
import SettingsSection from './sections/SettingsSection'

import logo from '../../assets/logo.png'

// All nav items — order matters for sidebar list
export const NAV_ITEMS = [
    { id: 'overview', label: 'Dashboard', icon: LayoutDashboard, path: '/user/dashboard' },
    { id: 'fund-wallet', label: 'Fund Wallet', icon: Wallet, path: '/user/fund-wallet' },
    { id: 'rent-number', label: 'Rent Number', icon: ShoppingCart, path: '/user/rent-number' },
    { id: 'purchase-history', label: 'Purchase History', icon: History, path: '/user/purchase-history' },
    { id: 'transactions', label: 'Transactions', icon: ArrowLeftRight, path: '/user/transactions' },
    { id: 'services', label: 'Services', icon: Settings, path: '/user/services' },
    { id: 'support', label: 'Support', icon: LifeBuoy, path: '/user/support' },
    { id: 'settings', label: 'Settings', icon: UserIcon, path: '/user/settings' },
]

// Bottom nav — 5 slots on mobile (centre is fab)
const BOTTOM_NAV = [
    { id: 'overview', label: 'Home', icon: LayoutDashboard },
    { id: 'purchase-history', label: 'Orders', icon: History },
    { id: 'rent-number', label: 'Get OTP', icon: Plus, fab: true },
    { id: 'transactions', label: 'Wallet', icon: ArrowLeftRight },
    { id: 'settings', label: 'Account', icon: UserIcon },
]

// Map URL path → section id
const PATH_TO_SECTION = {
    '/user/dashboard': 'overview',
    '/dashboard': 'overview',
    '/user/fund-wallet': 'fund-wallet',
    '/user/rent-number': 'rent-number',
    '/user/purchase-history': 'purchase-history',
    '/user/transactions': 'transactions',
    '/user/services': 'services',
    '/user/support': 'support',
    '/user/settings': 'settings',
}

export default function Dashboard({ initialSection }) {
    const { user, isLoading, logout } = useAuth()
    const navigate = useNavigate()
    const location = useLocation()

    const [isSidebarOpen, setIsSidebarOpen] = useState(false)
    const [showAvatarMenu, setShowAvatarMenu] = useState(false)
    const [wallet, setWallet] = useState(0)
    const [stats, setStats] = useState({ transactions: 0, verifications: 0, total_spent: 0, pending_sms: 0 })
    const avatarRef = useRef(null)

    // Derive active section from URL path, falling back to initialSection prop
    const activeSection = PATH_TO_SECTION[location.pathname] || initialSection || 'overview'

    useEffect(() => {
        if (!isLoading && !user) navigate('/login')
        else if (user) loadDashboardData()
    }, [user, isLoading])

    // Close avatar dropdown on outside click
    useEffect(() => {
        const handler = (e) => {
            if (avatarRef.current && !avatarRef.current.contains(e.target)) {
                setShowAvatarMenu(false)
            }
        }
        document.addEventListener('mousedown', handler)
        return () => document.removeEventListener('mousedown', handler)
    }, [])

    const loadDashboardData = async () => {
        try {
            const res = await api.get('/api/dashboard')
            setWallet(res.data.wallet_balance || 0)
            setStats(res.data.stats || { transactions: 0, verifications: 0, total_spent: 0, pending_sms: 0 })
        } catch (e) {
            console.error('Dashboard data error', e)
        }
    }

    if (isLoading || !user) {
        return (
            <div className="min-h-screen flex items-center justify-center" style={{ background: '#0A0B3D' }}>
                <div className="flex flex-col items-center gap-4">
                    <div className="w-10 h-10 border-2 border-[#00FFFF]/30 border-t-[#00FFFF] rounded-full animate-spin" />
                    <p className="text-white/50 text-sm">Loading your dashboard…</p>
                </div>
            </div>
        )
    }

    const formatNaira = (amount) =>
        new Intl.NumberFormat('en-NG', { style: 'currency', currency: 'NGN' }).format(amount || 0)

    const goTo = (sectionId) => {
        const item = NAV_ITEMS.find(n => n.id === sectionId)
        if (item) navigate(item.path)
        else navigate('/user/dashboard')
        setIsSidebarOpen(false)
        window.scrollTo({ top: 0, behavior: 'smooth' })
    }

    const handleLogout = async () => {
        setShowAvatarMenu(false)
        await logout()
        navigate('/')
    }

    const sectionLabel = NAV_ITEMS.find(n => n.id === activeSection)?.label || 'Dashboard'

    const renderSection = () => {
        switch (activeSection) {
            case 'overview': return <OverviewSection user={user} wallet={wallet} stats={stats} formatNaira={formatNaira} onNavigate={goTo} />
            case 'purchase-history': return <PurchaseHistorySection formatNaira={formatNaira} />
            case 'transactions': return <TransactionsSection formatNaira={formatNaira} />
            case 'fund-wallet': return <FundWalletSection wallet={wallet} formatNaira={formatNaira} />
            case 'rent-number': return <RentNumberSection wallet={wallet} formatNaira={formatNaira} onNavigate={goTo} />
            case 'services': return <ServicesSection onNavigate={goTo} />
            case 'support': return <SupportSection />
            case 'settings': return <SettingsSection user={user} />
            default: return <OverviewSection user={user} wallet={wallet} stats={stats} formatNaira={formatNaira} onNavigate={goTo} />
        }
    }

    return (
        <div className="min-h-screen w-full relative overflow-x-hidden font-sans text-white">
            <Background />

            <Sidebar
                isOpen={isSidebarOpen}
                onClose={() => setIsSidebarOpen(false)}
                walletBalance={wallet}
                activeSection={activeSection}
                onNavigate={goTo}
                navItems={NAV_ITEMS}
                user={user}
                formatNaira={formatNaira}
            />

            <div className="relative z-10 lg:pl-[280px] flex flex-col min-h-screen">

                {/* ── Sticky Top Header ── */}
                <header className="sticky top-0 z-40 flex items-center justify-between px-4 sm:px-6 py-3 border-b border-[rgba(255,255,255,0.07)] bg-[rgba(8,10,46,0.85)] backdrop-blur-xl">
                    {/* Left */}
                    <div className="flex items-center gap-3">
                        <button onClick={() => setIsSidebarOpen(true)} className="p-2 -ml-1 rounded-xl hover:bg-white/10 transition lg:hidden">
                            <Menu className="w-5 h-5 text-white" />
                        </button>
                        <img src={logo} alt="Zyrlent" className="h-7 object-contain lg:hidden" />
                        {/* Desktop breadcrumb */}
                        <nav className="hidden lg:flex items-center gap-1.5 text-sm text-white/45">
                            <span>Dashboard</span>
                            {activeSection !== 'overview' && (
                                <>
                                    <ChevronRight className="w-3.5 h-3.5" />
                                    <span className="text-white font-semibold">{sectionLabel}</span>
                                </>
                            )}
                        </nav>
                    </div>

                    {/* Right */}
                    <div className="flex items-center gap-2">
                        {/* Wallet pill */}
                        <button
                            onClick={() => goTo('fund-wallet')}
                            className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-semibold border border-white/12 bg-white/6 hover:bg-white/12 transition"
                        >
                            <span className="text-[#00FFFF] font-bold">₦</span>
                            <span>{wallet.toLocaleString()}</span>
                        </button>

                        {/* Notifications */}
                        <button className="relative p-2 rounded-xl hover:bg-white/10 transition">
                            <Bell className="w-5 h-5" />
                            <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-[#00FFFF] rounded-full border border-[#0A0B3D]" />
                        </button>

                        {/* Avatar + Dropdown */}
                        <div className="relative" ref={avatarRef}>
                            <button
                                onClick={() => setShowAvatarMenu(s => !s)}
                                className="flex items-center gap-2 pl-1.5 pr-2.5 py-1 rounded-xl hover:bg-white/8 transition"
                            >
                                <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-[#33CCFF] to-[#0099FF] flex items-center justify-center text-sm font-bold text-white shadow-[0_0_10px_rgba(0,255,255,0.3)]">
                                    {user?.name?.[0]?.toUpperCase() || 'U'}
                                </div>
                                <span className="hidden sm:block text-sm font-semibold text-white/80 max-w-[100px] truncate">{user?.name?.split(' ')[0]}</span>
                                <ChevronDown className={`w-3.5 h-3.5 text-white/40 transition-transform ${showAvatarMenu ? 'rotate-180' : ''}`} />
                            </button>

                            {/* Dropdown */}
                            {showAvatarMenu && (
                                <div className="absolute right-0 top-full mt-2 w-52 rounded-2xl border border-[rgba(255,255,255,0.1)] bg-[rgba(8,10,46,0.97)] backdrop-blur-xl shadow-[0_20px_60px_rgba(0,0,0,0.5)] overflow-hidden z-50">
                                    {/* User info */}
                                    <div className="px-4 py-3.5 border-b border-white/8">
                                        <p className="text-sm font-bold text-white truncate">{user?.name}</p>
                                        <p className="text-xs text-white/40 truncate">{user?.email}</p>
                                    </div>
                                    {/* Menu items */}
                                    <div className="py-1.5">
                                        {[
                                            { icon: UserIcon, label: 'Profile & Settings', action: () => goTo('settings') },
                                            { icon: Wallet, label: 'Fund Wallet', action: () => goTo('fund-wallet') },
                                            { icon: LifeBuoy, label: 'Support', action: () => goTo('support') },
                                        ].map((item, i) => (
                                            <button
                                                key={i}
                                                onClick={() => { item.action(); setShowAvatarMenu(false) }}
                                                className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-white/70 hover:text-white hover:bg-white/6 transition text-left"
                                            >
                                                <item.icon className="w-4 h-4 flex-shrink-0 text-white/30" />
                                                {item.label}
                                            </button>
                                        ))}
                                        <div className="h-px bg-white/6 my-1.5 mx-4" />
                                        <button
                                            onClick={handleLogout}
                                            className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-red-400/80 hover:text-red-400 hover:bg-red-400/6 transition text-left"
                                        >
                                            <LogOut className="w-4 h-4 flex-shrink-0" />
                                            Sign Out
                                        </button>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </header>

                {/* ── Page Content ── */}
                <main className="flex-1 px-4 sm:px-6 lg:px-8 py-6 pb-28 md:pb-10">
                    {renderSection()}
                </main>
            </div>

            {/* ── Mobile Bottom Nav ── */}
            <nav className="fixed bottom-0 left-0 w-full z-50 md:hidden border-t border-[rgba(255,255,255,0.08)] bg-[rgba(8,10,46,0.94)] backdrop-blur-xl"
                style={{ paddingBottom: 'env(safe-area-inset-bottom)' }}>
                <div className="flex justify-around items-end px-1 pt-2 pb-2">
                    {BOTTOM_NAV.map(item => {
                        const isActive = activeSection === item.id
                        return (
                            <button
                                key={item.id}
                                onClick={() => goTo(item.id)}
                                className={`flex flex-col items-center gap-1 min-w-[60px] transition ${item.fab ? '-mt-4' : ''}`}
                            >
                                {item.fab ? (
                                    <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-[#33CCFF] to-[#0066CC] flex items-center justify-center shadow-[0_0_24px_rgba(0,255,255,0.5)] border-4 border-[#080a2e]">
                                        <item.icon className="w-6 h-6 text-white" />
                                    </div>
                                ) : (
                                    <div className={`p-2 rounded-xl transition ${isActive ? 'bg-[rgba(0,255,255,0.12)]' : ''}`}>
                                        <item.icon className={`w-5 h-5 transition ${isActive ? 'text-[#00FFFF]' : 'text-white/35'}`} />
                                    </div>
                                )}
                                <span className={`text-[10px] font-semibold ${item.fab ? 'text-[#00FFFF] mt-0.5' : isActive ? 'text-[#00FFFF]' : 'text-white/30'}`}>
                                    {item.label}
                                </span>
                            </button>
                        )
                    })}
                </div>
            </nav>
        </div>
    )
}
