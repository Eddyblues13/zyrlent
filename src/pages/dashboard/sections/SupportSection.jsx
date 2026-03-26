import { useState, useEffect, useCallback } from 'react'
import {
    LifeBuoy, MessageCircle, ChevronDown, ChevronUp, Send, Mail,
    Phone, ExternalLink, Loader2, Clock, CheckCircle, AlertCircle,
    ChevronLeft, ChevronRight, Inbox
} from 'lucide-react'
import api from '../../../lib/axios'
import toast from 'react-hot-toast'

const FAQS = [
    { q: 'How do I fund my wallet?', a: 'Go to "Fund Wallet" and select your preferred payment method — card, bank transfer, or USSD. Funds are credited instantly for card and USSD payments.' },
    { q: 'How long does an OTP number remain active?', a: 'Numbers are active for up to 20 minutes after purchase. If no OTP is received, a refund is automatically issued to your wallet.' },
    { q: 'What happens if I don\'t receive an OTP?', a: 'If your OTP is not delivered within 20 minutes, we automatically refund the full amount to your wallet balance. You can then try again.' },
    { q: 'Can I use the same number multiple times?', a: 'No. Each rented number is single-use and expires after OTP delivery or 20 minutes, whichever comes first.' },
    { q: 'Which countries do you support?', a: 'We support 50+ countries. Visit the Services page to see the full list of available countries and their success rates.' },
    { q: 'Is my wallet balance redeemable?', a: 'Wallet credits are non-redeemable as cash. They can only be used to purchase OTP numbers within the platform.' },
    { q: 'How secure is my account?', a: 'We use industry-standard encryption and secure API gateways. Your payment information is never stored on our servers.' },
]

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

export default function SupportSection() {
    const [openFaq, setOpenFaq] = useState(null)
    const [form, setForm] = useState({ subject: '', message: '', priority: 'medium' })
    const [sending, setSending] = useState(false)
    const [tab, setTab] = useState('new') // 'new' | 'tickets'
    const [tickets, setTickets] = useState([])
    const [ticketsMeta, setTicketsMeta] = useState({})
    const [ticketPage, setTicketPage] = useState(1)
    const [ticketsLoading, setTicketsLoading] = useState(true)
    const [selectedTicket, setSelectedTicket] = useState(null)

    const loadTickets = useCallback(() => {
        setTicketsLoading(true)
        api.get('/api/support-tickets', { params: { page: ticketPage, per_page: 10 } })
            .then(r => { setTickets(r.data.data); setTicketsMeta(r.data) })
            .catch(() => { })
            .finally(() => setTicketsLoading(false))
    }, [ticketPage])

    useEffect(() => { loadTickets() }, [loadTickets])

    const handleSubmit = async (e) => {
        e.preventDefault()
        if (!form.subject || !form.message) return
        setSending(true)
        try {
            await api.post('/api/support-tickets', form)
            toast.success('Ticket submitted! We\'ll respond soon.')
            setForm({ subject: '', message: '', priority: 'medium' })
            loadTickets()
            setTab('tickets')
        } catch (err) {
            toast.error(err.response?.data?.message || 'Failed to submit ticket')
        }
        finally { setSending(false) }
    }

    return (
        <div className="flex flex-col gap-8">
            {/* Sticky header */}
            <div className="sticky top-[61px] z-30 bg-[rgba(8,10,46,0.97)] backdrop-blur-xl -mx-4 sm:-mx-6 lg:-mx-8 px-4 sm:px-6 lg:px-8 pt-4 pb-4 border-b border-white/[0.05]">
                <h2 className="text-2xl font-bold text-white flex items-center gap-2">
                    <LifeBuoy className="w-6 h-6 text-[#00FFFF]" />
                    Support & Help
                </h2>
                <p className="text-white/40 text-sm mt-0.5">We're here to help 24/7</p>
            </div>

            {/* Quick Contact */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {[
                    { icon: MessageCircle, label: 'Live Chat', desc: 'Avg. 2 min response', color: '#00FFFF', bg: 'rgba(0,255,255,0.1)', href: '#' },
                    { icon: Mail, label: 'Email Support', desc: 'support@zyrlent.com', color: '#33CCFF', bg: 'rgba(51,204,255,0.1)', href: 'mailto:support@zyrlent.com' },
                    { icon: Phone, label: 'Phone', desc: '+1 (800) ZYRLENT', color: '#0099FF', bg: 'rgba(0,153,255,0.1)', href: 'tel:+18009975368' },
                ].map((c, i) => (
                    <a key={i} href={c.href}
                        className="flex flex-col gap-3 p-5 rounded-xl border border-[rgba(255,255,255,0.08)] bg-[rgba(15,20,60,0.5)] hover:border-[rgba(0,255,255,0.25)] hover:bg-[rgba(15,20,60,0.8)] transition group">
                        <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: c.bg }}>
                            <c.icon className="w-5 h-5" style={{ color: c.color }} />
                        </div>
                        <div>
                            <p className="text-sm font-bold text-white flex items-center gap-1">
                                {c.label}
                                <ExternalLink className="w-3 h-3 text-white/30 group-hover:text-white/60 transition" />
                            </p>
                            <p className="text-xs text-white/40 mt-0.5">{c.desc}</p>
                        </div>
                    </a>
                ))}
            </div>

            {/* Tab toggle */}
            <div className="flex gap-2">
                <button onClick={() => setTab('new')}
                    className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium border transition ${tab === 'new' ? 'bg-[rgba(0,255,255,0.08)] border-[rgba(0,255,255,0.2)] text-[#00FFFF]' : 'bg-white/[0.03] border-white/5 text-white/40'}`}>
                    <Send className="w-4 h-4" /> New Ticket
                </button>
                <button onClick={() => setTab('tickets')}
                    className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium border transition ${tab === 'tickets' ? 'bg-[rgba(0,255,255,0.08)] border-[rgba(0,255,255,0.2)] text-[#00FFFF]' : 'bg-white/[0.03] border-white/5 text-white/40'}`}>
                    <MessageCircle className="w-4 h-4" /> My Tickets
                    {ticketsMeta.total > 0 && (
                        <span className="text-[9px] bg-[#00FFFF]/20 text-[#00FFFF] rounded-full px-1.5 py-0.5 font-bold">{ticketsMeta.total}</span>
                    )}
                </button>
            </div>

            {/* New Ticket Form */}
            {tab === 'new' && (
                <div className="rounded-2xl border border-[rgba(255,255,255,0.08)] bg-[rgba(15,20,60,0.5)] p-6">
                    <h3 className="text-base font-bold text-white mb-4 flex items-center gap-2">
                        <Send className="w-4 h-4 text-[#00FFFF]" />
                        Submit a Support Ticket
                    </h3>
                    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                        <div>
                            <label className="text-xs font-semibold text-white/40 uppercase tracking-wider mb-2 block">Subject</label>
                            <input type="text" placeholder="Describe your issue briefly"
                                value={form.subject} onChange={e => setForm(f => ({ ...f, subject: e.target.value }))}
                                className="w-full px-4 py-3 rounded-xl bg-[rgba(255,255,255,0.05)] border border-[rgba(255,255,255,0.1)] text-white placeholder-white/30 text-sm focus:outline-none focus:border-[rgba(0,255,255,0.4)] transition" />
                        </div>
                        <div>
                            <label className="text-xs font-semibold text-white/40 uppercase tracking-wider mb-2 block">Priority</label>
                            <div className="flex gap-2">
                                {['low', 'medium', 'high', 'urgent'].map(p => (
                                    <button key={p} type="button" onClick={() => setForm(f => ({ ...f, priority: p }))}
                                        className={`px-3 py-2 rounded-lg text-xs font-bold transition border ${form.priority === p ? `${priorityColor[p]} border-current` : 'bg-white/[0.03] border-white/5 text-white/30'}`}>
                                        {p}
                                    </button>
                                ))}
                            </div>
                        </div>
                        <div>
                            <label className="text-xs font-semibold text-white/40 uppercase tracking-wider mb-2 block">Message</label>
                            <textarea placeholder="Give us as much detail as possible…" rows={4}
                                value={form.message} onChange={e => setForm(f => ({ ...f, message: e.target.value }))}
                                className="w-full px-4 py-3 rounded-xl bg-[rgba(255,255,255,0.05)] border border-[rgba(255,255,255,0.1)] text-white placeholder-white/30 text-sm focus:outline-none focus:border-[rgba(0,255,255,0.4)] transition resize-none" />
                        </div>
                        <button type="submit" disabled={sending || !form.subject || !form.message}
                            className="py-3 rounded-xl bg-gradient-to-r from-[#33CCFF] to-[#0066CC] text-white font-bold text-sm shadow-[0_0_15px_rgba(0,255,255,0.2)] hover:shadow-[0_0_22px_rgba(0,255,255,0.35)] hover:scale-[1.01] transition-all disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:scale-100 flex items-center justify-center gap-2">
                            {sending ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
                            Submit Ticket
                        </button>
                    </form>
                </div>
            )}

            {/* My Tickets */}
            {tab === 'tickets' && (
                <div className="rounded-2xl border border-[rgba(255,255,255,0.08)] bg-[rgba(15,20,60,0.5)] overflow-hidden">
                    {ticketsLoading ? (
                        <div className="p-12 text-center"><Loader2 className="w-6 h-6 text-[#00FFFF] animate-spin mx-auto" /></div>
                    ) : tickets.length === 0 ? (
                        <div className="p-12 text-center">
                            <Inbox className="w-10 h-10 text-white/10 mx-auto mb-3" />
                            <p className="text-sm text-white/30">No tickets yet</p>
                            <button onClick={() => setTab('new')} className="text-xs text-[#00FFFF] mt-2 hover:underline">Submit your first ticket</button>
                        </div>
                    ) : (
                        <>
                            <div className="divide-y divide-white/5">
                                {tickets.map(t => (
                                    <div key={t.id} className="p-4 sm:p-5 hover:bg-white/[0.02] transition cursor-pointer"
                                        onClick={() => setSelectedTicket(selectedTicket?.id === t.id ? null : t)}>
                                        <div className="flex items-start justify-between gap-3">
                                            <div className="min-w-0">
                                                <div className="flex items-center gap-2 mb-1 flex-wrap">
                                                    <h4 className="text-sm font-bold text-white truncate">{t.subject}</h4>
                                                    <span className={`text-[9px] px-1.5 py-0.5 rounded-full font-bold border ${statusColor[t.status]}`}>{t.status?.replace('_', ' ')}</span>
                                                    <span className={`text-[9px] px-1.5 py-0.5 rounded font-bold ${priorityColor[t.priority]}`}>{t.priority}</span>
                                                </div>
                                                <p className="text-xs text-white/30 font-mono">{t.ticket_ref}</p>
                                            </div>
                                            <span className="text-[10px] text-white/20 flex-shrink-0">{new Date(t.created_at).toLocaleDateString()}</span>
                                        </div>

                                        {/* Expanded view */}
                                        {selectedTicket?.id === t.id && (
                                            <div className="mt-3 pt-3 border-t border-white/5 space-y-3">
                                                <div className="rounded-xl bg-white/[0.03] p-3">
                                                    <p className="text-[10px] text-white/30 uppercase tracking-wider mb-1">Your message</p>
                                                    <p className="text-sm text-white/60 whitespace-pre-wrap">{t.message}</p>
                                                </div>
                                                {t.admin_reply ? (
                                                    <div className="rounded-xl bg-[rgba(0,255,255,0.03)] border border-[rgba(0,255,255,0.1)] p-3">
                                                        <p className="text-[10px] text-[#00FFFF]/60 uppercase tracking-wider mb-1">Admin Reply</p>
                                                        <p className="text-sm text-white/70 whitespace-pre-wrap">{t.admin_reply}</p>
                                                        {t.replied_at && <p className="text-[10px] text-white/20 mt-2">{new Date(t.replied_at).toLocaleString()}</p>}
                                                    </div>
                                                ) : (
                                                    <div className="flex items-center gap-2 text-xs text-white/25">
                                                        <Clock className="w-3.5 h-3.5" />
                                                        Awaiting admin response...
                                                    </div>
                                                )}
                                            </div>
                                        )}
                                    </div>
                                ))}
                            </div>

                            {ticketsMeta.last_page > 1 && (
                                <div className="flex items-center justify-between px-5 py-3 border-t border-white/5">
                                    <span className="text-xs text-white/30">Page {ticketsMeta.current_page} of {ticketsMeta.last_page}</span>
                                    <div className="flex gap-1.5">
                                        <button disabled={ticketPage <= 1} onClick={() => setTicketPage(p => p - 1)}
                                            className="p-2 rounded-lg hover:bg-white/[0.06] text-white/30 hover:text-white/60 disabled:opacity-20 transition">
                                            <ChevronLeft className="w-4 h-4" />
                                        </button>
                                        <button disabled={ticketPage >= ticketsMeta.last_page} onClick={() => setTicketPage(p => p + 1)}
                                            className="p-2 rounded-lg hover:bg-white/[0.06] text-white/30 hover:text-white/60 disabled:opacity-20 transition">
                                            <ChevronRight className="w-4 h-4" />
                                        </button>
                                    </div>
                                </div>
                            )}
                        </>
                    )}
                </div>
            )}

            {/* FAQ */}
            <div>
                <h3 className="text-base font-bold text-white mb-4">Frequently Asked Questions</h3>
                <div className="flex flex-col gap-2">
                    {FAQS.map((faq, i) => (
                        <div key={i} className="rounded-xl border border-[rgba(255,255,255,0.08)] bg-[rgba(15,20,60,0.4)] overflow-hidden">
                            <button onClick={() => setOpenFaq(openFaq === i ? null : i)}
                                className="w-full flex items-center justify-between p-4 text-left hover:bg-[rgba(0,255,255,0.03)] transition">
                                <span className="text-sm font-semibold text-white/85 pr-4">{faq.q}</span>
                                {openFaq === i
                                    ? <ChevronUp className="w-4 h-4 text-[#00FFFF] flex-shrink-0" />
                                    : <ChevronDown className="w-4 h-4 text-white/30 flex-shrink-0" />
                                }
                            </button>
                            {openFaq === i && (
                                <div className="px-4 pb-4">
                                    <p className="text-sm text-white/50 leading-relaxed">{faq.a}</p>
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            </div>
        </div>
    )
}
