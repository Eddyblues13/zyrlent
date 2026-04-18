import { useState, useEffect, useRef, useCallback } from 'react'
import {
    Search, ChevronRight, Check, CheckCircle2,
    Smartphone, Loader2, Copy, AlertCircle, Star,
    Zap, Shield, Users, X, TrendingUp, ChevronDown, XCircle,
    Timer, Quote, Sparkles
} from 'lucide-react'
import api from '../../../lib/axios'
import { ServiceIconWithFallback } from '../../../components/ServiceIcon'
import toast from 'react-hot-toast'

// ─── Modal Step Indicator ──────────────────────────────────────
const STEPS = [
    { full: 'Select Service', short: 'Service' },
    { full: 'Select Country', short: 'Country' },
    { full: 'Select Operator', short: 'Operator' },
    { full: 'Confirm', short: 'Confirm' },
]

const STEP_MICROCOPY = [
    '4 steps to get your number',
    'Almost there! 3 steps left',
    'Almost there! 2 steps left',
    'Last step! Confirm to get your number 🚀',
]

function ModalStepBar({ step }) {
    return (
        <div className="flex flex-col gap-2 w-full">
            <div className="flex items-center w-full">
                {STEPS.map((s, i) => {
                    const done = i < step
                    const active = i === step
                    return (
                        <div key={s.full} className="flex items-center flex-1 min-w-0">
                            <div className="flex flex-col items-center flex-1 min-w-0">
                                <div className={`w-5 h-5 sm:w-6 sm:h-6 rounded-full flex items-center justify-center text-[9px] sm:text-[10px] font-bold flex-shrink-0 border-2 transition-all duration-300 ${done ? 'bg-emerald-500 border-emerald-500 text-white'
                                    : active ? 'bg-[#33CCFF] border-[#33CCFF] text-black'
                                        : 'bg-transparent border-white/20 text-white/30'
                                    }`}>
                                    {done ? <Check className="w-2.5 h-2.5 stroke-[3]" /> : i + 1}
                                </div>
                                <span className={`hidden sm:block text-[10px] font-semibold mt-1 text-center leading-tight ${done ? 'text-emerald-400' : active ? 'text-[#33CCFF]' : 'text-white/25'
                                    }`}>{s.short}</span>
                            </div>
                            {i < STEPS.length - 1 && (
                                <div className={`h-0.5 flex-1 mx-1 rounded-full transition-all duration-500 ${done ? 'bg-emerald-500' : 'bg-white/10'
                                    }`} />
                            )}
                        </div>
                    )
                })}
            </div>
            {/* Progress microcopy — completion incentive */}
            <p className="text-[11px] text-center font-medium text-[#33CCFF]/70 animate-pulse">
                {STEP_MICROCOPY[Math.min(step, 3)]}
            </p>
        </div>
    )
}

// ─── Service Row ───────────────────────────────────────────────
function ServiceRow({ service, selected, onSelect, rank }) {
    const isSelected = selected?.id === service.id
    return (
        <button onClick={() => onSelect(service)}
            className={`flex items-center gap-3 w-full p-3 rounded-xl border text-left transition-all group ${isSelected
                ? 'border-[rgba(51,204,255,0.5)] bg-[rgba(51,204,255,0.1)]'
                : 'border-white/8 bg-white/[0.03] hover:border-white/18 hover:bg-white/[0.07]'
                }`}>
            <ServiceIconWithFallback icon={service.icon} name={service.name} color={service.color} size="md" />
            <div className="flex-1 min-w-0">
                <p className="text-sm font-bold text-white truncate">{service.name}</p>
                <p className="text-xs text-white/35 mt-0.5">{service.category || 'Verification'}</p>
            </div>
            {rank && <span className="text-[9px] font-bold text-white/25 tracking-wide flex-shrink-0">#{rank}</span>}
            <div className={`w-5 h-5 rounded-full border-2 flex-shrink-0 flex items-center justify-center transition-all ${isSelected ? 'border-[#33CCFF] bg-[#33CCFF]' : 'border-white/20 group-hover:border-white/40'}`}>
                {isSelected && <Check className="w-3 h-3 text-black stroke-[3]" />}
            </div>
        </button>
    )
}

// ─── Step 1: Select Service ────────────────────────────────────
function ServiceStep({ onSelect, selected }) {
    const [services, setServices] = useState([])
    const [loading, setLoading] = useState(true)
    const [search, setSearch] = useState('')

    useEffect(() => {
        api.get('/api/services')
            .then(res => setServices(res.data || []))
            .catch(() => toast.error('Failed to load services'))
            .finally(() => setLoading(false))
    }, [])

    const filtered = services.filter(s => s.name.toLowerCase().includes(search.toLowerCase()))

    // Custom popular order as requested: WhatsApp, Telegram, Instagram, TikTok, Facebook
    const POPULAR_ORDER = ['whatsapp', 'telegram', 'instagram', 'tiktok', 'facebook']
    const popular = services.filter(s => POPULAR_ORDER.some(name => s.name.toLowerCase().includes(name))).sort((a, b) => {
        const aIdx = POPULAR_ORDER.findIndex(name => a.name.toLowerCase().includes(name))
        const bIdx = POPULAR_ORDER.findIndex(name => b.name.toLowerCase().includes(name))
        return aIdx - bIdx
    })
    const others = services.filter(s => !POPULAR_ORDER.some(name => s.name.toLowerCase().includes(name)))

    return (
        <div className="flex flex-col step-animate h-full">
            {/* Sticky top area — stays fixed while services scroll beneath */}
            <div className="sticky top-0 z-10 bg-[#070D2E] pb-3 flex flex-col gap-3">
                <p className="text-sm text-white/45">Choose the service you want to verify.</p>

                <div className="flex items-center justify-center gap-2 py-2 px-4 rounded-full bg-emerald-500/10 border border-emerald-500/20 self-center">
                    <Shield className="w-3.5 h-3.5 text-emerald-400 flex-shrink-0" />
                    <span className="text-[11px] font-semibold text-emerald-400">Verified & trusted by millions worldwide</span>
                </div>

                {/* Testimonial snippet — social proof */}
                <div className="flex items-start gap-2.5 p-3 rounded-xl bg-white/[0.03] border border-white/8">
                    <Quote className="w-4 h-4 text-[#33CCFF]/50 flex-shrink-0 mt-0.5" />
                    <div>
                        <p className="text-[11px] text-white/50 italic leading-relaxed">"Fast, reliable, and easy – saved me hours!"</p>
                        <p className="text-[10px] text-white/25 mt-0.5 font-semibold">— Verified User ⭐⭐⭐⭐⭐</p>
                    </div>
                </div>

                <div className="relative">
                    <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
                    <input type="text" placeholder="Search (Instagram, TikTok, Facebook…)"
                        value={search} onChange={e => setSearch(e.target.value)}
                        className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white placeholder-white/25 text-sm focus:outline-none focus:border-[rgba(51,204,255,0.4)] transition" />
                </div>
            </div>

            {/* Scrollable service list */}
            <div className="flex-1 overflow-y-auto pt-1">
                {loading ? (
                    <div className="flex flex-col gap-2">{Array.from({ length: 5 }).map((_, i) => <div key={i} className="h-13 rounded-xl bg-white/5 animate-pulse" />)}</div>
                ) : search ? (
                    <div className="flex flex-col gap-2">
                        {filtered.map(s => <ServiceRow key={s.id} service={s} selected={selected} onSelect={onSelect} />)}
                        {filtered.length === 0 && <p className="text-center text-white/30 text-sm py-6">No services found</p>}
                    </div>
                ) : (
                    <div className="flex flex-col gap-4">
                        {popular.length > 0 && (
                            <div>
                                <div className="flex items-center gap-2 mb-2">
                                    <Star className="w-3.5 h-3.5 text-yellow-400" />
                                    <span className="text-xs font-bold text-white/50 uppercase tracking-widest">Most Popular</span>
                                </div>
                                <div className="flex flex-col gap-2">
                                    {popular.map((s, i) => <ServiceRow key={s.id} service={s} selected={selected} onSelect={onSelect} rank={i + 1} />)}
                                </div>
                            </div>
                        )}
                        {others.length > 0 && (
                            <div>
                                <div className="flex items-center gap-2 mb-2 mt-2">
                                    <Sparkles className="w-3.5 h-3.5 text-white/30" />
                                    <span className="text-xs font-bold text-white/50 uppercase tracking-widest">All Services</span>
                                </div>
                                <div className="flex flex-col gap-2">
                                    {others.map(s => <ServiceRow key={s.id} service={s} selected={selected} onSelect={onSelect} />)}
                                </div>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    )
}

// ─── Countdown Timer Hook (cosmetic FOMO) ──────────────────────
function useCountdownTimer(minutes = 15) {
    const [timeLeft, setTimeLeft] = useState(minutes * 60)
    useEffect(() => {
        const interval = setInterval(() => setTimeLeft(p => p <= 0 ? minutes * 60 : p - 1), 1000)
        return () => clearInterval(interval)
    }, [minutes])
    return `${Math.floor(timeLeft / 60).toString().padStart(2, '0')}:${(timeLeft % 60).toString().padStart(2, '0')}`
}

// ─── Country Card with optional countdown ──────────────────────
function CountryCard({ country, isSelected, onSelect, countdown }) {
    const available = country.available_numbers ?? 200
    const successRate = parseFloat(country.success_rate || 95)
    return (
        <button onClick={() => onSelect(country)}
            className={`flex flex-col items-start gap-1 p-3 rounded-xl border text-left transition-all relative hover:scale-[1.02] ${isSelected
                ? 'border-[rgba(51,204,255,0.5)] bg-[rgba(51,204,255,0.1)] shadow-[0_0_12px_rgba(51,204,255,0.12)]'
                : 'border-white/8 bg-white/[0.03] hover:border-white/20 hover:bg-white/[0.07]'
                }`}>
            {isSelected && (
                <div className="absolute top-2 right-2 w-4 h-4 rounded-full bg-[#33CCFF] flex items-center justify-center">
                    <Check className="w-2.5 h-2.5 text-black stroke-[3]" />
                </div>
            )}
            <span className="text-2xl">{country.flag}</span>
            <p className="text-xs font-bold text-white leading-tight">{country.name}</p>
            <div className="flex items-center gap-1.5">
                <p className="text-[11px] text-emerald-400/80">{successRate}% success</p>
            </div>
            {country.is_low_stock ? (
                <>
                    <p className="text-[10px] text-orange-400 font-semibold flex items-center gap-0.5 animate-pulse">
                        <Zap className="w-2.5 h-2.5" />Only {available} left – act fast!
                    </p>
                    {countdown && (
                        <p className="text-[9px] text-red-400/80 flex items-center gap-1 font-mono">
                            <Timer className="w-2.5 h-2.5" />Offer expires in {countdown}
                        </p>
                    )}
                </>
            ) : (
                <p className="text-[10px] text-white/35">{available} available</p>
            )}
            {country.is_most_used && (
                <span className="absolute top-2 left-2 px-1.5 py-0.5 rounded text-[8px] font-bold bg-yellow-500/20 text-yellow-400 border border-yellow-500/25">Popular</span>
            )}
        </button>
    )
}

// ─── Step 2: Select Country ────────────────────────────────────
function CountryStep({ service, onSelect, selected }) {
    const [countries, setCountries] = useState([])
    const [loading, setLoading] = useState(true)
    const [search, setSearch] = useState('')
    const countdown = useCountdownTimer(15)

    useEffect(() => {
        api.get('/api/countries')
            .then(res => setCountries(res.data || []))
            .catch(() => toast.error('Failed to load countries'))
            .finally(() => setLoading(false))
    }, [])

    const filtered = countries.filter(c =>
        c.name.toLowerCase().includes(search.toLowerCase()) ||
        c.code?.toLowerCase().includes(search.toLowerCase())
    ).sort((a, b) => {
        if (a.is_most_used && !b.is_most_used) return -1;
        if (!a.is_most_used && b.is_most_used) return 1;
        
        // If both are popular, prioritize UK, then US, then CA
        if (a.is_most_used && b.is_most_used) {
            const getRank = (c) => c.code === 'GB' ? 1 : c.code === 'US' ? 2 : 3;
            return getRank(a) - getRank(b);
        }
        
        // Otherwise sort alphabetically
        return a.name.localeCompare(b.name);
    })

    const totalAvailable = countries.reduce((sum, c) => sum + (c.available_numbers ?? 200), 0)

    return (
        <div className="flex flex-col step-animate h-full">
            {/* Sticky top area — stays fixed while countries scroll beneath */}
            <div className="sticky top-0 z-10 bg-[#070D2E] pb-3 flex flex-col gap-3">
                <p className="text-sm text-white/45">Choose the country where you need the verification code.</p>

                {/* Availability summary */}
                {!loading && totalAvailable > 0 && (
                    <div className="flex items-center justify-center gap-2 py-1.5 px-3 rounded-full bg-emerald-500/8 border border-emerald-500/15 self-center">
                        <Sparkles className="w-3 h-3 text-emerald-400" />
                        <span className="text-[10px] font-semibold text-emerald-400">{totalAvailable.toLocaleString()} numbers available across {countries.length} countries</span>
                    </div>
                )}

                <div className="relative">
                    <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
                    <input type="text" placeholder="Search country…"
                        value={search} onChange={e => setSearch(e.target.value)}
                        className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white placeholder-white/25 text-sm focus:outline-none focus:border-[rgba(51,204,255,0.4)] transition" />
                </div>
            </div>

            {/* Scrollable country grid */}
            <div className="flex-1 overflow-y-auto pt-1">
                {loading ? (
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                        {Array.from({ length: 9 }).map((_, i) => <div key={i} className="h-20 rounded-xl bg-white/5 animate-pulse" />)}
                    </div>
                ) : (
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 pr-1">
                        {filtered.map(country => (
                            <CountryCard
                                key={country.id}
                                country={country}
                                isSelected={selected?.id === country.id}
                                onSelect={onSelect}
                                countdown={country.is_low_stock ? countdown : null}
                            />
                        ))}
                        {filtered.length === 0 && <p className="col-span-3 text-center text-white/30 text-sm py-6">No countries found</p>}
                    </div>
                )}
            </div>
        </div>
    )
}

// ─── Step 3: Select Operator ───────────────────────────────────
function OperatorStep({ service, country, selected, onSelect }) {
    const [operators, setOperators] = useState([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        if (!service || !country) return
        setLoading(true)
        api.get('/api/operators', { params: { service_id: service.id, country_id: country.id } })
            .then(res => setOperators(res.data.operators || []))
            .catch(() => {
                toast.error('Failed to load operators')
                setOperators([{ name: 'any', cost: 0, count: 0, rate: 0 }])
            })
            .finally(() => setLoading(false))
    }, [service, country])

    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center py-12 gap-3">
                <Loader2 className="w-6 h-6 text-[#33CCFF] animate-spin" />
                <p className="text-sm text-white/40">Loading available operators…</p>
            </div>
        )
    }

    if (operators.length === 0) {
        return (
            <div className="text-center py-8">
                <p className="text-sm text-white/40">No operators available for this combination.</p>
            </div>
        )
    }

    return (
        <div className="flex flex-col gap-3 step-animate">
            <p className="text-sm text-white/45">Choose an operator. "Any" lets the system pick the best available.</p>
            <div className="flex items-center justify-end gap-3 text-[10px] text-white/30 px-1">
                <span>Price (USD)</span>
                <span>Delivery Rate</span>
            </div>

            {operators.map(op => {
                const isSelected = selected === op.name
                return (
                    <button key={op.name} onClick={() => onSelect(op.name)}
                        className={`w-full p-4 rounded-xl border text-left transition-all ${isSelected
                            ? 'border-[rgba(51,204,255,0.5)] bg-[rgba(51,204,255,0.07)]'
                            : 'border-white/8 bg-white/[0.03] hover:border-white/15 hover:bg-white/[0.05]'
                        }`}>
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${isSelected ? 'border-[#33CCFF] bg-[#33CCFF]' : 'border-white/20'}`}>
                                    {isSelected && <Check className="w-3 h-3 text-black stroke-[3]" />}
                                </div>
                                <div>
                                    <p className="text-sm font-bold text-white capitalize">
                                        {op.name === 'any' ? '🎲 Any Operator' : op.name}
                                    </p>
                                    {op.name === 'any' && (
                                        <p className="text-[10px] text-white/30 mt-0.5">Best availability — auto-selected operator</p>
                                    )}
                                </div>
                            </div>
                            <div className="text-right flex flex-col items-end gap-1">
                                {op.cost > 0 && <p className="text-xs font-bold text-emerald-400">${op.cost.toFixed(2)}</p>}
                                {op.rate > 0 && (
                                    <div className="flex items-center gap-1">
                                        <div className="w-12 h-1.5 rounded-full bg-white/10 overflow-hidden">
                                            <div className="h-full rounded-full" style={{ width: `${Math.min(op.rate, 100)}%`, background: op.rate >= 50 ? '#34d399' : op.rate >= 20 ? '#fbbf24' : '#f87171' }} />
                                        </div>
                                        <span className={`text-[10px] font-semibold ${op.rate >= 50 ? 'text-emerald-400' : op.rate >= 20 ? 'text-amber-400' : 'text-red-400'}`}>{op.rate.toFixed(1)}%</span>
                                    </div>
                                )}
                                {op.count > 0 && <span className="text-[10px] text-white/30">{op.count.toLocaleString()} numbers</span>}
                            </div>
                        </div>
                    </button>
                )
            })}

            <div className="flex items-center gap-2 p-3 rounded-xl bg-white/[0.03] border border-white/8 mt-1">
                <TrendingUp className="w-4 h-4 text-[#33CCFF] flex-shrink-0" />
                <p className="text-[11px] text-white/50">Over <span className="text-white font-semibold">5,000 numbers</span> rented this week.</p>
            </div>
        </div>
    )
}

// ─── Step 4: Confirm ──────────────────────────────────────────
function ConfirmStep({ service, country, wallet, formatNaira, totalPrice, priceLoading }) {
    const cost = totalPrice ?? 0
    const hasSufficientBalance = (wallet || 0) >= cost

    const rows = [
        {
            label: 'Service',
            value: <div className="flex items-center gap-2 text-white justify-end"><ServiceIconWithFallback icon={service?.icon} name={service?.name} color={service?.color} size="sm" /><span className="font-bold">{service?.name}</span></div>
        },
        {
            label: 'Country',
            value: <div className="flex items-center gap-2 text-white justify-end"><span className="text-lg leading-none">{country?.flag}</span><span className="font-bold">{country?.name}</span></div>
        },
        {
            label: 'Total Price',
            value: priceLoading
                ? <span className="text-white/40 text-xs">Calculating…</span>
                : <span className="font-bold text-emerald-400">{formatNaira(cost)}</span>
        },
        {
            label: 'Wallet Balance',
            value: <span className={`font-bold ${hasSufficientBalance ? 'text-white' : 'text-red-400'}`}>{formatNaira(wallet)}</span>
        },
    ]

    return (
        <div className="flex flex-col gap-4 step-animate">
            <p className="text-sm text-white/45">Review your selection before proceeding.</p>

            {!priceLoading && !hasSufficientBalance && (
                <div className="flex items-start gap-2.5 p-3 rounded-xl bg-red-500/10 border border-red-500/25">
                    <AlertCircle className="w-4 h-4 text-red-400 flex-shrink-0 mt-0.5" />
                    <p className="text-sm text-red-400">Insufficient balance. You need <strong>{formatNaira(cost)}</strong>, you have <strong>{formatNaira(wallet)}</strong>.</p>
                </div>
            )}

            {/* Summary box */}
            <div className="rounded-xl border border-white/10 bg-white/[0.03] overflow-hidden">
                <div className="px-4 py-2.5 border-b border-white/8">
                    <p className="text-xs font-bold text-white/50 uppercase tracking-widest">Summary</p>
                </div>
                <div className="divide-y divide-white/[0.06]">
                    {rows.map(row => (
                        <div key={row.label} className="flex items-center justify-between px-4 py-3">
                            <div className="text-sm text-white/50">{row.label}</div>
                            <div className="text-sm text-right">{row.value}</div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Trust reassurance */}
            <div className="flex items-center gap-2 p-2.5 rounded-xl bg-emerald-500/8 border border-emerald-500/15">
                <Shield className="w-3.5 h-3.5 text-emerald-400 flex-shrink-0" />
                <p className="text-[11px] text-emerald-400 font-medium">Your credits will be deducted only after SMS delivery.</p>
            </div>
        </div>
    )
}

// ─── Number Ready Post-Order ───────────────────────────────────
function NumberReadyView({ order, formatNaira, onClose, onGetAnother, onCancel, cancelling, onBan, banning, timeLeft, formatTime }) {
    const [copiedNumber, setCopiedNumber] = useState(false)
    const [copiedCode, setCopiedCode] = useState(false)

    const copy = (text, setter) => {
        navigator.clipboard.writeText(text)
        setter(true)
        toast.success('Copied!')
        setTimeout(() => setter(false), 2000)
    }

    return (
        <div className="flex flex-col items-center gap-3 sm:gap-5">
            {/* Social proof */}
            <div className="flex items-center gap-2">
                <Users className="w-3.5 h-3.5 text-[#33CCFF]" />
                <span className="text-[10px] sm:text-[11px] text-white/50">Over <span className="text-white font-bold">5,000</span> numbers rented this week</span>
            </div>

            {/* Hero */}
            <div className="relative w-16 h-16 sm:w-20 sm:h-20">
                <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-gradient-to-br from-[#0055CC]/30 to-[#33CCFF]/10 border-2 border-[#33CCFF]/40 flex items-center justify-center shadow-[0_0_40px_rgba(51,204,255,0.25)]">
                    <Check className="w-7 h-7 sm:w-9 sm:h-9 text-[#33CCFF] stroke-[3]" />
                </div>
                <div className="absolute -bottom-1 -right-1 w-6 h-6 sm:w-7 sm:h-7 rounded-full bg-emerald-500 flex items-center justify-center border-2 border-[#070D2E]">
                    <Zap className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-white" />
                </div>
            </div>

            <div className="text-center">
                <h3 className="text-lg sm:text-2xl font-bold text-white mb-0.5 sm:mb-1">Number Ready! 🚀</h3>
                <p className="text-xs sm:text-sm text-white/45">Copy & use instantly — your number is live.</p>
            </div>

            {/* Phone number */}
            <div className="w-full p-3 sm:p-5 rounded-2xl border border-[rgba(51,204,255,0.25)] bg-[rgba(51,204,255,0.04)] text-center">
                <p className="text-xl sm:text-3xl font-bold text-white font-mono tracking-wider sm:tracking-widest mb-3 sm:mb-4 break-all">{order.phone_number}</p>
                <button onClick={() => copy(order.phone_number, setCopiedNumber)}
                    className="inline-flex items-center gap-2 px-5 sm:px-6 py-2 sm:py-2.5 rounded-xl bg-gradient-to-r from-[#0055CC] to-[#0077EE] text-white text-xs sm:text-sm font-bold hover:scale-[1.02] transition shadow-[0_0_15px_rgba(0,102,255,0.3)] border border-[#33CCFF]/20">
                    {copiedNumber ? <><Check className="w-4 h-4" />Copied!</> : <><Copy className="w-4 h-4" />Copy Number</>}
                </button>
            </div>

            {/* Waiting */}
            {order.status === 'pending' && !order.otp_code && (
                <div className="w-full flex flex-col items-center gap-1.5 sm:gap-2">
                    <div className="flex items-center gap-2 sm:gap-2.5 bg-[rgba(0,102,255,0.1)] px-3 sm:px-4 py-1.5 sm:py-2 rounded-full border border-[rgba(0,102,255,0.2)]">
                        <span className="w-2 h-2 sm:w-2.5 sm:h-2.5 rounded-full bg-emerald-400 shadow-[0_0_10px_rgba(52,211,153,0.8)] animate-pulse" />
                        <span className="text-xs sm:text-sm text-white/80 font-medium">Waiting for SMS…</span>
                    </div>
                    <p className="text-xs sm:text-sm text-white/40">Expires in: <span className="font-bold text-white">{formatTime(timeLeft)}</span></p>
                    <p className="text-[10px] sm:text-xs text-white/30">Code will appear here instantly once received.</p>
                </div>
            )}

            {/* OTP */}
            {order.otp_code && (
                <div className="w-full p-3 sm:p-5 rounded-2xl border border-[#FFB800]/30 bg-[rgba(255,184,0,0.04)] relative">
                    <div className="absolute -top-3 -right-3 w-7 h-7 rounded-full bg-gradient-to-tr from-orange-500 to-yellow-400 flex items-center justify-center text-white text-xs font-bold border-2 border-[#070D2E]">1</div>
                    <p className="text-xs sm:text-sm font-bold text-white mb-2 sm:mb-3 text-center">📩 New SMS Received!</p>
                    <p className="text-2xl sm:text-4xl font-bold text-[#33CCFF] font-mono tracking-widest sm:tracking-[0.2em] text-center mb-3 sm:mb-4 drop-shadow-[0_0_15px_rgba(51,204,255,0.4)] break-all">{order.otp_code}</p>
                    <button onClick={() => copy(order.otp_code, setCopiedCode)}
                        className="w-full max-w-[180px] mx-auto flex items-center justify-center gap-2 px-5 py-2 sm:py-2.5 rounded-xl bg-gradient-to-r from-[#0055CC] to-[#0077EE] text-white text-xs sm:text-sm font-bold hover:scale-[1.02] transition shadow-[0_0_15px_rgba(0,102,255,0.3)] border border-[#33CCFF]/20">
                        {copiedCode ? <><Check className="w-4 h-4" />Copied!</> : <><Copy className="w-4 h-4" />Copy Code</>}
                    </button>
                </div>
            )}

            {/* Need another */}
            {order.otp_code && (
                <div className="w-full p-3 sm:p-4 rounded-2xl border border-white/8 bg-white/[0.03] text-center flex flex-col items-center gap-1.5 sm:gap-2">
                    <p className="text-xs sm:text-sm font-bold text-white">Need another number?</p>
                    <button onClick={() => { onClose(); if (onGetAnother) onGetAnother() }}
                        className="inline-flex items-center gap-2 px-4 sm:px-5 py-2 sm:py-2.5 rounded-xl bg-gradient-to-r from-[#0055CC] to-[#0077EE] text-white text-[11px] sm:text-xs font-bold hover:scale-[1.02] transition shadow-[0_0_12px_rgba(0,102,255,0.2)] border border-[#33CCFF]/20">
                        <Smartphone className="w-3.5 h-3.5 sm:w-4 sm:h-4" />Get Another Number
                    </button>
                    <div className="flex items-center gap-1.5 mt-0.5">
                        <Check className="w-3 h-3 text-emerald-400" />
                        <span className="text-[10px] text-emerald-400 italic">Credits deducted successfully after activation.</span>
                    </div>
                </div>
            )}

            {['expired', 'cancelled'].includes(order.status) && !order.otp_code && (
                <div className="w-full p-3 sm:p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-center">
                    <p className="text-xs sm:text-sm text-red-400 font-semibold">
                        {order.status === 'expired' ? 'Number expired — no SMS received.' : 'Order cancelled — refund processed.'}
                    </p>
                </div>
            )}

            {order.status === 'pending' && !order.otp_code && (
                <div className="w-full flex gap-2">
                    <button onClick={onCancel} disabled={cancelling || banning}
                        className="flex-1 flex items-center justify-center gap-1.5 sm:gap-2 py-2.5 sm:py-3 rounded-xl font-bold text-xs sm:text-sm bg-red-500/15 text-red-400 border border-red-500/30 hover:bg-red-500/25 hover:border-red-500/50 transition disabled:opacity-50">
                        {cancelling
                            ? <><Loader2 className="w-3.5 h-3.5 sm:w-4 sm:h-4 animate-spin" />Cancelling…</>
                            : <><XCircle className="w-3.5 h-3.5 sm:w-4 sm:h-4" />Cancel</>
                        }
                    </button>
                    <button onClick={onBan} disabled={cancelling || banning}
                        className="flex-1 flex items-center justify-center gap-1.5 sm:gap-2 py-2.5 sm:py-3 rounded-xl font-bold text-xs sm:text-sm bg-orange-500/15 text-orange-400 border border-orange-500/30 hover:bg-orange-500/25 hover:border-orange-500/50 transition disabled:opacity-50">
                        {banning
                            ? <><Loader2 className="w-3.5 h-3.5 sm:w-4 sm:h-4 animate-spin" />Banning…</>
                            : <><Shield className="w-3.5 h-3.5 sm:w-4 sm:h-4" />Number Banned</>
                        }
                    </button>
                </div>
            )}
        </div>
    )
}

// ─── The Rent Number Modal ─────────────────────────────────────
export function RentNumberModal({ wallet, formatNaira, onClose, onSuccess, initialService, initialCountry, inline = false }) {
    const [step, setStep] = useState(initialService ? (initialCountry ? 2 : 1) : 0)
    const [service, setService] = useState(initialService || null)
    const [country, setCountry] = useState(initialCountry || null)
    const [operator, setOperator] = useState('any')
    const [loading, setLoading] = useState(false)
    const [order, setOrder] = useState(null)
    const [cancelling, setCancelling] = useState(false)
    const [banning, setBanning] = useState(false)
    const [timeLeft, setTimeLeft] = useState(20 * 60)
    const [totalPrice, setTotalPrice] = useState(null)
    const [priceLoading, setPriceLoading] = useState(false)
    const pollRef = useRef(null)
    const timerRef = useRef(null)

    const formatTime = (s) => `${Math.floor(s / 60).toString().padStart(2, '0')}:${(s % 60).toString().padStart(2, '0')}`

    const startTimer = useCallback(() => {
        timerRef.current = setInterval(() => setTimeLeft(p => p <= 0 ? (clearInterval(timerRef.current), 0) : p - 1), 1000)
    }, [])

    const startPolling = useCallback((id) => {
        pollRef.current = setInterval(async () => {
            try {
                const res = await api.get(`/api/orders/${id}`)
                setOrder(res.data)
                if (res.data.otp_code || ['expired', 'cancelled'].includes(res.data.status)) {
                    clearInterval(pollRef.current)
                    clearInterval(timerRef.current)
                    if (res.data.otp_code) toast.success('🎉 SMS received!')
                }
            } catch { }
        }, 5000)
    }, [])

    useEffect(() => () => { clearInterval(pollRef.current); clearInterval(timerRef.current) }, [])

    // Fetch total price when reaching the confirm step (step 3)
    useEffect(() => {
        if (step === 3 && service && country) {
            setPriceLoading(true)
            setTotalPrice(null)
            api.get('/api/pricing/calculate', { params: { service_id: service.id, country_id: country.id } })
                .then(res => setTotalPrice(res.data.total))
                .catch(() => {
                    toast.error('Failed to calculate price')
                    setTotalPrice(0)
                })
                .finally(() => setPriceLoading(false))
        }
    }, [step, service, country])

    const handleServiceSelect = (s) => { setService(s); setStep(1) }
    const handleCountrySelect = (c) => { setCountry(c); setStep(2) }
    const handleOperatorSelect = (op) => { setOperator(op); setStep(3) }

    const handleConfirm = async () => {
        setLoading(true)
        try {
            const res = await api.post('/api/orders', { service_id: service.id, country_id: country.id, operator })
            const newOrder = res.data.order
            setOrder(newOrder)
            setStep(4) // number ready view
            toast.success(res.data.message)
            if (onSuccess) onSuccess(res.data.wallet_balance)
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
            setLoading(false)
        }
    }

    const handleCancel = async () => {
        if (!order) return
        setCancelling(true)
        try {
            const res = await api.post(`/api/orders/${order.id}/cancel`)
            toast.success(res.data.message)
            clearInterval(pollRef.current); clearInterval(timerRef.current)
            setOrder(p => ({ ...p, status: 'cancelled' }))
            if (onSuccess) onSuccess(res.data.wallet_balance)
        } catch (e) { toast.error(e.response?.data?.message || 'Cancel failed') }
        finally { setCancelling(false) }
    }

    const handleBan = async () => {
        if (!order) return
        setBanning(true)
        try {
            const res = await api.post(`/api/orders/${order.id}/ban`)
            toast.success(res.data.message)
            clearInterval(pollRef.current); clearInterval(timerRef.current)
            setOrder(p => ({ ...p, status: 'cancelled' }))
            if (onSuccess) onSuccess(res.data.wallet_balance)
        } catch (e) { toast.error(e.response?.data?.message || 'Ban failed') }
        finally { setBanning(false) }
    }

    const cost = totalPrice ?? 0
    const hasFunds = (wallet || 0) >= cost
    const canClose = step < 4 || !order || ['cancelled', 'expired'].includes(order?.status) || !!order?.otp_code

    const stepLabel = ['Select Service', 'Select Country', 'Select Operator', 'Confirm'][Math.min(step, 3)]

    const content = (
        <div className={`relative w-full flex flex-col bg-[#070D2E] border border-[rgba(51,204,255,0.2)] ${inline ? 'rounded-2xl h-[600px] shadow-[0_0_40px_rgba(0,102,255,0.1)]' : 'sm:w-[540px] sm:max-w-[92vw] rounded-3xl sm:rounded-2xl shadow-[0_0_80px_rgba(0,102,255,0.2)] h-[80svh] sm:h-auto sm:max-h-[88vh]'}`}>

            {/* Mobile drag handle */}
            {!inline && (
                <div className="flex justify-center pt-3 pb-1 sm:hidden flex-shrink-0">
                    <div className="w-10 h-1 rounded-full bg-white/20" />
                </div>
            )}

            {/* Glow bar top */}
            <div className={`absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#33CCFF] to-transparent opacity-50 ${inline ? 'rounded-t-2xl' : ''}`} />

            {/* Modal Header */}
            {!inline && (
                <div className="flex items-center justify-between px-4 sm:px-6 pt-3 sm:pt-5 pb-3 sm:pb-4 border-b border-white/[0.07] flex-shrink-0">
                    <h2 className="text-sm sm:text-base font-bold text-white flex items-center gap-2">
                        <span className="text-[#33CCFF]">Z</span> Rent Number
                    </h2>
                    {canClose && (
                        <button onClick={onClose} className="p-1.5 rounded-full bg-white/5 hover:bg-white/10 text-white/40 hover:text-white transition">
                            <X className="w-4 h-4" />
                        </button>
                    )}
                </div>
            )}

                {/* Step Bar — only for steps 0-3 */}
                {step < 4 && (
                    <div className="px-3 sm:px-6 pt-2 sm:pt-4 pb-2 sm:pb-3 border-b border-white/[0.05] flex-shrink-0">
                        <ModalStepBar step={step} />
                    </div>
                )}

                {/* Step title */}
                {step < 4 && (
                    <div className="px-4 sm:px-6 pt-2 sm:pt-4 pb-0.5 flex-shrink-0">
                        <h3 className="text-base sm:text-lg font-bold text-white">{stepLabel}</h3>
                    </div>
                )}

                {/* Content — scrollable */}
                <div className="flex-1 overflow-y-auto px-4 sm:px-6 py-3 sm:py-4 min-h-0 overscroll-contain" style={{ WebkitOverflowScrolling: 'touch' }}>
                    {step === 0 && <ServiceStep onSelect={handleServiceSelect} selected={service} />}
                    {step === 1 && <CountryStep onSelect={handleCountrySelect} selected={country} service={service} />}
                    {step === 2 && <OperatorStep service={service} country={country} selected={operator} onSelect={handleOperatorSelect} />}
                    {step === 3 && <ConfirmStep service={service} country={country} wallet={wallet} formatNaira={formatNaira} totalPrice={totalPrice} priceLoading={priceLoading} />}
                    {step === 4 && (
                        <NumberReadyView
                            order={order}
                            formatNaira={formatNaira}
                            onClose={onClose}
                            onGetAnother={() => { setService(null); setCountry(null); setOperator('any'); setOrder(null); setStep(0); setTimeLeft(20 * 60) }}
                            onCancel={handleCancel}
                            cancelling={cancelling}
                            onBan={handleBan}
                            banning={banning}
                            timeLeft={timeLeft}
                            formatTime={formatTime}
                        />
                    )}
                </div>

                {/* Footer Buttons */}
                {step < 4 && (
                    <div className="flex flex-col gap-2 px-4 sm:px-6 pb-5 sm:pb-5 pt-2 sm:pt-3 border-t border-white/[0.06] flex-shrink-0 bg-[#070D2E]">
                        {/* Primary CTA */}
                        {step === 3 && (
                            <button onClick={handleConfirm} disabled={loading || !hasFunds || priceLoading || totalPrice === null}
                                className="w-full flex items-center justify-center gap-2 py-3.5 rounded-xl font-bold text-sm bg-gradient-to-r from-[#0055CC] to-[#33CCFF] text-white shadow-[0_0_20px_rgba(0,102,255,0.35)] hover:shadow-[0_0_30px_rgba(0,102,255,0.55)] transition-all disabled:opacity-40 disabled:cursor-not-allowed hover:scale-[1.01] disabled:hover:scale-100">
                                {loading ? <><Loader2 className="w-4 h-4 animate-spin" />Provisioning…</> : <><Smartphone className="w-4 h-4" />Confirm & Get Number</>}
                            </button>
                        )}
                        {step > 0 && (
                            <button onClick={() => setStep(s => s - 1)}
                                className="w-full py-3 rounded-xl text-sm font-semibold text-white/40 hover:text-white hover:bg-white/5 transition border border-transparent hover:border-white/10">
                                ← Back
                            </button>
                        )}
                        {step > 0 && step < 3 && (
                            <p className="text-[11px] text-white/25 text-center">Select an option above to continue</p>
                        )}
                        {step === 3 && (
                            <p className="text-[11px] text-white/30 text-center -mt-1">Your credits will be deducted only after SMS delivery.</p>
                        )}
                    </div>
                )}
            </div>
        )
        
    if (inline) return content

    return (
        <div
            className="fixed inset-0 z-[60] flex items-start sm:items-center justify-center bg-black/70 backdrop-blur-md p-0 pt-8 sm:p-6"
            onMouseDown={(e) => { if (e.target === e.currentTarget && canClose) onClose() }}
        >
            {content}
        </div>
    )
}

// ─── Main Page Component ───────────────────────────────────────
export default function RentNumberSection({ wallet, formatNaira, onNavigate, preSelect, onWalletUpdate }) {
    const [currentWallet, setCurrentWallet] = useState(wallet)
    const [showModal, setShowModal] = useState(false)
    const [initialService, setInitialService] = useState(null)
    const [initialCountry, setInitialCountry] = useState(null)
    const hasAutoOpened = useRef(false)

    useEffect(() => { setCurrentWallet(wallet) }, [wallet])

    // Auto-open modal with pre-selections from Overview or Services pages
    useEffect(() => {
        if (preSelect && !hasAutoOpened.current) {
            hasAutoOpened.current = true
            if (preSelect.service) setInitialService(preSelect.service)
            if (preSelect.country) setInitialCountry(preSelect.country)
            if (preSelect.autoOpen) {
                setShowModal(true)
            }
        }
    }, [preSelect])

    return (
        <div className="flex flex-col gap-6 max-w-2xl">
            {/* Sticky header */}
            <div className="sticky top-[61px] z-30 bg-[rgba(8,10,46,0.97)] backdrop-blur-xl -mx-4 sm:-mx-6 lg:-mx-8 px-4 sm:px-6 lg:px-8 pt-4 pb-4 border-b border-white/[0.05]">
                <h2 className="text-2xl font-bold text-white flex items-center gap-2.5">
                    <Smartphone className="w-6 h-6 text-[#33CCFF]" />
                    Rent Virtual Number
                </h2>
                <p className="text-white/40 text-sm mt-1">Instantly rent virtual numbers worldwide.</p>
            </div>

            {/* Feature highlights */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {[
                    { icon: <Zap className="w-4 h-4 text-yellow-400" />, title: 'Instant Provisioning', text: 'Get a number in seconds.' },
                    { icon: <Shield className="w-4 h-4 text-emerald-400" />, title: 'Secure & Private', text: 'Numbers are never reused.' },
                    { icon: <Users className="w-4 h-4 text-[#33CCFF]" />, title: '5,000+ Rented This Week', text: 'Join millions of users.' },
                ].map(f => (
                    <div key={f.title} className="p-4 rounded-xl border border-white/8 bg-white/[0.03] flex items-start gap-3">
                        <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center flex-shrink-0">{f.icon}</div>
                        <div>
                            <p className="text-xs font-bold text-white">{f.title}</p>
                            <p className="text-xs text-white/40 mt-0.5">{f.text}</p>
                        </div>
                    </div>
                ))}
            </div>

            {/* CTA */}
            <button onClick={() => setShowModal(true)}
                className="w-full sm:w-auto self-start flex items-center gap-2.5 px-8 py-4 rounded-xl font-bold text-base bg-gradient-to-r from-[#0055CC] to-[#33CCFF] text-white shadow-[0_0_25px_rgba(0,102,255,0.4)] hover:shadow-[0_0_40px_rgba(0,102,255,0.65)] transition-all hover:scale-[1.02]">
                <Smartphone className="w-5 h-5" />
                Rent a Virtual Number
                <ChevronRight className="w-5 h-5" />
            </button>

            {showModal && (
                <RentNumberModal
                    wallet={currentWallet}
                    formatNaira={formatNaira}
                    onClose={() => setShowModal(false)}
                    onSuccess={(b) => {
                        if (b !== undefined) {
                            setCurrentWallet(b)
                            if (onWalletUpdate) onWalletUpdate(b)
                        }
                    }}
                    initialService={initialService}
                    initialCountry={initialCountry}
                />
            )}
        </div>
    )
}
