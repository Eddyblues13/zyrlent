import { useState, useEffect, useCallback } from 'react'
import { ChevronLeft, ChevronRight, CheckCircle, XCircle, Loader2, Clock } from 'lucide-react'
import adminApi from '../../../lib/adminAxios'
import toast from 'react-hot-toast'

export default function FundRequestsSection() {
    const [funds, setFunds] = useState([])
    const [meta, setMeta] = useState({})
    const [page, setPage] = useState(1)
    const [loading, setLoading] = useState(true)
    const [processing, setProcessing] = useState(null)
    const [rejectReason, setRejectReason] = useState('')
    const [showRejectFor, setShowRejectFor] = useState(null)

    const loadFunds = useCallback(() => {
        setLoading(true)
        adminApi.get('/api/admin/funds/pending', { params: { page, per_page: 15 } })
            .then(r => { setFunds(r.data.data); setMeta(r.data) })
            .catch(() => toast.error('Failed to load fund requests'))
            .finally(() => setLoading(false))
    }, [page])

    useEffect(() => { loadFunds() }, [loadFunds])

    const handleConfirm = async (txn) => {
        setProcessing(txn.id)
        try {
            const r = await adminApi.post(`/api/admin/funds/${txn.id}/confirm`)
            toast.success(r.data.message)
            loadFunds()
        } catch (err) { toast.error(err.response?.data?.message || 'Failed') }
        finally { setProcessing(null) }
    }

    const handleReject = async (txn) => {
        setProcessing(txn.id)
        try {
            await adminApi.post(`/api/admin/funds/${txn.id}/reject`, { reason: rejectReason })
            toast.success('Rejected')
            setShowRejectFor(null)
            setRejectReason('')
            loadFunds()
        } catch (err) { toast.error(err.response?.data?.message || 'Failed') }
        finally { setProcessing(null) }
    }

    return (
        <div className="space-y-6">
            <div className="flex items-center gap-3">
                <Clock className="w-5 h-5 text-[#FF9500]" />
                <h2 className="text-lg font-bold text-white">Pending Fund Requests</h2>
            </div>
            <div className="rounded-2xl border border-[rgba(255,255,255,0.06)] bg-[rgba(15,20,60,0.5)] backdrop-blur-xl overflow-hidden">
                {loading ? (
                    <div className="p-12 text-center"><Loader2 className="w-6 h-6 text-[#FF9500] animate-spin mx-auto" /></div>
                ) : funds.length === 0 ? (
                    <div className="p-12 text-center">
                        <CheckCircle className="w-8 h-8 text-green-400 mx-auto mb-3 opacity-50" />
                        <p className="text-sm text-white/30">No pending fund requests</p>
                    </div>
                ) : (
                    <div className="divide-y divide-white/5">
                        {funds.map(f => (
                            <div key={f.id} className="p-5 hover:bg-white/[0.02] transition">
                                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                                    <div className="flex items-center gap-3 min-w-0">
                                        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#FF9500] to-[#FF6B00] flex-shrink-0 flex items-center justify-center text-sm font-bold text-white">
                                            {f.user?.name?.[0]?.toUpperCase() || '?'}
                                        </div>
                                        <div className="min-w-0">
                                            <p className="text-sm text-white font-medium truncate">{f.user?.name}</p>
                                            <p className="text-xs text-white/30 truncate">{f.user?.email}</p>
                                        </div>
                                    </div>
                                    <div className="text-right flex-shrink-0">
                                        <p className="text-lg font-bold text-[#FF9500]">₦{Number(f.amount).toLocaleString()}</p>
                                        <p className="text-xs text-white/20">{new Date(f.created_at).toLocaleString()}</p>
                                    </div>
                                </div>
                                {f.reference && <p className="text-xs text-white/30 mt-2">Ref: <span className="font-mono text-white/50">{f.reference}</span></p>}
                                <div className="mt-4 flex flex-col sm:flex-row gap-2">
                                    <button onClick={() => handleConfirm(f)} disabled={processing === f.id}
                                        className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-green-500/10 border border-green-500/20 text-green-400 text-sm font-medium hover:bg-green-500/20 transition disabled:opacity-40">
                                        {processing === f.id ? <Loader2 className="w-4 h-4 animate-spin" /> : <CheckCircle className="w-4 h-4" />} Approve
                                    </button>
                                    {showRejectFor === f.id ? (
                                        <div className="flex-1 flex gap-2">
                                            <input placeholder="Reason" value={rejectReason} onChange={e => setRejectReason(e.target.value)}
                                                className="flex-1 px-3 py-2 rounded-xl bg-white/5 border border-white/10 text-sm text-white placeholder-white/25 focus:outline-none" />
                                            <button onClick={() => handleReject(f)} disabled={processing === f.id}
                                                className="px-4 py-2 rounded-xl bg-red-500/10 text-red-400 text-sm font-medium disabled:opacity-40">Confirm</button>
                                        </div>
                                    ) : (
                                        <button onClick={() => setShowRejectFor(f.id)}
                                            className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm font-medium hover:bg-red-500/20 transition">
                                            <XCircle className="w-4 h-4" /> Reject
                                        </button>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                )}
                {meta.last_page > 1 && (
                    <div className="flex items-center justify-between px-5 py-3 border-t border-white/5">
                        <span className="text-xs text-white/30">Page {meta.current_page} of {meta.last_page}</span>
                        <div className="flex gap-1.5">
                            <button disabled={page <= 1} onClick={() => setPage(p => p - 1)} className="p-2 rounded-lg hover:bg-white/5 text-white/30 disabled:opacity-20"><ChevronLeft className="w-4 h-4" /></button>
                            <button disabled={page >= meta.last_page} onClick={() => setPage(p => p + 1)} className="p-2 rounded-lg hover:bg-white/5 text-white/30 disabled:opacity-20"><ChevronRight className="w-4 h-4" /></button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    )
}
