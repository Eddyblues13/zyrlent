import { useState, useEffect, useRef, useCallback } from 'react'
import { Plus, Eye, EyeOff, FileText, CheckCircle2, ArrowRight, Search, ChevronDown, ArrowUpRight, Zap, Shield, Globe, X, Loader2, Copy, Check, Smartphone, AlertCircle, Timer, Users, RotateCcw } from 'lucide-react'
import api from '../../../lib/axios'
import { ServiceIconWithFallback } from '../../../components/ServiceIcon'
import toast from 'react-hot-toast'
import { RentNumberModal } from './RentNumberSection'

// ─── Overview Section ─────────────────────────────────────────
// Searchable Dropdown Removed
export default function OverviewSection({ user, wallet, stats, formatNaira, onNavigate, onWalletUpdate }) {
    const [showBalance, setShowBalance] = useState(true)
    const [recentOrders, setRecentOrders] = useState([])
    const [loadingOrders, setLoadingOrders] = useState(true)

    useEffect(() => {
        const fetchOrders = async () => {
            try {
                const res = await api.get('/api/orders', { params: { per_page: 3 } })
                setRecentOrders(res.data.data || [])
            } catch (e) {
                console.error('Failed to load recent orders', e)
            } finally {
                setLoadingOrders(false)
            }
        }
        fetchOrders()
    }, [])

    const timeAgo = (dateStr) => {
        const date = new Date(dateStr)
        if (isNaN(date)) return 'Just now'
        const diff = Math.floor((new Date() - date) / 1000)
        if (diff < 60) return `${diff < 0 ? 0 : diff} sec ago`
        if (diff < 3600) return `${Math.floor(diff/60)} min ago`
        if (diff < 86400) return `${Math.floor(diff/3600)} hr ago`
        return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
    }

    return (
        <div className="flex flex-col gap-8">
            {/* Sticky greeting */}
            <div className="sticky top-[61px] z-30 bg-[rgba(8,10,46,0.97)] backdrop-blur-xl -mx-4 sm:-mx-6 lg:-mx-8 px-4 sm:px-6 lg:px-8 pt-4 pb-4 border-b border-white/[0.05]">
                <h2 className="text-2xl lg:text-3xl font-bold flex items-center gap-2">
                    <span role="img" aria-label="wave">👋</span> Hi, {user?.name?.split(' ')[0]}
                </h2>
                <p className="text-white/50 mt-1 text-sm">Ready to verify some numbers today?</p>
            </div>

            {/* Main Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

                {/* Wallet Card */}
                <div className="lg:col-span-1 relative rounded-2xl bg-gradient-to-br from-[rgba(15,20,60,0.9)] to-[rgba(10,11,61,0.98)] border border-[rgba(0,255,255,0.2)] p-6 overflow-hidden">
                    <div className="absolute -top-8 -right-8 w-28 h-28 bg-[#00FFFF]/15 blur-3xl rounded-full" />
                    <div className="absolute bottom-0 left-0 w-24 h-24 bg-[#0099FF]/10 blur-3xl rounded-full" />
                    <div className="relative z-10">
                        <div className="flex items-center justify-between mb-1">
                            <p className="text-sm font-medium text-white/60">Wallet Balance</p>
                            <button
                                onClick={() => setShowBalance(b => !b)}
                                className="text-white/40 hover:text-white transition"
                            >
                                {showBalance ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                            </button>
                        </div>
                        <h1 className="text-3xl lg:text-4xl font-bold mb-5 tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-white to-[#00FFFF]">
                            {showBalance ? formatNaira(wallet) : '₦ ••••••'}
                        </h1>
                        <button
                            onClick={() => onNavigate('fund-wallet')}
                            className="w-full py-3 rounded-xl bg-gradient-to-r from-[#33CCFF] to-[#0066CC] text-white font-bold text-sm shadow-[0_0_15px_rgba(0,255,255,0.25)] hover:shadow-[0_0_22px_rgba(0,255,255,0.45)] hover:scale-[1.02] transition-all flex items-center justify-center gap-2"
                        >
                            <Plus className="w-4 h-4" />
                            Fund Wallet
                        </button>
                        <div className="mt-4 pt-4 border-t border-white/10 flex items-center justify-between text-xs text-white/40">
                            <span>Last updated just now</span>
                            <span className="text-[#00FFFF] flex items-center gap-1 cursor-pointer hover:underline" onClick={() => onNavigate('transactions')}>
                                View history <ArrowUpRight className="w-3 h-3" />
                            </span>
                        </div>
                    </div>
                </div>

                {/* Stats Cards */}
                <div className="lg:col-span-2 grid grid-cols-2 gap-4">
                    {[
                        { icon: FileText, label: 'Transactions', value: stats.transactions, color: '#00FFFF', bg: 'rgba(0,255,255,0.08)' },
                        { icon: CheckCircle2, label: 'Verifications', value: stats.verifications, color: '#33CCFF', bg: 'rgba(51,204,255,0.08)' },
                        { icon: null, label: 'Total Spent', value: formatNaira(stats.total_spent), color: '#0099FF', bg: 'rgba(0,153,255,0.08)', naira: true },
                        { icon: null, label: 'Pending SMS', value: stats.pending_sms, color: '#00FFFF', bg: 'rgba(0,255,255,0.06)', spin: true },
                    ].map((stat, i) => (
                        <div
                            key={i}
                            className="rounded-xl border border-[rgba(255,255,255,0.08)] bg-[rgba(15,20,60,0.5)] p-4 transition-all"
                        >
                            <div className="w-9 h-9 rounded-lg flex items-center justify-center mb-3" style={{ background: stat.bg }}>
                                {stat.spin
                                    ? <span className="text-base" style={{ color: stat.color }}>↻</span>
                                    : stat.naira
                                        ? <span className="text-base font-bold" style={{ color: stat.color }}>₦</span>
                                        : <stat.icon className="w-4 h-4" style={{ color: stat.color }} />
                                }
                            </div>
                            <p className="text-[11px] font-semibold text-white/40 uppercase tracking-wider mb-1">{stat.label}</p>
                            <h4 className="text-xl font-bold text-white truncate">{stat.value}</h4>
                        </div>
                    ))}
                </div>
            </div>

            {/* ────────────────────────────────────────────────────
                 Quick Verify — Complete Inline Rental Flow
                 ──────────────────────────────────────────────────── */}
            <RentNumberModal 
                wallet={wallet}
                formatNaira={formatNaira}
                onClose={() => {}}
                onSuccess={(b) => {
                    onWalletUpdate(b)
                    // Refresh recent orders when a new one is successfully placed
                    api.get('/api/orders', { params: { per_page: 3 } }).then(res => setRecentOrders(res.data.data || []))
                }}
                inline={true}
            />

            {/* Live Verification & Recent Orders Section */}
            <div className="flex flex-col gap-6 w-full -mt-2">
                
                {/* Live Verification Activity */}
                <div className="rounded-xl border border-[rgba(255,255,255,0.08)] bg-gradient-to-b from-[rgba(15,20,60,0.7)] to-[rgba(10,11,61,0.95)] overflow-hidden">
                    <div className="px-4 py-3 border-b border-white/[0.05] flex items-center gap-2">
                        <div className="w-2.5 h-2.5 rounded-full bg-orange-500 animate-pulse"></div>
                        <h4 className="text-sm font-bold text-white">Live Verification Activity</h4>
                    </div>
                    <div className="flex flex-col divide-y divide-white/[0.05]">
                        {[
                            { flag: '🇺🇸', name: '+1 USA', service: 'WhatsApp', time: '5 sec ago' },
                            { flag: '🇬🇧', name: '+44 UK', service: 'Telegram', time: '9 sec ago' },
                            { flag: '🇩🇪', name: '+49 Germany', service: 'Google', time: '14 sec ago' },
                        ].map((item, i) => (
                            <div key={i} className="flex items-center justify-between px-4 py-2.5 hover:bg-white/[0.02] transition-colors group">
                                <div className="flex items-center gap-3">
                                    <span className="text-lg leading-none">{item.flag}</span>
                                    <div className="flex items-center gap-2.5">
                                        <span className="text-xs font-semibold text-white/90">{item.name}</span>
                                        <span className="text-[11px] text-white/50">{item.service}</span>
                                        <CheckCircle2 className="w-3 h-3 text-emerald-400 opacity-80" />
                                    </div>
                                </div>
                                <div className="flex items-center gap-1.5 text-emerald-400 text-[10px] font-medium bg-emerald-500/10 px-2 py-1 rounded-full border border-emerald-500/20">
                                    <CheckCircle2 className="w-2.5 h-2.5" /> {item.time}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Your Recent Orders */}
                <div className="rounded-xl border border-[rgba(255,255,255,0.08)] bg-gradient-to-b from-[rgba(15,20,60,0.7)] to-[rgba(10,11,61,0.95)] overflow-hidden">
                    <div className="px-4 py-3 border-b border-white/[0.05] flex items-center justify-between">
                        <h4 className="text-sm font-bold text-white">Your Recent Orders</h4>
                        <button onClick={() => onNavigate('transactions')} className="text-xs font-semibold text-[#00FFFF] hover:underline">
                            View All
                        </button>
                    </div>
                    
                    {loadingOrders ? (
                        <div className="py-8 flex justify-center"><Loader2 className="w-5 h-5 text-[#00FFFF] animate-spin" /></div>
                    ) : recentOrders.length === 0 ? (
                        <div className="py-8 text-center text-xs text-white/40">No recent orders found.</div>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="w-full border-collapse">
                                <thead>
                                    <tr className="bg-[rgba(255,255,255,0.02)] text-left">
                                        {['Service', 'Number', 'Status', 'SMS', 'Time'].map((h, i) => (
                                            <th key={h} className={`px-4 py-2 text-[10px] font-bold text-white/40 uppercase tracking-wider ${i === 1 ? 'min-w-[110px]' : ''}`}>{h}</th>
                                        ))}
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-white/[0.05]">
                                    {recentOrders.map(order => (
                                        <tr key={order.id} className="hover:bg-white/[0.02] transition-colors">
                                            <td className="px-4 py-2.5">
                                                <span className="flex items-center gap-1.5 text-xs font-semibold text-white/90">
                                                    <span className="w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ background: order.service?.color || '#00FFFF' }} />
                                                    {order.service?.name}
                                                </span>
                                            </td>
                                            <td className="px-4 py-2.5 text-xs font-mono text-[#00FFFF]">{order.phone_number || '—'}</td>
                                            <td className="px-4 py-2.5">
                                                <span className={`inline-flex px-1.5 py-0.5 rounded text-[9px] font-bold uppercase tracking-wider border ${
                                                    order.status === 'completed' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' :
                                                    order.status === 'pending' ? 'bg-amber-400/10 text-amber-400 border-amber-400/20' :
                                                    'bg-white/5 text-white/40 border-white/10'
                                                }`}>
                                                    {order.status}
                                                </span>
                                            </td>
                                            <td className="px-4 py-2.5 text-xs max-w-[120px] truncate">
                                                {order.otp_code 
                                                    ? <span className="text-emerald-400 font-mono font-semibold" title={order.otp_code}>{order.otp_code}</span> 
                                                    : <span className="text-white/25 text-[10px] italic">Waiting…</span>
                                                }
                                            </td>
                                            <td className="px-4 py-2.5 text-[10px] font-medium text-white/40 whitespace-nowrap">{timeAgo(order.created_at)}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>
            </div>

        </div>
    )
}
