import { useState, useEffect, useCallback } from 'react'
import { Search, Plus, Trash2, Edit3, ToggleLeft, ToggleRight, Download, Loader2, X, Check, Globe, ChevronLeft, ChevronRight } from 'lucide-react'
import adminApi from '../../../lib/adminAxios'
import toast from 'react-hot-toast'

// Auto-convert USD prices to Naira for display
const USD_TO_NGN = 1500
const toNaira = (usd) => `₦${(parseFloat(usd || 0) * USD_TO_NGN).toLocaleString()}`
const PER_PAGE = 12

export default function ManageCountriesSection() {
    const [countries, setCountries] = useState([])
    const [loading, setLoading] = useState(true)
    const [search, setSearch] = useState('')
    const [showForm, setShowForm] = useState(false)
    const [editingCountry, setEditingCountry] = useState(null)
    const [form, setForm] = useState({ name: '', code: '', flag: '', dial_code: '', twilio_code: '', price_usd: '', is_active: true })
    const [submitting, setSubmitting] = useState(false)
    const [page, setPage] = useState(1)

    // Suggestions modal
    const [showSuggestions, setShowSuggestions] = useState(false)
    const [suggestions, setSuggestions] = useState([])
    const [selectedSuggestions, setSelectedSuggestions] = useState([])
    const [fetchingSuggestions, setFetchingSuggestions] = useState(false)
    const [importingSuggestions, setImportingSuggestions] = useState(false)

    const fetchCountries = useCallback(async () => {
        setLoading(true)
        try {
            const r = await adminApi.get('/api/admin/countries', { params: { per_page: 100, search } })
            setCountries(r.data.data || [])
        } catch { toast.error('Failed to load countries') }
        finally { setLoading(false) }
    }, [search])

    useEffect(() => { fetchCountries() }, [fetchCountries])
    useEffect(() => { setPage(1) }, [search])

    // Client-side pagination
    const totalPages = Math.ceil(countries.length / PER_PAGE)
    const paged = countries.slice((page - 1) * PER_PAGE, page * PER_PAGE)

    const handleSubmit = async (e) => {
        e.preventDefault()
        setSubmitting(true)
        try {
            if (editingCountry) {
                await adminApi.put(`/api/admin/countries/${editingCountry.id}`, form)
                toast.success('Country updated')
            } else {
                await adminApi.post('/api/admin/countries', form)
                toast.success('Country added')
            }
            setShowForm(false); setEditingCountry(null)
            setForm({ name: '', code: '', flag: '', dial_code: '', twilio_code: '', price_usd: '', is_active: true })
            fetchCountries()
        } catch (err) { toast.error(err.response?.data?.message || 'Failed') }
        finally { setSubmitting(false) }
    }

    const handleToggle = async (country) => {
        try {
            await adminApi.post(`/api/admin/countries/${country.id}/toggle`)
            fetchCountries()
        } catch { toast.error('Toggle failed') }
    }

    const handleDelete = async (country) => {
        if (!confirm(`Delete ${country.name}?`)) return
        try {
            await adminApi.delete(`/api/admin/countries/${country.id}`)
            toast.success('Deleted')
            fetchCountries()
        } catch (err) { toast.error(err.response?.data?.message || 'Delete failed') }
    }

    const handleEdit = (country) => {
        setEditingCountry(country)
        setForm({
            name: country.name, code: country.code, flag: country.flag || '',
            dial_code: country.dial_code, twilio_code: country.twilio_code,
            price_usd: country.price_usd, is_active: country.is_active,
        })
        setShowForm(true)
    }

    const handleFetchSuggestions = async () => {
        setFetchingSuggestions(true); setShowSuggestions(true)
        try {
            const r = await adminApi.get('/api/admin/countries/suggestions')
            setSuggestions(r.data || [])
            setSelectedSuggestions([])
        } catch { toast.error('Failed to fetch suggestions') }
        finally { setFetchingSuggestions(false) }
    }

    const handleImport = async () => {
        if (selectedSuggestions.length === 0) return toast.error('Select at least one country')
        setImportingSuggestions(true)
        try {
            const selected = selectedSuggestions.map(i => suggestions[i])
            const r = await adminApi.post('/api/admin/countries/import', { countries: selected })
            toast.success(r.data.message)
            setShowSuggestions(false)
            fetchCountries()
        } catch (err) { toast.error(err.response?.data?.message || 'Import failed') }
        finally { setImportingSuggestions(false) }
    }

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                    <Globe className="w-5 h-5 text-[#FF9500]" />
                    <h2 className="text-lg font-bold text-white">Manage Countries</h2>
                    <span className="text-xs text-white/30">{countries.length} total</span>
                </div>
                <div className="flex gap-2">
                    <button onClick={handleFetchSuggestions}
                        className="flex-1 sm:flex-none px-4 py-2 rounded-xl bg-[rgba(255,149,0,0.1)] border border-[rgba(255,149,0,0.25)] text-[#FF9500] text-xs font-bold hover:bg-[rgba(255,149,0,0.2)] transition flex items-center justify-center gap-1.5">
                        <Download className="w-3.5 h-3.5" /> <span className="hidden sm:inline">Fetch</span> Suggestions
                    </button>
                    <button onClick={() => { setShowForm(true); setEditingCountry(null); setForm({ name: '', code: '', flag: '', dial_code: '', twilio_code: '', price_usd: '', is_active: true }) }}
                        className="flex-1 sm:flex-none px-4 py-2 rounded-xl bg-gradient-to-r from-[#FF9500] to-[#FF6B00] text-white text-xs font-bold flex items-center justify-center gap-1.5 shadow-[0_0_12px_rgba(255,149,0,0.2)] hover:shadow-[0_0_20px_rgba(255,149,0,0.4)] transition">
                        <Plus className="w-3.5 h-3.5" /> Add Country
                    </button>
                </div>
            </div>

            {/* Search */}
            <div className="relative max-w-sm">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
                <input type="text" placeholder="Search countries…" value={search} onChange={e => setSearch(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-white/[0.05] border border-white/10 text-white text-sm placeholder-white/25 focus:outline-none focus:border-[rgba(255,149,0,0.35)] transition" />
            </div>

            {/* Suggestions Modal */}
            {showSuggestions && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
                    <div className="bg-[rgba(15,20,60,0.97)] border border-[rgba(255,149,0,0.15)] rounded-2xl p-4 sm:p-6 w-full max-w-2xl max-h-[80vh] overflow-y-auto">
                        <div className="flex justify-between items-center mb-4">
                            <h3 className="text-white font-bold">Available Countries</h3>
                            <button onClick={() => setShowSuggestions(false)} className="text-white/30 hover:text-white"><X className="w-5 h-5" /></button>
                        </div>
                        {fetchingSuggestions ? (
                            <div className="flex justify-center py-8"><Loader2 className="w-6 h-6 text-[#FF9500] animate-spin" /></div>
                        ) : suggestions.length === 0 ? (
                            <p className="text-center text-white/30 py-8">All countries already added!</p>
                        ) : (
                            <>
                                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 mb-4">
                                    {suggestions.map((s, i) => {
                                        const isSelected = selectedSuggestions.includes(i)
                                        return (
                                            <button key={i} onClick={() => setSelectedSuggestions(prev => isSelected ? prev.filter(x => x !== i) : [...prev, i])}
                                                className={`rounded-xl p-3 text-left border transition-all ${isSelected ? 'border-[rgba(255,149,0,0.5)] bg-[rgba(255,149,0,0.08)]' : 'border-white/5 bg-white/[0.02] hover:bg-white/[0.04]'}`}>
                                                <div className="flex items-center gap-2 mb-1">
                                                    <span className="text-lg">{s.flag}</span>
                                                    <span className="text-sm text-white font-medium truncate">{s.name}</span>
                                                    {isSelected && <Check className="w-3.5 h-3.5 text-[#FF9500] ml-auto flex-shrink-0" />}
                                                </div>
                                                <p className="text-[10px] text-white/30">{s.dial_code} · {s.code} · {toNaira(s.price_usd)}</p>
                                            </button>
                                        )
                                    })}
                                </div>
                                <div className="flex flex-col sm:flex-row justify-between items-center gap-3 pt-3 border-t border-white/5">
                                    <span className="text-xs text-white/30">{selectedSuggestions.length} selected</span>
                                    <button onClick={handleImport} disabled={importingSuggestions || selectedSuggestions.length === 0}
                                        className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#FF9500] to-[#FF6B00] text-white text-sm font-bold flex items-center justify-center gap-2 disabled:opacity-40 transition">
                                        {importingSuggestions ? <Loader2 className="w-4 h-4 animate-spin" /> : <Download className="w-4 h-4" />} Import Selected
                                    </button>
                                </div>
                            </>
                        )}
                    </div>
                </div>
            )}

            {/* Add/Edit Form */}
            {showForm && (
                <div className="rounded-2xl border border-[rgba(255,149,0,0.15)] bg-[rgba(15,20,60,0.5)] backdrop-blur-xl p-4 sm:p-5">
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="text-white font-bold">{editingCountry ? 'Edit Country' : 'Add New Country'}</h3>
                        <button onClick={() => { setShowForm(false); setEditingCountry(null) }} className="text-white/30 hover:text-white/60"><X className="w-5 h-5" /></button>
                    </div>
                    <form onSubmit={handleSubmit} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                        <Input label="Country Name" value={form.name} onChange={v => setForm(f => ({ ...f, name: v }))} placeholder="United States" required />
                        <Input label="Country Code (ISO)" value={form.code} onChange={v => setForm(f => ({ ...f, code: v.toUpperCase() }))} placeholder="US" maxLength={2} required />
                        <Input label="Flag Emoji" value={form.flag} onChange={v => setForm(f => ({ ...f, flag: v }))} placeholder="🇺🇸" />
                        <Input label="Dial Code" value={form.dial_code} onChange={v => setForm(f => ({ ...f, dial_code: v }))} placeholder="+1" required />
                        <Input label="Twilio Code" value={form.twilio_code} onChange={v => setForm(f => ({ ...f, twilio_code: v.toUpperCase() }))} placeholder="US" maxLength={2} required />
                        <Input label={`Price (USD → ${form.price_usd ? toNaira(form.price_usd) : '₦0'})`} value={form.price_usd} onChange={v => setForm(f => ({ ...f, price_usd: v }))} placeholder="1.00" type="number" step="0.01" required />
                        <div className="sm:col-span-2 lg:col-span-3 flex flex-col sm:flex-row gap-3 pt-2">
                            <button type="submit" disabled={submitting}
                                className="w-full sm:w-auto px-6 py-2.5 rounded-xl bg-gradient-to-r from-[#FF9500] to-[#FF6B00] text-white text-sm font-bold flex items-center justify-center gap-2 disabled:opacity-40 transition">
                                {submitting ? <Loader2 className="w-4 h-4 animate-spin" /> : null} {editingCountry ? 'Update' : 'Add Country'}
                            </button>
                            <button type="button" onClick={() => { setShowForm(false); setEditingCountry(null) }}
                                className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white/50 text-sm hover:bg-white/10 transition">Cancel</button>
                        </div>
                    </form>
                </div>
            )}

            {/* Countries List */}
            <div className="rounded-2xl border border-[rgba(255,149,0,0.1)] bg-[rgba(15,20,60,0.5)] backdrop-blur-xl overflow-hidden">
                {loading ? (
                    <div className="flex justify-center py-12"><Loader2 className="w-6 h-6 text-[#FF9500] animate-spin" /></div>
                ) : countries.length === 0 ? (
                    <div className="text-center py-12 text-white/30">
                        <Globe className="w-10 h-10 mx-auto mb-3 opacity-30" />
                        <p className="font-semibold">No countries yet</p>
                        <p className="text-sm mt-1">Add countries manually or fetch suggestions</p>
                    </div>
                ) : (
                    <>
                        {/* ───── Desktop Table ───── */}
                        <div className="hidden md:block overflow-x-auto">
                            <table className="w-full text-left">
                                <thead>
                                    <tr className="bg-[rgba(255,149,0,0.04)] border-b border-[rgba(255,149,0,0.08)]">
                                        <th className="px-5 py-3 text-xs text-white/40 font-medium">Country</th>
                                        <th className="px-5 py-3 text-xs text-white/40 font-medium">Code</th>
                                        <th className="px-5 py-3 text-xs text-white/40 font-medium">Dial Code</th>
                                        <th className="px-5 py-3 text-xs text-white/40 font-medium">Price</th>
                                        <th className="px-5 py-3 text-xs text-white/40 font-medium">Status</th>
                                        <th className="px-5 py-3 text-xs text-white/40 font-medium text-right">Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {paged.map(country => (
                                        <tr key={country.id} className="border-b border-white/[0.03] hover:bg-white/[0.02] transition">
                                            <td className="px-5 py-3.5">
                                                <div className="flex items-center gap-3">
                                                    <span className="text-xl">{country.flag || '🌍'}</span>
                                                    <span className="text-sm text-white font-medium">{country.name}</span>
                                                </div>
                                            </td>
                                            <td className="px-5 py-3.5 text-sm text-white/50 font-mono">{country.code}</td>
                                            <td className="px-5 py-3.5 text-sm text-white/50">{country.dial_code}</td>
                                            <td className="px-5 py-3.5 text-sm text-[#FF9500] font-bold">{toNaira(country.price_usd)}</td>
                                            <td className="px-5 py-3.5">
                                                <button onClick={() => handleToggle(country)}
                                                    className={`flex items-center gap-1.5 text-xs font-bold px-2.5 py-1 rounded-full transition ${country.is_active ? 'text-emerald-400 bg-emerald-500/10' : 'text-red-400 bg-red-500/10'}`}>
                                                    {country.is_active ? <><ToggleRight className="w-3.5 h-3.5" /> Active</> : <><ToggleLeft className="w-3.5 h-3.5" /> Off</>}
                                                </button>
                                            </td>
                                            <td className="px-5 py-3.5 text-right">
                                                <div className="flex justify-end gap-1.5">
                                                    <button onClick={() => handleEdit(country)} className="p-1.5 rounded-lg hover:bg-white/10 text-white/30 hover:text-white transition"><Edit3 className="w-3.5 h-3.5" /></button>
                                                    <button onClick={() => handleDelete(country)} className="p-1.5 rounded-lg hover:bg-red-500/10 text-white/30 hover:text-red-400 transition"><Trash2 className="w-3.5 h-3.5" /></button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>

                        {/* ───── Mobile Cards ───── */}
                        <div className="md:hidden divide-y divide-white/5">
                            {paged.map(country => (
                                <div key={country.id} className="p-4 hover:bg-white/[0.02] transition">
                                    <div className="flex items-start justify-between gap-3">
                                        <div className="flex items-center gap-3 min-w-0">
                                            <span className="text-2xl flex-shrink-0">{country.flag || '🌍'}</span>
                                            <div className="min-w-0">
                                                <p className="text-sm font-semibold text-white truncate">{country.name}</p>
                                                <p className="text-xs text-white/30">{country.code} · {country.dial_code}</p>
                                            </div>
                                        </div>
                                        <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold flex-shrink-0 ${country.is_active ? 'bg-emerald-500/10 text-emerald-400' : 'bg-red-500/10 text-red-400'}`}>
                                            {country.is_active ? 'Active' : 'Off'}
                                        </span>
                                    </div>
                                    <div className="flex items-center justify-between mt-3 ml-[44px]">
                                        <p className="text-sm text-[#FF9500] font-bold">{toNaira(country.price_usd)}</p>
                                        <div className="flex gap-1">
                                            <button onClick={() => handleToggle(country)}
                                                className="p-2 rounded-lg hover:bg-white/[0.06] text-white/30 hover:text-[#FF9500] transition">
                                                {country.is_active ? <ToggleRight className="w-4 h-4 text-emerald-400" /> : <ToggleLeft className="w-4 h-4" />}
                                            </button>
                                            <button onClick={() => handleEdit(country)}
                                                className="p-2 rounded-lg hover:bg-white/[0.06] text-white/30 hover:text-white/60 transition">
                                                <Edit3 className="w-4 h-4" />
                                            </button>
                                            <button onClick={() => handleDelete(country)}
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
                        <span className="text-xs text-white/30">Page {page} of {totalPages} · {countries.length} countries</span>
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

function Input({ label, value, onChange, ...props }) {
    return (
        <div>
            <label className="block text-xs text-white/50 font-medium mb-1.5">{label}</label>
            <input value={value} onChange={e => onChange(e.target.value)}
                className="w-full px-3 py-2.5 rounded-xl bg-white/[0.05] border border-white/10 text-sm text-white placeholder-white/20 focus:outline-none focus:border-[rgba(255,149,0,0.4)] transition"
                {...props} />
        </div>
    )
}
