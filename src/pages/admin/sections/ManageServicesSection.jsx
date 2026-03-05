import { useState, useEffect, useCallback } from 'react'
import { Search, Plus, Trash2, Edit3, ToggleLeft, ToggleRight, Download, Loader2, X, Check, ChevronLeft, ChevronRight } from 'lucide-react'
import adminApi from '../../../lib/adminAxios'
import { ServiceIconWithFallback } from '../../../components/ServiceIcon'
import toast from 'react-hot-toast'

const PER_PAGE = 12

export default function ManageServicesSection() {
    const [services, setServices] = useState([])
    const [loading, setLoading] = useState(true)
    const [search, setSearch] = useState('')
    const [showForm, setShowForm] = useState(false)
    const [editingService, setEditingService] = useState(null)
    const [showSuggestions, setShowSuggestions] = useState(false)
    const [suggestions, setSuggestions] = useState([])
    const [selectedSuggestions, setSelectedSuggestions] = useState([])
    const [importing, setImporting] = useState(false)
    const [page, setPage] = useState(1)

    const loadServices = useCallback(() => {
        setLoading(true)
        adminApi.get('/api/admin/services')
            .then(r => setServices(r.data))
            .catch(() => toast.error('Failed to load services'))
            .finally(() => setLoading(false))
    }, [])

    useEffect(() => { loadServices() }, [loadServices])

    const filtered = services.filter(s =>
        s.name.toLowerCase().includes(search.toLowerCase()) ||
        (s.category || '').toLowerCase().includes(search.toLowerCase())
    )

    // Client-side pagination
    const totalPages = Math.ceil(filtered.length / PER_PAGE)
    const paged = filtered.slice((page - 1) * PER_PAGE, page * PER_PAGE)

    // Reset page when search changes
    useEffect(() => { setPage(1) }, [search])

    const handleToggle = async (service) => {
        try {
            const r = await adminApi.post(`/api/admin/services/${service.id}/toggle`)
            toast.success(r.data.message)
            loadServices()
        } catch { toast.error('Failed to toggle') }
    }

    const handleDelete = async (service) => {
        if (!confirm(`Delete "${service.name}"?`)) return
        try {
            const r = await adminApi.delete(`/api/admin/services/${service.id}`)
            toast.success(r.data.message)
            loadServices()
        } catch { toast.error('Failed to delete') }
    }

    const fetchSuggestions = async () => {
        setShowSuggestions(true)
        try {
            const r = await adminApi.get('/api/admin/services/suggestions')
            setSuggestions(r.data)
            setSelectedSuggestions([])
        } catch { toast.error('Failed to fetch suggestions') }
    }

    const handleImport = async () => {
        if (selectedSuggestions.length === 0) return toast.error('Select at least one service')
        setImporting(true)
        try {
            const toImport = suggestions.filter((_, i) => selectedSuggestions.includes(i))
            const r = await adminApi.post('/api/admin/services/import', { services: toImport })
            toast.success(r.data.message)
            setShowSuggestions(false)
            loadServices()
        } catch { toast.error('Import failed') }
        finally { setImporting(false) }
    }

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="relative flex-1 max-w-sm">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
                    <input type="text" placeholder="Search services..." value={search} onChange={e => setSearch(e.target.value)}
                        className="w-full pl-9 pr-4 py-2.5 rounded-xl bg-white/[0.05] border border-white/10 text-sm text-white placeholder-white/25 focus:outline-none focus:border-[rgba(255,149,0,0.4)] transition" />
                </div>
                <div className="flex gap-2">
                    <button onClick={fetchSuggestions}
                        className="flex-1 sm:flex-none px-4 py-2.5 rounded-xl bg-white/[0.06] border border-white/10 text-sm text-white/70 hover:text-[#FF9500] hover:border-[rgba(255,149,0,0.3)] transition flex items-center justify-center gap-2">
                        <Download className="w-4 h-4" /> <span className="hidden sm:inline">Fetch</span> Suggestions
                    </button>
                    <button onClick={() => { setEditingService(null); setShowForm(true) }}
                        className="flex-1 sm:flex-none px-4 py-2.5 rounded-xl bg-gradient-to-r from-[#FF9500] to-[#FF6B00] text-white text-sm font-bold shadow-[0_0_12px_rgba(255,149,0,0.2)] hover:shadow-[0_0_20px_rgba(255,149,0,0.4)] transition flex items-center justify-center gap-2">
                        <Plus className="w-4 h-4" /> Add Service
                    </button>
                </div>
            </div>

            {/* Suggestions Modal */}
            {showSuggestions && (
                <div className="rounded-2xl border border-[rgba(255,149,0,0.15)] bg-[rgba(15,20,60,0.8)] backdrop-blur-xl p-4 sm:p-6">
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="text-sm font-bold text-white">Service Suggestions — select to import</h3>
                        <button onClick={() => setShowSuggestions(false)} className="text-white/30 hover:text-white/60"><X className="w-5 h-5" /></button>
                    </div>
                    {suggestions.length === 0 ? (
                        <p className="text-sm text-white/30">All common services already added! ✅</p>
                    ) : (
                        <>
                            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 mb-4 max-h-[360px] overflow-y-auto">
                                {suggestions.map((s, i) => {
                                    const isSelected = selectedSuggestions.includes(i)
                                    return (
                                        <button key={i} onClick={() => setSelectedSuggestions(prev => isSelected ? prev.filter(x => x !== i) : [...prev, i])}
                                            className={`rounded-xl p-3 text-left border transition-all ${isSelected ? 'border-[rgba(255,149,0,0.5)] bg-[rgba(255,149,0,0.08)]' : 'border-white/5 bg-white/[0.02] hover:bg-white/[0.04]'}`}>
                                            <div className="flex items-center gap-2 mb-1">
                                                <ServiceIconWithFallback icon={s.icon} name={s.name} color={s.color} size="sm" />
                                                <span className="text-sm text-white font-medium truncate">{s.name}</span>
                                                {isSelected && <Check className="w-3.5 h-3.5 text-[#FF9500] ml-auto flex-shrink-0" />}
                                            </div>
                                            <p className="text-xs text-white/30">{s.category} · ₦{s.cost}</p>
                                        </button>
                                    )
                                })}
                            </div>
                            <div className="flex items-center justify-between pt-3 border-t border-white/5">
                                <button onClick={() => setSelectedSuggestions(suggestions.map((_, i) => i))} className="text-xs text-[#FF9500] hover:underline">Select All</button>
                                <button onClick={handleImport} disabled={importing || selectedSuggestions.length === 0}
                                    className="px-5 py-2 rounded-xl bg-gradient-to-r from-[#FF9500] to-[#FF6B00] text-white text-sm font-bold disabled:opacity-40 flex items-center gap-2">
                                    {importing ? <Loader2 className="w-4 h-4 animate-spin" /> : null} Import {selectedSuggestions.length} Service{selectedSuggestions.length !== 1 ? 's' : ''}
                                </button>
                            </div>
                        </>
                    )}
                </div>
            )}

            {/* Add / Edit Form */}
            {showForm && (
                <ServiceForm
                    service={editingService}
                    onClose={() => setShowForm(false)}
                    onSaved={() => { setShowForm(false); loadServices() }}
                />
            )}

            {/* Services List */}
            <div className="rounded-2xl border border-[rgba(255,255,255,0.06)] bg-[rgba(15,20,60,0.5)] backdrop-blur-xl overflow-hidden">
                {loading ? (
                    <div className="p-12 text-center"><Loader2 className="w-6 h-6 text-[#FF9500] animate-spin mx-auto" /></div>
                ) : paged.length === 0 ? (
                    <div className="p-12 text-center text-white/30 text-sm">No services found. Add one or fetch suggestions.</div>
                ) : (
                    <>
                        {/* ───── Desktop Table ───── */}
                        <div className="hidden md:block overflow-x-auto">
                            <table className="w-full text-left">
                                <thead>
                                    <tr className="border-b border-white/5">
                                        <th className="px-5 py-3.5 text-xs text-white/30 font-medium">Service</th>
                                        <th className="px-5 py-3.5 text-xs text-white/30 font-medium">Category</th>
                                        <th className="px-5 py-3.5 text-xs text-white/30 font-medium">Cost</th>
                                        <th className="px-5 py-3.5 text-xs text-white/30 font-medium">Status</th>
                                        <th className="px-5 py-3.5 text-xs text-white/30 font-medium text-right">Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {paged.map(service => (
                                        <tr key={service.id} className="border-b border-white/[0.03] hover:bg-white/[0.02] transition">
                                            <td className="px-5 py-3.5">
                                                <div className="flex items-center gap-3">
                                                    <ServiceIconWithFallback icon={service.icon} name={service.name} color={service.color} size="md" />
                                                    <span className="text-sm text-white font-medium">{service.name}</span>
                                                </div>
                                            </td>
                                            <td className="px-5 py-3.5 text-sm text-white/50">{service.category || 'Other'}</td>
                                            <td className="px-5 py-3.5 text-sm text-white font-medium">₦{Number(service.cost).toLocaleString()}</td>
                                            <td className="px-5 py-3.5">
                                                <span className={`text-xs px-2.5 py-1 rounded-lg font-medium ${service.is_active ? 'bg-green-500/10 text-green-400' : 'bg-red-500/10 text-red-400'}`}>
                                                    {service.is_active ? 'Active' : 'Inactive'}
                                                </span>
                                            </td>
                                            <td className="px-5 py-3.5">
                                                <div className="flex items-center justify-end gap-1.5">
                                                    <button onClick={() => handleToggle(service)} title={service.is_active ? 'Deactivate' : 'Activate'}
                                                        className="p-2 rounded-lg hover:bg-white/[0.06] text-white/30 hover:text-[#FF9500] transition">
                                                        {service.is_active ? <ToggleRight className="w-4 h-4 text-green-400" /> : <ToggleLeft className="w-4 h-4" />}
                                                    </button>
                                                    <button onClick={() => { setEditingService(service); setShowForm(true) }}
                                                        className="p-2 rounded-lg hover:bg-white/[0.06] text-white/30 hover:text-white/60 transition">
                                                        <Edit3 className="w-4 h-4" />
                                                    </button>
                                                    <button onClick={() => handleDelete(service)}
                                                        className="p-2 rounded-lg hover:bg-red-500/10 text-white/30 hover:text-red-400 transition">
                                                        <Trash2 className="w-4 h-4" />
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>

                        {/* ───── Mobile Cards ───── */}
                        <div className="md:hidden divide-y divide-white/5">
                            {paged.map(service => (
                                <div key={service.id} className="p-4 hover:bg-white/[0.02] transition">
                                    <div className="flex items-start justify-between gap-3">
                                        <div className="flex items-center gap-3 min-w-0">
                                            <ServiceIconWithFallback icon={service.icon} name={service.name} color={service.color} size="md" />
                                            <div className="min-w-0">
                                                <p className="text-sm font-semibold text-white truncate">{service.name}</p>
                                                <p className="text-xs text-white/30">{service.category || 'Other'}</p>
                                            </div>
                                        </div>
                                        <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold flex-shrink-0 ${service.is_active ? 'bg-green-500/10 text-green-400' : 'bg-red-500/10 text-red-400'}`}>
                                            {service.is_active ? 'Active' : 'Off'}
                                        </span>
                                    </div>
                                    <div className="flex items-center justify-between mt-3 ml-[44px]">
                                        <p className="text-sm text-[#FF9500] font-bold">₦{Number(service.cost).toLocaleString()}</p>
                                        <div className="flex gap-1">
                                            <button onClick={() => handleToggle(service)}
                                                className="p-2 rounded-lg hover:bg-white/[0.06] text-white/30 hover:text-[#FF9500] transition">
                                                {service.is_active ? <ToggleRight className="w-4 h-4 text-green-400" /> : <ToggleLeft className="w-4 h-4" />}
                                            </button>
                                            <button onClick={() => { setEditingService(service); setShowForm(true) }}
                                                className="p-2 rounded-lg hover:bg-white/[0.06] text-white/30 hover:text-white/60 transition">
                                                <Edit3 className="w-4 h-4" />
                                            </button>
                                            <button onClick={() => handleDelete(service)}
                                                className="p-2 rounded-lg hover:bg-red-500/10 text-white/30 hover:text-red-400 transition">
                                                <Trash2 className="w-4 h-4" />
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </>
                )}

                {/* Pagination */}
                {totalPages > 1 && (
                    <div className="flex items-center justify-between px-5 py-3 border-t border-white/5">
                        <span className="text-xs text-white/30">Page {page} of {totalPages} · {filtered.length} services</span>
                        <div className="flex gap-1.5">
                            <button disabled={page <= 1} onClick={() => setPage(p => p - 1)}
                                className="p-2 rounded-lg hover:bg-white/[0.06] text-white/30 hover:text-white/60 disabled:opacity-20 transition">
                                <ChevronLeft className="w-4 h-4" />
                            </button>
                            <button disabled={page >= totalPages} onClick={() => setPage(p => p + 1)}
                                className="p-2 rounded-lg hover:bg-white/[0.06] text-white/30 hover:text-white/60 disabled:opacity-20 transition">
                                <ChevronRight className="w-4 h-4" />
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    )
}

/* ─── Add / Edit Service Form ────────────────────────────── */
function ServiceForm({ service, onClose, onSaved }) {
    const isEdit = !!service
    const [form, setForm] = useState({
        name: service?.name || '',
        icon: service?.icon || '',
        color: service?.color || '#FF9500',
        category: service?.category || '',
        cost: service?.cost || '',
        is_active: service?.is_active ?? true,
    })
    const [saving, setSaving] = useState(false)

    const handleSubmit = async (e) => {
        e.preventDefault()
        setSaving(true)
        try {
            if (isEdit) {
                await adminApi.put(`/api/admin/services/${service.id}`, form)
                toast.success('Service updated')
            } else {
                await adminApi.post('/api/admin/services', form)
                toast.success('Service created')
            }
            onSaved()
        } catch (err) {
            toast.error(err.response?.data?.message || 'Failed to save')
        } finally { setSaving(false) }
    }

    return (
        <div className="rounded-2xl border border-[rgba(255,149,0,0.15)] bg-[rgba(15,20,60,0.8)] backdrop-blur-xl p-4 sm:p-6">
            <div className="flex items-center justify-between mb-4">
                <h3 className="text-sm font-bold text-white">{isEdit ? 'Edit' : 'Add New'} Service</h3>
                <button onClick={onClose} className="text-white/30 hover:text-white/60"><X className="w-5 h-5" /></button>
            </div>
            <form onSubmit={handleSubmit} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                <input placeholder="Service Name" required value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
                    className="px-4 py-2.5 rounded-xl bg-white/[0.05] border border-white/10 text-sm text-white placeholder-white/25 focus:outline-none focus:border-[rgba(255,149,0,0.4)]" />
                <input placeholder="Icon (e.g. whatsapp)" value={form.icon} onChange={e => setForm(f => ({ ...f, icon: e.target.value }))}
                    className="px-4 py-2.5 rounded-xl bg-white/[0.05] border border-white/10 text-sm text-white placeholder-white/25 focus:outline-none focus:border-[rgba(255,149,0,0.4)]" />
                <div className="flex items-center gap-2">
                    <input type="color" value={form.color} onChange={e => setForm(f => ({ ...f, color: e.target.value }))}
                        className="w-10 h-10 rounded-lg border border-white/10 bg-transparent cursor-pointer" />
                    <input placeholder="Color hex" value={form.color} onChange={e => setForm(f => ({ ...f, color: e.target.value }))}
                        className="flex-1 px-4 py-2.5 rounded-xl bg-white/[0.05] border border-white/10 text-sm text-white placeholder-white/25 focus:outline-none focus:border-[rgba(255,149,0,0.4)]" />
                </div>
                <input placeholder="Category (e.g. Social)" value={form.category} onChange={e => setForm(f => ({ ...f, category: e.target.value }))}
                    className="px-4 py-2.5 rounded-xl bg-white/[0.05] border border-white/10 text-sm text-white placeholder-white/25 focus:outline-none focus:border-[rgba(255,149,0,0.4)]" />
                <input type="number" placeholder="Cost (₦)" required min="0" step="0.01" value={form.cost} onChange={e => setForm(f => ({ ...f, cost: e.target.value }))}
                    className="px-4 py-2.5 rounded-xl bg-white/[0.05] border border-white/10 text-sm text-white placeholder-white/25 focus:outline-none focus:border-[rgba(255,149,0,0.4)]" />
                <div className="flex items-center justify-between sm:col-span-2 lg:col-span-1">
                    <label className="flex items-center gap-2 text-sm text-white/50 cursor-pointer">
                        <input type="checkbox" checked={form.is_active} onChange={e => setForm(f => ({ ...f, is_active: e.target.checked }))}
                            className="accent-[#FF9500]" />
                        Active
                    </label>
                    <button type="submit" disabled={saving}
                        className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#FF9500] to-[#FF6B00] text-white text-sm font-bold disabled:opacity-40 flex items-center gap-2">
                        {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : null} {isEdit ? 'Update' : 'Create'}
                    </button>
                </div>
            </form>
        </div>
    )
}
