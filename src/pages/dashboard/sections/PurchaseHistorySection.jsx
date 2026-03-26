import { useState, useEffect, useRef } from 'react'
import { Search, ChevronLeft, ChevronRight, RefreshCw, Package, Clock, CheckCircle, XCircle } from 'lucide-react'
import api from '../../../lib/axios'
import toast from 'react-hot-toast'

const STATUSES = ['all', 'pending', 'completed', 'cancelled', 'expired']

function StatusBadge({ status }) {
    const styles = {
        pending: { cls: 'bg-amber-400/15 text-amber-400 border-amber-400/25', icon: Clock },
        completed: { cls: 'bg-emerald-500/15 text-emerald-400 border-emerald-500/25', icon: CheckCircle },
        cancelled: { cls: 'bg-white/10 text-white/40 border-white/10', icon: XCircle },
        expired: { cls: 'bg-red-400/15 text-red-400 border-red-400/25', icon: XCircle },
    }
    const s = styles[status] || styles.pending
    const Icon = s.icon
    return (
        <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold border ${s.cls}`}>
            <Icon className="w-3 h-3" />{status}
        </span>
    )
}

function formatDate(dateStr) {
    return new Date(dateStr).toLocaleDateString('en-NG', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' })
}

export default function PurchaseHistorySection({ formatNaira }) {
    const [orders, setOrders] = useState([])
    const [loading, setLoading] = useState(true)
    const [search, setSearch] = useState('')
    const [filter, setFilter] = useState('all')
    const [page, setPage] = useState(1)
    const [meta, setMeta] = useState({ last_page: 1, total: 0 })
    const debounce = useRef(null)

    const fetchOrders = async (p = 1, q = search, s = filter) => {
        setLoading(true)
        try {
            const params = { page: p, per_page: 10 }
            if (q) params.search = q
            if (s !== 'all') params.status = s
            const res = await api.get('/api/orders', { params })
            setOrders(res.data.data || [])
            setMeta({ last_page: res.data.last_page || 1, total: res.data.total || 0 })
        } catch (e) {
            toast.error(e.response?.data?.message || 'Failed to load orders')
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => { fetchOrders(1) }, [])

    const handleSearch = (val) => {
        setSearch(val)
        setPage(1)
        clearTimeout(debounce.current)
        debounce.current = setTimeout(() => fetchOrders(1, val, filter), 400)
    }

    const handleFilter = (val) => { setFilter(val); setPage(1); fetchOrders(1, search, val) }
    const handlePage = (p) => { setPage(p); fetchOrders(p) }

    return (
        <div className="flex flex-col gap-5">
            {/* Sticky header area */}
            <div className="sticky top-[61px] z-30 bg-[rgba(8,10,46,0.97)] backdrop-blur-xl -mx-4 sm:-mx-6 lg:-mx-8 px-4 sm:px-6 lg:px-8 pt-4 pb-4 flex flex-col gap-4 border-b border-white/[0.05]">
                {/* Header */}
                <div className="flex items-center justify-between gap-3 flex-wrap">
                    <div>
                        <h2 className="text-xl font-bold text-white">Purchase History</h2>
                        <p className="text-white/40 text-xs mt-0.5">{meta.total} total orders</p>
                    </div>
                    <button onClick={() => fetchOrders(page)} className="p-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/8 text-white/50 hover:text-white transition">
                        <RefreshCw className="w-4 h-4" />
                    </button>
                </div>

                {/* Filters */}
                <div className="flex flex-col sm:flex-row gap-3">
                    <div className="relative flex-1">
                        <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
                        <input type="text" placeholder="Search order ref, phone, service…"
                            value={search} onChange={e => handleSearch(e.target.value)}
                            className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-[rgba(255,255,255,0.05)] border border-[rgba(255,255,255,0.1)] text-white placeholder-white/25 text-sm focus:outline-none focus:border-[rgba(0,255,255,0.35)] transition" />
                    </div>
                    <div className="flex gap-1 p-1 rounded-xl bg-[rgba(255,255,255,0.04)] border border-[rgba(255,255,255,0.07)] overflow-x-auto no-scrollbar">
                        {STATUSES.map(s => (
                            <button key={s} onClick={() => handleFilter(s)}
                                className={`px-3 py-1.5 rounded-lg text-xs font-bold capitalize whitespace-nowrap transition ${filter === s ? 'bg-[rgba(0,255,255,0.15)] text-[#00FFFF]' : 'text-white/45 hover:text-white'}`}>
                                {s}
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            {/* Desktop Table */}
            <div className="hidden md:block rounded-xl overflow-hidden border border-[rgba(255,255,255,0.08)]">
                <table className="w-full border-collapse">
                    <thead>
                        <tr className="bg-[rgba(255,255,255,0.04)] text-left">
                            {['Order', 'Service', 'Country', 'Phone Number', 'OTP Code', 'Cost', 'Status', 'Date'].map(h => (
                                <th key={h} className="px-4 py-3 text-[11px] font-bold text-white/35 uppercase tracking-wider">{h}</th>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        {loading ? (
                            <tr><td colSpan={8} className="text-center py-12 text-white/30 text-sm">Loading…</td></tr>
                        ) : orders.length === 0 ? (
                            <tr><td colSpan={8} className="text-center py-12 text-white/30 text-sm">No orders found.</td></tr>
                        ) : orders.map(order => (
                            <tr key={order.id} className="border-t border-[rgba(255,255,255,0.05)] hover:bg-white/2 transition">
                                <td className="px-4 py-3 text-xs font-mono text-white/60">{order.order_ref}</td>
                                <td className="px-4 py-3">
                                    <span className="flex items-center gap-1.5 text-sm font-semibold text-white">
                                        <span className="w-2 h-2 rounded-full flex-shrink-0" style={{ background: order.service?.color || '#00FFFF' }} />
                                        {order.service?.name}
                                    </span>
                                </td>
                                <td className="px-4 py-3 text-sm text-white/70">{order.country?.flag} {order.country?.name}</td>
                                <td className="px-4 py-3 text-sm font-mono text-[#00FFFF]">{order.phone_number || '—'}</td>
                                <td className="px-4 py-3 text-sm">
                                    {order.otp_code
                                        ? <span className="text-emerald-400 font-mono font-bold">{order.otp_code.substring(0, 80)}</span>
                                        : <span className="text-white/25">Waiting…</span>
                                    }
                                </td>
                                <td className="px-4 py-3 text-sm font-semibold text-white/80">{formatNaira(order.cost)}</td>
                                <td className="px-4 py-3"><StatusBadge status={order.status} /></td>
                                <td className="px-4 py-3 text-xs text-white/35">{formatDate(order.created_at)}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Mobile Cards */}
            <div className="flex flex-col gap-3 md:hidden">
                {loading ? (
                    <div className="text-center py-12 text-white/30 text-sm">Loading…</div>
                ) : orders.length === 0 ? (
                    <div className="text-center py-12 text-white/30 text-sm">No orders found.</div>
                ) : orders.map(order => (
                    <div key={order.id} className="p-4 rounded-xl border border-[rgba(255,255,255,0.08)] bg-[rgba(15,20,60,0.5)]">
                        <div className="flex items-center justify-between mb-3">
                            <div className="flex items-center gap-2">
                                <span className="w-3 h-3 rounded-full" style={{ background: order.service?.color || '#00FFFF' }} />
                                <span className="text-sm font-bold text-white">{order.service?.name}</span>
                                <span className="text-xs text-white/40">{order.country?.flag} {order.country?.name}</span>
                            </div>
                            <StatusBadge status={order.status} />
                        </div>
                        <p className="text-[#00FFFF] font-mono text-sm font-bold mb-1">{order.phone_number || '—'}</p>
                        {order.otp_code && (
                            <p className="text-emerald-400 text-xs font-mono mb-2 break-all">{order.otp_code.substring(0, 100)}</p>
                        )}
                        <div className="flex items-center justify-between text-xs text-white/40 border-t border-white/5 pt-2 mt-2">
                            <span className="font-mono">{order.order_ref}</span>
                            <span>{formatNaira(order.cost)} · {formatDate(order.created_at)}</span>
                        </div>
                    </div>
                ))}
            </div>

            {/* Pagination */}
            {meta.last_page > 1 && (
                <div className="flex items-center justify-center gap-2">
                    <button disabled={page <= 1} onClick={() => handlePage(page - 1)}
                        className="p-2 rounded-xl border border-white/10 hover:bg-white/8 disabled:opacity-30 transition">
                        <ChevronLeft className="w-4 h-4" />
                    </button>
                    <span className="text-sm text-white/50">Page {page} of {meta.last_page}</span>
                    <button disabled={page >= meta.last_page} onClick={() => handlePage(page + 1)}
                        className="p-2 rounded-xl border border-white/10 hover:bg-white/8 disabled:opacity-30 transition">
                        <ChevronRight className="w-4 h-4" />
                    </button>
                </div>
            )}
        </div>
    )
}
