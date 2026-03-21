import { useState, useEffect, useCallback } from 'react'
import {
    ArrowLeft, Eye, Wallet, Shield, Loader2, Plus, Minus, X,
    Ban, CheckCircle, Mail, Bell, ExternalLink, UserCheck,
    ArrowUpRight, ArrowDownLeft, Clock, Copy, KeyRound,
    History, Globe, Monitor, Smartphone, Crown, ChevronLeft, ChevronRight
} from 'lucide-react'
import { useParams, useNavigate } from 'react-router-dom'
import { useAdminAuth } from '../../context/AdminAuthContext'
import { ServiceIconWithFallback } from '../../components/ServiceIcon'
import adminApi from '../../lib/adminAxios'
import Background from '../../components/Background'
import toast from 'react-hot-toast'

// ─── Reusable Bits ──────────────────────────────────────────
const StatusBadge = ({ suspended }) => (
    <span className={`text-[10px] px-2.5 py-1 rounded-full font-bold ${suspended ? 'bg-red-500/15 text-red-400 border border-red-500/20' : 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/20'}`}>
        {suspended ? 'Suspended' : 'Active'}
    </span>
)

const ResellerBadge = () => (
    <span className="text-[10px] px-2.5 py-1 rounded-full font-bold bg-purple-500/15 text-purple-400 border border-purple-500/20">
        Reseller
    </span>
)

const Tab = ({ active, label, icon: Icon, onClick }) => (
    <button onClick={onClick}
        className={`flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-sm font-medium transition whitespace-nowrap border ${active ? 'bg-[rgba(255,149,0,0.12)] border-[rgba(255,149,0,0.3)] text-[#FF9500]' : 'text-white/40 hover:text-white/60 hover:bg-white/5 border-transparent'}`}>
        {Icon && <Icon className="w-4 h-4" />}
        {label}
    </button>
)

const Card = ({ children, className = '' }) => (
    <div className={`rounded-2xl border border-[rgba(255,255,255,0.06)] bg-[rgba(15,20,60,0.5)] backdrop-blur-xl ${className}`}>
        {children}
    </div>
)

// ─── Main Page ──────────────────────────────────────────
export default function ViewUserPage() {
    const { id } = useParams()
    const navigate = useNavigate()
    const { admin, isLoading: authLoading } = useAdminAuth()

    const [user, setUser] = useState(null)
    const [loading, setLoading] = useState(true)
    const [activeTab, setActiveTab] = useState('overview')

    // Wallet
    const [walletAction, setWalletAction] = useState(null)
    const [walletAmount, setWalletAmount] = useState('')
    const [walletNote, setWalletNote] = useState('')
    const [walletLoading, setWalletLoading] = useState(false)

    // Suspend
    const [suspendReason, setSuspendReason] = useState('')
    const [suspendLoading, setSuspendLoading] = useState(false)

    // Notification
    const [notifTitle, setNotifTitle] = useState('')
    const [notifMessage, setNotifMessage] = useState('')
    const [notifType, setNotifType] = useState('info')
    const [notifLoading, setNotifLoading] = useState(false)

    // Email
    const [emailSubject, setEmailSubject] = useState('')
    const [emailBody, setEmailBody] = useState('')
    const [emailLoading, setEmailLoading] = useState(false)

    // Login-as
    const [loginAsLoading, setLoginAsLoading] = useState(false)

    // Reset password
    const [resetLoading, setResetLoading] = useState(false)

    // Toggle reseller
    const [resellerLoading, setResellerLoading] = useState(false)

    // Login History
    const [loginHistory, setLoginHistory] = useState([])
    const [loginHistoryMeta, setLoginHistoryMeta] = useState({})
    const [loginHistoryPage, setLoginHistoryPage] = useState(1)
    const [loginHistoryLoading, setLoginHistoryLoading] = useState(false)

    // IP Logs
    const [ipLogs, setIpLogs] = useState(null)
    const [ipLogsLoading, setIpLogsLoading] = useState(false)

    // Activation History
    const [activations, setActivations] = useState([])
    const [activationsMeta, setActivationsMeta] = useState({})
    const [activationsPage, setActivationsPage] = useState(1)
    const [activationsLoading, setActivationsLoading] = useState(false)

    const loadUser = useCallback(async () => {
        setLoading(true)
        try {
            const r = await adminApi.get(`/api/admin/users/${id}`)
            setUser(r.data)
        } catch { toast.error('Failed to load user'); navigate('/admin/users') }
        finally { setLoading(false) }
    }, [id])

    const loadLoginHistory = useCallback(async () => {
        setLoginHistoryLoading(true)
        try {
            const r = await adminApi.get(`/api/admin/users/${id}/login-history`, { params: { page: loginHistoryPage, per_page: 15 } })
            setLoginHistory(r.data.data)
            setLoginHistoryMeta(r.data)
        } catch { }
        finally { setLoginHistoryLoading(false) }
    }, [id, loginHistoryPage])

    const loadIpLogs = useCallback(async () => {
        setIpLogsLoading(true)
        try {
            const r = await adminApi.get(`/api/admin/users/${id}/ip-logs`)
            setIpLogs(r.data)
        } catch { }
        finally { setIpLogsLoading(false) }
    }, [id])

    const loadActivations = useCallback(async () => {
        setActivationsLoading(true)
        try {
            const r = await adminApi.get(`/api/admin/users/${id}/activation-history`, { params: { page: activationsPage, per_page: 15 } })
            setActivations(r.data.data)
            setActivationsMeta(r.data)
        } catch { }
        finally { setActivationsLoading(false) }
    }, [id, activationsPage])

    useEffect(() => {
        if (!authLoading && !admin) navigate('/admin/login')
    }, [admin, authLoading])

    useEffect(() => { if (admin) loadUser() }, [loadUser, admin])

    // Lazy-load tab data
    useEffect(() => {
        if (!admin || !user) return
        if (activeTab === 'login-history') loadLoginHistory()
        if (activeTab === 'ip-logs') loadIpLogs()
        if (activeTab === 'activations') loadActivations()
    }, [activeTab, admin, user, loadLoginHistory, loadIpLogs, loadActivations])

    // ─── Handlers ──────────────────────────────────────────
    const handleWallet = async (action) => {
        if (!walletAmount || Number(walletAmount) <= 0) return toast.error('Enter a valid amount')
        setWalletLoading(true)
        try {
            const r = await adminApi.post(`/api/admin/users/${id}/${action}`, { amount: walletAmount, note: walletNote })
            toast.success(r.data.message)
            setWalletAmount(''); setWalletNote(''); setWalletAction(null)
            loadUser()
        } catch (e) { toast.error(e.response?.data?.message || 'Failed') }
        finally { setWalletLoading(false) }
    }

    const handleSuspend = async () => {
        setSuspendLoading(true)
        try {
            const r = await adminApi.post(`/api/admin/users/${id}/suspend`, { reason: suspendReason })
            toast.success(r.data.message); setSuspendReason(''); loadUser()
        } catch (e) { toast.error(e.response?.data?.message || 'Failed') }
        finally { setSuspendLoading(false) }
    }

    const handleResetPassword = async () => {
        setResetLoading(true)
        try {
            const r = await adminApi.post(`/api/admin/users/${id}/reset-password`)
            toast.success(r.data.message)
            if (r.data.new_password) {
                toast(`New password: ${r.data.new_password}`, { duration: 15000, icon: '🔑' })
            }
        } catch (e) { toast.error(e.response?.data?.message || 'Failed') }
        finally { setResetLoading(false) }
    }

    const handleToggleReseller = async () => {
        setResellerLoading(true)
        try {
            const r = await adminApi.post(`/api/admin/users/${id}/toggle-reseller`)
            toast.success(r.data.message); loadUser()
        } catch (e) { toast.error(e.response?.data?.message || 'Failed') }
        finally { setResellerLoading(false) }
    }

    const handleNotify = async () => {
        if (!notifTitle || !notifMessage) return toast.error('Fill in title and message')
        setNotifLoading(true)
        try {
            const r = await adminApi.post(`/api/admin/users/${id}/notify`, { title: notifTitle, message: notifMessage, type: notifType })
            toast.success(r.data.message); setNotifTitle(''); setNotifMessage('')
        } catch (e) { toast.error(e.response?.data?.message || 'Failed') }
        finally { setNotifLoading(false) }
    }

    const handleEmail = async () => {
        if (!emailSubject || !emailBody) return toast.error('Fill in subject and body')
        setEmailLoading(true)
        try {
            const r = await adminApi.post(`/api/admin/users/${id}/email`, { subject: emailSubject, body: emailBody })
            toast.success(r.data.message); setEmailSubject(''); setEmailBody('')
        } catch (e) { toast.error(e.response?.data?.message || 'Failed') }
        finally { setEmailLoading(false) }
    }

    const handleLoginAs = async () => {
        setLoginAsLoading(true)
        try {
            const r = await adminApi.post(`/api/admin/users/${id}/login-as`)
            navigator.clipboard.writeText(r.data.token)
            toast.success('Token copied! Opening user dashboard...')
            const url = `${window.location.origin}/user/dashboard?impersonate=${encodeURIComponent(r.data.token)}`
            window.open(url, '_blank')
        } catch (e) { toast.error(e.response?.data?.message || 'Failed') }
        finally { setLoginAsLoading(false) }
    }

    // ─── Loading State ──────────────────────────────────────
    if (authLoading || loading) {
        return (
            <Background>
                <div className="min-h-screen flex items-center justify-center">
                    <Loader2 className="w-8 h-8 text-[#FF9500] animate-spin" />
                </div>
            </Background>
        )
    }

    if (!user) return null

    const balance = Number(user.wallet?.balance ?? 0)

    return (
        <Background>
            <div className="min-h-screen">
                {/* ─── Top Bar ─── */}
                <header className="flex items-center gap-3 px-4 sm:px-8 py-4 border-b border-[rgba(255,149,0,0.08)] bg-[rgba(8,10,46,0.6)] backdrop-blur-xl sticky top-0 z-50">
                    <button onClick={() => navigate('/admin/users')}
                        className="p-2 rounded-xl hover:bg-white/10 text-white/50 transition">
                        <ArrowLeft className="w-5 h-5" />
                    </button>
                    <div className="flex items-center gap-3 min-w-0 flex-1">
                        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#FF9500] to-[#FF6B00] flex items-center justify-center text-white font-bold flex-shrink-0">
                            {user.name?.[0]?.toUpperCase() || 'U'}
                        </div>
                        <div className="min-w-0">
                            <div className="flex items-center gap-2 flex-wrap">
                                <h1 className="text-lg font-bold text-white truncate">{user.name}</h1>
                                <StatusBadge suspended={user.is_suspended} />
                                {user.is_reseller && <ResellerBadge />}
                            </div>
                            <p className="text-xs text-white/30 truncate">{user.email}</p>
                        </div>
                    </div>
                    <button onClick={handleLoginAs} disabled={loginAsLoading || user.is_suspended}
                        className="hidden sm:flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-[#FF9500] to-[#FF6B00] text-white text-sm font-bold hover:shadow-[0_0_20px_rgba(255,149,0,0.3)] transition disabled:opacity-40">
                        {loginAsLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <ExternalLink className="w-4 h-4" />}
                        Login as User
                    </button>
                </header>

                {/* ─── Tab Bar ─── */}
                <div className="flex gap-2 px-4 sm:px-8 py-3 border-b border-white/5 overflow-x-auto no-scrollbar bg-[rgba(8,10,46,0.3)]">
                    <Tab active={activeTab === 'overview'} label="Overview" icon={Eye} onClick={() => setActiveTab('overview')} />
                    <Tab active={activeTab === 'wallet'} label="Wallet" icon={Wallet} onClick={() => setActiveTab('wallet')} />
                    <Tab active={activeTab === 'activations'} label="Activations" icon={Clock} onClick={() => setActiveTab('activations')} />
                    <Tab active={activeTab === 'login-history'} label="Login History" icon={History} onClick={() => setActiveTab('login-history')} />
                    <Tab active={activeTab === 'ip-logs'} label="IP Logs" icon={Globe} onClick={() => setActiveTab('ip-logs')} />
                    <Tab active={activeTab === 'actions'} label="Actions" icon={Shield} onClick={() => setActiveTab('actions')} />
                </div>

                {/* ─── Content ─── */}
                <main className="px-4 sm:px-8 py-6 max-w-5xl mx-auto">

                    {/* ══════ Overview ══════ */}
                    {activeTab === 'overview' && (
                        <div className="space-y-6">
                            {/* Stat Cards Row */}
                            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                                {[
                                    { label: 'Wallet', value: `₦${balance.toLocaleString()}`, color: '#FF9500' },
                                    { label: 'Orders', value: user.orders_count ?? 0, color: '#0099FF' },
                                    { label: 'Referrals', value: user.referrals_count ?? 0, color: '#34C759' },
                                    { label: 'Tickets', value: user.support_tickets_count ?? 0, color: '#FF3B30' },
                                ].map(s => (
                                    <Card key={s.label} className="p-4">
                                        <p className="text-[10px] text-white/30 uppercase tracking-wider mb-1">{s.label}</p>
                                        <p className="text-xl font-bold" style={{ color: s.color }}>{s.value}</p>
                                    </Card>
                                ))}
                            </div>

                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                                {/* Details Card */}
                                <Card className="p-5">
                                    <p className="text-[10px] text-white/30 uppercase tracking-wider mb-3">User Details</p>
                                    <div className="space-y-3 text-sm">
                                        {[
                                            ['Name', user.name],
                                            ['Email', user.email],
                                            ['Phone', user.phone || '—'],
                                            ['Joined', new Date(user.created_at).toLocaleDateString()],
                                            ['Referral Code', user.referral_code || '—'],
                                            ['Referred By', user.referred_by_user?.name || '—'],
                                            ['Last Active', user.last_active_at ? new Date(user.last_active_at).toLocaleString() : '—'],
                                            ['Reseller', user.is_reseller ? 'Yes' : 'No'],
                                        ].map(([label, val]) => (
                                            <div key={label} className="flex justify-between py-1.5 border-b border-white/5 last:border-0">
                                                <span className="text-white/40">{label}</span>
                                                <span className="text-white font-medium text-right">{val}</span>
                                            </div>
                                        ))}
                                    </div>
                                </Card>

                                {/* Recent Transactions */}
                                <Card className="p-5">
                                    <p className="text-[10px] text-white/30 uppercase tracking-wider mb-3">Recent Transactions</p>
                                    <div className="space-y-2 max-h-[280px] overflow-y-auto">
                                        {(user.transactions ?? []).length === 0 && <p className="text-xs text-white/20">No transactions</p>}
                                        {(user.transactions ?? []).map(t => (
                                            <div key={t.id} className="flex items-center justify-between py-2.5 border-b border-white/5 last:border-0">
                                                <div className="flex items-center gap-2.5 min-w-0">
                                                    <div className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 ${t.type === 'credit' ? 'bg-emerald-500/10' : 'bg-red-500/10'}`}>
                                                        {t.type === 'credit' ? <ArrowDownLeft className="w-4 h-4 text-emerald-400" /> : <ArrowUpRight className="w-4 h-4 text-red-400" />}
                                                    </div>
                                                    <div className="min-w-0">
                                                        <p className="text-sm text-white/60 truncate">{t.description}</p>
                                                        <p className="text-[10px] text-white/20">{new Date(t.created_at).toLocaleString()}</p>
                                                    </div>
                                                </div>
                                                <span className={`text-sm font-bold flex-shrink-0 ml-3 ${t.type === 'credit' ? 'text-emerald-400' : 'text-red-400'}`}>
                                                    {t.type === 'credit' ? '+' : '-'}₦{Number(t.amount).toLocaleString()}
                                                </span>
                                            </div>
                                        ))}
                                    </div>
                                </Card>
                            </div>

                            {/* Referrals */}
                            {user.referrals && user.referrals.length > 0 && (
                                <Card className="p-5">
                                    <p className="text-[10px] text-white/30 uppercase tracking-wider mb-3">Referrals Made ({user.referrals.length})</p>
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                        {user.referrals.map(r => (
                                            <div key={r.id} className="flex items-center gap-3 p-3 rounded-xl bg-white/[0.03] border border-white/5">
                                                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 to-blue-600 flex-shrink-0 flex items-center justify-center text-xs font-bold text-white">
                                                    {r.referred?.name?.[0]?.toUpperCase() || '?'}
                                                </div>
                                                <div className="min-w-0">
                                                    <p className="text-sm text-white truncate">{r.referred?.name || '—'}</p>
                                                    <p className="text-[10px] text-white/25 truncate">{r.referred?.email}</p>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </Card>
                            )}
                        </div>
                    )}

                    {/* ══════ Wallet ══════ */}
                    {activeTab === 'wallet' && (
                        <div className="space-y-6">
                            <Card className="p-6 text-center">
                                <p className="text-xs text-white/40 mb-1">Current Balance</p>
                                <p className="text-4xl font-bold text-[#FF9500]">₦{balance.toLocaleString()}</p>
                            </Card>

                            {!walletAction ? (
                                <div className="grid grid-cols-2 gap-4">
                                    <button onClick={() => setWalletAction('credit')}
                                        className="flex items-center justify-center gap-2.5 py-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-sm font-semibold hover:bg-emerald-500/20 transition">
                                        <Plus className="w-5 h-5" /> Credit Wallet
                                    </button>
                                    <button onClick={() => setWalletAction('debit')}
                                        className="flex items-center justify-center gap-2.5 py-4 rounded-2xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm font-semibold hover:bg-red-500/20 transition">
                                        <Minus className="w-5 h-5" /> Deduct Balance
                                    </button>
                                </div>
                            ) : (
                                <Card className="p-5 space-y-4">
                                    <div className="flex items-center justify-between">
                                        <h4 className="text-sm font-bold text-white">{walletAction === 'credit' ? 'Credit Wallet' : 'Deduct Balance'}</h4>
                                        <button onClick={() => setWalletAction(null)} className="text-white/30 hover:text-white/60"><X className="w-4 h-4" /></button>
                                    </div>
                                    <input type="number" placeholder="Amount (₦)" min="1" value={walletAmount} onChange={e => setWalletAmount(e.target.value)}
                                        className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-sm text-white placeholder-white/25 focus:outline-none focus:border-[rgba(255,149,0,0.4)]" />
                                    <input placeholder="Note (optional)" value={walletNote} onChange={e => setWalletNote(e.target.value)}
                                        className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-sm text-white placeholder-white/25 focus:outline-none focus:border-[rgba(255,149,0,0.4)]" />
                                    <button onClick={() => handleWallet(walletAction)} disabled={walletLoading}
                                        className={`w-full py-3 rounded-xl text-sm font-bold flex items-center justify-center gap-2 transition disabled:opacity-40 ${walletAction === 'credit' ? 'bg-emerald-500/20 text-emerald-400 hover:bg-emerald-500/30' : 'bg-red-500/20 text-red-400 hover:bg-red-500/30'}`}>
                                        {walletLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : walletAction === 'credit' ? <Plus className="w-4 h-4" /> : <Minus className="w-4 h-4" />}
                                        {walletAction === 'credit' ? 'Credit' : 'Deduct'}
                                    </button>
                                </Card>
                            )}

                            <Card className="p-5">
                                <p className="text-[10px] text-white/30 uppercase tracking-wider mb-4">Transaction History</p>
                                <div className="space-y-2">
                                    {(user.transactions ?? []).length === 0 && <p className="text-xs text-white/20">No transactions</p>}
                                    {(user.transactions ?? []).map(t => (
                                        <div key={t.id} className="flex items-center justify-between py-3 border-b border-white/5 last:border-0">
                                            <div className="flex items-center gap-3 min-w-0">
                                                <div className={`w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 ${t.type === 'credit' ? 'bg-emerald-500/10' : 'bg-red-500/10'}`}>
                                                    {t.type === 'credit' ? <ArrowDownLeft className="w-4 h-4 text-emerald-400" /> : <ArrowUpRight className="w-4 h-4 text-red-400" />}
                                                </div>
                                                <div className="min-w-0">
                                                    <p className="text-sm text-white/60 truncate">{t.description}</p>
                                                    <p className="text-xs text-white/20">{new Date(t.created_at).toLocaleString()}</p>
                                                </div>
                                            </div>
                                            <span className={`text-sm font-bold flex-shrink-0 ml-3 ${t.type === 'credit' ? 'text-emerald-400' : 'text-red-400'}`}>
                                                {t.type === 'credit' ? '+' : '-'}₦{Number(t.amount).toLocaleString()}
                                            </span>
                                        </div>
                                    ))}
                                </div>
                            </Card>
                        </div>
                    )}

                    {/* ══════ Activation History ══════ */}
                    {activeTab === 'activations' && (
                        <div className="space-y-4">
                            <Card className="overflow-hidden">
                                {activationsLoading ? (
                                    <div className="p-12 text-center"><Loader2 className="w-6 h-6 text-[#FF9500] animate-spin mx-auto" /></div>
                                ) : activations.length === 0 ? (
                                    <div className="p-12 text-center text-white/30 text-sm">No activations found</div>
                                ) : (
                                    <>
                                        <div className="divide-y divide-white/5">
                                            {activations.map(order => (
                                                <div key={order.id} className="p-4 hover:bg-white/[0.02] transition">
                                                    <div className="flex items-center justify-between">
                                                        <div className="flex items-center gap-3 min-w-0">
                                                            <ServiceIconWithFallback icon={order.service?.icon} name={order.service?.name} color={order.service?.color} size="md" />
                                                            <div className="min-w-0">
                                                                <p className="text-sm text-white font-medium truncate">{order.service?.name || 'N/A'}</p>
                                                                <p className="text-xs text-white/30">{order.country?.flag} {order.country?.name} · <span className="font-mono">{order.phone_number || '—'}</span></p>
                                                            </div>
                                                        </div>
                                                        <div className="text-right flex-shrink-0 ml-3">
                                                            <span className={`text-[10px] px-2.5 py-1 rounded-lg font-medium ${order.status === 'completed' ? 'bg-green-500/10 text-green-400' : order.status === 'pending' ? 'bg-yellow-500/10 text-yellow-400' : order.status === 'active' ? 'bg-blue-500/10 text-blue-400' : 'bg-red-500/10 text-red-400'}`}>
                                                                {order.status}
                                                            </span>
                                                            <p className="text-[10px] text-white/20 mt-1">{new Date(order.created_at).toLocaleString()}</p>
                                                        </div>
                                                    </div>
                                                    {order.sms_code && (
                                                        <div className="mt-2 ml-12 px-3 py-2 rounded-lg bg-emerald-500/5 border border-emerald-500/10">
                                                            <p className="text-xs text-emerald-400 font-mono">SMS: {order.sms_code}</p>
                                                        </div>
                                                    )}
                                                </div>
                                            ))}
                                        </div>
                                        {/* Pagination */}
                                        {activationsMeta.last_page > 1 && (
                                            <div className="flex items-center justify-between px-5 py-3 border-t border-white/5">
                                                <span className="text-xs text-white/30">Page {activationsMeta.current_page} of {activationsMeta.last_page} · {activationsMeta.total} activations</span>
                                                <div className="flex gap-1.5">
                                                    <button disabled={activationsPage <= 1} onClick={() => setActivationsPage(p => p - 1)}
                                                        className="p-2 rounded-lg hover:bg-white/[0.06] text-white/30 disabled:opacity-20 transition">
                                                        <ChevronLeft className="w-4 h-4" />
                                                    </button>
                                                    <button disabled={activationsPage >= activationsMeta.last_page} onClick={() => setActivationsPage(p => p + 1)}
                                                        className="p-2 rounded-lg hover:bg-white/[0.06] text-white/30 disabled:opacity-20 transition">
                                                        <ChevronRight className="w-4 h-4" />
                                                    </button>
                                                </div>
                                            </div>
                                        )}
                                    </>
                                )}
                            </Card>
                        </div>
                    )}

                    {/* ══════ Login History ══════ */}
                    {activeTab === 'login-history' && (
                        <div className="space-y-4">
                            <Card className="overflow-hidden">
                                {loginHistoryLoading ? (
                                    <div className="p-12 text-center"><Loader2 className="w-6 h-6 text-[#FF9500] animate-spin mx-auto" /></div>
                                ) : loginHistory.length === 0 ? (
                                    <div className="p-12 text-center text-white/30 text-sm">No login history found</div>
                                ) : (
                                    <>
                                        {/* Desktop */}
                                        <div className="hidden md:block overflow-x-auto">
                                            <table className="w-full text-left">
                                                <thead>
                                                    <tr className="border-b border-white/5">
                                                        <th className="px-5 py-3.5 text-xs text-white/30 font-medium">Date</th>
                                                        <th className="px-5 py-3.5 text-xs text-white/30 font-medium">IP Address</th>
                                                        <th className="px-5 py-3.5 text-xs text-white/30 font-medium">Device</th>
                                                        <th className="px-5 py-3.5 text-xs text-white/30 font-medium">Browser</th>
                                                        <th className="px-5 py-3.5 text-xs text-white/30 font-medium">Platform</th>
                                                        <th className="px-5 py-3.5 text-xs text-white/30 font-medium">Status</th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {loginHistory.map(entry => (
                                                        <tr key={entry.id} className="border-b border-white/[0.03] hover:bg-white/[0.02] transition">
                                                            <td className="px-5 py-3.5 text-xs text-white/50">{new Date(entry.created_at).toLocaleString()}</td>
                                                            <td className="px-5 py-3.5 text-sm text-white/60 font-mono">{entry.ip_address}</td>
                                                            <td className="px-5 py-3.5">
                                                                <div className="flex items-center gap-1.5">
                                                                    {entry.device === 'Mobile' ? <Smartphone className="w-3.5 h-3.5 text-blue-400" /> : <Monitor className="w-3.5 h-3.5 text-white/40" />}
                                                                    <span className="text-sm text-white/50">{entry.device || '—'}</span>
                                                                </div>
                                                            </td>
                                                            <td className="px-5 py-3.5 text-sm text-white/50">{entry.browser || '—'}</td>
                                                            <td className="px-5 py-3.5 text-sm text-white/50">{entry.platform || '—'}</td>
                                                            <td className="px-5 py-3.5">
                                                                <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold ${entry.status === 'success' ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/20' : 'bg-red-500/15 text-red-400 border border-red-500/20'}`}>
                                                                    {entry.status}
                                                                </span>
                                                            </td>
                                                        </tr>
                                                    ))}
                                                </tbody>
                                            </table>
                                        </div>

                                        {/* Mobile */}
                                        <div className="md:hidden divide-y divide-white/5">
                                            {loginHistory.map(entry => (
                                                <div key={entry.id} className="p-4 space-y-2">
                                                    <div className="flex items-center justify-between">
                                                        <span className="text-xs text-white/40">{new Date(entry.created_at).toLocaleString()}</span>
                                                        <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold ${entry.status === 'success' ? 'bg-emerald-500/15 text-emerald-400' : 'bg-red-500/15 text-red-400'}`}>
                                                            {entry.status}
                                                        </span>
                                                    </div>
                                                    <div className="flex items-center gap-4 text-xs text-white/50">
                                                        <span className="font-mono">{entry.ip_address}</span>
                                                        <span>{entry.device}</span>
                                                        <span>{entry.browser}</span>
                                                        <span>{entry.platform}</span>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>

                                        {/* Pagination */}
                                        {loginHistoryMeta.last_page > 1 && (
                                            <div className="flex items-center justify-between px-5 py-3 border-t border-white/5">
                                                <span className="text-xs text-white/30">Page {loginHistoryMeta.current_page} of {loginHistoryMeta.last_page} · {loginHistoryMeta.total} entries</span>
                                                <div className="flex gap-1.5">
                                                    <button disabled={loginHistoryPage <= 1} onClick={() => setLoginHistoryPage(p => p - 1)}
                                                        className="p-2 rounded-lg hover:bg-white/[0.06] text-white/30 disabled:opacity-20 transition">
                                                        <ChevronLeft className="w-4 h-4" />
                                                    </button>
                                                    <button disabled={loginHistoryPage >= loginHistoryMeta.last_page} onClick={() => setLoginHistoryPage(p => p + 1)}
                                                        className="p-2 rounded-lg hover:bg-white/[0.06] text-white/30 disabled:opacity-20 transition">
                                                        <ChevronRight className="w-4 h-4" />
                                                    </button>
                                                </div>
                                            </div>
                                        )}
                                    </>
                                )}
                            </Card>
                        </div>
                    )}

                    {/* ══════ IP Logs ══════ */}
                    {activeTab === 'ip-logs' && (
                        <div className="space-y-4">
                            {ipLogsLoading ? (
                                <div className="p-12 text-center"><Loader2 className="w-6 h-6 text-[#FF9500] animate-spin mx-auto" /></div>
                            ) : !ipLogs || ipLogs.ips.length === 0 ? (
                                <Card className="p-12 text-center text-white/30 text-sm">No IP logs found</Card>
                            ) : (
                                <>
                                    <Card className="p-4">
                                        <p className="text-xs text-white/30 mb-1">Total Unique IPs</p>
                                        <p className="text-2xl font-bold text-[#FF9500]">{ipLogs.total_ips}</p>
                                    </Card>

                                    <Card className="overflow-hidden">
                                        {/* Desktop */}
                                        <div className="hidden md:block overflow-x-auto">
                                            <table className="w-full text-left">
                                                <thead>
                                                    <tr className="border-b border-white/5">
                                                        <th className="px-5 py-3.5 text-xs text-white/30 font-medium">IP Address</th>
                                                        <th className="px-5 py-3.5 text-xs text-white/30 font-medium">Location</th>
                                                        <th className="px-5 py-3.5 text-xs text-white/30 font-medium">Device</th>
                                                        <th className="px-5 py-3.5 text-xs text-white/30 font-medium">Browser</th>
                                                        <th className="px-5 py-3.5 text-xs text-white/30 font-medium">Platform</th>
                                                        <th className="px-5 py-3.5 text-xs text-white/30 font-medium">Logins</th>
                                                        <th className="px-5 py-3.5 text-xs text-white/30 font-medium">Last Seen</th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {ipLogs.ips.map((ip, i) => (
                                                        <tr key={i} className="border-b border-white/[0.03] hover:bg-white/[0.02] transition">
                                                            <td className="px-5 py-3.5 text-sm text-white/60 font-mono">{ip.ip_address}</td>
                                                            <td className="px-5 py-3.5 text-sm text-white/40">{ip.location || '—'}</td>
                                                            <td className="px-5 py-3.5">
                                                                <div className="flex items-center gap-1.5">
                                                                    {ip.device === 'Mobile' ? <Smartphone className="w-3.5 h-3.5 text-blue-400" /> : <Monitor className="w-3.5 h-3.5 text-white/40" />}
                                                                    <span className="text-sm text-white/50">{ip.device || '—'}</span>
                                                                </div>
                                                            </td>
                                                            <td className="px-5 py-3.5 text-sm text-white/50">{ip.browser || '—'}</td>
                                                            <td className="px-5 py-3.5 text-sm text-white/50">{ip.platform || '—'}</td>
                                                            <td className="px-5 py-3.5">
                                                                <span className="text-sm font-bold text-[#FF9500]">{ip.login_count}</span>
                                                            </td>
                                                            <td className="px-5 py-3.5 text-xs text-white/30">{ip.last_seen ? new Date(ip.last_seen).toLocaleString() : '—'}</td>
                                                        </tr>
                                                    ))}
                                                </tbody>
                                            </table>
                                        </div>

                                        {/* Mobile */}
                                        <div className="md:hidden divide-y divide-white/5">
                                            {ipLogs.ips.map((ip, i) => (
                                                <div key={i} className="p-4 space-y-2">
                                                    <div className="flex items-center justify-between">
                                                        <span className="text-sm text-white/60 font-mono">{ip.ip_address}</span>
                                                        <span className="text-sm font-bold text-[#FF9500]">{ip.login_count} logins</span>
                                                    </div>
                                                    <div className="flex items-center gap-3 text-xs text-white/40">
                                                        <span>{ip.device}</span>
                                                        <span>{ip.browser}</span>
                                                        <span>{ip.platform}</span>
                                                    </div>
                                                    <p className="text-[10px] text-white/25">Last: {ip.last_seen ? new Date(ip.last_seen).toLocaleString() : '—'}</p>
                                                </div>
                                            ))}
                                        </div>
                                    </Card>
                                </>
                            )}
                        </div>
                    )}

                    {/* ══════ Actions ══════ */}
                    {activeTab === 'actions' && (
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                            {/* Left Column */}
                            <div className="space-y-6">
                                {/* Suspend */}
                                <Card className={`p-5 space-y-4 ${user.is_suspended ? '!border-emerald-500/15' : '!border-red-500/15'}`}>
                                    <div className="flex items-center gap-2">
                                        {user.is_suspended ? <UserCheck className="w-5 h-5 text-emerald-400" /> : <Ban className="w-5 h-5 text-red-400" />}
                                        <h4 className="text-sm font-bold text-white">{user.is_suspended ? 'Unsuspend User' : 'Suspend User'}</h4>
                                    </div>
                                    {user.is_suspended && user.suspended_reason && (
                                        <p className="text-xs text-white/40 bg-white/[0.03] p-3 rounded-lg">Reason: <span className="text-white/60">{user.suspended_reason}</span></p>
                                    )}
                                    {!user.is_suspended && (
                                        <input placeholder="Reason for suspension..." value={suspendReason} onChange={e => setSuspendReason(e.target.value)}
                                            className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-sm text-white placeholder-white/25 focus:outline-none" />
                                    )}
                                    <button onClick={handleSuspend} disabled={suspendLoading}
                                        className={`w-full py-3 rounded-xl text-sm font-bold flex items-center justify-center gap-2 transition disabled:opacity-40 ${user.is_suspended ? 'bg-emerald-500/20 text-emerald-400 hover:bg-emerald-500/30' : 'bg-red-500/20 text-red-400 hover:bg-red-500/30'}`}>
                                        {suspendLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : user.is_suspended ? <UserCheck className="w-4 h-4" /> : <Ban className="w-4 h-4" />}
                                        {user.is_suspended ? 'Unsuspend' : 'Suspend'}
                                    </button>
                                </Card>

                                {/* Reset Password */}
                                <Card className="p-5 space-y-4 !border-yellow-500/15">
                                    <div className="flex items-center gap-2">
                                        <KeyRound className="w-5 h-5 text-yellow-400" />
                                        <h4 className="text-sm font-bold text-white">Reset Password</h4>
                                    </div>
                                    <p className="text-xs text-white/30">Generate a new random password and force re-login.</p>
                                    <button onClick={handleResetPassword} disabled={resetLoading}
                                        className="w-full py-3 rounded-xl bg-yellow-500/15 text-yellow-400 text-sm font-bold flex items-center justify-center gap-2 hover:bg-yellow-500/25 transition disabled:opacity-40">
                                        {resetLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <KeyRound className="w-4 h-4" />}
                                        Reset Password
                                    </button>
                                </Card>

                                {/* Toggle Reseller */}
                                <Card className="p-5 space-y-4 !border-purple-500/15">
                                    <div className="flex items-center gap-2">
                                        <Crown className="w-5 h-5 text-purple-400" />
                                        <h4 className="text-sm font-bold text-white">Reseller Status</h4>
                                    </div>
                                    <p className="text-xs text-white/30">
                                        Current status: <span className={user.is_reseller ? 'text-purple-400 font-bold' : 'text-white/50'}>{user.is_reseller ? 'Reseller' : 'Regular User'}</span>
                                    </p>
                                    <button onClick={handleToggleReseller} disabled={resellerLoading}
                                        className={`w-full py-3 rounded-xl text-sm font-bold flex items-center justify-center gap-2 transition disabled:opacity-40 ${user.is_reseller ? 'bg-red-500/15 text-red-400 hover:bg-red-500/25' : 'bg-purple-500/15 text-purple-400 hover:bg-purple-500/25'}`}>
                                        {resellerLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Crown className="w-4 h-4" />}
                                        {user.is_reseller ? 'Remove Reseller Status' : 'Make Reseller'}
                                    </button>
                                </Card>

                                {/* Login as User (mobile) */}
                                <button onClick={handleLoginAs} disabled={loginAsLoading || user.is_suspended}
                                    className="w-full sm:hidden py-3.5 rounded-xl bg-gradient-to-r from-[#FF9500] to-[#FF6B00] text-white text-sm font-bold flex items-center justify-center gap-2 hover:shadow-[0_0_20px_rgba(255,149,0,0.3)] transition disabled:opacity-40">
                                    {loginAsLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <ExternalLink className="w-4 h-4" />}
                                    Login as {user.name}
                                </button>
                            </div>

                            {/* Right Column */}
                            <div className="space-y-6">
                                {/* Notification */}
                                <Card className="p-5 space-y-4 !border-[rgba(255,149,0,0.12)]">
                                    <div className="flex items-center gap-2">
                                        <Bell className="w-5 h-5 text-[#FF9500]" />
                                        <h4 className="text-sm font-bold text-white">Send Notification</h4>
                                    </div>
                                    <input placeholder="Title" value={notifTitle} onChange={e => setNotifTitle(e.target.value)}
                                        className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-sm text-white placeholder-white/25 focus:outline-none focus:border-[rgba(255,149,0,0.4)]" />
                                    <textarea placeholder="Message..." rows={3} value={notifMessage} onChange={e => setNotifMessage(e.target.value)}
                                        className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-sm text-white placeholder-white/25 focus:outline-none focus:border-[rgba(255,149,0,0.4)] resize-none" />
                                    <div className="flex gap-2">
                                        {['info', 'warning', 'promo'].map(t => (
                                            <button key={t} onClick={() => setNotifType(t)}
                                                className={`px-3 py-2 rounded-lg text-xs font-bold transition ${notifType === t ? 'bg-[rgba(255,149,0,0.15)] text-[#FF9500] border border-[rgba(255,149,0,0.3)]' : 'bg-white/5 text-white/30 border border-white/5'}`}>
                                                {t.charAt(0).toUpperCase() + t.slice(1)}
                                            </button>
                                        ))}
                                    </div>
                                    <button onClick={handleNotify} disabled={notifLoading}
                                        className="w-full py-3 rounded-xl bg-[rgba(255,149,0,0.15)] text-[#FF9500] text-sm font-bold flex items-center justify-center gap-2 hover:bg-[rgba(255,149,0,0.25)] transition disabled:opacity-40">
                                        {notifLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Bell className="w-4 h-4" />} Send
                                    </button>
                                </Card>

                                {/* Email */}
                                <Card className="p-5 space-y-4 !border-blue-500/12">
                                    <div className="flex items-center gap-2">
                                        <Mail className="w-5 h-5 text-blue-400" />
                                        <h4 className="text-sm font-bold text-white">Send Email</h4>
                                    </div>
                                    <input placeholder="Subject" value={emailSubject} onChange={e => setEmailSubject(e.target.value)}
                                        className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-sm text-white placeholder-white/25 focus:outline-none focus:border-blue-500/40" />
                                    <textarea placeholder="Email body..." rows={3} value={emailBody} onChange={e => setEmailBody(e.target.value)}
                                        className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-sm text-white placeholder-white/25 focus:outline-none focus:border-blue-500/40 resize-none" />
                                    <button onClick={handleEmail} disabled={emailLoading}
                                        className="w-full py-3 rounded-xl bg-blue-500/15 text-blue-400 text-sm font-bold flex items-center justify-center gap-2 hover:bg-blue-500/25 transition disabled:opacity-40">
                                        {emailLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Mail className="w-4 h-4" />} Send Email
                                    </button>
                                </Card>
                            </div>
                        </div>
                    )}
                </main>
            </div>
        </Background>
    )
}
