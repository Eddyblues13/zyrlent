import { useState, useEffect, useCallback } from 'react'
import {
    Search, ChevronLeft, ChevronRight, Loader2, X, MessageSquare,
    Clock, CheckCircle, AlertCircle, Send, Filter
} from 'lucide-react'
import adminApi from '../../../lib/adminAxios'
import toast from 'react-hot-toast'

const STATUSES = ['All', 'open', 'in_progress', 'resolved', 'closed']
const PRIORITIES = ['All', 'low', 'medium', 'high', 'urgent']

const statusColor = {
    open: 'bg-blue-500/10 text-blue-400 border-blue-500/20',
    in_progress: 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20',
    resolved: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
    closed: 'bg-white/5 text-white/30 border-white/10',
}

const priorityColor = {
    low: 'bg-white/5 text-white/40',
    medium: 'bg-blue-500/10 text-blue-400',
    high: 'bg-orange-500/10 text-orange-400',
    urgent: 'bg-red-500/10 text-red-400',
}

const StatusBadge = ({ status }) => (
    <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold border ${statusColor[status] || ''}`}>
        {status?.replace('_', ' ')}
    </span>
)

const PriorityBadge = ({ priority }) => (
    <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold ${priorityColor[priority] || ''}`}>
        {priority}
    </span>
)

// ─── Ticket Detail Modal ───────────────────────────────────────
function TicketModal({ ticket, onClose, onRefresh }) {
    const [reply, setReply] = useState(ticket.admin_reply || '')
    const [status, setStatus] = useState(ticket.status)
    const [loading, setLoading] = useState(false)

    const handleReply = async () => {
        if (!reply.trim()) return toast.error('Enter a reply')
        setLoading(true)
        try {
            await adminApi.post(`/api/admin/support-tickets/${ticket.id}/reply`, { reply, status })
            toast.success('Reply sent')
            onRefresh(); onClose()
        } catch (e) { toast.error(e.response?.data?.message || 'Failed') }
        finally { setLoading(false) }
    }

    return (
        <div className="fixed inset-0 z-[200] bg-black/60 backdrop-blur-sm flex items-end sm:items-center justify-center p-0 sm:p-4"
            onMouseDown={e => { if (e.target === e.currentTarget) onClose() }}>
            <div className="w-full sm:w-[600px] sm:max-w-[95vw] bg-[#070D2E] border border-[rgba(255,149,0,0.2)] rounded-t-3xl sm:rounded-2xl shadow-[0_0_60px_rgba(255,149,0,0.15)] flex flex-col h-[85svh] sm:h-auto sm:max-h-[85vh] overflow-hidden">
                {/* Header */}
                <div className="flex items-center justify-between px-5 py-4 border-b border-[rgba(255,149,0,0.1)] flex-shrink-0">
                    <div className="min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                            <span className="text-[10px] font-mono text-white/25">{ticket.ticket_ref}</span>
                            <StatusBadge status={ticket.status} />
                            <PriorityBadge priority={ticket.priority} />
                        </div>
                        <h3 className="text-sm font-bold text-white truncate">{ticket.subject}</h3>
                    </div>
                    <button onClick={onClose} className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-white/40 hover:text-white flex-shrink-0 ml-3">
                        <X className="w-4 h-4" />
                    </button>
                </div>

                <div className="flex-1 overflow-y-auto px-5 py-4 space-y-4 min-h-0">
                    {/* User Info */}
                    <div className="flex items-center gap-3 p-3 rounded-xl bg-white/[0.03] border border-white/5">
                        <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#FF9500] to-[#FF6B00] flex-shrink-0 flex items-center justify-center text-xs font-bold text-white">
                            {ticket.user?.name?.[0]?.toUpperCase() || '?'}
                        </div>
                        <div className="min-w-0">
                            <p className="text-sm text-white font-medium truncate">{ticket.user?.name}</p>
                            <p className="text-[10px] text-white/25 truncate">{ticket.user?.email}</p>
                        </div>
                        <span className="ml-auto text-[10px] text-white/20 flex-shrink-0">{new Date(ticket.created_at).toLocaleString()}</span>
                    </div>

                    {/* User Message */}
                    <div className="rounded-xl bg-white/[0.03] p-4 border border-white/5">
                        <p className="text-[10px] text-white/30 uppercase tracking-wider mb-2">Message</p>
                        <p className="text-sm text-white/70 whitespace-pre-wrap">{ticket.message}</p>
                    </div>

                    {/* Previous Admin Reply */}
                    {ticket.admin_reply && (
                        <div className="rounded-xl bg-[rgba(255,149,0,0.04)] p-4 border border-[rgba(255,149,0,0.1)]">
                            <p className="text-[10px] text-[#FF9500]/60 uppercase tracking-wider mb-2">Previous Reply</p>
                            <p className="text-sm text-white/60 whitespace-pre-wrap">{ticket.admin_reply}</p>
                            {ticket.replied_at && <p className="text-[10px] text-white/20 mt-2">{new Date(ticket.replied_at).toLocaleString()}</p>}
                        </div>
                    )}

                    {/* Reply Form */}
                    <div className="space-y-3">
                        <textarea placeholder="Write your reply..." rows={4} value={reply} onChange={e => setReply(e.target.value)}
                            className="w-full px-3 py-2.5 rounded-xl bg-white/5 border border-white/10 text-sm text-white placeholder-white/25 focus:outline-none focus:border-[rgba(255,149,0,0.4)] resize-none" />
                        <div className="flex flex-wrap gap-1.5">
                            {['open', 'in_progress', 'resolved', 'closed'].map(s => (
                                <button key={s} onClick={() => setStatus(s)}
                                    className={`px-2.5 py-1.5 rounded-lg text-[10px] font-bold transition border ${status === s ? statusColor[s] : 'bg-white/[0.03] border-white/5 text-white/30'}`}>
                                    {s.replace('_', ' ')}
                                </button>
                            ))}
                        </div>
                        <button onClick={handleReply} disabled={loading}
                            className="w-full py-2.5 rounded-xl bg-gradient-to-r from-[#FF9500] to-[#FF6B00] text-white text-sm font-bold flex items-center justify-center gap-2 hover:shadow-[0_0_20px_rgba(255,149,0,0.3)] transition disabled:opacity-40">
                            {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
                            Send Reply
                        </button>
                    </div>
                </div>
            </div>
        </div>
    )
}

// ─── Main Section ──────────────────────────────────────────────
export default function SupportTicketsSection() {
    const [tickets, setTickets] = useState([])
    const [meta, setMeta] = useState({})
    const [page, setPage] = useState(1)
    const [search, setSearch] = useState('')
    const [status, setStatus] = useState('All')
    const [loading, setLoading] = useState(true)
    const [selectedTicket, setSelectedTicket] = useState(null)

    const loadTickets = useCallback(() => {
        setLoading(true)
        const params = { page, per_page: 15 }
        if (search) params.search = search
        if (status !== 'All') params.status = status

        adminApi.get('/api/admin/support-tickets', { params })
            .then(r => { setTickets(r.data.data); setMeta(r.data) })
            .catch(() => toast.error('Failed to load tickets'))
            .finally(() => setLoading(false))
    }, [page, search, status])

    useEffect(() => { loadTickets() }, [loadTickets])

    return (
        <div className="space-y-6">
            {/* Filters */}
            <div className="flex flex-col gap-3">
                <div className="relative max-w-sm">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
                    <input type="text" placeholder="Search tickets..."
                        value={search} onChange={e => { setSearch(e.target.value); setPage(1) }}
                        className="w-full pl-9 pr-4 py-2.5 rounded-xl bg-white/[0.05] border border-white/10 text-sm text-white placeholder-white/25 focus:outline-none focus:border-[rgba(255,149,0,0.4)] transition" />
                </div>
                <div className="flex gap-1.5 flex-wrap">
                    {STATUSES.map(s => (
                        <button key={s} onClick={() => { setStatus(s); setPage(1) }}
                            className={`px-3 py-2 rounded-xl text-xs font-medium border transition ${status === s ? 'bg-[rgba(255,149,0,0.12)] border-[rgba(255,149,0,0.3)] text-[#FF9500]' : 'bg-white/[0.03] border-white/5 text-white/40 hover:text-white/60'}`}>
                            {s === 'All' ? 'All' : s.replace('_', ' ')}
                        </button>
                    ))}
                </div>
            </div>

            {/* Ticket Modal */}
            {selectedTicket && (
                <TicketModal
                    ticket={selectedTicket}
                    onClose={() => setSelectedTicket(null)}
                    onRefresh={loadTickets}
                />
            )}

            {/* Content */}
            <div className="rounded-2xl border border-[rgba(255,255,255,0.06)] bg-[rgba(15,20,60,0.5)] backdrop-blur-xl overflow-hidden">
                {loading ? (
                    <div className="p-12 text-center"><Loader2 className="w-6 h-6 text-[#FF9500] animate-spin mx-auto" /></div>
                ) : tickets.length === 0 ? (
                    <div className="p-12 text-center">
                        <MessageSquare className="w-8 h-8 text-white/10 mx-auto mb-3" />
                        <p className="text-sm text-white/30">No support tickets found</p>
                    </div>
                ) : (
                    <>
                        {/* Desktop Table */}
                        <div className="hidden md:block overflow-x-auto">
                            <table className="w-full text-left">
                                <thead>
                                    <tr className="border-b border-white/5">
                                        <th className="px-5 py-3.5 text-xs text-white/30 font-medium">Ref</th>
                                        <th className="px-5 py-3.5 text-xs text-white/30 font-medium">Subject</th>
                                        <th className="px-5 py-3.5 text-xs text-white/30 font-medium">User</th>
                                        <th className="px-5 py-3.5 text-xs text-white/30 font-medium">Priority</th>
                                        <th className="px-5 py-3.5 text-xs text-white/30 font-medium">Status</th>
                                        <th className="px-5 py-3.5 text-xs text-white/30 font-medium">Date</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {tickets.map(t => (
                                        <tr key={t.id} className="border-b border-white/[0.03] hover:bg-white/[0.02] transition cursor-pointer" onClick={() => setSelectedTicket(t)}>
                                            <td className="px-5 py-3.5 text-xs font-mono text-white/30">{t.ticket_ref}</td>
                                            <td className="px-5 py-3.5 text-sm text-white max-w-[200px] truncate">{t.subject}</td>
                                            <td className="px-5 py-3.5">
                                                <div className="flex items-center gap-2">
                                                    <div className="w-6 h-6 rounded-md bg-gradient-to-br from-[#FF9500] to-[#FF6B00] flex-shrink-0 flex items-center justify-center text-[9px] font-bold text-white">
                                                        {t.user?.name?.[0]?.toUpperCase() || '?'}
                                                    </div>
                                                    <span className="text-sm text-white/50 truncate">{t.user?.name}</span>
                                                </div>
                                            </td>
                                            <td className="px-5 py-3.5"><PriorityBadge priority={t.priority} /></td>
                                            <td className="px-5 py-3.5"><StatusBadge status={t.status} /></td>
                                            <td className="px-5 py-3.5 text-xs text-white/20">{new Date(t.created_at).toLocaleDateString()}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>

                        {/* Mobile Cards */}
                        <div className="md:hidden divide-y divide-white/5">
                            {tickets.map(t => (
                                <div key={t.id} className="p-4 hover:bg-white/[0.02] transition" onClick={() => setSelectedTicket(t)}>
                                    <div className="flex items-start justify-between gap-2 mb-2">
                                        <div className="min-w-0">
                                            <p className="text-sm text-white font-medium truncate">{t.subject}</p>
                                            <p className="text-[10px] text-white/25 font-mono">{t.ticket_ref}</p>
                                        </div>
                                        <StatusBadge status={t.status} />
                                    </div>
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-2">
                                            <div className="w-5 h-5 rounded-md bg-gradient-to-br from-[#FF9500] to-[#FF6B00] flex-shrink-0 flex items-center justify-center text-[8px] font-bold text-white">
                                                {t.user?.name?.[0]?.toUpperCase() || '?'}
                                            </div>
                                            <span className="text-xs text-white/40">{t.user?.name}</span>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <PriorityBadge priority={t.priority} />
                                            <span className="text-[10px] text-white/20">{new Date(t.created_at).toLocaleDateString()}</span>
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
