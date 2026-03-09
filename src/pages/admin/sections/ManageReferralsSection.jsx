import { useState, useEffect, useCallback } from 'react'
import { Search, ChevronLeft, ChevronRight, Loader2, Users, Gift, ArrowRight } from 'lucide-react'
import adminApi from '../../../lib/adminAxios'
import toast from 'react-hot-toast'

const StatusBadge = ({ credited_at }) => (
    <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold ${credited_at ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/20' : 'bg-yellow-500/15 text-yellow-400 border border-yellow-500/20'}`}>
        {credited_at ? 'Credited' : 'Pending'}
    </span>
)

export default function ManageReferralsSection() {
    const [referrals, setReferrals] = useState([])
    const [meta, setMeta] = useState({})
    const [page, setPage] = useState(1)
    const [search, setSearch] = useState('')
    const [loading, setLoading] = useState(true)
    const [stats, setStats] = useState(null)

    const loadReferrals = useCallback(() => {
        setLoading(true)
        adminApi.get('/api/admin/referrals', { params: { page, search, per_page: 15 } })
            .then(r => { setReferrals(r.data.data); setMeta(r.data) })
            .catch(() => toast.error('Failed to load referrals'))
            .finally(() => setLoading(false))
    }, [page, search])

    useEffect(() => { loadReferrals() }, [loadReferrals])

    useEffect(() => {
        adminApi.get('/api/admin/referrals/stats')
            .then(r => setStats(r.data))
            .catch(() => { })
    }, [])

    return (
        <div className="space-y-6">
            {/* Stats */}
            {stats && (
                <div className="grid grid-cols-3 gap-3">
                    {[
                        { label: 'Total Referrals', value: stats.total_referrals, color: '#FF9500' },
                        { label: 'Credited', value: stats.credited_referrals, color: '#34C759' },
                        { label: 'Pending', value: stats.pending_referrals, color: '#FFD60A' },
                    ].map(s => (
                        <div key={s.label} className="rounded-2xl border border-[rgba(255,255,255,0.06)] bg-[rgba(15,20,60,0.5)] backdrop-blur-xl p-4">
                            <p className="text-[10px] text-white/30 uppercase tracking-wider mb-1">{s.label}</p>
                            <p className="text-2xl font-bold" style={{ color: s.color }}>{s.value}</p>
                        </div>
                    ))}
                </div>
            )}

            {/* Search */}
            <div className="relative max-w-sm">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
                <input type="text" placeholder="Search referrer or referred..."
                    value={search} onChange={e => { setSearch(e.target.value); setPage(1) }}
                    className="w-full pl-9 pr-4 py-2.5 rounded-xl bg-white/[0.05] border border-white/10 text-sm text-white placeholder-white/25 focus:outline-none focus:border-[rgba(255,149,0,0.4)] transition" />
            </div>

            {/* Table */}
            <div className="rounded-2xl border border-[rgba(255,255,255,0.06)] bg-[rgba(15,20,60,0.5)] backdrop-blur-xl overflow-hidden">
                {loading ? (
                    <div className="p-12 text-center"><Loader2 className="w-6 h-6 text-[#FF9500] animate-spin mx-auto" /></div>
                ) : referrals.length === 0 ? (
                    <div className="p-12 text-center text-white/30 text-sm">No referrals found</div>
                ) : (
                    <>
                        {/* Desktop */}
                        <div className="hidden md:block overflow-x-auto">
                            <table className="w-full text-left">
                                <thead>
                                    <tr className="border-b border-white/5">
                                        <th className="px-5 py-3.5 text-xs text-white/30 font-medium">Referrer</th>
                                        <th className="px-5 py-3.5 text-xs text-white/30 font-medium"></th>
                                        <th className="px-5 py-3.5 text-xs text-white/30 font-medium">Referred User</th>
                                        <th className="px-5 py-3.5 text-xs text-white/30 font-medium">Status</th>
                                        <th className="px-5 py-3.5 text-xs text-white/30 font-medium">Date</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {referrals.map(ref => (
                                        <tr key={ref.id} className="border-b border-white/[0.03] hover:bg-white/[0.02] transition">
                                            <td className="px-5 py-3.5">
                                                <div className="flex items-center gap-2.5">
                                                    <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-[#FF9500] to-[#FF6B00] flex-shrink-0 flex items-center justify-center text-[10px] font-bold text-white">
                                                        {ref.referrer?.name?.[0]?.toUpperCase() || '?'}
                                                    </div>
                                                    <div className="min-w-0">
                                                        <p className="text-sm text-white truncate">{ref.referrer?.name || '—'}</p>
                                                        <p className="text-[10px] text-white/25 truncate">{ref.referrer?.email}</p>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-2 py-3.5"><ArrowRight className="w-4 h-4 text-white/15" /></td>
                                            <td className="px-5 py-3.5">
                                                <div className="flex items-center gap-2.5">
                                                    <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-blue-500 to-blue-600 flex-shrink-0 flex items-center justify-center text-[10px] font-bold text-white">
                                                        {ref.referred?.name?.[0]?.toUpperCase() || '?'}
                                                    </div>
                                                    <div className="min-w-0">
                                                        <p className="text-sm text-white truncate">{ref.referred?.name || '—'}</p>
                                                        <p className="text-[10px] text-white/25 truncate">{ref.referred?.email}</p>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-5 py-3.5"><StatusBadge credited_at={ref.credited_at} /></td>
                                            <td className="px-5 py-3.5 text-xs text-white/20">{new Date(ref.created_at).toLocaleDateString()}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>

                        {/* Mobile */}
                        <div className="md:hidden divide-y divide-white/5">
                            {referrals.map(ref => (
                                <div key={ref.id} className="p-4">
                                    <div className="flex items-center gap-2 mb-2">
                                        <div className="flex items-center gap-2 min-w-0 flex-1">
                                            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#FF9500] to-[#FF6B00] flex-shrink-0 flex items-center justify-center text-xs font-bold text-white">
                                                {ref.referrer?.name?.[0]?.toUpperCase() || '?'}
                                            </div>
                                            <div className="min-w-0">
                                                <p className="text-sm text-white font-medium truncate">{ref.referrer?.name}</p>
                                                <p className="text-[10px] text-white/25 truncate">{ref.referrer?.email}</p>
                                            </div>
                                        </div>
                                        <ArrowRight className="w-4 h-4 text-white/15 flex-shrink-0" />
                                        <div className="flex items-center gap-2 min-w-0 flex-1">
                                            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 to-blue-600 flex-shrink-0 flex items-center justify-center text-xs font-bold text-white">
                                                {ref.referred?.name?.[0]?.toUpperCase() || '?'}
                                            </div>
                                            <div className="min-w-0">
                                                <p className="text-sm text-white font-medium truncate">{ref.referred?.name}</p>
                                                <p className="text-[10px] text-white/25 truncate">{ref.referred?.email}</p>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="flex items-center justify-between mt-2">
                                        <StatusBadge credited_at={ref.credited_at} />
                                        <span className="text-[10px] text-white/20">{new Date(ref.created_at).toLocaleDateString()}</span>
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
