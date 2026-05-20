import { useState, useEffect } from 'react'
import { X, AlertCircle, Smartphone, Globe, Shield, HelpCircle, Megaphone } from 'lucide-react'

export default function QuickSetupNotice({ triggerOpen, onClose }) {
    const [isOpen, setIsOpen] = useState(false)

    useEffect(() => {
        // Check if the user has already seen the notice
        const hasSeenNotice = localStorage.getItem('zyrlent_quick_setup_seen')
        if (!hasSeenNotice) {
            // Small delay for a smooth entry after the dashboard loads
            const timer = setTimeout(() => setIsOpen(true), 800)
            return () => clearTimeout(timer)
        }
    }, [])

    useEffect(() => {
        if (triggerOpen) {
            setIsOpen(true)
        }
    }, [triggerOpen])

    const handleClose = () => {
        setIsOpen(false)
        localStorage.setItem('zyrlent_quick_setup_seen', 'true')
        if (onClose) onClose()
    }

    if (!isOpen) return null

    return (
        <div className="fixed inset-0 z-[400] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-[fadeIn_0.2s_ease]"
            onMouseDown={e => { if (e.target === e.currentTarget) handleClose() }}>
            <div className="w-full max-w-md rounded-2xl bg-[#0B1040] border border-[#00FFFF]/30 overflow-hidden shadow-[0_0_60px_rgba(0,255,255,0.15)] animate-[slideUp_0.3s_ease]">
                {/* Header */}
                <div className="bg-gradient-to-r from-[rgba(0,255,255,0.15)] to-transparent px-6 py-4 flex items-center justify-between border-b border-[#00FFFF]/10">
                    <div className="flex items-center gap-2">
                        <Megaphone className="w-5 h-5 text-[#00FFFF]" />
                        <h3 className="text-lg font-bold text-white">Quick Setup Notice</h3>
                    </div>
                    <button onClick={handleClose} className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-white/40 hover:text-white transition">
                        <X className="w-5 h-5" />
                    </button>
                </div>

                {/* Content */}
                <div className="p-6">
                    <p className="text-sm text-[#FFFFFF]/80 mb-5">
                        To ensure a smooth WhatsApp verification with your Zyrlent number:
                    </p>

                    <ul className="space-y-4 mb-6">
                        <li className="flex gap-3 text-sm text-[#FFFFFF]/90">
                            <Smartphone className="w-5 h-5 text-[#00FFFF] flex-shrink-0" />
                            <span>Reinstall WhatsApp 📱 before verifying the number</span>
                        </li>
                        <li className="flex gap-3 text-sm text-[#FFFFFF]/90">
                            <AlertCircle className="w-5 h-5 text-[#FFD60A] flex-shrink-0" />
                            <span>Use standard WhatsApp (avoid WhatsApp Business ⚠)</span>
                        </li>
                        <li className="flex gap-3 text-sm text-[#FFFFFF]/90">
                            <Globe className="w-5 h-5 text-[#00FFFF] flex-shrink-0" />
                            <span>Match your VPN 🌍 and time zone ⏰ with the number’s country</span>
                        </li>
                        <li className="flex gap-3 text-sm text-[#FFFFFF]/90">
                            <Shield className="w-5 h-5 text-[#00FF00] flex-shrink-0" />
                            <span>Enable 2FA 🔐 immediately after verification</span>
                        </li>
                    </ul>

                    <div className="bg-[#FF0000]/10 border border-[#FF0000]/20 rounded-xl p-4 mb-6">
                        <div className="flex gap-2">
                            <HelpCircle className="w-4 h-4 text-[#FF4444] flex-shrink-0 mt-0.5" />
                            <p className="text-xs text-[#FF4444] leading-relaxed">
                                <span className="font-bold">Important:</span> Due to WhatsApp security policies, Zyrlent cannot assist with numbers that are logged out or restricted after verification.
                            </p>
                        </div>
                    </div>

                    <p className="text-sm text-[#FFFFFF]/70 text-center font-medium mb-6">
                        Thank you for choosing Zyrlent.
                    </p>

                    <button onClick={handleClose}
                        className="w-full py-3 rounded-xl bg-gradient-to-r from-[#33CCFF] to-[#0066CC] text-white font-bold text-sm shadow-[0_0_15px_rgba(0,255,255,0.2)] hover:shadow-[0_0_22px_rgba(0,255,255,0.35)] transition-all">
                        I Understand
                    </button>
                </div>
            </div>
        </div>
    )
}
