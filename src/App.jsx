'use client'

import { useState } from 'react'
import { ArrowRight, CheckCircle2, Zap, Shield, Globe } from 'lucide-react'
import bgImage from './assets/WhatsApp Image 2026-01-27 at 13.31.24.jpeg'

export default function Home() {
  const [navOpen, setNavOpen] = useState(false)

  return (
    <div className="min-h-screen w-full text-[#FFFFFF] overflow-hidden relative">
      {/* Background image (JPEG from assets) */}
      <div
        className="fixed inset-0 z-0 pointer-events-none bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: `url(${bgImage})` }}
        aria-hidden
      />
      {/* Dark overlay for readability (lets JPEG show through) */}
      <div
        className="fixed inset-0 z-0 pointer-events-none bg-gradient-to-b from-[#0A0B3D]/70 via-[#080a2e]/55 to-[#05082E]/75"
        aria-hidden
      />

      {/* Navigation */}
      <header className="relative z-10 border-b border-[rgba(0,255,255,0.2)] bg-[#0A0B3D]/90 backdrop-blur-md sticky top-0">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-5 md:px-6">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-r from-[#33CCFF] to-[#0099FF]">
              <span className="text-sm font-bold text-[#0A0B3D]">ZY</span>
            </div>
            <div className="flex flex-col">
              <span className="text-sm font-semibold bg-gradient-to-r from-[#33CCFF] to-[#0099FF] bg-clip-text text-transparent">ZYRLENT</span>
              <span className="text-xs text-[#FFFFFF]/80">SMS Verification</span>
            </div>
          </div>

          <nav className="hidden items-center gap-8 text-sm text-[#FFFFFF]/80 md:flex">
            <a href="#features" className="transition hover:text-[#FFFFFF]">
              Features
            </a>
            <a href="#trust" className="transition hover:text-[#FFFFFF]">
              Security
            </a>
            <a href="#pricing" className="transition hover:text-[#FFFFFF]">
              Pricing
            </a>
            <a href="#contact" className="transition hover:text-[#FFFFFF]">
              Contact
            </a>
          </nav>

          <div className="flex items-center gap-3">
            <button className="hidden rounded-lg border border-[rgba(0,255,255,0.3)] px-4 py-2 text-sm font-medium text-[#FFFFFF]/80 transition hover:text-[#FFFFFF] hover:border-[#00FFFF] md:inline-flex">
              Sign In
            </button>
            <button className="hidden rounded-lg bg-gradient-to-r from-[#3399FF] to-[#0066CC] px-4 py-2 text-sm font-semibold text-[#FFFFFF] shadow-lg shadow-[#3399FF]/40 transition hover:shadow-[#00FFFF]/40 md:inline-flex">
              Get Started
            </button>
            <button
              type="button"
              className="inline-flex h-10 w-10 items-center justify-center rounded-lg border border-[rgba(0,255,255,0.3)] bg-[rgba(15,20,60,0.8)] transition hover:bg-[#080a2e] md:hidden"
              aria-label="Toggle navigation"
              onClick={() => setNavOpen(!navOpen)}
            >
              <span className="relative block h-4 w-4">
                <span
                  className={`absolute inset-x-0 top-1 h-0.5 bg-[#FFFFFF] transition-transform duration-200 ${
                    navOpen ? 'translate-y-1.5 rotate-45' : ''
                  }`}
                />
                <span
                  className={`absolute inset-x-0 top-2 h-0.5 bg-[#FFFFFF] transition-opacity duration-200 ${
                    navOpen ? 'opacity-0' : 'opacity-100'
                  }`}
                />
                <span
                  className={`absolute inset-x-0 top-3 h-0.5 bg-[#FFFFFF] transition-transform duration-200 ${
                    navOpen ? '-translate-y-1.5 -rotate-45' : ''
                  }`}
                />
              </span>
            </button>
          </div>
        </div>

        {navOpen && (
          <div className="border-t border-[rgba(0,255,255,0.2)] bg-[rgba(15,20,60,0.9)] px-4 py-4 text-sm text-[#FFFFFF]/80 backdrop-blur-md md:hidden">
            <nav className="flex flex-col gap-3">
              <a href="#features" className="transition hover:text-[#FFFFFF]" onClick={() => setNavOpen(false)}>
                Features
              </a>
              <a href="#trust" className="transition hover:text-[#FFFFFF]" onClick={() => setNavOpen(false)}>
                Security
              </a>
              <a href="#pricing" className="transition hover:text-[#FFFFFF]" onClick={() => setNavOpen(false)}>
                Pricing
              </a>
              <a href="#contact" className="transition hover:text-[#FFFFFF]" onClick={() => setNavOpen(false)}>
                Contact
              </a>
            </nav>
          </div>
        )}
      </header>

      {/* Hero Section */}
      <main className="relative z-10">
        <div className="mx-auto flex max-w-7xl flex-col gap-16 px-4 py-20 md:px-6 md:py-32 lg:gap-20">
          {/* Hero Content */}
          <section className="flex flex-col items-center text-center max-w-3xl mx-auto">
            <div className="inline-flex items-center gap-2 rounded-full border border-[rgba(0,255,255,0.4)] bg-[rgba(0,255,255,0.08)] px-4 py-1.5 text-xs font-medium uppercase tracking-wide text-[#00FFFF]">
              <Zap className="h-3.5 w-3.5" />
              Enterprise-Grade Verification
            </div>

            <h1 className="mt-8 text-5xl font-bold tracking-tight text-[#FFFFFF] sm:text-6xl lg:text-7xl drop-shadow-[0_0_24px_rgba(0,255,255,0.4)]">
              Global SMS Verification, Built for Trust
            </h1>

            <p className="mt-6 text-lg leading-relaxed text-[#FFFFFF]/80 max-w-2xl">
              Fast, secure, and reliable number verification for African markets and global users. Only pay for successful codes with our innovative escrow billing system.
            </p>

            <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
              <button className="inline-flex items-center gap-2 rounded-lg bg-gradient-to-r from-[#3399FF] to-[#0066CC] px-7 py-3 font-semibold text-[#FFFFFF] shadow-xl shadow-[#3399FF]/40 transition hover:shadow-[#00FFFF]/40">
                Get Your Global Number
                <ArrowRight className="h-4 w-4" />
              </button>
              <button className="inline-flex items-center gap-2 rounded-lg border border-[rgba(0,255,255,0.4)] px-6 py-3 font-semibold text-[#FFFFFF] transition hover:bg-[rgba(15,20,60,0.8)]">
                View Documentation
              </button>
            </div>

            {/* Stats */}
            <div className="mt-12 grid grid-cols-2 gap-4 md:grid-cols-3 w-full">
              <div className="rounded-lg border border-[rgba(0,255,255,0.25)] bg-[rgba(15,20,60,0.8)] backdrop-blur-sm p-4">
                <div className="text-2xl font-bold text-[#00FFFF]">99.9%</div>
                <div className="mt-1 text-xs text-[#FFFFFF]/80">Uptime SLA</div>
              </div>
              <div className="rounded-lg border border-[rgba(0,255,255,0.25)] bg-[rgba(15,20,60,0.8)] backdrop-blur-sm p-4">
                <div className="text-2xl font-bold text-[#00FFFF]">2.1s</div>
                <div className="mt-1 text-xs text-[#FFFFFF]/80">Avg Delivery</div>
              </div>
              <div className="rounded-lg border border-[rgba(0,255,255,0.25)] bg-[rgba(15,20,60,0.8)] backdrop-blur-sm p-4">
                <div className="text-2xl font-bold text-[#00FFFF]">150+</div>
                <div className="mt-1 text-xs text-[#FFFFFF]/80">Countries</div>
              </div>
            </div>
          </section>

          {/* Feature Grid */}
          <section id="features" className="mt-8">
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
              {[
                {
                  icon: Shield,
                  title: 'Escrow Billing',
                  desc: 'Pay only for successful codes. Instant refunds if delivery fails within 5 minutes.',
                },
                {
                  icon: Zap,
                  title: 'Lightning Fast',
                  desc: 'Average delivery in 2.1 seconds with intelligent routing across global networks.',
                },
                {
                  icon: Globe,
                  title: 'Global Coverage',
                  desc: 'Access numbers from 150+ countries including African, US, UK, and EU regions.',
                },
                {
                  icon: CheckCircle2,
                  title: 'Multi-Platform',
                  desc: 'Receive codes via Web, WhatsApp, or Telegram. Low data, high convenience.',
                },
                {
                  icon: Shield,
                  title: 'Enterprise Security',
                  desc: 'Bank-level encryption, 99.9% uptime SLA, and dedicated support.',
                },
                {
                  icon: Zap,
                  title: 'Referral Program',
                  desc: 'Earn N200 for each referred user who funds. Turn users into partners.',
                },
              ].map((feature, i) => {
                const Icon = feature.icon
                return (
                  <div
                    key={i}
                    className="group rounded-xl border border-[rgba(0,255,255,0.25)] bg-[rgba(15,20,60,0.8)] backdrop-blur-sm p-6 transition hover:border-[#00FFFF]/50 hover:bg-[#080a2e]"
                  >
                    <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-[rgba(0,255,255,0.1)]">
                      <Icon className="h-6 w-6 text-[#00FFFF]" />
                    </div>
                    <h3 className="mt-4 text-lg font-semibold text-[#FFFFFF]">{feature.title}</h3>
                    <p className="mt-2 text-sm text-[#FFFFFF]/80">{feature.desc}</p>
                  </div>
                )
              })}
            </div>
          </section>

          {/* Trust Section */}
          <section id="trust" className="mt-12 rounded-xl border border-[rgba(0,255,255,0.25)] bg-[rgba(15,20,60,0.8)] backdrop-blur-sm p-8 md:p-12">
            <h2 className="text-3xl font-bold text-[#FFFFFF]">Why Teams Trust Us</h2>
            <p className="mt-2 text-[#FFFFFF]/80">
              Built for developers who demand reliability, transparency, and exceptional performance.
            </p>

            <div className="mt-8 grid grid-cols-1 gap-6 md:grid-cols-2">
              {[
                { title: 'No Hidden Charges', desc: 'Transparent pricing with no surprise fees. Only pay for successful deliveries.' },
                { title: 'Developer Friendly', desc: 'Simple REST API, comprehensive docs, and SDK support for all platforms.' },
                { title: 'Instant Refunds', desc: 'Automatic refunds within 5 minutes if SMS delivery fails. No tickets needed.' },
                { title: 'Dedicated Support', desc: '24/7 enterprise support with average response time under 1 hour.' },
              ].map((item, i) => (
                <div key={i} className="flex gap-4">
                  <div className="flex-shrink-0">
                    <CheckCircle2 className="h-5 w-5 text-[#00FFFF] mt-0.5" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-[#FFFFFF]">{item.title}</h3>
                    <p className="mt-1 text-sm text-[#FFFFFF]/80">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* CTA Section */}
          <section className="mt-12 rounded-xl border border-[rgba(0,255,255,0.25)] bg-[rgba(15,20,60,0.8)] backdrop-blur-sm p-8 md:p-12 text-center">
            <h2 className="text-3xl font-bold text-[#FFFFFF]">Ready to Verify?</h2>
            <p className="mt-2 text-[#FFFFFF]/80">Join thousands of developers and teams building with ZYRLENT</p>
            <button className="mt-6 rounded-lg bg-gradient-to-r from-[#3399FF] to-[#0066CC] px-8 py-3 font-semibold text-[#FFFFFF] shadow-lg shadow-[#3399FF]/40 transition hover:shadow-[#00FFFF]/40">
              Get Started Free
            </button>
          </section>
        </div>
      </main>

      {/* Footer */}
      <footer className="relative z-10 border-t border-[rgba(0,255,255,0.2)] bg-[#0A0B3D]/90 backdrop-blur-md py-8 md:py-12">
        <div className="mx-auto max-w-7xl px-4 md:px-6">
          <div className="grid grid-cols-2 gap-8 md:grid-cols-4">
            <div>
              <h4 className="font-semibold text-[#FFFFFF]">Product</h4>
              <ul className="mt-4 space-y-2 text-sm text-[#FFFFFF]/80">
                <li>
                  <a href="#" className="transition hover:text-[#FFFFFF]">
                    Features
                  </a>
                </li>
                <li>
                  <a href="#" className="transition hover:text-[#FFFFFF]">
                    Pricing
                  </a>
                </li>
                <li>
                  <a href="#" className="transition hover:text-[#FFFFFF]">
                    Security
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-[#FFFFFF]">Developers</h4>
              <ul className="mt-4 space-y-2 text-sm text-[#FFFFFF]/80">
                <li>
                  <a href="#" className="transition hover:text-[#FFFFFF]">
                    Documentation
                  </a>
                </li>
                <li>
                  <a href="#" className="transition hover:text-[#FFFFFF]">
                    API Reference
                  </a>
                </li>
                <li>
                  <a href="#" className="transition hover:text-[#FFFFFF]">
                    Changelog
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-[#FFFFFF]">Company</h4>
              <ul className="mt-4 space-y-2 text-sm text-[#FFFFFF]/80">
                <li>
                  <a href="#" className="transition hover:text-[#FFFFFF]">
                    About
                  </a>
                </li>
                <li>
                  <a href="#" className="transition hover:text-[#FFFFFF]">
                    Blog
                  </a>
                </li>
                <li>
                  <a href="#" className="transition hover:text-[#FFFFFF]">
                    Contact
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-[#FFFFFF]">Legal</h4>
              <ul className="mt-4 space-y-2 text-sm text-[#FFFFFF]/80">
                <li>
                  <a href="#" className="transition hover:text-[#FFFFFF]">
                    Privacy
                  </a>
                </li>
                <li>
                  <a href="#" className="transition hover:text-[#FFFFFF]">
                    Terms
                  </a>
                </li>
                <li>
                  <a href="#" className="transition hover:text-[#FFFFFF]">
                    Status
                  </a>
                </li>
              </ul>
            </div>
          </div>
          <div className="mt-8 border-t border-[rgba(0,255,255,0.15)] pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-sm text-[#FFFFFF]">
            <div className="flex items-center gap-2">
              <span className="font-semibold bg-gradient-to-r from-[#33CCFF] to-[#0099FF] bg-clip-text text-transparent">ZYRLENT</span>
              <span className="text-[#FFFFFF]/50">|</span>
              <span className="text-[#FFFFFF]/80">© 2024 ZYRLENT. All rights reserved.</span>
            </div>
            <div className="flex items-center gap-4">
              <a href="#" className="transition hover:text-[#00FFFF] text-[#FFFFFF]/80">
                Support
              </a>
              <span className="text-[#FFFFFF]/50">|</span>
              <a href="#" className="transition hover:text-[#00FFFF] text-[#FFFFFF]/80">
                API Docs
              </a>
              <span className="text-[#FFFFFF]/50">|</span>
              <a href="#" className="transition hover:text-[#00FFFF] text-[#FFFFFF]/80">
                Privacy Policy
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
