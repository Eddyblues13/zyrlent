import { useState, useEffect, useCallback } from 'react'
import { Search, ChevronLeft, ChevronRight, Users, Eye, Wallet, Loader2, X } from 'lucide-react'
import adminApi from '../../../lib/adminAxios'
import toast from 'react-hot-toast'

export default function ManageUsersSection() {
    const [users, setUsers] = useState([])
    const [meta, setMeta] = useState({})
    const [page, setPage] = useState(1)
    const [search, setSearch] = useState('')
    const [loading, setLoading] = useState(true)
    const [selectedUser, setSelectedUser] = useState(null)
    const [creditAmount, setCreditAmount] = useState('')
    const [creditNote, setCreditNote] = useState('')
    const [crediting, setCrediting] = useState(false)

    const loadUsers = useCallback(() => {
        setLoading(true)
        adminApi.get('/api/admin/users', { params: { page, search, per_page: 15 } })
            .then(r => { setUsers(r.data.data); setMeta(r.data) })
            .catch(() => toast.error('Failed to load users'))
            .finally(() => setLoading(false))
    }, [page, search])

    useEffect(() => { loadUsers() }, [loadUsers])

    const viewUser = async (user) => {
        try {
            const r = await adminApi.get(`/api/admin/users/${user.id}`)
            setSelectedUser(r.data)
        } catch { toast.error('Failed to load user details') }
    }

    const handleCredit = async () => {
        if (!creditAmount || Number(creditAmount) <= 0) return toast.error('Enter a valid amount')
        setCrediting(true)
        try {
            const r = await adminApi.post(`/api/admin/users/${selectedUser.id}/credit`, { amount: creditAmount, note: creditNote })
            toast.success(r.data.message)
            setCreditAmount('')
            setCreditNote('')
            viewUser(selectedUser)
            loadUsers()
        } catch (err) { toast.error(err.response?.data?.message || 'Failed') }
        finally { setCrediting(false) }
    }

    return (
        <div className="space-y-6">
            {/* Search */}
            <div className="relative max-w-sm">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
                <input type="text" placeholder="Search name or email..."
                    value={search} onChange={e => { setSearch(e.target.value); setPage(1) }}
                    className="w-full pl-9 pr-4 py-2.5 rounded-xl bg-white/[0.05] border border-white/10 text-sm text-white placeholder-white/25 focus:outline-none focus:border-[rgba(255,149,0,0.4)] transition" />
            </div>

            {/* User Detail Modal */}
            {selectedUser && (
                <div className="rounded-2xl border border-[rgba(255,149,0,0.15)] bg-[rgba(15,20,60,0.8)] backdrop-blur-xl p-4 sm:p-6">
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="text-sm font-bold text-white truncate pr-4">User Details — {selectedUser.name}</h3>
                        <button onClick={() => setSelectedUser(null)} className="text-white/30 hover:text-white/60 flex-shrink-0"><X className="w-5 h-5" /></button>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-4">
                        <div className="rounded-xl bg-white/[0.03] p-4">
                            <p className="text-xs text-white/30 mb-1">Email</p>
                            <p className="text-sm text-white break-all">{selectedUser.email}</p>
                        </div>
                        <div className="rounded-xl bg-white/[0.03] p-4">
                            <p className="text-xs text-white/30 mb-1">Wallet Balance</p>
                            <p className="text-sm text-[#FF9500] font-bold">₦{Number(selectedUser.wallet?.balance ?? 0).toLocaleString()}</p>
                        </div>
                        <div className="rounded-xl bg-white/[0.03] p-4">
                            <p className="text-xs text-white/30 mb-1">Orders</p>
                            <p className="text-sm text-white">{selectedUser.orders?.length ?? 0} recent</p>
                        </div>
                    </div>

                    {/* Credit Wallet */}
                    <div className="flex flex-col sm:flex-row sm:items-end gap-3 p-4 rounded-xl bg-[rgba(255,149,0,0.04)] border border-[rgba(255,149,0,0.1)]">
                        <div className="flex-1">
                            <label className="text-xs text-white/40 mb-1 block">Credit Wallet</label>
                            <input type="number" placeholder="Amount (₦)" min="1" value={creditAmount} onChange={e => setCreditAmount(e.target.value)}
                                className="w-full px-3 py-2 rounded-lg bg-white/[0.05] border border-white/10 text-sm text-white placeholder-white/25 focus:outline-none focus:border-[rgba(255,149,0,0.4)]" />
                        </div>
                        <div className="flex-1">
                            <label className="text-xs text-white/40 mb-1 block">Note (optional)</label>
                            <input placeholder="e.g. OPay confirmed" value={creditNote} onChange={e => setCreditNote(e.target.value)}
                                className="w-full px-3 py-2 rounded-lg bg-white/[0.05] border border-white/10 text-sm text-white placeholder-white/25 focus:outline-none focus:border-[rgba(255,149,0,0.4)]" />
                        </div>
                        <button onClick={handleCredit} disabled={crediting}
                            className="w-full sm:w-auto px-5 py-2 rounded-xl bg-gradient-to-r from-[#FF9500] to-[#FF6B00] text-white text-sm font-bold disabled:opacity-40 flex items-center justify-center gap-2 whitespace-nowrap">
                            {crediting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Wallet className="w-4 h-4" />} Credit
                        </button>
                    </div>
                </div>
            )}

            {/* Users List */}
            <div className="rounded-2xl border border-[rgba(255,255,255,0.06)] bg-[rgba(15,20,60,0.5)] backdrop-blur-xl overflow-hidden">
                {loading ? (
                    <div className="p-12 text-center"><Loader2 className="w-6 h-6 text-[#FF9500] animate-spin mx-auto" /></div>
                ) : users.length === 0 ? (
                    <div className="p-12 text-center text-white/30 text-sm">No users found</div>
                ) : (
                    <>
                        {/* ───── Desktop Table ───── */}
                        <div className="hidden md:block overflow-x-auto">
                            <table className="w-full text-left">
                                <thead>
                                    <tr className="border-b border-white/5">
                                        <th className="px-5 py-3.5 text-xs text-white/30 font-medium">User</th>
                                        <th className="px-5 py-3.5 text-xs text-white/30 font-medium">Email</th>
                                        <th className="px-5 py-3.5 text-xs text-white/30 font-medium">Orders</th>
                                        <th className="px-5 py-3.5 text-xs text-white/30 font-medium">Wallet</th>
                                        <th className="px-5 py-3.5 text-xs text-white/30 font-medium text-right">Action</th>
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
                                            <td className="px-5 py-3.5 text-sm text-white/50">{user.orders_count ?? 0}</td>
                                            <td className="px-5 py-3.5 text-sm text-[#FF9500] font-medium">₦{Number(user.wallet?.balance ?? 0).toLocaleString()}</td>
                                            <td className="px-5 py-3.5 text-right">
                                                <button onClick={() => viewUser(user)}
                                                    className="p-2 rounded-lg hover:bg-white/[0.06] text-white/30 hover:text-[#FF9500] transition">
                                                    <Eye className="w-4 h-4" />
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>

                        {/* ───── Mobile Cards ───── */}
                        <div className="md:hidden divide-y divide-white/5">
                            {users.map(user => (
                                <div key={user.id} className="p-4 hover:bg-white/[0.02] transition">
                                    <div className="flex items-center justify-between gap-3">
                                        <div className="flex items-center gap-3 min-w-0">
                                            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#FF9500] to-[#FF6B00] flex-shrink-0 flex items-center justify-center text-sm font-bold text-white">
                                                {user.name?.[0]?.toUpperCase() || 'U'}
                                            </div>
                                            <div className="min-w-0">
                                                <p className="text-sm font-semibold text-white truncate">{user.name}</p>
                                                <p className="text-xs text-white/30 truncate">{user.email}</p>
                                            </div>
                                        </div>
                                        <button onClick={() => viewUser(user)}
                                            className="p-2 rounded-lg bg-white/[0.04] text-white/40 hover:text-[#FF9500] transition flex-shrink-0">
                                            <Eye className="w-4 h-4" />
                                        </button>
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
                                    </div>
                                </div>
                            ))}
                        </div>
                    </>
                )}

                {/* Pagination */}
                {meta.last_page > 1 && (
                    <div className="flex items-center justify-between px-5 py-3 border-t border-white/5">
                        <span className="text-xs text-white/30">Page {meta.current_page} of {meta.last_page}</span>
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
