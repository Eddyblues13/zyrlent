import { useState, useEffect, useCallback } from 'react'
import {
    ChevronLeft, ChevronRight, Loader2, Bell, Send, Mail,
    Globe, User, Info, AlertTriangle, Megaphone
} from 'lucide-react'
import adminApi from '../../../lib/adminAxios'
import toast from 'react-hot-toast'

const typeIcon = {
    info: Info,
    warning: AlertTriangle,
    promo: Megaphone,
    system: Globe,
}

const typeColor = {
    info: 'bg-blue-500/10 text-blue-400 border-blue-500/20',
    warning: 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20',
    promo: 'bg-purple-500/10 text-purple-400 border-purple-500/20',
    system: 'bg-white/5 text-white/40 border-white/10',
}

export default function NotificationsSection() {
    const [notifications, setNotifications] = useState([])
    const [meta, setMeta] = useState({})
    const [page, setPage] = useState(1)
    const [loading, setLoading] = useState(true)
    const [tab, setTab] = useState('compose') // 'compose' | 'history'

    // Compose state
    const [title, setTitle] = useState('')
    const [message, setMessage] = useState('')
    const [type, setType] = useState('info')
    const [sending, setSending] = useState(false)

    // Email blast state
    const [emailMode, setEmailMode] = useState(false)
    const [emailSubject, setEmailSubject] = useState('')
    const [emailBody, setEmailBody] = useState('')
    const [emailSending, setEmailSending] = useState(false)

    const loadNotifications = useCallback(() => {
        setLoading(true)
        adminApi.get('/api/admin/notifications', { params: { page, per_page: 15 } })
            .then(r => { setNotifications(r.data.data); setMeta(r.data) })
            .catch(() => toast.error('Failed to load notifications'))
            .finally(() => setLoading(false))
    }, [page])

    useEffect(() => { if (tab === 'history') loadNotifications() }, [loadNotifications, tab])

    // Send broadcast notification
    const handleBroadcast = async () => {
        if (!title || !message) return toast.error('Fill in title and message')
        setSending(true)
        try {
            const r = await adminApi.post('/api/admin/notifications/broadcast', { title, message, type })
            toast.success(r.data.message)
            setTitle(''); setMessage('')
        } catch (e) { toast.error(e.response?.data?.message || 'Failed') }
        finally { setSending(false) }
    }

    // Send email blast
    const handleEmailBlast = async () => {
        if (!emailSubject || !emailBody) return toast.error('Fill in subject and body')
        setEmailSending(true)
        try {
            const r = await adminApi.post('/api/admin/notifications/email-blast', { subject: emailSubject, body: emailBody })
            toast.success(r.data.message)
            setEmailSubject(''); setEmailBody('')
        } catch (e) { toast.error(e.response?.data?.message || 'Failed') }
        finally { setEmailSending(false) }
    }

    return (
        <div className="space-y-6">
            {/* Tab Buttons */}
            <div className="flex gap-2">
                <button onClick={() => setTab('compose')}
                    className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium transition border ${tab === 'compose' ? 'bg-[rgba(255,149,0,0.12)] border-[rgba(255,149,0,0.3)] text-[#FF9500]' : 'bg-white/[0.03] border-white/5 text-white/40'}`}>
                    <Send className="w-4 h-4" /> Compose
                </button>
                <button onClick={() => setTab('history')}
                    className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium transition border ${tab === 'history' ? 'bg-[rgba(255,149,0,0.12)] border-[rgba(255,149,0,0.3)] text-[#FF9500]' : 'bg-white/[0.03] border-white/5 text-white/40'}`}>
                    <Bell className="w-4 h-4" /> History
                </button>
            </div>

            {/* ─── Compose Tab ─── */}
            {tab === 'compose' && (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Broadcast Notification Panel */}
                    <div className="rounded-2xl border border-[rgba(255,149,0,0.15)] bg-[rgba(15,20,60,0.5)] backdrop-blur-xl p-5 space-y-4">
                        <div className="flex items-center gap-2.5">
                            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#FF9500] to-[#FF6B00] flex items-center justify-center">
                                <Bell className="w-4.5 h-4.5 text-white" />
                            </div>
                            <div>
                                <h3 className="text-sm font-bold text-white">Broadcast Notification</h3>
                                <p className="text-[10px] text-white/30">Visible to all users in-app</p>
                            </div>
                        </div>

                        <input placeholder="Notification Title" value={title} onChange={e => setTitle(e.target.value)}
                            className="w-full px-3 py-2.5 rounded-xl bg-white/5 border border-white/10 text-sm text-white placeholder-white/25 focus:outline-none focus:border-[rgba(255,149,0,0.4)]" />

                        <textarea placeholder="Notification message..." rows={4} value={message} onChange={e => setMessage(e.target.value)}
                            className="w-full px-3 py-2.5 rounded-xl bg-white/5 border border-white/10 text-sm text-white placeholder-white/25 focus:outline-none focus:border-[rgba(255,149,0,0.4)] resize-none" />

                        <div className="flex gap-2 flex-wrap">
                            {Object.keys(typeIcon).map(t => {
                                const Icon = typeIcon[t]
                                return (
                                    <button key={t} onClick={() => setType(t)}
                                        className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold transition border ${type === t ? typeColor[t] : 'bg-white/[0.03] border-white/5 text-white/30'}`}>
                                        <Icon className="w-3.5 h-3.5" />
                                        {t.charAt(0).toUpperCase() + t.slice(1)}
                                    </button>
                                )
                            })}
                        </div>

                        <button onClick={handleBroadcast} disabled={sending}
                            className="w-full py-3 rounded-xl bg-gradient-to-r from-[#FF9500] to-[#FF6B00] text-white text-sm font-bold flex items-center justify-center gap-2 hover:shadow-[0_0_20px_rgba(255,149,0,0.3)] transition disabled:opacity-40">
                            {sending ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
                            Send to All Users
                        </button>
                    </div>

                    {/* Email Blast Panel */}
                    <div className="rounded-2xl border border-blue-500/15 bg-[rgba(15,20,60,0.5)] backdrop-blur-xl p-5 space-y-4">
                        <div className="flex items-center gap-2.5">
                            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center">
                                <Mail className="w-4.5 h-4.5 text-white" />
                            </div>
                            <div>
                                <h3 className="text-sm font-bold text-white">Email Blast</h3>
                                <p className="text-[10px] text-white/30">Send email to all active users</p>
                            </div>
                        </div>

                        <input placeholder="Email Subject" value={emailSubject} onChange={e => setEmailSubject(e.target.value)}
                            className="w-full px-3 py-2.5 rounded-xl bg-white/5 border border-white/10 text-sm text-white placeholder-white/25 focus:outline-none focus:border-blue-500/40" />

                        <textarea placeholder="Email body..." rows={4} value={emailBody} onChange={e => setEmailBody(e.target.value)}
                            className="w-full px-3 py-2.5 rounded-xl bg-white/5 border border-white/10 text-sm text-white placeholder-white/25 focus:outline-none focus:border-blue-500/40 resize-none" />

                        <button onClick={handleEmailBlast} disabled={emailSending}
                            className="w-full py-3 rounded-xl bg-gradient-to-r from-blue-500 to-blue-600 text-white text-sm font-bold flex items-center justify-center gap-2 hover:shadow-[0_0_20px_rgba(59,130,246,0.3)] transition disabled:opacity-40">
                            {emailSending ? <Loader2 className="w-4 h-4 animate-spin" /> : <Mail className="w-4 h-4" />}
                            Send Email to All Users
                        </button>
                    </div>
                </div>
            )}

            {/* ─── History Tab ─── */}
            {tab === 'history' && (
                <div className="rounded-2xl border border-[rgba(255,255,255,0.06)] bg-[rgba(15,20,60,0.5)] backdrop-blur-xl overflow-hidden">
                    {loading ? (
                        <div className="p-12 text-center"><Loader2 className="w-6 h-6 text-[#FF9500] animate-spin mx-auto" /></div>
                    ) : notifications.length === 0 ? (
                        <div className="p-12 text-center">
                            <Bell className="w-8 h-8 text-white/10 mx-auto mb-3" />
                            <p className="text-sm text-white/30">No notifications sent yet</p>
                        </div>
                    ) : (
                        <>
                            <div className="divide-y divide-white/5">
                                {notifications.map(n => {
                                    const Icon = typeIcon[n.type] || Info
                                    return (
                                        <div key={n.id} className="p-4 sm:p-5 hover:bg-white/[0.02] transition">
                                            <div className="flex items-start gap-3">
                                                <div className={`w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0 ${n.type === 'info' ? 'bg-blue-500/10' : n.type === 'warning' ? 'bg-yellow-500/10' : n.type === 'promo' ? 'bg-purple-500/10' : 'bg-white/5'}`}>
                                                    <Icon className={`w-4 h-4 ${n.type === 'info' ? 'text-blue-400' : n.type === 'warning' ? 'text-yellow-400' : n.type === 'promo' ? 'text-purple-400' : 'text-white/40'}`} />
                                                </div>
                                                <div className="min-w-0 flex-1">
                                                    <div className="flex items-center gap-2 mb-1 flex-wrap">
                                                        <h4 className="text-sm font-bold text-white">{n.title}</h4>
                                                        {n.is_broadcast ? (
                                                            <span className="text-[9px] px-1.5 py-0.5 rounded bg-[rgba(255,149,0,0.1)] text-[#FF9500] font-bold">BROADCAST</span>
                                                        ) : (
                                                            <span className="text-[9px] px-1.5 py-0.5 rounded bg-white/5 text-white/30 font-bold">Individual</span>
                                                        )}
                                                    </div>
                                                    <p className="text-xs text-white/50 line-clamp-2">{n.message}</p>
                                                    <div className="flex items-center gap-3 mt-2">
                                                        {!n.is_broadcast && n.user && (
                                                            <span className="text-[10px] text-white/25">To: {n.user.name}</span>
                                                        )}
                                                        <span className="text-[10px] text-white/15">{new Date(n.created_at).toLocaleString()}</span>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    )
                                })}
                            </div>

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
                        </>
                    )}
                </div>
            )}
        </div>
    )
}
