import { useState, useEffect, useRef } from 'react'
import {
    Menu, Bell, ShieldCheck, LayoutDashboard, Server, Users,
    ShoppingCart, Wallet, Settings, LogOut, ChevronDown, Globe,
    Gift, MessageSquare, Megaphone, UserCog, Phone
} from 'lucide-react'
import { useAdminAuth } from '../../context/AdminAuthContext'
import { useNavigate, useLocation } from 'react-router-dom'
import adminApi from '../../lib/adminAxios'
import Background from '../../components/Background'
import AdminSidebar from './AdminSidebar'

import AdminOverviewSection from './sections/AdminOverviewSection'
import ManageServicesSection from './sections/ManageServicesSection'
import ManageUsersSection from './sections/ManageUsersSection'
import ManageOrdersSection from './sections/ManageOrdersSection'
import FundRequestsSection from './sections/FundRequestsSection'
import ManageCountriesSection from './sections/ManageCountriesSection'
import ApiSettingsSection from './sections/ApiSettingsSection'
import ManageReferralsSection from './sections/ManageReferralsSection'
import SupportTicketsSection from './sections/SupportTicketsSection'
import NotificationsSection from './sections/NotificationsSection'
import AdminProfileSection from './sections/AdminProfileSection'
import NumberInventorySection from './sections/NumberInventorySection'

export const ADMIN_NAV = [
    { id: 'overview', label: 'Dashboard', icon: LayoutDashboard, path: '/admin/dashboard', group: 'Management' },
    { id: 'services', label: 'Services', icon: Server, path: '/admin/services', group: 'Management' },
    { id: 'countries', label: 'Countries', icon: Globe, path: '/admin/countries', group: 'Management' },
    { id: 'users', label: 'Users', icon: Users, path: '/admin/users', group: 'Management' },
    { id: 'orders', label: 'Orders', icon: ShoppingCart, path: '/admin/orders', group: 'Management' },
    { id: 'number-inventory', label: 'Number Inventory', icon: Phone, path: '/admin/number-inventory', group: 'Management' },
    { id: 'fund-requests', label: 'Fund Requests', icon: Wallet, path: '/admin/fund-requests', group: 'Management' },
    { id: 'referrals', label: 'Referrals', icon: Gift, path: '/admin/referrals', group: 'Management' },
    { id: 'support', label: 'Support Tickets', icon: MessageSquare, path: '/admin/support', group: 'Communication' },
    { id: 'notifications', label: 'Notifications', icon: Megaphone, path: '/admin/notifications', group: 'Communication' },
    { id: 'settings', label: 'API Settings', icon: Settings, path: '/admin/settings', group: 'System' },
    { id: 'profile', label: 'Account', icon: UserCog, path: '/admin/profile', group: 'System' },
]

const PATH_TO_SECTION = {
    '/admin/dashboard': 'overview',
    '/admin/services': 'services',
    '/admin/countries': 'countries',
    '/admin/users': 'users',
    '/admin/orders': 'orders',
    '/admin/number-inventory': 'number-inventory',
    '/admin/fund-requests': 'fund-requests',
    '/admin/referrals': 'referrals',
    '/admin/support': 'support',
    '/admin/notifications': 'notifications',
    '/admin/settings': 'settings',
    '/admin/profile': 'profile',
}

const SECTION_TITLES = {
    overview: 'Dashboard',
    services: 'Manage Services',
    countries: 'Manage Countries',
    users: 'Manage Users',
    orders: 'All Orders',
    'number-inventory': 'Number Inventory',
    'fund-requests': 'Fund Requests',
    referrals: 'Referrals',
    support: 'Support Tickets',
    notifications: 'Notifications',
    settings: 'API Settings',
    profile: 'Account Settings',
}

export default function AdminDashboard({ initialSection }) {
    const { admin, isLoading, logout } = useAdminAuth()
    const navigate = useNavigate()
    const location = useLocation()

    const [isSidebarOpen, setIsSidebarOpen] = useState(false)
    const [showAvatarMenu, setShowAvatarMenu] = useState(false)
    const [pendingFundsCount, setPendingFundsCount] = useState(0)
    const avatarRef = useRef(null)

    const activeSection = PATH_TO_SECTION[location.pathname] || initialSection || 'overview'

    useEffect(() => {
        if (!isLoading && !admin) navigate('/admin/login')
    }, [admin, isLoading])

    useEffect(() => {
        if (admin) {
            adminApi.get('/api/admin/funds/pending', { params: { per_page: 1 } })
                .then(r => setPendingFundsCount(r.data.total ?? 0))
                .catch(() => { })
        }
    }, [admin, activeSection])

    useEffect(() => {
        const handleClick = (e) => {
            if (avatarRef.current && !avatarRef.current.contains(e.target)) setShowAvatarMenu(false)
        }
        document.addEventListener('mousedown', handleClick)
        return () => document.removeEventListener('mousedown', handleClick)
    }, [])

    const handleNavigate = (sectionId) => {
        const item = ADMIN_NAV.find(n => n.id === sectionId)
        if (item) navigate(item.path)
    }

    const handleLogout = async () => {
        await logout()
        navigate('/admin/login')
    }

    if (isLoading) {
        return (
            <Background>
                <div className="min-h-screen flex items-center justify-center">
                    <div className="w-10 h-10 border-3 border-[#FF9500] border-t-transparent rounded-full animate-spin" />
                </div>
            </Background>
        )
    }

    if (!admin) return null

    const renderSection = () => {
        switch (activeSection) {
            case 'overview': return <AdminOverviewSection />
            case 'services': return <ManageServicesSection />
            case 'countries': return <ManageCountriesSection />
            case 'users': return <ManageUsersSection />
            case 'orders': return <ManageOrdersSection />
            case 'number-inventory': return <NumberInventorySection />
            case 'fund-requests': return <FundRequestsSection />
            case 'referrals': return <ManageReferralsSection />
            case 'support': return <SupportTicketsSection />
            case 'notifications': return <NotificationsSection />
            case 'settings': return <ApiSettingsSection />
            case 'profile': return <AdminProfileSection />
            default: return <AdminOverviewSection />
        }
    }

    return (
        <Background>
            <div className="min-h-screen flex">
                <AdminSidebar
                    isOpen={isSidebarOpen}
                    onClose={() => setIsSidebarOpen(false)}
                    activeSection={activeSection}
                    onNavigate={handleNavigate}
                    navItems={ADMIN_NAV}
                    admin={admin}
                    pendingFundsCount={pendingFundsCount}
                />

                <div className="flex-1 lg:ml-[280px] flex flex-col min-h-screen">
                    {/* Top Bar */}
                    <header className="flex items-center justify-between px-5 py-4 border-b border-[rgba(255,149,0,0.08)] bg-[rgba(8,10,46,0.6)] backdrop-blur-xl sticky top-0 z-50">
                        <div className="flex items-center gap-3">
                            <button onClick={() => setIsSidebarOpen(true)} className="p-2 rounded-xl hover:bg-white/10 text-white/50 transition lg:hidden">
                                <Menu className="w-5 h-5" />
                            </button>
                            <h1 className="text-lg font-bold text-white">{SECTION_TITLES[activeSection]}</h1>
                        </div>

                        <div className="flex items-center gap-3">
                            {/* Notification bell */}
                            <button className="relative p-2 rounded-xl hover:bg-white/10 text-white/40 transition">
                                <Bell className="w-5 h-5" />
                                {pendingFundsCount > 0 && (
                                    <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-[#FF9500]" />
                                )}
                            </button>

                            {/* Avatar menu */}
                            <div className="relative" ref={avatarRef}>
                                <button onClick={() => setShowAvatarMenu(v => !v)}
                                    className="flex items-center gap-2 px-3 py-1.5 rounded-xl hover:bg-white/[0.06] transition">
                                    <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-[#FF9500] to-[#FF6B00] flex items-center justify-center text-white text-sm font-bold">
                                        <ShieldCheck className="w-4 h-4" />
                                    </div>
                                    <span className="text-sm text-white/60 hidden sm:inline">{admin.name}</span>
                                    <ChevronDown className="w-3.5 h-3.5 text-white/30" />
                                </button>

                                {showAvatarMenu && (
                                    <div className="absolute right-0 mt-2 w-48 rounded-xl bg-[rgba(15,20,60,0.95)] border border-[rgba(255,149,0,0.1)] backdrop-blur-xl shadow-xl py-1.5 z-50">
                                        <button onClick={() => { handleNavigate('profile'); setShowAvatarMenu(false) }}
                                            className="flex items-center gap-2.5 px-4 py-2.5 w-full text-left text-sm text-white/50 hover:bg-white/[0.06] hover:text-white transition">
                                            <UserCog className="w-4 h-4" /> Account Settings
                                        </button>
                                        <div className="h-px bg-white/5 mx-3" />
                                        <button onClick={handleLogout}
                                            className="flex items-center gap-2.5 px-4 py-2.5 w-full text-left text-sm text-white/50 hover:bg-white/[0.06] hover:text-red-400 transition">
                                            <LogOut className="w-4 h-4" /> Logout
                                        </button>
                                    </div>
                                )}
                            </div>
                        </div>
                    </header>

                    {/* Main Content */}
                    <main className="flex-1 p-5 lg:p-8">
                        {renderSection()}
                    </main>
                </div>
            </div>
        </Background>
    )
}
