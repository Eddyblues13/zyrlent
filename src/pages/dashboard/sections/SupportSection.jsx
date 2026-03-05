import { useState } from 'react'
import { LifeBuoy, MessageCircle, ChevronDown, ChevronUp, Send, Mail, Phone, ExternalLink } from 'lucide-react'

const FAQS = [
    { q: 'How do I fund my wallet?', a: 'Go to "Fund Wallet" and select your preferred payment method — card, bank transfer, or USSD. Funds are credited instantly for card and USSD payments.' },
    { q: 'How long does an OTP number remain active?', a: 'Numbers are active for up to 20 minutes after purchase. If no OTP is received, a refund is automatically issued to your wallet.' },
    { q: 'What happens if I don\'t receive an OTP?', a: 'If your OTP is not delivered within 20 minutes, we automatically refund the full amount to your wallet balance. You can then try again.' },
    { q: 'Can I use the same number multiple times?', a: 'No. Each rented number is single-use and expires after OTP delivery or 20 minutes, whichever comes first.' },
    { q: 'Which countries do you support?', a: 'We support 50+ countries. Visit the Services page to see the full list of available countries and their success rates.' },
    { q: 'Is my wallet balance redeemable?', a: 'Wallet credits are non-redeemable as cash. They can only be used to purchase OTP numbers within the platform.' },
    { q: 'How secure is my account?', a: 'We use industry-standard encryption and secure API gateways. Your payment information is never stored on our servers.' },
]

export default function SupportSection() {
    const [openFaq, setOpenFaq] = useState(null)
    const [form, setForm] = useState({ subject: '', message: '' })
    const [submitted, setSubmitted] = useState(false)

    const handleSubmit = (e) => {
        e.preventDefault()
        if (!form.subject || !form.message) return
        setSubmitted(true)
        setTimeout(() => setSubmitted(false), 4000)
        setForm({ subject: '', message: '' })
    }

    return (
        <div className="flex flex-col gap-8">
            {/* Header */}
            <div>
                <h2 className="text-2xl font-bold text-white flex items-center gap-2">
                    <LifeBuoy className="w-6 h-6 text-[#00FFFF]" />
                    Support & Help
                </h2>
                <p className="text-white/40 text-sm mt-0.5">We're here to help 24/7</p>
            </div>

            {/* Quick Contact */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {[
                    { icon: MessageCircle, label: 'Live Chat', desc: 'Avg. 2 min response', color: '#00FFFF', bg: 'rgba(0,255,255,0.1)', href: '#' },
                    { icon: Mail, label: 'Email Support', desc: 'support@zyrlent.com', color: '#33CCFF', bg: 'rgba(51,204,255,0.1)', href: 'mailto:support@zyrlent.com' },
                    { icon: Phone, label: 'Phone', desc: '+1 (800) ZYRLENT', color: '#0099FF', bg: 'rgba(0,153,255,0.1)', href: 'tel:+18009975368' },
                ].map((c, i) => (
                    <a
                        key={i}
                        href={c.href}
                        className="flex flex-col gap-3 p-5 rounded-xl border border-[rgba(255,255,255,0.08)] bg-[rgba(15,20,60,0.5)] hover:border-[rgba(0,255,255,0.25)] hover:bg-[rgba(15,20,60,0.8)] transition group"
                    >
                        <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: c.bg }}>
                            <c.icon className="w-5 h-5" style={{ color: c.color }} />
                        </div>
                        <div>
                            <p className="text-sm font-bold text-white flex items-center gap-1">
                                {c.label}
                                <ExternalLink className="w-3 h-3 text-white/30 group-hover:text-white/60 transition" />
                            </p>
                            <p className="text-xs text-white/40 mt-0.5">{c.desc}</p>
                        </div>
                    </a>
                ))}
            </div>

            {/* Contact Form */}
            <div className="rounded-2xl border border-[rgba(255,255,255,0.08)] bg-[rgba(15,20,60,0.5)] p-6">
                <h3 className="text-base font-bold text-white mb-4 flex items-center gap-2">
                    <Send className="w-4 h-4 text-[#00FFFF]" />
                    Send a Message
                </h3>
                {submitted ? (
                    <div className="py-8 text-center">
                        <div className="w-12 h-12 rounded-full bg-emerald-400/10 flex items-center justify-center mx-auto mb-3">
                            <Send className="w-6 h-6 text-emerald-400" />
                        </div>
                        <p className="text-white font-semibold">Message sent!</p>
                        <p className="text-white/40 text-sm mt-1">We'll respond within 24 hours</p>
                    </div>
                ) : (
                    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                        <div>
                            <label className="text-xs font-semibold text-white/40 uppercase tracking-wider mb-2 block">Subject</label>
                            <input
                                type="text"
                                placeholder="Describe your issue briefly"
                                value={form.subject}
                                onChange={e => setForm(f => ({ ...f, subject: e.target.value }))}
                                className="w-full px-4 py-3 rounded-xl bg-[rgba(255,255,255,0.05)] border border-[rgba(255,255,255,0.1)] text-white placeholder-white/30 text-sm focus:outline-none focus:border-[rgba(0,255,255,0.4)] transition"
                            />
                        </div>
                        <div>
                            <label className="text-xs font-semibold text-white/40 uppercase tracking-wider mb-2 block">Message</label>
                            <textarea
                                placeholder="Give us as much detail as possible…"
                                rows={4}
                                value={form.message}
                                onChange={e => setForm(f => ({ ...f, message: e.target.value }))}
                                className="w-full px-4 py-3 rounded-xl bg-[rgba(255,255,255,0.05)] border border-[rgba(255,255,255,0.1)] text-white placeholder-white/30 text-sm focus:outline-none focus:border-[rgba(0,255,255,0.4)] transition resize-none"
                            />
                        </div>
                        <button
                            type="submit"
                            disabled={!form.subject || !form.message}
                            className="py-3 rounded-xl bg-gradient-to-r from-[#33CCFF] to-[#0066CC] text-white font-bold text-sm shadow-[0_0_15px_rgba(0,255,255,0.2)] hover:shadow-[0_0_22px_rgba(0,255,255,0.35)] hover:scale-[1.01] transition-all disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:scale-100 flex items-center justify-center gap-2"
                        >
                            <Send className="w-4 h-4" />
                            Send Message
                        </button>
                    </form>
                )}
            </div>

            {/* FAQ */}
            <div>
                <h3 className="text-base font-bold text-white mb-4">Frequently Asked Questions</h3>
                <div className="flex flex-col gap-2">
                    {FAQS.map((faq, i) => (
                        <div key={i} className="rounded-xl border border-[rgba(255,255,255,0.08)] bg-[rgba(15,20,60,0.4)] overflow-hidden">
                            <button
                                onClick={() => setOpenFaq(openFaq === i ? null : i)}
                                className="w-full flex items-center justify-between p-4 text-left hover:bg-[rgba(0,255,255,0.03)] transition"
                            >
                                <span className="text-sm font-semibold text-white/85 pr-4">{faq.q}</span>
                                {openFaq === i
                                    ? <ChevronUp className="w-4 h-4 text-[#00FFFF] flex-shrink-0" />
                                    : <ChevronDown className="w-4 h-4 text-white/30 flex-shrink-0" />
                                }
                            </button>
                            {openFaq === i && (
                                <div className="px-4 pb-4">
                                    <p className="text-sm text-white/50 leading-relaxed">{faq.a}</p>
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            </div>
        </div>
    )
}
