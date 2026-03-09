import { useState, useEffect, useRef } from 'react'
import { X, Bell, Info, AlertTriangle, Megaphone, Globe } from 'lucide-react'
import api from '../lib/axios'

const typeConfig = {
    info: { icon: Info, color: '#33CCFF', bg: 'rgba(51,204,255,0.12)', glow: 'rgba(51,204,255,0.15)' },
    warning: { icon: AlertTriangle, color: '#FFD60A', bg: 'rgba(255,214,10,0.12)', glow: 'rgba(255,214,10,0.15)' },
    promo: { icon: Megaphone, color: '#AF52DE', bg: 'rgba(175,82,222,0.12)', glow: 'rgba(175,82,222,0.15)' },
    system: { icon: Globe, color: '#0099FF', bg: 'rgba(0,153,255,0.12)', glow: 'rgba(0,153,255,0.15)' },
}

/**
 * Polls /api/notifications for unread items.
 * When a NEW one appears (id not seen before), it auto-shows a modal.
 * Rendered once inside Dashboard so it covers every section.
 *
 * Props:
 *  - onUnreadChange(count)  → updates the bell badge in the header
 */
export default function NotificationPopup({ onUnreadChange }) {
    const [popup, setPopup] = useState(null)        // notification currently shown
    const [queue, setQueue] = useState([])           // queued notifications to show
    const seenIds = useRef(new Set())                // ids we've already popped up
    const initialLoad = useRef(true)

    // Poll every 30 s
    useEffect(() => {
        const poll = () => {
            api.get('/api/notifications', { params: { per_page: 10 } })
                .then(r => {
                    const list = r.data?.data ?? []

                    // Unread count for badge
                    const unread = list.filter(n => !n.is_read).length
                    onUnreadChange?.(unread)

                    // On first load, just seed seenIds so we don't pop old ones
                    if (initialLoad.current) {
                        list.forEach(n => seenIds.current.add(n.id))
                        initialLoad.current = false
                        return
                    }

                    // Find new unread notifications we haven't shown yet
                    const fresh = list.filter(n => !n.is_read && !seenIds.current.has(n.id))
                    fresh.forEach(n => seenIds.current.add(n.id))

                    if (fresh.length > 0) {
                        setQueue(prev => [...prev, ...fresh])
                    }
                })
                .catch(() => { })
        }

        poll()
        const interval = setInterval(poll, 30000)
        return () => clearInterval(interval)
    }, [onUnreadChange])

    // Show next item from queue when popup is dismissed
    useEffect(() => {
        if (!popup && queue.length > 0) {
            setPopup(queue[0])
            setQueue(prev => prev.slice(1))
        }
    }, [popup, queue])

    const dismiss = async () => {
        if (popup) {
            try { await api.post(`/api/notifications/${popup.id}/read`) } catch { }
            onUnreadChange?.(prev => (typeof prev === 'number' ? Math.max(0, prev - 1) : 0))
        }
        setPopup(null)
    }

    if (!popup) return null

    const cfg = typeConfig[popup.type] || typeConfig.info
    const Icon = cfg.icon

    return (
        <div className="fixed inset-0 z-[300] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-[fadeIn_0.2s_ease]"
            onMouseDown={e => { if (e.target === e.currentTarget) dismiss() }}>
            <div className="w-full max-w-md rounded-2xl bg-[#0B1040] border overflow-hidden shadow-[0_0_60px_rgba(0,0,0,0.6)] animate-[slideUp_0.3s_ease]"
                style={{ borderColor: cfg.glow }}>

                {/* Colored top strip */}
                <div className="h-1 w-full" style={{ background: `linear-gradient(90deg, ${cfg.color}, transparent)` }} />

                {/* Content */}
                <div className="p-6 relative">
                    {/* Close */}
                    <button onClick={dismiss}
                        className="absolute top-4 right-4 p-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-white/40 hover:text-white transition">
                        <X className="w-4 h-4" />
                    </button>

                    {/* Icon + Type */}
                    <div className="flex items-center gap-3 mb-4">
                        <div className="w-11 h-11 rounded-2xl flex items-center justify-center" style={{ background: cfg.bg }}>
                            <Icon className="w-5 h-5" style={{ color: cfg.color }} />
                        </div>
                        <div>
                            <span className="text-[10px] font-bold uppercase tracking-wider" style={{ color: cfg.color }}>
                                {popup.type} Notification
                            </span>
                            {popup.is_broadcast && (
                                <span className="ml-2 text-[9px] bg-white/5 px-1.5 py-0.5 rounded text-white/30 font-bold">BROADCAST</span>
                            )}
                        </div>
                    </div>

                    {/* Title */}
                    <h3 className="text-lg font-bold text-white mb-2 pr-6">{popup.title}</h3>

                    {/* Message */}
                    <p className="text-sm text-white/50 leading-relaxed whitespace-pre-wrap">{popup.message}</p>

                    {/* Dismiss button */}
                    <button onClick={dismiss}
                        className="mt-5 w-full py-3 rounded-xl text-sm font-bold transition"
                        style={{ background: cfg.bg, color: cfg.color, border: `1px solid ${cfg.glow}` }}>
                        Got it
                    </button>
                </div>
            </div>
        </div>
    )
}
