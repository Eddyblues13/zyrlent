import { useState } from 'react'
import { User, Lock, Bell, Shield, LogOut, Camera, Check, Eye, EyeOff, Smartphone, Mail, Globe, Moon } from 'lucide-react'
import { useAuth } from '../../../context/AuthContext'
import { useNavigate } from 'react-router-dom'

const TABS = [
    { id: 'profile', label: 'Profile', icon: User },
    { id: 'security', label: 'Security', icon: Lock },
    { id: 'notifications', label: 'Notifications', icon: Bell },
    { id: 'privacy', label: 'Privacy', icon: Shield },
]

function ProfileTab({ user }) {
    const [form, setForm] = useState({ name: user?.name || '', email: user?.email || '', phone: user?.phone || '' })
    const [saved, setSaved] = useState(false)

    const handleSave = () => {
        setSaved(true)
        setTimeout(() => setSaved(false), 2500)
    }

    return (
        <div className="flex flex-col gap-6">
            {/* Avatar */}
            <div className="flex flex-col sm:flex-row sm:items-center gap-5">
                <div className="relative w-20 h-20 flex-shrink-0">
                    <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-[#33CCFF] to-[#0099FF] flex items-center justify-center text-3xl font-bold text-white shadow-[0_0_20px_rgba(0,255,255,0.3)]">
                        {user?.name?.[0]?.toUpperCase() || 'U'}
                    </div>
                    <button className="absolute -bottom-1 -right-1 w-7 h-7 rounded-lg bg-[#33CCFF] flex items-center justify-center shadow-md hover:bg-[#00FFFF] transition">
                        <Camera className="w-3.5 h-3.5 text-[#05082E]" />
                    </button>
                </div>
                <div>
                    <p className="font-bold text-white text-base">{user?.name}</p>
                    <p className="text-white/40 text-sm">{user?.email}</p>
                    <p className="text-xs text-[#00FFFF] mt-1">Member since Feb 2026</p>
                </div>
            </div>

            {/* Form */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {[
                    { key: 'name', label: 'Full Name', icon: User, type: 'text', placeholder: 'Your full name' },
                    { key: 'email', label: 'Email Address', icon: Mail, type: 'email', placeholder: 'you@example.com' },
                    { key: 'phone', label: 'Phone Number', icon: Smartphone, type: 'tel', placeholder: '+234...', full: true },
                ].map(f => (
                    <div key={f.key} className={f.full ? 'sm:col-span-2' : ''}>
                        <label className="text-xs font-semibold text-white/40 uppercase tracking-wider mb-2 block">{f.label}</label>
                        <div className="relative">
                            <f.icon className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-white/25" />
                            <input
                                type={f.type}
                                value={form[f.key]}
                                onChange={e => setForm(p => ({ ...p, [f.key]: e.target.value }))}
                                placeholder={f.placeholder}
                                className="w-full pl-10 pr-4 py-3 rounded-xl bg-[rgba(255,255,255,0.05)] border border-[rgba(255,255,255,0.1)] text-white placeholder-white/25 text-sm focus:outline-none focus:border-[rgba(0,255,255,0.4)] transition"
                            />
                        </div>
                    </div>
                ))}
            </div>

            <button
                onClick={handleSave}
                className={`sm:w-fit px-8 py-3 rounded-xl font-bold text-sm transition-all flex items-center gap-2 ${saved
                    ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                    : 'bg-gradient-to-r from-[#33CCFF] to-[#0066CC] text-white shadow-[0_0_15px_rgba(0,255,255,0.2)] hover:shadow-[0_0_22px_rgba(0,255,255,0.35)] hover:scale-[1.01]'
                    }`}
            >
                {saved ? <><Check className="w-4 h-4" /> Saved!</> : 'Save Changes'}
            </button>
        </div>
    )
}

function SecurityTab() {
    const [showOld, setShowOld] = useState(false)
    const [showNew, setShowNew] = useState(false)
    const [twoFA, setTwoFA] = useState(false)
    const [saved, setSaved] = useState(false)

    return (
        <div className="flex flex-col gap-6">
            {/* Change Password */}
            <div className="rounded-xl border border-[rgba(255,255,255,0.08)] bg-[rgba(15,20,60,0.5)] p-5">
                <h4 className="font-bold text-white mb-4 flex items-center gap-2">
                    <Lock className="w-4 h-4 text-[#00FFFF]" /> Change Password
                </h4>
                <div className="flex flex-col gap-4">
                    {[
                        { label: 'Current Password', show: showOld, toggle: () => setShowOld(s => !s) },
                        { label: 'New Password', show: showNew, toggle: () => setShowNew(s => !s) },
                        { label: 'Confirm New Password', show: showNew, toggle: null },
                    ].map((f, i) => (
                        <div key={i}>
                            <label className="text-xs font-semibold text-white/40 uppercase tracking-wider mb-2 block">{f.label}</label>
                            <div className="relative">
                                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-white/25" />
                                <input
                                    type={f.show ? 'text' : 'password'}
                                    placeholder="••••••••"
                                    className="w-full pl-10 pr-10 py-3 rounded-xl bg-[rgba(255,255,255,0.05)] border border-[rgba(255,255,255,0.1)] text-white placeholder-white/25 text-sm focus:outline-none focus:border-[rgba(0,255,255,0.4)] transition"
                                />
                                {f.toggle && (
                                    <button onClick={f.toggle} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-white/30 hover:text-white transition">
                                        {f.show ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                    </button>
                                )}
                            </div>
                        </div>
                    ))}
                    <button
                        onClick={() => { setSaved(true); setTimeout(() => setSaved(false), 2500) }}
                        className={`py-3 rounded-xl font-bold text-sm transition-all flex items-center justify-center gap-2 ${saved ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' : 'bg-gradient-to-r from-[#33CCFF] to-[#0066CC] text-white shadow-[0_0_15px_rgba(0,255,255,0.2)] hover:shadow-[0_0_22px_rgba(0,255,255,0.35)]'}`}
                    >
                        {saved ? <><Check className="w-4 h-4" />Updated!</> : 'Update Password'}
                    </button>
                </div>
            </div>

            {/* 2FA Toggle */}
            <div className="rounded-xl border border-[rgba(255,255,255,0.08)] bg-[rgba(15,20,60,0.5)] p-5">
                <div className="flex items-start justify-between gap-4">
                    <div>
                        <h4 className="font-bold text-white flex items-center gap-2 mb-1">
                            <Smartphone className="w-4 h-4 text-[#00FFFF]" /> Two-Factor Authentication
                        </h4>
                        <p className="text-sm text-white/40">Add an extra layer of security to your account via SMS or authenticator app.</p>
                    </div>
                    <button
                        onClick={() => setTwoFA(s => !s)}
                        className={`relative w-12 h-6 rounded-full transition-colors flex-shrink-0 ${twoFA ? 'bg-[#00FFFF]' : 'bg-white/15'}`}
                    >
                        <span className={`absolute top-1 w-4 h-4 rounded-full bg-white shadow transition-transform ${twoFA ? 'translate-x-7' : 'translate-x-1'}`} />
                    </button>
                </div>
                {twoFA && (
                    <div className="mt-4 pt-4 border-t border-white/5">
                        <p className="text-xs text-[#00FFFF]">2FA is enabled. Your account is protected.</p>
                    </div>
                )}
            </div>

            {/* Active Sessions */}
            <div className="rounded-xl border border-[rgba(255,255,255,0.08)] bg-[rgba(15,20,60,0.5)] p-5">
                <h4 className="font-bold text-white mb-4">Active Sessions</h4>
                {[
                    { device: 'Chrome on macOS', location: 'Lagos, NG', current: true },
                    { device: 'Safari on iPhone', location: 'Lagos, NG', current: false },
                ].map((s, i) => (
                    <div key={i} className="flex items-center justify-between py-3 border-b border-white/5 last:border-b-0">
                        <div>
                            <p className="text-sm font-semibold text-white">{s.device}</p>
                            <p className="text-xs text-white/40">{s.location} {s.current && <span className="text-emerald-400 ml-1">· Current</span>}</p>
                        </div>
                        {!s.current && (
                            <button className="text-xs text-red-400 hover:text-red-300 transition px-3 py-1 rounded-lg border border-red-400/20 hover:bg-red-400/5">
                                Revoke
                            </button>
                        )}
                    </div>
                ))}
            </div>
        </div>
    )
}

function NotificationsTab() {
    const [prefs, setPrefs] = useState({
        sms_delivery: true, purchase_success: true, wallet_topup: true,
        weekly_summary: false, product_updates: false, marketing: false,
    })

    const toggle = key => setPrefs(p => ({ ...p, [key]: !p[key] }))

    const groups = [
        {
            label: 'Transactional',
            items: [
                { key: 'sms_delivery', label: 'OTP Delivery Alerts', desc: 'When your OTP number delivers a code' },
                { key: 'purchase_success', label: 'Purchase Confirmations', desc: 'When a number is successfully rented' },
                { key: 'wallet_topup', label: 'Wallet Top-up', desc: 'When your wallet is funded' },
            ]
        },
        {
            label: 'Report & Marketing',
            items: [
                { key: 'weekly_summary', label: 'Weekly Summary', desc: 'A digest of your usage each week' },
                { key: 'product_updates', label: 'Product Updates', desc: 'New features and service launches' },
                { key: 'marketing', label: 'Promotions', desc: 'Special offers and credit bonuses' },
            ]
        },
    ]

    return (
        <div className="flex flex-col gap-5">
            {groups.map(g => (
                <div key={g.label} className="rounded-xl border border-[rgba(255,255,255,0.08)] bg-[rgba(15,20,60,0.5)] p-5">
                    <p className="text-xs font-bold text-white/40 uppercase tracking-widest mb-4">{g.label}</p>
                    <div className="flex flex-col gap-0">
                        {g.items.map((item, i) => (
                            <div key={item.key} className={`flex items-center justify-between py-3.5 ${i < g.items.length - 1 ? 'border-b border-white/5' : ''}`}>
                                <div>
                                    <p className="text-sm font-semibold text-white">{item.label}</p>
                                    <p className="text-xs text-white/40 mt-0.5">{item.desc}</p>
                                </div>
                                <button
                                    onClick={() => toggle(item.key)}
                                    className={`relative w-11 h-6 rounded-full transition-colors flex-shrink-0 ml-4 ${prefs[item.key] ? 'bg-[#00FFFF]' : 'bg-white/15'}`}
                                >
                                    <span className={`absolute top-1 w-4 h-4 rounded-full shadow transition-transform ${prefs[item.key] ? 'translate-x-6 bg-[#0A0B3D]' : 'translate-x-1 bg-white'}`} />
                                </button>
                            </div>
                        ))}
                    </div>
                </div>
            ))}
        </div>
    )
}

function PrivacyTab() {
    const [dataSharing, setDataSharing] = useState(false)
    const [analytics, setAnalytics] = useState(true)

    return (
        <div className="flex flex-col gap-5">
            <div className="rounded-xl border border-[rgba(255,255,255,0.08)] bg-[rgba(15,20,60,0.5)] p-5">
                <h4 className="font-bold text-white mb-4 flex items-center gap-2"><Globe className="w-4 h-4 text-[#00FFFF]" /> Data & Privacy</h4>
                {[
                    { key: 'dataSharing', label: 'Data Sharing', desc: 'Allow Zyrlent to use anonymized data to improve services', state: dataSharing, set: setDataSharing },
                    { key: 'analytics', label: 'Usage Analytics', desc: 'Help us improve by sending crash & usage reports', state: analytics, set: setAnalytics },
                ].map(item => (
                    <div key={item.key} className="flex items-center justify-between py-3.5 border-b border-white/5 last:border-b-0">
                        <div>
                            <p className="text-sm font-semibold text-white">{item.label}</p>
                            <p className="text-xs text-white/40 mt-0.5">{item.desc}</p>
                        </div>
                        <button
                            onClick={() => item.set(s => !s)}
                            className={`relative w-11 h-6 rounded-full transition-colors flex-shrink-0 ml-4 ${item.state ? 'bg-[#00FFFF]' : 'bg-white/15'}`}
                        >
                            <span className={`absolute top-1 w-4 h-4 rounded-full shadow transition-transform ${item.state ? 'translate-x-6 bg-[#0A0B3D]' : 'translate-x-1 bg-white'}`} />
                        </button>
                    </div>
                ))}
            </div>

            {/* Delete Account */}
            <div className="rounded-xl border border-red-500/20 bg-red-500/5 p-5">
                <h4 className="font-bold text-red-400 mb-1">Danger Zone</h4>
                <p className="text-xs text-white/40 mb-4">Once you delete your account, all data is permanently removed and cannot be recovered.</p>
                <button className="px-5 py-2.5 rounded-xl border border-red-400/30 text-red-400 text-sm font-bold hover:bg-red-400/10 transition">
                    Delete My Account
                </button>
            </div>
        </div>
    )
}

export default function SettingsSection({ user }) {
    const { logout } = useAuth()
    const navigate = useNavigate()
    const [activeTab, setActiveTab] = useState('profile')

    const handleLogout = async () => {
        await logout()
        navigate('/')
    }

    return (
        <div className="flex flex-col gap-6 max-w-3xl">
            {/* Header */}
            <div>
                <h2 className="text-2xl font-bold text-white flex items-center gap-2">
                    <User className="w-6 h-6 text-[#00FFFF]" />
                    Settings
                </h2>
                <p className="text-white/40 text-sm mt-0.5">Manage your account, security and preferences</p>
            </div>

            {/* Tab Bar */}
            <div className="flex gap-1 overflow-x-auto no-scrollbar p-1 rounded-xl bg-[rgba(255,255,255,0.04)] border border-[rgba(255,255,255,0.07)]">
                {TABS.map(tab => (
                    <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id)}
                        className={`flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-semibold whitespace-nowrap transition flex-1 justify-center ${activeTab === tab.id
                            ? 'bg-[rgba(0,255,255,0.15)] text-[#00FFFF] shadow-[inset_0_0_0_1px_rgba(0,255,255,0.3)]'
                            : 'text-white/45 hover:text-white hover:bg-white/5'
                            }`}
                    >
                        <tab.icon className="w-4 h-4 flex-shrink-0" />
                        <span className="hidden sm:inline">{tab.label}</span>
                    </button>
                ))}
            </div>

            {/* Tab Content */}
            <div>
                {activeTab === 'profile' && <ProfileTab user={user} />}
                {activeTab === 'security' && <SecurityTab />}
                {activeTab === 'notifications' && <NotificationsTab />}
                {activeTab === 'privacy' && <PrivacyTab />}
            </div>

            {/* Logout shortcut */}
            <div className="pt-2 border-t border-white/5">
                <button
                    onClick={handleLogout}
                    className="flex items-center gap-2 text-sm text-red-400/70 hover:text-red-400 transition"
                >
                    <LogOut className="w-4 h-4" />
                    Sign out of account
                </button>
            </div>
        </div>
    )
}
