import { useState, useEffect } from 'react'
import { Gift, Copy, Check, Users, Award, Banknote, Share2, ExternalLink } from 'lucide-react'
import api from '../../../lib/axios'

export default function ReferralSection() {
    const [data, setData] = useState(null)
    const [loading, setLoading] = useState(true)
    const [copied, setCopied] = useState(false)

    useEffect(() => {
        fetchReferralData()
    }, [])

    const fetchReferralData = async () => {
        try {
            const res = await api.get('/api/referrals')
            setData(res.data)
        } catch (err) {
            console.error('Failed to load referral data', err)
        } finally {
            setLoading(false)
        }
    }

    const copyLink = () => {
        if (data?.referral_link) {
            navigator.clipboard.writeText(data.referral_link)
            setCopied(true)
            setTimeout(() => setCopied(false), 2000)
        }
    }

    const shareWhatsApp = () => {
        const text = `Join Zyrlent and get verified numbers instantly! Sign up with my referral link: ${data?.referral_link}`
        window.open(`https://wa.me/?text=${encodeURIComponent(text)}`, '_blank')
    }

    const shareTwitter = () => {
        const text = `Join Zyrlent and get verified numbers instantly! Sign up with my referral link:`
        window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(data?.referral_link || '')}`, '_blank')
    }

    if (loading) {
        return (
            <div className="flex items-center justify-center py-20">
                <div className="w-8 h-8 border-2 border-[#00FFFF]/30 border-t-[#00FFFF] rounded-full animate-spin" />
            </div>
        )
    }

    const stats = data?.stats || { total_invited: 0, total_qualified: 0, total_earned: 0 }
    const referrals = data?.referrals || []

    return (
        <div className="space-y-6 max-w-3xl mx-auto">
            {/* ── Hero Card ── */}
            <div className="relative overflow-hidden rounded-2xl border border-white/10 bg-gradient-to-br from-[#0D1147] via-[#111555] to-[#0A0E40] p-6 sm:p-8">
                {/* Glow decoration */}
                <div className="absolute -top-20 -right-20 w-60 h-60 bg-[#00FFFF]/8 rounded-full blur-3xl" />
                <div className="absolute -bottom-16 -left-16 w-48 h-48 bg-purple-500/8 rounded-full blur-3xl" />

                <div className="relative z-10">
                    <div className="flex items-center gap-3 mb-4">
                        <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[#00FFFF]/20 to-[#00FFFF]/5 flex items-center justify-center border border-[#00FFFF]/20">
                            <Gift className="w-6 h-6 text-[#00FFFF]" />
                        </div>
                        <div>
                            <h2 className="text-xl font-bold text-white">Refer & Earn</h2>
                            <p className="text-sm text-white/50">Invite friends, earn credits</p>
                        </div>
                    </div>

                    <p className="text-white/70 text-sm leading-relaxed mb-6">
                        Share your referral link with friends. When they join Zyrlent and fund their wallet with at least
                        <span className="text-[#00FFFF] font-bold"> ₦10,000</span>, you'll receive
                        <span className="text-green-400 font-bold"> ₦2,000</span> in credits!
                    </p>

                    {/* Referral Link */}
                    <div className="bg-white/5 rounded-xl border border-white/10 p-4 mb-4">
                        <label className="text-xs font-semibold text-white/40 uppercase tracking-wider mb-2 block">Your Referral Link</label>
                        <div className="flex items-center gap-2">
                            <div className="flex-1 bg-white/5 rounded-lg px-3 py-2.5 text-sm text-white/80 font-mono truncate border border-white/8">
                                {data?.referral_link || '...'}
                            </div>
                            <button
                                onClick={copyLink}
                                className={`flex items-center gap-1.5 px-4 py-2.5 rounded-lg text-sm font-semibold transition-all ${copied
                                        ? 'bg-green-500/20 text-green-400 border border-green-500/30'
                                        : 'bg-[#00FFFF]/15 text-[#00FFFF] border border-[#00FFFF]/25 hover:bg-[#00FFFF]/25'
                                    }`}
                            >
                                {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                                {copied ? 'Copied!' : 'Copy'}
                            </button>
                        </div>
                    </div>

                    {/* Referral Code Badge */}
                    <div className="flex items-center gap-2 mb-5">
                        <span className="text-xs text-white/40">Your code:</span>
                        <span className="px-3 py-1 rounded-full bg-[#00FFFF]/10 text-[#00FFFF] text-sm font-bold border border-[#00FFFF]/20">
                            {data?.referral_code || '...'}
                        </span>
                    </div>

                    {/* Share Buttons */}
                    <div className="flex flex-wrap gap-2">
                        <button
                            onClick={shareWhatsApp}
                            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-green-600/20 text-green-400 text-sm font-semibold border border-green-600/25 hover:bg-green-600/30 transition"
                        >
                            <Share2 className="w-4 h-4" />
                            WhatsApp
                        </button>
                        <button
                            onClick={shareTwitter}
                            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-sky-500/20 text-sky-400 text-sm font-semibold border border-sky-500/25 hover:bg-sky-500/30 transition"
                        >
                            <ExternalLink className="w-4 h-4" />
                            Twitter / X
                        </button>
                        <button
                            onClick={copyLink}
                            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white/8 text-white/70 text-sm font-semibold border border-white/12 hover:bg-white/14 transition"
                        >
                            <Copy className="w-4 h-4" />
                            Copy Link
                        </button>
                    </div>
                </div>
            </div>

            {/* ── Stats Cards ── */}
            <div className="grid grid-cols-3 gap-3">
                {[
                    { label: 'Friends Invited', value: stats.total_invited, icon: Users, color: 'from-blue-500/20 to-blue-600/10', iconColor: 'text-blue-400', borderColor: 'border-blue-500/20' },
                    { label: 'Qualified', value: stats.total_qualified, icon: Award, color: 'from-purple-500/20 to-purple-600/10', iconColor: 'text-purple-400', borderColor: 'border-purple-500/20' },
                    { label: 'Credits Earned', value: `₦${(stats.total_earned || 0).toLocaleString()}`, icon: Banknote, color: 'from-green-500/20 to-green-600/10', iconColor: 'text-green-400', borderColor: 'border-green-500/20' },
                ].map((stat) => (
                    <div key={stat.label} className={`rounded-2xl border ${stat.borderColor} bg-gradient-to-br ${stat.color} p-4 text-center`}>
                        <stat.icon className={`w-5 h-5 ${stat.iconColor} mx-auto mb-2`} />
                        <p className="text-xl font-bold text-white">{stat.value}</p>
                        <p className="text-[11px] text-white/40 font-medium mt-0.5">{stat.label}</p>
                    </div>
                ))}
            </div>

            {/* ── How It Works ── */}
            <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-5">
                <h3 className="text-sm font-bold text-white mb-4">How It Works</h3>
                <div className="space-y-4">
                    {[
                        { step: '1', title: 'Invite a Friend', desc: 'Share your unique referral link with friends and family' },
                        { step: '2', title: 'They Fund Their Wallet', desc: 'Your friend signs up and funds their wallet with at least ₦10,000' },
                        { step: '3', title: 'Earn ₦2,000 Credits', desc: 'You receive ₦2,000 in referral credits within 24 hours!' },
                    ].map((item) => (
                        <div key={item.step} className="flex items-start gap-3">
                            <div className="w-7 h-7 rounded-full bg-[#00FFFF]/15 flex items-center justify-center flex-shrink-0 border border-[#00FFFF]/20">
                                <span className="text-xs font-bold text-[#00FFFF]">{item.step}</span>
                            </div>
                            <div>
                                <p className="text-sm font-semibold text-white">{item.title}</p>
                                <p className="text-xs text-white/40 mt-0.5">{item.desc}</p>
                            </div>
                        </div>
                    ))}
                </div>

                <div className="mt-4 px-3 py-2.5 rounded-xl bg-amber-500/10 border border-amber-500/20">
                    <p className="text-xs text-amber-400/80 leading-relaxed">
                        <strong>Note:</strong> Referral credits can be used for all Zyrlent services but are not eligible for cash withdrawal.
                    </p>
                </div>
            </div>

            {/* ── Referral History ── */}
            {referrals.length > 0 && (
                <div className="rounded-2xl border border-white/10 bg-white/[0.03] overflow-hidden">
                    <div className="p-4 border-b border-white/8">
                        <h3 className="text-sm font-bold text-white">Your Referrals</h3>
                    </div>
                    <div className="divide-y divide-white/6">
                        {referrals.map((ref) => (
                            <div key={ref.id} className="flex items-center justify-between p-4">
                                <div className="flex items-center gap-3">
                                    <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#33CCFF]/20 to-[#0066CC]/20 flex items-center justify-center text-xs font-bold text-[#00FFFF] border border-[#00FFFF]/15">
                                        {ref.name?.[0]?.toUpperCase() || '?'}
                                    </div>
                                    <div>
                                        <p className="text-sm font-semibold text-white">{ref.name}</p>
                                        <p className="text-xs text-white/30">{ref.joined_at}</p>
                                    </div>
                                </div>
                                <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${ref.status === 'credited'
                                        ? 'bg-green-500/15 text-green-400 border border-green-500/20'
                                        : ref.status === 'qualified'
                                            ? 'bg-blue-500/15 text-blue-400 border border-blue-500/20'
                                            : 'bg-white/8 text-white/40 border border-white/12'
                                    }`}>
                                    {ref.status}
                                </span>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    )
}
