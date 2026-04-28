import { useState, useEffect, useCallback } from 'react'
import {
  Settings, Save, Loader2, Eye, EyeOff, CheckCircle, CloudDownload,
  Globe, Phone, DollarSign, ChevronDown, Check, Download, AlertTriangle,
  Zap, CheckSquare, Square, Percent, TrendingUp, Plus, Trash2, ToggleLeft,
  ToggleRight, X, Edit3, Shield, Route, ArrowUpDown, RotateCcw, Activity,
  Timer, BarChart3, GripVertical
} from 'lucide-react'
import adminApi from '../../../lib/adminAxios'
import toast from 'react-hot-toast'
import { ServiceIconWithFallback } from '../../../components/ServiceIcon'

const fmtNaira = (v) => {
  const n = Number(v || 0)
  return '\u20A6' + n.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })
}

/* ── Per-Provider Markup Selector ── */
const MARKUP_PRESETS = [0, 5, 10, 15, 20, 25, 30, 40, 50, 75, 100, 150, 200, 300, 500]

function MarkupSelector({ providerId, currentMarkup, onUpdated }) {
  const [value, setValue] = useState(currentMarkup)
  const [custom, setCustom] = useState(false)
  const [saving, setSaving] = useState(false)

  useEffect(() => { setValue(currentMarkup) }, [currentMarkup])

  const isPreset = MARKUP_PRESETS.includes(Number(value))

  const save = async (v) => {
    setSaving(true)
    try {
      await adminApi.put('/api/admin/providers/' + providerId, { markup_percent: parseFloat(v) })
      toast.success('Markup updated to ' + v + '%')
      onUpdated()
    } catch { toast.error('Failed to update markup') }
    finally { setSaving(false); setCustom(false) }
  }

  if (custom || !isPreset) {
    return (
      <div className="flex items-center gap-2">
        <input type="number" min="0" max="1000" step="0.5" value={value}
          onChange={e => setValue(e.target.value)}
          className="w-20 px-2 py-1.5 rounded-lg bg-white/[0.05] border border-white/10 text-xs text-white text-center font-mono focus:outline-none focus:border-[rgba(255,149,0,0.4)]" />
        <span className="text-[10px] text-white/30">%</span>
        <button onClick={() => save(value)} disabled={saving}
          className="px-2 py-1 rounded-lg bg-[#FF9500]/20 text-[#FF9500] text-[10px] font-bold hover:bg-[#FF9500]/30 transition disabled:opacity-40">
          {saving ? '...' : 'Save'}
        </button>
        {isPreset && <button onClick={() => setCustom(false)} className="text-white/20 hover:text-white/40 text-[10px]">✕</button>}
      </div>
    )
  }

  return (
    <div className="flex items-center gap-1.5 flex-wrap">
      {MARKUP_PRESETS.map(p => (
        <button key={p} onClick={() => { setValue(p); save(p) }}
          disabled={saving}
          className={'px-2 py-1 rounded-lg text-[10px] font-bold transition ' +
            (Number(value) === p
              ? 'bg-[#FF9500] text-white shadow-[0_0_8px_rgba(255,149,0,0.3)]'
              : 'bg-white/[0.04] text-white/30 hover:bg-white/[0.08] hover:text-white/50')
          }>
          {p}%
        </button>
      ))}
      <button onClick={() => setCustom(true)}
        className="px-2 py-1 rounded-lg text-[10px] font-bold bg-white/[0.04] text-white/30 hover:bg-white/[0.08] hover:text-white/50 transition">
        Custom
      </button>
    </div>
  )
}

/* ══════════════════════════════════════════════════════════
   TAB 1: PROVIDERS (multi-provider CRUD)
   ══════════════════════════════════════════════════════════ */
function ProvidersTab() {
  const [providers, setProviders] = useState([])
  const [availableTypes, setAvailableTypes] = useState([])
  const [loading, setLoading] = useState(true)
  const [showAddForm, setShowAddForm] = useState(false)
  const [editingProvider, setEditingProvider] = useState(null)

  const load = useCallback(() => {
    setLoading(true)
    Promise.all([
      adminApi.get('/api/admin/providers'),
      adminApi.get('/api/admin/providers/types'),
    ]).then(([pRes, tRes]) => {
      setProviders(pRes.data)
      setAvailableTypes(tRes.data)
    }).catch(() => toast.error('Failed to load providers'))
      .finally(() => setLoading(false))
  }, [])

  useEffect(() => { load() }, [load])

  const handleToggle = async (provider) => {
    try {
      const r = await adminApi.post('/api/admin/providers/' + provider.id + '/toggle')
      toast.success(r.data.message)
      load()
    } catch { toast.error('Failed to toggle') }
  }

  const handleDelete = async (provider) => {
    if (!confirm('Delete provider "' + provider.name + '"? This cannot be undone.')) return
    try {
      const r = await adminApi.delete('/api/admin/providers/' + provider.id)
      toast.success(r.data.message)
      load()
    } catch { toast.error('Failed to delete') }
  }

  if (loading) return <div className="flex items-center justify-center py-20"><Loader2 className="w-6 h-6 text-[#FF9500] animate-spin" /></div>

  return (
    <div className="space-y-5">
      {/* Add Provider Button */}
      <div className="flex items-center justify-between">
        <p className="text-xs text-white/40">Manage your API provider accounts. All country & number data is fetched from these providers.</p>
        <button onClick={() => { setEditingProvider(null); setShowAddForm(true) }}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-[#FF9500] to-[#FF6B00] text-white text-xs font-bold uppercase tracking-wider hover:opacity-90 transition">
          <Plus className="w-3.5 h-3.5" /> Add Provider
        </button>
      </div>

      {/* Add/Edit Form */}
      {(showAddForm || editingProvider) && (
        <ProviderForm
          provider={editingProvider}
          availableTypes={availableTypes}
          onClose={() => { setShowAddForm(false); setEditingProvider(null) }}
          onSaved={() => { setShowAddForm(false); setEditingProvider(null); load() }}
        />
      )}

      {/* Provider Cards */}
      {providers.length === 0 ? (
        <div className="text-center py-16 text-white/20">
          <Shield className="w-10 h-10 mx-auto mb-3" />
          <p className="text-sm font-medium">No providers configured</p>
          <p className="text-xs mt-1">Add a provider to start fetching countries and numbers from the API.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {providers.map(function(p) {
            return (
              <div key={p.id} className={'rounded-2xl border backdrop-blur-xl p-5 transition-all ' + (p.is_configured ? 'border-[rgba(255,149,0,0.15)] bg-[rgba(15,20,60,0.5)]' : 'border-red-500/20 bg-[rgba(15,20,60,0.5)]')}>
                <div className="flex items-start justify-between gap-4">
                  <div className="flex items-center gap-3 min-w-0">
                    <div className={'w-10 h-10 rounded-xl flex items-center justify-center text-sm font-bold ' + (p.is_configured ? 'bg-[#FF9500]/10 text-[#FF9500]' : 'bg-red-500/10 text-red-400')}>
                      {p.type === 'twilio' ? 'TW' : p.type === '5sim' ? '5S' : p.type === 'smspool' ? 'SP' : p.type.slice(0, 2).toUpperCase()}
                    </div>
                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <h3 className="text-sm font-bold text-white">{p.name}</h3>
                        <span className="text-[9px] px-2 py-0.5 rounded-full font-bold uppercase tracking-wider bg-white/5 text-white/30">{p.type}</span>
                        {p.is_configured
                          ? <span className="flex items-center gap-1 text-[9px] text-green-400 font-bold"><CheckCircle className="w-3 h-3" /> Ready</span>
                          : <span className="flex items-center gap-1 text-[9px] text-red-400 font-bold"><AlertTriangle className="w-3 h-3" /> Not Configured</span>
                        }
                      </div>
                      <p className="text-[11px] text-white/30 mt-0.5">{p.description}</p>
                      {p.slug && <p className="text-[9px] text-white/15 font-mono mt-0.5">slug: {p.slug}</p>}
                    </div>
                  </div>
                  <div className="flex items-center gap-1.5 flex-shrink-0">
                    <button onClick={() => handleToggle(p)} title={p.is_active ? 'Deactivate' : 'Activate'}
                      className="p-2 rounded-lg hover:bg-white/[0.06] text-white/30 hover:text-[#FF9500] transition">
                      {p.is_active ? <ToggleRight className="w-4 h-4 text-green-400" /> : <ToggleLeft className="w-4 h-4" />}
                    </button>
                    <button onClick={() => setEditingProvider(p)}
                      className="p-2 rounded-lg hover:bg-white/[0.06] text-white/30 hover:text-white/60 transition">
                      <Edit3 className="w-4 h-4" />
                    </button>
                    <button onClick={() => handleDelete(p)}
                      className="p-2 rounded-lg hover:bg-red-500/10 text-white/30 hover:text-red-400 transition">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* Credential Status */}
                {p.credentials && Object.keys(p.credentials).length > 0 && (
                  <div className="mt-3 pt-3 border-t border-white/5 flex flex-wrap gap-3">
                    {Object.entries(p.credentials).map(function([key, info]) {
                      return (
                        <div key={key} className="flex items-center gap-1.5">
                          {info.is_set
                            ? <CheckCircle className="w-3 h-3 text-green-400" />
                            : <AlertTriangle className="w-3 h-3 text-yellow-400" />}
                          <span className="text-[10px] text-white/40">{key.replace(/_/g, ' ')}</span>
                          {info.is_set && <span className="text-[9px] font-mono text-white/20">{info.value}</span>}
                        </div>
                      )
                    })}
                  </div>
                )}

                {/* Capabilities */}
                {p.capabilities && p.capabilities.length > 0 && (
                  <div className="mt-2 flex gap-1.5">
                    {p.capabilities.map(function(cap) {
                      return <span key={cap} className="text-[8px] px-2 py-0.5 rounded-full bg-white/5 text-white/25 uppercase font-bold tracking-wider">{cap}</span>
                    })}
                  </div>
                )}

                {/* Price Markup */}
                <div className="mt-3 pt-3 border-t border-white/5">
                  <div className="flex items-center justify-between gap-3">
                    <div className="flex items-center gap-2">
                      <Percent className="w-3.5 h-3.5 text-[#FF9500]" />
                      <span className="text-[10px] text-white/40 font-medium uppercase tracking-wider">Price Markup</span>
                    </div>
                    <MarkupSelector providerId={p.id} currentMarkup={p.markup_percent ?? 0} onUpdated={load} />
                  </div>
                </div>

                {/* Routing Stats */}
                {p.total_requests > 0 && (
                  <div className="mt-3 pt-3 border-t border-white/5 grid grid-cols-2 sm:grid-cols-4 gap-3">
                    <div>
                      <p className="text-[9px] text-white/30 uppercase tracking-wider">Priority</p>
                      <p className="text-sm font-bold text-white">#{p.priority}</p>
                    </div>
                    <div>
                      <p className="text-[9px] text-white/30 uppercase tracking-wider">Success Rate</p>
                      <p className={'text-sm font-bold ' + (p.success_rate >= 90 ? 'text-green-400' : p.success_rate >= 70 ? 'text-yellow-400' : 'text-red-400')}>{p.success_rate}%</p>
                    </div>
                    <div>
                      <p className="text-[9px] text-white/30 uppercase tracking-wider">Avg Response</p>
                      <p className="text-sm font-bold text-white/60">{p.avg_response_ms}ms</p>
                    </div>
                    <div>
                      <p className="text-[9px] text-white/30 uppercase tracking-wider">Requests</p>
                      <p className="text-sm font-bold text-white/60">{p.total_requests}</p>
                    </div>
                  </div>
                )}
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}

/* ── Add/Edit Provider Form ── */
function ProviderForm({ provider, availableTypes, onClose, onSaved }) {
  var isEdit = !!provider
  var [type, setType] = useState(provider ? provider.type : (availableTypes[0]?.type || 'twilio'))
  var [name, setName] = useState(provider ? provider.name : '')
  var [credFields, setCredFields] = useState([])
  var [settFields, setSettFields] = useState([])
  var [credentials, setCredentials] = useState({})
  var [settings, setSettings] = useState(provider ? (provider.settings || {}) : {})
  var [showValues, setShowValues] = useState({})
  var [saving, setSaving] = useState(false)

  useEffect(() => {
    var t = isEdit ? provider.type : type
    adminApi.get('/api/admin/providers/fields/' + t).then(function(r) {
      setCredFields(r.data.credential_fields || [])
      setSettFields(r.data.setting_fields || [])
    }).catch(function() {})
  }, [type, isEdit])

  useEffect(() => {
    if (!isEdit && !name) {
      var td = availableTypes.find(function(t2) { return t2.type === type })
      if (td) setName(td.name)
    }
  }, [type])

  var handleSubmit = async function(e) {
    e.preventDefault()
    setSaving(true)
    try {
      if (isEdit) {
        await adminApi.put('/api/admin/providers/' + provider.id, {
          name: name,
          credentials: credentials,
          settings: settings,
        })
        toast.success('Provider updated')
      } else {
        await adminApi.post('/api/admin/providers', {
          type: type,
          name: name,
          credentials: credentials,
          settings: settings,
        })
        toast.success('Provider added')
      }
      onSaved()
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to save')
    } finally { setSaving(false) }
  }

  return (
    <div className="rounded-2xl border border-[rgba(255,149,0,0.15)] bg-[rgba(15,20,60,0.8)] backdrop-blur-xl p-5">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-bold text-white">{isEdit ? 'Edit' : 'Add New'} Provider</h3>
        <button onClick={onClose} className="text-white/30 hover:text-white/60"><X className="w-5 h-5" /></button>
      </div>
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Type + Name */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {!isEdit && (
            <div>
              <label className="text-[10px] text-white/40 font-medium uppercase tracking-wider block mb-1.5">Provider Type</label>
              <select value={type} onChange={function(e) { setType(e.target.value); setCredentials({}) }}
                className="w-full bg-white/[0.05] border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-[rgba(255,149,0,0.4)]">
                {availableTypes.map(function(t2) {
                  return <option key={t2.type} value={t2.type} className="bg-[#0F1440]">{t2.name}</option>
                })}
              </select>
            </div>
          )}
          <div>
            <label className="text-[10px] text-white/40 font-medium uppercase tracking-wider block mb-1.5">Display Name</label>
            <input type="text" value={name} onChange={function(e) { setName(e.target.value) }} required
              placeholder="e.g. My Twilio Account"
              className="w-full px-4 py-3 rounded-xl bg-white/[0.05] border border-white/10 text-sm text-white placeholder-white/20 focus:outline-none focus:border-[rgba(255,149,0,0.4)]" />
          </div>
        </div>

        {/* Credentials */}
        {credFields.length > 0 && (
          <div className="space-y-3">
            <label className="text-[10px] text-white/40 font-medium uppercase tracking-wider block">Credentials</label>
            {credFields.map(function(field) {
              var existing = isEdit && provider.credentials?.[field.key]
              return (
                <div key={field.key}>
                  <label className="text-xs text-white/50 font-medium mb-1.5 flex items-center gap-2">
                    {field.label}
                    {existing?.is_set && <span className="inline-flex items-center gap-1 text-green-400 text-[10px]"><CheckCircle className="w-3 h-3" /> Set</span>}
                  </label>
                  <div className="relative">
                    <input
                      type={showValues[field.key] ? 'text' : 'password'}
                      placeholder={existing?.is_set ? existing.value : field.placeholder}
                      value={credentials[field.key] || ''}
                      onChange={function(e) { setCredentials(function(prev) { return { ...prev, [field.key]: e.target.value } }) }}
                      className="w-full px-4 py-3 pr-10 rounded-xl bg-white/[0.05] border border-white/10 text-sm text-white placeholder-white/20 focus:outline-none focus:border-[rgba(255,149,0,0.4)] transition font-mono"
                    />
                    <button type="button" onClick={function() { setShowValues(function(v) { return { ...v, [field.key]: !v[field.key] } }) }}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-white/25 hover:text-white/50 transition">
                      {showValues[field.key] ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>
              )
            })}
          </div>
        )}

        {/* Settings */}
        {settFields.length > 0 && (
          <div className="space-y-3">
            <label className="text-[10px] text-white/40 font-medium uppercase tracking-wider block">Settings (optional)</label>
            {settFields.map(function(field) {
              return (
                <div key={field.key}>
                  <label className="text-xs text-white/50 font-medium mb-1.5 block">{field.label}</label>
                  <input
                    type="text"
                    placeholder={field.placeholder}
                    value={settings[field.key] || ''}
                    onChange={function(e) { setSettings(function(prev) { return { ...prev, [field.key]: e.target.value } }) }}
                    className="w-full px-4 py-3 rounded-xl bg-white/[0.05] border border-white/10 text-sm text-white placeholder-white/20 focus:outline-none focus:border-[rgba(255,149,0,0.4)] transition font-mono"
                  />
                </div>
              )
            })}
          </div>
        )}

        <button type="submit" disabled={saving}
          className="w-full py-3 rounded-xl bg-gradient-to-r from-[#FF9500] to-[#FF6B00] text-white font-bold flex items-center justify-center gap-2 shadow-[0_0_12px_rgba(255,149,0,0.2)] hover:shadow-[0_0_20px_rgba(255,149,0,0.4)] transition disabled:opacity-40">
          {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />} {isEdit ? 'Update Provider' : 'Add Provider'}
        </button>
      </form>
    </div>
  )
}

/* ══════════════════════════════════════════════════════════
   TAB 2: PRICING & MARKUP
   ══════════════════════════════════════════════════════════ */
function PricingConfigTab() {
  var [rate, setRate] = useState('')
  var [markup, setMarkup] = useState('')
  var [loading, setLoading] = useState(true)
  var [saving, setSaving] = useState(false)

  useEffect(function() {
    adminApi.get('/api/admin/settings/pricing-config')
      .then(function(r) {
        setRate(r.data?.usd_to_ngn_rate ?? 1500)
        setMarkup(r.data?.pricing_markup_percent ?? 0)
      })
      .catch(function() { toast.error('Failed to load pricing config') })
      .finally(function() { setLoading(false) })
  }, [])

  var handleSave = async function(e) {
    e.preventDefault()
    if (!rate || parseFloat(rate) < 1) return toast.error('Enter a valid exchange rate')
    if (markup === '' || parseFloat(markup) < 0) return toast.error('Enter a valid markup percentage')
    setSaving(true)
    try {
      var r = await adminApi.put('/api/admin/settings/pricing', {
        usd_to_ngn_rate: parseFloat(rate),
        pricing_markup_percent: parseFloat(markup),
      })
      toast.success(r.data.message)
    } catch (err) { toast.error(err.response?.data?.message || 'Failed') }
    finally { setSaving(false) }
  }

  var exampleBase = 1.00 * parseFloat(rate || 1500)
  var exampleFinal = exampleBase * (1 + (parseFloat(markup || 0) / 100))

  if (loading) return <div className="flex items-center justify-center py-20"><Loader2 className="w-6 h-6 text-[#FF9500] animate-spin" /></div>

  return (
    <div className="space-y-6">
      <div className="rounded-2xl border border-[rgba(255,149,0,0.15)] bg-[rgba(15,20,60,0.5)] backdrop-blur-xl p-6">
        <div className="flex items-center gap-2 mb-4">
          <TrendingUp className="w-4 h-4 text-[#FF9500]" />
          <h3 className="text-sm font-bold text-white">Currency & Markup</h3>
        </div>
        <p className="text-xs text-white/30 mb-6">
          All provider prices are in USD. Set the exchange rate and your markup percentage here.
          The final Naira price = <span className="text-[#FF9500]">USD price × Rate × (1 + Markup%)</span>
        </p>
        <form onSubmit={handleSave} className="space-y-5">
          <div>
            <label className="text-xs text-white/50 font-medium mb-1.5 block">USD to NGN Exchange Rate</label>
            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-white/30 text-sm font-bold">$1 =</span>
              <input type="number" step="0.01" min="1" value={rate} onChange={function(e) { setRate(e.target.value) }}
                className="w-full pl-16 pr-12 py-3 rounded-xl bg-white/[0.05] border border-white/10 text-sm text-white placeholder-white/20 focus:outline-none focus:border-[rgba(255,149,0,0.4)] transition font-mono"
                placeholder="1500" />
              <span className="absolute right-4 top-1/2 -translate-y-1/2 text-white/30 text-xs">NGN</span>
            </div>
          </div>
          <div>
            <label className="text-xs text-white/50 font-medium mb-1.5 block">Pricing Markup Percentage</label>
            <div className="relative">
              <input type="number" step="0.1" min="0" max="1000" value={markup} onChange={function(e) { setMarkup(e.target.value) }}
                className="w-full px-4 py-3 pr-10 rounded-xl bg-white/[0.05] border border-white/10 text-sm text-white placeholder-white/20 focus:outline-none focus:border-[rgba(255,149,0,0.4)] transition font-mono"
                placeholder="0" />
              <Percent className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
            </div>
            <p className="text-[10px] text-white/25 mt-1.5">Added on top of base NGN price. E.g. 20% on ₦1,500 = ₦1,800</p>
          </div>
          <div className="p-4 rounded-xl bg-[#FF9500]/[0.05] border border-[#FF9500]/10">
            <p className="text-[10px] text-white/40 uppercase tracking-wider font-bold mb-3">Live Preview — $1.00 USD number</p>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <p className="text-[10px] text-white/30">Provider Cost (USD)</p>
                <p className="text-sm font-bold text-white">$1.00</p>
              </div>
              <div>
                <p className="text-[10px] text-white/30">Base (NGN, no markup)</p>
                <p className="text-sm font-bold text-white/60">{fmtNaira(exampleBase)}</p>
              </div>
              <div>
                <p className="text-[10px] text-white/30">Final Price (with {markup || 0}% markup)</p>
                <p className="text-sm font-bold text-[#FF9500]">{fmtNaira(exampleFinal)}</p>
              </div>
            </div>
          </div>
          <button type="submit" disabled={saving}
            className="w-full py-3 rounded-xl bg-gradient-to-r from-[#FF9500] to-[#FF6B00] text-white font-bold flex items-center justify-center gap-2 shadow-[0_0_12px_rgba(255,149,0,0.2)] hover:shadow-[0_0_20px_rgba(255,149,0,0.4)] transition disabled:opacity-40">
            {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />} Save Pricing Config
          </button>
        </form>
      </div>
    </div>
  )
}

/* ══════════════════════════════════════════════════════════
   TAB 3: FETCH COUNTRIES
   ══════════════════════════════════════════════════════════ */
function FetchCountriesTab() {
  var [providers, setProviders] = useState([])
  var [selectedProvider, setSelectedProvider] = useState('')
  var [countries, setCountries] = useState([])
  var [loading, setLoading] = useState(false)
  var [importing, setImporting] = useState(false)
  var [selectedCodes, setSelectedCodes] = useState([])
  var [fetched, setFetched] = useState(false)
  var [info, setInfo] = useState(null)

  useEffect(function() {
    adminApi.get('/api/admin/provider/list').then(function(r) {
      setProviders(r.data)
      if (r.data.length > 0) setSelectedProvider(r.data[0].id)
    }).catch(function() {})
  }, [])

  var fetchCountries = async function() {
    setLoading(true)
    setFetched(false)
    try {
      var res = await adminApi.post('/api/admin/provider/fetch-countries', { provider: selectedProvider })
      setCountries(res.data.countries || [])
      setInfo(res.data)
      setFetched(true)
      setSelectedCodes([])
      toast.success('Found ' + res.data.total + ' countries (' + res.data.new_count + ' new)')
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to fetch countries')
    } finally {
      setLoading(false)
    }
  }

  var toggleSelect = function(code) { setSelectedCodes(function(prev) { return prev.includes(code) ? prev.filter(function(c) { return c !== code }) : [...prev, code] }) }
  var selectAllNew = function() { setSelectedCodes(countries.filter(function(c) { return !c.already_exists }).map(function(c) { return c.code })) }

  var handleImport = async function() {
    var toImport = countries.filter(function(c) { return selectedCodes.includes(c.code) })
    if (toImport.length === 0) return toast.error('Select at least one country')
    setImporting(true)
    try {
      var res = await adminApi.post('/api/admin/provider/import-countries', { countries: toImport })
      toast.success(res.data.message)
      fetchCountries()
    } catch (err) {
      toast.error(err.response?.data?.message || 'Import failed')
    } finally {
      setImporting(false)
    }
  }

  var cp = providers.find(function(p) { return p.id === selectedProvider })

  return (
    <div className="space-y-4">
      {providers.length === 0 ? (
        <NoProvidersWarning />
      ) : (
        <>
          <div className="flex items-center gap-3 flex-wrap">
            <ProviderSelect providers={providers} value={selectedProvider} onChange={function(v) { setSelectedProvider(v); setFetched(false); setCountries([]) }} />
            <button onClick={fetchCountries} disabled={loading || !cp?.is_configured}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#FF9500] to-[#FF6B00] text-white text-xs font-bold uppercase tracking-wider hover:opacity-90 transition disabled:opacity-40">
              {loading ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <CloudDownload className="w-3.5 h-3.5" />} Fetch Countries
            </button>
            {cp && !cp.is_configured && <CredWarning />}
          </div>

          {fetched && info && (
            <div className="flex items-center gap-4 p-3 rounded-xl bg-white/[0.02] border border-white/5 flex-wrap">
              <span className="text-[11px] text-white/50">Total: <b className="text-white">{info.total}</b></span>
              <span className="text-[11px] text-green-400">New: <b>{info.new_count}</b></span>
              <span className="text-[11px] text-white/30">In DB: <b>{info.total - info.new_count}</b></span>
              {info.exchange_rate && <span className="text-[10px] text-white/20">Rate: $1 = ₦{Number(info.exchange_rate).toLocaleString()}</span>}
              {info.markup_percent > 0 && <span className="text-[10px] text-[#FF9500]/60">+{info.markup_percent}% markup</span>}
              <div className="flex-1" />
              {countries.some(function(c) { return !c.already_exists }) && (
                <button onClick={selectAllNew} className="text-[10px] text-[#FF9500] hover:underline font-medium">Select all new</button>
              )}
            </div>
          )}

          {fetched && countries.length > 0 && (
            <div className="rounded-2xl border border-white/[0.06] bg-[rgba(15,20,60,0.5)] overflow-hidden">
              <div className="max-h-[400px] overflow-y-auto">
                {countries.map(function(country) {
                  return (
                    <div key={country.code}
                      className={'flex items-center gap-3 px-4 py-2.5 border-b border-white/[0.03] transition ' + (country.already_exists ? 'opacity-40' : 'hover:bg-white/[0.02]')}>
                      {!country.already_exists ? (
                        <button onClick={function() { toggleSelect(country.code) }} className="text-white/30 hover:text-white/60 transition">
                          {selectedCodes.includes(country.code) ? <CheckSquare className="w-4 h-4 text-[#FF9500]" /> : <Square className="w-4 h-4" />}
                        </button>
                      ) : <Check className="w-4 h-4 text-green-500/50" />}
                      <span className="text-base">{country.flag}</span>
                      <span className="text-xs text-white/80 flex-1">{country.name}</span>
                      <span className="text-[10px] text-white/30 font-mono">{country.code}</span>
                      <span className="text-[10px] text-white/30">{country.dial_code}</span>
                      <div className="text-right min-w-[100px]">
                        <span className="text-[10px] text-white/20 block">${country.price_usd?.toFixed(2)}</span>
                        <span className="text-[11px] text-[#FF9500] font-bold">{fmtNaira(country.price_ngn)}</span>
                      </div>
                      {country.already_exists && <span className="text-[9px] text-white/20 uppercase font-bold">Exists</span>}
                    </div>
                  )
                })}
              </div>
              {selectedCodes.length > 0 && (
                <div className="flex items-center justify-between px-4 py-3 border-t border-white/5 bg-[#FF9500]/[0.04]">
                  <span className="text-[11px] text-[#FF9500] font-bold">{selectedCodes.length} countries selected</span>
                  <button onClick={handleImport} disabled={importing}
                    className="flex items-center gap-1.5 px-4 py-2 rounded-lg bg-[#FF9500] text-white text-[10px] font-bold uppercase tracking-wider hover:bg-[#FF6B00] transition disabled:opacity-50">
                    {importing ? <Loader2 className="w-3 h-3 animate-spin" /> : <Download className="w-3 h-3" />} Import to Database
                  </button>
                </div>
              )}
            </div>
          )}
          {fetched && countries.length === 0 && <EmptyState text="No countries found from this provider." />}
        </>
      )}
    </div>
  )
}

/* ══════════════════════════════════════════════════════════
   TAB 4: FETCH NUMBERS
   ══════════════════════════════════════════════════════════ */
function FetchNumbersTab() {
  var [providers, setProviders] = useState([])
  var [selectedProvider, setSelectedProvider] = useState('')
  var [countryCode, setCountryCode] = useState('')
  var [limit, setLimit] = useState(10)
  var [numbers, setNumbers] = useState([])
  var [loading, setLoading] = useState(false)
  var [importing, setImporting] = useState(false)
  var [selectedNumbers, setSelectedNumbers] = useState([])
  var [sellPrice, setSellPrice] = useState('500')
  var [maxUses, setMaxUses] = useState('1')
  var [fetched, setFetched] = useState(false)
  var [dbCountries, setDbCountries] = useState([])
  var [pricingInfo, setPricingInfo] = useState(null)

  useEffect(function() {
    adminApi.get('/api/admin/provider/list').then(function(r) {
      setProviders(r.data)
      if (r.data.length > 0) setSelectedProvider(r.data[0].id)
    }).catch(function() {})
    adminApi.get('/api/admin/countries').then(function(r) { setDbCountries(r.data?.data || r.data || []) }).catch(function() {})
  }, [])

  var fetchNumbers = async function() {
    if (!countryCode) return toast.error('Select a country first')
    setLoading(true)
    setFetched(false)
    try {
      var res = await adminApi.post('/api/admin/provider/fetch-numbers', {
        provider: selectedProvider, country_code: countryCode, limit: limit,
      })
      setNumbers(res.data.numbers || [])
      setPricingInfo({ exchange_rate: res.data.exchange_rate, markup_percent: res.data.markup_percent })
      setFetched(true)
      setSelectedNumbers([])
      toast.success('Found ' + res.data.total + ' available numbers')
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to fetch numbers')
    } finally {
      setLoading(false)
    }
  }

  var toggleSelect = function(pn) { setSelectedNumbers(function(prev) { return prev.includes(pn) ? prev.filter(function(n) { return n !== pn }) : [...prev, pn] }) }
  var selectAllNew = function() { setSelectedNumbers(numbers.filter(function(n) { return !n.already_in_inventory }).map(function(n) { return n.phone_number })) }

  var handleImport = async function() {
    var toImport = numbers.filter(function(n) { return selectedNumbers.includes(n.phone_number) })
    if (toImport.length === 0) return toast.error('Select at least one number')
    if (!sellPrice || parseFloat(sellPrice) <= 0) return toast.error('Set a sell price in Naira')
    setImporting(true)
    try {
      var res = await adminApi.post('/api/admin/provider/import-numbers', {
        numbers: toImport.map(function(n) { return { phone_number: n.phone_number, country_code: countryCode, provider: selectedProvider, provider_sid: n.provider_sid || null, cost_price: n.cost_price || 0 } }),
        sell_price: parseFloat(sellPrice),
        max_uses: parseInt(maxUses) || 1,
      })
      toast.success(res.data.message)
      if (res.data.errors?.length) res.data.errors.slice(0, 3).forEach(function(e) { toast.error(e, { duration: 4000 }) })
      fetchNumbers()
    } catch (err) {
      toast.error(err.response?.data?.message || 'Import failed')
    } finally {
      setImporting(false)
    }
  }

  var cp = providers.find(function(p) { return p.id === selectedProvider })

  return (
    <div className="space-y-4">
      {providers.length === 0 ? (
        <NoProvidersWarning />
      ) : (
        <>
          <div className="flex items-center gap-3 flex-wrap">
            <ProviderSelect providers={providers} value={selectedProvider} onChange={function(v) { setSelectedProvider(v); setFetched(false); setNumbers([]) }} />
            <CountrySelect countries={dbCountries} value={countryCode} onChange={function(v) { setCountryCode(v); setFetched(false); setNumbers([]) }} />
            <div className="relative w-20">
              <input type="number" min="1" max="30" value={limit} onChange={function(e) { setLimit(parseInt(e.target.value) || 10) }}
                className="w-full bg-white/[0.04] border border-white/10 rounded-xl px-3 py-2.5 text-xs text-white focus:outline-none focus:border-[#FF9500]/40" placeholder="Limit" />
            </div>
            <button onClick={fetchNumbers} disabled={loading || !cp?.is_configured || !countryCode}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#FF9500] to-[#FF6B00] text-white text-xs font-bold uppercase tracking-wider hover:opacity-90 transition disabled:opacity-40">
              {loading ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Phone className="w-3.5 h-3.5" />} Fetch Numbers
            </button>
          </div>
          {cp && !cp.is_configured && <CredWarning />}

          {fetched && (
            <div className="flex items-center gap-4 p-3 rounded-xl bg-white/[0.02] border border-white/5 flex-wrap">
              <span className="text-[11px] text-white/50">Found: <b className="text-white">{numbers.length}</b></span>
              {pricingInfo?.exchange_rate && <span className="text-[10px] text-white/20">Rate: $1 = ₦{Number(pricingInfo.exchange_rate).toLocaleString()}</span>}
              {pricingInfo?.markup_percent > 0 && <span className="text-[10px] text-[#FF9500]/60">+{pricingInfo.markup_percent}% markup</span>}
              <div className="flex-1" />
              {numbers.some(function(n) { return !n.already_in_inventory }) && (
                <button onClick={selectAllNew} className="text-[10px] text-[#FF9500] hover:underline font-medium">Select all new</button>
              )}
            </div>
          )}

          {fetched && numbers.length > 0 && (
            <div className="rounded-2xl border border-white/[0.06] bg-[rgba(15,20,60,0.5)] overflow-hidden">
              <div className="max-h-[350px] overflow-y-auto">
                {numbers.map(function(num) {
                  return (
                    <div key={num.phone_number}
                      className={'flex items-center gap-3 px-4 py-2.5 border-b border-white/[0.03] transition ' + (num.already_in_inventory ? 'opacity-40' : 'hover:bg-white/[0.02]')}>
                      {!num.already_in_inventory ? (
                        <button onClick={function() { toggleSelect(num.phone_number) }} className="text-white/30 hover:text-white/60 transition">
                          {selectedNumbers.includes(num.phone_number) ? <CheckSquare className="w-4 h-4 text-[#FF9500]" /> : <Square className="w-4 h-4" />}
                        </button>
                      ) : <Check className="w-4 h-4 text-green-500/50" />}
                      <span className="text-xs font-mono text-white/90 flex-1">{num.phone_number}</span>
                      <span className="text-[10px] text-white/30 capitalize">{num.type}</span>
                      <div className="flex gap-1.5">
                        {num.capabilities?.sms && <span className="text-[8px] px-1.5 py-0.5 rounded bg-green-500/10 text-green-400 font-bold">SMS</span>}
                        {num.capabilities?.mms && <span className="text-[8px] px-1.5 py-0.5 rounded bg-blue-500/10 text-blue-400 font-bold">MMS</span>}
                        {num.capabilities?.voice && <span className="text-[8px] px-1.5 py-0.5 rounded bg-purple-500/10 text-purple-400 font-bold">VOICE</span>}
                      </div>
                      {num.region && <span className="text-[10px] text-white/20">{num.region}</span>}
                      {num.already_in_inventory && <span className="text-[9px] text-white/20 uppercase font-bold">In Inventory</span>}
                    </div>
                  )
                })}
              </div>
              {selectedNumbers.length > 0 && (
                <div className="px-4 py-3 border-t border-white/5 bg-[#FF9500]/[0.04]">
                  <div className="flex items-center gap-4 flex-wrap">
                    <span className="text-[11px] text-[#FF9500] font-bold">{selectedNumbers.length} numbers selected</span>
                    <div className="flex items-center gap-2">
                      <label className="text-[10px] text-white/30">Sell Price ₦</label>
                      <input type="number" step="1" min="0" value={sellPrice} onChange={function(e) { setSellPrice(e.target.value) }}
                        className="w-24 bg-white/[0.06] border border-white/10 rounded-lg px-2 py-1.5 text-[11px] text-white focus:outline-none focus:border-[#FF9500]/40" />
                    </div>
                    <div className="flex items-center gap-2">
                      <label className="text-[10px] text-white/30">Max Uses</label>
                      <input type="number" min="1" value={maxUses} onChange={function(e) { setMaxUses(e.target.value) }}
                        className="w-16 bg-white/[0.06] border border-white/10 rounded-lg px-2 py-1.5 text-[11px] text-white focus:outline-none focus:border-[#FF9500]/40" />
                    </div>
                    <div className="flex-1" />
                    <button onClick={handleImport} disabled={importing}
                      className="flex items-center gap-1.5 px-4 py-2 rounded-lg bg-[#FF9500] text-white text-[10px] font-bold uppercase tracking-wider hover:bg-[#FF6B00] transition disabled:opacity-50">
                      {importing ? <Loader2 className="w-3 h-3 animate-spin" /> : <Download className="w-3 h-3" />} Import to Inventory
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}
          {fetched && numbers.length === 0 && <EmptyState text="No available numbers found for this country." />}
        </>
      )}
    </div>
  )
}

/* ══════════════════════════════════════════════════════════
   TAB 5: FETCH PRICING
   ══════════════════════════════════════════════════════════ */
function FetchPricingTab() {
  var [providers, setProviders] = useState([])
  var [selectedProvider, setSelectedProvider] = useState('')
  var [countryCode, setCountryCode] = useState('')
  var [loading, setLoading] = useState(false)
  var [pricing, setPricing] = useState(null)
  var [dbCountries, setDbCountries] = useState([])

  useEffect(function() {
    adminApi.get('/api/admin/provider/list').then(function(r) {
      setProviders(r.data)
      if (r.data.length > 0) setSelectedProvider(r.data[0].id)
    }).catch(function() {})
    adminApi.get('/api/admin/countries').then(function(r) { setDbCountries(r.data?.data || r.data || []) }).catch(function() {})
  }, [])

  var fetchPricing = async function() {
    setLoading(true)
    try {
      var params = { provider: selectedProvider }
      if (countryCode) params.country_code = countryCode
      var res = await adminApi.post('/api/admin/provider/fetch-pricing', params)
      setPricing(res.data)
      toast.success('Pricing fetched')
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to fetch pricing')
    } finally {
      setLoading(false)
    }
  }

  var cp = providers.find(function(p) { return p.id === selectedProvider })

  return (
    <div className="space-y-4">
      {providers.length === 0 ? (
        <NoProvidersWarning />
      ) : (
        <>
          <div className="flex items-center gap-3 flex-wrap">
            <ProviderSelect providers={providers} value={selectedProvider} onChange={function(v) { setSelectedProvider(v); setPricing(null) }} />
            <CountrySelect countries={dbCountries} value={countryCode} onChange={function(v) { setCountryCode(v); setPricing(null) }} allowAll />
            <button onClick={fetchPricing} disabled={loading || !cp?.is_configured}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#FF9500] to-[#FF6B00] text-white text-xs font-bold uppercase tracking-wider hover:opacity-90 transition disabled:opacity-40">
              {loading ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <DollarSign className="w-3.5 h-3.5" />} Fetch Pricing
            </button>
          </div>
          {cp && !cp.is_configured && <CredWarning />}

          {pricing && (
            <div className="rounded-2xl border border-white/[0.06] bg-[rgba(15,20,60,0.5)] overflow-hidden">
              {pricing.prices ? (
                <div className="p-5 space-y-3">
                  <div className="flex items-center gap-3 mb-2">
                    <DollarSign className="w-5 h-5 text-[#FF9500]" />
                    <div>
                      <h4 className="text-sm font-bold text-white">{pricing.country}</h4>
                      <p className="text-[10px] text-white/30">
                        {pricing.country_code} — {pricing.provider} pricing
                        {pricing.exchange_rate ? (' — Rate: $1 = ₦' + Number(pricing.exchange_rate).toLocaleString()) : ''}
                        {pricing.markup_percent > 0 ? (' — +' + pricing.markup_percent + '% markup') : ''}
                      </p>
                    </div>
                  </div>
                  {pricing.prices.length > 0 ? (
                    <div className="space-y-2">
                      {pricing.prices.map(function(p, i) {
                        return (
                          <div key={i} className="flex items-center justify-between px-4 py-3 bg-white/[0.02] rounded-xl border border-white/5">
                            <div>
                              <span className="text-xs text-white/80 capitalize font-medium">{p.number_type || 'Phone Number'}</span>
                              {p.base_price_usd > 0 && <span className="text-[10px] text-white/20 ml-2">Base: ${p.base_price_usd?.toFixed(2)}</span>}
                            </div>
                            <div className="text-right">
                              <p className="text-[10px] text-white/25">${p.current_price_usd?.toFixed(2)}/mo</p>
                              <p className="text-sm font-bold text-[#FF9500]">{fmtNaira(p.current_price_ngn)}<span className="text-[9px] text-white/30 ml-1">/mo</span></p>
                            </div>
                          </div>
                        )
                      })}
                    </div>
                  ) : (
                    <p className="text-xs text-white/30 text-center py-5">No pricing details available for this country.</p>
                  )}
                </div>
              ) : pricing.countries ? (
                <div className="max-h-[400px] overflow-y-auto">
                  {pricing.countries.map(function(c, i) {
                    return (
                      <div key={i} className="flex items-center gap-3 px-4 py-2.5 border-b border-white/[0.03]">
                        <span className="text-xs text-white/80 flex-1">{c.country}</span>
                        <span className="text-[10px] text-white/30 font-mono">{c.country_code}</span>
                      </div>
                    )
                  })}
                </div>
              ) : <EmptyState text="No pricing data available." />}
            </div>
          )}
        </>
      )}
    </div>
  )
}

/* ── Shared Components ── */

function ProviderSelect({ providers, value, onChange }) {
  return (
    <div className="relative min-w-[150px]">
      <select value={value} onChange={function(e) { onChange(e.target.value) }}
        className="w-full appearance-none bg-white/[0.04] border border-white/10 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-[#FF9500]/40 pr-8">
        {providers.map(function(p) {
          return <option key={p.id} value={p.id} className="bg-[#0F1440]">{p.name} {p.is_configured ? '\u2713' : '\u2717'}</option>
        })}
      </select>
      <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-3 h-3 text-white/30 pointer-events-none" />
    </div>
  )
}

function CountrySelect({ countries, value, onChange, allowAll }) {
  return (
    <div className="relative min-w-[180px]">
      <select value={value} onChange={function(e) { onChange(e.target.value) }}
        className="w-full appearance-none bg-white/[0.04] border border-white/10 rounded-xl px-3 py-2.5 text-xs text-white focus:outline-none focus:border-[#FF9500]/40 pr-8">
        <option value="" className="bg-[#0F1440]">{allowAll ? 'All Countries (overview)' : 'Select Country'}</option>
        {countries.map(function(c) {
          return <option key={c.id || c.code} value={c.code || c.twilio_code} className="bg-[#0F1440]">{c.flag} {c.name}</option>
        })}
      </select>
      <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-3 h-3 text-white/30 pointer-events-none" />
    </div>
  )
}

function CredWarning() {
  return (
    <span className="flex items-center gap-1.5 text-[10px] text-yellow-400">
      <AlertTriangle className="w-3.5 h-3.5" /> Configure credentials in the Providers tab first
    </span>
  )
}

function NoProvidersWarning() {
  return (
    <div className="text-center py-16 text-white/20">
      <Shield className="w-10 h-10 mx-auto mb-3" />
      <p className="text-sm font-medium">No providers configured</p>
      <p className="text-xs mt-1">Go to the <span className="text-[#FF9500]">Providers</span> tab first to add an API provider.</p>
    </div>
  )
}

function EmptyState({ text }) {
  return <div className="text-center py-10 text-white/20 text-sm">{text}</div>
}

/* ══════════════════════════════════════════════════════════
   TAB 6: SMART ROUTING
   ══════════════════════════════════════════════════════════ */
function RoutingTab() {
  var [config, setConfig] = useState(null)
  var [loading, setLoading] = useState(true)
  var [saving, setSaving] = useState(false)
  var [routingMode, setRoutingMode] = useState('priority')

  var load = useCallback(function() {
    setLoading(true)
    adminApi.get('/api/admin/routing')
      .then(function(r) {
        setConfig(r.data)
        setRoutingMode(r.data.routing_mode || 'priority')
      })
      .catch(function() { toast.error('Failed to load routing config') })
      .finally(function() { setLoading(false) })
  }, [])

  useEffect(function() { load() }, [load])

  var handleSaveMode = async function() {
    setSaving(true)
    try {
      var r = await adminApi.put('/api/admin/routing', { routing_mode: routingMode })
      toast.success(r.data.message)
    } catch (err) { toast.error(err.response?.data?.message || 'Failed to save') }
    finally { setSaving(false) }
  }

  var handleResetMetrics = async function(provider) {
    if (!confirm('Reset routing metrics for "' + provider.name + '"? This will clear success rate, response time & request counts.')) return
    try {
      var r = await adminApi.post('/api/admin/providers/' + provider.id + '/reset-metrics')
      toast.success(r.data.message)
      load()
    } catch (err) { toast.error('Failed to reset metrics') }
  }

  var handlePriorityChange = async function(providerId, newPriority) {
    var p = parseInt(newPriority)
    if (isNaN(p) || p < 1) return
    try {
      await adminApi.put('/api/admin/providers/' + providerId, { priority: p })
      toast.success('Priority updated')
      load()
    } catch (err) { toast.error('Failed to update priority') }
  }

  var handleCostMultiplierChange = async function(providerId, newMultiplier) {
    var m = parseFloat(newMultiplier)
    if (isNaN(m) || m < 0.01) return
    try {
      await adminApi.put('/api/admin/providers/' + providerId, { cost_multiplier: m })
      toast.success('Cost multiplier updated')
      load()
    } catch (err) { toast.error('Failed to update cost multiplier') }
  }

  if (loading) return <div className="flex items-center justify-center py-20"><Loader2 className="w-6 h-6 text-[#FF9500] animate-spin" /></div>

  if (!config || !config.providers || config.providers.length === 0) {
    return <NoProvidersWarning />
  }

  var modes = [
    { value: 'priority', label: 'Priority', desc: 'Route to providers in strict priority order (lower number = tried first). Simple and predictable.' },
    { value: 'cheapest', label: 'Cheapest First', desc: 'Route to the provider with the lowest cost multiplier first, then fall back by priority.' },
    { value: 'smart', label: 'Smart (Dynamic)', desc: 'Weighted score based on success rate (60%), cost (20%), and priority (20%). Adapts automatically.' },
  ]

  return (
    <div className="space-y-6">
      {/* Routing Mode Selector */}
      <div className="rounded-2xl border border-[rgba(255,149,0,0.15)] bg-[rgba(15,20,60,0.5)] backdrop-blur-xl p-6">
        <div className="flex items-center gap-2 mb-4">
          <Activity className="w-4 h-4 text-[#FF9500]" />
          <h3 className="text-sm font-bold text-white">Routing Strategy</h3>
        </div>
        <p className="text-xs text-white/30 mb-5">
          Choose how the system selects which provider to use when a user orders a number.
          All providers are tried in order — if one fails, the next one is used automatically (failover).
        </p>
        <div className="space-y-3">
          {modes.map(function(mode) {
            return (
              <label key={mode.value}
                className={'flex items-start gap-3 p-4 rounded-xl border cursor-pointer transition-all ' +
                  (routingMode === mode.value
                    ? 'border-[#FF9500]/30 bg-[#FF9500]/[0.06]'
                    : 'border-white/5 bg-white/[0.02] hover:border-white/10')}>
                <input type="radio" name="routing_mode" value={mode.value}
                  checked={routingMode === mode.value}
                  onChange={function() { setRoutingMode(mode.value) }}
                  className="mt-0.5 accent-[#FF9500]" />
                <div>
                  <p className={'text-sm font-bold ' + (routingMode === mode.value ? 'text-[#FF9500]' : 'text-white')}>{mode.label}</p>
                  <p className="text-[11px] text-white/30 mt-0.5">{mode.desc}</p>
                </div>
              </label>
            )
          })}
        </div>
        <button onClick={handleSaveMode} disabled={saving || routingMode === config.routing_mode}
          className="mt-4 w-full py-3 rounded-xl bg-gradient-to-r from-[#FF9500] to-[#FF6B00] text-white font-bold flex items-center justify-center gap-2 shadow-[0_0_12px_rgba(255,149,0,0.2)] hover:shadow-[0_0_20px_rgba(255,149,0,0.4)] transition disabled:opacity-40">
          {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />} Save Routing Mode
        </button>
      </div>

      {/* Provider Priority & Stats Table */}
      <div className="rounded-2xl border border-[rgba(255,149,0,0.15)] bg-[rgba(15,20,60,0.5)] backdrop-blur-xl p-6">
        <div className="flex items-center gap-2 mb-4">
          <ArrowUpDown className="w-4 h-4 text-[#FF9500]" />
          <h3 className="text-sm font-bold text-white">Provider Priority & Performance</h3>
        </div>
        <p className="text-xs text-white/30 mb-5">
          Lower priority number = tried first. Adjust priority and cost multiplier per provider.
          Stats update in real-time as orders are placed.
        </p>

        <div className="overflow-x-auto">
          <table className="w-full text-xs">
            <thead>
              <tr className="border-b border-white/5">
                <th className="text-left py-2 px-3 text-white/30 font-medium uppercase tracking-wider text-[10px]">Provider</th>
                <th className="text-center py-2 px-2 text-white/30 font-medium uppercase tracking-wider text-[10px]">Priority</th>
                <th className="text-center py-2 px-2 text-white/30 font-medium uppercase tracking-wider text-[10px]">Cost ×</th>
                <th className="text-center py-2 px-2 text-white/30 font-medium uppercase tracking-wider text-[10px]">Success</th>
                <th className="text-center py-2 px-2 text-white/30 font-medium uppercase tracking-wider text-[10px]">Avg MS</th>
                <th className="text-center py-2 px-2 text-white/30 font-medium uppercase tracking-wider text-[10px]">Requests</th>
                <th className="text-center py-2 px-2 text-white/30 font-medium uppercase tracking-wider text-[10px]">OK / Fail</th>
                <th className="text-center py-2 px-2 text-white/30 font-medium uppercase tracking-wider text-[10px]">Actions</th>
              </tr>
            </thead>
            <tbody>
              {config.providers.map(function(p) {
                return (
                  <tr key={p.id} className="border-b border-white/[0.03] hover:bg-white/[0.02] transition">
                    <td className="py-3 px-3">
                      <div className="flex items-center gap-2">
                        <div className="w-7 h-7 rounded-lg bg-[#FF9500]/10 flex items-center justify-center text-[10px] font-bold text-[#FF9500]">
                          {p.type === 'twilio' ? 'TW' : p.type === '5sim' ? '5S' : p.type === 'smspool' ? 'SP' : p.type.slice(0, 2).toUpperCase()}
                        </div>
                        <div>
                          <p className="text-white font-medium">{p.name}</p>
                          <p className="text-[9px] text-white/20 font-mono">{p.slug}</p>
                        </div>
                      </div>
                    </td>
                    <td className="text-center py-3 px-2">
                      <input type="number" min="1" max="999"
                        defaultValue={p.priority}
                        onBlur={function(e) { if (e.target.value !== String(p.priority)) handlePriorityChange(p.id, e.target.value) }}
                        onKeyDown={function(e) { if (e.key === 'Enter') e.target.blur() }}
                        className="w-14 text-center bg-white/[0.05] border border-white/10 rounded-lg px-2 py-1.5 text-xs text-white focus:outline-none focus:border-[#FF9500]/40 font-mono" />
                    </td>
                    <td className="text-center py-3 px-2">
                      <input type="number" min="0.01" max="99.99" step="0.01"
                        defaultValue={p.cost_multiplier}
                        onBlur={function(e) { if (e.target.value !== String(p.cost_multiplier)) handleCostMultiplierChange(p.id, e.target.value) }}
                        onKeyDown={function(e) { if (e.key === 'Enter') e.target.blur() }}
                        className="w-16 text-center bg-white/[0.05] border border-white/10 rounded-lg px-2 py-1.5 text-xs text-white focus:outline-none focus:border-[#FF9500]/40 font-mono" />
                    </td>
                    <td className="text-center py-3 px-2">
                      <span className={'font-bold ' + (p.success_rate >= 90 ? 'text-green-400' : p.success_rate >= 70 ? 'text-yellow-400' : 'text-red-400')}>
                        {p.success_rate}%
                      </span>
                    </td>
                    <td className="text-center py-3 px-2">
                      <span className="text-white/50 font-mono">{p.avg_response_ms}<span className="text-white/20">ms</span></span>
                    </td>
                    <td className="text-center py-3 px-2">
                      <span className="text-white/50 font-mono">{p.total_requests}</span>
                    </td>
                    <td className="text-center py-3 px-2">
                      <span className="text-green-400 font-mono">{p.total_successes}</span>
                      <span className="text-white/15 mx-1">/</span>
                      <span className="text-red-400 font-mono">{p.total_failures}</span>
                    </td>
                    <td className="text-center py-3 px-2">
                      <button onClick={function() { handleResetMetrics(p) }}
                        title="Reset metrics"
                        className="p-1.5 rounded-lg hover:bg-white/[0.06] text-white/25 hover:text-yellow-400 transition">
                        <RotateCcw className="w-3.5 h-3.5" />
                      </button>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* How It Works */}
      <div className="rounded-2xl border border-white/5 bg-[rgba(15,20,60,0.3)] backdrop-blur-xl p-6">
        <div className="flex items-center gap-2 mb-3">
          <BarChart3 className="w-4 h-4 text-white/40" />
          <h3 className="text-sm font-bold text-white/40">How Smart Routing Works</h3>
        </div>
        <div className="space-y-2 text-[11px] text-white/25 leading-relaxed">
          <p>1. When a user orders a number, the system first checks the <span className="text-white/40">internal number pool</span> (pre-fetched numbers).</p>
          <p>2. If no pool numbers are available, it tries <span className="text-white/40">active API providers</span> in the order determined by the routing strategy.</p>
          <p>3. If a provider fails (e.g. no numbers available, API error), the system <span className="text-[#FF9500]/60">automatically fails over</span> to the next provider.</p>
          <p>4. Success rate, response time, and request counts are tracked per provider and update in real-time.</p>
          <p>5. Users <span className="text-white/40">never see which provider</span> was used — they only see the phone number and OTP.</p>
        </div>
      </div>
    </div>
  )
}

/* ══════════════════════════════════════════════════════════
   MAIN EXPORT — TABBED LAYOUT
   ══════════════════════════════════════════════════════════ */
/* ══════════════════════════════════════════════════════════
   TAB 7: FETCH SERVICES (from 5sim API)
   ══════════════════════════════════════════════════════════ */
function FetchServicesTab() {
  var [providers, setProviders] = useState([])
  var [selectedProvider, setSelectedProvider] = useState('')
  var [services, setServices] = useState([])
  var [selected, setSelected] = useState([])
  var [loading, setLoading] = useState(false)
  var [importing, setImporting] = useState(false)
  var [fetched, setFetched] = useState(false)
  var [search, setSearch] = useState('')

  useEffect(function() {
    adminApi.get('/api/admin/provider/list').then(function(r) {
      setProviders(r.data)
      if (r.data.length > 0) setSelectedProvider(r.data[0].id)
    }).catch(function() {})
  }, [])

  var fetchServices = async function () {
    setLoading(true)
    setFetched(false)
    try {
      var r = await adminApi.post('/api/admin/provider/fetch-services', { provider: selectedProvider })
      setServices(r.data.services || [])
      setSelected([])
      setFetched(true)
      var svcs = r.data.services || []
      var newCount = svcs.filter(function (s) { return !s.already_exists }).length
      toast.success('Found ' + svcs.length + ' services (' + newCount + ' new)')
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to fetch services')
    } finally { setLoading(false) }
  }

  var toggleSelect = function (i) {
    setSelected(function (prev) { return prev.includes(i) ? prev.filter(function (x) { return x !== i }) : [...prev, i] })
  }
  var selectAllNew = function () {
    setSelected(services.map(function (s, i) { return !s.already_exists ? i : null }).filter(function (i) { return i !== null }))
  }

  var handleImport = async function () {
    var toImport = services.filter(function (_, i) { return selected.includes(i) })
    if (toImport.length === 0) return toast.error('Select at least one service')
    setImporting(true)
    try {
      var r = await adminApi.post('/api/admin/provider/import-services', { services: toImport })
      toast.success(r.data.message)
      fetchServices()
    } catch (err) {
      toast.error(err.response?.data?.message || 'Import failed')
    } finally { setImporting(false) }
  }

  var filtered = services.filter(function (s) {
    return !search || s.name.toLowerCase().includes(search.toLowerCase())
  })

  var cp = providers.find(function(p) { return p.id === selectedProvider })

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-3 flex-wrap">
        {providers.length > 0 && (
          <ProviderSelect providers={providers} value={selectedProvider} onChange={function(v) { setSelectedProvider(v); setFetched(false); setServices([]) }} />
        )}
        <button onClick={fetchServices} disabled={loading || !cp?.is_configured}
          className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#FF9500] to-[#FF6B00] text-white text-xs font-bold uppercase tracking-wider hover:opacity-90 transition disabled:opacity-40">
          {loading ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <CloudDownload className="w-3.5 h-3.5" />} Fetch Services
        </button>
        <p className="text-xs text-white/30">Pull all available services/products from the selected provider API and import them into your database.</p>
        {cp && !cp.is_configured && <CredWarning />}
      </div>

      {fetched && (
        <>
          <div className="flex items-center gap-4 p-3 rounded-xl bg-white/[0.02] border border-white/5 flex-wrap">
            <span className="text-[11px] text-white/50">Total: <b className="text-white">{services.length}</b></span>
            <span className="text-[11px] text-green-400">New: <b>{services.filter(function (s) { return !s.already_exists }).length}</b></span>
            <span className="text-[11px] text-white/30">In DB: <b>{services.filter(function (s) { return s.already_exists }).length}</b></span>
            <div className="flex-1" />
            <input type="text" placeholder="Search services…" value={search} onChange={function (e) { setSearch(e.target.value) }}
              className="px-3 py-1.5 rounded-lg bg-white/[0.05] border border-white/10 text-xs text-white placeholder-white/20 focus:outline-none focus:border-[#FF9500]/40 w-48" />
            {services.some(function (s) { return !s.already_exists }) && (
              <button onClick={selectAllNew} className="text-[10px] text-[#FF9500] hover:underline font-medium">Select all new</button>
            )}
          </div>

          {filtered.length > 0 && (
            <div className="rounded-2xl border border-white/[0.06] bg-[rgba(15,20,60,0.5)] overflow-hidden">
              <div className="max-h-[450px] overflow-y-auto">
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-0">
                  {filtered.map(function (svc) {
                    var idx = services.indexOf(svc)
                    var isSel = selected.includes(idx)
                    return (
                      <div key={idx}
                        onClick={function () { if (!svc.already_exists) toggleSelect(idx) }}
                        className={'flex items-center gap-2 px-3 py-2.5 border-b border-r border-white/[0.03] cursor-pointer transition ' +
                          (svc.already_exists ? 'opacity-30 cursor-default' : isSel ? 'bg-[#FF9500]/[0.08]' : 'hover:bg-white/[0.02]')}>
                        {!svc.already_exists ? (
                          isSel ? <CheckSquare className="w-3.5 h-3.5 text-[#FF9500] flex-shrink-0" /> : <Square className="w-3.5 h-3.5 text-white/20 flex-shrink-0" />
                        ) : <Check className="w-3.5 h-3.5 text-green-500/50 flex-shrink-0" />}
                        <ServiceIconWithFallback icon={svc.icon} name={svc.name} color={svc.color} size="sm" />
                        <span className="text-[11px] text-white/70 truncate">{svc.name}</span>
                      </div>
                    )
                  })}
                </div>
              </div>
              {selected.length > 0 && (
                <div className="flex items-center justify-between px-4 py-3 border-t border-white/5 bg-[#FF9500]/[0.04]">
                  <span className="text-[11px] text-[#FF9500] font-bold">{selected.length} services selected</span>
                  <button onClick={handleImport} disabled={importing}
                    className="flex items-center gap-1.5 px-4 py-2 rounded-lg bg-[#FF9500] text-white text-[10px] font-bold uppercase tracking-wider hover:bg-[#FF6B00] transition disabled:opacity-50">
                    {importing ? <Loader2 className="w-3 h-3 animate-spin" /> : <Download className="w-3 h-3" />} Import to Database
                  </button>
                </div>
              )}
            </div>
          )}
          {fetched && filtered.length === 0 && <EmptyState text="No services match your search." />}
        </>
      )}
    </div>
  )
}

var TABS = [
  { id: 'providers', label: 'Providers', icon: Shield },
  { id: 'routing', label: 'Routing', icon: Activity },
  { id: 'pricing-config', label: 'Pricing & Markup', icon: Percent },
  { id: 'fetch-countries', label: 'Fetch Countries', icon: Globe },
  { id: 'fetch-numbers', label: 'Fetch Numbers', icon: Phone },
  { id: 'fetch-pricing', label: 'Fetch Pricing', icon: DollarSign },
  { id: 'fetch-services', label: 'Fetch Services', icon: Settings },
]

export default function ApiSettingsSection() {
  var [activeTab, setActiveTab] = useState('providers')

  return (
    <div className="max-w-4xl space-y-6">
      <div className="flex items-center gap-3">
        <Zap className="w-5 h-5 text-[#FF9500]" />
        <h2 className="text-lg font-bold text-white">API Providers</h2>
      </div>
      <div className="flex gap-1 p-1 bg-white/[0.03] rounded-xl border border-white/5 overflow-x-auto">
        {TABS.map(function(tab) {
          var TabIcon = tab.icon
          return (
            <button key={tab.id} onClick={function() { setActiveTab(tab.id) }}
              className={'flex items-center gap-2 px-3 py-2.5 rounded-lg text-xs font-medium transition-all flex-1 justify-center whitespace-nowrap ' + (activeTab === tab.id ? 'bg-[#FF9500]/15 text-[#FF9500] shadow-sm' : 'text-white/40 hover:text-white/60 hover:bg-white/[0.03]')}>
              <TabIcon className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">{tab.label}</span>
            </button>
          )
        })}
      </div>
      {activeTab === 'providers' && <ProvidersTab />}
      {activeTab === 'routing' && <RoutingTab />}
      {activeTab === 'pricing-config' && <PricingConfigTab />}
      {activeTab === 'fetch-countries' && <FetchCountriesTab />}
      {activeTab === 'fetch-numbers' && <FetchNumbersTab />}
      {activeTab === 'fetch-pricing' && <FetchPricingTab />}
      {activeTab === 'fetch-services' && <FetchServicesTab />}
    </div>
  )
}
