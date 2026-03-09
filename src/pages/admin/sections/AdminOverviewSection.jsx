import { useState, useEffect } from 'react'
import {
    Users, ShoppingCart, Wallet, Server, TrendingUp, Clock,
    Gift, MessageSquare, UserX, ArrowUpRight
} from 'lucide-react'
import { ServiceIconWithFallback } from '../../../components/ServiceIcon'
import adminApi from '../../../lib/adminAxios'
import toast from 'react-hot-toast'

export default function AdminOverviewSection() {
    const [stats, setStats] = useState(null)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        adminApi.get('/api/admin/dashboard')
            .then(r => setStats(r.data))
            .catch(() => toast.error('Failed to load dashboard'))
            .finally(() => setLoading(false))
    }, [])

    const cards = [
        { label: 'Total Users', value: stats?.total_users ?? 0, icon: Users, color: '#FF9500' },
        { label: 'Suspended', value: stats?.suspended_users ?? 0, icon: UserX, color: '#FF3B30' },
        { label: 'Total Orders', value: stats?.total_orders ?? 0, icon: ShoppingCart, color: '#0099FF' },
        { label: 'Active Services', value: stats?.active_services ?? 0, icon: Server, color: '#34C759' },
        { label: 'Revenue', value: `₦${Number(stats?.total_revenue ?? 0).toLocaleString()}`, icon: TrendingUp, color: '#AF52DE' },
        { label: 'Pending Funds', value: stats?.pending_funds ?? 0, icon: Clock, color: '#FFD60A' },
        { label: 'Referrals', value: stats?.total_referrals ?? 0, icon: Gift, color: '#FF6B00' },
        { label: 'Open Tickets', value: stats?.open_tickets ?? 0, icon: MessageSquare, color: '#FF2D55' },
    ]

    if (loading) {
        return (
            <div className="space-y-6">
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                    {[...Array(8)].map((_, i) => (
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

    return (
        <div className="space-y-6">
            {/* Stat Cards */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
                {cards.map(card => (
                    <div key={card.label} className="rounded-2xl border border-[rgba(255,255,255,0.06)] bg-[rgba(15,20,60,0.5)] backdrop-blur-xl p-4 sm:p-5 relative overflow-hidden group hover:border-[rgba(255,149,0,0.2)] transition">
                        <div className="absolute top-0 right-0 w-20 h-20 rounded-full opacity-5 -translate-y-1/2 translate-x-1/2" style={{ background: card.color }} />
                        <card.icon className="w-5 h-5 mb-3" style={{ color: card.color }} />
                        <p className="text-xl sm:text-2xl font-bold text-white">{card.value}</p>
                        <p className="text-[10px] sm:text-xs text-white/40 mt-1">{card.label}</p>
                    </div>
                ))}
            </div>

            {/* Recent Activity */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                {/* Recent Orders */}
                <div className="rounded-2xl border border-[rgba(255,255,255,0.06)] bg-[rgba(15,20,60,0.5)] backdrop-blur-xl p-5 sm:p-6">
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="text-sm font-bold text-white/60">Recent Orders</h3>
                        <a href="/admin/orders" className="text-[10px] text-[#FF9500] hover:underline flex items-center gap-1">View all <ArrowUpRight className="w-3 h-3" /></a>
                    </div>
                    <div className="space-y-3">
                        {(stats?.recent_orders ?? []).length === 0 && <p className="text-xs text-white/30">No orders yet</p>}
                        {(stats?.recent_orders ?? []).map(order => (
                            <div key={order.id} className="flex items-center justify-between py-2 border-b border-white/5 last:border-0">
                                <div className="flex items-center gap-3 min-w-0">
                                    <ServiceIconWithFallback icon={order.service?.icon} name={order.service?.name} color={order.service?.color} size="md" />
                                    <div className="min-w-0">
                                        <p className="text-sm text-white truncate">{order.user?.name || 'N/A'}</p>
                                        <p className="text-xs text-white/30 truncate">{order.service?.name} · {order.phone_number || 'Pending'}</p>
                                    </div>
                                </div>
                                <span className={`text-xs px-2 py-1 rounded-lg font-medium flex-shrink-0 ${order.status === 'completed' ? 'bg-green-500/10 text-green-400' : order.status === 'pending' ? 'bg-yellow-500/10 text-yellow-400' : 'bg-red-500/10 text-red-400'}`}>
                                    {order.status}
                                </span>
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
                    <div className="space-y-3">
                        {(stats?.recent_users ?? []).length === 0 && <p className="text-xs text-white/30">No users yet</p>}
                        {(stats?.recent_users ?? []).map(u => (
                            <div key={u.id} className="flex items-center gap-3 py-2 border-b border-white/5 last:border-0">
                                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#FF9500] to-[#FF6B00] flex-shrink-0 flex items-center justify-center text-xs font-bold text-white">
                                    {u.name?.[0]?.toUpperCase() || 'U'}
                                </div>
                                <div className="min-w-0 flex-1">
                                    <div className="flex items-center gap-2">
                                        <p className="text-sm text-white truncate">{u.name}</p>
                                        {u.is_suspended && (
                                            <span className="text-[9px] px-1.5 py-0.5 rounded bg-red-500/10 text-red-400 font-bold">Suspended</span>
                                        )}
                                    </div>
                                    <p className="text-xs text-white/30 truncate">{u.email}</p>
                                </div>
                                <span className="text-xs text-white/20 flex-shrink-0">{new Date(u.created_at).toLocaleDateString()}</span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    )
}
