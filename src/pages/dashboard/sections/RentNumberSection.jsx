import { useState, useEffect, useRef, useCallback } from 'react'
import {
    Search, ChevronRight, ChevronLeft, CheckCircle2, Clock,
    Smartphone, Globe, Loader2, Copy, Check, AlertCircle, RefreshCw, X
} from 'lucide-react'
import api from '../../../lib/axios'
import { ServiceIconWithFallback } from '../../../components/ServiceIcon'
import toast from 'react-hot-toast'

const STEP_LABELS = ['Select Service', 'Choose Country', 'Confirm & Get Number']

// ─── Step 1: Service Selection ────────────────────────────────
function ServiceStep({ onSelect, selected }) {
    const [services, setServices] = useState([])
    const [loading, setLoading] = useState(true)
    const [search, setSearch] = useState('')
    const [category, setCategory] = useState('All')
    const [categories, setCategories] = useState(['All'])

    useEffect(() => {
        api.get('/api/services')
            .then(res => {
                const data = res.data || []
                setServices(data)
                const cats = ['All', ...new Set(data.map(s => s.category))]
                setCategories(cats)
            })
            .catch(() => toast.error('Failed to load services'))
            .finally(() => setLoading(false))
    }, [])

    const filtered = services.filter(s => {
        const matchCat = category === 'All' || s.category === category
        const matchSearch = s.name.toLowerCase().includes(search.toLowerCase())
        return matchCat && matchSearch
    })

    return (
        <div className="flex flex-col gap-4">
            <div className="flex flex-col gap-3">
                <div className="relative">
                    <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
                    <input type="text" placeholder="Search service (WhatsApp, Gmail…)"
                        value={search} onChange={e => setSearch(e.target.value)}
                        className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-[rgba(255,255,255,0.05)] border border-[rgba(255,255,255,0.1)] text-white placeholder-white/25 text-sm focus:outline-none focus:border-[rgba(0,255,255,0.35)] transition" />
                </div>
                <div className="flex gap-2 overflow-x-auto no-scrollbar pb-1">
                    {categories.map(cat => (
                        <button key={cat} onClick={() => setCategory(cat)}
                            className={`px-3.5 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap border transition ${category === cat
                                ? 'bg-[rgba(0,255,255,0.15)] text-[#00FFFF] border-[rgba(0,255,255,0.4)]'
                                : 'bg-[rgba(255,255,255,0.05)] text-white/50 border-transparent hover:text-white'
                                }`}>
                            {cat}
                        </button>
                    ))}
                </div>
            </div>

            {loading ? (
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                    {Array.from({ length: 6 }).map((_, i) => <div key={i} className="h-24 rounded-xl bg-white/5 animate-pulse" />)}
                </div>
            ) : (
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 max-h-[380px] overflow-y-auto no-scrollbar pr-1">
                    {filtered.map(service => {
                        const isSelected = selected?.id === service.id
                        return (
                            <button key={service.id} onClick={() => onSelect(service)}
                                className={`relative p-4 rounded-xl border text-left transition-all ${isSelected
                                    ? 'border-[rgba(0,255,255,0.5)] bg-[rgba(0,255,255,0.08)] shadow-[0_0_12px_rgba(0,255,255,0.1)]'
                                    : 'border-[rgba(255,255,255,0.08)] bg-[rgba(15,20,60,0.5)] hover:border-white/20 hover:bg-[rgba(25,30,80,0.5)]'
                                    }`}>
                                {isSelected && (
                                    <CheckCircle2 className="absolute top-2.5 right-2.5 w-4 h-4 text-[#00FFFF]" />
                                )}
                                <div className="mb-2.5">
                                    <ServiceIconWithFallback icon={service.icon} name={service.name} color={service.color} size="lg" />
                                </div>
                                <p className="text-sm font-bold text-white">{service.name}</p>
                                <p className="text-xs text-[#00FFFF] font-semibold mt-0.5">₦{parseFloat(service.cost).toLocaleString()}</p>
                            </button>
                        )
                    })}
                </div>
            )}
        </div>
    )
}

// ─── Step 2: Country Selection ────────────────────────────────
function CountryStep({ onSelect, selected }) {
    const [countries, setCountries] = useState([])
    const [loading, setLoading] = useState(true)
    const [search, setSearch] = useState('')

    useEffect(() => {
        api.get('/api/countries')
            .then(res => setCountries(res.data || []))
            .catch(() => toast.error('Failed to load countries'))
            .finally(() => setLoading(false))
    }, [])

    const filtered = countries.filter(c =>
        c.name.toLowerCase().includes(search.toLowerCase()) ||
        c.code?.toLowerCase().includes(search.toLowerCase())
    )

    return (
        <div className="flex flex-col gap-4">
            <div className="relative">
                <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
                <input type="text" placeholder="Search country…"
                    value={search} onChange={e => setSearch(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-[rgba(255,255,255,0.05)] border border-[rgba(255,255,255,0.1)] text-white placeholder-white/25 text-sm focus:outline-none focus:border-[rgba(0,255,255,0.35)] transition" />
            </div>
            {loading ? (
                <div className="flex flex-col gap-2">{Array.from({ length: 5 }).map((_, i) => <div key={i} className="h-14 rounded-xl bg-white/5 animate-pulse" />)}</div>
            ) : (
                <div className="flex flex-col gap-2 max-h-[380px] overflow-y-auto no-scrollbar">
                    {filtered.map(country => {
                        const isSelected = selected?.id === country.id
                        return (
                            <button key={country.id} onClick={() => onSelect(country)}
                                className={`flex items-center justify-between p-3.5 rounded-xl border text-left transition-all ${isSelected
                                    ? 'border-[rgba(0,255,255,0.5)] bg-[rgba(0,255,255,0.08)]'
                                    : 'border-[rgba(255,255,255,0.08)] bg-[rgba(15,20,60,0.4)] hover:border-white/20 hover:bg-white/5'
                                    }`}>
                                <div className="flex items-center gap-3">
                                    <span className="text-2xl">{country.flag}</span>
                                    <div>
                                        <p className="text-sm font-semibold text-white">{country.name}</p>
                                        <p className="text-xs text-white/40">{country.dial_code} · {country.twilio_code}</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-3">
                                    <div className="text-right">
                                        <p className="text-xs font-bold text-white/60">{country.success_rate}%</p>
                                        <p className="text-[10px] text-white/30">Success</p>
                                    </div>
                                    {isSelected && <CheckCircle2 className="w-5 h-5 text-[#00FFFF] flex-shrink-0" />}
                                </div>
                            </button>
                        )
                    })}
                </div>
            )}
        </div>
    )
}

// ─── Step 3: Confirm + Receive OTP ───────────────────────────
function ConfirmStep({ service, country, wallet, formatNaira, onSuccess, onCancel }) {
    const [loading, setLoading] = useState(false)
    const [order, setOrder] = useState(null)
    const [polling, setPolling] = useState(false)
    const [pollCount, setPollCount] = useState(0)
    const [copied, setCopied] = useState(false)
    const [cancelling, setCancelling] = useState(false)
    const pollRef = useRef(null)

    const hasSufficientBalance = (wallet || 0) >= parseFloat(service?.cost || 0)

    // OTP polling — every 5s for up to 20 minutes (240 polls)
    const startPolling = useCallback((orderId) => {
        setPolling(true)
        pollRef.current = setInterval(async () => {
            setPollCount(p => p + 1)
            try {
                const res = await api.get(`/api/orders/${orderId}`)
                if (res.data.otp_code) {
                    clearInterval(pollRef.current)
                    setPolling(false)
                    setOrder(res.data)
                    toast.success('🎉 OTP received!')
                } else if (res.data.status === 'expired' || res.data.status === 'cancelled') {
                    clearInterval(pollRef.current)
                    setPolling(false)
                    setOrder(res.data)
                }
            } catch (e) {
                // keep polling on network error
            }
        }, 5000)
    }, [])

    useEffect(() => () => clearInterval(pollRef.current), [])

    const handleSubmit = async () => {
        setLoading(true)
        try {
            const res = await api.post('/api/orders', {
                service_id: service.id,
                country_id: country.id,
            })
            const newOrder = res.data.order
            setOrder(newOrder)
            toast.success(res.data.message)
            if (onSuccess) onSuccess(res.data.wallet_balance)
            startPolling(newOrder.id)
        } catch (e) {
            const msg = e.response?.data?.message || 'Failed to provision number'
            if (e.response?.status === 422 && e.response?.data?.balance !== undefined) {
                toast.error(`Insufficient balance. You need ${formatNaira(e.response.data.required)}, you have ${formatNaira(e.response.data.balance)}.`)
            } else {
                toast.error(msg)
            }
        } finally {
            setLoading(false)
        }
    }

    const handleCancel = async () => {
        if (!order) return
        setCancelling(true)
        try {
            const res = await api.post(`/api/orders/${order.id}/cancel`)
            toast.success(res.data.message)
            clearInterval(pollRef.current)
            setPolling(false)
            setOrder(p => ({ ...p, status: 'cancelled' }))
            if (onSuccess) onSuccess(res.data.wallet_balance)
        } catch (e) {
            toast.error(e.response?.data?.message || 'Cancel failed')
        } finally {
            setCancelling(false)
        }
    }

    const copy = (text) => {
        navigator.clipboard.writeText(text)
        setCopied(true)
        toast.success('Copied!')
        setTimeout(() => setCopied(false), 2000)
    }

    return (
        <div className="flex flex-col gap-5">
            {/* Order summary */}
            <div className="p-4 rounded-xl border border-[rgba(255,255,255,0.1)] bg-[rgba(15,20,60,0.5)] flex flex-col gap-3">
                <p className="text-xs font-bold text-white/35 uppercase tracking-widest">Order Summary</p>
                {[
                    { label: 'Service', value: <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full" style={{ background: service?.color }} />{service?.name}</span> },
                    { label: 'Country', value: `${country?.flag} ${country?.name} (${country?.dial_code})` },
                    { label: 'Cost', value: <span className="text-[#00FFFF] font-bold">{formatNaira(service?.cost)}</span> },
                    { label: 'Wallet', value: <span className={hasSufficientBalance ? 'text-emerald-400' : 'text-red-400 font-bold'}>{formatNaira(wallet)}</span> },
                    { label: 'Expires', value: `${20} min after provisioning` },
                ].map(row => (
                    <div key={row.label} className="flex items-center justify-between text-sm">
                        <span className="text-white/50">{row.label}</span>
                        <span className="font-semibold text-white">{row.value}</span>
                    </div>
                ))}
            </div>

            {/* Insufficient balance warning */}
            {!hasSufficientBalance && (
                <div className="flex items-start gap-3 p-3.5 rounded-xl bg-red-400/8 border border-red-400/20">
                    <AlertCircle className="w-4 h-4 text-red-400 mt-0.5 flex-shrink-0" />
                    <div>
                        <p className="text-sm font-bold text-red-400">Insufficient balance</p>
                        <p className="text-xs text-white/50 mt-0.5">
                            You need {formatNaira(service?.cost)} but your wallet has {formatNaira(wallet)}.{' '}
                            <button onClick={() => onCancel('fund-wallet')} className="text-[#00FFFF] underline">Fund your wallet</button>
                        </p>
                    </div>
                </div>
            )}

            {/* If order placed — show phone number + OTP state */}
            {order && (
                <div className="rounded-xl border border-[rgba(0,255,255,0.2)] bg-[rgba(0,255,255,0.04)] p-5">
                    <p className="text-xs font-bold text-[#00FFFF] uppercase tracking-widest mb-3">Your Rented Number</p>
                    <div className="flex items-center gap-3 mb-4">
                        <div className="flex-1">
                            <p className="text-2xl font-bold text-white tracking-widest font-mono">{order.phone_number}</p>
                            <p className="text-xs text-white/40 font-mono mt-0.5">{order.order_ref}</p>
                        </div>
                        <button onClick={() => copy(order.phone_number)}
                            className="p-2.5 rounded-xl bg-[rgba(0,255,255,0.1)] border border-[rgba(0,255,255,0.25)] text-[#00FFFF] hover:bg-[rgba(0,255,255,0.2)] transition">
                            {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                        </button>
                    </div>

                    {/* OTP received */}
                    {order.otp_code ? (
                        <div className="p-3.5 rounded-xl bg-emerald-500/10 border border-emerald-500/25">
                            <p className="text-xs font-bold text-emerald-400 mb-1.5 flex items-center gap-1.5">
                                <CheckCircle2 className="w-3.5 h-3.5" /> OTP Received!
                            </p>
                            <p className="text-base font-mono text-white break-all">{order.otp_code}</p>
                        </div>
                    ) : order.status === 'cancelled' ? (
                        <div className="p-3.5 rounded-xl bg-white/5 border border-white/10">
                            <p className="text-sm text-white/50 text-center">Order cancelled</p>
                        </div>
                    ) : order.status === 'expired' ? (
                        <div className="p-3.5 rounded-xl bg-red-400/8 border border-red-400/20">
                            <p className="text-sm text-red-400 font-semibold text-center">Number expired — no OTP received</p>
                        </div>
                    ) : (
                        <div className="flex items-center gap-3 text-sm text-white/50">
                            <Loader2 className="w-4 h-4 animate-spin text-[#00FFFF] flex-shrink-0" />
                            <span>Waiting for OTP… Use the number above to verify your {service?.name} account</span>
                        </div>
                    )}

                    {/* Cancel button while pending */}
                    {order.status === 'pending' && (
                        <button onClick={handleCancel} disabled={cancelling}
                            className="mt-3 w-full py-2 rounded-xl text-sm font-semibold text-red-400/80 hover:text-red-400 border border-red-400/20 hover:bg-red-400/8 transition disabled:opacity-50">
                            {cancelling ? 'Cancelling…' : 'Cancel & Refund'}
                        </button>
                    )}
                </div>
            )}

            {/* CTA */}
            {!order && (
                <button onClick={handleSubmit} disabled={loading || !hasSufficientBalance}
                    className="w-full py-4 rounded-xl font-bold text-base flex items-center justify-center gap-2 transition-all bg-gradient-to-r from-[#33CCFF] to-[#0066CC] text-white shadow-[0_0_20px_rgba(0,255,255,0.2)] hover:shadow-[0_0_30px_rgba(0,255,255,0.4)] hover:scale-[1.01] disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:scale-100 disabled:hover:shadow-none">
                    {loading
                        ? <><Loader2 className="w-5 h-5 animate-spin" />Provisioning number…</>
                        : <><Smartphone className="w-5 h-5" />Get My Number</>
                    }
                </button>
            )}
        </div>
    )
}

// ─── Main Component ───────────────────────────────────────────
export default function RentNumberSection({ wallet, formatNaira, onNavigate }) {
    const [step, setStep] = useState(0)
    const [service, setService] = useState(null)
    const [country, setCountry] = useState(null)
    const [currentWallet, setCurrentWallet] = useState(wallet)

    // Sync external wallet changes
    useEffect(() => { setCurrentWallet(wallet) }, [wallet])

    const handleServiceSelect = (s) => { setService(s) }
    const handleCountrySelect = (c) => { setCountry(c) }

    const canProceed = [
        !!service,
        !!country,
        true,
    ]

    return (
        <div className="flex flex-col gap-6 max-w-2xl">
            {/* Header */}
            <div>
                <h2 className="text-2xl font-bold text-white flex items-center gap-2">
                    <Smartphone className="w-6 h-6 text-[#00FFFF]" /> Rent a Number
                </h2>
                <p className="text-white/40 text-sm mt-0.5">Get a temporary phone number to receive OTP codes</p>
            </div>

            {/* Step indicator */}
            <div className="flex items-center gap-2">
                {STEP_LABELS.map((label, i) => (
                    <div key={i} className="flex items-center gap-2 flex-1">
                        <div className={`w-7 h-7 rounded-full text-xs font-bold flex items-center justify-center flex-shrink-0 transition-all ${i < step
                            ? 'bg-[#00FFFF] text-[#0A0B3D]'
                            : i === step
                                ? 'bg-[rgba(0,255,255,0.2)] text-[#00FFFF] border border-[rgba(0,255,255,0.5)]'
                                : 'bg-white/10 text-white/30'
                            }`}>
                            {i < step ? <Check className="w-3.5 h-3.5" /> : i + 1}
                        </div>
                        <span className={`text-xs font-semibold whitespace-nowrap hidden sm:block ${i === step ? 'text-white' : i < step ? 'text-white/60' : 'text-white/25'}`}>
                            {label}
                        </span>
                        {i < STEP_LABELS.length - 1 && (
                            <div className={`flex-1 h-px mx-1 transition-colors ${i < step ? 'bg-[#00FFFF]/50' : 'bg-white/10'}`} />
                        )}
                    </div>
                ))}
            </div>

            {/* Step content */}
            <div className="rounded-2xl border border-[rgba(255,255,255,0.08)] bg-[rgba(15,20,60,0.4)] p-5">
                {step === 0 && <ServiceStep onSelect={handleServiceSelect} selected={service} />}
                {step === 1 && <CountryStep onSelect={handleCountrySelect} selected={country} />}
                {step === 2 && (
                    <ConfirmStep
                        service={service}
                        country={country}
                        wallet={currentWallet}
                        formatNaira={formatNaira}
                        onSuccess={(newBalance) => { if (newBalance !== undefined) setCurrentWallet(newBalance) }}
                        onCancel={(section) => { if (section === 'fund-wallet') onNavigate('fund-wallet') }}
                    />
                )}
            </div>

            {/* Navigation */}
            <div className="flex items-center gap-3">
                {step > 0 && (
                    <button onClick={() => setStep(s => s - 1)}
                        className="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-white/10 text-white/60 hover:text-white hover:bg-white/8 transition text-sm font-semibold">
                        <ChevronLeft className="w-4 h-4" /> Back
                    </button>
                )}
                {step < STEP_LABELS.length - 1 && (
                    <button
                        disabled={!canProceed[step]}
                        onClick={() => setStep(s => s + 1)}
                        className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl font-bold text-sm transition-all bg-gradient-to-r from-[#33CCFF] to-[#0066CC] text-white shadow-[0_0_15px_rgba(0,255,255,0.2)] hover:shadow-[0_0_25px_rgba(0,255,255,0.35)] disabled:opacity-40 disabled:cursor-not-allowed hover:scale-[1.01] disabled:hover:scale-100">
                        {step === 0
                            ? service ? `Continue with ${service.name}` : 'Select a service first'
                            : 'Review Order'}
                        <ChevronRight className="w-4 h-4" />
                    </button>
                )}
            </div>
        </div>
    )
}
