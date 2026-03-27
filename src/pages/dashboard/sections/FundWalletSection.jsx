import { useState } from 'react'
import { Wallet, Copy, Check, CreditCard, Building2, Smartphone, AlertCircle, ExternalLink, Shield, Zap } from 'lucide-react'
import api from '../../../lib/axios'
import toast from 'react-hot-toast'

const QUICK_AMOUNTS = [10000, 15000, 20000, 30000, 50000, 100000]

/* ─── KORAPAY TAB ─── */
function KoraPayTab({ wallet, formatNaira }) {
    const [amount, setAmount] = useState('')
    const [loading, setLoading] = useState(false)

    const handlePay = async () => {
        if (!amount || parseFloat(amount) < 100) return
        setLoading(true)
        try {
            const redirectUrl = window.location.origin + '/dashboard?payment=success';
            const res = await api.post('/api/wallet/korapay/initialize', {
                amount: parseFloat(amount),
                redirect_url: redirectUrl
            });

            if (res.data.checkout_url) {
                window.location.href = res.data.checkout_url;
            } else {
                toast.error('Could not get payment link');
                setLoading(false);
            }
        } catch (err) {
            toast.error(err.response?.data?.message || 'Payment initialization failed');
            setLoading(false);
        }
    }

    return (
        <div className="flex flex-col gap-5">
            {/* KoraPay Banner */}
            <div className="flex items-center gap-4 p-4 rounded-xl border border-[rgba(0,255,255,0.15)] bg-gradient-to-r from-[rgba(0,100,255,0.08)] to-[rgba(0,255,255,0.04)]">
                <div className="w-12 h-12 rounded-xl bg-[#1760EF] flex items-center justify-center font-bold text-white text-sm flex-shrink-0 shadow-[0_0_12px_rgba(23,96,239,0.4)]">
                    KP
                </div>
                <div>
                    <p className="text-sm font-bold text-white">Pay with KoraPay</p>
                    <p className="text-xs text-white/40 mt-0.5">Instant · Card, Bank Transfer, USSD &amp; more</p>
                </div>
                <div className="ml-auto flex items-center gap-1 text-emerald-400 text-xs font-semibold bg-emerald-400/10 px-2.5 py-1 rounded-full border border-emerald-400/20">
                    <Shield className="w-3 h-3" /> Secure
                </div>
            </div>

            {/* Amount Input */}
            <div>
                <label className="text-xs font-semibold text-white/40 uppercase tracking-wider mb-2.5 block">Enter Amount (₦)</label>
                <div className="relative">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-[#00FFFF] font-bold text-xl">₦</span>
                    <input
                        type="number"
                        min="100"
                        placeholder="0.00"
                        value={amount}
                        onChange={e => setAmount(e.target.value)}
                        className="w-full pl-10 pr-4 py-4 rounded-xl bg-[rgba(255,255,255,0.05)] border border-[rgba(255,255,255,0.1)] text-white text-xl font-semibold placeholder-white/20 focus:outline-none focus:border-[rgba(0,255,255,0.4)] transition"
                    />
                </div>
                <div className="flex flex-wrap gap-2 mt-3">
                    {QUICK_AMOUNTS.map(a => (
                        <button
                            key={a}
                            onClick={() => setAmount(String(a))}
                            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition ${amount === String(a)
                                ? 'bg-[rgba(0,255,255,0.15)] text-[#00FFFF] border border-[rgba(0,255,255,0.4)]'
                                : 'bg-[rgba(255,255,255,0.05)] text-white/50 border border-[rgba(255,255,255,0.08)] hover:bg-white/10'
                                }`}
                        >
                            ₦{a.toLocaleString()}
                        </button>
                    ))}
                </div>
            </div>

            {/* What you can pay with */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {[
                    { icon: CreditCard, label: 'Card', sub: 'Visa / MC / Verve', color: '#1760EF' },
                    { icon: Building2, label: 'Bank Transfer', sub: 'All Nigerian banks', color: '#00FFFF' },
                    { icon: Smartphone, label: 'USSD', sub: '*737# etc.', color: '#33CCFF' },
                    { icon: Wallet, label: 'Bank Account', sub: 'Direct debit', color: '#0099FF' },
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
                <span>A small processing fee (1.5%, capped at ₦2,000) applies to card and bank payments. USSD is free.</span>
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
                        Pay with KoraPay{amount && parseFloat(amount) >= 100 ? ` · ₦${parseFloat(amount).toLocaleString()}` : ''}
                    </>
                )}
            </button>

            <p className="text-center text-xs text-white/25">
                Secured by <span className="text-[#1760EF] font-semibold">KoraPay</span> · 256-bit encryption
            </p>
        </div>
    )
}

/* ─── BANK TRANSFER MANUAL TAB ─── */
function OPayTab() {
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
            const res = await api.post('/api/wallet/manual-fund', {
                amount: parseFloat(amount),
                reference: ref.trim(),
            })
            toast.success(res.data.message)
            setSubmitted(true)
        } catch (e) {
            toast.error(e.response?.data?.message || 'Submission failed. Please try again.')
        } finally {
            setSubmitting(false)
        }
    }

    return (
        <div className="flex flex-col gap-5">
            {/* Bank Transfer Banner */}
            <div className="flex items-center gap-4 p-4 rounded-xl border border-[rgba(0,200,100,0.2)] bg-gradient-to-r from-[rgba(0,200,100,0.06)] to-transparent">
                <div className="w-12 h-12 rounded-xl bg-[#00C364] flex items-center justify-center font-bold text-white text-sm flex-shrink-0 shadow-[0_0_12px_rgba(0,195,100,0.4)]">
                    <Building2 className="w-5 h-5" />
                </div>
                <div>
                    <p className="text-sm font-bold text-white">Manual Bank Transfer</p>
                    <p className="text-xs text-white/40 mt-0.5">Transfer from any bank to our PROVIDUS BANK account</p>
                </div>
                <div className="ml-auto flex items-center gap-1 text-amber-400 text-xs font-semibold bg-amber-400/10 px-2.5 py-1 rounded-full border border-amber-400/20 whitespace-nowrap">
                    <AlertCircle className="w-3 h-3" /> Manual
                </div>
            </div>

            {/* Amount */}
            <div>
                <label className="text-xs font-semibold text-white/40 uppercase tracking-wider mb-2.5 block">Amount to Transfer (₦)</label>
                <div className="relative">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-[#00C364] font-bold text-xl">₦</span>
                    <input
                        type="number"
                        min="100"
                        placeholder="0.00"
                        value={amount}
                        onChange={e => setAmount(e.target.value)}
                        className="w-full pl-10 pr-4 py-4 rounded-xl bg-[rgba(255,255,255,0.05)] border border-[rgba(255,255,255,0.1)] text-white text-xl font-semibold placeholder-white/20 focus:outline-none focus:border-[rgba(0,195,100,0.4)] transition"
                    />
                </div>
                <div className="flex flex-wrap gap-2 mt-3">
                    {QUICK_AMOUNTS.map(a => (
                        <button
                            key={a}
                            onClick={() => setAmount(String(a))}
                            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition ${amount === String(a)
                                ? 'bg-[rgba(0,195,100,0.15)] text-[#00C364] border border-[rgba(0,195,100,0.4)]'
                                : 'bg-[rgba(255,255,255,0.05)] text-white/50 border border-[rgba(255,255,255,0.08)] hover:bg-white/10'
                                }`}
                        >
                            ₦{a.toLocaleString()}
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
                        { label: 'Bank', value: BANK_ACCOUNT.bank, key: 'bank' },
                        { label: 'Account Name', value: BANK_ACCOUNT.accountName, key: 'name' },
                        { label: 'Account Number', value: BANK_ACCOUNT.accountNumber, key: 'number', copyable: true, large: true },
                    ].map(item => (
                        <div key={item.key} className="flex items-center justify-between gap-4">
                            <div className="min-w-0">
                                <p className="text-xs text-white/35 mb-0.5">{item.label}</p>
                                <p className={`font-semibold text-white ${item.large ? 'text-xl tracking-widest' : 'text-sm'}`}>{item.value}</p>
                            </div>
                            {item.copyable && (
                                <button onClick={() => copyText(item.value, item.key)} className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[rgba(0,195,100,0.1)] border border-[rgba(0,195,100,0.25)] text-[#00C364] text-xs font-bold hover:bg-[rgba(0,195,100,0.2)] transition flex-shrink-0">
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
                    <li>1. Transfer the exact amount you selected above.</li>
                    <li>2. Use your <span className="text-white font-semibold">registered email</span> as the payment narration/description.</li>
                    <li>3. After transferring, click the button below and provide your reference number.</li>
                    <li>4. Your wallet will be credited within <span className="text-white font-semibold">5–30 minutes</span> after confirmation.</li>
                </ul>
            </div>

            {/* Reference Input & Confirm */}
            <div>
                <label className="text-xs font-semibold text-white/40 uppercase tracking-wider mb-2.5 block">Your Transfer Reference / Receipt Number</label>
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

            <p className="text-center text-xs text-white/25">Processing may take up to 30 mins. Contact support if your wallet isn't credited.</p>
        </div>
    )
}

/* ─── MAIN COMPONENT ─── */
export default function FundWalletSection({ wallet, formatNaira }) {
    const [tab, setTab] = useState('korapay')

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

            {/* Payment Method Tabs */}
            <div>
                <label className="text-xs font-semibold text-white/40 uppercase tracking-wider mb-2.5 block">Payment Method</label>
                <div className="grid grid-cols-2 gap-2 p-1 rounded-xl bg-[rgba(255,255,255,0.04)] border border-[rgba(255,255,255,0.07)]">
                    <button
                    onClick={() => setTab('korapay')}
                    className={`flex items-center justify-center gap-2.5 py-3 rounded-lg text-sm font-bold transition ${tab === 'korapay'
                        ? 'bg-[#1760EF]/20 text-white border border-[#1760EF]/40 shadow-[0_0_12px_rgba(23,96,239,0.2)]'
                        : 'text-white/45 hover:bg-white/5'
                        }`}
                >
                    <span className="w-6 h-6 rounded bg-[#1760EF] flex items-center justify-center text-[10px] font-black text-white">KP</span>
                    KoraPay
                    <span className="text-[9px] bg-[#1760EF]/20 text-[#7aabff] px-1.5 py-0.5 rounded font-semibold">Instant</span>
                </button>
                <button
                    onClick={() => setTab('opay')}
                    className={`flex items-center justify-center gap-2.5 py-3 rounded-lg text-sm font-bold transition ${tab === 'opay'
                        ? 'bg-[#00C364]/15 text-white border border-[#00C364]/35 shadow-[0_0_12px_rgba(0,195,100,0.15)]'
                        : 'text-white/45 hover:bg-white/5'
                        }`}
                >
                    <span className="w-6 h-6 rounded bg-[#00C364] flex items-center justify-center"><Building2 className="w-3.5 h-3.5 text-white" /></span>
                    Bank Transfer
                    <span className="text-[9px] bg-amber-400/15 text-amber-400 px-1.5 py-0.5 rounded font-semibold">5-30m</span>
                </button>
            </div>
        </div>

        {/* Tab Content */}
            {tab === 'korapay' ? (
                <KoraPayTab wallet={wallet} formatNaira={formatNaira} />
            ) : (
                <OPayTab />
            )}
        </div>
    )
}
