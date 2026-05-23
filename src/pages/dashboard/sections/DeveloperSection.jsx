import { useState, useEffect } from 'react'
import {
    Code, Key, Copy, Check, Eye, EyeOff, RefreshCw, Trash2,
    Terminal, BookOpen, Activity, CheckCircle, Clock, Server,
    ChevronDown, ChevronUp, AlertCircle
} from 'lucide-react'
import api from '../../../lib/axios'
import toast from 'react-hot-toast'

export default function DeveloperSection() {
    const [apiKey, setApiKey] = useState(null)
    const [loading, setLoading] = useState(true)
    const [actionLoading, setActionLoading] = useState(false)
    const [showKey, setShowKey] = useState(false)
    const [copied, setCopied] = useState(false)
    const [activeTab, setActiveTab] = useState('curl')
    const [activeEndpoint, setActiveEndpoint] = useState('profile')
    const [openDocsSection, setOpenDocsSection] = useState('getting-started')

    const apiBaseUrl = window.location.origin + '/api'

    useEffect(() => {
        fetchApiKey()
    }, [])

    const fetchApiKey = async () => {
        try {
            const res = await api.get('/api/user/api-key')
            setApiKey(res.data.api_key)
        } catch (err) {
            console.error('Failed to fetch API key', err)
            toast.error('Failed to fetch API Key')
        } finally {
            setLoading(false)
        }
    }

    const generateKey = async () => {
        const confirmMsg = apiKey 
            ? 'Regenerating will IMMEDIATELY deactivate your current API key. Any software using it will stop working. Do you want to continue?'
            : 'Are you sure you want to generate a new Developer API Key?'
            
        if (!window.confirm(confirmMsg)) return

        setActionLoading(true)
        try {
            const res = await api.post('/api/user/api-key/generate')
            setApiKey(res.data.api_key)
            toast.success(apiKey ? 'API Key regenerated successfully!' : 'API Key generated successfully!')
            setShowKey(true)
        } catch (err) {
            console.error('Failed to generate key', err)
            toast.error('Failed to generate API Key')
        } finally {
            setActionLoading(false)
        }
    }

    const revokeKey = async () => {
        if (!window.confirm('Are you sure you want to revoke your API key? This will immediately deactivate it, and all connected scripts will fail.')) {
            return
        }

        setActionLoading(true)
        try {
            await api.delete('/api/user/api-key/revoke')
            setApiKey(null)
            toast.success('API Key revoked successfully')
            setShowKey(false)
        } catch (err) {
            console.error('Failed to revoke key', err)
            toast.error('Failed to revoke API Key')
        } finally {
            setActionLoading(false)
        }
    }

    const copyToClipboard = () => {
        if (apiKey) {
            navigator.clipboard.writeText(apiKey)
            setCopied(true)
            toast.success('API key copied to clipboard!')
            setTimeout(() => setCopied(false), 2000)
        }
    }

    const displayedKey = apiKey 
        ? (showKey ? apiKey : '••••••••••••••••••••••••••••••••••••••••••••••••••••••••') 
        : 'No API Key Generated'

    // Endpoint information configuration
    const endpoints = {
        profile: {
            title: 'Get User Profile / Balance',
            method: 'GET',
            path: '/v1/user/profile',
            desc: 'Retrieves current account profile details, total wallet balance, and user rating.',
            params: [],
            response: `{
  "email": "user@example.com",
  "balance": 1250.00,
  "rating": 5
}`
        },
        buy: {
            title: 'Buy / Order Number',
            method: 'GET',
            path: '/v1/user/buy/activation/{country}/{operator}/{product}',
            desc: 'Requests a new phone number to receive SMS OTP verifications for a specific service.',
            params: [
                { name: 'country', type: 'string', required: true, desc: 'Country name or ISO code. Fuzzy matching ensures "nigeria", "Nigeria", or "ng" work perfectly.' },
                { name: 'operator', type: 'string', required: true, desc: 'Mobile carrier to provision (e.g. "mtn", "glo", "any" to select automatically).' },
                { name: 'product', type: 'string', required: true, desc: 'The service slug representing the application (e.g., "whatsapp", "telegram", "google").' }
            ],
            response: `{
  "id": 14205,
  "phone": "2348109876543",
  "operator": "mtn",
  "product": "whatsapp",
  "price": 150.00,
  "status": "RECEIVED",
  "expires": "2026-05-22T16:55:00.000000Z",
  "sms": null,
  "created_at": "2026-05-22T16:35:00.000000Z",
  "country": "nigeria"
}`
        },
        check: {
            title: 'Check OTP Status',
            method: 'GET',
            path: '/v1/user/check/{id}',
            desc: 'Polls the status of a provisioned activation order to check if the SMS OTP code has arrived.',
            params: [
                { name: 'id', type: 'integer', required: true, desc: 'The unique ID of the activation order returned during purchase.' }
            ],
            response: `// Note: Response structure shifts from "RECEIVED" to "FINISHED" when OTP arrives
{
  "id": 14205,
  "phone": "2348109876543",
  "operator": "mtn",
  "product": "whatsapp",
  "price": 150.00,
  "status": "FINISHED",
  "expires": "2026-05-22T16:55:00.000000Z",
  "sms": [
    {
      "created_at": "2026-05-22T16:38:12.000000Z",
      "date": "2026-05-22T16:38:12.000000Z",
      "sender": "WhatsApp",
      "text": "Your WhatsApp verification code is 482-192",
      "code": "482192"
    }
  ],
  "created_at": "2026-05-22T16:35:00.000000Z",
  "country": "nigeria"
}`
        },
        finish: {
            title: 'Finish / Close Order',
            method: 'GET',
            path: '/v1/user/finish/{id}',
            desc: 'Completes the order and marks the transaction as closed. Call this after your script successfully reads the OTP code.',
            params: [
                { name: 'id', type: 'integer', required: true, desc: 'The unique ID of the activation order.' }
            ],
            response: `{
  "id": 14205,
  "phone": "2348109876543",
  "operator": "mtn",
  "product": "whatsapp",
  "price": 150.00,
  "status": "FINISHED",
  "expires": "2026-05-22T16:55:00.000000Z",
  "sms": [...],
  "created_at": "2026-05-22T16:35:00.000000Z",
  "country": "nigeria"
}`
        },
        cancel: {
            title: 'Cancel Order & Refund',
            method: 'GET',
            path: '/v1/user/cancel/{id}',
            desc: 'Cancels a pending order, releases the phone number, and immediately refunds the purchase price back to the user wallet. Only works if no OTP was received.',
            params: [
                { name: 'id', type: 'integer', required: true, desc: 'The unique ID of the activation order.' }
            ],
            response: `{
  "id": 14205,
  "phone": "2348109876543",
  "operator": "mtn",
  "product": "whatsapp",
  "price": 150.00,
  "status": "CANCELED",
  "expires": "2026-05-22T16:55:00.000000Z",
  "sms": null,
  "created_at": "2026-05-22T16:35:00.000000Z",
  "country": "nigeria"
}`
        },
        ban: {
            title: 'Report Banned / Blocked Number',
            method: 'GET',
            path: '/v1/user/ban/{id}',
            desc: 'Reports a phone number as banned by the target application (e.g. WhatsApp says "This number is blocked"). Cancels the order, releases the number, and refunds the user wallet.',
            params: [
                { name: 'id', type: 'integer', required: true, desc: 'The unique ID of the activation order.' }
            ],
            response: `{
  "id": 14205,
  "phone": "2348109876543",
  "operator": "mtn",
  "product": "whatsapp",
  "price": 150.00,
  "status": "CANCELED",
  "expires": "2026-05-22T16:55:00.000000Z",
  "sms": null,
  "created_at": "2026-05-22T16:35:00.000000Z",
  "country": "nigeria"
}`
        }
    }

    const currentEndpoint = endpoints[activeEndpoint]

    // Code snippets generator dynamically embedding actual user key
    const getCodeSnippet = (lang, endpoint) => {
        const token = apiKey || 'YOUR_API_KEY'
        const fullUrl = `${apiBaseUrl}${endpoint.path}`
        
        // Mock query placeholder substitutions for buy and checking
        let formattedUrl = fullUrl
        if (activeEndpoint === 'buy') {
            formattedUrl = formattedUrl.replace('{country}', 'nigeria').replace('{operator}', 'any').replace('{product}', 'whatsapp')
        } else if (activeEndpoint === 'check' || activeEndpoint === 'finish' || activeEndpoint === 'cancel' || activeEndpoint === 'ban') {
            formattedUrl = formattedUrl.replace('{id}', '14205')
        }

        switch (lang) {
            case 'curl':
                return `curl -X GET "${formattedUrl}" \\\n  -H "Authorization: Bearer ${token}" \\\n  -H "Accept: application/json"`
            case 'javascript':
                return `// Using standard Fetch API
fetch('${formattedUrl}', {
  method: 'GET',
  headers: {
    'Authorization': 'Bearer ${token}',
    'Accept': 'application/json'
  }
})
.then(response => response.json())
.then(data => console.log(data))
.catch(error => console.error('Error:', error));`
            case 'python':
                return `import requests

url = "${formattedUrl}"
headers = {
    "Authorization": "Bearer ${token}",
    "Accept": "application/json"
}

response = requests.get(url, headers=headers)
data = response.json()
print(data)`
            case 'php':
                return `<?php
// Using cURL in PHP
$ch = curl_init();

curl_setopt($ch, CURLOPT_URL, "${formattedUrl}");
curl_setopt($ch, CURLOPT_RETURNTRANSFER, 1);
curl_setopt($ch, CURLOPT_CUSTOMREQUEST, 'GET');

$headers = array();
$headers[] = 'Authorization: Bearer ${token}';
$headers[] = 'Accept: application/json';
curl_setopt($ch, CURLOPT_HTTPHEADER, $headers);

$result = curl_exec($ch);
if (curl_errno($ch)) {
    echo 'Error:' . curl_error($ch);
}
curl_close($ch);

$data = json_decode($result, true);
print_r($data);`
            default:
                return ''
        }
    }

    if (loading) {
        return (
            <div className="flex items-center justify-center py-20">
                <div className="w-8 h-8 border-2 border-[#00FFFF]/30 border-t-[#00FFFF] rounded-full animate-spin" />
            </div>
        )
    }

    return (
        <div className="space-y-6 max-w-5xl mx-auto pb-12">
            {/* ── Page Header ── */}
            <div className="sticky top-[61px] z-30 bg-[rgba(8,10,46,0.97)] backdrop-blur-xl -mx-4 sm:-mx-6 lg:-mx-8 px-4 sm:px-6 lg:px-8 pt-4 pb-4 border-b border-white/[0.05]">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#00FFFF]/20 to-[#00FFFF]/5 flex items-center justify-center border border-[#00FFFF]/20">
                        <Code className="w-5 h-5 text-[#00FFFF]" />
                    </div>
                    <div>
                        <h2 className="text-2xl font-bold text-white flex items-center gap-2">Developer API Control Center</h2>
                        <p className="text-white/40 text-xs mt-0.5">Integrate Zyrlent directly with custom software, SMM panels, or bot systems.</p>
                    </div>
                </div>
            </div>

            {/* ── API Key Panel ── */}
            <div className="relative overflow-hidden rounded-2xl border border-white/10 bg-gradient-to-br from-[#0D1147] via-[#111555] to-[#0A0E40] p-6 sm:p-8">
                {/* Neon blur decorations */}
                <div className="absolute -top-20 -right-20 w-60 h-60 bg-[#00FFFF]/10 rounded-full blur-3xl" />
                <div className="absolute -bottom-16 -left-16 w-48 h-48 bg-purple-500/8 rounded-full blur-3xl" />

                <div className="relative z-10">
                    <div className="flex items-center justify-between flex-wrap gap-4 mb-5">
                        <div className="flex items-center gap-2">
                            <Key className="w-5 h-5 text-[#00FFFF]" />
                            <h3 className="text-base font-bold text-white">Your Developer Access Key</h3>
                        </div>
                        <div className="flex items-center gap-2 text-[11px] font-bold tracking-wide uppercase px-2.5 py-1 rounded bg-[#00FFFF]/10 text-[#00FFFF] border border-[#00FFFF]/20">
                            <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
                            Zyrlent Developer API Protocol v1
                        </div>
                    </div>

                    <p className="text-white/70 text-xs sm:text-sm leading-relaxed mb-6">
                        Use this key to authorize all requests. Replace your existing SMS API Base URL with <code className="px-1.5 py-0.5 rounded bg-white/10 font-mono text-[#00FFFF] text-xs font-bold">{apiBaseUrl}</code> and plug this key directly into your SMS panel or automated tools. Keep this key strictly private!
                    </p>

                    {/* API Key Box */}
                    <div className="bg-white/5 rounded-xl border border-white/10 p-4 mb-5">
                        <label className="text-[10px] font-bold text-white/40 uppercase tracking-wider mb-2.5 block">API AUTHENTICATION KEY</label>
                        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
                            <div className="flex-1 bg-white/5 rounded-lg px-3 py-3 text-sm text-white/90 font-mono border border-white/8 flex items-center justify-between min-w-0">
                                <span className={`select-all tracking-wide truncate block max-w-[180px] min-w-0 sm:max-w-none ${!apiKey ? 'text-white/35 font-sans italic' : ''}`}>
                                    {displayedKey}
                                </span>
                                {apiKey && (
                                    <button 
                                        onClick={() => setShowKey(s => !s)}
                                        className="ml-2 p-1.5 text-white/40 hover:text-[#00FFFF] hover:bg-white/5 rounded-lg transition flex-shrink-0"
                                        title={showKey ? 'Hide key' : 'Show key'}
                                    >
                                        {showKey ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                    </button>
                                )}
                            </div>
                            
                            <div className="flex flex-wrap sm:flex-nowrap gap-2 w-full sm:w-auto">
                                <button
                                    onClick={copyToClipboard}
                                    disabled={!apiKey}
                                    className={`flex-1 sm:flex-none flex items-center justify-center gap-1.5 px-4 py-3 rounded-lg text-xs font-bold transition-all ${
                                        copied
                                            ? 'bg-green-500/25 text-green-400 border border-green-500/30'
                                            : 'bg-[#00FFFF]/15 text-[#00FFFF] border border-[#00FFFF]/25 hover:bg-[#00FFFF]/25 disabled:opacity-20 disabled:pointer-events-none'
                                    }`}
                                >
                                    {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                                    {copied ? 'Copied!' : 'Copy Key'}
                                </button>
                                
                                <button
                                    onClick={generateKey}
                                    disabled={actionLoading}
                                    className="flex-1 sm:flex-none flex items-center justify-center gap-1.5 px-4 py-3 rounded-lg text-xs font-bold bg-white/8 text-white/80 border border-white/12 hover:bg-white/14 transition disabled:opacity-50"
                                >
                                    <RefreshCw className={`w-3.5 h-3.5 ${actionLoading ? 'animate-spin' : ''}`} />
                                    {apiKey ? 'Regenerate' : 'Generate Key'}
                                </button>
                                
                                {apiKey && (
                                    <button
                                        onClick={revokeKey}
                                        disabled={actionLoading}
                                        className="flex-shrink-0 flex items-center justify-center p-3 rounded-lg text-red-400 hover:text-red-300 bg-red-500/10 border border-red-500/25 hover:bg-red-500/20 transition disabled:opacity-50"
                                        title="Revoke and deactivate API Key"
                                    >
                                        <Trash2 className="w-3.5 h-3.5" />
                                    </button>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Quick Warning Notice */}
                    <div className="flex items-start gap-2.5 p-3.5 rounded-xl bg-amber-500/10 border border-amber-500/20">
                        <AlertCircle className="w-4 h-4 text-amber-400 flex-shrink-0 mt-0.5" />
                        <p className="text-xs text-amber-400/80 leading-relaxed">
                            <strong>Security Alert:</strong> Do not leak or share your API key. Anyone with access to this key can execute number purchases and spend your wallet balance.
                        </p>
                    </div>
                </div>
            </div>

            {/* ── Developer Metrics ── */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {[
                    { label: 'API System Status', value: 'Active', icon: Server, color: 'from-green-500/15 to-green-600/5', iconColor: 'text-green-400', borderColor: 'border-green-500/20' },
                    { label: 'Successful OTP Rate', value: '100%', icon: CheckCircle, color: 'from-cyan-500/15 to-cyan-600/5', iconColor: 'text-cyan-400', borderColor: 'border-cyan-500/20' },
                    { label: 'Average Response Time', value: '1.2s', icon: Clock, color: 'from-purple-500/15 to-purple-600/5', iconColor: 'text-purple-400', borderColor: 'border-purple-500/20' },
                    { label: 'API Limits (Rate)', value: '3 req/min', icon: Activity, color: 'from-blue-500/15 to-blue-600/5', iconColor: 'text-blue-400', borderColor: 'border-blue-500/20' },
                ].map((stat, i) => (
                    <div key={i} className={`rounded-xl border ${stat.borderColor} bg-gradient-to-br ${stat.color} p-4 flex flex-col items-center justify-center text-center`}>
                        <stat.icon className={`w-4 h-4 ${stat.iconColor} mb-2`} />
                        <p className="text-lg font-bold text-white">{stat.value}</p>
                        <p className="text-[10px] text-white/40 font-semibold mt-0.5 uppercase tracking-wider">{stat.label}</p>
                    </div>
                ))}
            </div>

            {/* ── Interactive Code Playground & Endpoints ── */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
                {/* Left Side: Endpoint Selectors */}
                <div className="lg:col-span-4 rounded-2xl border border-white/10 bg-white/[0.03] overflow-hidden">
                    <div className="p-4 border-b border-white/8 bg-white/[0.01]">
                        <h3 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-1.5">
                            <Terminal className="w-3.5 h-3.5 text-[#00FFFF]" />
                            API Operations
                        </h3>
                    </div>
                    <div className="p-2 space-y-1">
                        {Object.entries(endpoints).map(([key, ep]) => {
                            const isActive = activeEndpoint === key
                            return (
                                <button
                                    key={key}
                                    onClick={() => setActiveEndpoint(key)}
                                    className={`w-full flex items-start gap-2.5 p-3 rounded-xl text-left transition ${
                                        isActive
                                            ? 'bg-[#00FFFF]/10 border border-[#00FFFF]/20'
                                            : 'hover:bg-white/[0.04] border border-transparent'
                                    }`}
                                >
                                    <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded leading-none ${
                                        ep.method === 'GET' ? 'bg-[#00FFFF]/15 text-[#00FFFF]' : 'bg-green-500/20 text-green-400'
                                    }`}>
                                        {ep.method}
                                    </span>
                                    <div className="min-w-0">
                                        <p className="text-xs font-bold text-white truncate">{ep.title}</p>
                                        <p className="text-[10px] text-white/30 truncate font-mono mt-0.5">{ep.path}</p>
                                    </div>
                                </button>
                            )
                        })}
                    </div>
                </div>

                {/* Right Side: Language Tabs + Code Block + Parameters */}
                <div className="lg:col-span-8 space-y-4">
                    {/* Playground panel */}
                    <div className="rounded-2xl border border-white/10 bg-[#060829] overflow-hidden shadow-[0_12px_36px_rgba(0,0,0,0.5)]">
                        {/* Title Bar & Selector tabs */}
                        <div className="flex flex-col sm:flex-row justify-between items-stretch sm:items-center px-4 py-2 border-b border-white/8 bg-[#090b34] gap-2">
                            <div className="flex items-center gap-2">
                                <span className="w-2 h-2 rounded-full bg-cyan-400" />
                                <span className="text-xs font-bold text-white font-mono">{currentEndpoint.method} {currentEndpoint.path}</span>
                            </div>
                            {/* Languages tabs */}
                            <div className="flex bg-white/5 rounded-lg p-0.5 border border-white/6 self-start sm:self-auto">
                                {[
                                    { id: 'curl', label: 'cURL' },
                                    { id: 'javascript', label: 'JS Fetch' },
                                    { id: 'python', label: 'Python' },
                                    { id: 'php', label: 'PHP' }
                                ].map((tab) => (
                                    <button
                                        key={tab.id}
                                        onClick={() => setActiveTab(tab.id)}
                                        className={`px-2.5 py-1 rounded text-[10px] font-bold uppercase transition ${
                                            activeTab === tab.id
                                                ? 'bg-[#00FFFF] text-[#0A0B3D]'
                                                : 'text-white/50 hover:text-white'
                                        }`}
                                    >
                                        {tab.label}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Description & Parameters */}
                        <div className="p-4 border-b border-white/5 bg-[#080a32]">
                            <p className="text-xs text-white/70 leading-relaxed">{currentEndpoint.desc}</p>
                            
                            {/* Endpoint Parameters Table */}
                            {currentEndpoint.params.length > 0 && (
                                <div className="mt-4">
                                    <h4 className="text-[10px] font-bold text-white/40 uppercase tracking-wider mb-2">Request Parameters</h4>
                                    <div className="overflow-x-auto">
                                        <table className="w-full text-left border-collapse">
                                            <thead>
                                                <tr className="border-b border-white/8 text-[10px] text-white/40 uppercase font-bold">
                                                    <th className="pb-1.5 pr-4">Parameter</th>
                                                    <th className="pb-1.5 pr-4">Type</th>
                                                    <th className="pb-1.5 pr-4">Position</th>
                                                    <th className="pb-1.5">Description</th>
                                                </tr>
                                            </thead>
                                            <tbody className="divide-y divide-white/5 text-[11px] text-white/65 font-medium">
                                                {currentEndpoint.params.map((p) => (
                                                    <tr key={p.name}>
                                                        <td className="py-2 pr-4 font-mono text-[#00FFFF] font-bold">{p.name} {p.required && <span className="text-red-400 text-[9px] font-sans">*</span>}</td>
                                                        <td className="py-2 pr-4 text-white/40 font-mono text-[10px]">{p.type}</td>
                                                        <td className="py-2 pr-4 text-white/40 font-mono text-[10px]">URL Path</td>
                                                        <td className="py-2 text-white/60">{p.desc}</td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Interactive Playground Sandbox: Code Snippet Block */}
                        <div className="relative">
                            <pre className="p-4 overflow-x-auto text-[11px] font-mono text-cyan-200/90 bg-[#040624] leading-relaxed max-h-[220px] select-all">
                                <code>{getCodeSnippet(activeTab, currentEndpoint)}</code>
                            </pre>
                            
                            {/* Quick copy overlay */}
                            <button
                                onClick={() => {
                                    navigator.clipboard.writeText(getCodeSnippet(activeTab, currentEndpoint))
                                    toast.success('Snippet copied!')
                                }}
                                className="absolute right-3 top-3 p-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-white/50 hover:text-white border border-white/8 transition"
                                title="Copy code snippet"
                            >
                                <Copy className="w-3.5 h-3.5" />
                            </button>
                        </div>

                        {/* Expected JSON Response Preview */}
                        <div className="border-t border-white/8">
                            <div className="px-4 py-2 border-b border-white/5 bg-[#090b34] flex items-center justify-between">
                                <span className="text-[10px] font-bold text-white/40 uppercase tracking-wider">EXPECTED JSON RESPONSE (200 OK)</span>
                                <span className="text-[9px] font-mono font-bold text-green-400 bg-green-500/10 px-2 py-0.5 rounded border border-green-500/15">200 SUCCESS</span>
                            </div>
                            <pre className="p-4 overflow-x-auto text-[10px] font-mono text-emerald-300/85 bg-[#02041d] leading-relaxed max-h-[180px]">
                                <code>{currentEndpoint.response}</code>
                            </pre>
                        </div>
                    </div>
                </div>
            </div>

            {/* ── Comprehensive Developer Documentation ── */}
            <div className="rounded-2xl border border-white/10 bg-white/[0.03] overflow-hidden">
                <div className="p-5 border-b border-white/8 bg-white/[0.01]">
                    <h3 className="text-sm font-bold text-white flex items-center gap-2">
                        <BookOpen className="w-4 h-4 text-[#00FFFF]" />
                        Comprehensive Integration Guide
                    </h3>
                </div>

                <div className="divide-y divide-white/6">
                    {/* Item 1: Getting Started */}
                    <div>
                        <button
                            onClick={() => setOpenDocsSection(openDocsSection === 'getting-started' ? null : 'getting-started')}
                            className="w-full flex items-center justify-between p-5 text-left hover:bg-white/[0.01] transition"
                        >
                            <span className="text-xs font-bold text-white">1. Authentication and Base URL Setup</span>
                            {openDocsSection === 'getting-started' ? <ChevronUp className="w-4 h-4 text-white/40" /> : <ChevronDown className="w-4 h-4 text-white/40" />}
                        </button>
                        
                        {openDocsSection === 'getting-started' && (
                            <div className="px-5 pb-5 text-xs text-white/60 space-y-3 leading-relaxed border-t border-white/5 pt-4">
                                <p>To connect your software or SMS panel to Zyrlent, configure the following settings in your application panel:</p>
                                <ul className="list-disc pl-5 space-y-1.5">
                                    <li><strong>API protocol format:</strong> Standard REST SMS API.</li>
                                    <li><strong>Base API Endpoint:</strong> <code className="px-1.5 py-0.5 rounded bg-white/10 text-[#00FFFF] font-mono">{apiBaseUrl}</code></li>
                                    <li><strong>Authorization:</strong> Pass your generated key via HTTP headers or query string.</li>
                                </ul>
                                <p>Zyrlent fully supports authorization credentials sent using either of these two methods:</p>
                                <ol className="list-decimal pl-5 space-y-1.5 font-medium">
                                    <li>
                                        <strong>Authorization Bearer Header (Preferred):</strong><br />
                                        <code className="text-cyan-300 font-mono">Authorization: Bearer zyr_api_YOUR_SECURE_TOKEN</code>
                                    </li>
                                    <li>
                                        <strong>Query String Parameter:</strong><br />
                                        <code className="text-cyan-300 font-mono">{apiBaseUrl}/v1/user/profile?api_key=zyr_api_YOUR_SECURE_TOKEN</code>
                                    </li>
                                </ol>
                            </div>
                        )}
                    </div>

                    {/* Item 2: Dynamic Country and Service resolution */}
                    <div>
                        <button
                            onClick={() => setOpenDocsSection(openDocsSection === 'resolution' ? null : 'resolution')}
                            className="w-full flex items-center justify-between p-5 text-left hover:bg-white/[0.01] transition"
                        >
                            <span className="text-xs font-bold text-white">2. Fuzzy Country Mapping and Service Slugs</span>
                            {openDocsSection === 'resolution' ? <ChevronUp className="w-4 h-4 text-white/40" /> : <ChevronDown className="w-4 h-4 text-white/40" />}
                        </button>

                        {openDocsSection === 'resolution' && (
                            <div className="px-5 pb-5 text-xs text-white/60 space-y-3 leading-relaxed border-t border-white/5 pt-4">
                                <p>Our routing intelligence performs advanced fuzzy matching, meaning you don't need to stress about rigid country casing or formatting.</p>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 bg-white/[0.02] border border-white/5 rounded-xl p-4">
                                    <div>
                                        <h5 className="font-bold text-white mb-2 uppercase text-[10px] tracking-wider text-[#00FFFF]">Supported Country formats</h5>
                                        <ul className="list-disc pl-4 space-y-1">
                                            <li><strong>Full Country Name:</strong> <code className="text-cyan-300 font-mono">nigeria</code>, <code className="text-cyan-300 font-mono">unitedstates</code></li>
                                            <li><strong>ISO Codes (2-letter):</strong> <code className="text-cyan-300 font-mono">ng</code>, <code className="text-cyan-300 font-mono">us</code>, <code className="text-cyan-300 font-mono">gb</code></li>
                                            <li><strong>Dashed / Spaces names:</strong> <code className="text-cyan-300 font-mono">south-korea</code> or <code className="text-cyan-300 font-mono">southkorea</code> match correctly to "South Korea"</li>
                                        </ul>
                                    </div>
                                    <div>
                                        <h5 className="font-bold text-white mb-2 uppercase text-[10px] tracking-wider text-[#00FFFF]">Supported Product/Service Slugs</h5>
                                        <ul className="list-disc pl-4 space-y-1">
                                            <li><strong>Common Slugs:</strong> <code className="text-cyan-300 font-mono">whatsapp</code>, <code className="text-cyan-300 font-mono">telegram</code>, <code className="text-cyan-300 font-mono">google</code></li>
                                            <li><strong>Any other:</strong> Simply match the service names found in the main dashboard sidebar list.</li>
                                        </ul>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Item 3: Polling and Lifecycle */}
                    <div>
                        <button
                            onClick={() => setOpenDocsSection(openDocsSection === 'lifecycle' ? null : 'lifecycle')}
                            className="w-full flex items-center justify-between p-5 text-left hover:bg-white/[0.01] transition"
                        >
                            <span className="text-xs font-bold text-white">3. Polling Rules & Activation Lifecycle Flow</span>
                            {openDocsSection === 'lifecycle' ? <ChevronUp className="w-4 h-4 text-white/40" /> : <ChevronDown className="w-4 h-4 text-white/40" />}
                        </button>

                        {openDocsSection === 'lifecycle' && (
                            <div className="px-5 pb-5 text-xs text-white/60 space-y-3 leading-relaxed border-t border-white/5 pt-4">
                                <p>To achieve high-efficiency automation, implement the following programmatic workflow:</p>
                                <div className="space-y-3 bg-[#02041d] font-mono text-[10px] text-cyan-200/90 rounded-xl p-4 border border-white/5 leading-relaxed">
                                    <div className="flex gap-2">
                                        <span className="text-[#00FFFF]">1.</span>
                                        <span>Trigger <code className="text-white font-bold">GET /buy</code> endpoint. Save the returned activation ID and phone number.</span>
                                    </div>
                                    <div className="flex gap-2">
                                        <span className="text-[#00FFFF]">2.</span>
                                        <span>Use the phone number to trigger the registration in your target application.</span>
                                    </div>
                                    <div className="flex gap-2">
                                        <span className="text-[#00FFFF]">3.</span>
                                        <span>Poll <code className="text-white font-bold">GET /check/{'{'}id{'}'}</code> every 5 seconds.</span>
                                    </div>
                                    <div className="flex gap-2">
                                        <span className="text-[#00FFFF]">4.</span>
                                        <span>If <code className="text-[#00FFFF]">status</code> is <code className="text-green-400 font-bold">"RECEIVED"</code>, keep polling. (Max expiration window is 20 minutes).</span>
                                    </div>
                                    <div className="flex gap-2">
                                        <span className="text-[#00FFFF]">5.</span>
                                        <span>If <code className="text-[#00FFFF]">status</code> turns to <code className="text-green-400 font-bold">"FINISHED"</code>, extract the OTP code array from the <code className="text-white font-bold">sms</code> key.</span>
                                    </div>
                                    <div className="flex gap-2 text-white/30 border-t border-white/5 pt-2 mt-2">
                                        <span>•</span>
                                        <span>If no code arrives and you cancel, trigger <code className="text-white font-bold">GET /cancel/{'{'}id{'}'}</code> to release number and refund wallet.</span>
                                    </div>
                                    <div className="flex gap-2 text-white/30">
                                        <span>•</span>
                                        <span>If the application says the number is banned, trigger <code className="text-white font-bold">GET /ban/{'{'}id{'}'}</code> for a refund.</span>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    )
}
