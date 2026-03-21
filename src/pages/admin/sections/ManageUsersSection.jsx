import { useState, useEffect, useCallback } from 'react'
import {
    Search, ChevronLeft, ChevronRight, Users, Eye, Loader2,
    UserX, UserCheck, UserPlus, TrendingUp, ShieldAlert,
    KeyRound, Ban, DollarSign, Mail, Bell, LogIn, X, Copy,
    Code2, Crown
} from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import adminApi from '../../../lib/adminAxios'
import toast from 'react-hot-toast'

const FILTERS = [
    { key: 'all', label: 'All Users', icon: Users },
    { key: 'active', label: 'Active', icon: UserCheck },
    { key: 'suspended', label: 'Suspended', icon: UserX },
    { key: 'new', label: 'New (7d)', icon: UserPlus },
    { key: 'top', label: 'Top', icon: TrendingUp },
    { key: 'api', label: 'API Users', icon: Code2 },
    { key: 'reseller', label: 'Resellers', icon: Crown },
]

const StatusBadge = ({ suspended }) => (
    <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold ${suspended ? 'bg-red-500/15 text-red-400 border border-red-500/20' : 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/20'}`}>
        {suspended ? 'Suspended' : 'Active'}
    </span>
)

const ResellerBadge = () => (
    <span className="text-[10px] px-2 py-0.5 rounded-full font-bold bg-purple-500/15 text-purple-400 border border-purple-500/20">
        Reseller
    </span>
)

const ApiBadge = () => (
    <span className="text-[10px] px-2 py-0.5 rounded-full font-bold bg-cyan-500/15 text-cyan-400 border border-cyan-500/20">
        API
    </span>
)

const StatMini = ({ label, value, icon: Icon, color }) => (
    <div className="flex items-center gap-2.5 p-3 rounded-xl bg-white/[0.03] border border-white/5 flex-1 min-w-[100px]">
        <Icon className="w-4 h-4 flex-shrink-0" style={{ color }} />
        <div>
            <p className="text-base font-bold text-white leading-none">{value ?? 0}</p>
            <p className="text-[9px] text-white/35 mt-0.5 font-medium">{label}</p>
        </div>
    </div>
)

/* ── Quick Actions Modal ── */
const UserQuickActions = ({ user, onClose, onRefresh }) => {
    const [actionLoading, setActionLoading] = useState(null)
    const [creditAmount, setCreditAmount] = useState('')
    const [creditNote, setCreditNote] = useState('')
    const [suspendReason, setSuspendReason] = useState('')
    const [activeTab, setActiveTab] = useState('info')
    const navigate = useNavigate()

    const handleAction = async (action, body = {}) => {
        setActionLoading(action)
        try {
            const res = await adminApi.post(`/api/admin/users/${user.id}/${action}`, body)
            toast.success(res.data.message)
            if (res.data.new_password) {
                toast(`New password: ${res.data.new_password}`, { duration: 10000, icon: '🔑' })
            }
            onRefresh()
        } catch (err) {
            toast.error(err.response?.data?.message || 'Action failed')
        } finally {
            setActionLoading(null)
        }
    }

    const tabs = [
        { key: 'info', label: 'Info' },
        { key: 'wallet', label: 'Wallet' },
        { key: 'actions', label: 'Actions' },
    ]

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4" onClick={onClose}>
            <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />
            <div className="relative bg-[#0F1440] border border-white/10 rounded-2xl w-full max-w-md max-h-[85vh] overflow-y-auto shadow-2xl" onClick={e => e.stopPropagation()}>
                {/* Header */}
                <div className="flex items-center justify-between p-5 border-b border-white/5">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#FF9500] to-[#FF6B00] flex items-center justify-center text-sm font-bold text-white">
                            {user.name?.[0]?.toUpperCase() || 'U'}
                        </div>
                        <div>
                            <h3 className="text-sm font-bold text-white flex items-center gap-2">
                                {user.name}
                                <StatusBadge suspended={user.is_suspended} />
                            </h3>
                            <p className="text-[10px] text-white/30">{user.email}</p>
                        </div>
                    </div>
                    <button onClick={onClose} className="p-2 rounded-lg hover:bg-white/[0.06] text-white/40 transition">
                        <X className="w-4 h-4" />
                    </button>
                </div>

                {/* Tabs */}
                <div className="flex border-b border-white/5">
                    {tabs.map(tab => (
                        <button key={tab.key} onClick={() => setActiveTab(tab.key)}
                            className={`flex-1 px-4 py-3 text-xs font-medium transition ${activeTab === tab.key ? 'text-[#FF9500] border-b-2 border-[#FF9500]' : 'text-white/30 hover:text-white/50'}`}>
                            {tab.label}
                        </button>
                    ))}
                </div>

                <div className="p-5 space-y-4">
                    {/* Info Tab */}
                    {activeTab === 'info' && (
                        <>
                            <div className="grid grid-cols-2 gap-3">
                                <div className="p-3 rounded-xl bg-white/[0.04] border border-white/5">
                                    <span className="text-[10px] text-white/30 block">Orders</span>
                                    <span className="text-lg font-bold text-white">{user.orders_count ?? 0}</span>
                                </div>
                                <div className="p-3 rounded-xl bg-white/[0.04] border border-white/5">
                                    <span className="text-[10px] text-white/30 block">Balance</span>
                                    <span className="text-lg font-bold text-[#FF9500]">₦{Number(user.wallet?.balance ?? 0).toLocaleString()}</span>
                                </div>
                                <div className="p-3 rounded-xl bg-white/[0.04] border border-white/5">
                                    <span className="text-[10px] text-white/30 block">Referral Code</span>
                                    <span className="text-sm text-white font-mono">{user.referral_code || '—'}</span>
                                </div>
                                <div className="p-3 rounded-xl bg-white/[0.04] border border-white/5">
                                    <span className="text-[10px] text-white/30 block">Joined</span>
                                    <span className="text-sm text-white/60">{new Date(user.created_at).toLocaleDateString()}</span>
                                </div>
                            </div>
                            {/* Badges row */}
                            <div className="flex gap-2 flex-wrap">
                                {user.is_reseller && <ResellerBadge />}
                                {user.has_api_key && <ApiBadge />}
                            </div>
                            {user.phone && (
                                <div className="p-3 rounded-xl bg-white/[0.04] border border-white/5">
                                    <span className="text-[10px] text-white/30 block">Phone</span>
                                    <span className="text-sm text-white font-mono">{user.phone}</span>
                                </div>
                            )}
                            <button onClick={() => navigate(`/admin/users/${user.id}`)}
                                className="w-full py-2.5 rounded-xl bg-[rgba(255,149,0,0.1)] border border-[rgba(255,149,0,0.2)] text-[#FF9500] text-xs font-bold hover:bg-[rgba(255,149,0,0.2)] transition flex items-center justify-center gap-2">
                                <Eye className="w-3.5 h-3.5" /> View Full Profile
                            </button>
                        </>
                    )}

                    {/* Wallet Tab */}
                    {activeTab === 'wallet' && (
                        <>
                            <div className="text-center p-4 rounded-xl bg-white/[0.04] border border-white/5">
                                <span className="text-[10px] text-white/30 block">Current Balance</span>
                                <span className="text-2xl font-bold text-[#FF9500]">₦{Number(user.wallet?.balance ?? 0).toLocaleString()}</span>
                            </div>
                            <div className="space-y-2.5">
                                <input type="number" placeholder="Amount" value={creditAmount} onChange={e => setCreditAmount(e.target.value)}
                                    className="w-full px-3 py-2.5 rounded-xl bg-white/[0.05] border border-white/10 text-sm text-white placeholder-white/20 focus:outline-none focus:border-[rgba(255,149,0,0.4)] transition" />
                                <input type="text" placeholder="Note (optional)" value={creditNote} onChange={e => setCreditNote(e.target.value)}
                                    className="w-full px-3 py-2.5 rounded-xl bg-white/[0.05] border border-white/10 text-sm text-white placeholder-white/20 focus:outline-none focus:border-[rgba(255,149,0,0.4)] transition" />
                                <div className="flex gap-2">
                                    <button onClick={() => { handleAction('credit', { amount: creditAmount, note: creditNote }); setCreditAmount(''); setCreditNote('') }}
                                        disabled={!creditAmount || actionLoading === 'credit'}
                                        className="flex-1 py-2.5 rounded-xl bg-green-500/10 border border-green-500/20 text-green-400 text-xs font-bold hover:bg-green-500/20 disabled:opacity-30 transition flex items-center justify-center gap-1.5">
                                        {actionLoading === 'credit' ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <DollarSign className="w-3.5 h-3.5" />}
                                        Credit
                                    </button>
                                    <button onClick={() => { handleAction('debit', { amount: creditAmount, note: creditNote }); setCreditAmount(''); setCreditNote('') }}
                                        disabled={!creditAmount || actionLoading === 'debit'}
                                        className="flex-1 py-2.5 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-xs font-bold hover:bg-red-500/20 disabled:opacity-30 transition flex items-center justify-center gap-1.5">
                                        {actionLoading === 'debit' ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <DollarSign className="w-3.5 h-3.5" />}
                                        Debit
                                    </button>
                                </div>
                            </div>
                        </>
                    )}

                    {/* Actions Tab */}
                    {activeTab === 'actions' && (
                        <div className="space-y-2.5">
                            {/* Suspend / Unsuspend */}
                            <div className="space-y-2">
                                {!user.is_suspended && (
                                    <input type="text" placeholder="Suspension reason..." value={suspendReason} onChange={e => setSuspendReason(e.target.value)}
                                        className="w-full px-3 py-2 rounded-xl bg-white/[0.05] border border-white/10 text-sm text-white placeholder-white/20 focus:outline-none transition" />
                                )}
                                <button onClick={() => handleAction('suspend', { reason: suspendReason })} disabled={actionLoading === 'suspend'}
                                    className={`w-full py-2.5 rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5 ${user.is_suspended ? 'bg-green-500/10 border border-green-500/20 text-green-400 hover:bg-green-500/20' : 'bg-red-500/10 border border-red-500/20 text-red-400 hover:bg-red-500/20'}`}>
                                    {actionLoading === 'suspend' ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> :
                                        user.is_suspended ? <UserCheck className="w-3.5 h-3.5" /> : <Ban className="w-3.5 h-3.5" />}
                                    {user.is_suspended ? 'Unsuspend User' : 'Suspend User'}
                                </button>
                            </div>

                            <button onClick={() => handleAction('reset-password')} disabled={actionLoading === 'reset-password'}
                                className="w-full py-2.5 rounded-xl bg-yellow-500/10 border border-yellow-500/20 text-yellow-400 text-xs font-bold hover:bg-yellow-500/20 disabled:opacity-50 transition flex items-center justify-center gap-1.5">
                                {actionLoading === 'reset-password' ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <KeyRound className="w-3.5 h-3.5" />}
                                Reset Password
                            </button>

                            {/* Toggle Reseller */}
                            <button onClick={() => handleAction('toggle-reseller')} disabled={actionLoading === 'toggle-reseller'}
                                className={`w-full py-2.5 rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5 ${user.is_reseller ? 'bg-purple-500/10 border border-purple-500/20 text-purple-400 hover:bg-purple-500/20' : 'bg-purple-500/10 border border-purple-500/20 text-purple-300 hover:bg-purple-500/20'}`}>
                                {actionLoading === 'toggle-reseller' ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Crown className="w-3.5 h-3.5" />}
                                {user.is_reseller ? 'Remove Reseller Status' : 'Make Reseller'}
                            </button>

                            <button onClick={() => handleAction('login-as')} disabled={actionLoading === 'login-as' || user.is_suspended}
                                className="w-full py-2.5 rounded-xl bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-bold hover:bg-blue-500/20 disabled:opacity-30 transition flex items-center justify-center gap-1.5">
                                {actionLoading === 'login-as' ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <LogIn className="w-3.5 h-3.5" />}
                                Login as User
                            </button>

                            <button onClick={() => navigate(`/admin/users/${user.id}`)}
                                className="w-full py-2.5 rounded-xl bg-[rgba(255,149,0,0.1)] border border-[rgba(255,149,0,0.2)] text-[#FF9500] text-xs font-bold hover:bg-[rgba(255,149,0,0.2)] transition flex items-center justify-center gap-2">
                                <Eye className="w-3.5 h-3.5" /> Full Profile & History
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}

export default function ManageUsersSection() {
    const navigate = useNavigate()
    const [users, setUsers] = useState([])
    const [meta, setMeta] = useState({})
    const [stats, setStats] = useState(null)
    const [page, setPage] = useState(1)
    const [search, setSearch] = useState('')
    const [filter, setFilter] = useState('all')
    const [loading, setLoading] = useState(true)
    const [selectedUser, setSelectedUser] = useState(null)

    const loadUsers = useCallback(() => {
        setLoading(true)
        const params = { page, per_page: 15 }
        if (search) params.search = search
        if (filter !== 'all') params.filter = filter

        adminApi.get('/api/admin/users', { params })
            .then(r => { setUsers(r.data.data); setMeta(r.data) })
            .catch(() => toast.error('Failed to load users'))
            .finally(() => setLoading(false))
    }, [page, search, filter])

    const loadStats = () => {
        adminApi.get('/api/admin/users-stats')
            .then(r => setStats(r.data))
            .catch(() => { })
    }

    useEffect(() => { loadStats() }, [])
    useEffect(() => { loadUsers() }, [loadUsers])

    const handleRefresh = () => { loadUsers(); loadStats() }

    return (
        <div className="space-y-5">

            {/* ═══ Stats ═══ */}
            {stats && (
                <div className="flex gap-2 flex-wrap">
                    <StatMini label="Total" value={stats.total} icon={Users} color="#FF9500" />
                    <StatMini label="Active" value={stats.active} icon={UserCheck} color="#34C759" />
                    <StatMini label="Suspended" value={stats.suspended} icon={UserX} color="#FF3B30" />
                    <StatMini label="New Today" value={stats.new_today} icon={UserPlus} color="#5AC8FA" />
                    <StatMini label="New This Week" value={stats.new_week} icon={TrendingUp} color="#AF52DE" />
                    <StatMini label="API Users" value={stats.api_users} icon={Code2} color="#0099FF" />
                    <StatMini label="Resellers" value={stats.resellers} icon={Crown} color="#FFD60A" />
                </div>
            )}

            {/* ═══ Filters ═══ */}
            <div className="flex flex-col gap-3">
                <div className="relative flex-1 max-w-sm">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
                    <input type="text" placeholder="Search name, email, phone, referral code..."
                        value={search} onChange={e => { setSearch(e.target.value); setPage(1) }}
                        className="w-full pl-9 pr-4 py-2.5 rounded-xl bg-white/[0.05] border border-white/10 text-sm text-white placeholder-white/25 focus:outline-none focus:border-[rgba(255,149,0,0.4)] transition" />
                </div>
                <div className="flex gap-1.5 flex-wrap">
                    {FILTERS.map(f => (
                        <button key={f.key} onClick={() => { setFilter(f.key); setPage(1) }}
                            className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-medium border transition ${filter === f.key ? 'bg-[rgba(255,149,0,0.12)] border-[rgba(255,149,0,0.3)] text-[#FF9500]' : 'bg-white/[0.03] border-white/5 text-white/40 hover:text-white/60'}`}>
                            <f.icon className="w-3 h-3" />
                            {f.label}
                        </button>
                    ))}
                </div>
            </div>

            {/* ═══ Users List ═══ */}
            <div className="rounded-2xl border border-[rgba(255,255,255,0.06)] bg-[rgba(15,20,60,0.5)] backdrop-blur-xl overflow-hidden">
                {loading ? (
                    <div className="p-12 text-center"><Loader2 className="w-6 h-6 text-[#FF9500] animate-spin mx-auto" /></div>
                ) : users.length === 0 ? (
                    <div className="p-12 text-center text-white/30 text-sm">No users found</div>
                ) : (
                    <>
                        {/* Desktop Table */}
                        <div className="hidden md:block overflow-x-auto">
                            <table className="w-full text-left">
                                <thead>
                                    <tr className="border-b border-white/5">
                                        <th className="px-5 py-3.5 text-xs text-white/30 font-medium">User</th>
                                        <th className="px-5 py-3.5 text-xs text-white/30 font-medium">Email</th>
                                        <th className="px-5 py-3.5 text-xs text-white/30 font-medium">Status</th>
                                        <th className="px-5 py-3.5 text-xs text-white/30 font-medium">Orders</th>
                                        <th className="px-5 py-3.5 text-xs text-white/30 font-medium">Wallet</th>
                                        <th className="px-5 py-3.5 text-xs text-white/30 font-medium">Joined</th>
                                        <th className="px-5 py-3.5 text-xs text-white/30 font-medium text-right">Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {users.map(user => (
                                        <tr key={user.id} className="border-b border-white/[0.03] hover:bg-white/[0.02] transition">
                                            <td className="px-5 py-3.5">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#FF9500] to-[#FF6B00] flex-shrink-0 flex items-center justify-center text-xs font-bold text-white">
                                                        {user.name?.[0]?.toUpperCase() || 'U'}
                                                    </div>
                                                    <span className="text-sm text-white font-medium">{user.name}</span>
                                                </div>
                                            </td>
                                            <td className="px-5 py-3.5 text-sm text-white/40">{user.email}</td>
                                            <td className="px-5 py-3.5">
                                                <div className="flex items-center gap-1.5 flex-wrap">
                                                    <StatusBadge suspended={user.is_suspended} />
                                                    {user.is_reseller && <ResellerBadge />}
                                                    {user.has_api_key && <ApiBadge />}
                                                </div>
                                            </td>
                                            <td className="px-5 py-3.5 text-sm text-white/50">{user.orders_count ?? 0}</td>
                                            <td className="px-5 py-3.5 text-sm text-[#FF9500] font-medium">₦{Number(user.wallet?.balance ?? 0).toLocaleString()}</td>
                                            <td className="px-5 py-3.5 text-xs text-white/20">{new Date(user.created_at).toLocaleDateString()}</td>
                                            <td className="px-5 py-3.5 text-right">
                                                <div className="flex items-center justify-end gap-1.5">
                                                    <button onClick={() => setSelectedUser(user)}
                                                        className="px-3 py-1.5 rounded-lg bg-[rgba(255,149,0,0.1)] border border-[rgba(255,149,0,0.2)] text-[#FF9500] text-xs font-bold hover:bg-[rgba(255,149,0,0.2)] transition">
                                                        Manage
                                                    </button>
                                                    <button onClick={() => navigate(`/admin/users/${user.id}`)}
                                                        className="p-1.5 rounded-lg hover:bg-white/[0.06] text-white/30 hover:text-white/60 transition">
                                                        <Eye className="w-4 h-4" />
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>

                        {/* Mobile Cards */}
                        <div className="md:hidden divide-y divide-white/5">
                            {users.map(user => (
                                <div key={user.id} className="p-4 hover:bg-white/[0.02] transition" onClick={() => setSelectedUser(user)}>
                                    <div className="flex items-center justify-between gap-3">
                                        <div className="flex items-center gap-3 min-w-0">
                                            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#FF9500] to-[#FF6B00] flex-shrink-0 flex items-center justify-center text-sm font-bold text-white">
                                                {user.name?.[0]?.toUpperCase() || 'U'}
                                            </div>
                                            <div className="min-w-0">
                                                <div className="flex items-center gap-2 flex-wrap">
                                                    <p className="text-sm font-semibold text-white truncate">{user.name}</p>
                                                    <StatusBadge suspended={user.is_suspended} />
                                                    {user.is_reseller && <ResellerBadge />}
                                                </div>
                                                <p className="text-xs text-white/30 truncate">{user.email}</p>
                                            </div>
                                        </div>
                                        <span className="px-3 py-1.5 rounded-lg bg-[rgba(255,149,0,0.1)] border border-[rgba(255,149,0,0.2)] text-[#FF9500] text-[10px] font-bold flex-shrink-0">Manage</span>
                                    </div>
                                    <div className="flex items-center gap-4 mt-3 ml-[52px]">
                                        <div>
                                            <span className="text-[10px] text-white/25 uppercase">Orders</span>
                                            <p className="text-sm text-white/50 font-medium">{user.orders_count ?? 0}</p>
                                        </div>
                                        <div>
                                            <span className="text-[10px] text-white/25 uppercase">Wallet</span>
                                            <p className="text-sm text-[#FF9500] font-bold">₦{Number(user.wallet?.balance ?? 0).toLocaleString()}</p>
                                        </div>
                                        <div>
                                            <span className="text-[10px] text-white/25 uppercase">Joined</span>
                                            <p className="text-xs text-white/30">{new Date(user.created_at).toLocaleDateString()}</p>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </>
                )}

                {/* Pagination */}
                {meta.last_page > 1 && (
                    <div className="flex items-center justify-between px-5 py-3 border-t border-white/5">
                        <span className="text-xs text-white/30">Page {meta.current_page} of {meta.last_page} · {meta.total} users</span>
                        <div className="flex gap-1.5">
                            <button disabled={page <= 1} onClick={() => setPage(p => p - 1)}
                                className="p-2 rounded-lg hover:bg-white/[0.06] text-white/30 hover:text-white/60 disabled:opacity-20 transition">
                                <ChevronLeft className="w-4 h-4" />
                            </button>
                            <button disabled={page >= meta.last_page} onClick={() => setPage(p => p + 1)}
                                className="p-2 rounded-lg hover:bg-white/[0.06] text-white/30 hover:text-white/60 disabled:opacity-20 transition">
                                <ChevronRight className="w-4 h-4" />
                            </button>
                        </div>
                    </div>
                )}
            </div>

            {/* ═══ Quick Actions Modal ═══ */}
            {selectedUser && (
                <UserQuickActions
                    user={selectedUser}
                    onClose={() => setSelectedUser(null)}
                    onRefresh={handleRefresh}
                />
            )}
        </div>
    )
}
