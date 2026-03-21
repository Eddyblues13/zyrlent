import { useState, useEffect } from 'react'
import {
    Users, ShoppingCart, TrendingUp, Clock, UserCheck, Activity,
    AlertTriangle, MessageSquare, Phone, Globe, Zap, DollarSign,
    ArrowUpRight, BarChart3, CheckCircle, XCircle
} from 'lucide-react'
import {
    AreaChart, Area, BarChart, Bar, XAxis, YAxis, Tooltip,
    ResponsiveContainer, CartesianGrid
} from 'recharts'
import { ServiceIconWithFallback } from '../../../components/ServiceIcon'
import adminApi from '../../../lib/adminAxios'
import toast from 'react-hot-toast'

/* ── helpers ── */
const fmt = (n) => Number(n ?? 0).toLocaleString()
const fmtMoney = (n) => `₦${fmt(n)}`

/* ── reusable stat card ── */
const StatCard = ({ label, value, icon: Icon, color }) => (
    <div className="rounded-2xl border border-[rgba(255,255,255,0.06)] bg-[rgba(15,20,60,0.5)] backdrop-blur-xl p-4 sm:p-5 relative overflow-hidden group hover:border-[rgba(255,149,0,0.15)] transition">
        <div className="absolute top-0 right-0 w-24 h-24 rounded-full opacity-[0.04] -translate-y-1/2 translate-x-1/2" style={{ background: color }} />
        <Icon className="w-5 h-5 mb-2.5" style={{ color }} />
        <p className="text-xl sm:text-2xl font-bold text-white leading-none">{value}</p>
        <p className="text-[10px] sm:text-xs text-white/40 mt-1.5 font-medium">{label}</p>
    </div>
)

/* ── chart tooltip ── */
const ChartTooltip = ({ active, payload, label }) => {
    if (!active || !payload?.length) return null
    return (
        <div className="bg-[rgba(15,20,60,0.95)] border border-white/10 rounded-xl px-3 py-2 shadow-xl backdrop-blur-xl">
            <p className="text-[10px] text-white/40 mb-1">{label}</p>
            {payload.map((p, i) => (
                <p key={i} className="text-xs font-bold" style={{ color: p.color }}>
                    {p.name}: {p.name === 'revenue' ? fmtMoney(p.value) : p.value}
                </p>
            ))}
        </div>
    )
}

export default function AdminOverviewSection() {
    const [stats, setStats] = useState(null)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        adminApi.get('/api/admin/dashboard')
            .then(r => setStats(r.data))
            .catch(() => toast.error('Failed to load dashboard'))
            .finally(() => setLoading(false))
    }, [])

    /* ── loading skeleton ── */
    if (loading) {
        return (
            <div className="space-y-6">
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
                    {[...Array(10)].map((_, i) => (
                        <div key={i} className="h-28 rounded-2xl bg-white/[0.03] animate-pulse" />
                    ))}
                </div>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                    <div className="h-72 rounded-2xl bg-white/[0.03] animate-pulse" />
                    <div className="h-72 rounded-2xl bg-white/[0.03] animate-pulse" />
                </div>
            </div>
        )
    }

    /* ── stat cards config ── */
    const statCards = [
        { label: 'Total Users', value: fmt(stats?.total_users), icon: Users, color: '#FF9500' },
        { label: 'Active Today', value: fmt(stats?.active_users_today), icon: UserCheck, color: '#34C759' },
        { label: 'Total Activations', value: fmt(stats?.total_activations), icon: ShoppingCart, color: '#0099FF' },
        { label: 'Activations Today', value: fmt(stats?.activations_today), icon: Zap, color: '#5AC8FA' },
        { label: 'Success Rate', value: `${stats?.success_rate ?? 0}%`, icon: CheckCircle, color: '#30D158' },
        { label: 'Failed Activations', value: fmt(stats?.failed_activations), icon: XCircle, color: '#FF3B30' },
        { label: 'SMS Received Today', value: fmt(stats?.sms_received_today), icon: MessageSquare, color: '#AF52DE' },
        { label: 'Available Numbers', value: fmt(stats?.available_numbers), icon: Phone, color: '#FF6B00' },
        { label: 'Revenue Today', value: fmtMoney(stats?.revenue_today), icon: DollarSign, color: '#FFD60A' },
        { label: 'Revenue This Month', value: fmtMoney(stats?.revenue_this_month), icon: TrendingUp, color: '#34C759' },
    ]

    return (
        <div className="space-y-6">

            {/* ═══ Stat Cards Grid ═══ */}
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
                {statCards.map(card => <StatCard key={card.label} {...card} />)}
            </div>

            {/* ═══ Charts Row ═══ */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">

                {/* SMS Activation Chart */}
                <div className="rounded-2xl border border-[rgba(255,255,255,0.06)] bg-[rgba(15,20,60,0.5)] backdrop-blur-xl p-5 sm:p-6">
                    <div className="flex items-center justify-between mb-5">
                        <div className="flex items-center gap-2">
                            <BarChart3 className="w-4 h-4 text-[#0099FF]" />
                            <h3 className="text-sm font-bold text-white/70">SMS Activations (7 days)</h3>
                        </div>
                        <div className="flex items-center gap-3 text-[10px]">
                            <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-[#34C759]" /> Completed</span>
                            <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-[#FF3B30]" /> Failed</span>
                        </div>
                    </div>
                    <ResponsiveContainer width="100%" height={220}>
                        <BarChart data={stats?.activation_chart ?? []} barGap={2}>
                            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" />
                            <XAxis dataKey="date" tick={{ fontSize: 10, fill: 'rgba(255,255,255,0.3)' }} axisLine={false} tickLine={false} />
                            <YAxis tick={{ fontSize: 10, fill: 'rgba(255,255,255,0.2)' }} axisLine={false} tickLine={false} width={30} />
                            <Tooltip content={<ChartTooltip />} />
                            <Bar dataKey="completed" name="completed" fill="#34C759" radius={[4, 4, 0, 0]} />
                            <Bar dataKey="failed" name="failed" fill="#FF3B30" radius={[4, 4, 0, 0]} />
                        </BarChart>
                    </ResponsiveContainer>
                </div>

                {/* Revenue Chart */}
                <div className="rounded-2xl border border-[rgba(255,255,255,0.06)] bg-[rgba(15,20,60,0.5)] backdrop-blur-xl p-5 sm:p-6">
                    <div className="flex items-center justify-between mb-5">
                        <div className="flex items-center gap-2">
                            <TrendingUp className="w-4 h-4 text-[#FFD60A]" />
                            <h3 className="text-sm font-bold text-white/70">Revenue (7 days)</h3>
                        </div>
                        <span className="text-xs text-white/30">Total: {fmtMoney(stats?.total_revenue)}</span>
                    </div>
                    <ResponsiveContainer width="100%" height={220}>
                        <AreaChart data={stats?.revenue_chart ?? []}>
                            <defs>
                                <linearGradient id="revenueGrad" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="0%" stopColor="#FFD60A" stopOpacity={0.3} />
                                    <stop offset="100%" stopColor="#FFD60A" stopOpacity={0} />
                                </linearGradient>
                            </defs>
                            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" />
                            <XAxis dataKey="date" tick={{ fontSize: 10, fill: 'rgba(255,255,255,0.3)' }} axisLine={false} tickLine={false} />
                            <YAxis tick={{ fontSize: 10, fill: 'rgba(255,255,255,0.2)' }} axisLine={false} tickLine={false} width={40} tickFormatter={v => `₦${(v / 1000).toFixed(0)}k`} />
                            <Tooltip content={<ChartTooltip />} />
                            <Area type="monotone" dataKey="revenue" name="revenue" stroke="#FFD60A" fill="url(#revenueGrad)" strokeWidth={2} />
                        </AreaChart>
                    </ResponsiveContainer>
                </div>
            </div>

            {/* ═══ Top Countries & Top Services ═══ */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">

                {/* Top Countries */}
                <div className="rounded-2xl border border-[rgba(255,255,255,0.06)] bg-[rgba(15,20,60,0.5)] backdrop-blur-xl p-5 sm:p-6">
                    <div className="flex items-center gap-2 mb-4">
                        <Globe className="w-4 h-4 text-[#5AC8FA]" />
                        <h3 className="text-sm font-bold text-white/70">Top Countries</h3>
                    </div>
                    {(stats?.top_countries ?? []).length === 0 ? (
                        <p className="text-xs text-white/25 py-6 text-center">No data yet</p>
                    ) : (
                        <div className="space-y-3">
                            {(stats?.top_countries ?? []).map((c) => {
                                const maxOrders = stats.top_countries[0]?.orders || 1
                                const pct = Math.round((c.orders / maxOrders) * 100)
                                return (
                                    <div key={c.id}>
                                        <div className="flex items-center justify-between mb-1">
                                            <div className="flex items-center gap-2">
                                                <span className="text-sm">{c.flag}</span>
                                                <span className="text-xs text-white/70 font-medium">{c.name}</span>
                                            </div>
                                            <span className="text-xs text-white/40 font-mono">{fmt(c.orders)} orders</span>
                                        </div>
                                        <div className="h-1.5 rounded-full bg-white/[0.06] overflow-hidden">
                                            <div className="h-full rounded-full bg-gradient-to-r from-[#5AC8FA] to-[#0099FF] transition-all duration-500" style={{ width: `${pct}%` }} />
                                        </div>
                                    </div>
                                )
                            })}
                        </div>
                    )}
                </div>

                {/* Top Services */}
                <div className="rounded-2xl border border-[rgba(255,255,255,0.06)] bg-[rgba(15,20,60,0.5)] backdrop-blur-xl p-5 sm:p-6">
                    <div className="flex items-center gap-2 mb-4">
                        <Activity className="w-4 h-4 text-[#FF9500]" />
                        <h3 className="text-sm font-bold text-white/70">Top Services</h3>
                    </div>
                    {(stats?.top_services ?? []).length === 0 ? (
                        <p className="text-xs text-white/25 py-6 text-center">No data yet</p>
                    ) : (
                        <div className="space-y-3">
                            {(stats?.top_services ?? []).map((s) => {
                                const maxOrders = stats.top_services[0]?.orders || 1
                                const pct = Math.round((s.orders / maxOrders) * 100)
                                return (
                                    <div key={s.id}>
                                        <div className="flex items-center justify-between mb-1">
                                            <div className="flex items-center gap-2">
                                                <ServiceIconWithFallback icon={s.icon} name={s.name} color={s.color} size="sm" />
                                                <span className="text-xs text-white/70 font-medium">{s.name}</span>
                                            </div>
                                            <span className="text-xs text-white/40 font-mono">{fmt(s.orders)} orders</span>
                                        </div>
                                        <div className="h-1.5 rounded-full bg-white/[0.06] overflow-hidden">
                                            <div className="h-full rounded-full transition-all duration-500" style={{ width: `${pct}%`, background: s.color || '#FF9500' }} />
                                        </div>
                                    </div>
                                )
                            })}
                        </div>
                    )}
                </div>
            </div>

            {/* ═══ Recent Activity ═══ */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">

                {/* Recent Orders */}
                <div className="rounded-2xl border border-[rgba(255,255,255,0.06)] bg-[rgba(15,20,60,0.5)] backdrop-blur-xl p-5 sm:p-6">
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="text-sm font-bold text-white/60">Recent Activations</h3>
                        <a href="/admin/orders" className="text-[10px] text-[#FF9500] hover:underline flex items-center gap-1">View all <ArrowUpRight className="w-3 h-3" /></a>
                    </div>
                    <div className="space-y-2.5">
                        {(stats?.recent_orders ?? []).length === 0 && <p className="text-xs text-white/25 py-4 text-center">No activations yet</p>}
                        {(stats?.recent_orders ?? []).map(order => (
                            <div key={order.id} className="flex items-center justify-between py-2.5 border-b border-white/5 last:border-0">
                                <div className="flex items-center gap-3 min-w-0">
                                    <ServiceIconWithFallback icon={order.service?.icon} name={order.service?.name} color={order.service?.color} size="md" />
                                    <div className="min-w-0">
                                        <p className="text-sm text-white truncate">{order.user?.name || 'N/A'}</p>
                                        <div className="flex items-center gap-1.5 text-[10px] text-white/30">
                                            <span>{order.service?.name}</span>
                                            {order.country?.flag && <span>· {order.country.flag}</span>}
                                            {order.phone_number && <span className="font-mono">· {order.phone_number}</span>}
                                        </div>
                                    </div>
                                </div>
                                <div className="flex flex-col items-end gap-1 flex-shrink-0">
                                    <span className={`text-[10px] px-2 py-0.5 rounded-lg font-bold ${order.status === 'completed' ? 'bg-green-500/10 text-green-400' :
                                        order.status === 'pending' ? 'bg-yellow-500/10 text-yellow-400' :
                                            order.status === 'waiting' ? 'bg-blue-500/10 text-blue-400' :
                                                'bg-red-500/10 text-red-400'}`}>
                                        {order.status}
                                    </span>
                                    <span className="text-[9px] text-white/20">{new Date(order.created_at).toLocaleString()}</span>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Recent Users */}
                <div className="rounded-2xl border border-[rgba(255,255,255,0.06)] bg-[rgba(15,20,60,0.5)] backdrop-blur-xl p-5 sm:p-6">
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="text-sm font-bold text-white/60">Recent Users</h3>
                        <a href="/admin/users" className="text-[10px] text-[#FF9500] hover:underline flex items-center gap-1">View all <ArrowUpRight className="w-3 h-3" /></a>
                    </div>
                    <div className="space-y-2.5">
                        {(stats?.recent_users ?? []).length === 0 && <p className="text-xs text-white/25 py-4 text-center">No users yet</p>}
                        {(stats?.recent_users ?? []).map(u => (
                            <div key={u.id} className="flex items-center gap-3 py-2.5 border-b border-white/5 last:border-0">
                                <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#FF9500] to-[#FF6B00] flex-shrink-0 flex items-center justify-center text-xs font-bold text-white">
                                    {u.name?.[0]?.toUpperCase() || 'U'}
                                </div>
                                <div className="min-w-0 flex-1">
                                    <div className="flex items-center gap-2">
                                        <p className="text-sm text-white truncate font-medium">{u.name}</p>
                                        {u.is_suspended && (
                                            <span className="text-[8px] px-1.5 py-0.5 rounded bg-red-500/10 text-red-400 font-bold">Suspended</span>
                                        )}
                                    </div>
                                    <p className="text-[11px] text-white/30 truncate">{u.email}</p>
                                </div>
                                <span className="text-[10px] text-white/20 flex-shrink-0">{new Date(u.created_at).toLocaleDateString()}</span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* ═══ Activation Status Breakdown ═══ */}
            <div className="rounded-2xl border border-[rgba(255,255,255,0.06)] bg-[rgba(15,20,60,0.5)] backdrop-blur-xl p-5 sm:p-6">
                <div className="flex items-center gap-2 mb-5">
                    <Activity className="w-4 h-4 text-[#AF52DE]" />
                    <h3 className="text-sm font-bold text-white/70">Activation Status Breakdown</h3>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
                    {[
                        { label: 'Pending', value: stats?.pending_activations, color: '#FFD60A', icon: Clock },
                        { label: 'Waiting for SMS', value: stats?.waiting_for_sms, color: '#5AC8FA', icon: MessageSquare },
                        { label: 'Completed', value: stats?.completed_activations, color: '#34C759', icon: CheckCircle },
                        { label: 'Cancelled', value: stats?.cancelled_activations, color: '#FF9500', icon: XCircle },
                        { label: 'Expired', value: stats?.expired_activations, color: '#FF6B00', icon: AlertTriangle },
                        { label: 'Failed', value: stats?.failed_activations, color: '#FF3B30', icon: XCircle },
                    ].map(item => (
                        <div key={item.label} className="text-center p-3 rounded-xl bg-white/[0.03] border border-white/5">
                            <item.icon className="w-4 h-4 mx-auto mb-2" style={{ color: item.color }} />
                            <p className="text-lg font-bold text-white">{fmt(item.value)}</p>
                            <p className="text-[9px] text-white/35 mt-0.5 font-medium">{item.label}</p>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    )
}
