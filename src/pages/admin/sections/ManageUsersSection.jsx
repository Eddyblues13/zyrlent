import { useState, useEffect, useCallback } from 'react'
import { Search, ChevronLeft, ChevronRight, Users, Eye, Loader2 } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import adminApi from '../../../lib/adminAxios'
import toast from 'react-hot-toast'

const StatusBadge = ({ suspended }) => (
    <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold ${suspended ? 'bg-red-500/15 text-red-400 border border-red-500/20' : 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/20'}`}>
        {suspended ? 'Suspended' : 'Active'}
    </span>
)

export default function ManageUsersSection() {
    const navigate = useNavigate()
    const [users, setUsers] = useState([])
    const [meta, setMeta] = useState({})
    const [page, setPage] = useState(1)
    const [search, setSearch] = useState('')
    const [loading, setLoading] = useState(true)

    const loadUsers = useCallback(() => {
        setLoading(true)
        adminApi.get('/api/admin/users', { params: { page, search, per_page: 15 } })
            .then(r => { setUsers(r.data.data); setMeta(r.data) })
            .catch(() => toast.error('Failed to load users'))
            .finally(() => setLoading(false))
    }, [page, search])

    useEffect(() => { loadUsers() }, [loadUsers])

    const viewUser = (userId) => navigate(`/admin/users/${userId}`)

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="relative flex-1 max-w-sm">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
                    <input type="text" placeholder="Search name or email..."
                        value={search} onChange={e => { setSearch(e.target.value); setPage(1) }}
                        className="w-full pl-9 pr-4 py-2.5 rounded-xl bg-white/[0.05] border border-white/10 text-sm text-white placeholder-white/25 focus:outline-none focus:border-[rgba(255,149,0,0.4)] transition" />
                </div>
                <div className="flex items-center gap-2 text-xs text-white/30">
                    <Users className="w-4 h-4" />
                    <span>{meta.total ?? 0} total users</span>
                </div>
            </div>

            {/* Users List */}
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
                                        <th className="px-5 py-3.5 text-xs text-white/30 font-medium text-right">Action</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {users.map(user => (
                                        <tr key={user.id} className="border-b border-white/[0.03] hover:bg-white/[0.02] transition cursor-pointer" onClick={() => viewUser(user.id)}>
                                            <td className="px-5 py-3.5">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#FF9500] to-[#FF6B00] flex-shrink-0 flex items-center justify-center text-xs font-bold text-white">
                                                        {user.name?.[0]?.toUpperCase() || 'U'}
                                                    </div>
                                                    <span className="text-sm text-white font-medium">{user.name}</span>
                                                </div>
                                            </td>
                                            <td className="px-5 py-3.5 text-sm text-white/40">{user.email}</td>
                                            <td className="px-5 py-3.5"><StatusBadge suspended={user.is_suspended} /></td>
                                            <td className="px-5 py-3.5 text-sm text-white/50">{user.orders_count ?? 0}</td>
                                            <td className="px-5 py-3.5 text-sm text-[#FF9500] font-medium">₦{Number(user.wallet?.balance ?? 0).toLocaleString()}</td>
                                            <td className="px-5 py-3.5 text-xs text-white/20">{new Date(user.created_at).toLocaleDateString()}</td>
                                            <td className="px-5 py-3.5 text-right">
                                                <button onClick={e => { e.stopPropagation(); viewUser(user.id) }}
                                                    className="px-3.5 py-1.5 rounded-lg bg-[rgba(255,149,0,0.1)] border border-[rgba(255,149,0,0.2)] text-[#FF9500] text-xs font-bold hover:bg-[rgba(255,149,0,0.2)] transition">
                                                    View
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>

                        {/* Mobile Cards */}
                        <div className="md:hidden divide-y divide-white/5">
                            {users.map(user => (
                                <div key={user.id} className="p-4 hover:bg-white/[0.02] transition" onClick={() => viewUser(user.id)}>
                                    <div className="flex items-center justify-between gap-3">
                                        <div className="flex items-center gap-3 min-w-0">
                                            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#FF9500] to-[#FF6B00] flex-shrink-0 flex items-center justify-center text-sm font-bold text-white">
                                                {user.name?.[0]?.toUpperCase() || 'U'}
                                            </div>
                                            <div className="min-w-0">
                                                <div className="flex items-center gap-2">
                                                    <p className="text-sm font-semibold text-white truncate">{user.name}</p>
                                                    <StatusBadge suspended={user.is_suspended} />
                                                </div>
                                                <p className="text-xs text-white/30 truncate">{user.email}</p>
                                            </div>
                                        </div>
                                        <span className="px-3 py-1.5 rounded-lg bg-[rgba(255,149,0,0.1)] border border-[rgba(255,149,0,0.2)] text-[#FF9500] text-[10px] font-bold flex-shrink-0">View</span>
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
        </div>
    )
}
