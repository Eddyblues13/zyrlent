import { useState, useEffect, useCallback } from 'react'
import {
    Search, ChevronLeft, ChevronRight, Loader2, XCircle, CheckCircle,
    RotateCcw, DollarSign, Eye, X, Copy, MoreHorizontal, Clock
} from 'lucide-react'
import { ServiceIconWithFallback } from '../../../components/ServiceIcon'
import adminApi from '../../../lib/adminAxios'
import toast from 'react-hot-toast'

const STATUSES = ['All', 'pending', 'waiting', 'completed', 'cancelled', 'expired', 'failed']

const StatusBadge = ({ status }) => {
    const cls = status === 'completed' ? 'bg-green-500/10 text-green-400' :
        status === 'waiting' ? 'bg-blue-500/10 text-blue-400' :
            status === 'pending' ? 'bg-yellow-500/10 text-yellow-400' :
                status === 'cancelled' ? 'bg-orange-500/10 text-orange-400' :
                    status === 'expired' ? 'bg-gray-500/10 text-gray-400' :
                        'bg-red-500/10 text-red-400'
    return <span className={`text-[10px] px-2.5 py-1 rounded-lg font-bold uppercase tracking-wide ${cls}`}>{status}</span>
}

/* ── Stat Mini Card ── */
const StatMini = ({ label, value, color }) => (
    <div className="text-center p-3 rounded-xl bg-white/[0.03] border border-white/5 flex-1 min-w-[80px]">
        <p className="text-lg font-bold text-white">{value ?? 0}</p>
        <p className="text-[9px] font-medium mt-0.5" style={{ color }}>{label}</p>
    </div>
)

/* ── Action Modal ── */
const OrderDetailModal = ({ order, onClose, onAction }) => {
    const [otpInput, setOtpInput] = useState('')
    const [actionLoading, setActionLoading] = useState(null)

    const handleAction = async (action, body = {}) => {
        setActionLoading(action)
        try {
            const res = await adminApi.post(`/api/admin/orders/${order.id}/${action}`, body)
            toast.success(res.data.message)
            onAction()
            if (action !== 'force-complete') onClose()
        } catch (err) {
            toast.error(err.response?.data?.message || 'Action failed')
        } finally {
            setActionLoading(null)
        }
    }

    const copyToClipboard = (text) => {
        navigator.clipboard.writeText(text)
        toast.success('Copied')
    }

    const canCancel = !['completed', 'cancelled', 'expired'].includes(order.status)
    const canComplete = order.status !== 'completed'
    const canResend = !!order.phone_number && ['waiting', 'pending'].includes(order.status)
    const canRefund = !['cancelled'].includes(order.status) && order.cost > 0

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4" onClick={onClose}>
            <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />
            <div className="relative bg-[#0F1440] border border-white/10 rounded-2xl w-full max-w-lg max-h-[85vh] overflow-y-auto shadow-2xl" onClick={e => e.stopPropagation()}>
                {/* Header */}
                <div className="flex items-center justify-between p-5 border-b border-white/5">
                    <div>
                        <h3 className="text-sm font-bold text-white">Activation #{order.order_ref}</h3>
                        <p className="text-[10px] text-white/30 mt-0.5">{new Date(order.created_at).toLocaleString()}</p>
                    </div>
                    <button onClick={onClose} className="p-2 rounded-lg hover:bg-white/[0.06] text-white/40 transition">
                        <X className="w-4 h-4" />
                    </button>
                </div>

                {/* Info Grid */}
                <div className="p-5 space-y-4">
                    <div className="grid grid-cols-2 gap-3">
                        <div className="space-y-0.5">
                            <span className="text-[10px] text-white/30 font-medium">Status</span>
                            <div><StatusBadge status={order.status} /></div>
                        </div>
                        <div className="space-y-0.5">
                            <span className="text-[10px] text-white/30 font-medium">Cost</span>
                            <p className="text-sm text-white font-bold">₦{Number(order.cost ?? 0).toLocaleString()}</p>
                        </div>
                        <div className="space-y-0.5">
                            <span className="text-[10px] text-white/30 font-medium">User</span>
                            <p className="text-sm text-white">{order.user?.name || 'N/A'}</p>
                            <p className="text-[10px] text-white/25">{order.user?.email}</p>
                        </div>
                        <div className="space-y-0.5">
                            <span className="text-[10px] text-white/30 font-medium">Service</span>
                            <div className="flex items-center gap-1.5">
                                <ServiceIconWithFallback icon={order.service?.icon} name={order.service?.name} color={order.service?.color} size="sm" />
                                <span className="text-sm text-white">{order.service?.name || 'N/A'}</span>
                            </div>
                        </div>
                        <div className="space-y-0.5">
                            <span className="text-[10px] text-white/30 font-medium">Country</span>
                            <p className="text-sm text-white">{order.country?.flag} {order.country?.name || 'N/A'}</p>
                        </div>
                        <div className="space-y-0.5">
                            <span className="text-[10px] text-white/30 font-medium">Expires</span>
                            <p className="text-sm text-white/60">{order.expires_at ? new Date(order.expires_at).toLocaleString() : '—'}</p>
                        </div>
                    </div>

                    {/* Phone & OTP */}
                    <div className="space-y-2.5">
                        <div className="flex items-center justify-between p-3 rounded-xl bg-white/[0.04] border border-white/5">
                            <div>
                                <span className="text-[10px] text-white/30 block">Phone Number</span>
                                <span className="text-sm text-white font-mono">{order.phone_number || '—'}</span>
                            </div>
                            {order.phone_number && (
                                <button onClick={() => copyToClipboard(order.phone_number)} className="p-1.5 rounded-lg hover:bg-white/10 text-white/40 transition">
                                    <Copy className="w-3.5 h-3.5" />
                                </button>
                            )}
                        </div>

                        <div className="flex items-center justify-between p-3 rounded-xl bg-white/[0.04] border border-white/5">
                            <div>
                                <span className="text-[10px] text-white/30 block">OTP / SMS Code</span>
                                <span className="text-sm text-white font-mono font-bold">{order.otp_code || '—'}</span>
                            </div>
                            {order.otp_code && (
                                <button onClick={() => copyToClipboard(order.otp_code)} className="p-1.5 rounded-lg hover:bg-white/10 text-white/40 transition">
                                    <Copy className="w-3.5 h-3.5" />
                                </button>
                            )}
                        </div>

                        {order.sms_from && (
                            <div className="p-3 rounded-xl bg-white/[0.04] border border-white/5">
                                <span className="text-[10px] text-white/30 block">SMS From</span>
                                <span className="text-sm text-white/60">{order.sms_from}</span>
                            </div>
                        )}
                    </div>

                    {/* Force Complete Input */}
                    {canComplete && (
                        <div className="space-y-2">
                            <label className="text-[10px] text-white/40 font-medium">Force Complete (optional OTP)</label>
                            <div className="flex gap-2">
                                <input
                                    type="text" placeholder="OTP code (optional)"
                                    value={otpInput} onChange={e => setOtpInput(e.target.value)}
                                    className="flex-1 px-3 py-2 rounded-xl bg-white/[0.05] border border-white/10 text-sm text-white placeholder-white/20 focus:outline-none focus:border-green-500/40 transition"
                                />
                                <button
                                    onClick={() => handleAction('force-complete', { otp_code: otpInput || undefined })}
                                    disabled={actionLoading === 'force-complete'}
                                    className="px-4 py-2 rounded-xl bg-green-500/10 border border-green-500/20 text-green-400 text-xs font-bold hover:bg-green-500/20 disabled:opacity-50 transition flex items-center gap-1.5"
                                >
                                    {actionLoading === 'force-complete' ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <CheckCircle className="w-3.5 h-3.5" />}
                                    Complete
                                </button>
                            </div>
                        </div>
                    )}

                    {/* Action Buttons */}
                    <div className="flex flex-wrap gap-2 pt-2 border-t border-white/5">
                        {canResend && (
                            <button onClick={() => handleAction('resend-sms')} disabled={actionLoading === 'resend-sms'}
                                className="flex-1 min-w-[120px] px-3 py-2.5 rounded-xl bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-bold hover:bg-blue-500/20 disabled:opacity-50 transition flex items-center justify-center gap-1.5">
                                {actionLoading === 'resend-sms' ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <RotateCcw className="w-3.5 h-3.5" />}
                                Resend SMS
                            </button>
                        )}
                        {canRefund && (
                            <button onClick={() => handleAction('refund')} disabled={actionLoading === 'refund'}
                                className="flex-1 min-w-[120px] px-3 py-2.5 rounded-xl bg-purple-500/10 border border-purple-500/20 text-purple-400 text-xs font-bold hover:bg-purple-500/20 disabled:opacity-50 transition flex items-center justify-center gap-1.5">
                                {actionLoading === 'refund' ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <DollarSign className="w-3.5 h-3.5" />}
                                Refund ₦{Number(order.cost ?? 0).toLocaleString()}
                            </button>
                        )}
                        {canCancel && (
                            <button onClick={() => handleAction('cancel')} disabled={actionLoading === 'cancel'}
                                className="flex-1 min-w-[120px] px-3 py-2.5 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-xs font-bold hover:bg-red-500/20 disabled:opacity-50 transition flex items-center justify-center gap-1.5">
                                {actionLoading === 'cancel' ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <XCircle className="w-3.5 h-3.5" />}
                                Cancel & Refund
                            </button>
                        )}
                    </div>
                </div>
            </div>
        </div>
    )
}

export default function ManageOrdersSection() {
    const [orders, setOrders] = useState([])
    const [meta, setMeta] = useState({})
    const [stats, setStats] = useState(null)
    const [page, setPage] = useState(1)
    const [search, setSearch] = useState('')
    const [status, setStatus] = useState('All')
    const [loading, setLoading] = useState(true)
    const [selectedOrder, setSelectedOrder] = useState(null)

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

    const loadStats = () => {
        adminApi.get('/api/admin/orders-stats')
            .then(r => setStats(r.data))
            .catch(() => { })
    }

    useEffect(() => { loadStats() }, [])
    useEffect(() => { loadOrders() }, [loadOrders])

    const handleActionDone = () => {
        loadOrders()
        loadStats()
    }

    return (
        <div className="space-y-5">

            {/* ═══ Stats Bar ═══ */}
            {stats && (
                <div className="flex gap-2 flex-wrap">
                    <StatMini label="Total" value={stats.total} color="#FF9500" />
                    <StatMini label="Pending" value={stats.pending} color="#FFD60A" />
                    <StatMini label="Waiting" value={stats.waiting} color="#5AC8FA" />
                    <StatMini label="Completed" value={stats.completed} color="#34C759" />
                    <StatMini label="Cancelled" value={stats.cancelled} color="#FF9500" />
                    <StatMini label="Expired" value={stats.expired} color="#8E8E93" />
                    <StatMini label="Failed" value={stats.failed} color="#FF3B30" />
                </div>
            )}

            {/* ═══ Filters ═══ */}
            <div className="flex flex-col gap-3">
                <div className="relative max-w-sm">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
                    <input type="text" placeholder="Search ref, phone, OTP, user..."
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

            {/* ═══ Content ═══ */}
            <div className="rounded-2xl border border-[rgba(255,255,255,0.06)] bg-[rgba(15,20,60,0.5)] backdrop-blur-xl overflow-hidden">
                {loading ? (
                    <div className="p-12 text-center"><Loader2 className="w-6 h-6 text-[#FF9500] animate-spin mx-auto" /></div>
                ) : orders.length === 0 ? (
                    <div className="p-12 text-center text-white/30 text-sm">No orders found</div>
                ) : (
                    <>
                        {/* ───── Desktop Table ───── */}
                        <div className="hidden md:block overflow-x-auto">
                            <table className="w-full text-left">
                                <thead>
                                    <tr className="border-b border-white/5">
                                        <th className="px-5 py-3.5 text-xs text-white/30 font-medium">Service</th>
                                        <th className="px-5 py-3.5 text-xs text-white/30 font-medium">User</th>
                                        <th className="px-5 py-3.5 text-xs text-white/30 font-medium">Phone</th>
                                        <th className="px-5 py-3.5 text-xs text-white/30 font-medium">OTP</th>
                                        <th className="px-5 py-3.5 text-xs text-white/30 font-medium">Country</th>
                                        <th className="px-5 py-3.5 text-xs text-white/30 font-medium">Cost</th>
                                        <th className="px-5 py-3.5 text-xs text-white/30 font-medium">Status</th>
                                        <th className="px-5 py-3.5 text-xs text-white/30 font-medium">Date</th>
                                        <th className="px-5 py-3.5 text-xs text-white/30 font-medium text-right">Action</th>
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
                                            <td className="px-5 py-3.5">
                                                <p className="text-sm text-white/70">{order.user?.name || 'N/A'}</p>
                                                <p className="text-[10px] text-white/25">{order.user?.email}</p>
                                            </td>
                                            <td className="px-5 py-3.5 text-sm text-white/60 font-mono">{order.phone_number || '—'}</td>
                                            <td className="px-5 py-3.5">
                                                {order.otp_code ? (
                                                    <span className="text-sm text-green-400 font-mono font-bold">{order.otp_code}</span>
                                                ) : (
                                                    <span className="text-xs text-white/20">—</span>
                                                )}
                                            </td>
                                            <td className="px-5 py-3.5 text-sm text-white/40">{order.country?.flag} {order.country?.name || '—'}</td>
                                            <td className="px-5 py-3.5 text-sm text-white/50 font-mono">₦{Number(order.cost ?? 0).toLocaleString()}</td>
                                            <td className="px-5 py-3.5"><StatusBadge status={order.status} /></td>
                                            <td className="px-5 py-3.5 text-xs text-white/20">{new Date(order.created_at).toLocaleDateString()}</td>
                                            <td className="px-5 py-3.5 text-right">
                                                <button onClick={() => setSelectedOrder(order)}
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
                            {orders.map(order => (
                                <div key={order.id} className="p-4 hover:bg-white/[0.02] transition" onClick={() => setSelectedOrder(order)}>
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
                                            <span className="text-white/25">OTP</span>
                                            <p className="text-green-400 font-mono font-bold">{order.otp_code || '—'}</p>
                                        </div>
                                        <div>
                                            <span className="text-white/25">Country</span>
                                            <p className="text-white/60">{order.country?.flag} {order.country?.name || '—'}</p>
                                        </div>
                                        <div>
                                            <span className="text-white/25">Cost</span>
                                            <p className="text-white/50 font-mono">₦{Number(order.cost ?? 0).toLocaleString()}</p>
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
                        <span className="text-xs text-white/30">Page {meta.current_page} of {meta.last_page} ({meta.total} total)</span>
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

            {/* ═══ Detail Modal ═══ */}
            {selectedOrder && (
                <OrderDetailModal
                    order={selectedOrder}
                    onClose={() => setSelectedOrder(null)}
                    onAction={handleActionDone}
                />
            )}
        </div>
    )
}
