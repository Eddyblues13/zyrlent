import { useState, useEffect, useRef, useCallback } from 'react'
import { Search, ChevronLeft, ChevronRight, RefreshCw, Clock, CheckCircle, XCircle, X, Copy, Check, Zap, Smartphone, ArrowRight, Shield, Loader2, Radio, Wifi } from 'lucide-react'
import api from '../../../lib/axios'
import toast from 'react-hot-toast'

// ─── Provider Status Badge ─────────────────────────────────────
const PROVIDER_STATUS_STYLES = {
    amber:   { bg: 'bg-amber-400/10',   border: 'border-amber-400/20',   text: 'text-amber-400',   dot: 'bg-amber-400' },
    emerald: { bg: 'bg-emerald-500/10',  border: 'border-emerald-500/20', text: 'text-emerald-400', dot: 'bg-emerald-400' },
    blue:    { bg: 'bg-blue-400/10',     border: 'border-blue-400/20',    text: 'text-blue-400',    dot: 'bg-blue-400' },
    red:     { bg: 'bg-red-400/10',      border: 'border-red-400/20',     text: 'text-red-400',     dot: 'bg-red-400' },
    gray:    { bg: 'bg-white/5',         border: 'border-white/10',       text: 'text-white/50',    dot: 'bg-white/40' },
}

function ProviderStatusBadge({ info }) {
    if (!info) return null
    const style = PROVIDER_STATUS_STYLES[info.status_color] || PROVIDER_STATUS_STYLES.gray
    const isActive = info.status === 'RECEIVED'

    return (
        <div className={`w-full rounded-xl border ${style.border} ${style.bg} overflow-hidden`}>
            <div className="flex items-center justify-between px-3 py-2 border-b border-white/[0.05]">
                <div className="flex items-center gap-2">
                    <Radio className={`w-3.5 h-3.5 ${style.text} ${isActive ? 'animate-pulse' : ''}`} />
                    <span className="text-[10px] font-bold text-white/50 uppercase tracking-widest">Provider Status</span>
                </div>
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${style.bg} ${style.text} border ${style.border}`}>
                    {info.provider}
                </span>
            </div>
            <div className="px-3 py-2.5 flex flex-col gap-1.5">
                <div className="flex items-center gap-2">
                    <span className={`w-2 h-2 rounded-full ${style.dot} ${isActive ? 'shadow-[0_0_8px_rgba(52,211,153,0.6)] animate-pulse' : ''}`} />
                    <span className={`text-xs font-semibold ${style.text}`}>{info.status_label}</span>
                </div>
                <div className="flex items-center gap-3 text-[10px] text-white/40 flex-wrap">
                    {info.operator && <span>Operator: <span className="text-white/60 font-medium">{info.operator}</span></span>}
                    {info.product && <span>Product: <span className="text-white/60 font-medium capitalize">{info.product}</span></span>}
                    {info.sms_count > 0 && (
                        <span className="flex items-center gap-1">
                            <Wifi className="w-3 h-3 text-emerald-400" />
                            <span className="text-emerald-400 font-semibold">{info.sms_count} SMS received</span>
                        </span>
                    )}
                </div>
                {info.expires_at && isActive && (
                    <p className="text-[10px] text-white/30">Provider expiry: {new Date(info.expires_at).toLocaleTimeString()}</p>
                )}
            </div>
        </div>
    )
}

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

function calcTimeLeft(expiresAt) {
    if (!expiresAt) return 0
    const diff = Math.floor((new Date(expiresAt) - Date.now()) / 1000)
    return diff > 0 ? diff : 0
}

function formatTime(s) {
    return `${Math.floor(s / 60).toString().padStart(2, '0')}:${(s % 60).toString().padStart(2, '0')}`
}

// ─── Order Detail Modal ────────────────────────────────────────
function OrderDetailModal({ order: initialOrder, formatNaira, onClose, onOrderUpdate }) {
    const [order, setOrder] = useState(initialOrder)
    const [timeLeft, setTimeLeft] = useState(calcTimeLeft(initialOrder.expires_at))
    const [cancelling, setCancelling] = useState(false)
    const [banning, setBanning] = useState(false)
    const [copiedNumber, setCopiedNumber] = useState(false)
    const [copiedCode, setCopiedCode] = useState(false)
    const [providerInfo, setProviderInfo] = useState(initialOrder.provider_info || null)
    const pollRef = useRef(null)
    const timerRef = useRef(null)

    const isPending = order.status === 'pending' && !order.otp_code

    const copy = (text, setter) => {
        navigator.clipboard.writeText(text)
        setter(true)
        toast.success('Copied!')
        setTimeout(() => setter(false), 2000)
    }

    // Start countdown timer for pending orders
    useEffect(() => {
        if (!isPending) return
        setTimeLeft(calcTimeLeft(order.expires_at))
        timerRef.current = setInterval(() => {
            setTimeLeft(prev => {
                if (prev <= 0) { clearInterval(timerRef.current); return 0 }
                return prev - 1
            })
        }, 1000)
        return () => clearInterval(timerRef.current)
    }, [order.status, order.otp_code, order.expires_at])

    // Poll for status updates (syncs with 5sim via backend)
    const startPolling = useCallback(() => {
        pollRef.current = setInterval(async () => {
            try {
                const res = await api.get(`/api/orders/${order.id}`)
                const updated = res.data
                setOrder(updated)
                if (updated.provider_info) setProviderInfo(updated.provider_info)
                if (updated.otp_code || ['expired', 'cancelled', 'completed'].includes(updated.status)) {
                    clearInterval(pollRef.current)
                    clearInterval(timerRef.current)
                    if (updated.otp_code) toast.success('🎉 SMS received!')
                    if (onOrderUpdate) onOrderUpdate(updated)
                }
            } catch { }
        }, 5000)
    }, [order.id, onOrderUpdate])

    useEffect(() => {
        if (isPending) startPolling()
        return () => clearInterval(pollRef.current)
    }, [isPending, startPolling])

    const handleCancel = async () => {
        setCancelling(true)
        try {
            const res = await api.post(`/api/orders/${order.id}/cancel`)
            toast.success(res.data.message)
            clearInterval(pollRef.current)
            clearInterval(timerRef.current)
            const cancelled = { ...order, status: 'cancelled' }
            setOrder(cancelled)
            if (onOrderUpdate) onOrderUpdate(cancelled)
        } catch (e) {
            toast.error(e.response?.data?.message || 'Cancel failed')
        } finally {
            setCancelling(false)
        }
    }

    const handleBan = async () => {
        setBanning(true)
        try {
            const res = await api.post(`/api/orders/${order.id}/ban`)
            toast.success(res.data.message)
            clearInterval(pollRef.current)
            clearInterval(timerRef.current)
            const cancelled = { ...order, status: 'cancelled' }
            setOrder(cancelled)
            if (onOrderUpdate) onOrderUpdate(cancelled)
        } catch (e) {
            toast.error(e.response?.data?.message || 'Ban failed')
        } finally {
            setBanning(false)
        }
    }

    return (
        <div className="fixed inset-0 z-[60] flex items-start sm:items-center justify-center bg-black/70 backdrop-blur-md p-0 pt-8 sm:p-6"
            onMouseDown={e => { if (e.target === e.currentTarget) onClose() }}>
            <div className="relative w-full sm:w-[500px] sm:max-w-[92vw] rounded-3xl sm:rounded-2xl bg-[#070D2E] border border-[rgba(51,204,255,0.2)] shadow-[0_0_80px_rgba(0,102,255,0.2)] max-h-[80svh] sm:max-h-[88vh] overflow-y-auto pb-6 sm:pb-0">
                {/* Glow bar */}
                <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#33CCFF] to-transparent opacity-50 rounded-t-2xl" />

                {/* Mobile drag handle */}
                <div className="flex justify-center pt-3 pb-1 sm:hidden">
                    <div className="w-10 h-1 rounded-full bg-white/20" />
                </div>

                {/* Header */}
                <div className="flex items-center justify-between px-5 pt-4 pb-3 border-b border-white/[0.07]">
                    <div>
                        <h3 className="text-base font-bold text-white">Order Details</h3>
                        <p className="text-xs text-white/40 font-mono mt-0.5">{order.order_ref}</p>
                    </div>
                    <button onClick={onClose} className="p-1.5 rounded-full bg-white/5 hover:bg-white/10 text-white/40 hover:text-white transition">
                        <X className="w-4 h-4" />
                    </button>
                </div>

                <div className="flex flex-col items-center gap-3 sm:gap-5 px-4 sm:px-5 py-4 sm:py-5">
                    {/* Status hero */}
                    <div className="relative w-14 h-14 sm:w-16 sm:h-16">
                        <div className={`w-14 h-14 sm:w-16 sm:h-16 rounded-full flex items-center justify-center border-2 ${
                            order.otp_code || order.status === 'completed'
                                ? 'bg-emerald-500/15 border-emerald-500/40'
                                : isPending
                                    ? 'bg-[rgba(51,204,255,0.1)] border-[rgba(51,204,255,0.4)]'
                                    : 'bg-red-500/10 border-red-500/30'
                        }`}>
                            {order.otp_code || order.status === 'completed'
                                ? <Check className="w-6 h-6 sm:w-7 sm:h-7 text-emerald-400 stroke-[3]" />
                                : isPending
                                    ? <Clock className="w-6 h-6 sm:w-7 sm:h-7 text-[#33CCFF] animate-pulse" />
                                    : <XCircle className="w-6 h-6 sm:w-7 sm:h-7 text-red-400" />
                            }
                        </div>
                    </div>

                    <div className="text-center">
                        <h4 className="text-base sm:text-lg font-bold text-white">
                            {order.otp_code ? 'SMS Received! 🎉' : isPending ? 'Waiting for SMS…' : order.status === 'cancelled' ? 'Order Cancelled' : order.status === 'expired' ? 'Order Expired' : 'Order Complete'}
                        </h4>
                        <p className="text-xs sm:text-sm text-white/40 mt-0.5">
                            {order.service?.name} · {order.country?.flag} {order.country?.name}
                        </p>
                    </div>

                    {/* Timer for pending */}
                    {isPending && (
                        <div className="flex flex-col items-center gap-1 sm:gap-1.5">
                            <div className="flex items-center gap-2 sm:gap-2.5 bg-[rgba(0,102,255,0.1)] px-3 sm:px-4 py-1.5 sm:py-2 rounded-full border border-[rgba(0,102,255,0.2)]">
                                <span className="w-2 h-2 sm:w-2.5 sm:h-2.5 rounded-full bg-emerald-400 shadow-[0_0_10px_rgba(52,211,153,0.8)] animate-pulse" />
                                <span className="text-xs sm:text-sm text-white/80 font-medium">Listening for SMS…</span>
                            </div>
                            <p className="text-xs sm:text-sm text-white/40">
                                Expires in: <span className={`font-bold ${timeLeft < 60 ? 'text-red-400' : 'text-white'}`}>{formatTime(timeLeft)}</span>
                            </p>
                        </div>
                    )}

                    {/* Provider Status Badge */}
                    <ProviderStatusBadge info={providerInfo} />

                    {/* Phone number */}
                    {order.phone_number && (
                        <div className="w-full p-3 sm:p-4 rounded-2xl border border-[rgba(51,204,255,0.2)] bg-[rgba(51,204,255,0.04)] text-center">
                            <p className="text-[10px] sm:text-xs text-white/40 mb-1 sm:mb-1.5">Phone Number</p>
                            <p className="text-xl sm:text-2xl font-bold text-white font-mono tracking-wider sm:tracking-widest mb-2 sm:mb-3 break-all">{order.phone_number}</p>
                            <button onClick={() => copy(order.phone_number, setCopiedNumber)}
                                className="inline-flex items-center gap-2 px-4 sm:px-5 py-1.5 sm:py-2 rounded-xl bg-gradient-to-r from-[#0055CC] to-[#0077EE] text-white text-xs sm:text-sm font-bold hover:scale-[1.02] transition shadow-[0_0_15px_rgba(0,102,255,0.3)] border border-[#33CCFF]/20">
                                {copiedNumber ? <><Check className="w-4 h-4" />Copied!</> : <><Copy className="w-4 h-4" />Copy Number</>}
                            </button>
                        </div>
                    )}

                    {/* OTP Code */}
                    {order.otp_code && (
                        <div className="w-full p-3 sm:p-4 rounded-2xl border border-[#FFB800]/30 bg-[rgba(255,184,0,0.04)] relative">
                            <div className="absolute -top-3 -right-3 w-7 h-7 rounded-full bg-gradient-to-tr from-orange-500 to-yellow-400 flex items-center justify-center text-white text-xs font-bold border-2 border-[#070D2E]">📩</div>
                            <p className="text-[10px] sm:text-xs text-white/40 mb-1 sm:mb-1.5 text-center">Verification Code</p>
                            <p className="text-2xl sm:text-3xl font-bold text-[#33CCFF] font-mono tracking-widest sm:tracking-[0.2em] text-center mb-2 sm:mb-3 drop-shadow-[0_0_15px_rgba(51,204,255,0.4)] break-all">{order.otp_code}</p>
                            <div className="flex justify-center">
                                <button onClick={() => copy(order.otp_code, setCopiedCode)}
                                    className="inline-flex items-center gap-2 px-4 sm:px-5 py-1.5 sm:py-2 rounded-xl bg-gradient-to-r from-[#0055CC] to-[#0077EE] text-white text-xs sm:text-sm font-bold hover:scale-[1.02] transition shadow-[0_0_15px_rgba(0,102,255,0.3)] border border-[#33CCFF]/20">
                                    {copiedCode ? <><Check className="w-4 h-4" />Copied!</> : <><Copy className="w-4 h-4" />Copy Code</>}
                                </button>
                            </div>
                        </div>
                    )}

                    {/* Cancelled / Expired notice */}
                    {['cancelled', 'expired'].includes(order.status) && !order.otp_code && (
                        <div className="w-full p-3 sm:p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-center">
                            <p className="text-xs sm:text-sm text-red-400 font-semibold">
                                {order.status === 'expired' ? 'Number expired — no SMS received. Wallet refunded.' : 'Order cancelled — wallet refunded.'}
                            </p>
                        </div>
                    )}

                    {/* Order info summary */}
                    <div className="w-full rounded-xl border border-white/10 bg-white/[0.03] overflow-hidden">
                        <div className="divide-y divide-white/[0.06]">
                            {[
                                { label: 'Status', value: <StatusBadge status={order.status} /> },
                                { label: 'Cost', value: <span className="text-xs sm:text-sm font-bold text-white">{formatNaira(order.cost)}</span> },
                                { label: 'Created', value: <span className="text-xs sm:text-sm text-white/60">{formatDate(order.created_at)}</span> },
                            ].map(row => (
                                <div key={row.label} className="flex items-center justify-between px-3 sm:px-4 py-2 sm:py-2.5">
                                    <span className="text-[10px] sm:text-xs text-white/40">{row.label}</span>
                                    {row.value}
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Cancel & Ban buttons for pending */}
                    {isPending && (
                        <div className="w-full flex gap-2">
                            <button onClick={handleCancel} disabled={cancelling || banning}
                                className="flex-1 flex items-center justify-center gap-1.5 sm:gap-2 py-2.5 sm:py-3 rounded-xl font-bold text-xs sm:text-sm bg-red-500/15 text-red-400 border border-red-500/30 hover:bg-red-500/25 hover:border-red-500/50 transition disabled:opacity-50">
                                {cancelling
                                    ? <><Loader2 className="w-3.5 h-3.5 sm:w-4 sm:h-4 animate-spin" />Cancelling…</>
                                    : <><XCircle className="w-3.5 h-3.5 sm:w-4 sm:h-4" />Cancel</>
                                }
                            </button>
                            <button onClick={handleBan} disabled={cancelling || banning}
                                className="flex-1 flex items-center justify-center gap-1.5 sm:gap-2 py-2.5 sm:py-3 rounded-xl font-bold text-xs sm:text-sm bg-orange-500/15 text-orange-400 border border-orange-500/30 hover:bg-orange-500/25 hover:border-orange-500/50 transition disabled:opacity-50">
                                {banning
                                    ? <><Loader2 className="w-3.5 h-3.5 sm:w-4 sm:h-4 animate-spin" />Banning…</>
                                    : <><Shield className="w-3.5 h-3.5 sm:w-4 sm:h-4" />Number Banned</>
                                }
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}

export default function PurchaseHistorySection({ formatNaira }) {
    const [orders, setOrders] = useState([])
    const [loading, setLoading] = useState(true)
    const [search, setSearch] = useState('')
    const [filter, setFilter] = useState('all')
    const [page, setPage] = useState(1)
    const [meta, setMeta] = useState({ last_page: 1, total: 0 })
    const [selectedOrder, setSelectedOrder] = useState(null)
    const debounce = useRef(null)

    // Background polling: sync all visible pending orders every 15s
    const bgPollRef = useRef(null)
    useEffect(() => {
        bgPollRef.current = setInterval(() => {
            setOrders(prev => {
                const pendingIds = prev.filter(o => o.status === 'pending').map(o => o.id)
                if (pendingIds.length === 0) return prev
                // Fire off individual polls to sync statuses
                pendingIds.forEach(id => {
                    api.get(`/api/orders/${id}`).then(res => {
                        setOrders(cur => cur.map(o => o.id === id ? { ...o, ...res.data } : o))
                    }).catch(() => { })
                })
                return prev
            })
        }, 15000)
        return () => clearInterval(bgPollRef.current)
    }, [])

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

    const handleOrderClick = (order) => { setSelectedOrder(order) }
    const handleOrderUpdate = (updated) => {
        setOrders(prev => prev.map(o => o.id === updated.id ? { ...o, ...updated } : o))
    }

    const rowClass = "border-t border-[rgba(255,255,255,0.05)] hover:bg-[rgba(51,204,255,0.04)] transition cursor-pointer"

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
                            {['Order', 'Service', 'Country', 'Phone Number', 'OTP Code', 'Cost', 'Status', 'Date', ''].map(h => (
                                <th key={h} className="px-4 py-3 text-[11px] font-bold text-white/35 uppercase tracking-wider">{h}</th>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        {loading ? (
                            <tr><td colSpan={9} className="text-center py-12 text-white/30 text-sm">Loading…</td></tr>
                        ) : orders.length === 0 ? (
                            <tr><td colSpan={9} className="text-center py-12 text-white/30 text-sm">No orders found.</td></tr>
                        ) : orders.map(order => (
                            <tr key={order.id} className={rowClass} onClick={() => handleOrderClick(order)}>
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
                                        : order.status === 'pending'
                                            ? <span className="text-amber-400/70 flex items-center gap-1"><Clock className="w-3 h-3 animate-pulse" />Waiting…</span>
                                            : <span className="text-white/25">—</span>
                                    }
                                </td>
                                <td className="px-4 py-3 text-sm font-semibold text-white/80">{formatNaira(order.cost)}</td>
                                <td className="px-4 py-3"><StatusBadge status={order.status} /></td>
                                <td className="px-4 py-3 text-xs text-white/35">{formatDate(order.created_at)}</td>
                                <td className="px-4 py-3">
                                    <ArrowRight className="w-4 h-4 text-white/20" />
                                </td>
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
                    <div key={order.id} onClick={() => handleOrderClick(order)}
                        className="p-4 rounded-xl border border-[rgba(255,255,255,0.08)] bg-[rgba(15,20,60,0.5)] cursor-pointer hover:border-[rgba(51,204,255,0.25)] hover:bg-[rgba(51,204,255,0.04)] transition active:scale-[0.99]">
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
                        {order.status === 'pending' && !order.otp_code && (
                            <div className="flex items-center gap-1.5 mb-2">
                                <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
                                <span className="text-xs text-amber-400">Waiting for SMS… Tap to view</span>
                            </div>
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

            {/* Order Detail Modal */}
            {selectedOrder && (
                <OrderDetailModal
                    order={selectedOrder}
                    formatNaira={formatNaira}
                    onClose={() => setSelectedOrder(null)}
                    onOrderUpdate={handleOrderUpdate}
                />
            )}
        </div>
    )
}
