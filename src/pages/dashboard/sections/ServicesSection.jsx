import { useState, useEffect, useCallback } from 'react'
import { Search, Filter, CheckCircle, Star, RefreshCw, Loader } from 'lucide-react'
import api from '../../../lib/axios'
import { ServiceIconWithFallback } from '../../../components/ServiceIcon'
import toast from 'react-hot-toast'

const CATEGORIES = ['All', 'Messaging', 'Social', 'Email', 'Shopping', 'Transport', 'Gaming', 'Entertainment']

export default function ServicesSection({ onNavigate }) {
    const [services, setServices] = useState([])
    const [loading, setLoading] = useState(true)
    const [search, setSearch] = useState('')
    const [category, setCategory] = useState('All')

    const fetchServices = useCallback(async () => {
        setLoading(true)
        try {
            const res = await api.get('/api/services')
            setServices(res.data || [])
        } catch (e) {
            toast.error('Failed to load services. Please try again.')
        } finally {
            setLoading(false)
        }
    }, [])

    useEffect(() => { fetchServices() }, [fetchServices])

    const filtered = services.filter(s => {
        const matchCat = category === 'All' || s.category === category
        const matchSearch = s.name.toLowerCase().includes(search.toLowerCase())
        return matchCat && matchSearch
    })

    return (
        <div className="flex flex-col gap-6">
            {/* Sticky header area — stays fixed while grid scrolls beneath */}
            <div className="sticky top-[61px] z-30 bg-[rgba(8,10,46,0.97)] backdrop-blur-xl -mx-4 sm:-mx-6 lg:-mx-8 px-4 sm:px-6 lg:px-8 pt-4 pb-4 flex flex-col gap-4 border-b border-white/[0.05]">
                {/* Header */}
                <div className="flex items-start justify-between gap-3 flex-wrap">
                    <div>
                        <h2 className="text-2xl font-bold text-white">Services</h2>
                        <p className="text-white/40 text-sm mt-0.5">
                            {loading ? 'Loading…' : `${filtered.length} of ${services.length} services available`}
                        </p>
                    </div>
                    <button onClick={fetchServices} className="p-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/8 text-white/50 hover:text-white transition">
                        <RefreshCw className="w-4 h-4" />
                    </button>
                </div>

                {/* Search + Filter */}
                <div className="flex flex-col sm:flex-row gap-3">
                    <div className="relative flex-1">
                        <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
                        <input type="text" placeholder="Search services…"
                            value={search} onChange={e => setSearch(e.target.value)}
                            className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-[rgba(255,255,255,0.05)] border border-[rgba(255,255,255,0.1)] text-white placeholder-white/25 text-sm focus:outline-none focus:border-[rgba(0,255,255,0.35)] transition" />
                    </div>
                </div>

                {/* Category pills */}
                <div className="flex gap-2 overflow-x-auto no-scrollbar pb-1">
                    {CATEGORIES.map(cat => (
                        <button key={cat} onClick={() => setCategory(cat)}
                            className={`px-4 py-2 rounded-full text-xs font-bold whitespace-nowrap border transition ${category === cat
                                ? 'bg-[rgba(0,255,255,0.15)] text-[#00FFFF] border-[rgba(0,255,255,0.4)]'
                                : 'bg-[rgba(255,255,255,0.05)] text-white/50 border-[rgba(255,255,255,0.08)] hover:text-white hover:bg-white/10'
                                }`}>
                            {cat}
                        </button>
                    ))}
                </div>
            </div>

            {/* Grid */}
            {loading ? (
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
                    {Array.from({ length: 8 }).map((_, i) => (
                        <div key={i} className="h-32 rounded-xl bg-white/5 animate-pulse" />
                    ))}
                </div>
            ) : filtered.length === 0 ? (
                <div className="text-center py-16 text-white/30">
                    <p className="text-lg font-semibold">No services found</p>
                    <p className="text-sm mt-1">Try a different search or category</p>
                </div>
            ) : (
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3">
                    {filtered.map(service => (
                        <button
                            key={service.id}
                            onClick={() => onNavigate('rent-number', { service, autoOpen: true })}
                            className="group relative p-4 rounded-xl border border-[rgba(255,255,255,0.07)] bg-[rgba(15,20,60,0.5)] hover:border-[rgba(255,255,255,0.2)] hover:bg-[rgba(25,30,80,0.6)] transition-all text-left"
                        >
                            {/* Color accent */}
                            <div className="absolute inset-x-0 top-0 h-0.5 rounded-t-xl transition-opacity opacity-0 group-hover:opacity-100"
                                style={{ background: service.color || '#00FFFF' }} />

                            {/* Service Logo */}
                            <div className="mb-3 transition-transform group-hover:scale-105">
                                <ServiceIconWithFallback icon={service.icon} name={service.name} color={service.color} size="lg" />
                            </div>

                            <p className="text-sm font-bold text-white mb-0.5">{service.name}</p>
                            <p className="text-[11px] text-white/40 mb-3">{service.category}</p>

                            <div className="flex items-center justify-between">
                                <span className="text-xs font-bold text-[#00FFFF]">₦{parseFloat(service.cost).toLocaleString()}</span>
                                <span className="flex items-center gap-0.5 text-[10px] text-emerald-400">
                                    <CheckCircle className="w-3 h-3" /> Active
                                </span>
                            </div>
                        </button>
                    ))}
                </div>
            )}

            {/* CTA */}
            {!loading && filtered.length > 0 && (
                <div className="text-center pt-2">
                    <button onClick={() => onNavigate('rent-number')}
                        className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-[#33CCFF] to-[#0066CC] text-white font-bold text-sm shadow-[0_0_15px_rgba(0,255,255,0.2)] hover:shadow-[0_0_25px_rgba(0,255,255,0.35)] hover:scale-[1.02] transition">
                        Get a Number →
                    </button>
                </div>
            )}
        </div>
    )
}
