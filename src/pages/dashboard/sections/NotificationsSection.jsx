import { useState, useEffect, useCallback } from 'react'
import {
    Bell, Loader2, Info, AlertTriangle, Megaphone, Globe,
    CheckCircle, ChevronLeft, ChevronRight, Inbox
} from 'lucide-react'
import api from '../../../lib/axios'
import toast from 'react-hot-toast'

const typeConfig = {
    info: { icon: Info, color: '#33CCFF', bg: 'rgba(51,204,255,0.1)', border: 'rgba(51,204,255,0.15)' },
    warning: { icon: AlertTriangle, color: '#FFD60A', bg: 'rgba(255,214,10,0.1)', border: 'rgba(255,214,10,0.15)' },
    promo: { icon: Megaphone, color: '#AF52DE', bg: 'rgba(175,82,222,0.1)', border: 'rgba(175,82,222,0.15)' },
    system: { icon: Globe, color: '#0099FF', bg: 'rgba(0,153,255,0.1)', border: 'rgba(0,153,255,0.15)' },
}

function timeAgo(date) {
    const s = Math.floor((Date.now() - new Date(date)) / 1000)
    if (s < 60) return 'just now'
    if (s < 3600) return `${Math.floor(s / 60)}m ago`
    if (s < 86400) return `${Math.floor(s / 3600)}h ago`
    return `${Math.floor(s / 86400)}d ago`
}

export default function NotificationsSection() {
    const [notifications, setNotifications] = useState([])
    const [meta, setMeta] = useState({})
    const [page, setPage] = useState(1)
    const [loading, setLoading] = useState(true)

    const load = useCallback(() => {
        setLoading(true)
        api.get('/api/notifications', { params: { page, per_page: 15 } })
            .then(r => { setNotifications(r.data.data); setMeta(r.data) })
            .catch(() => toast.error('Failed to load notifications'))
            .finally(() => setLoading(false))
    }, [page])

    useEffect(() => { load() }, [load])

    const markRead = async (notif) => {
        if (notif.is_read) return
        try {
            await api.post(`/api/notifications/${notif.id}/read`)
            setNotifications(prev => prev.map(n => n.id === notif.id ? { ...n, is_read: true } : n))
        } catch { /* silent */ }
    }

    const markAllRead = async () => {
        const unread = notifications.filter(n => !n.is_read)
        await Promise.all(unread.map(n => api.post(`/api/notifications/${n.id}/read`).catch(() => { })))
        setNotifications(prev => prev.map(n => ({ ...n, is_read: true })))
        toast.success('All marked as read')
    }

    const unreadCount = notifications.filter(n => !n.is_read).length

    return (
        <div className="flex flex-col gap-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-2xl font-bold text-white flex items-center gap-2">
                        <Bell className="w-6 h-6 text-[#00FFFF]" />
                        Notifications
                    </h2>
                    <p className="text-white/40 text-sm mt-0.5">
                        {unreadCount > 0 ? `${unreadCount} unread` : 'All caught up!'}
                    </p>
                </div>
                {unreadCount > 0 && (
                    <button onClick={markAllRead}
                        className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-[rgba(0,255,255,0.08)] border border-[rgba(0,255,255,0.15)] text-[#00FFFF] text-xs font-bold hover:bg-[rgba(0,255,255,0.15)] transition">
                        <CheckCircle className="w-3.5 h-3.5" /> Mark all read
                    </button>
                )}
            </div>

            {/* List */}
            <div className="rounded-2xl border border-[rgba(255,255,255,0.08)] bg-[rgba(15,20,60,0.5)] overflow-hidden">
                {loading ? (
                    <div className="p-12 text-center"><Loader2 className="w-6 h-6 text-[#00FFFF] animate-spin mx-auto" /></div>
                ) : notifications.length === 0 ? (
                    <div className="p-16 text-center">
                        <Inbox className="w-10 h-10 text-white/10 mx-auto mb-3" />
                        <p className="text-sm text-white/30 font-medium">No notifications yet</p>
                        <p className="text-xs text-white/15 mt-1">You'll be notified about important updates here</p>
                    </div>
                ) : (
                    <div className="divide-y divide-white/5">
                        {notifications.map(n => {
                            const cfg = typeConfig[n.type] || typeConfig.info
                            const Icon = cfg.icon
                            return (
                                <div key={n.id}
                                    onClick={() => markRead(n)}
                                    className={`p-4 sm:p-5 hover:bg-white/[0.02] transition cursor-pointer relative ${!n.is_read ? 'bg-[rgba(0,255,255,0.02)]' : ''}`}>
                                    {!n.is_read && (
                                        <span className="absolute top-5 left-2 w-1.5 h-1.5 rounded-full bg-[#00FFFF]" />
                                    )}
                                    <div className="flex items-start gap-3 ml-2">
                                        <div className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0"
                                            style={{ background: cfg.bg, border: `1px solid ${cfg.border}` }}>
                                            <Icon className="w-4 h-4" style={{ color: cfg.color }} />
                                        </div>
                                        <div className="min-w-0 flex-1">
                                            <div className="flex items-start justify-between gap-3">
                                                <div className="min-w-0">
                                                    <h4 className={`text-sm font-bold ${!n.is_read ? 'text-white' : 'text-white/60'}`}>{n.title}</h4>
                                                    <p className="text-xs text-white/40 mt-1 line-clamp-2">{n.message}</p>
                                                </div>
                                                <span className="text-[10px] text-white/20 flex-shrink-0 whitespace-nowrap">{timeAgo(n.created_at)}</span>
                                            </div>
                                            <div className="flex items-center gap-2 mt-2 flex-wrap">
                                                <span className="text-[9px] px-1.5 py-0.5 rounded font-bold uppercase"
                                                    style={{ background: cfg.bg, color: cfg.color }}>
                                                    {n.type}
                                                </span>
                                                {n.is_broadcast && (
                                                    <span className="text-[9px] px-1.5 py-0.5 rounded bg-white/5 text-white/30 font-bold">Global</span>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )
                        })}
                    </div>
                )}

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
