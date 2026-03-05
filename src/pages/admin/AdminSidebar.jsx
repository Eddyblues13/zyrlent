import { X, LogOut, ShieldCheck } from 'lucide-react'
import { useAdminAuth } from '../../context/AdminAuthContext'
import { useNavigate } from 'react-router-dom'
import logo from '../../assets/logo.png'

export default function AdminSidebar({ isOpen, onClose, activeSection, onNavigate, navItems, admin, pendingFundsCount }) {
    const { logout } = useAdminAuth()
    const navigate = useNavigate()

    const handleLogout = async () => {
        await logout()
        navigate('/admin/login')
    }

    const sidebarClass = `fixed top-0 left-0 h-full w-[280px] z-[100] transform transition-transform duration-300 ease-in-out flex flex-col border-r border-[rgba(255,149,0,0.1)] bg-[rgba(8,10,46,0.97)] backdrop-blur-2xl ${isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}`
    const overlayClass = `fixed inset-0 bg-black/60 backdrop-blur-sm z-[90] transition-opacity duration-300 lg:hidden ${isOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`

    return (
        <>
            <div className={overlayClass} onClick={onClose} />

            <aside className={sidebarClass}>
                {/* Logo Header */}
                <div className="px-5 pt-5 pb-4 flex items-center justify-between border-b border-[rgba(255,149,0,0.1)] flex-shrink-0">
                    <div className="flex items-center gap-2.5">
                        <img src={logo} alt="Zyrlent" className="h-8 object-contain" />
                        <span className="text-xs font-bold text-[#FF9500] bg-[rgba(255,149,0,0.12)] px-2 py-0.5 rounded-md">ADMIN</span>
                    </div>
                    <button onClick={onClose} className="p-1.5 rounded-xl hover:bg-white/10 text-white/50 transition lg:hidden">
                        <X className="w-5 h-5" />
                    </button>
                </div>

                {/* Admin Profile Strip */}
                <div className="px-5 py-4 border-b border-[rgba(255,149,0,0.08)] flex-shrink-0">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-[#FF9500] to-[#FF6B00] flex items-center justify-center text-white font-bold text-base shadow-[0_0_10px_rgba(255,149,0,0.25)] flex-shrink-0">
                            <ShieldCheck className="w-5 h-5" />
                        </div>
                        <div className="min-w-0">
                            <p className="text-sm font-bold text-white truncate">{admin?.name}</p>
                            <p className="text-xs text-white/40 truncate">{admin?.email}</p>
                        </div>
                    </div>

                    {/* Pending Funds Badge */}
                    {pendingFundsCount > 0 && (
                        <div className="mt-3 flex items-center justify-between px-3 py-2.5 rounded-xl bg-[rgba(255,149,0,0.06)] border border-[rgba(255,149,0,0.12)]">
                            <div>
                                <p className="text-[10px] text-white/40 uppercase tracking-wider">Pending Funds</p>
                                <p className="text-sm font-bold text-[#FF9500]">{pendingFundsCount} request{pendingFundsCount !== 1 ? 's' : ''}</p>
                            </div>
                            <button
                                onClick={() => onNavigate('fund-requests')}
                                className="px-3 py-1.5 rounded-lg bg-gradient-to-r from-[#FF9500] to-[#FF6B00] text-white text-xs font-bold shadow-[0_0_8px_rgba(255,149,0,0.2)] hover:shadow-[0_0_14px_rgba(255,149,0,0.35)] transition"
                            >
                                Review
                            </button>
                        </div>
                    )}
                </div>

                {/* Navigation */}
                <nav className="flex-1 overflow-y-auto px-3 py-4 flex flex-col gap-0.5">
                    <p className="text-[10px] font-bold text-white/25 uppercase tracking-widest px-3 mb-2">Management</p>
                    {navItems.map(item => {
                        const Icon = item.icon
                        const isActive = activeSection === item.id
                        return (
                            <button
                                key={item.id}
                                onClick={() => { onNavigate(item.id); onClose() }}
                                className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-left transition-all duration-200 group w-full ${isActive
                                    ? 'bg-gradient-to-r from-[rgba(255,149,0,0.15)] to-[rgba(255,107,0,0.08)] text-[#FF9500] shadow-[inset_0_0_12px_rgba(255,149,0,0.06)]'
                                    : 'text-white/50 hover:bg-white/[0.04] hover:text-white/80'}`}
                            >
                                <Icon className={`w-[18px] h-[18px] flex-shrink-0 ${isActive ? 'text-[#FF9500]' : 'text-white/30 group-hover:text-white/60'}`} />
                                <span className="text-sm font-medium truncate">{item.label}</span>
                                {item.id === 'fund-requests' && pendingFundsCount > 0 && (
                                    <span className="ml-auto text-[10px] font-bold bg-[#FF9500] text-white rounded-full w-5 h-5 flex items-center justify-center">{pendingFundsCount}</span>
                                )}
                            </button>
                        )
                    })}
                </nav>

                {/* Logout */}
                <div className="px-3 py-4 border-t border-[rgba(255,149,0,0.08)]">
                    <button onClick={handleLogout}
                        className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-white/40 hover:bg-red-500/10 hover:text-red-400 transition-all w-full text-left"
                    >
                        <LogOut className="w-[18px] h-[18px]" />
                        <span className="text-sm font-medium">Logout</span>
                    </button>
                </div>
            </aside>
        </>
    )
}
