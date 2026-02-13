'use client'

import { Code2, Server, Zap, Shield, Globe, Key, FileJson, BarChart3, ArrowRight } from 'lucide-react'
import { Link } from 'react-router-dom'
import Background from '../../components/Background'
import Navbar from '../../components/Navbar'
import Footer from '../../components/Footer'

export default function Partners() {
  return (
    <div className="min-h-screen w-full text-[#FFFFFF] overflow-hidden relative">
      <Background />
      <Navbar />

      <main className="relative z-10">
        <div className="mx-auto max-w-7xl px-4 py-16 md:px-6 md:py-20">

          {/* Hero */}
          <section className="text-center max-w-3xl mx-auto mb-20">
            <div className="inline-flex items-center gap-2 rounded-full border border-[rgba(0,255,255,0.4)] bg-[rgba(0,255,255,0.08)] px-5 py-2 text-sm font-medium text-[#00FFFF] mb-6">
              <Code2 className="h-4 w-4" />
              Developer API
            </div>
            <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-[#FFFFFF] drop-shadow-[0_0_24px_rgba(0,255,255,0.4)]">
              Partners & <span className="text-[#00FFFF]">API Integration</span>
            </h1>
            <p className="mt-6 text-lg text-[#FFFFFF]/70 leading-relaxed max-w-2xl mx-auto">
              Integrate Zyrlent's powerful SMS verification into your application with our RESTful API. Simple, fast, and built for scale.
            </p>
          </section>

          {/* API Features */}
          <section className="mb-20">
            <h2 className="text-2xl md:text-3xl font-bold text-[#FFFFFF] text-center mb-12">API Capabilities</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[
                {
                  icon: Server,
                  title: 'RESTful API',
                  desc: 'Clean, well-documented REST endpoints. Get started in minutes with simple HTTP requests.'
                },
                {
                  icon: Zap,
                  title: 'Real-time Webhooks',
                  desc: 'Get instant notifications when SMS codes arrive. No polling needed.'
                },
                {
                  icon: Shield,
                  title: 'Secure Authentication',
                  desc: 'API key authentication with rate limiting and IP whitelisting for maximum security.'
                },
                {
                  icon: Globe,
                  title: '180+ Countries',
                  desc: 'Access virtual numbers across 180+ countries. Full coverage for global verification needs.'
                },
                {
                  icon: FileJson,
                  title: 'JSON Responses',
                  desc: 'All responses in clean JSON format. Easy to parse and integrate into any language.'
                },
                {
                  icon: BarChart3,
                  title: 'Usage Analytics',
                  desc: 'Track your API usage, success rates, and spending with detailed analytics dashboards.'
                },
              ].map((item, i) => (
                <div key={i} className="p-6 rounded-xl border border-[rgba(0,255,255,0.15)] bg-[rgba(15,20,60,0.6)] backdrop-blur-sm transition hover:bg-[rgba(15,20,60,0.8)] hover:border-[rgba(0,255,255,0.3)]">
                  <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-[rgba(0,255,255,0.1)] mb-4">
                    <item.icon className="h-6 w-6 text-[#00FFFF]" />
                  </div>
                  <h3 className="text-lg font-semibold text-[#FFFFFF] mb-2">{item.title}</h3>
                  <p className="text-sm text-[#FFFFFF]/70 leading-relaxed">{item.desc}</p>
                </div>
              ))}
            </div>
          </section>

          {/* Code Example */}
          <section className="mb-20 max-w-3xl mx-auto">
            <h2 className="text-2xl md:text-3xl font-bold text-[#FFFFFF] text-center mb-8">Quick Start</h2>
            <p className="text-center text-[#FFFFFF]/70 mb-8">Get a virtual number and receive SMS in just a few lines of code.</p>

            <div className="rounded-xl border border-[rgba(0,255,255,0.2)] bg-[#0a0d2e] overflow-hidden">
              <div className="flex items-center gap-2 px-4 py-3 bg-[rgba(0,255,255,0.05)] border-b border-[rgba(0,255,255,0.1)]">
                <div className="w-3 h-3 rounded-full bg-red-500/80"></div>
                <div className="w-3 h-3 rounded-full bg-yellow-500/80"></div>
                <div className="w-3 h-3 rounded-full bg-green-500/80"></div>
                <span className="ml-2 text-xs text-[#FFFFFF]/50 font-mono">request.js</span>
              </div>
              <pre className="p-6 text-sm font-mono text-[#FFFFFF]/90 overflow-x-auto">
                <code>{`// Get a virtual number
const response = await fetch('https://api.zyrlent.com/v1/number', {
  method: 'POST',
  headers: {
    'Authorization': 'Bearer YOUR_API_KEY',
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    country: 'US',
    service: 'whatsapp'
  })
});

const { number, id } = await response.json();

// Check for incoming SMS
const sms = await fetch(\`https://api.zyrlent.com/v1/sms/\${id}\`, {
  headers: { 'Authorization': 'Bearer YOUR_API_KEY' }
});

const { code } = await sms.json();
console.log('Verification code:', code);`}</code>
              </pre>
            </div>
          </section>

          {/* Pricing Tiers */}
          <section className="mb-20">
            <h2 className="text-2xl md:text-3xl font-bold text-[#FFFFFF] text-center mb-4">Partner Plans</h2>
            <p className="text-center text-[#FFFFFF]/70 mb-12 max-w-xl mx-auto">Choose the plan that fits your integration needs. All plans include full API access.</p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
              {[
                {
                  name: 'Starter',
                  price: 'Free',
                  desc: 'For testing & small projects',
                  features: ['100 requests/day', '5 countries', 'Email support', 'Basic analytics'],
                  highlighted: false,
                },
                {
                  name: 'Professional',
                  price: '$49/mo',
                  desc: 'For growing businesses',
                  features: ['10,000 requests/day', '180+ countries', 'Priority support', 'Advanced analytics', 'Webhooks', 'IP whitelisting'],
                  highlighted: true,
                },
                {
                  name: 'Enterprise',
                  price: 'Custom',
                  desc: 'For large-scale operations',
                  features: ['Unlimited requests', '180+ countries', 'Dedicated support', 'Custom analytics', 'SLA guarantee', 'Dedicated account manager'],
                  highlighted: false,
                },
              ].map((plan, i) => (
                <div key={i} className={`p-8 rounded-2xl border backdrop-blur-sm flex flex-col ${plan.highlighted
                  ? 'border-[#00FFFF]/50 bg-[rgba(0,255,255,0.05)] shadow-[0_0_30px_rgba(0,255,255,0.1)]'
                  : 'border-[rgba(0,255,255,0.15)] bg-[rgba(15,20,60,0.6)]'
                  }`}>
                  {plan.highlighted && (
                    <div className="text-xs font-bold text-[#00FFFF] uppercase tracking-widest mb-4">Most Popular</div>
                  )}
                  <h3 className="text-xl font-bold text-[#FFFFFF]">{plan.name}</h3>
                  <div className="text-3xl font-bold text-[#00FFFF] mt-2">{plan.price}</div>
                  <p className="text-sm text-[#FFFFFF]/60 mt-2 mb-6">{plan.desc}</p>
                  <ul className="flex-grow space-y-3 mb-8">
                    {plan.features.map((feature, j) => (
                      <li key={j} className="flex items-center gap-2 text-sm text-[#FFFFFF]/80">
                        <Key className="h-4 w-4 text-[#00FFFF] flex-shrink-0" />
                        {feature}
                      </li>
                    ))}
                  </ul>
                  <Link
                    to="/signup"
                    className={`w-full py-3 rounded-lg font-semibold text-center transition ${plan.highlighted
                      ? 'bg-[#00FFFF] text-[#0A0B3D] hover:bg-[#33DDFF]'
                      : 'border border-[#FFFFFF]/30 text-[#FFFFFF] hover:bg-[#FFFFFF]/10'
                      }`}
                  >
                    Get Started
                  </Link>
                </div>
              ))}
            </div>
          </section>

          {/* CTA */}
          <section className="rounded-2xl border border-[rgba(0,255,255,0.2)] bg-gradient-to-br from-[rgba(15,20,60,0.9)] to-[rgba(10,11,61,0.95)] backdrop-blur-sm p-12 text-center max-w-4xl mx-auto relative overflow-hidden">
            <div className="absolute top-0 right-0 p-32 bg-[#00FFFF]/5 blur-[100px] rounded-full pointer-events-none"></div>
            <h2 className="text-3xl font-bold text-[#FFFFFF] relative z-10">Ready to Integrate?</h2>
            <p className="mt-4 text-[#FFFFFF]/80 max-w-lg mx-auto leading-relaxed relative z-10">
              Start building with the Zyrlent API today. Get your API key in seconds.
            </p>
            <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4 relative z-10">
              <Link to="/signup" className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-lg bg-[#FFFFFF] px-8 py-3 font-semibold text-[#0A0B3D] hover:bg-gray-100 transition">
                Get API Key
                <ArrowRight className="h-5 w-5" />
              </Link>
              <a href="#" className="w-full sm:w-auto rounded-lg border border-[#FFFFFF]/30 px-8 py-3 font-semibold text-[#FFFFFF] hover:bg-[#FFFFFF]/10 transition text-center">
                Read Documentation
              </a>
            </div>
          </section>

        </div>
      </main>

      <Footer />
    </div>
  )
}
