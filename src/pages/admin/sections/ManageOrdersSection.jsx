import { useState, useEffect, useCallback } from 'react'
import { Search, ChevronLeft, ChevronRight, Loader2 } from 'lucide-react'
import { ServiceIconWithFallback } from '../../../components/ServiceIcon'
import adminApi from '../../../lib/adminAxios'
import toast from 'react-hot-toast'

const STATUSES = ['All', 'pending', 'active', 'completed', 'cancelled', 'expired']

const StatusBadge = ({ status }) => {
    const cls = status === 'completed' ? 'bg-green-500/10 text-green-400' :
        status === 'active' ? 'bg-blue-500/10 text-blue-400' :
            status === 'pending' ? 'bg-yellow-500/10 text-yellow-400' :
                'bg-red-500/10 text-red-400'
    return <span className={`text-xs px-2.5 py-1 rounded-lg font-medium ${cls}`}>{status}</span>
}

export default function ManageOrdersSection() {
    const [orders, setOrders] = useState([])
    const [meta, setMeta] = useState({})
    const [page, setPage] = useState(1)
    const [search, setSearch] = useState('')
    const [status, setStatus] = useState('All')
    const [loading, setLoading] = useState(true)

    const loadOrders = useCallback(() => {
        setLoading(true)
        const params = { page, per_page: 15 }
        if (search) params.search = search
        if (status !== 'All') params.status = status

        adminApi.get('/api/admin/orders', { params })
            .then(r => { setOrders(r.data.data); setMeta(r.data) })
            .catch(() => toast.error('Failed to load orders'))
            .finally(() => setLoading(false))
    }, [page, search, status])

    useEffect(() => { loadOrders() }, [loadOrders])

    return (
        <div className="space-y-6">
            {/* Filters */}
            <div className="flex flex-col gap-3">
                <div className="relative max-w-sm">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
                    <input type="text" placeholder="Search ref, phone, user..."
                        value={search} onChange={e => { setSearch(e.target.value); setPage(1) }}
                        className="w-full pl-9 pr-4 py-2.5 rounded-xl bg-white/[0.05] border border-white/10 text-sm text-white placeholder-white/25 focus:outline-none focus:border-[rgba(255,149,0,0.4)] transition" />
                </div>
                <div className="flex gap-1.5 flex-wrap">
                    {STATUSES.map(s => (
                        <button key={s} onClick={() => { setStatus(s); setPage(1) }}
                            className={`px-3 py-2 rounded-xl text-xs font-medium border transition ${status === s ? 'bg-[rgba(255,149,0,0.12)] border-[rgba(255,149,0,0.3)] text-[#FF9500]' : 'bg-white/[0.03] border-white/5 text-white/40 hover:text-white/60'}`}>
                            {s === 'All' ? 'All' : s.charAt(0).toUpperCase() + s.slice(1)}
                        </button>
                    ))}
                </div>
            </div>

            {/* Content */}
            <div className="rounded-2xl border border-[rgba(255,255,255,0.06)] bg-[rgba(15,20,60,0.5)] backdrop-blur-xl overflow-hidden">
                {loading ? (
                    <div className="p-12 text-center"><Loader2 className="w-6 h-6 text-[#FF9500] animate-spin mx-auto" /></div>
                ) : orders.length === 0 ? (
                    <div className="p-12 text-center text-white/30 text-sm">No orders found</div>
                ) : (
                    <>
                        {/* ───── Desktop Table (hidden on mobile) ───── */}
                        <div className="hidden md:block overflow-x-auto">
                            <table className="w-full text-left">
                                <thead>
                                    <tr className="border-b border-white/5">
                                        <th className="px-5 py-3.5 text-xs text-white/30 font-medium">Service</th>
                                        <th className="px-5 py-3.5 text-xs text-white/30 font-medium">User</th>
                                        <th className="px-5 py-3.5 text-xs text-white/30 font-medium">Phone</th>
                                        <th className="px-5 py-3.5 text-xs text-white/30 font-medium">Country</th>
                                        <th className="px-5 py-3.5 text-xs text-white/30 font-medium">Status</th>
                                        <th className="px-5 py-3.5 text-xs text-white/30 font-medium">Date</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {orders.map(order => (
                                        <tr key={order.id} className="border-b border-white/[0.03] hover:bg-white/[0.02] transition">
                                            <td className="px-5 py-3.5">
                                                <div className="flex items-center gap-2">
                                                    <ServiceIconWithFallback icon={order.service?.icon} name={order.service?.name} color={order.service?.color} size="sm" />
                                                    <span className="text-sm text-white">{order.service?.name || 'N/A'}</span>
                                                </div>
                                            </td>
                                            <td className="px-5 py-3.5 text-sm text-white/40">{order.user?.name || 'N/A'}</td>
                                            <td className="px-5 py-3.5 text-sm text-white/60 font-mono">{order.phone_number || '—'}</td>
                                            <td className="px-5 py-3.5 text-sm text-white/40">{order.country?.flag} {order.country?.name || '—'}</td>
                                            <td className="px-5 py-3.5"><StatusBadge status={order.status} /></td>
                                            <td className="px-5 py-3.5 text-xs text-white/20">{new Date(order.created_at).toLocaleDateString()}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>

                        {/* ───── Mobile Cards (hidden on desktop) ───── */}
                        <div className="md:hidden divide-y divide-white/5">
                            {orders.map(order => (
                                <div key={order.id} className="p-4 hover:bg-white/[0.02] transition">
                                    <div className="flex items-start justify-between gap-3 mb-2.5">
                                        <div className="flex items-center gap-2.5 min-w-0">
                                            <ServiceIconWithFallback icon={order.service?.icon} name={order.service?.name} color={order.service?.color} size="md" />
                                            <div className="min-w-0">
                                                <p className="text-sm font-semibold text-white truncate">{order.service?.name || 'N/A'}</p>
                                                <p className="text-xs text-white/30 truncate">{order.user?.name || 'N/A'}</p>
                                            </div>
                                        </div>
                                        <StatusBadge status={order.status} />
                                    </div>
                                    <div className="grid grid-cols-2 gap-2 text-xs">
                                        <div>
                                            <span className="text-white/25">Phone</span>
                                            <p className="text-white/60 font-mono">{order.phone_number || '—'}</p>
                                        </div>
                                        <div>
                                            <span className="text-white/25">Country</span>
                                            <p className="text-white/60">{order.country?.flag} {order.country?.name || '—'}</p>
                                        </div>
                                        <div className="col-span-2">
                                            <span className="text-white/25">Date</span>
                                            <p className="text-white/40">{new Date(order.created_at).toLocaleString()}</p>
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
