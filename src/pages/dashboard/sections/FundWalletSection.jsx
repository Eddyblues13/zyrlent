import { useState, useEffect, useRef } from 'react'
import { Wallet, Copy, Check, CreditCard, Building2, Smartphone, AlertCircle, ExternalLink, Zap, RefreshCw, ChevronLeft, ChevronRight, ChevronDown } from 'lucide-react'
import api from '../../../lib/axios'
import toast from 'react-hot-toast'
import { useCurrency } from '../../../context/CurrencyContext'

function formatDate(dateStr) {
    return new Date(dateStr).toLocaleDateString('en-NG', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' })
}

function getMethod(tx) {
    if (tx.reference?.startsWith('fund_') || tx.description?.toLowerCase().includes('korapay')) return 'KoraPay'
    return 'Bank Transfer'
}

function DepositStatusBadge({ status }) {
    const styles = {
        completed: 'bg-emerald-500/15 text-emerald-400 border-emerald-500/25',
        pending:   'bg-amber-500/15 text-amber-400 border-amber-500/25',
        failed:    'bg-red-500/15 text-red-400 border-red-500/25',
        expired:   'bg-white/10 text-white/50 border-white/10',
    }
    return (
        <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider border ${styles[status] || 'bg-white/10 text-white/60 border-white/10'}`}>
            {status}
        </span>
    )
}

// NGN amounts — always sent to the API in NGN regardless of display currency
const QUICK_AMOUNTS = [10000, 15000, 20000, 30000, 50000, 100000]

/* ─── Payment method registry ────────────────────────────────────────────────
   Add new methods here — the dropdown picks them up automatically.           */
const PAYMENT_METHODS = [
    {
        id: 'korapay',
        name: 'KoraPay',
        subtitle: 'Card · Bank Transfer · USSD · Mobile Money',
        badge: 'Instant',
        badgeClass: 'text-[#7aabff] bg-[#1760EF]/20 border-[#1760EF]/30',
        accentColor: '#1760EF',
        glowColor: 'rgba(23,96,239,0.22)',
        logo: (size = 'md') => (
            <div className={`${size === 'sm' ? 'w-7 h-7 text-[10px]' : 'w-9 h-9 text-xs'} rounded-lg bg-[#1760EF] flex items-center justify-center font-black text-white flex-shrink-0 shadow-[0_0_10px_rgba(23,96,239,0.4)]`}>
                KP
            </div>
        ),
    },
    {
        id: 'bank',
        name: 'Manual Bank Transfer',
        subtitle: 'Providus Bank · manual confirmation',
        badge: '5 – 30 min',
        badgeClass: 'text-amber-400 bg-amber-400/15 border-amber-400/25',
        accentColor: '#00C364',
        glowColor: 'rgba(0,195,100,0.18)',
        logo: (size = 'md') => (
            <div className={`${size === 'sm' ? 'w-7 h-7' : 'w-9 h-9'} rounded-lg bg-[#00C364] flex items-center justify-center flex-shrink-0 shadow-[0_0_10px_rgba(0,195,100,0.38)]`}>
                <Building2 className={`${size === 'sm' ? 'w-3.5 h-3.5' : 'w-4 h-4'} text-white`} />
            </div>
        ),
    },
    // ── Uncomment / copy to add more ──────────────────────────────────────
    // { id: 'paystack', name: 'Paystack', subtitle: 'Card · USSD · QR', badge: 'Instant', ... },
]

/* ─── Custom Dropdown ────────────────────────────────────────────────────── */
function PaymentMethodDropdown({ selected, onSelect }) {
    const [open, setOpen] = useState(false)
    const ref = useRef(null)
    const current = PAYMENT_METHODS.find(m => m.id === selected) ?? PAYMENT_METHODS[0]

    useEffect(() => {
        const handler = (e) => { if (ref.current && !ref.current.contains(e.target)) setOpen(false) }
        document.addEventListener('mousedown', handler)
        return () => document.removeEventListener('mousedown', handler)
    }, [])

    return (
        <div className="relative" ref={ref}>
            {/* Trigger */}
            <button
                type="button"
                onClick={() => setOpen(o => !o)}
                className="w-full flex items-center gap-3 px-4 py-3.5 rounded-xl border border-[rgba(255,255,255,0.12)] bg-[rgba(15,20,60,0.6)] hover:border-[rgba(255,255,255,0.22)] transition-all group"
                style={{ boxShadow: open ? `0 0 18px ${current.accentColor}22` : undefined }}
            >
                {current.logo('sm')}
                <div className="flex-1 text-left min-w-0">
                    <p className="text-sm font-bold text-white leading-tight">{current.name}</p>
                    <p className="text-[11px] text-white/35 truncate mt-0.5">{current.subtitle}</p>
                </div>
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border flex-shrink-0 ${current.badgeClass}`}>
                    {current.badge}
                </span>
                <ChevronDown className={`w-4 h-4 text-white/35 flex-shrink-0 transition-transform duration-200 ${open ? 'rotate-180' : ''}`} />
            </button>

            {/* Dropdown panel */}
            {open && (
                <div className="absolute top-full left-0 right-0 mt-2 z-50 rounded-xl border border-[rgba(255,255,255,0.12)] bg-[rgba(8,10,46,0.97)] backdrop-blur-xl shadow-[0_16px_48px_rgba(0,0,0,0.6)] overflow-hidden">
                    {PAYMENT_METHODS.map((method, i) => {
                        const isSelected = method.id === selected
                        return (
                            <button
                                key={method.id}
                                type="button"
                                onClick={() => { onSelect(method.id); setOpen(false) }}
                                className={`w-full flex items-center gap-3 px-4 py-3.5 transition-all text-left ${
                                    i > 0 ? 'border-t border-white/[0.06]' : ''
                                } ${isSelected ? 'bg-white/[0.05]' : 'hover:bg-white/[0.04]'}`}
                            >
                                {method.logo('sm')}
                                <div className="flex-1 min-w-0">
                                    <p className={`text-sm font-bold leading-tight ${isSelected ? 'text-white' : 'text-white/75'}`}>{method.name}</p>
                                    <p className="text-[11px] text-white/35 truncate mt-0.5">{method.subtitle}</p>
                                </div>
                                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border flex-shrink-0 ${method.badgeClass}`}>
                                    {method.badge}
                                </span>
                                {isSelected && (
                                    <div className="w-4 h-4 rounded-full flex items-center justify-center flex-shrink-0" style={{ background: method.accentColor }}>
                                        <Check className="w-2.5 h-2.5 text-white" />
                                    </div>
                                )}
                            </button>
                        )
                    })}
                </div>
            )}
        </div>
    )
}

/* ─── KoraPay Panel ──────────────────────────────────────────────────────── */
function KoraPayPanel() {
    const { formatNGN } = useCurrency()
    const [amount, setAmount] = useState('')
    const [loading, setLoading] = useState(false)

    const handlePay = async () => {
        if (!amount || parseFloat(amount) < 100) return
        setLoading(true)
        try {
            const res = await api.post('/api/wallet/korapay/initialize', { amount: parseFloat(amount) })
            if (res.data.checkout_url) {
                window.location.href = res.data.checkout_url
            } else {
                toast.error('Could not get payment link')
                setLoading(false)
            }
        } catch (err) {
            toast.error(err.response?.data?.message || 'Payment initialization failed')
            setLoading(false)
        }
    }

    return (
        <div className="flex flex-col gap-5 pt-1">
            {/* Amount Input */}
            <div>
                <label className="text-xs font-semibold text-white/40 uppercase tracking-wider mb-2.5 block">
                    Amount — paid in NGN via KoraPay
                </label>
                <div className="relative">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-[#00FFFF] font-bold text-lg">₦</span>
                    <input
                        type="number"
                        min="100"
                        placeholder="0.00"
                        value={amount}
                        onChange={e => setAmount(e.target.value)}
                        className="w-full pl-10 pr-4 py-4 rounded-xl bg-[rgba(255,255,255,0.05)] border border-[rgba(255,255,255,0.1)] text-white text-xl font-semibold placeholder-white/20 focus:outline-none focus:border-[rgba(0,255,255,0.4)] transition"
                    />
                </div>
                {/* Local currency equivalent hint */}
                {amount && parseFloat(amount) >= 100 && (
                    <p className="text-xs text-white/35 mt-1.5 pl-1">
                        ≈ <span className="text-white/60 font-semibold">{formatNGN(parseFloat(amount))}</span> in your local currency
                    </p>
                )}
                {/* Quick amounts shown in local currency */}
                <div className="flex flex-wrap gap-2 mt-3">
                    {QUICK_AMOUNTS.map(a => (
                        <button
                            key={a}
                            onClick={() => setAmount(String(a))}
                            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition flex flex-col items-center gap-0.5 ${amount === String(a)
                                ? 'bg-[rgba(0,255,255,0.15)] text-[#00FFFF] border border-[rgba(0,255,255,0.4)]'
                                : 'bg-[rgba(255,255,255,0.05)] text-white/50 border border-[rgba(255,255,255,0.08)] hover:bg-white/10'
                            }`}
                        >
                            <span>{formatNGN(a)}</span>
                            <span className="text-[9px] opacity-50">₦{a.toLocaleString()}</span>
                        </button>
                    ))}
                </div>
            </div>

            {/* Sub-methods grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {[
                    { icon: CreditCard, label: 'Card',          sub: 'Visa / MC / Verve',  color: '#1760EF' },
                    { icon: Building2,  label: 'Bank Transfer',  sub: 'All Nigerian banks',  color: '#00FFFF' },
                    { icon: Smartphone, label: 'USSD',           sub: '*737# etc.',           color: '#33CCFF' },
                    { icon: Wallet,     label: 'Bank Account',   sub: 'Direct debit',        color: '#0099FF' },
                ].map((m, i) => (
                    <div key={i} className="flex flex-col items-center gap-2 p-3 rounded-xl border border-[rgba(255,255,255,0.07)] bg-[rgba(15,20,60,0.4)] text-center">
                        <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: `${m.color}20` }}>
                            <m.icon className="w-4 h-4" style={{ color: m.color }} />
                        </div>
                        <div>
                            <p className="text-[11px] font-bold text-white">{m.label}</p>
                            <p className="text-[9px] text-white/35">{m.sub}</p>
                        </div>
                    </div>
                ))}
            </div>

            {/* Fee notice */}
            <div className="flex items-start gap-2 text-xs text-white/35 px-1">
                <Zap className="w-3.5 h-3.5 text-[#00FFFF]/60 mt-0.5 flex-shrink-0" />
                <span>Processing fee: 1.5% (capped at {formatNGN(2000)}) for card &amp; bank. USSD is free.</span>
            </div>

            {/* CTA */}
            <button
                onClick={handlePay}
                disabled={!amount || parseFloat(amount) < 100 || loading}
                className="w-full py-4 rounded-xl font-bold text-base transition-all flex items-center justify-center gap-2 bg-gradient-to-r from-[#1760EF] via-[#33CCFF] to-[#0099FF] text-white shadow-[0_0_20px_rgba(23,96,239,0.3)] hover:shadow-[0_0_30px_rgba(23,96,239,0.5)] hover:scale-[1.01] disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:scale-100 disabled:hover:shadow-none"
            >
                {loading ? (
                    <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                    <>
                        <ExternalLink className="w-4 h-4" />
                        Pay with KoraPay
                        {amount && parseFloat(amount) >= 100
                            ? ` · ${formatNGN(parseFloat(amount))} (₦${parseFloat(amount).toLocaleString()})`
                            : ''}
                    </>
                )}
            </button>

            <p className="text-center text-xs text-white/25">
                Secured by <span className="text-[#1760EF] font-semibold">KoraPay</span> · 256-bit SSL
            </p>
        </div>
    )
}

/* ─── Bank Transfer Panel ────────────────────────────────────────────────── */
function BankTransferPanel({ onSuccess }) {
    const { formatNGN } = useCurrency()
    const [amount, setAmount] = useState('')
    const [ref, setRef] = useState('')
    const [copied, setCopied] = useState(null)
    const [submitting, setSubmitting] = useState(false)
    const [submitted, setSubmitted] = useState(false)

    const BANK_ACCOUNT = {
        bank: 'PROVIDUS BANK',
        accountName: 'SHOBiZ TECHNOLOGIES LTD',
        accountNumber: '4209298044',
    }

    const copyText = (text, key) => {
        navigator.clipboard.writeText(text)
        setCopied(key)
        setTimeout(() => setCopied(null), 2000)
    }

    const handleSubmit = async () => {
        if (!amount || parseFloat(amount) < 100 || !ref.trim()) return
        setSubmitting(true)
        try {
            const res = await api.post('/api/wallet/manual-fund', { amount: parseFloat(amount), reference: ref.trim() })
            toast.success(res.data.message)
            setSubmitted(true)
            if (onSuccess) onSuccess()
        } catch (e) {
            toast.error(e.response?.data?.message || 'Submission failed. Please try again.')
        } finally {
            setSubmitting(false)
        }
    }

    return (
        <div className="flex flex-col gap-5 pt-1">
            {/* Amount */}
            <div>
                <label className="text-xs font-semibold text-white/40 uppercase tracking-wider mb-2.5 block">
                    Amount to Transfer (NGN)
                </label>
                <div className="relative">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-[#00C364] font-bold text-lg">₦</span>
                    <input
                        type="number"
                        min="100"
                        placeholder="0.00"
                        value={amount}
                        onChange={e => setAmount(e.target.value)}
                        className="w-full pl-10 pr-4 py-4 rounded-xl bg-[rgba(255,255,255,0.05)] border border-[rgba(255,255,255,0.1)] text-white text-xl font-semibold placeholder-white/20 focus:outline-none focus:border-[rgba(0,195,100,0.4)] transition"
                    />
                </div>
                {amount && parseFloat(amount) >= 100 && (
                    <p className="text-xs text-white/35 mt-1.5 pl-1">
                        ≈ <span className="text-white/60 font-semibold">{formatNGN(parseFloat(amount))}</span> in your local currency
                    </p>
                )}
                <div className="flex flex-wrap gap-2 mt-3">
                    {QUICK_AMOUNTS.map(a => (
                        <button
                            key={a}
                            onClick={() => setAmount(String(a))}
                            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition flex flex-col items-center gap-0.5 ${amount === String(a)
                                ? 'bg-[rgba(0,195,100,0.15)] text-[#00C364] border border-[rgba(0,195,100,0.4)]'
                                : 'bg-[rgba(255,255,255,0.05)] text-white/50 border border-[rgba(255,255,255,0.08)] hover:bg-white/10'
                            }`}
                        >
                            <span>{formatNGN(a)}</span>
                            <span className="text-[9px] opacity-50">₦{a.toLocaleString()}</span>
                        </button>
                    ))}
                </div>
            </div>

            {/* Account Details */}
            <div className="rounded-xl border border-[rgba(255,255,255,0.1)] bg-[rgba(15,20,60,0.6)] overflow-hidden">
                <div className="px-5 py-3 border-b border-white/5 bg-[rgba(0,195,100,0.05)]">
                    <p className="text-xs font-bold text-[#00C364] uppercase tracking-wider">Transfer to this account</p>
                </div>
                <div className="p-5 flex flex-col gap-3">
                    {[
                        { label: 'Bank',           value: BANK_ACCOUNT.bank,          key: 'bank' },
                        { label: 'Account Name',   value: BANK_ACCOUNT.accountName,   key: 'name' },
                        { label: 'Account Number', value: BANK_ACCOUNT.accountNumber, key: 'number', copyable: true, large: true },
                    ].map(item => (
                        <div key={item.key} className="flex items-center justify-between gap-4">
                            <div className="min-w-0">
                                <p className="text-xs text-white/35 mb-0.5">{item.label}</p>
                                <p className={`font-semibold text-white ${item.large ? 'text-xl tracking-widest' : 'text-sm'}`}>{item.value}</p>
                            </div>
                            {item.copyable && (
                                <button
                                    onClick={() => copyText(item.value, item.key)}
                                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[rgba(0,195,100,0.1)] border border-[rgba(0,195,100,0.25)] text-[#00C364] text-xs font-bold hover:bg-[rgba(0,195,100,0.2)] transition flex-shrink-0"
                                >
                                    {copied === item.key ? <><Check className="w-3.5 h-3.5" />Copied</> : <><Copy className="w-3.5 h-3.5" />Copy</>}
                                </button>
                            )}
                        </div>
                    ))}
                </div>
            </div>

            {/* Instructions */}
            <div className="rounded-xl border border-amber-400/15 bg-amber-400/5 p-4">
                <p className="text-xs font-bold text-amber-400 mb-2 flex items-center gap-1.5">
                    <AlertCircle className="w-3.5 h-3.5" /> Important Instructions
                </p>
                <ul className="text-xs text-white/50 space-y-1.5">
                    <li>1. Transfer the exact NGN amount you selected above.</li>
                    <li>2. Use your <span className="text-white font-semibold">registered email</span> as the payment narration.</li>
                    <li>3. Submit your reference number using the button below.</li>
                    <li>4. Wallet credited within <span className="text-white font-semibold">5–30 minutes</span> after confirmation.</li>
                </ul>
            </div>

            {/* Reference */}
            <div>
                <label className="text-xs font-semibold text-white/40 uppercase tracking-wider mb-2.5 block">Transfer Reference / Receipt Number</label>
                <input
                    type="text"
                    placeholder="e.g. TF2026030100123"
                    value={ref}
                    onChange={e => setRef(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl bg-[rgba(255,255,255,0.05)] border border-[rgba(255,255,255,0.1)] text-white placeholder-white/25 text-sm focus:outline-none focus:border-[rgba(0,195,100,0.4)] transition"
                />
            </div>

            <button
                onClick={handleSubmit}
                disabled={!amount || parseFloat(amount) < 100 || !ref.trim() || submitting || submitted}
                className="w-full py-4 rounded-xl font-bold text-base transition-all flex items-center justify-center gap-2 bg-[#00C364] text-white shadow-[0_0_20px_rgba(0,195,100,0.3)] hover:shadow-[0_0_28px_rgba(0,195,100,0.5)] hover:scale-[1.01] disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:scale-100"
            >
                {submitting ? (
                    <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : submitted ? (
                    <><Check className="w-4 h-4" />Submitted ✓</>
                ) : (
                    <><Check className="w-4 h-4" />I've Transferred · Submit for Confirmation</>
                )}
            </button>

            <p className="text-center text-xs text-white/25">Processing may take up to 30 mins. Contact support if wallet isn't credited.</p>
        </div>
    )
}

/* ─── Main Component ─────────────────────────────────────────────────────── */
export default function FundWalletSection({ wallet, formatNaira }) {
    const { formatNGN } = useCurrency()
    const [selectedMethod, setSelectedMethod] = useState('korapay')
    const [deposits, setDeposits] = useState([])
    const [loading, setLoading] = useState(true)
    const [page, setPage] = useState(1)
    const [meta, setMeta] = useState({ last_page: 1, total: 0 })

    const fetchDeposits = async (p = 1) => {
        setLoading(true)
        try {
            const res = await api.get('/api/wallet/transactions', { params: { page: p, per_page: 5, type: 'credit' } })
            setDeposits(res.data.data || [])
            setMeta({ last_page: res.data.last_page || 1, total: res.data.total || 0 })
        } catch {
            toast.error('Failed to load recent deposits')
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => { fetchDeposits(1) }, [])

    const handlePageChange = (p) => { setPage(p); fetchDeposits(p) }
    const handleSuccess = () => { setPage(1); fetchDeposits(1) }

    const renderPanel = () => {
        switch (selectedMethod) {
            case 'korapay': return <KoraPayPanel />
            case 'bank':    return <BankTransferPanel onSuccess={handleSuccess} />
            default:        return null
        }
    }

    return (
        <div className="flex flex-col gap-6 max-w-xl">
            {/* Sticky header */}
            <div className="sticky top-[61px] z-30 bg-[rgba(8,10,46,0.97)] backdrop-blur-xl -mx-4 sm:-mx-6 lg:-mx-8 px-4 sm:px-6 lg:px-8 pt-4 pb-4 border-b border-white/[0.05]">
                <h2 className="text-2xl font-bold text-white flex items-center gap-2">
                    <Wallet className="w-6 h-6 text-[#00FFFF]" />
                    Fund Wallet
                </h2>
                <p className="text-white/40 text-sm mt-0.5">Add money to your Zyrlent wallet</p>
            </div>

            {/* Balance Card */}
            <div className="rounded-2xl border border-[rgba(0,255,255,0.2)] bg-gradient-to-br from-[rgba(15,20,60,0.9)] to-[rgba(10,11,61,0.98)] p-5 flex items-center justify-between overflow-hidden relative">
                <div className="absolute -top-6 -right-6 w-24 h-24 bg-[#00FFFF]/10 blur-2xl rounded-full" />
                <div className="relative z-10">
                    <p className="text-xs font-semibold text-white/40 uppercase tracking-wider mb-1">Current Balance</p>
                    <p className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-white to-[#00FFFF]">
                        {formatNaira(wallet)}
                    </p>
                </div>
                <div className="w-12 h-12 rounded-2xl bg-[rgba(0,255,255,0.1)] flex items-center justify-center relative z-10">
                    <Wallet className="w-6 h-6 text-[#00FFFF]" />
                </div>
            </div>

            {/* Payment Method Dropdown */}
            <div>
                <p className="text-xs font-semibold text-white/40 uppercase tracking-wider mb-2.5">Payment Method</p>
                <PaymentMethodDropdown selected={selectedMethod} onSelect={setSelectedMethod} />
            </div>

            {/* Divider */}
            <div className="flex items-center gap-3">
                <div className="flex-1 h-px bg-white/[0.07]" />
                <span className="text-[10px] font-semibold text-white/25 uppercase tracking-widest">
                    {PAYMENT_METHODS.find(m => m.id === selectedMethod)?.name}
                </span>
                <div className="flex-1 h-px bg-white/[0.07]" />
            </div>

            {/* Panel */}
            {renderPanel()}

            {/* ── Recent Deposits ── */}
            <div className="mt-4 flex flex-col gap-4">
                <div className="flex items-center justify-between border-b border-white/[0.05] pb-2">
                    <div>
                        <h3 className="text-lg font-bold text-white">Recent Deposits</h3>
                        <p className="text-white/40 text-xs mt-0.5">Your credit history</p>
                    </div>
                    <button
                        onClick={() => fetchDeposits(page)}
                        disabled={loading}
                        className="p-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/8 text-white/50 hover:text-white transition disabled:opacity-40"
                    >
                        <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
                    </button>
                </div>

                {/* Desktop */}
                <div className="hidden md:block rounded-xl overflow-hidden border border-[rgba(255,255,255,0.08)] bg-[rgba(15,20,60,0.3)]">
                    <div className="overflow-x-auto">
                        <table className="w-full border-collapse">
                            <thead>
                                <tr className="bg-[rgba(255,255,255,0.04)] text-left">
                                    {['REFERENCE', 'AMOUNT', 'METHOD', 'STATUS', 'DATE'].map(h => (
                                        <th key={h} className="px-4 py-3 text-[10px] font-bold text-white/35 uppercase tracking-wider">{h}</th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody>
                                {loading ? (
                                    <tr><td colSpan={5} className="text-center py-8 text-white/30 text-xs">Loading deposits…</td></tr>
                                ) : deposits.length === 0 ? (
                                    <tr><td colSpan={5} className="text-center py-8 text-white/30 text-xs">No recent deposits found.</td></tr>
                                ) : deposits.map(dep => (
                                    <tr key={dep.id} className="border-t border-[rgba(255,255,255,0.05)] hover:bg-white/3 transition">
                                        <td className="px-4 py-3 text-xs font-mono text-white/60 max-w-[120px] truncate" title={dep.reference}>{dep.reference}</td>
                                        <td className="px-4 py-3 font-bold text-xs text-emerald-400">+{formatNGN(dep.amount)}</td>
                                        <td className="px-4 py-3 text-xs text-white/70">{getMethod(dep)}</td>
                                        <td className="px-4 py-3"><DepositStatusBadge status={dep.status} /></td>
                                        <td className="px-4 py-3 text-[11px] text-white/40">{formatDate(dep.created_at)}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* Mobile */}
                <div className="flex flex-col gap-2.5 md:hidden">
                    {loading ? (
                        <div className="text-center py-8 text-white/30 text-xs">Loading deposits…</div>
                    ) : deposits.length === 0 ? (
                        <div className="text-center py-8 text-white/30 text-xs">No recent deposits found.</div>
                    ) : deposits.map(dep => (
                        <div key={dep.id} className="p-3.5 rounded-xl border border-[rgba(255,255,255,0.08)] bg-[rgba(15,20,60,0.5)] flex flex-col gap-2">
                            <div className="flex items-center justify-between">
                                <span className="text-xs font-mono text-white/60 truncate max-w-[150px]" title={dep.reference}>{dep.reference}</span>
                                <span className="font-bold text-sm text-emerald-400">+{formatNGN(dep.amount)}</span>
                            </div>
                            <div className="flex items-center justify-between text-xs text-white/40 border-t border-white/5 pt-2">
                                <span>{getMethod(dep)}</span>
                                <div className="flex items-center gap-2">
                                    <DepositStatusBadge status={dep.status} />
                                    <span className="text-[10px] text-white/30">{formatDate(dep.created_at)}</span>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Pagination */}
                {!loading && meta.last_page > 1 && (
                    <div className="flex items-center justify-center gap-2 mt-2">
                        <button disabled={page <= 1} onClick={() => handlePageChange(page - 1)} className="p-1.5 rounded-lg border border-white/10 hover:bg-white/8 disabled:opacity-30 transition">
                            <ChevronLeft className="w-3.5 h-3.5" />
                        </button>
                        <span className="text-xs text-white/50">Page {page} of {meta.last_page}</span>
                        <button disabled={page >= meta.last_page} onClick={() => handlePageChange(page + 1)} className="p-1.5 rounded-lg border border-white/10 hover:bg-white/8 disabled:opacity-30 transition">
                            <ChevronRight className="w-3.5 h-3.5" />
                        </button>
                    </div>
                )}
            </div>
        </div>
    )
}
