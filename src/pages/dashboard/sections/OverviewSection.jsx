import { useState, useEffect, useRef, useCallback } from 'react'
import { Plus, Eye, EyeOff, FileText, CheckCircle2, ArrowRight, Search, ChevronDown, ArrowUpRight, Zap, Shield, Globe, X, Loader2, Copy, Check, Smartphone, AlertCircle, Timer, Users, RotateCcw } from 'lucide-react'
import api from '../../../lib/axios'
import { ServiceIconWithFallback } from '../../../components/ServiceIcon'
import toast from 'react-hot-toast'
import { RentNumberModal } from './RentNumberSection'

// ─── Overview Section ─────────────────────────────────────────
// Searchable Dropdown Removed
export default function OverviewSection({ user, wallet, stats, formatNaira, onNavigate, onWalletUpdate }) {
    const [showBalance, setShowBalance] = useState(true)

    return (
        <div className="flex flex-col gap-8">
            {/* Sticky greeting */}
            <div className="sticky top-[61px] z-30 bg-[rgba(8,10,46,0.97)] backdrop-blur-xl -mx-4 sm:-mx-6 lg:-mx-8 px-4 sm:px-6 lg:px-8 pt-4 pb-4 border-b border-white/[0.05]">
                <h2 className="text-2xl lg:text-3xl font-bold flex items-center gap-2">
                    <span role="img" aria-label="wave">👋</span> Hi, {user?.name?.split(' ')[0]}
                </h2>
                <p className="text-white/50 mt-1 text-sm">Ready to verify some numbers today?</p>
            </div>

            {/* Main Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

                {/* Wallet Card */}
                <div className="lg:col-span-1 relative rounded-2xl bg-gradient-to-br from-[rgba(15,20,60,0.9)] to-[rgba(10,11,61,0.98)] border border-[rgba(0,255,255,0.2)] p-6 overflow-hidden">
                    <div className="absolute -top-8 -right-8 w-28 h-28 bg-[#00FFFF]/15 blur-3xl rounded-full" />
                    <div className="absolute bottom-0 left-0 w-24 h-24 bg-[#0099FF]/10 blur-3xl rounded-full" />
                    <div className="relative z-10">
                        <div className="flex items-center justify-between mb-1">
                            <p className="text-sm font-medium text-white/60">Wallet Balance</p>
                            <button
                                onClick={() => setShowBalance(b => !b)}
                                className="text-white/40 hover:text-white transition"
                            >
                                {showBalance ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                            </button>
                        </div>
                        <h1 className="text-3xl lg:text-4xl font-bold mb-5 tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-white to-[#00FFFF]">
                            {showBalance ? formatNaira(wallet) : '₦ ••••••'}
                        </h1>
                        <button
                            onClick={() => onNavigate('fund-wallet')}
                            className="w-full py-3 rounded-xl bg-gradient-to-r from-[#33CCFF] to-[#0066CC] text-white font-bold text-sm shadow-[0_0_15px_rgba(0,255,255,0.25)] hover:shadow-[0_0_22px_rgba(0,255,255,0.45)] hover:scale-[1.02] transition-all flex items-center justify-center gap-2"
                        >
                            <Plus className="w-4 h-4" />
                            Fund Wallet
                        </button>
                        <div className="mt-4 pt-4 border-t border-white/10 flex items-center justify-between text-xs text-white/40">
                            <span>Last updated just now</span>
                            <span className="text-[#00FFFF] flex items-center gap-1 cursor-pointer hover:underline" onClick={() => onNavigate('transactions')}>
                                View history <ArrowUpRight className="w-3 h-3" />
                            </span>
                        </div>
                    </div>
                </div>

                {/* Stats Cards */}
                <div className="lg:col-span-2 grid grid-cols-2 gap-4">
                    {[
                        { icon: FileText, label: 'Transactions', value: stats.transactions, color: '#00FFFF', bg: 'rgba(0,255,255,0.08)' },
                        { icon: CheckCircle2, label: 'Verifications', value: stats.verifications, color: '#33CCFF', bg: 'rgba(51,204,255,0.08)' },
                        { icon: null, label: 'Total Spent', value: formatNaira(stats.total_spent), color: '#0099FF', bg: 'rgba(0,153,255,0.08)', naira: true },
                        { icon: null, label: 'Pending SMS', value: stats.pending_sms, color: '#00FFFF', bg: 'rgba(0,255,255,0.06)', spin: true },
                    ].map((stat, i) => (
                        <div
                            key={i}
                            className="rounded-xl border border-[rgba(255,255,255,0.08)] bg-[rgba(15,20,60,0.5)] p-4 transition-all"
                        >
                            <div className="w-9 h-9 rounded-lg flex items-center justify-center mb-3" style={{ background: stat.bg }}>
                                {stat.spin
                                    ? <span className="text-base" style={{ color: stat.color }}>↻</span>
                                    : stat.naira
                                        ? <span className="text-base font-bold" style={{ color: stat.color }}>₦</span>
                                        : <stat.icon className="w-4 h-4" style={{ color: stat.color }} />
                                }
                            </div>
                            <p className="text-[11px] font-semibold text-white/40 uppercase tracking-wider mb-1">{stat.label}</p>
                            <h4 className="text-xl font-bold text-white truncate">{stat.value}</h4>
                        </div>
                    ))}
                </div>
            </div>

            {/* ────────────────────────────────────────────────────
                 Quick Verify — Complete Inline Rental Flow
                 ──────────────────────────────────────────────────── */}
            <RentNumberModal 
                wallet={wallet}
                formatNaira={formatNaira}
                onClose={() => {}}
                onSuccess={onWalletUpdate}
                inline={true}
            />
        </div>
    )
}
