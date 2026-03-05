import { X, LogOut } from 'lucide-react'
import { useAuth } from '../../context/AuthContext'
import { useNavigate } from 'react-router-dom'
import logo from '../../assets/logo.png'

export default function Sidebar({ isOpen, onClose, walletBalance, activeSection, onNavigate, navItems, user, formatNaira }) {
    const { logout } = useAuth()
    const navigate = useNavigate()

    const handleLogout = async () => {
        await logout()
        navigate('/')
    }

    const sidebarClass = `fixed top-0 left-0 h-full w-[280px] z-[100] transform transition-transform duration-300 ease-in-out flex flex-col border-r border-[rgba(255,255,255,0.07)] bg-[rgba(8,10,46,0.97)] backdrop-blur-2xl ${isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}`
    const overlayClass = `fixed inset-0 bg-black/60 backdrop-blur-sm z-[90] transition-opacity duration-300 lg:hidden ${isOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`

    return (
        <>
            <div className={overlayClass} onClick={onClose} />

            <aside className={sidebarClass}>
                {/* Logo Header */}
                <div className="px-5 pt-5 pb-4 flex items-center justify-between border-b border-[rgba(255,255,255,0.07)] flex-shrink-0">
                    <img src={logo} alt="Zyrlent" className="h-8 object-contain" />
                    <button onClick={onClose} className="p-1.5 rounded-xl hover:bg-white/10 text-white/50 transition lg:hidden">
                        <X className="w-5 h-5" />
                    </button>
                </div>

                {/* User Profile Strip */}
                <div className="px-5 py-4 border-b border-[rgba(255,255,255,0.06)] flex-shrink-0">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-[#33CCFF] to-[#0099FF] flex items-center justify-center text-white font-bold text-base shadow-[0_0_10px_rgba(0,255,255,0.25)] flex-shrink-0">
                            {user?.name?.[0]?.toUpperCase() || 'U'}
                        </div>
                        <div className="min-w-0">
                            <p className="text-sm font-bold text-white truncate">{user?.name}</p>
                            <p className="text-xs text-white/40 truncate">{user?.email}</p>
                        </div>
                    </div>

                    {/* Wallet balance in sidebar */}
                    <div className="mt-3 flex items-center justify-between px-3 py-2.5 rounded-xl bg-[rgba(0,255,255,0.06)] border border-[rgba(0,255,255,0.12)]">
                        <div>
                            <p className="text-[10px] text-white/40 uppercase tracking-wider">Wallet</p>
                            <p className="text-sm font-bold text-[#00FFFF]">{formatNaira(walletBalance)}</p>
                        </div>
                        <button
                            onClick={() => onNavigate('fund-wallet')}
                            className="px-3 py-1.5 rounded-lg bg-gradient-to-r from-[#33CCFF] to-[#0066CC] text-white text-xs font-bold shadow-[0_0_8px_rgba(0,255,255,0.2)] hover:shadow-[0_0_14px_rgba(0,255,255,0.35)] transition"
                        >
                            + Fund
                        </button>
                    </div>
                </div>

                {/* Navigation */}
                <nav className="flex-1 overflow-y-auto px-3 py-4 flex flex-col gap-0.5">
                    <p className="text-[10px] font-bold text-white/25 uppercase tracking-widest px-3 mb-2">Navigation</p>
                    {navItems.map(item => {
                        const isActive = activeSection === item.id
                        return (
                            <button
                                key={item.id}
                                onClick={() => onNavigate(item.id)}
                                className={`w-full flex items-center gap-3 px-3.5 py-3 rounded-xl transition-all font-medium text-left ${isActive
                                    ? 'bg-gradient-to-r from-[rgba(0,255,255,0.14)] to-transparent text-[#00FFFF] border-l-2 border-[#00FFFF] pl-3'
                                    : 'text-white/55 hover:bg-white/5 hover:text-white'
                                    }`}
                            >
                                <item.icon className={`w-4.5 h-4.5 flex-shrink-0 ${isActive ? 'text-[#00FFFF]' : 'opacity-70'}`} style={{ width: '18px', height: '18px' }} />
                                <span className="text-sm">{item.label}</span>
                                {isActive && (
                                    <span className="ml-auto w-1.5 h-1.5 rounded-full bg-[#00FFFF]" />
                                )}
                            </button>
                        )
                    })}
                </nav>

                {/* Bottom Logout */}
                <div className="p-4 border-t border-[rgba(255,255,255,0.07)] flex-shrink-0">
                    <button
                        onClick={handleLogout}
                        className="w-full flex items-center gap-3 px-3.5 py-3 rounded-xl transition font-medium text-red-400/80 hover:text-red-400 hover:bg-red-400/8"
                    >
                        <LogOut style={{ width: '18px', height: '18px' }} className="flex-shrink-0" />
                        <span className="text-sm">Logout</span>
                    </button>
                </div>
            </aside>
        </>
    )
}
