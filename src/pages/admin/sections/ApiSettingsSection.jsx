import { useState, useEffect } from 'react'
import { Settings, Save, Loader2, Eye, EyeOff, CheckCircle } from 'lucide-react'
import adminApi from '../../../lib/adminAxios'
import toast from 'react-hot-toast'

const FIELDS = [
    { key: 'twilio_account_sid', label: 'Twilio Account SID', placeholder: 'ACxxxxxxxx' },
    { key: 'twilio_auth_token', label: 'Twilio Auth Token', placeholder: 'Your auth token' },
    { key: 'twilio_phone_number', label: 'Twilio Phone Number', placeholder: '+1234567890' },
    { key: 'twilio_webhook_secret', label: 'Twilio Webhook Secret', placeholder: 'whsec_xxxxx' },
]

export default function ApiSettingsSection() {
    const [settings, setSettings] = useState({})
    const [form, setForm] = useState({})
    const [loading, setLoading] = useState(true)
    const [saving, setSaving] = useState(false)
    const [showValues, setShowValues] = useState({})

    useEffect(() => {
        adminApi.get('/api/admin/settings')
            .then(r => { setSettings(r.data); setForm({}) })
            .catch(() => toast.error('Failed to load settings'))
            .finally(() => setLoading(false))
    }, [])

    const handleSave = async (e) => {
        e.preventDefault()
        const nonEmpty = Object.fromEntries(Object.entries(form).filter(([, v]) => v))
        if (Object.keys(nonEmpty).length === 0) return toast.error('Nothing to update')
        setSaving(true)
        try {
            const r = await adminApi.put('/api/admin/settings', nonEmpty)
            toast.success(r.data.message)
            // Refresh
            const res = await adminApi.get('/api/admin/settings')
            setSettings(res.data)
            setForm({})
        } catch (err) { toast.error(err.response?.data?.message || 'Failed') }
        finally { setSaving(false) }
    }

    if (loading) {
        return <div className="flex items-center justify-center py-20"><Loader2 className="w-6 h-6 text-[#FF9500] animate-spin" /></div>
    }

    return (
        <div className="max-w-2xl space-y-6">
            <div className="flex items-center gap-3">
                <Settings className="w-5 h-5 text-[#FF9500]" />
                <h2 className="text-lg font-bold text-white">API Configuration</h2>
            </div>

            <div className="rounded-2xl border border-[rgba(255,149,0,0.15)] bg-[rgba(15,20,60,0.5)] backdrop-blur-xl p-6">
                <p className="text-sm text-white/40 mb-6">Enter your Twilio credentials below. Values are stored securely. Leave a field empty to keep its current value.</p>

                <form onSubmit={handleSave} className="space-y-5">
                    {FIELDS.map(field => (
                        <div key={field.key}>
                            <label className="text-xs text-white/50 font-medium mb-1.5 flex items-center gap-2 block">
                                {field.label}
                                {settings[field.key]?.is_set && (
                                    <span className="inline-flex items-center gap-1 text-green-400 text-[10px]"><CheckCircle className="w-3 h-3" /> Set</span>
                                )}
                            </label>
                            <div className="relative">
                                <input
                                    type={showValues[field.key] ? 'text' : 'password'}
                                    placeholder={settings[field.key]?.is_set ? settings[field.key].value : field.placeholder}
                                    value={form[field.key] || ''}
                                    onChange={e => setForm(f => ({ ...f, [field.key]: e.target.value }))}
                                    className="w-full px-4 py-3 pr-10 rounded-xl bg-white/[0.05] border border-white/10 text-sm text-white placeholder-white/20 focus:outline-none focus:border-[rgba(255,149,0,0.4)] transition font-mono"
                                />
                                <button type="button" onClick={() => setShowValues(v => ({ ...v, [field.key]: !v[field.key] }))}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-white/25 hover:text-white/50 transition">
                                    {showValues[field.key] ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                </button>
                            </div>
                        </div>
                    ))}

                    <button type="submit" disabled={saving}
                        className="w-full py-3 rounded-xl bg-gradient-to-r from-[#FF9500] to-[#FF6B00] text-white font-bold flex items-center justify-center gap-2 shadow-[0_0_12px_rgba(255,149,0,0.2)] hover:shadow-[0_0_20px_rgba(255,149,0,0.4)] transition disabled:opacity-40">
                        {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />} Save Settings
                    </button>
                </form>
            </div>
        </div>
    )
}
