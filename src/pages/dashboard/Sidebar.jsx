import { X, LayoutDashboard, Wallet, ShoppingCart, History, ArrowLeftRight, Settings, LifeBuoy, LogOut, Bell, User as UserIcon } from 'lucide-react'
import { useAuth } from '../../context/AuthContext'
import { useNavigate } from 'react-router-dom'
import logo from '../../assets/logo.png'

export default function Sidebar({ isOpen, onClose, walletBalance }) {
    const { logout } = useAuth()
    const navigate = useNavigate()

    const handleLogout = async () => {
        await logout()
        navigate('/')
    }

    const formatNaira = (amount) => {
        return new Intl.NumberFormat('en-NG', { style: 'currency', currency: 'NGN' }).format(amount || 0)
    }

    // Animation classes
    const sidebarClass = `fixed top-0 left-0 h-full w-[280px] bg-[#0A0B3D] border-r border-white/10 z-[100] transform transition-transform duration-300 ease-in-out ${isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}`
    const overlayClass = `fixed inset-0 bg-black/60 backdrop-blur-sm z-[90] transition-opacity duration-300 lg:hidden ${isOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`

    const navLinks = [
        { name: 'Dashboard', icon: LayoutDashboard, path: '/dashboard', active: true },
        { name: 'Fund Wallet', icon: Wallet, path: '#' },
        { name: 'Rent Number', icon: ShoppingCart, path: '#' },
        { name: 'Purchase History', icon: History, path: '#' },
        { name: 'Transactions', icon: ArrowLeftRight, path: '#' },
        { name: 'Services', icon: Settings, path: '#' },
        { name: 'Support', icon: LifeBuoy, path: '#' },
    ]

    return (
        <>
            <div className={overlayClass} onClick={onClose} />

            <aside className={sidebarClass}>
                <div className="flex flex-col h-full overflow-y-auto">
                    {/* Top Brand Header (from sketch) */}
                    <div className="px-5 pt-6 pb-4 flex items-center justify-between border-b border-white/10">
                        <div className="flex items-center gap-3">
                            <button onClick={onClose} className="p-1 -ml-1 rounded hover:bg-white/10 text-white transition lg:hidden">
                                <X className="w-6 h-6" />
                            </button>
                            <img src={logo} alt="Zyrlent Logo" className="h-8 object-contain" />
                        </div>
                    </div>

                    {/* Balance Pill & Icons (from sketch top right, moved to sidebar for mobile consistency if desired - or just kept as is) */}
                    <div className="px-5 py-4 border-b border-white/5 flex items-center justify-between">
                        <div className="flex items-center gap-1.5 px-3 py-1.5 bg-white/5 rounded-full text-sm font-medium border border-white/10 text-white">
                            <span className="text-[#00FFFF] font-bold">₦</span>
                            <span>{formatNaira(walletBalance).replace('₦', '').trim()}</span>
                        </div>

                        <div className="flex gap-2">
                            <button className="p-1.5 rounded-full text-white hover:bg-white/10 transition">
                                <Bell className="w-4 h-4" />
                            </button>
                            <button className="p-1.5 rounded-full text-white hover:bg-white/10 transition bg-gradient-to-br from-[#33CCFF] to-[#0099FF] shadow-[0_0_10px_rgba(0,255,255,0.3)]">
                                <UserIcon className="w-4 h-4" />
                            </button>
                        </div>
                    </div>

                    {/* Navigation Links */}
                    <nav className="flex-1 px-3 py-6 flex flex-col gap-1">
                        {navLinks.map((link) => (
                            <a
                                key={link.name}
                                href={link.path}
                                className={`flex items-center gap-3 px-4 py-3.5 rounded-xl transition font-medium ${link.active
                                    ? 'bg-gradient-to-r from-[rgba(0,255,255,0.15)] to-transparent text-[#00FFFF] border-l-2 border-[#00FFFF]'
                                    : 'text-white/70 hover:bg-white/5 hover:text-white'
                                    }`}
                            >
                                <link.icon className={`w-5 h-5 ${link.active ? 'text-[#00FFFF]' : ''}`} />
                                {link.name}
                            </a>
                        ))}
                    </nav>

                    {/* Bottom Logout */}
                    <div className="p-5 border-t border-white/10">
                        <button
                            onClick={handleLogout}
                            className="w-full flex items-center gap-3 px-4 py-3.5 rounded-xl transition font-medium text-red-400 hover:bg-red-400/10"
                        >
                            <LogOut className="w-5 h-5" />
                            Logout
                        </button>
                    </div>
                </div>
            </aside>
        </>
    )
}
