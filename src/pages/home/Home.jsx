'use client'

import { useState } from 'react'
import { ArrowRight, CheckCircle2, Zap, Shield, Globe, Gift, UserPlus, CreditCard, Smartphone, MessageSquare, Star, User, Code, Terminal, BookOpen, Key, Copy, Check } from 'lucide-react'
import { Link } from 'react-router-dom'
import toast from 'react-hot-toast'
import phoneImage from '../../assets/phone.jpg'
import Background from '../../components/Background'
import Navbar from '../../components/Navbar'
import Footer from '../../components/Footer'
import TelegramChat from '../../components/TelegramChat'

export default function Home() {
  const [apiTab, setApiTab] = useState('curl')
  const [apiEndpoint, setApiEndpoint] = useState('profile')
  const [copiedText, setCopiedText] = useState(false)

  const apiBaseUrl = window.location.origin + '/api'

  const homepageEndpoints = {
    profile: {
      title: 'Get Account Balance',
      method: 'GET',
      path: '/v1/user/profile',
      desc: 'Retrieve your user profile balance and rating details instantly.',
      params: [],
      response: `{
  "email": "user@example.com",
  "balance": 1250.00,
  "rating": 5
}`
    },
    buy: {
      title: 'Order Virtual Number',
      method: 'GET',
      path: '/v1/user/buy/activation/{country}/{operator}/{product}',
      desc: 'Requests a new virtual number from our dynamic smart carrier router.',
      params: [
        { name: 'country', desc: 'Country name or ISO code (e.g. "nigeria", "us", "ng").' },
        { name: 'operator', desc: 'Carrier name or "any" to automatically select the best carrier.' },
        { name: 'product', desc: 'The target service slug (e.g. "whatsapp", "telegram", "google").' }
      ],
      response: `{
  "id": 14205,
  "phone": "2348109876543",
  "operator": "mtn",
  "product": "whatsapp",
  "price": 150.00,
  "status": "RECEIVED",
  "expires": "2026-05-23T16:55:00.000000Z",
  "sms": null,
  "created_at": "2026-05-23T16:35:00.000000Z",
  "country": "nigeria"
}`
    },
    check: {
      title: 'Retrieve SMS OTP',
      method: 'GET',
      path: '/v1/user/check/{id}',
      desc: 'Retrieves SMS verification details. Status changes from "RECEIVED" to "FINISHED" when OTP code arrives.',
      params: [
        { name: 'id', desc: 'The unique activation order ID returned in step 1.' }
      ],
      response: `{
  "id": 14205,
  "phone": "2348109876543",
  "operator": "mtn",
  "product": "whatsapp",
  "price": 150.00,
  "status": "FINISHED",
  "sms": [
    {
      "created_at": "2026-05-23T16:38:12.000000Z",
      "sender": "WhatsApp",
      "text": "Your WhatsApp code is 482-192",
      "code": "482192"
    }
  ]
}`
    }
  }

  const getHomepageCodeSnippet = (lang, endpointId) => {
    const endpoint = homepageEndpoints[endpointId]
    let path = endpoint.path
    if (endpointId === 'buy') {
      path = path.replace('{country}', 'nigeria').replace('{operator}', 'any').replace('{product}', 'whatsapp')
    } else if (endpointId === 'check') {
      path = path.replace('{id}', '14205')
    }
    const fullUrl = `${apiBaseUrl}${path}`

    switch (lang) {
      case 'curl':
        return `curl -X GET "${fullUrl}" \\\n  -H "Authorization: Bearer YOUR_API_KEY" \\\n  -H "Accept: application/json"`
      case 'javascript':
        return `fetch('${fullUrl}', {
  method: 'GET',
  headers: {
    'Authorization': 'Bearer YOUR_API_KEY',
    'Accept': 'application/json'
  }
})
.then(res => res.json())
.then(data => console.log(data));`
      case 'python':
        return `import requests

url = "${fullUrl}"
headers = {
    "Authorization": "Bearer YOUR_API_KEY",
    "Accept": "application/json"
}

response = requests.get(url, headers=headers)
print(response.json())`
      case 'php':
        return `<?php
$ch = curl_init();
curl_setopt($ch, CURLOPT_URL, "${fullUrl}");
curl_setopt($ch, CURLOPT_RETURNTRANSFER, 1);
curl_setopt($ch, CURLOPT_HTTPHEADER, [
    'Authorization: Bearer YOUR_API_KEY',
    'Accept: application/json'
]);
$result = curl_exec($ch);
curl_close($ch);
print_r(json_decode($result, true));`
      default:
        return ''
    }
  }

  return (
    <div className="min-h-screen w-full text-[#FFFFFF] overflow-x-hidden relative">
      <Background />
      <Navbar />

      {/* Hero Section */}
      <main className="relative z-10 pt-[88px]">
        <div className="mx-auto flex max-w-7xl flex-col gap-12 px-4 py-16 md:px-6 md:py-20 lg:gap-16">

          {/* Hero Content */}
          <section className="flex flex-col items-center text-center max-w-4xl mx-auto">
            <div className="inline-flex items-center gap-2 rounded-full border border-[rgba(0,255,255,0.4)] bg-[rgba(0,255,255,0.08)] px-5 py-2 text-sm font-medium text-[#00FFFF]">
              <Zap className="h-4 w-4 fill-current" />
              Enterprise-grade virtual number service
            </div>

            <h1 className="mt-8 text-5xl font-bold tracking-tight text-[#FFFFFF] sm:text-6xl lg:text-7xl drop-shadow-[0_0_24px_rgba(0,255,255,0.4)]">
              Instant virtual numbers for<br />
              <span className="text-[#00FFFF]">Smooth SMS verification</span>
            </h1>

            <div className="mt-6 flex flex-wrap items-center justify-center gap-6 text-lg font-medium text-[#FFFFFF]/90">
              <div className="flex items-center gap-2">
                <Shield className="h-5 w-5 text-[#00FF00]" />
                Secure
              </div>
              <div className="flex items-center gap-2">
                <Zap className="h-5 w-5 text-[#FFFF00]" />
                Fast
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="h-5 w-5 text-[#BD00FF]" />
                Reliable
              </div>
            </div>

            <p className="mt-6 text-lg leading-relaxed text-[#FFFFFF]/80 max-w-2xl mx-auto">
              Secure your digital presence with our instant SMS verification using private, reliable virtual numbers worldwide.
            </p>

            <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4 w-full sm:w-auto">
              <Link to="/signup" className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-full bg-[#FFFFFF] px-8 py-3.5 font-bold text-[#0A0B3D] hover:bg-gray-100 transition shadow-[0_0_20px_rgba(255,255,255,0.3)]">
                Get verified
                <ArrowRight className="h-5 w-5" />
              </Link>
              <Link to="/login" className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-full border border-[rgba(255,255,255,0.3)] px-8 py-3.5 font-bold text-[#FFFFFF] transition hover:bg-[rgba(255,255,255,0.1)]">
                Sign in
              </Link>
            </div>
          </section>

          {/* Middle Visual - Phone */}
          <section className="relative mx-auto mt-4 max-w-[450px] w-full">
            <div className="relative z-10 mx-auto w-full rounded-[2.5rem] shadow-xl overflow-hidden animate-float">
              <img src={phoneImage} alt="App Interface" className="w-full h-auto object-cover" />
            </div>

            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-[#00FFFF]/20 blur-3xl -z-10 rounded-full"></div>

            <div className="absolute top-4 -right-4 sm:-right-8 bg-[#0A0B3D] border border-[#00FFFF]/30 px-4 py-2 rounded-xl shadow-lg backdrop-blur-md animate-joggle delay-0 z-20">
              <span className="text-[#00FFFF] font-bold text-sm">Fast</span>
            </div>

            <div className="absolute top-1/2 -right-4 sm:-right-8 transform -translate-y-1/2 bg-[#0A0B3D] border border-[#00FFFF]/30 px-4 py-2 rounded-xl shadow-lg backdrop-blur-md animate-joggle delay-150 z-20">
              <span className="text-[#00FFFF] font-bold text-sm">Secure</span>
            </div>

            <div className="absolute bottom-4 -left-4 sm:-left-8 bg-[#0A0B3D] border border-[#00FFFF]/30 px-4 py-2 rounded-xl shadow-lg backdrop-blur-md animate-joggle delay-300 z-20">
              <span className="text-[#00FFFF] font-bold text-sm">Reliable</span>
            </div>
          </section>

          {/* Key Benefits Section */}
          <section className="mt-16 mb-12">
            <div className="mx-auto max-w-5xl">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
                <div className="flex flex-col items-center gap-3">
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[rgba(0,255,255,0.1)] text-[#00FF00]">
                    <Shield className="h-6 w-6" />
                  </div>
                  <span className="font-medium text-[#FFFFFF]">Encrypted & Secure</span>
                </div>
                <div className="flex flex-col items-center gap-3">
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[rgba(0,255,255,0.1)] text-[#FFFF00]">
                    <Zap className="h-6 w-6" />
                  </div>
                  <span className="font-medium text-[#FFFFFF]">Instant fulfillment</span>
                </div>
                <div className="flex flex-col items-center gap-3">
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[rgba(0,255,255,0.1)] text-[#00BFFF]">
                    <Globe className="h-6 w-6" />
                  </div>
                  <span className="font-medium text-[#FFFFFF]">Global coverage</span>
                </div>
                <div className="flex flex-col items-center gap-3">
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[rgba(0,255,255,0.1)] text-[#BD00FF]">
                    <User className="h-6 w-6" />
                  </div>
                  <span className="font-medium text-[#FFFFFF]">99.9% Uptime SLA</span>
                </div>
              </div>
            </div>
          </section>

          {/* Why Choose Section */}
          <section id="trust" className="mt-12 max-w-5xl mx-auto">
            <h2 className="text-3xl font-bold text-[#FFFFFF] text-center mb-10">Why Choose Zyrlent?</h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {[
                {
                  icon: Shield,
                  title: 'Escrow Billing',
                  desc: 'Pay only for successful code. Instant refunds if delivery fails within 7 minutes.'
                },
                {
                  icon: Zap,
                  title: 'Lightning Fast',
                  desc: 'Average delivery in 2.1 seconds with intelligent routing across global networks.'
                },
                {
                  icon: Globe,
                  title: 'Global Coverage',
                  desc: 'Access numbers from 180+ countries including African, US, UK, and EU regions.'
                },
                {
                  icon: CheckCircle2,
                  title: 'Multi platform',
                  desc: 'Instantly receive verification codes for whatsapp, facebook, Telegram, and more'
                },
                {
                  icon: Shield,
                  title: 'Enterprise security',
                  desc: 'Bank-level encryption, 99.9% uptime SLA, and dedicated Support.'
                },
                {
                  icon: Gift,
                  title: 'Referral program',
                  desc: 'Earn 20% credits when your friends fund ₦10,000 or more'
                },
              ].map((item, i) => (
                <div key={i} className="flex gap-4 p-6 rounded-xl border border-[rgba(0,255,255,0.15)] bg-[rgba(15,20,60,0.6)] backdrop-blur-sm transition hover:bg-[rgba(15,20,60,0.8)] hover:border-[rgba(0,255,255,0.3)]">
                  <div className="flex-shrink-0">
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[rgba(0,255,255,0.1)]">
                      <item.icon className="h-5 w-5 text-[#00FFFF]" />
                    </div>
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-[#FFFFFF]">{item.title}</h3>
                    <p className="mt-2 text-sm text-[#FFFFFF]/70 leading-relaxed">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* How It Works Section */}
          <section id="how-it-works" className="mt-20 mb-20">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold text-[#FFFFFF]">How It Works</h2>
              <p className="mt-4 text text-[#FFFFFF]/80 text-lg">Get verified in 4 easy Steps</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 relative">
              <div className="hidden lg:block absolute top-12 left-[10%] right-[10%] h-0.5 bg-gradient-to-r from-[#00FFFF]/0 via-[#00FFFF]/30 to-[#00FFFF]/0 z-0"></div>

              {[
                {
                  icon: UserPlus,
                  step: '1',
                  title: 'Create your Account',
                  desc: 'Sign up in seconds and setup securely'
                },
                {
                  icon: CreditCard,
                  step: '2',
                  title: 'Fund your account',
                  desc: 'Add money using our safe and reliable payment methods'
                },
                {
                  icon: Smartphone,
                  step: '3',
                  title: 'Choose a Number',
                  desc: 'Pick a virtual number from 180+ countries for the platform you want to verify - whatsapp, facebook, telegram and more'
                },
                {
                  icon: MessageSquare,
                  step: '4',
                  title: 'Receive & Verify',
                  desc: 'Get sms code instantly and complete verification privately'
                }
              ].map((item, i) => (
                <div key={i} className="flex flex-col items-center text-center relative z-10">
                  <div className="flex items-center justify-center w-24 h-24 rounded-full bg-[rgba(15,20,60,0.8)] border border-[rgba(0,255,255,0.3)] shadow-[0_0_15px_rgba(0,255,255,0.15)] mb-6 transition transform hover:scale-105 hover:border-[#00FFFF]">
                    <item.icon className="h-10 w-10 text-[#00FFFF]" />
                    <div className="absolute -top-2 -right-2 w-8 h-8 rounded-full bg-gradient-to-br from-[#33CCFF] to-[#0099FF] flex items-center justify-center font-bold text-[#FFFFFF] border-2 border-[#0A0B3D]">
                      {item.step}
                    </div>
                  </div>
                  <h3 className="text-xl font-bold text-[#FFFFFF] mb-3">{item.title}</h3>
                  <p className="text-[#FFFFFF]/70 leading-relaxed max-w-[250px]">{item.desc}</p>
                </div>
              ))}
            </div>
          </section>

          {/* ── Developer API Homepage Section ── */}
          <section id="api" className="mt-16 mb-20 max-w-5xl mx-auto px-4">
            <div className="text-center mb-12">
              <div className="inline-flex items-center gap-2 rounded-full border border-[rgba(0,255,255,0.3)] bg-[rgba(0,255,255,0.05)] px-4 py-1.5 text-xs font-semibold text-[#00FFFF] uppercase tracking-wider mb-4">
                <Code className="h-3.5 w-3.5" />
                Developer Integration
              </div>
              <h2 className="text-3xl md:text-4xl font-bold text-[#FFFFFF]">Powerful REST API for SMS Automation</h2>
              <p className="mt-4 text-base text-[#FFFFFF]/70 max-w-2xl mx-auto">
                Integrate Zyrlent's secure virtual numbers directly into your software, SMM panels, or bot scripts. Standardized protocol for flawless drop-in replacement.
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
              {/* Left Column: API Features & Selector */}
              <div className="lg:col-span-5 flex flex-col justify-between gap-6">
                <div className="space-y-4">
                  <div className="rounded-2xl border border-[rgba(0,255,255,0.15)] bg-[rgba(15,20,60,0.6)] backdrop-blur-sm p-5 space-y-4">
                    <h3 className="text-lg font-bold text-white flex items-center gap-2">
                      <Shield className="w-5 h-5 text-[#00FFFF]" /> Secure & Scalable
                    </h3>
                    <p className="text-sm text-white/70 leading-relaxed">
                      Our API is secured with advanced cryptographical token validation, rate limit protections, and high-frequency network failover, ensuring 99.9% uptime for automated tasks.
                    </p>
                  </div>
                  
                  <div className="rounded-2xl border border-white/10 bg-[rgba(15,20,60,0.4)] p-4 space-y-1">
                    <h4 className="text-[10px] font-bold text-white/40 uppercase tracking-wider mb-2.5 px-2">API Endpoints</h4>
                    {Object.entries(homepageEndpoints).map(([key, ep]) => {
                      const isActive = apiEndpoint === key
                      return (
                        <button
                          key={key}
                          onClick={() => setApiEndpoint(key)}
                          className={`w-full flex items-start gap-3 p-3 rounded-xl text-left transition ${
                            isActive
                              ? 'bg-[#00FFFF]/10 border border-[#00FFFF]/20'
                              : 'hover:bg-white/[0.03] border border-transparent'
                          }`}
                        >
                          <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded leading-none ${
                            ep.method === 'GET' ? 'bg-[#00FFFF]/15 text-[#00FFFF]' : 'bg-green-500/20 text-green-400'
                          }`}>
                            {ep.method}
                          </span>
                          <div className="min-w-0">
                            <p className="text-xs font-bold text-white">{ep.title}</p>
                            <p className="text-[10px] text-[#00FFFF]/60 font-mono mt-0.5">{ep.path}</p>
                          </div>
                        </button>
                      )
                    })}
                  </div>
                </div>

                <div className="rounded-2xl border border-white/10 bg-gradient-to-br from-[#0D1147]/50 to-[#0A0E40]/50 p-5 flex items-center justify-between">
                  <div>
                    <h4 className="text-sm font-bold text-white">Ready to automate?</h4>
                    <p className="text-xs text-white/50 mt-1">Get your secure API key inside your user profile dashboard.</p>
                  </div>
                  <Link to="/signup" className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-white text-[#0A0B3D] text-xs font-bold hover:bg-gray-100 transition shadow-[0_0_12px_rgba(255,255,255,0.2)]">
                    Get API Key <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>

              {/* Right Column: Code Playground Sandbox */}
              <div className="lg:col-span-7 rounded-2xl border border-white/10 bg-[#060829] overflow-hidden shadow-[0_12px_36px_rgba(0,0,0,0.5)] flex flex-col justify-between">
                <div>
                  {/* Playground header */}
                  <div className="flex flex-col sm:flex-row justify-between items-stretch sm:items-center px-4 py-2.5 border-b border-white/8 bg-[#090b34] gap-2">
                    <div className="flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-cyan-400" />
                      <span className="text-xs font-bold text-white font-mono">{homepageEndpoints[apiEndpoint].method} {homepageEndpoints[apiEndpoint].path}</span>
                    </div>
                    
                    {/* Language selector */}
                    <div className="flex bg-white/5 rounded-lg p-0.5 border border-white/6 self-start sm:self-auto">
                      {[
                        { id: 'curl', label: 'cURL' },
                        { id: 'javascript', label: 'JS' },
                        { id: 'python', label: 'Python' },
                        { id: 'php', label: 'PHP' }
                      ].map((tab) => (
                        <button
                          key={tab.id}
                          onClick={() => setApiTab(tab.id)}
                          className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase transition ${
                            apiTab === tab.id
                              ? 'bg-[#00FFFF] text-[#0A0B3D]'
                              : 'text-white/50 hover:text-white'
                          }`}
                        >
                          {tab.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Endpoint Description */}
                  <div className="p-4 border-b border-white/5 bg-[#080a32]">
                    <p className="text-xs text-white/70 leading-relaxed">{homepageEndpoints[apiEndpoint].desc}</p>
                    
                    {homepageEndpoints[apiEndpoint].params.length > 0 && (
                      <div className="mt-3 space-y-1">
                        <span className="text-[9px] font-bold text-white/40 uppercase block tracking-wider">Params:</span>
                        {homepageEndpoints[apiEndpoint].params.map(p => (
                          <div key={p.name} className="text-[10px] text-white/60">
                            <code className="text-[#00FFFF] font-mono font-bold mr-1.5">{p.name}</code> — {p.desc}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Code Block */}
                  <div className="relative">
                    <pre className="p-4 overflow-x-auto text-[11px] font-mono text-cyan-200/90 bg-[#040624] leading-relaxed max-h-[160px] select-all">
                      <code>{getHomepageCodeSnippet(apiTab, apiEndpoint)}</code>
                    </pre>
                    
                    <button
                      onClick={() => {
                        navigator.clipboard.writeText(getHomepageCodeSnippet(apiTab, apiEndpoint))
                        setCopiedText(true)
                        toast.success('Snippet copied!')
                        setTimeout(() => setCopiedText(false), 2000)
                      }}
                      className="absolute right-3 top-3 p-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-white/50 hover:text-white border border-white/8 transition"
                      title="Copy code snippet"
                    >
                      {copiedText ? <Check className="w-3.5 h-3.5 text-green-400" /> : <Copy className="w-3.5 h-3.5" />}
                    </button>
                  </div>
                </div>

                {/* Expected Response */}
                <div className="border-t border-white/8">
                  <div className="px-4 py-2 border-b border-white/5 bg-[#090b34] flex items-center justify-between">
                    <span className="text-[10px] font-bold text-white/40 uppercase tracking-wider">Expected JSON Response</span>
                    <span className="text-[9px] font-mono font-bold text-green-400 bg-green-500/10 px-2 py-0.5 rounded border border-green-500/15">200 OK</span>
                  </div>
                  <pre className="p-4 overflow-x-auto text-[10px] font-mono text-emerald-300/85 bg-[#02041d] leading-relaxed max-h-[140px]">
                    <code>{homepageEndpoints[apiEndpoint].response}</code>
                  </pre>
                </div>
              </div>
            </div>
          </section>

          {/* Ready to Verify Section */}
          <section className="mt-12 mb-20 rounded-2xl border border-[rgba(0,255,255,0.2)] bg-gradient-to-br from-[rgba(15,20,60,0.9)] to-[rgba(10,11,61,0.95)] backdrop-blur-sm p-12 text-center max-w-4xl mx-auto relative overflow-hidden">
            <div className="absolute top-0 right-0 p-32 bg-[#00FFFF]/5 blur-[100px] rounded-full pointer-events-none"></div>

            <h2 className="text-3xl font-bold text-[#FFFFFF] relative z-10">Ready to Verify?</h2>
            <p className="mt-4 text-[#FFFFFF]/80 max-w-lg mx-auto leading-relaxed relative z-10">
              Join millions of happy users who rely on zyrlent for instant verification needs
            </p>
            <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4 relative z-10">
              <Link to="/signup" className="w-full sm:w-auto rounded-lg bg-[#FFFFFF] px-8 py-3 font-semibold text-[#0A0B3D] hover:bg-gray-100 transition text-center">
                Get verified
              </Link>
              <Link to="/login" className="w-full sm:w-auto rounded-lg border border-[#FFFFFF]/30 px-8 py-3 font-semibold text-[#FFFFFF] hover:bg-[#FFFFFF]/10 transition text-center">
                Sign in
              </Link>
            </div>
          </section>

          {/* What Our Users Say Section */}
          <section id="reviews" className="mt-20 mb-20 max-w-6xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold text-[#FFFFFF]">What Our Users Say</h2>
              <p className="mt-4 text text-[#FFFFFF]/80 text-lg max-w-2xl mx-auto">Join millions of happy users around the globe who trust Zyrlent for fast, private verification</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[
                {
                  quote: "A total game-changer for our cross-platform testing! The API is flawlessly engineered, but what truly sets them apart is a support team that's as fast as their code, always there when we need them.",
                  name: "Tyler Max",
                  role: "Elite",
                  initials: "TM"
                },
                {
                  quote: "The process is so simple, I pick a number, get the code, and I'm verified. No stress at all.",
                  name: "Martin Oliver",
                  role: "Starter",
                  initials: "MO"
                },
                {
                  quote: "Fast, secure, and affordable! Zyrlent is the tool my team relies on for client account verification everyday.",
                  name: "Harper Liam",
                  role: "Professional",
                  initials: "HL"
                }
              ].map((testimonial, i) => (
                <div key={i} className="rounded-2xl border border-[rgba(0,255,255,0.2)] bg-[rgba(15,20,60,0.6)] backdrop-blur-sm p-8 flex flex-col items-center text-center hover:bg-[rgba(15,20,60,0.8)] transition">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[#33CCFF] to-[#0099FF] mb-4 flex items-center justify-center font-bold text-[#FFFFFF] text-lg">
                    {testimonial.initials}
                  </div>
                  <div className="flex gap-1 mb-4">
                    {[...Array(5)].map((_, j) => (
                      <Star key={j} className="h-4 w-4 fill-[#FFD700] text-[#FFD700]" />
                    ))}
                  </div>
                  <p className="text-[#FFFFFF]/90 mb-6 flex-grow">"{testimonial.quote}"</p>
                  <div>
                    <div className="font-bold text-[#FFFFFF]">{testimonial.name}</div>
                    <div className="text-sm text-[#00FFFF]">{testimonial.role}</div>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Trust & Transparency Section */}
          <section className="mt-20 mb-12 max-w-5xl mx-auto rounded-3xl border border-[rgba(0,255,255,0.2)] bg-[rgba(15,20,60,0.6)] backdrop-blur-sm p-8 md:p-12 shadow-[0_0_40px_rgba(0,255,255,0.05)]">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold text-[#FFFFFF]">Zyrlent Trust & Transparency</h2>
              <p className="mt-4 text-[#00FFFF] text-lg font-semibold">Reliable Infrastructure for SMS Verification</p>
              <p className="mt-4 text-[#FFFFFF]/80 max-w-3xl mx-auto leading-relaxed">
                Zyrlent is built to provide secure, scalable, and reliable virtual number services for individuals, developers, and businesses worldwide. Our infrastructure supports high-volume SMS verification and automated integrations through a secure wallet-based system.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
              {/* Our Services */}
              <div>
                <h3 className="text-xl font-bold text-[#FFFFFF] mb-4 flex items-center gap-2">
                  <Shield className="w-5 h-5 text-[#00FFFF]" /> Our Services
                </h3>
                <p className="text-[#FFFFFF]/70 mb-3">Zyrlent provides the following solutions:</p>
                <ul className="space-y-2 text-[#FFFFFF]/70 list-disc list-inside">
                  <li>Virtual phone numbers for online verification</li>
                  <li>Instant SMS code delivery</li>
                  <li>Secure wallet funding and transactions</li>
                  <li>Developer API integration</li>
                  <li>Automated verification workflows</li>
                </ul>
                <p className="mt-3 text-[#FFFFFF]/70 text-sm">These services help users verify accounts, test applications, and integrate SMS verification into their systems.</p>
              </div>

              {/* Security & Compliance */}
              <div>
                <h3 className="text-xl font-bold text-[#FFFFFF] mb-4 flex items-center gap-2">
                  <CheckCircle2 className="w-5 h-5 text-[#00FFFF]" /> Security & Compliance
                </h3>
                <p className="text-[#FFFFFF]/70 mb-3">We prioritize platform security and responsible usage. To maintain the integrity of our services:</p>
                <ul className="space-y-2 text-[#FFFFFF]/70 list-disc list-inside">
                  <li>All transactions are logged and monitored</li>
                  <li>Fraudulent or abusive activity is strictly prohibited</li>
                  <li>Users must comply with our Terms of Service</li>
                  <li>Our platform infrastructure is continuously monitored</li>
                </ul>
              </div>

              {/* Built for Developers & Businesses */}
              <div>
                <h3 className="text-xl font-bold text-[#FFFFFF] mb-4 flex items-center gap-2">
                  <Globe className="w-5 h-5 text-[#00FFFF]" /> Built for Developers & Businesses
                </h3>
                <p className="text-[#FFFFFF]/70 mb-3">Zyrlent provides tools for developers and organizations to integrate SMS verification into their systems. Our API allows:</p>
                <ul className="space-y-2 text-[#FFFFFF]/70 list-disc list-inside">
                  <li>Automated number requests</li>
                  <li>SMS retrieval</li>
                  <li>Real-time service integration</li>
                </ul>
                <p className="mt-3 text-[#FFFFFF]/70 text-sm">This makes Zyrlent suitable for testing environments, account verification workflows, and application integrations.</p>
              </div>

              {/* Our Technology */}
              <div>
                <h3 className="text-xl font-bold text-[#FFFFFF] mb-4 flex items-center gap-2">
                  <Zap className="w-5 h-5 text-[#00FFFF]" /> Our Technology
                </h3>
                <p className="text-[#FFFFFF]/70 mb-3">The Zyrlent platform is designed with a scalable infrastructure capable of supporting global users and high-volume verification requests. Features include:</p>
                <ul className="space-y-2 text-[#FFFFFF]/70 list-disc list-inside">
                  <li>Secure wallet architecture</li>
                  <li>Real-time SMS processing</li>
                  <li>API-based automation</li>
                  <li>Reliable uptime infrastructure</li>
                </ul>
              </div>
            </div>

            <div className="mt-12 pt-8 border-t border-[rgba(0,255,255,0.2)] text-center">
              <h3 className="text-lg font-bold text-[#FFFFFF] mb-2">Company Information</h3>
              <p className="text-[#FFFFFF]/70 mb-6 max-w-2xl mx-auto">
                Zyrlent is a product of SHOBiZ Technologies Ltd, a technology company focused on building scalable digital platforms.
              </p>
              <h3 className="text-lg font-bold text-[#FFFFFF] mb-2">Contact</h3>
              <p className="text-[#FFFFFF]/70">For inquiries, partnerships, or support:</p>
              <a href="mailto:support@zyrlent.com" className="text-[#00FFFF] hover:underline font-semibold mt-1 inline-block">support@zyrlent.com</a>
            </div>
          </section>

        </div>
      </main>

      <Footer />
      <TelegramChat />
    </div>
  )
}
