import { useState, useEffect, useCallback } from 'react'
import {
    ChevronLeft, ChevronRight, Loader2, Bell, Send, Mail,
    Globe, Info, AlertTriangle, Megaphone, X, Pencil, Trash2,
    Link2, Eye, EyeOff
} from 'lucide-react'
import adminApi from '../../../lib/adminAxios'
import toast from 'react-hot-toast'

const typeIcon = { info: Info, warning: AlertTriangle, promo: Megaphone, system: Globe }
const typeColor = {
    info:    'bg-blue-500/10 text-blue-400 border-blue-500/20',
    warning: 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20',
    promo:   'bg-purple-500/10 text-purple-400 border-purple-500/20',
    system:  'bg-white/5 text-white/40 border-white/10',
}

const inputCls = 'w-full px-3 py-2.5 rounded-xl bg-white/5 border border-white/10 text-sm text-white placeholder-white/25 focus:outline-none focus:border-[rgba(255,149,0,0.4)]'

export default function NotificationsSection() {
    const [notifications, setNotifications] = useState([])
    const [meta, setMeta] = useState({})
    const [page, setPage] = useState(1)
    const [loading, setLoading] = useState(true)
    const [tab, setTab] = useState('compose')

    // Compose state
    const [title, setTitle] = useState('')
    const [message, setMessage] = useState('')
    const [type, setType] = useState('info')
    const [linkUrl, setLinkUrl] = useState('')
    const [linkLabel, setLinkLabel] = useState('')
    const [sending, setSending] = useState(false)

    // Email blast state
    const [emailSubject, setEmailSubject] = useState('')
    const [emailBody, setEmailBody] = useState('')
    const [emailSending, setEmailSending] = useState(false)

    // Edit modal state
    const [editModal, setEditModal] = useState(null)
    const [editSaving, setEditSaving] = useState(false)
    const [editForm, setEditForm] = useState({ title: '', message: '', type: 'info', link_url: '', link_label: '' })

    // Delete confirm
    const [deleteConfirm, setDeleteConfirm] = useState(null)
    const [deleting, setDeleting] = useState(false)

    const loadNotifications = useCallback(() => {
        setLoading(true)
        adminApi.get('/api/admin/notifications', { params: { page, per_page: 15 } })
            .then(r => { setNotifications(r.data.data); setMeta(r.data) })
            .catch(() => toast.error('Failed to load notifications'))
            .finally(() => setLoading(false))
    }, [page])

    useEffect(() => { if (tab === 'history') loadNotifications() }, [loadNotifications, tab])

    // ─── Broadcast ───
    const handleBroadcast = async () => {
        if (!title || !message) return toast.error('Fill in title and message')
        setSending(true)
        try {
            const r = await adminApi.post('/api/admin/notifications/broadcast', {
                title, message, type,
                link_url: linkUrl || null,
                link_label: linkLabel || null,
            })
            toast.success(r.data.message)
            setTitle(''); setMessage(''); setLinkUrl(''); setLinkLabel('')
        } catch (e) { toast.error(e.response?.data?.message || 'Failed') }
        finally { setSending(false) }
    }

    // ─── Email Blast ───
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

    // ─── Edit ───
    const openEdit = (n) => {
        setEditForm({ title: n.title, message: n.message, type: n.type, link_url: n.link_url || '', link_label: n.link_label || '' })
        setEditModal(n)
    }
    const saveEdit = async () => {
        if (!editForm.title || !editForm.message) return toast.error('Title and message required')
        setEditSaving(true)
        try {
            const r = await adminApi.put(`/api/admin/notifications/${editModal.id}`, {
                ...editForm,
                link_url: editForm.link_url || null,
                link_label: editForm.link_label || null,
            })
            toast.success(r.data.message)
            setNotifications(prev => prev.map(n => n.id === editModal.id ? r.data.notification : n))
            setEditModal(null)
        } catch (e) { toast.error(e.response?.data?.message || 'Failed') }
        finally { setEditSaving(false) }
    }

    // ─── Delete ───
    const confirmDelete = async () => {
        setDeleting(true)
        try {
            await adminApi.delete(`/api/admin/notifications/${deleteConfirm.id}`)
            toast.success('Notification deleted')
            setNotifications(prev => prev.filter(n => n.id !== deleteConfirm.id))
            setDeleteConfirm(null)
        } catch (e) { toast.error(e.response?.data?.message || 'Failed') }
        finally { setDeleting(false) }
    }

    // ─── Toggle Active ───
    const toggleActive = async (n) => {
        try {
            const r = await adminApi.post(`/api/admin/notifications/${n.id}/toggle-active`)
            toast.success(r.data.message)
            setNotifications(prev => prev.map(x => x.id === n.id ? r.data.notification : x))
        } catch (e) { toast.error(e.response?.data?.message || 'Failed') }
    }

    return (
        <div className="space-y-6">
            {/* Tab Buttons */}
            <div className="flex gap-2">
                {[
                    { id: 'compose', label: 'Compose', icon: Send },
                    { id: 'history', label: 'History', icon: Bell },
                ].map(t => (
                    <button key={t.id} onClick={() => setTab(t.id)}
                        className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium transition border ${tab === t.id ? 'bg-[rgba(255,149,0,0.12)] border-[rgba(255,149,0,0.3)] text-[#FF9500]' : 'bg-white/[0.03] border-white/5 text-white/40'}`}>
                        <t.icon className="w-4 h-4" /> {t.label}
                    </button>
                ))}
            </div>

            {/* ═══ Compose Tab ═══ */}
            {tab === 'compose' && (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Broadcast Notification */}
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

                        <input placeholder="Notification Title" value={title} onChange={e => setTitle(e.target.value)} className={inputCls} />
                        <textarea placeholder="Notification message..." rows={4} value={message} onChange={e => setMessage(e.target.value)} className={`${inputCls} resize-none`} />

                        {/* Type selector */}
                        <div className="flex gap-2 flex-wrap">
                            {Object.keys(typeIcon).map(t => {
                                const Icon = typeIcon[t]
                                return (
                                    <button key={t} onClick={() => setType(t)}
                                        className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold transition border ${type === t ? typeColor[t] : 'bg-white/[0.03] border-white/5 text-white/30'}`}>
                                        <Icon className="w-3.5 h-3.5" /> {t.charAt(0).toUpperCase() + t.slice(1)}
                                    </button>
                                )
                            })}
                        </div>

                        {/* Link fields */}
                        <div className="space-y-2 pt-1">
                            <label className="flex items-center gap-1.5 text-[10px] uppercase font-bold text-white/30 tracking-wider">
                                <Link2 className="w-3 h-3" /> Link Button (optional)
                            </label>
                            <div className="grid grid-cols-2 gap-2">
                                <input placeholder="https://example.com" value={linkUrl} onChange={e => setLinkUrl(e.target.value)} className={inputCls} />
                                <input placeholder="Button Label" value={linkLabel} onChange={e => setLinkLabel(e.target.value)} className={inputCls} />
                            </div>
                        </div>

                        <button onClick={handleBroadcast} disabled={sending}
                            className="w-full py-3 rounded-xl bg-gradient-to-r from-[#FF9500] to-[#FF6B00] text-white text-sm font-bold flex items-center justify-center gap-2 hover:shadow-[0_0_20px_rgba(255,149,0,0.3)] transition disabled:opacity-40">
                            {sending ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
                            Send to All Users
                        </button>
                    </div>

                    {/* Email Blast */}
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

            {/* ═══ History Tab ═══ */}
            {tab === 'history' && (
                <div className="rounded-2xl border border-[rgba(255,255,255,0.06)] bg-[rgba(15,20,60,0.5)] backdrop-blur-xl">
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
                                        <div key={n.id} className={`p-4 sm:p-5 hover:bg-white/[0.02] transition ${!n.is_active ? 'opacity-50' : ''}`}>
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
                                                        {!n.is_active && (
                                                            <span className="text-[9px] px-1.5 py-0.5 rounded bg-red-500/10 text-red-400 font-bold">INACTIVE</span>
                                                        )}
                                                        {n.link_url && (
                                                            <span className="text-[9px] px-1.5 py-0.5 rounded bg-green-500/10 text-green-400 font-bold flex items-center gap-1">
                                                                <Link2 className="w-2.5 h-2.5" /> Link
                                                            </span>
                                                        )}
                                                    </div>
                                                    <p className="text-xs text-white/50 line-clamp-2">{n.message}</p>
                                                    {n.link_url && (
                                                        <p className="text-[10px] text-blue-400/60 mt-1 truncate">{n.link_label || n.link_url}</p>
                                                    )}
                                                    <div className="flex items-center gap-3 mt-2">
                                                        {!n.is_broadcast && n.user && (
                                                            <span className="text-[10px] text-white/25">To: {n.user.name}</span>
                                                        )}
                                                        <span className="text-[10px] text-white/15">{new Date(n.created_at).toLocaleString()}</span>
                                                    </div>

                                                    {/* Horizontal inline actions */}
                                                    <div className="flex items-center gap-1.5 mt-3 pt-2 border-t border-white/5">
                                                        <button onClick={() => openEdit(n)}
                                                            className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-white/[0.04] hover:bg-white/[0.08] border border-white/5 text-[10px] font-bold text-white/40 hover:text-white transition">
                                                            <Pencil className="w-3 h-3" /> Edit
                                                        </button>
                                                        <button onClick={() => toggleActive(n)}
                                                            className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg border text-[10px] font-bold transition ${n.is_active
                                                                ? 'bg-green-500/5 hover:bg-green-500/10 border-green-500/10 text-green-400/60 hover:text-green-400'
                                                                : 'bg-yellow-500/5 hover:bg-yellow-500/10 border-yellow-500/10 text-yellow-400/60 hover:text-yellow-400'
                                                            }`}>
                                                            {n.is_active
                                                                ? <><EyeOff className="w-3 h-3" /> Deactivate</>
                                                                : <><Eye className="w-3 h-3" /> Activate</>
                                                            }
                                                        </button>
                                                        <button onClick={() => setDeleteConfirm(n)}
                                                            className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-red-500/5 hover:bg-red-500/10 border border-red-500/10 text-[10px] font-bold text-red-400/50 hover:text-red-400 transition">
                                                            <Trash2 className="w-3 h-3" /> Delete
                                                        </button>
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

            {/* ═══ Edit Modal ═══ */}
            {editModal && (
                <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
                    onMouseDown={e => { if (e.target === e.currentTarget) setEditModal(null) }}>
                    <div className="w-full max-w-lg rounded-2xl bg-[#0B1040] border border-[rgba(255,149,0,0.2)] shadow-2xl overflow-hidden">
                        <div className="h-1 w-full bg-gradient-to-r from-[#FF9500] to-transparent" />
                        <div className="p-6 space-y-4">
                            <div className="flex items-center justify-between">
                                <h3 className="text-sm font-bold text-white flex items-center gap-2">
                                    <Pencil className="w-4 h-4 text-[#FF9500]" /> Edit Notification
                                </h3>
                                <button onClick={() => setEditModal(null)}
                                    className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-white/40 hover:text-white transition">
                                    <X className="w-4 h-4" />
                                </button>
                            </div>

                            <input placeholder="Title" value={editForm.title} onChange={e => setEditForm(f => ({ ...f, title: e.target.value }))} className={inputCls} />
                            <textarea placeholder="Message" rows={3} value={editForm.message} onChange={e => setEditForm(f => ({ ...f, message: e.target.value }))} className={`${inputCls} resize-none`} />

                            <div className="flex gap-2 flex-wrap">
                                {Object.keys(typeIcon).map(t => {
                                    const TI = typeIcon[t]
                                    return (
                                        <button key={t} onClick={() => setEditForm(f => ({ ...f, type: t }))}
                                            className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold transition border ${editForm.type === t ? typeColor[t] : 'bg-white/[0.03] border-white/5 text-white/30'}`}>
                                            <TI className="w-3.5 h-3.5" /> {t.charAt(0).toUpperCase() + t.slice(1)}
                                        </button>
                                    )
                                })}
                            </div>

                            <div className="space-y-2 pt-1">
                                <label className="flex items-center gap-1.5 text-[10px] uppercase font-bold text-white/30 tracking-wider">
                                    <Link2 className="w-3 h-3" /> Link Button (optional)
                                </label>
                                <div className="grid grid-cols-2 gap-2">
                                    <input placeholder="https://..." value={editForm.link_url} onChange={e => setEditForm(f => ({ ...f, link_url: e.target.value }))} className={inputCls} />
                                    <input placeholder="Label" value={editForm.link_label} onChange={e => setEditForm(f => ({ ...f, link_label: e.target.value }))} className={inputCls} />
                                </div>
                            </div>

                            <div className="flex gap-2 pt-2">
                                <button onClick={() => setEditModal(null)}
                                    className="flex-1 py-2.5 rounded-xl bg-white/5 border border-white/10 text-sm text-white/40 hover:text-white hover:bg-white/10 transition font-medium">
                                    Cancel
                                </button>
                                <button onClick={saveEdit} disabled={editSaving}
                                    className="flex-1 py-2.5 rounded-xl bg-gradient-to-r from-[#FF9500] to-[#FF6B00] text-white text-sm font-bold flex items-center justify-center gap-2 hover:shadow-[0_0_20px_rgba(255,149,0,0.3)] transition disabled:opacity-40">
                                    {editSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Save Changes'}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* ═══ Delete Confirmation Modal ═══ */}
            {deleteConfirm && (
                <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
                    onMouseDown={e => { if (e.target === e.currentTarget) setDeleteConfirm(null) }}>
                    <div className="w-full max-w-sm rounded-2xl bg-[#0B1040] border border-red-500/20 shadow-2xl overflow-hidden">
                        <div className="h-1 w-full bg-gradient-to-r from-red-500 to-transparent" />
                        <div className="p-6 space-y-4 text-center">
                            <div className="w-12 h-12 rounded-2xl bg-red-500/10 flex items-center justify-center mx-auto">
                                <Trash2 className="w-5 h-5 text-red-400" />
                            </div>
                            <div>
                                <h3 className="text-sm font-bold text-white mb-1">Delete Notification?</h3>
                                <p className="text-xs text-white/40">&quot;{deleteConfirm.title}&quot; will be permanently removed.</p>
                            </div>
                            <div className="flex gap-2">
                                <button onClick={() => setDeleteConfirm(null)}
                                    className="flex-1 py-2.5 rounded-xl bg-white/5 border border-white/10 text-sm text-white/40 hover:text-white hover:bg-white/10 transition font-medium">
                                    Cancel
                                </button>
                                <button onClick={confirmDelete} disabled={deleting}
                                    className="flex-1 py-2.5 rounded-xl bg-gradient-to-r from-red-500 to-red-600 text-white text-sm font-bold flex items-center justify-center gap-2 hover:shadow-[0_0_20px_rgba(239,68,68,0.3)] transition disabled:opacity-40">
                                    {deleting ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Delete'}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}
