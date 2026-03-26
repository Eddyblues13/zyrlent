import { useState, useEffect, useCallback } from 'react'
import {
    Bell, Loader2, Info, AlertTriangle, Megaphone, Globe,
    ChevronLeft, ChevronRight, Inbox, ExternalLink
} from 'lucide-react'
import api from '../../../lib/axios'
import toast from 'react-hot-toast'

const typeConfig = {
    info:    { icon: Info, color: '#33CCFF', bg: 'rgba(51,204,255,0.1)', border: 'rgba(51,204,255,0.15)' },
    warning: { icon: AlertTriangle, color: '#FFD60A', bg: 'rgba(255,214,10,0.1)', border: 'rgba(255,214,10,0.15)' },
    promo:   { icon: Megaphone, color: '#AF52DE', bg: 'rgba(175,82,222,0.1)', border: 'rgba(175,82,222,0.15)' },
    system:  { icon: Globe, color: '#0099FF', bg: 'rgba(0,153,255,0.1)', border: 'rgba(0,153,255,0.15)' },
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

    return (
        <div className="flex flex-col gap-6">
            {/* Sticky header */}
            <div className="sticky top-[61px] z-30 bg-[rgba(8,10,46,0.97)] backdrop-blur-xl -mx-4 sm:-mx-6 lg:-mx-8 px-4 sm:px-6 lg:px-8 pt-4 pb-4 border-b border-white/[0.05]">
                <h2 className="text-2xl font-bold text-white flex items-center gap-2">
                    <Bell className="w-6 h-6 text-[#00FFFF]" />
                    Notifications
                </h2>
                <p className="text-white/40 text-sm mt-0.5">
                    {notifications.length > 0 ? `${meta.total || notifications.length} notification${(meta.total || notifications.length) !== 1 ? 's' : ''}` : 'No notifications'}
                </p>
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
                                <div key={n.id} className="p-4 sm:p-5 hover:bg-white/[0.02] transition">
                                    <div className="flex items-start gap-3">
                                        <div className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0"
                                            style={{ background: cfg.bg, border: `1px solid ${cfg.border}` }}>
                                            <Icon className="w-4 h-4" style={{ color: cfg.color }} />
                                        </div>
                                        <div className="min-w-0 flex-1">
                                            <div className="flex items-start justify-between gap-3">
                                                <div className="min-w-0">
                                                    <h4 className="text-sm font-bold text-white">{n.title}</h4>
                                                    <p className="text-xs text-white/40 mt-1 line-clamp-2">{n.message}</p>
                                                </div>
                                                <span className="text-[10px] text-white/20 flex-shrink-0 whitespace-nowrap">{timeAgo(n.created_at)}</span>
                                            </div>

                                            {/* Link button */}
                                            {n.link_url && (
                                                <a href={n.link_url} target="_blank" rel="noopener noreferrer"
                                                    className="inline-flex items-center gap-1.5 mt-2 px-3 py-1.5 rounded-lg text-[11px] font-bold transition hover:brightness-125"
                                                    style={{
                                                        background: cfg.bg,
                                                        color: cfg.color,
                                                        border: `1px solid ${cfg.border}`,
                                                    }}>
                                                    <ExternalLink className="w-3 h-3" />
                                                    {n.link_label || 'Open Link'}
                                                </a>
                                            )}

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
