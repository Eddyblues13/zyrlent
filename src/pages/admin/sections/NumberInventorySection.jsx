import { useState, useEffect, useCallback, useRef } from 'react'
import {
    Search, ChevronLeft, ChevronRight, Loader2, Trash2,
    Phone, X, Copy, Filter, CheckSquare, Square,
    Tag, RefreshCw, ChevronDown, Edit3, Info
} from 'lucide-react'
import adminApi from '../../../lib/adminAxios'
import toast from 'react-hot-toast'

/* ── Status colors ── */
const STATUS_COLORS = {
    available: 'bg-green-500/10 text-green-400',
    in_use: 'bg-blue-500/10 text-blue-400',
    reserved: 'bg-yellow-500/10 text-yellow-400',
    expired: 'bg-gray-500/10 text-gray-400',
    retired: 'bg-red-500/10 text-red-400',
}

const StatusBadge = ({ status }) => (
    <span className={`text-[10px] px-2.5 py-1 rounded-lg font-bold uppercase tracking-wide ${STATUS_COLORS[status] || 'bg-white/10 text-white/50'}`}>
        {status?.replace('_', ' ')}
    </span>
)

/* ── Stat Card ── */
const StatCard = ({ label, value, color, icon: Icon, active, onClick }) => (
    <button
        onClick={onClick}
        className={`text-center p-3 rounded-xl border flex-1 min-w-[100px] transition-all cursor-pointer ${active
            ? 'bg-[rgba(255,149,0,0.08)] border-[#FF9500]/30'
            : 'bg-white/[0.03] border-white/5 hover:border-white/10'
            }`}
    >
        {Icon && <Icon className="w-3.5 h-3.5 mx-auto mb-1" style={{ color }} />}
        <p className="text-lg font-bold text-white">{value ?? 0}</p>
        <p className="text-[9px] font-medium mt-0.5" style={{ color }}>{label}</p>
    </button>
)

/* ── Dropdown Select ── */
const DropdownSelect = ({ label, value, onChange, options, className = '' }) => (
    <div className={`relative ${className}`}>
        <select
            value={value}
            onChange={e => onChange(e.target.value)}
            className="w-full appearance-none bg-white/[0.04] border border-white/10 rounded-xl px-3 py-2 text-xs text-white/80 focus:outline-none focus:border-[#FF9500]/40 pr-8"
        >
            <option value="" className="bg-[#0F1440]">{label}</option>
            {options.map(opt => (
                <option key={opt.value} value={opt.value} className="bg-[#0F1440]">
                    {opt.label}
                </option>
            ))}
        </select>
        <ChevronDown className="absolute right-2.5 top-1/2 -translate-y-1/2 w-3 h-3 text-white/30 pointer-events-none" />
    </div>
)

/* ════════════════════════════════════════════════════════════
   EDIT NUMBER MODAL
   ════════════════════════════════════════════════════════════ */
const NumberFormModal = ({ number, filterOpts, onClose, onSaved }) => {
    const [form, setForm] = useState({
        phone_number: number?.phone_number || '',
        country_id: number?.country_id || '',
        operator: number?.operator || '',
        provider: number?.provider || 'manual',
        provider_sid: number?.provider_sid || '',
        status: number?.status || 'available',
        cost_price: number?.cost_price || '0',
        sell_price: number?.sell_price || '0',
        max_uses: number?.max_uses || '1',
        expires_at: number?.expires_at ? number.expires_at.slice(0, 16) : '',
        notes: number?.notes || '',
        service_ids: number?.services?.map(s => s.id) || [],
    })
    const [saving, setSaving] = useState(false)

    const handleSubmit = async (e) => {
        e.preventDefault()
        if (!number) return
        setSaving(true)
        try {
            const payload = {
                ...form,
                cost_price: parseFloat(form.cost_price) || 0,
                sell_price: parseFloat(form.sell_price) || 0,
                max_uses: parseInt(form.max_uses) || 1,
                expires_at: form.expires_at || null,
            }
            await adminApi.put(`/api/admin/numbers/${number.id}`, payload)
            toast.success('Number updated')
            onSaved()
        } catch (err) {
            toast.error(err.response?.data?.message || 'Failed to save')
        } finally {
            setSaving(false)
        }
    }

    const toggleService = (id) => {
        setForm(prev => ({
            ...prev,
            service_ids: prev.service_ids.includes(id)
                ? prev.service_ids.filter(s => s !== id)
                : [...prev.service_ids, id]
        }))
    }

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4" onClick={onClose}>
            <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />
            <div className="relative bg-[#0F1440] border border-white/10 rounded-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto shadow-2xl" onClick={e => e.stopPropagation()}>
                <div className="flex items-center justify-between p-5 border-b border-white/5">
                    <h3 className="text-sm font-bold text-white">Edit Number</h3>
                    <button onClick={onClose} className="p-2 rounded-lg hover:bg-white/[0.06] text-white/40 transition"><X className="w-4 h-4" /></button>
                </div>

                <form onSubmit={handleSubmit} className="p-5 space-y-4">
                    {/* Phone Number */}
                    <div>
                        <label className="text-[10px] text-white/40 font-medium uppercase tracking-wider">Phone Number *</label>
                        <input
                            type="text"
                            value={form.phone_number}
                            onChange={e => setForm({ ...form, phone_number: e.target.value })}
                            placeholder="+1234567890"
                            className="w-full mt-1 bg-white/[0.04] border border-white/10 rounded-xl px-3 py-2.5 text-xs text-white placeholder-white/20 focus:outline-none focus:border-[#FF9500]/40"
                            required
                        />
                    </div>

                    {/* Country & Provider */}
                    <div className="grid grid-cols-2 gap-3">
                        <div>
                            <label className="text-[10px] text-white/40 font-medium uppercase tracking-wider">Country *</label>
                            <select
                                value={form.country_id}
                                onChange={e => setForm({ ...form, country_id: e.target.value })}
                                className="w-full mt-1 bg-white/[0.04] border border-white/10 rounded-xl px-3 py-2.5 text-xs text-white focus:outline-none focus:border-[#FF9500]/40"
                                required
                            >
                                <option value="" className="bg-[#0F1440]">Select country</option>
                                {filterOpts.countries?.map(c => (
                                    <option key={c.id} value={c.id} className="bg-[#0F1440]">{c.flag} {c.name}</option>
                                ))}
                            </select>
                        </div>
                        <div>
                            <label className="text-[10px] text-white/40 font-medium uppercase tracking-wider">Provider *</label>
                            <select
                                value={form.provider}
                                onChange={e => setForm({ ...form, provider: e.target.value })}
                                className="w-full mt-1 bg-white/[0.04] border border-white/10 rounded-xl px-3 py-2.5 text-xs text-white focus:outline-none focus:border-[#FF9500]/40"
                                required
                            >
                                <option value="twilio" className="bg-[#0F1440]">Twilio</option>
                                <option value="5sim" className="bg-[#0F1440]">5SIM</option>
                                <option value="smspva" className="bg-[#0F1440]">SMSPVA</option>
                                <option value="manual" className="bg-[#0F1440]">Manual</option>
                            </select>
                        </div>
                    </div>

                    {/* Operator & Status */}
                    <div className="grid grid-cols-2 gap-3">
                        <div>
                            <label className="text-[10px] text-white/40 font-medium uppercase tracking-wider">Operator</label>
                            <input
                                type="text"
                                value={form.operator}
                                onChange={e => setForm({ ...form, operator: e.target.value })}
                                placeholder="e.g. MTN, Vodafone"
                                className="w-full mt-1 bg-white/[0.04] border border-white/10 rounded-xl px-3 py-2.5 text-xs text-white placeholder-white/20 focus:outline-none focus:border-[#FF9500]/40"
                            />
                        </div>
                        <div>
                            <label className="text-[10px] text-white/40 font-medium uppercase tracking-wider">Status</label>
                            <select
                                value={form.status}
                                onChange={e => setForm({ ...form, status: e.target.value })}
                                className="w-full mt-1 bg-white/[0.04] border border-white/10 rounded-xl px-3 py-2.5 text-xs text-white focus:outline-none focus:border-[#FF9500]/40"
                            >
                                {['available', 'in_use', 'reserved', 'expired', 'retired'].map(s => (
                                    <option key={s} value={s} className="bg-[#0F1440]">{s.replace('_', ' ')}</option>
                                ))}
                            </select>
                        </div>
                    </div>

                    {/* Provider SID */}
                    <div>
                        <label className="text-[10px] text-white/40 font-medium uppercase tracking-wider">Provider SID</label>
                        <input
                            type="text"
                            value={form.provider_sid}
                            onChange={e => setForm({ ...form, provider_sid: e.target.value })}
                            placeholder="External provider ID"
                            className="w-full mt-1 bg-white/[0.04] border border-white/10 rounded-xl px-3 py-2.5 text-xs text-white placeholder-white/20 focus:outline-none focus:border-[#FF9500]/40"
                        />
                    </div>

                    {/* Prices */}
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                        <div>
                            <label className="text-[10px] text-white/40 font-medium uppercase tracking-wider">Cost Price *</label>
                            <input
                                type="number"
                                step="0.0001"
                                min="0"
                                value={form.cost_price}
                                onChange={e => setForm({ ...form, cost_price: e.target.value })}
                                className="w-full mt-1 bg-white/[0.04] border border-white/10 rounded-xl px-3 py-2.5 text-xs text-white focus:outline-none focus:border-[#FF9500]/40"
                                required
                            />
                        </div>
                        <div>
                            <label className="text-[10px] text-white/40 font-medium uppercase tracking-wider">Sell Price *</label>
                            <input
                                type="number"
                                step="0.0001"
                                min="0"
                                value={form.sell_price}
                                onChange={e => setForm({ ...form, sell_price: e.target.value })}
                                className="w-full mt-1 bg-white/[0.04] border border-white/10 rounded-xl px-3 py-2.5 text-xs text-white focus:outline-none focus:border-[#FF9500]/40"
                                required
                            />
                        </div>
                        <div>
                            <label className="text-[10px] text-white/40 font-medium uppercase tracking-wider">Max Uses *</label>
                            <input
                                type="number"
                                min="1"
                                value={form.max_uses}
                                onChange={e => setForm({ ...form, max_uses: e.target.value })}
                                className="w-full mt-1 bg-white/[0.04] border border-white/10 rounded-xl px-3 py-2.5 text-xs text-white focus:outline-none focus:border-[#FF9500]/40"
                                required
                            />
                        </div>
                    </div>

                    {/* Expires At */}
                    <div>
                        <label className="text-[10px] text-white/40 font-medium uppercase tracking-wider">Expires At</label>
                        <input
                            type="datetime-local"
                            value={form.expires_at}
                            onChange={e => setForm({ ...form, expires_at: e.target.value })}
                            className="w-full mt-1 bg-white/[0.04] border border-white/10 rounded-xl px-3 py-2.5 text-xs text-white focus:outline-none focus:border-[#FF9500]/40"
                        />
                    </div>

                    {/* Compatible Services */}
                    <div>
                        <label className="text-[10px] text-white/40 font-medium uppercase tracking-wider mb-2 block">Compatible Services</label>
                        <div className="flex flex-wrap gap-2 max-h-32 overflow-y-auto p-2 bg-white/[0.02] rounded-xl border border-white/5">
                            {filterOpts.services?.map(svc => (
                                <button
                                    key={svc.id}
                                    type="button"
                                    onClick={() => toggleService(svc.id)}
                                    className={`text-[10px] px-2.5 py-1.5 rounded-lg font-medium transition-all ${form.service_ids.includes(svc.id)
                                        ? 'bg-[#FF9500]/20 text-[#FF9500] border border-[#FF9500]/30'
                                        : 'bg-white/[0.04] text-white/40 border border-white/5 hover:border-white/10'
                                        }`}
                                >
                                    {svc.name}
                                </button>
                            ))}
                            {(!filterOpts.services || filterOpts.services.length === 0) && (
                                <p className="text-[10px] text-white/20">No services available</p>
                            )}
                        </div>
                    </div>

                    {/* Notes */}
                    <div>
                        <label className="text-[10px] text-white/40 font-medium uppercase tracking-wider">Notes</label>
                        <textarea
                            value={form.notes}
                            onChange={e => setForm({ ...form, notes: e.target.value })}
                            placeholder="Optional notes..."
                            rows={2}
                            className="w-full mt-1 bg-white/[0.04] border border-white/10 rounded-xl px-3 py-2.5 text-xs text-white placeholder-white/20 focus:outline-none focus:border-[#FF9500]/40 resize-none"
                        />
                    </div>

                    {/* Submit */}
                    <button
                        type="submit"
                        disabled={saving}
                        className="w-full py-2.5 rounded-xl bg-gradient-to-r from-[#FF9500] to-[#FF6B00] text-white text-xs font-bold uppercase tracking-wider hover:opacity-90 transition disabled:opacity-50 flex items-center justify-center gap-2"
                    >
                        {saving && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
                        Update Number
                    </button>
                </form>
            </div>
        </div>
    )
}

/* ════════════════════════════════════════════════════════════
   BULK ACTIONS BAR
   ════════════════════════════════════════════════════════════ */
const BulkActionsBar = ({ selectedIds, filterOpts, onAction, onClear }) => {
    const [showMenu, setShowMenu] = useState(null)
    const [bulkPrice, setBulkPrice] = useState({ sell_price: '', cost_price: '' })
    const [bulkServiceIds, setBulkServiceIds] = useState([])
    const [bulkMode, setBulkMode] = useState('attach')
    const [loading, setLoading] = useState(false)

    const doAction = async (action, body) => {
        setLoading(true)
        try {
            await onAction(action, body)
            setShowMenu(null)
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="flex items-center gap-2 p-3 bg-[#FF9500]/5 border border-[#FF9500]/20 rounded-xl">
            <span className="text-[11px] text-[#FF9500] font-bold">{selectedIds.length} selected</span>
            <button onClick={onClear} className="text-[10px] text-white/40 hover:text-white/60 underline">Clear</button>

            <div className="flex-1" />

            {/* Bulk Status */}
            <div className="relative">
                <button onClick={() => setShowMenu(showMenu === 'status' ? null : 'status')}
                    className="text-[10px] px-3 py-1.5 rounded-lg bg-white/[0.06] text-white/60 hover:text-white border border-white/10 transition font-medium">
                    Change Status
                </button>
                {showMenu === 'status' && (
                    <div className="absolute top-full mt-1 right-0 bg-[#0F1440] border border-white/10 rounded-xl p-2 shadow-2xl z-50 min-w-[120px]">
                        {['available', 'reserved', 'expired', 'retired'].map(s => (
                            <button key={s} onClick={() => doAction('bulk-status', { ids: selectedIds, status: s })}
                                className="w-full text-left text-[10px] px-3 py-1.5 rounded-lg text-white/60 hover:bg-white/[0.06] hover:text-white transition capitalize">
                                {s.replace('_', ' ')}
                            </button>
                        ))}
                    </div>
                )}
            </div>

            {/* Bulk Assign Services */}
            <div className="relative">
                <button onClick={() => setShowMenu(showMenu === 'services' ? null : 'services')}
                    className="text-[10px] px-3 py-1.5 rounded-lg bg-white/[0.06] text-white/60 hover:text-white border border-white/10 transition font-medium">
                    Assign Services
                </button>
                {showMenu === 'services' && (
                    <div className="absolute top-full mt-1 right-0 bg-[#0F1440] border border-white/10 rounded-xl p-3 shadow-2xl z-50 min-w-[220px] space-y-2">
                        <div className="flex gap-1.5 mb-2">
                            {['attach', 'sync', 'detach'].map(m => (
                                <button key={m} onClick={() => setBulkMode(m)}
                                    className={`text-[9px] px-2 py-1 rounded-md font-bold uppercase ${bulkMode === m ? 'bg-[#FF9500]/20 text-[#FF9500]' : 'bg-white/5 text-white/30'}`}>
                                    {m}
                                </button>
                            ))}
                        </div>
                        <div className="flex flex-wrap gap-1.5 max-h-28 overflow-y-auto">
                            {filterOpts.services?.map(svc => (
                                <button key={svc.id} onClick={() => setBulkServiceIds(prev => prev.includes(svc.id) ? prev.filter(i => i !== svc.id) : [...prev, svc.id])}
                                    className={`text-[9px] px-2 py-1 rounded-md font-medium transition ${bulkServiceIds.includes(svc.id) ? 'bg-[#FF9500]/20 text-[#FF9500]' : 'bg-white/5 text-white/30'}`}>
                                    {svc.name}
                                </button>
                            ))}
                        </div>
                        <button
                            disabled={bulkServiceIds.length === 0 || loading}
                            onClick={() => doAction('bulk-assign-services', { ids: selectedIds, service_ids: bulkServiceIds, mode: bulkMode })}
                            className="w-full text-[10px] py-1.5 rounded-lg bg-[#FF9500] text-white font-bold disabled:opacity-40"
                        >
                            {loading ? 'Applying…' : 'Apply'}
                        </button>
                    </div>
                )}
            </div>

            {/* Bulk Set Price */}
            <div className="relative">
                <button onClick={() => setShowMenu(showMenu === 'price' ? null : 'price')}
                    className="text-[10px] px-3 py-1.5 rounded-lg bg-white/[0.06] text-white/60 hover:text-white border border-white/10 transition font-medium">
                    Set Price
                </button>
                {showMenu === 'price' && (
                    <div className="absolute top-full mt-1 right-0 bg-[#0F1440] border border-white/10 rounded-xl p-3 shadow-2xl z-50 min-w-[180px] space-y-2">
                        <div>
                            <label className="text-[9px] text-white/30">Sell Price</label>
                            <input type="number" step="0.01" min="0" value={bulkPrice.sell_price}
                                onChange={e => setBulkPrice({ ...bulkPrice, sell_price: e.target.value })}
                                className="w-full mt-0.5 bg-white/[0.04] border border-white/10 rounded-lg px-2.5 py-1.5 text-[11px] text-white focus:outline-none focus:border-[#FF9500]/40" />
                        </div>
                        <div>
                            <label className="text-[9px] text-white/30">Cost Price</label>
                            <input type="number" step="0.01" min="0" value={bulkPrice.cost_price}
                                onChange={e => setBulkPrice({ ...bulkPrice, cost_price: e.target.value })}
                                className="w-full mt-0.5 bg-white/[0.04] border border-white/10 rounded-lg px-2.5 py-1.5 text-[11px] text-white focus:outline-none focus:border-[#FF9500]/40" />
                        </div>
                        <button
                            disabled={(!bulkPrice.sell_price && !bulkPrice.cost_price) || loading}
                            onClick={() => {
                                const body = { ids: selectedIds }
                                if (bulkPrice.sell_price) body.sell_price = parseFloat(bulkPrice.sell_price)
                                if (bulkPrice.cost_price) body.cost_price = parseFloat(bulkPrice.cost_price)
                                doAction('bulk-set-price', body)
                            }}
                            className="w-full text-[10px] py-1.5 rounded-lg bg-[#FF9500] text-white font-bold disabled:opacity-40"
                        >
                            {loading ? 'Applying…' : 'Apply Pricing'}
                        </button>
                    </div>
                )}
            </div>

            {/* Bulk Delete */}
            <button
                onClick={() => {
                    if (confirm(`Delete ${selectedIds.length} numbers from inventory?`)) {
                        doAction('bulk-delete', { ids: selectedIds })
                    }
                }}
                className="text-[10px] px-3 py-1.5 rounded-lg bg-red-500/10 text-red-400 hover:bg-red-500/20 border border-red-500/20 transition font-medium"
            >
                Delete
            </button>
        </div>
    )
}

/* ════════════════════════════════════════════════════════════
   MAIN SECTION COMPONENT
   ════════════════════════════════════════════════════════════ */
export default function NumberInventorySection() {
    const [numbers, setNumbers] = useState([])
    const [stats, setStats] = useState({})
    const [filterOpts, setFilterOpts] = useState({ operators: [], providers: [], countries: [], services: [] })
    const [loading, setLoading] = useState(true)
    const [meta, setMeta] = useState({})

    // Filters
    const [statusFilter, setStatusFilter] = useState('')
    const [countryFilter, setCountryFilter] = useState('')
    const [operatorFilter, setOperatorFilter] = useState('')
    const [providerFilter, setProviderFilter] = useState('')
    const [serviceFilter, setServiceFilter] = useState('')
    const [search, setSearch] = useState('')
    const [page, setPage] = useState(1)
    const [showFilters, setShowFilters] = useState(false)

    // Modals
    const [editNumber, setEditNumber] = useState(null)

    // Selection
    const [selectedIds, setSelectedIds] = useState([])

    const searchTimer = useRef(null)

    /* ── Fetch data ── */
    const fetchNumbers = useCallback(async () => {
        setLoading(true)
        try {
            const params = { page, per_page: 20 }
            if (statusFilter) params.status = statusFilter
            if (countryFilter) params.country_id = countryFilter
            if (operatorFilter) params.operator = operatorFilter
            if (providerFilter) params.provider = providerFilter
            if (serviceFilter) params.service_id = serviceFilter
            if (search) params.search = search

            const res = await adminApi.get('/api/admin/numbers', { params })
            setNumbers(res.data.data || [])
            setMeta(res.data)
        } catch (err) {
            toast.error('Failed to load numbers')
        } finally {
            setLoading(false)
        }
    }, [page, statusFilter, countryFilter, operatorFilter, providerFilter, serviceFilter, search])

    const fetchStats = useCallback(async () => {
        try {
            const res = await adminApi.get('/api/admin/numbers/stats')
            setStats(res.data)
        } catch { }
    }, [])

    const fetchFilterOptions = useCallback(async () => {
        try {
            const res = await adminApi.get('/api/admin/numbers/filter-options')
            setFilterOpts(res.data)
        } catch { }
    }, [])

    useEffect(() => {
        fetchStats()
        fetchFilterOptions()
    }, [])

    useEffect(() => {
        fetchNumbers()
    }, [fetchNumbers])

    const refreshAll = () => {
        setSelectedIds([])
        fetchNumbers()
        fetchStats()
        fetchFilterOptions()
    }

    /* ── Search debounce ── */
    const handleSearch = (val) => {
        setSearch(val)
        setPage(1)
    }

    const handleSearchInput = (val) => {
        clearTimeout(searchTimer.current)
        searchTimer.current = setTimeout(() => handleSearch(val), 400)
    }

    /* ── Status tab click ── */
    const handleStatusClick = (status) => {
        setStatusFilter(prev => prev === status ? '' : status)
        setPage(1)
        setSelectedIds([])
    }

    /* ── Selection ── */
    const toggleSelect = (id) => {
        setSelectedIds(prev => prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id])
    }

    const toggleSelectAll = () => {
        if (selectedIds.length === numbers.length) {
            setSelectedIds([])
        } else {
            setSelectedIds(numbers.map(n => n.id))
        }
    }

    /* ── Bulk action handler ── */
    const handleBulkAction = async (action, body) => {
        try {
            const res = await adminApi.post(`/api/admin/numbers/${action}`, body)
            toast.success(res.data.message)
            refreshAll()
        } catch (err) {
            toast.error(err.response?.data?.message || 'Action failed')
        }
    }

    /* ── Delete single ── */
    const handleDelete = async (number) => {
        if (!confirm(`Remove ${number.phone_number} from inventory?`)) return
        try {
            await adminApi.delete(`/api/admin/numbers/${number.id}`)
            toast.success('Number removed')
            refreshAll()
        } catch (err) {
            toast.error(err.response?.data?.message || 'Failed to remove')
        }
    }

    /* ── Copy ── */
    const copyText = (text) => {
        navigator.clipboard.writeText(text)
        toast.success('Copied')
    }

    return (
        <div className="space-y-5">
            {/* ── Stats Bar ── */}
            <div className="flex gap-2 flex-wrap">
                <StatCard label="TOTAL" value={stats.total} color="#FF9500" active={!statusFilter} onClick={() => handleStatusClick('')} />
                <StatCard label="AVAILABLE" value={stats.available} color="#34D399" active={statusFilter === 'available'} onClick={() => handleStatusClick('available')} />
                <StatCard label="IN USE" value={stats.in_use} color="#60A5FA" active={statusFilter === 'in_use'} onClick={() => handleStatusClick('in_use')} />
                <StatCard label="RESERVED" value={stats.reserved} color="#FBBF24" active={statusFilter === 'reserved'} onClick={() => handleStatusClick('reserved')} />
                <StatCard label="EXPIRED" value={stats.expired} color="#9CA3AF" active={statusFilter === 'expired'} onClick={() => handleStatusClick('expired')} />
                <StatCard label="RETIRED" value={stats.retired} color="#F87171" active={statusFilter === 'retired'} onClick={() => handleStatusClick('retired')} />
            </div>

            {/* ── Actions Row ── */}
            <div className="flex items-center gap-3 flex-wrap">
                {/* Search */}
                <div className="relative flex-1 min-w-[200px] max-w-md">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-white/20" />
                    <input
                        type="text"
                        placeholder="Search numbers, operator, country..."
                        onChange={e => handleSearchInput(e.target.value)}
                        className="w-full pl-9 pr-4 py-2.5 bg-white/[0.04] border border-white/10 rounded-xl text-xs text-white placeholder-white/20 focus:outline-none focus:border-[#FF9500]/40"
                    />
                </div>

                {/* Filter Toggle */}
                <button
                    onClick={() => setShowFilters(p => !p)}
                    className={`flex items-center gap-1.5 px-3 py-2.5 rounded-xl text-xs font-medium border transition ${showFilters
                        ? 'bg-[#FF9500]/10 text-[#FF9500] border-[#FF9500]/30'
                        : 'bg-white/[0.04] text-white/50 border-white/10 hover:border-white/20'
                        }`}
                >
                    <Filter className="w-3.5 h-3.5" />
                    Filters
                    {(countryFilter || operatorFilter || providerFilter || serviceFilter) && (
                        <span className="w-1.5 h-1.5 rounded-full bg-[#FF9500]" />
                    )}
                </button>

                {/* Refresh */}
                <button
                    onClick={refreshAll}
                    className="p-2.5 rounded-xl bg-white/[0.04] text-white/40 border border-white/10 hover:text-white/70 transition"
                    title="Refresh"
                >
                    <RefreshCw className="w-3.5 h-3.5" />
                </button>

                <div className="flex-1" />

                {/* Info note */}
                <div className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-[rgba(255,149,0,0.06)] border border-[rgba(255,149,0,0.12)] text-[#FF9500]/70 text-[11px]">
                    <Info className="w-3 h-3 flex-shrink-0" />
                    <span className="hidden sm:inline">Numbers are added via</span>
                    <span className="font-bold">API Settings → Fetch Numbers</span>
                </div>
            </div>

            {/* ── Filter Dropdowns ── */}
            {showFilters && (
                <div className="flex gap-3 flex-wrap p-3 bg-white/[0.02] rounded-xl border border-white/5">
                    <DropdownSelect
                        label="All Countries"
                        value={countryFilter}
                        onChange={v => { setCountryFilter(v); setPage(1); setSelectedIds([]) }}
                        options={filterOpts.countries?.map(c => ({ value: c.id, label: `${c.flag} ${c.name}` })) || []}
                        className="min-w-[160px]"
                    />
                    <DropdownSelect
                        label="All Operators"
                        value={operatorFilter}
                        onChange={v => { setOperatorFilter(v); setPage(1); setSelectedIds([]) }}
                        options={filterOpts.operators?.map(o => ({ value: o, label: o })) || []}
                        className="min-w-[140px]"
                    />
                    <DropdownSelect
                        label="All Providers"
                        value={providerFilter}
                        onChange={v => { setProviderFilter(v); setPage(1); setSelectedIds([]) }}
                        options={filterOpts.providers?.map(p => ({ value: p, label: p })) || []}
                        className="min-w-[140px]"
                    />
                    <DropdownSelect
                        label="All Services"
                        value={serviceFilter}
                        onChange={v => { setServiceFilter(v); setPage(1); setSelectedIds([]) }}
                        options={filterOpts.services?.map(s => ({ value: s.id, label: s.name })) || []}
                        className="min-w-[160px]"
                    />
                    {(countryFilter || operatorFilter || providerFilter || serviceFilter) && (
                        <button
                            onClick={() => { setCountryFilter(''); setOperatorFilter(''); setProviderFilter(''); setServiceFilter(''); setPage(1); setSelectedIds([]) }}
                            className="text-[10px] text-red-400 hover:text-red-300 underline self-center"
                        >
                            Clear filters
                        </button>
                    )}
                </div>
            )}

            {/* ── Bulk Actions ── */}
            {selectedIds.length > 0 && (
                <BulkActionsBar
                    selectedIds={selectedIds}
                    filterOpts={filterOpts}
                    onAction={handleBulkAction}
                    onClear={() => setSelectedIds([])}
                />
            )}

            {/* ── Table ── */}
            <div className="bg-[rgba(15,20,60,0.5)] border border-[rgba(255,255,255,0.06)] rounded-2xl overflow-hidden">
                {loading ? (
                    <div className="flex items-center justify-center py-20">
                        <Loader2 className="w-6 h-6 text-[#FF9500] animate-spin" />
                    </div>
                ) : numbers.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-20 text-white/20">
                        <Phone className="w-10 h-10 mb-3" />
                        <p className="text-sm font-medium">No numbers found</p>
                        <p className="text-xs mt-1">Fetch numbers from a provider in API Settings, or adjust your filters</p>
                    </div>
                ) : (
                    <>
                        {/* Table Header */}
                        <div className="hidden md:grid grid-cols-[40px_1fr_120px_100px_100px_90px_90px_70px_80px_50px] gap-2 px-4 py-3 border-b border-white/5 bg-white/[0.02]">
                            <div className="flex items-center justify-center">
                                <button onClick={toggleSelectAll} className="text-white/30 hover:text-white/60 transition">
                                    {selectedIds.length === numbers.length && numbers.length > 0
                                        ? <CheckSquare className="w-3.5 h-3.5 text-[#FF9500]" />
                                        : <Square className="w-3.5 h-3.5" />}
                                </button>
                            </div>
                            <p className="text-[9px] text-white/30 font-bold uppercase tracking-wider">Number</p>
                            <p className="text-[9px] text-white/30 font-bold uppercase tracking-wider">Country</p>
                            <p className="text-[9px] text-white/30 font-bold uppercase tracking-wider">Provider</p>
                            <p className="text-[9px] text-white/30 font-bold uppercase tracking-wider">Operator</p>
                            <p className="text-[9px] text-white/30 font-bold uppercase tracking-wider">Status</p>
                            <p className="text-[9px] text-white/30 font-bold uppercase tracking-wider">Sell $</p>
                            <p className="text-[9px] text-white/30 font-bold uppercase tracking-wider">Uses</p>
                            <p className="text-[9px] text-white/30 font-bold uppercase tracking-wider">Services</p>
                            <p className="text-[9px] text-white/30 font-bold uppercase tracking-wider"></p>
                        </div>

                        {/* Table Rows */}
                        {numbers.map(num => (
                            <div
                                key={num.id}
                                className={`grid grid-cols-1 md:grid-cols-[40px_1fr_120px_100px_100px_90px_90px_70px_80px_50px] gap-2 px-4 py-3 border-b border-white/[0.03] hover:bg-white/[0.02] transition items-center ${selectedIds.includes(num.id) ? 'bg-[#FF9500]/[0.03]' : ''}`}
                            >
                                {/* Checkbox */}
                                <div className="flex items-center justify-center">
                                    <button onClick={() => toggleSelect(num.id)} className="text-white/30 hover:text-white/60 transition">
                                        {selectedIds.includes(num.id)
                                            ? <CheckSquare className="w-3.5 h-3.5 text-[#FF9500]" />
                                            : <Square className="w-3.5 h-3.5" />}
                                    </button>
                                </div>

                                {/* Phone Number */}
                                <div className="flex items-center gap-2">
                                    <button onClick={() => copyText(num.phone_number)} className="text-white/20 hover:text-white/50 transition" title="Copy">
                                        <Copy className="w-3 h-3" />
                                    </button>
                                    <span className="text-xs font-mono text-white/90">{num.phone_number}</span>
                                </div>

                                {/* Country */}
                                <div className="flex items-center gap-1.5">
                                    <span className="text-sm">{num.country?.flag}</span>
                                    <span className="text-[11px] text-white/60 truncate">{num.country?.name}</span>
                                </div>

                                {/* Provider */}
                                <span className="text-[10px] text-white/50 uppercase font-medium">{num.provider}</span>

                                {/* Operator */}
                                <span className="text-[11px] text-white/50">{num.operator || '—'}</span>

                                {/* Status */}
                                <StatusBadge status={num.status} />

                                {/* Sell Price */}
                                <span className="text-[11px] text-green-400 font-medium">${parseFloat(num.sell_price).toFixed(2)}</span>

                                {/* Uses */}
                                <span className="text-[11px] text-white/40">{num.times_used}/{num.max_uses}</span>

                                {/* Services count */}
                                <div className="flex items-center gap-1">
                                    <Tag className="w-3 h-3 text-white/20" />
                                    <span className="text-[11px] text-white/40">{num.services?.length || 0}</span>
                                </div>

                                {/* Actions */}
                                <div className="flex items-center gap-1">
                                    <button
                                        onClick={() => setEditNumber(num)}
                                        className="p-1.5 rounded-lg hover:bg-white/[0.06] text-white/30 hover:text-white/60 transition"
                                        title="Edit"
                                    >
                                        <Edit3 className="w-3.5 h-3.5" />
                                    </button>
                                    <button
                                        onClick={() => handleDelete(num)}
                                        className="p-1.5 rounded-lg hover:bg-red-500/10 text-white/20 hover:text-red-400 transition"
                                        title="Delete"
                                    >
                                        <Trash2 className="w-3.5 h-3.5" />
                                    </button>
                                </div>

                                {/* Mobile-only extras */}
                                <div className="md:hidden col-span-1 flex flex-wrap gap-2 text-[10px] text-white/30">
                                    <span>{num.country?.flag} {num.country?.name}</span>
                                    <span>• {num.provider}</span>
                                    <span>• {num.operator || 'No operator'}</span>
                                    <StatusBadge status={num.status} />
                                    <span className="text-green-400">${parseFloat(num.sell_price).toFixed(2)}</span>
                                    <span>{num.times_used}/{num.max_uses} uses</span>
                                </div>
                            </div>
                        ))}

                        {/* Pagination */}
                        <div className="flex items-center justify-between px-4 py-3 border-t border-white/5">
                            <p className="text-[10px] text-white/30">
                                Showing {meta.from ?? 0}–{meta.to ?? 0} of {meta.total ?? 0}
                            </p>
                            <div className="flex items-center gap-1">
                                <button
                                    disabled={!meta.prev_page_url}
                                    onClick={() => setPage(p => p - 1)}
                                    className="p-1.5 rounded-lg hover:bg-white/[0.06] text-white/30 disabled:opacity-20 transition"
                                >
                                    <ChevronLeft className="w-4 h-4" />
                                </button>
                                <span className="text-[10px] text-white/40 px-2">
                                    Page {meta.current_page ?? 1} of {meta.last_page ?? 1}
                                </span>
                                <button
                                    disabled={!meta.next_page_url}
                                    onClick={() => setPage(p => p + 1)}
                                    className="p-1.5 rounded-lg hover:bg-white/[0.06] text-white/30 disabled:opacity-20 transition"
                                >
                                    <ChevronRight className="w-4 h-4" />
                                </button>
                            </div>
                        </div>
                    </>
                )}
            </div>

            {/* ── Edit Modal ── */}
            {editNumber && (
                <NumberFormModal
                    number={editNumber}
                    filterOpts={filterOpts}
                    onClose={() => setEditNumber(null)}
                    onSaved={() => { setEditNumber(null); refreshAll() }}
                />
            )}
        </div>
    )
}
