import { useState, useEffect, useRef, useCallback } from 'react'
import { Plus, Eye, EyeOff, FileText, CheckCircle2, ArrowRight, Search, ChevronDown, ArrowUpRight, Zap, Shield, Globe, X, Loader2, Copy, Check, Smartphone, AlertCircle, Timer, Users, RotateCcw } from 'lucide-react'
import api from '../../../lib/axios'
import { ServiceIconWithFallback } from '../../../components/ServiceIcon'
import toast from 'react-hot-toast'

// ─── Searchable Dropdown ──────────────────────────────────────
function SearchableDropdown({ label, icon: Icon, items, selected, onSelect, onClear, searchPlaceholder, renderItem, renderSelected, loading }) {
    const [open, setOpen] = useState(false)
    const [search, setSearch] = useState('')
    const ref = useRef(null)

    useEffect(() => {
        const handler = (e) => {
            if (ref.current && !ref.current.contains(e.target)) setOpen(false)
        }
        document.addEventListener('mousedown', handler)
        return () => document.removeEventListener('mousedown', handler)
    }, [])

    const filtered = items.filter(item => {
        const q = search.toLowerCase()
        return (item.name || '').toLowerCase().includes(q) ||
            (item.category || '').toLowerCase().includes(q) ||
            (item.code || '').toLowerCase().includes(q)
    })

    return (
        <div>
            <label className="text-xs font-semibold text-white/50 uppercase tracking-wider ml-1 mb-2 block">{label}</label>
            <div className="relative" ref={ref}>
                <button
                    type="button"
                    onClick={() => setOpen(o => !o)}
                    className="w-full cursor-pointer transition-all hover:border-[rgba(0,255,255,0.4)] border border-[rgba(255,255,255,0.1)] bg-[rgba(255,255,255,0.04)] rounded-xl p-4 flex items-center justify-between text-left"
                >
                    <div className="flex items-center gap-3 min-w-0">
                        {selected ? renderSelected(selected) : (
                            <span className="text-sm text-white/30">Select {label.toLowerCase()}…</span>
                        )}
                    </div>
                    <div className="flex items-center gap-1.5 text-white/40 flex-shrink-0 ml-2">
                        {selected && (
                            <span onClick={(e) => { e.stopPropagation(); onClear(); }} className="hover:text-white/70 transition p-0.5">
                                <X className="w-3.5 h-3.5" />
                            </span>
                        )}
                        <Icon className="w-3.5 h-3.5" />
                        <ChevronDown className={`w-4 h-4 transition-transform ${open ? 'rotate-180' : ''}`} />
                    </div>
                </button>

                {open && (
                    <>
                        {/* Mobile Backdrop */}
                        <div className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm sm:hidden" onClick={() => setOpen(false)} />
                        
                        <div className="fixed inset-x-0 bottom-0 z-50 flex flex-col max-h-[85vh] rounded-t-3xl border-t border-x border-[rgba(255,255,255,0.12)] bg-[rgba(8,10,46,0.98)] backdrop-blur-xl shadow-[0_-20px_60px_rgba(0,0,0,0.8)] overflow-hidden sm:absolute sm:inset-auto sm:left-0 sm:top-full sm:mt-2 sm:w-full sm:max-h-[300px] sm:rounded-xl sm:border sm:shadow-[0_20px_60px_rgba(0,0,0,0.6)]">
                            {/* Mobile Drag Handle */}
                            <div className="flex justify-center pt-3 pb-1 sm:hidden bg-white/[0.02]">
                                <div className="w-12 h-1.5 rounded-full bg-white/20" />
                            </div>

                            {/* Search Sticky Header */}
                            <div className="p-4 sm:p-3 border-b border-white/8 bg-white/[0.02] sticky top-0 z-10">
                                <div className="relative">
                                    <Search className="absolute left-4 sm:left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
                                    <input
                                        type="text"
                                        placeholder={searchPlaceholder}
                                        value={search}
                                        onChange={e => setSearch(e.target.value)}
                                        className="w-full pl-11 sm:pl-9 pr-4 sm:pr-3 py-3 sm:py-2 rounded-xl sm:rounded-lg bg-white/[0.05] border border-white/10 text-[16px] sm:text-sm text-white placeholder-white/30 focus:outline-none focus:border-[rgba(0,255,255,0.3)] transition"
                                    />
                                </div>
                            </div>
                            
                            {/* Scrollable List */}
                            <div className="flex-1 overflow-y-auto w-full pb-6 sm:pb-0">
                                {loading ? (
                                    <div className="flex items-center justify-center py-10">
                                        <Loader2 className="w-6 h-6 text-[#00FFFF] animate-spin" />
                                    </div>
                                ) : filtered.length === 0 ? (
                                    <div className="py-8 text-center text-white/30 text-[15px] sm:text-sm">No results found</div>
                                ) : filtered.map(item => (
                                    <button
                                        key={item.id}
                                        onClick={() => { onSelect(item); setOpen(false); setSearch('') }}
                                        className={`w-full flex items-center justify-between px-5 sm:px-4 py-4 sm:py-3 text-left hover:bg-white/[0.06] transition border-b border-white/[0.02] last:border-0 ${selected?.id === item.id ? 'bg-[rgba(0,255,255,0.08)]' : ''}`}
                                    >
                                        {renderItem(item)}
                                        {selected?.id === item.id && (
                                            <CheckCircle2 className="w-5 h-5 sm:w-4 sm:h-4 text-[#00FFFF] flex-shrink-0 ml-2 shadow-[0_0_10px_rgba(0,255,255,0.2)] rounded-full" />
                                        )}
                                    </button>
                                ))}
                            </div>
                        </div>
                    </>
                )}
            </div>
        </div>
    )
}

// ─── Overview Section ─────────────────────────────────────────
export default function OverviewSection({ user, wallet, stats, formatNaira, onNavigate, onWalletUpdate }) {
    const [showBalance, setShowBalance] = useState(true)
    const [services, setServices] = useState([])
    const [countries, setCountries] = useState([])
    const [selectedService, setSelectedService] = useState(null)
    const [selectedCountry, setSelectedCountry] = useState(null)
    const [loadingServices, setLoadingServices] = useState(true)
    const [loadingCountries, setLoadingCountries] = useState(true)

    // ── Rental flow state ──
    const [rentStep, setRentStep] = useState('select') // select | confirm | active | done
    const [ordering, setOrdering] = useState(false)
    const [order, setOrder] = useState(null)
    const [cancelling, setCancelling] = useState(false)
    const [timeLeft, setTimeLeft] = useState(20 * 60)
    const [copiedNumber, setCopiedNumber] = useState(false)
    const [copiedCode, setCopiedCode] = useState(false)
    const pollRef = useRef(null)
    const timerRef = useRef(null)

    useEffect(() => {
        api.get('/api/services')
            .then(res => setServices(res.data || []))
            .catch(() => { })
            .finally(() => setLoadingServices(false))

        api.get('/api/countries')
            .then(res => setCountries(res.data || []))
            .catch(() => { })
            .finally(() => setLoadingCountries(false))
    }, [])

    // Cleanup on unmount
    useEffect(() => () => {
        clearInterval(pollRef.current)
        clearInterval(timerRef.current)
    }, [])

    const formatTime = (s) => `${Math.floor(s / 60).toString().padStart(2, '0')}:${(s % 60).toString().padStart(2, '0')}`

    const cost = parseFloat(selectedService?.cost || 0)
    const hasFunds = (wallet || 0) >= cost

    const handleClear = () => {
        setSelectedService(null)
        setSelectedCountry(null)
        setRentStep('select')
        setOrder(null)
        setOrdering(false)
        clearInterval(pollRef.current)
        clearInterval(timerRef.current)
    }

    const handleProceed = () => {
        if (!selectedService || !selectedCountry) {
            toast.error('Please select both a service and a country.')
            return
        }
        setRentStep('confirm')
    }

    const startPolling = useCallback((id) => {
        pollRef.current = setInterval(async () => {
            try {
                const res = await api.get(`/api/orders/${id}`)
                if (res.data.otp_code || ['expired', 'cancelled'].includes(res.data.status)) {
                    clearInterval(pollRef.current)
                    clearInterval(timerRef.current)
                    setOrder(res.data)
                    setRentStep('done')
                    if (res.data.otp_code) toast.success('🎉 SMS received!')
                }
            } catch { }
        }, 5000)
    }, [])

    const startTimer = useCallback(() => {
        setTimeLeft(20 * 60)
        timerRef.current = setInterval(() => setTimeLeft(p => {
            if (p <= 0) { clearInterval(timerRef.current); return 0 }
            return p - 1
        }), 1000)
    }, [])

    const handleConfirmOrder = async () => {
        setOrdering(true)
        try {
            const res = await api.post('/api/orders', {
                service_id: selectedService.id,
                country_id: selectedCountry.id,
            })
            const newOrder = res.data.order
            setOrder(newOrder)
            setRentStep('active')
            toast.success(res.data.message)
            if (onWalletUpdate && res.data.wallet_balance !== undefined) {
                onWalletUpdate(res.data.wallet_balance)
            }
            startTimer()
            startPolling(newOrder.id)
        } catch (e) {
            const data = e.response?.data
            if (e.response?.status === 422 && data?.balance !== undefined) {
                toast.error(`Need ${formatNaira(data.required)}, wallet has ${formatNaira(data.balance)}.`)
            } else {
                toast.error(data?.message || 'Failed to provision number')
            }
        } finally {
            setOrdering(false)
        }
    }

    const handleCancel = async () => {
        if (!order) return
        setCancelling(true)
        try {
            const res = await api.post(`/api/orders/${order.id}/cancel`)
            toast.success(res.data.message)
            clearInterval(pollRef.current)
            clearInterval(timerRef.current)
            setOrder(p => ({ ...p, status: 'cancelled' }))
            setRentStep('done')
            if (onWalletUpdate && res.data.wallet_balance !== undefined) {
                onWalletUpdate(res.data.wallet_balance)
            }
        } catch (e) {
            toast.error(e.response?.data?.message || 'Cancel failed')
        } finally {
            setCancelling(false)
        }
    }

    const handleGetAnother = () => {
        setSelectedService(null)
        setSelectedCountry(null)
        setOrder(null)
        setRentStep('select')
        setTimeLeft(20 * 60)
        clearInterval(pollRef.current)
        clearInterval(timerRef.current)
    }

    const copyText = (text, setter) => {
        navigator.clipboard.writeText(text)
        setter(true)
        toast.success('Copied!')
        setTimeout(() => setter(false), 2000)
    }

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
            <div className="rounded-2xl border border-[rgba(255,255,255,0.08)] bg-[rgba(15,20,60,0.5)]">
                {/* Card Header */}
                <div className="px-6 pt-6 pb-4">
                    <div className="flex items-center gap-3 mb-1">
                        <div className="w-8 h-8 rounded-lg bg-[rgba(0,255,255,0.1)] flex items-center justify-center">
                            <Zap className="w-4 h-4 text-[#00FFFF]" />
                        </div>
                        <h3 className="text-lg font-bold text-white">Get Verified Now</h3>
                    </div>
                    <p className="text-sm text-white/50 ml-11 leading-relaxed">
                        {rentStep === 'select' && 'Select a platform and country to rent a number instantly.'}
                        {rentStep === 'confirm' && 'Review your selection and confirm to get your number.'}
                        {rentStep === 'active' && 'Your number is live — waiting for SMS verification code.'}
                        {rentStep === 'done' && (order?.otp_code ? 'Verification code received! Copy it below.' : order?.status === 'cancelled' ? 'Order cancelled — your wallet has been refunded.' : 'Order expired — no SMS was received.')}
                    </p>
                </div>

                {/* Step indicator */}
                <div className="px-6 pb-4">
                    <div className="flex items-center gap-1">
                        {[
                            { key: 'select', label: 'Select' },
                            { key: 'confirm', label: 'Confirm' },
                            { key: 'active', label: 'Waiting' },
                            { key: 'done', label: 'Done' },
                        ].map((s, i, arr) => {
                            const stepOrder = ['select', 'confirm', 'active', 'done']
                            const currentIdx = stepOrder.indexOf(rentStep)
                            const thisIdx = i
                            const isDone = thisIdx < currentIdx
                            const isActive = thisIdx === currentIdx
                            return (
                                <div key={s.key} className="flex items-center flex-1 min-w-0">
                                    <div className="flex flex-col items-center flex-1 min-w-0">
                                        <div className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold border-2 transition-all duration-300 ${isDone ? 'bg-emerald-500 border-emerald-500 text-white'
                                            : isActive ? 'bg-[#33CCFF] border-[#33CCFF] text-black'
                                                : 'bg-transparent border-white/15 text-white/25'
                                            }`}>
                                            {isDone ? <Check className="w-3 h-3 stroke-[3]" /> : i + 1}
                                        </div>
                                        <span className={`text-[10px] font-semibold mt-1 ${isDone ? 'text-emerald-400' : isActive ? 'text-[#33CCFF]' : 'text-white/20'}`}>{s.label}</span>
                                    </div>
                                    {i < arr.length - 1 && (
                                        <div className={`h-0.5 flex-1 mx-1 rounded-full transition-all duration-500 ${isDone ? 'bg-emerald-500' : 'bg-white/8'}`} />
                                    )}
                                </div>
                            )
                        })}
                    </div>
                </div>

                <div className="h-px bg-white/[0.06]" />

                {/* ── STEP: Select ── */}
                {rentStep === 'select' && (
                    <div className="px-6 py-5">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 overflow-visible relative">
                            <div className="relative z-20">
                                <SearchableDropdown
                                    label="Select Service"
                                    icon={Search}
                                    items={services}
                                    selected={selectedService}
                                    onSelect={setSelectedService}
                                    onClear={() => setSelectedService(null)}
                                    searchPlaceholder="Search services (WhatsApp, Gmail…)"
                                    loading={loadingServices}
                                    renderSelected={(s) => (
                                        <div className="flex items-center gap-3 min-w-0">
                                            <ServiceIconWithFallback icon={s.icon} name={s.name} color={s.color} size="md" />
                                            <div className="min-w-0">
                                                <span className="font-semibold text-white/90 text-sm block truncate">{s.name}</span>
                                                <span className="text-xs text-[#00FFFF] font-medium">₦{parseFloat(s.cost).toLocaleString()}</span>
                                            </div>
                                        </div>
                                    )}
                                    renderItem={(s) => (
                                        <div className="flex items-center gap-3 min-w-0">
                                            <ServiceIconWithFallback icon={s.icon} name={s.name} color={s.color} size="md" />
                                            <div className="min-w-0">
                                                <p className="text-sm text-white font-medium truncate">{s.name}</p>
                                                <p className="text-xs text-white/40">{s.category} · ₦{parseFloat(s.cost).toLocaleString()}</p>
                                            </div>
                                        </div>
                                    )}
                                />
                            </div>
                            <div className="relative z-10">
                                <SearchableDropdown
                                    label="Select Country"
                                    icon={Globe}
                                    items={countries}
                                    selected={selectedCountry}
                                    onSelect={setSelectedCountry}
                                    onClear={() => setSelectedCountry(null)}
                                    searchPlaceholder="Search country…"
                                    loading={loadingCountries}
                                    renderSelected={(c) => (
                                        <div className="flex items-center gap-3 min-w-0">
                                            <span className="text-2xl flex-shrink-0">{c.flag}</span>
                                            <div className="min-w-0">
                                                <p className="font-semibold text-white/90 text-sm truncate">{c.name}</p>
                                                <p className="text-xs text-[#00FFFF] font-medium">{c.dial_code} · {c.success_rate}% Success</p>
                                            </div>
                                        </div>
                                    )}
                                    renderItem={(c) => (
                                        <div className="flex items-center gap-3 min-w-0">
                                            <span className="text-xl flex-shrink-0">{c.flag}</span>
                                            <div className="min-w-0">
                                                <p className="text-sm text-white font-medium truncate">{c.name}</p>
                                                <p className="text-xs text-white/40">{c.dial_code} · {c.success_rate}% Success</p>
                                            </div>
                                        </div>
                                    )}
                                />
                            </div>
                        </div>

                        <div className="flex flex-col sm:flex-row gap-3 mt-5">
                            <button
                                onClick={handleProceed}
                                disabled={!selectedService || !selectedCountry}
                                className="flex-1 py-3.5 rounded-xl bg-gradient-to-r from-[#0055CC] to-[#33CCFF] text-white font-bold text-sm shadow-[0_0_20px_rgba(0,102,255,0.3)] hover:shadow-[0_0_30px_rgba(0,102,255,0.5)] hover:scale-[1.01] transition-all flex items-center justify-center gap-2 disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:scale-100 disabled:hover:shadow-none group"
                            >
                                <Smartphone className="w-4 h-4" />
                                Get Number
                                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                            </button>
                            <button
                                onClick={handleClear}
                                className="sm:w-28 py-3.5 rounded-xl border border-white/10 bg-transparent text-white/60 font-semibold text-sm hover:bg-white/5 transition-all text-center"
                            >
                                Clear
                            </button>
                        </div>
                    </div>
                )}

                {/* ── STEP: Confirm ── */}
                {rentStep === 'confirm' && (
                    <div className="px-6 py-5">
                        {/* Summary */}
                        <div className="rounded-xl border border-white/10 bg-white/[0.03] overflow-hidden mb-4">
                            <div className="px-4 py-2.5 border-b border-white/8">
                                <p className="text-xs font-bold text-white/50 uppercase tracking-widest">Order Summary</p>
                            </div>
                            <div className="divide-y divide-white/[0.06]">
                                <div className="flex items-center justify-between px-4 py-3">
                                    <span className="text-sm text-white/50">Platform</span>
                                    <span className="flex items-center gap-2 text-sm font-semibold text-white">
                                        <ServiceIconWithFallback icon={selectedService?.icon} name={selectedService?.name} color={selectedService?.color} size="sm" />
                                        {selectedService?.name}
                                    </span>
                                </div>
                                <div className="flex items-center justify-between px-4 py-3">
                                    <span className="text-sm text-white/50">Country</span>
                                    <span className="flex items-center gap-2 text-sm font-semibold text-white">
                                        <span className="text-lg">{selectedCountry?.flag}</span>
                                        {selectedCountry?.name}
                                    </span>
                                </div>
                                <div className="flex items-center justify-between px-4 py-3">
                                    <span className="text-sm text-white/50">Price</span>
                                    <span className="text-sm font-bold text-emerald-400">{formatNaira(cost)}</span>
                                </div>
                                <div className="flex items-center justify-between px-4 py-3">
                                    <span className="text-sm text-white/50">Wallet</span>
                                    <span className={`text-sm font-bold ${hasFunds ? 'text-white' : 'text-red-400'}`}>{formatNaira(wallet)}</span>
                                </div>
                            </div>
                        </div>

                        {!hasFunds && (
                            <div className="flex items-start gap-2.5 p-3 rounded-xl bg-red-500/10 border border-red-500/25 mb-4">
                                <AlertCircle className="w-4 h-4 text-red-400 flex-shrink-0 mt-0.5" />
                                <div>
                                    <p className="text-sm text-red-400 font-semibold">Insufficient balance</p>
                                    <p className="text-xs text-red-400/70 mt-0.5">You need {formatNaira(cost)}, but you only have {formatNaira(wallet)}.</p>
                                </div>
                            </div>
                        )}

                        <div className="flex items-center gap-2 p-2.5 rounded-xl bg-emerald-500/8 border border-emerald-500/15 mb-5">
                            <Shield className="w-3.5 h-3.5 text-emerald-400 flex-shrink-0" />
                            <p className="text-[11px] text-emerald-400 font-medium">Your credits are deducted only after successful SMS delivery.</p>
                        </div>

                        <div className="flex flex-col sm:flex-row gap-3">
                            <button
                                onClick={handleConfirmOrder}
                                disabled={ordering || !hasFunds}
                                className="flex-1 py-3.5 rounded-xl bg-gradient-to-r from-[#0055CC] to-[#33CCFF] text-white font-bold text-sm shadow-[0_0_20px_rgba(0,102,255,0.35)] hover:shadow-[0_0_30px_rgba(0,102,255,0.55)] transition-all hover:scale-[1.01] disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:scale-100 flex items-center justify-center gap-2"
                            >
                                {ordering ? (
                                    <><Loader2 className="w-4 h-4 animate-spin" /> Provisioning…</>
                                ) : (
                                    <><Smartphone className="w-4 h-4" /> Confirm & Get Number</>
                                )}
                            </button>
                            <button
                                onClick={() => setRentStep('select')}
                                disabled={ordering}
                                className="sm:w-28 py-3.5 rounded-xl border border-white/10 bg-transparent text-white/50 font-semibold text-sm hover:bg-white/5 transition-all text-center disabled:opacity-40"
                            >
                                ← Back
                            </button>
                        </div>
                    </div>
                )}

                {/* ── STEP: Active (Waiting for SMS) ── */}
                {rentStep === 'active' && order && (
                    <div className="px-6 py-5 flex flex-col items-center gap-5">
                        {/* Animated hero */}
                        <div className="relative w-16 h-16">
                            <div className="w-16 h-16 rounded-full bg-gradient-to-br from-[#0055CC]/30 to-[#33CCFF]/10 border-2 border-[#33CCFF]/40 flex items-center justify-center shadow-[0_0_30px_rgba(51,204,255,0.2)]">
                                <Check className="w-7 h-7 text-[#33CCFF] stroke-[3]" />
                            </div>
                            <div className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full bg-emerald-500 flex items-center justify-center border-2 border-[#070D2E]">
                                <Zap className="w-3 h-3 text-white" />
                            </div>
                        </div>

                        <div className="text-center">
                            <h3 className="text-xl font-bold text-white mb-1">Number Ready! 🚀</h3>
                            <p className="text-sm text-white/40">Use this number for your {selectedService?.name} verification.</p>
                        </div>

                        {/* Phone number */}
                        <div className="w-full p-5 rounded-2xl border border-[rgba(51,204,255,0.25)] bg-[rgba(51,204,255,0.04)] text-center">
                            <p className="text-2xl sm:text-3xl font-bold text-white font-mono tracking-wider mb-3">{order.phone_number}</p>
                            <button onClick={() => copyText(order.phone_number, setCopiedNumber)}
                                className="inline-flex items-center gap-2 px-5 py-2 rounded-xl bg-gradient-to-r from-[#0055CC] to-[#0077EE] text-white text-sm font-bold hover:scale-[1.02] transition shadow-[0_0_12px_rgba(0,102,255,0.3)] border border-[#33CCFF]/20">
                                {copiedNumber ? <><Check className="w-4 h-4" /> Copied!</> : <><Copy className="w-4 h-4" /> Copy Number</>}
                            </button>
                        </div>

                        {/* Waiting indicator */}
                        <div className="flex flex-col items-center gap-2">
                            <div className="flex items-center gap-2.5 bg-[rgba(0,102,255,0.1)] px-4 py-2 rounded-full border border-[rgba(0,102,255,0.2)]">
                                <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 shadow-[0_0_10px_rgba(52,211,153,0.8)] animate-pulse" />
                                <span className="text-sm text-white/80 font-medium">Waiting for SMS…</span>
                            </div>
                            <p className="text-sm text-white/40">Expires in: <span className="font-bold text-white">{formatTime(timeLeft)}</span></p>
                            <p className="text-xs text-white/30">Code will appear here automatically once received.</p>
                        </div>

                        <button onClick={handleCancel} disabled={cancelling}
                            className="text-sm text-white/30 hover:text-red-400 transition underline underline-offset-4 disabled:opacity-50">
                            {cancelling ? 'Cancelling…' : "Didn't receive SMS? Cancel & get refund"}
                        </button>
                    </div>
                )}

                {/* ── STEP: Done (OTP received / cancelled / expired) ── */}
                {rentStep === 'done' && order && (
                    <div className="px-6 py-5 flex flex-col items-center gap-5">
                        {order.otp_code ? (
                            <>
                                {/* Success hero */}
                                <div className="relative w-16 h-16">
                                    <div className="w-16 h-16 rounded-full bg-gradient-to-br from-emerald-500/30 to-[#33CCFF]/10 border-2 border-emerald-400/40 flex items-center justify-center shadow-[0_0_30px_rgba(52,211,153,0.2)]">
                                        <CheckCircle2 className="w-7 h-7 text-emerald-400 stroke-[2.5]" />
                                    </div>
                                </div>

                                <div className="text-center">
                                    <h3 className="text-xl font-bold text-white mb-1">Verification Complete! ✅</h3>
                                    <p className="text-sm text-white/40">Your {selectedService?.name} code has been received.</p>
                                </div>

                                {/* Phone number */}
                                <div className="w-full p-4 rounded-xl border border-white/10 bg-white/[0.03] text-center">
                                    <p className="text-xs text-white/40 mb-1">Phone Number</p>
                                    <p className="text-lg font-bold text-white font-mono tracking-wider">{order.phone_number}</p>
                                </div>

                                {/* OTP Code */}
                                <div className="w-full p-5 rounded-2xl border border-[#FFB800]/30 bg-[rgba(255,184,0,0.04)] text-center relative">
                                    <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-0.5 rounded-full bg-[rgba(255,184,0,0.15)] border border-[#FFB800]/30">
                                        <span className="text-[10px] font-bold text-[#FFB800]">📩 SMS RECEIVED</span>
                                    </div>
                                    <p className="text-3xl sm:text-4xl font-bold text-[#33CCFF] font-mono tracking-[0.2em] mt-2 mb-4 drop-shadow-[0_0_15px_rgba(51,204,255,0.4)]">{order.otp_code}</p>
                                    <button onClick={() => copyText(order.otp_code, setCopiedCode)}
                                        className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#0055CC] to-[#0077EE] text-white text-sm font-bold hover:scale-[1.02] transition shadow-[0_0_12px_rgba(0,102,255,0.3)] border border-[#33CCFF]/20">
                                        {copiedCode ? <><Check className="w-4 h-4" /> Copied!</> : <><Copy className="w-4 h-4" /> Copy Code</>}
                                    </button>
                                </div>

                                {/* Get another */}
                                <button onClick={handleGetAnother}
                                    className="inline-flex items-center gap-2 px-6 py-3 rounded-xl border border-[rgba(0,255,255,0.3)] bg-[rgba(0,255,255,0.06)] text-[#00FFFF] font-bold text-sm hover:bg-[rgba(0,255,255,0.12)] transition-all group">
                                    <RotateCcw className="w-4 h-4" />
                                    Get Another Number
                                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                                </button>
                            </>
                        ) : (
                            <>
                                {/* Failed / cancelled / expired */}
                                <div className="w-full p-4 rounded-xl bg-red-500/8 border border-red-500/20 text-center">
                                    <p className="text-sm text-red-400 font-semibold">
                                        {order.status === 'cancelled'
                                            ? '❌ Order cancelled — your wallet has been refunded.'
                                            : '⏰ Number expired — no SMS was received. Refund processed.'}
                                    </p>
                                </div>
                                <button onClick={handleGetAnother}
                                    className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-[#0055CC] to-[#33CCFF] text-white font-bold text-sm shadow-[0_0_15px_rgba(0,102,255,0.3)] hover:shadow-[0_0_25px_rgba(0,102,255,0.5)] hover:scale-[1.02] transition-all">
                                    <RotateCcw className="w-4 h-4" />
                                    Try Again
                                </button>
                            </>
                        )}
                    </div>
                )}
            </div>
        </div>
    )
}
