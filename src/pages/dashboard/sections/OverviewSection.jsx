import { useState, useEffect, useRef } from 'react'
import { Plus, Eye, EyeOff, FileText, CheckCircle2, ArrowRight, Search, ChevronDown, ArrowUpRight, Zap, Shield, Globe, X, Loader2 } from 'lucide-react'
import api from '../../../lib/axios'
import { ServiceIconWithFallback } from '../../../components/ServiceIcon'

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
                    <div className="absolute z-50 top-full mt-2 left-0 right-0 rounded-xl border border-[rgba(255,255,255,0.12)] bg-[rgba(8,10,46,0.97)] backdrop-blur-xl shadow-[0_20px_60px_rgba(0,0,0,0.5)] overflow-hidden">
                        <div className="p-3 border-b border-white/8">
                            <div className="relative">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-white/25" />
                                <input
                                    type="text"
                                    placeholder={searchPlaceholder}
                                    value={search}
                                    onChange={e => setSearch(e.target.value)}
                                    autoFocus
                                    className="w-full pl-9 pr-3 py-2 rounded-lg bg-white/[0.05] border border-white/8 text-sm text-white placeholder-white/20 focus:outline-none focus:border-[rgba(0,255,255,0.3)] transition"
                                />
                            </div>
                        </div>
                        <div className="max-h-[240px] overflow-y-auto">
                            {loading ? (
                                <div className="flex items-center justify-center py-8">
                                    <Loader2 className="w-5 h-5 text-[#00FFFF] animate-spin" />
                                </div>
                            ) : filtered.length === 0 ? (
                                <div className="py-6 text-center text-white/25 text-sm">No results found</div>
                            ) : filtered.map(item => (
                                <button
                                    key={item.id}
                                    onClick={() => { onSelect(item); setOpen(false); setSearch('') }}
                                    className={`w-full flex items-center justify-between px-4 py-3 text-left hover:bg-white/[0.05] transition ${selected?.id === item.id ? 'bg-[rgba(0,255,255,0.06)]' : ''}`}
                                >
                                    {renderItem(item)}
                                    {selected?.id === item.id && (
                                        <CheckCircle2 className="w-4 h-4 text-[#00FFFF] flex-shrink-0 ml-2" />
                                    )}
                                </button>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </div>
    )
}

// ─── Overview Section ─────────────────────────────────────────
export default function OverviewSection({ user, wallet, stats, formatNaira, onNavigate }) {
    const [showBalance, setShowBalance] = useState(true)
    const [services, setServices] = useState([])
    const [countries, setCountries] = useState([])
    const [selectedService, setSelectedService] = useState(null)
    const [selectedCountry, setSelectedCountry] = useState(null)
    const [loadingServices, setLoadingServices] = useState(true)
    const [loadingCountries, setLoadingCountries] = useState(true)

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

    const handleClear = () => {
        setSelectedService(null)
        setSelectedCountry(null)
    }

    return (
        <div className="flex flex-col gap-8">
            {/* Greeting */}
            <div>
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
                        { icon: FileText, label: 'Transactions', value: stats.transactions, color: '#00FFFF', bg: 'rgba(0,255,255,0.08)', onClick: () => onNavigate('transactions') },
                        { icon: CheckCircle2, label: 'Verifications', value: stats.verifications, color: '#33CCFF', bg: 'rgba(51,204,255,0.08)', onClick: null },
                        { icon: null, label: 'Total Spent', value: formatNaira(stats.total_spent), color: '#0099FF', bg: 'rgba(0,153,255,0.08)', naira: true, onClick: null },
                        { icon: null, label: 'Pending SMS', value: stats.pending_sms, color: '#00FFFF', bg: 'rgba(0,255,255,0.06)', spin: true, onClick: null },
                    ].map((stat, i) => (
                        <div
                            key={i}
                            onClick={stat.onClick}
                            className={`rounded-xl border border-[rgba(255,255,255,0.08)] bg-[rgba(15,20,60,0.5)] p-4 hover:border-[rgba(0,255,255,0.25)] transition-all ${stat.onClick ? 'cursor-pointer' : ''}`}
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

            {/* Quick Verify Form */}
            <div className="rounded-2xl border border-[rgba(255,255,255,0.08)] bg-[rgba(15,20,60,0.5)] p-6">
                <div className="flex items-center gap-3 mb-1">
                    <div className="w-8 h-8 rounded-lg bg-[rgba(0,255,255,0.1)] flex items-center justify-center">
                        <Zap className="w-4 h-4 text-[#00FFFF]" />
                    </div>
                    <h3 className="text-lg font-bold text-white">Get Verified Now</h3>
                </div>
                <p className="text-sm text-white/50 mb-6 ml-11 leading-relaxed">
                    Select a platform and country. Credits are deducted only after a successful code delivery.
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {/* Service Dropdown */}
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

                    {/* Country Dropdown */}
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

                <div className="flex flex-col sm:flex-row gap-3 mt-5">
                    <button
                        onClick={() => onNavigate('rent-number')}
                        className="flex-1 py-3.5 rounded-xl border border-[rgba(0,255,255,0.4)] bg-[rgba(0,255,255,0.06)] text-[#00FFFF] font-bold text-sm hover:bg-[rgba(0,255,255,0.12)] transition-all flex items-center justify-center gap-2 group"
                    >
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

            {/* Quick Actions */}
            <div className="grid grid-cols-3 gap-3">
                {[
                    { icon: Shield, label: 'Purchase History', sub: 'See all orders', color: '#00FFFF', nav: 'purchase-history' },
                    { icon: ArrowRight, label: 'Transactions', sub: 'Money flow', color: '#33CCFF', nav: 'transactions' },
                    { icon: Globe, label: 'Services', sub: 'All platforms', color: '#0099FF', nav: 'services' },
                ].map((item, i) => (
                    <button
                        key={i}
                        onClick={() => onNavigate(item.nav)}
                        className="flex flex-col items-center gap-2 p-4 rounded-xl border border-[rgba(255,255,255,0.07)] bg-[rgba(15,20,60,0.4)] hover:border-[rgba(0,255,255,0.2)] hover:bg-[rgba(15,20,60,0.7)] transition-all text-center"
                    >
                        <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: `${item.color}15` }}>
                            <item.icon className="w-5 h-5" style={{ color: item.color }} />
                        </div>
                        <div>
                            <p className="text-xs font-bold text-white/80">{item.label}</p>
                            <p className="text-[10px] text-white/40">{item.sub}</p>
                        </div>
                    </button>
                ))}
            </div>
        </div>
    )
}
