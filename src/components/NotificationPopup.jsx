import { useState, useEffect, useRef } from 'react'
import { X, Info, AlertTriangle, Megaphone, Globe, ExternalLink } from 'lucide-react'
import api from '../lib/axios'

const typeConfig = {
    info:    { icon: Info, color: '#33CCFF', bg: 'rgba(51,204,255,0.12)', glow: 'rgba(51,204,255,0.15)' },
    warning: { icon: AlertTriangle, color: '#FFD60A', bg: 'rgba(255,214,10,0.12)', glow: 'rgba(255,214,10,0.15)' },
    promo:   { icon: Megaphone, color: '#AF52DE', bg: 'rgba(175,82,222,0.12)', glow: 'rgba(175,82,222,0.15)' },
    system:  { icon: Globe, color: '#0099FF', bg: 'rgba(0,153,255,0.12)', glow: 'rgba(0,153,255,0.15)' },
}

export default function NotificationPopup({ onCountChange }) {
    const [popup, setPopup] = useState(null)
    const [queue, setQueue] = useState([])
    const dismissedIds = useRef(new Set())
    const didInitial = useRef(false)

    useEffect(() => {
        const poll = () => {
            api.get('/api/notifications', { params: { per_page: 10 } })
                .then(r => {
                    const list = r.data?.data ?? []
                    onCountChange?.(list.length)

                    // Find notifications not yet dismissed in this session
                    const fresh = list.filter(n => !dismissedIds.current.has(n.id))

                    if (fresh.length > 0) {
                        if (!didInitial.current) {
                            didInitial.current = true
                            // On first load, show only the most recent one
                            const first = fresh[0]
                            dismissedIds.current.add(first.id)
                            // Mark the rest as seen so they don't pile up on load
                            fresh.slice(1).forEach(n => dismissedIds.current.add(n.id))
                            setQueue(prev => [...prev, first])
                        } else {
                            // On subsequent polls, show any new notifications
                            fresh.forEach(n => dismissedIds.current.add(n.id))
                            setQueue(prev => [...prev, ...fresh])
                        }
                    } else if (!didInitial.current) {
                        didInitial.current = true
                    }
                })
                .catch(() => {})
        }
        poll()
        const interval = setInterval(poll, 30000)
        return () => clearInterval(interval)
    }, [onCountChange])

    useEffect(() => {
        if (!popup && queue.length > 0) {
            setPopup(queue[0])
            setQueue(prev => prev.slice(1))
        }
    }, [popup, queue])

    const dismiss = () => {
        setPopup(null)
    }

    if (!popup) return null

    const cfg = typeConfig[popup.type] || typeConfig.info
    const Icon = cfg.icon
    const hasLink = popup.link_url

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

                    {/* Link Button */}
                    {hasLink && (
                        <a href={popup.link_url} target="_blank" rel="noopener noreferrer"
                            className="mt-4 flex items-center justify-center gap-2 w-full py-3 rounded-xl text-sm font-bold transition hover:brightness-125"
                            style={{
                                background: `linear-gradient(135deg, ${cfg.color}20, ${cfg.color}10)`,
                                color: cfg.color,
                                border: `1px solid ${cfg.glow}`,
                            }}>
                            <ExternalLink className="w-4 h-4" />
                            {popup.link_label || 'Open Link'}
                        </a>
                    )}

                    {/* Dismiss button */}
                    <button onClick={dismiss}
                        className={`${hasLink ? 'mt-3' : 'mt-5'} w-full py-3 rounded-xl text-sm font-bold transition`}
                        style={{ background: cfg.bg, color: cfg.color, border: `1px solid ${cfg.glow}` }}>
                        Got it
                    </button>
                </div>
            </div>
        </div>
    )
}
