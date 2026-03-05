import { useState, useEffect, useRef } from 'react'
import { Search, Filter, ArrowUpRight, ArrowDownLeft, ChevronLeft, ChevronRight, RefreshCw } from 'lucide-react'
import api from '../../../lib/axios'
import toast from 'react-hot-toast'

const STATUSES = ['all', 'credit', 'debit']

function StatusBadge({ type }) {
    const styles = {
        credit: 'bg-emerald-500/15 text-emerald-400 border-emerald-500/25',
        debit: 'bg-red-400/15 text-red-400 border-red-400/25',
    }
    return (
        <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold border ${styles[type] || 'bg-white/10 text-white/60 border-white/10'}`}>
            {type === 'credit' ? <ArrowDownLeft className="w-3 h-3" /> : <ArrowUpRight className="w-3 h-3" />}
            {type}
        </span>
    )
}

function formatDate(dateStr) {
    return new Date(dateStr).toLocaleDateString('en-NG', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' })
}

export default function TransactionsSection({ formatNaira }) {
    const [txns, setTxns] = useState([])
    const [loading, setLoading] = useState(true)
    const [search, setSearch] = useState('')
    const [filter, setFilter] = useState('all')
    const [page, setPage] = useState(1)
    const [meta, setMeta] = useState({ last_page: 1, total: 0 })

    const fetchDebounce = useRef(null)

    const fetchTxns = async (p = 1, q = search, t = filter) => {
        setLoading(true)
        try {
            const params = { page: p, per_page: 10 }
            if (q) params.search = q
            if (t !== 'all') params.type = t
            const res = await api.get('/api/wallet/transactions', { params })
            setTxns(res.data.data || [])
            setMeta({ last_page: res.data.last_page || 1, total: res.data.total || 0 })
        } catch (e) {
            toast.error(e.response?.data?.message || 'Failed to load transactions')
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => { fetchTxns(1) }, [])

    const handleSearch = (val) => {
        setSearch(val)
        setPage(1)
        clearTimeout(fetchDebounce.current)
        fetchDebounce.current = setTimeout(() => fetchTxns(1, val, filter), 400)
    }

    const handleFilter = (val) => {
        setFilter(val)
        setPage(1)
        fetchTxns(1, search, val)
    }

    const handlePage = (p) => {
        setPage(p)
        fetchTxns(p)
    }

    return (
        <div className="flex flex-col gap-5">
            {/* Header */}
            <div className="flex items-center justify-between gap-3 flex-wrap">
                <div>
                    <h2 className="text-xl font-bold text-white">Transactions</h2>
                    <p className="text-white/40 text-xs mt-0.5">{meta.total} total records</p>
                </div>
                <button onClick={() => fetchTxns(page)} className="p-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/8 text-white/50 hover:text-white transition">
                    <RefreshCw className="w-4 h-4" />
                </button>
            </div>

            {/* Filters */}
            <div className="flex flex-col sm:flex-row gap-3">
                <div className="relative flex-1">
                    <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
                    <input
                        type="text"
                        placeholder="Search reference or description…"
                        value={search}
                        onChange={e => handleSearch(e.target.value)}
                        className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-[rgba(255,255,255,0.05)] border border-[rgba(255,255,255,0.1)] text-white placeholder-white/25 text-sm focus:outline-none focus:border-[rgba(0,255,255,0.35)] transition"
                    />
                </div>
                <div className="flex gap-1 p-1 rounded-xl bg-[rgba(255,255,255,0.04)] border border-[rgba(255,255,255,0.07)]">
                    {STATUSES.map(s => (
                        <button key={s} onClick={() => handleFilter(s)}
                            className={`px-4 py-1.5 rounded-lg text-xs font-bold capitalize transition ${filter === s ? 'bg-[rgba(0,255,255,0.15)] text-[#00FFFF]' : 'text-white/45 hover:text-white'}`}>
                            {s}
                        </button>
                    ))}
                </div>
            </div>

            {/* Desktop Table */}
            <div className="hidden md:block rounded-xl overflow-hidden border border-[rgba(255,255,255,0.08)]">
                <table className="w-full border-collapse">
                    <thead>
                        <tr className="bg-[rgba(255,255,255,0.04)] text-left">
                            {['Reference', 'Description', 'Type', 'Amount', 'Balance After', 'Date'].map(h => (
                                <th key={h} className="px-4 py-3 text-[11px] font-bold text-white/35 uppercase tracking-wider">{h}</th>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        {loading ? (
                            <tr><td colSpan={6} className="text-center py-12 text-white/30 text-sm">Loading…</td></tr>
                        ) : txns.length === 0 ? (
                            <tr><td colSpan={6} className="text-center py-12 text-white/30 text-sm">No transactions found.</td></tr>
                        ) : txns.map(tx => (
                            <tr key={tx.id} className="border-t border-[rgba(255,255,255,0.05)] hover:bg-white/3 transition">
                                <td className="px-4 py-3.5 text-xs font-mono text-white/60">{tx.reference}</td>
                                <td className="px-4 py-3.5 text-sm text-white/75 max-w-[200px] truncate">{tx.description}</td>
                                <td className="px-4 py-3.5"><StatusBadge type={tx.type} /></td>
                                <td className="px-4 py-3.5 font-bold text-sm">
                                    <span className={tx.type === 'credit' ? 'text-emerald-400' : 'text-red-400'}>
                                        {tx.type === 'credit' ? '+' : '-'}{formatNaira(tx.amount)}
                                    </span>
                                </td>
                                <td className="px-4 py-3.5 text-sm text-white/60">{formatNaira(tx.balance_after)}</td>
                                <td className="px-4 py-3.5 text-xs text-white/40">{formatDate(tx.created_at)}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Mobile Cards */}
            <div className="flex flex-col gap-3 md:hidden">
                {loading ? (
                    <div className="text-center py-12 text-white/30 text-sm">Loading…</div>
                ) : txns.length === 0 ? (
                    <div className="text-center py-12 text-white/30 text-sm">No transactions found.</div>
                ) : txns.map(tx => (
                    <div key={tx.id} className="p-4 rounded-xl border border-[rgba(255,255,255,0.08)] bg-[rgba(15,20,60,0.5)] flex items-center gap-4">
                        <div className={`w-10 h-10 rounded-xl flex-shrink-0 flex items-center justify-center ${tx.type === 'credit' ? 'bg-emerald-500/15' : 'bg-red-400/15'}`}>
                            {tx.type === 'credit'
                                ? <ArrowDownLeft className="w-5 h-5 text-emerald-400" />
                                : <ArrowUpRight className="w-5 h-5 text-red-400" />}
                        </div>
                        <div className="flex-1 min-w-0">
                            <p className="text-sm font-semibold text-white truncate">{tx.description}</p>
                            <p className="text-xs text-white/40 font-mono truncate">{tx.reference}</p>
                            <p className="text-[11px] text-white/30 mt-0.5">{formatDate(tx.created_at)}</p>
                        </div>
                        <div className="text-right flex-shrink-0">
                            <p className={`text-base font-bold ${tx.type === 'credit' ? 'text-emerald-400' : 'text-red-400'}`}>
                                {tx.type === 'credit' ? '+' : '-'}{formatNaira(tx.amount)}
                            </p>
                            <StatusBadge type={tx.type} />
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
