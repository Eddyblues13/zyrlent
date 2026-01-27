'use client'

import { useState } from 'react'
import { ArrowRight, CheckCircle2, Zap, Shield, Globe } from 'lucide-react'

export default function Home() {
  const [navOpen, setNavOpen] = useState(false)

  return (
    <div className="min-h-screen w-full bg-gradient-to-b from-sky-950 via-slate-950 to-sky-900 text-white overflow-hidden">
      {/* Navigation */}
      <header className="relative z-10 border-b border-sky-800 bg-sky-950/80 backdrop-blur-md sticky top-0">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-5 md:px-6">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-cyan-500">
              <span className="text-sm font-bold text-slate-950">ZY</span>
            </div>
            <div className="flex flex-col">
              <span className="text-sm font-semibold">ZYRLENT</span>
              <span className="text-xs text-slate-400">SMS Verification</span>
            </div>
          </div>

          <nav className="hidden items-center gap-8 text-sm text-slate-400 md:flex">
            <a href="#features" className="transition hover:text-white">
              Features
            </a>
            <a href="#trust" className="transition hover:text-white">
              Security
            </a>
            <a href="#pricing" className="transition hover:text-white">
              Pricing
            </a>
            <a href="#contact" className="transition hover:text-white">
              Contact
            </a>
          </nav>

          <div className="flex items-center gap-3">
            <button className="hidden rounded-lg border border-sky-700 px-4 py-2 text-sm font-medium text-slate-200 transition hover:text-white hover:border-cyan-500/60 md:inline-flex">
              Sign In
            </button>
            <button className="hidden rounded-lg bg-cyan-500 px-4 py-2 text-sm font-semibold text-slate-950 transition hover:bg-cyan-400 md:inline-flex">
              Get Started
            </button>
            <button
              type="button"
              className="inline-flex h-10 w-10 items-center justify-center rounded-lg border border-sky-700 bg-sky-900 transition hover:bg-sky-800 md:hidden"
              aria-label="Toggle navigation"
              onClick={() => setNavOpen(!navOpen)}
            >
              <span className="relative block h-4 w-4">
                <span
                  className={`absolute inset-x-0 top-1 h-0.5 bg-white transition-transform duration-200 ${
                    navOpen ? 'translate-y-1.5 rotate-45' : ''
                  }`}
                />
                <span
                  className={`absolute inset-x-0 top-2 h-0.5 bg-white transition-opacity duration-200 ${
                    navOpen ? 'opacity-0' : 'opacity-100'
                  }`}
                />
                <span
                  className={`absolute inset-x-0 top-3 h-0.5 bg-white transition-transform duration-200 ${
                    navOpen ? '-translate-y-1.5 -rotate-45' : ''
                  }`}
                />
              </span>
            </button>
          </div>
        </div>

        {navOpen && (
          <div className="border-t border-sky-800 bg-sky-950/70 px-4 py-4 text-sm text-slate-200 backdrop-blur-md md:hidden">
            <nav className="flex flex-col gap-3">
              <a href="#features" className="transition hover:text-white" onClick={() => setNavOpen(false)}>
                Features
              </a>
              <a href="#trust" className="transition hover:text-white" onClick={() => setNavOpen(false)}>
                Security
              </a>
              <a href="#pricing" className="transition hover:text-white" onClick={() => setNavOpen(false)}>
                Pricing
              </a>
              <a href="#contact" className="transition hover:text-white" onClick={() => setNavOpen(false)}>
                Contact
              </a>
            </nav>
          </div>
        )}
      </header>

      {/* Hero Section */}
      <main className="relative">
        <div className="mx-auto flex max-w-7xl flex-col gap-16 px-4 py-20 md:px-6 md:py-32 lg:gap-20">
          {/* Hero Content */}
          <section className="flex flex-col items-center text-center max-w-3xl mx-auto">
            <div className="inline-flex items-center gap-2 rounded-full border border-cyan-500/20 bg-cyan-500/10 px-4 py-1.5 text-xs font-medium uppercase tracking-wide text-cyan-400">
              <Zap className="h-3.5 w-3.5" />
              Enterprise-Grade Verification
            </div>

            <h1 className="mt-8 text-5xl font-bold tracking-tight text-white sm:text-6xl lg:text-7xl">
              Global SMS Verification, Built for Trust
            </h1>

            <p className="mt-6 text-lg leading-relaxed text-slate-400 max-w-2xl">
              Fast, secure, and reliable number verification for African markets and global users. Only pay for successful codes with our innovative escrow billing system.
            </p>

            <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
              <button className="inline-flex items-center gap-2 rounded-lg bg-cyan-500 px-6 py-3 font-semibold text-slate-950 transition hover:bg-cyan-400">
                Start Verifying
                <ArrowRight className="h-4 w-4" />
              </button>
              <button className="inline-flex items-center gap-2 rounded-lg border border-cyan-500/30 px-6 py-3 font-semibold text-white transition hover:border-cyan-500/60 hover:bg-cyan-500/5">
                View Documentation
              </button>
            </div>

            {/* Stats */}
            <div className="mt-12 grid grid-cols-2 gap-4 md:grid-cols-3 w-full">
              <div className="rounded-lg border border-sky-800 bg-sky-950/60 backdrop-blur-sm p-4">
                <div className="text-2xl font-bold text-cyan-400">99.9%</div>
                <div className="mt-1 text-xs text-slate-400">Uptime SLA</div>
              </div>
              <div className="rounded-lg border border-sky-800 bg-sky-950/60 backdrop-blur-sm p-4">
                <div className="text-2xl font-bold text-cyan-400">2.1s</div>
                <div className="mt-1 text-xs text-slate-400">Avg Delivery</div>
              </div>
              <div className="rounded-lg border border-sky-800 bg-sky-950/60 backdrop-blur-sm p-4">
                <div className="text-2xl font-bold text-cyan-400">150+</div>
                <div className="mt-1 text-xs text-slate-400">Countries</div>
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
                    className="group rounded-xl border border-sky-800 bg-sky-950/60 backdrop-blur-sm p-6 transition hover:border-cyan-500/40 hover:bg-sky-950/80"
                  >
                    <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-cyan-500/10">
                      <Icon className="h-6 w-6 text-cyan-400" />
                    </div>
                    <h3 className="mt-4 text-lg font-semibold text-white">{feature.title}</h3>
                    <p className="mt-2 text-sm text-slate-400">{feature.desc}</p>
                  </div>
                )
              })}
            </div>
          </section>

          {/* Trust Section */}
          <section id="trust" className="mt-12 rounded-xl border border-sky-800 bg-sky-950/60 backdrop-blur-sm p-8 md:p-12">
            <h2 className="text-3xl font-bold text-white">Why Teams Trust Us</h2>
            <p className="mt-2 text-slate-400">
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
                    <CheckCircle2 className="h-5 w-5 text-cyan-400 mt-0.5" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-white">{item.title}</h3>
                    <p className="mt-1 text-sm text-slate-400">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* CTA Section */}
          <section className="mt-12 rounded-xl border border-sky-800 bg-sky-950/60 backdrop-blur-sm p-8 md:p-12 text-center">
            <h2 className="text-3xl font-bold text-white">Ready to Verify?</h2>
            <p className="mt-2 text-slate-400">Join thousands of developers and teams building with ZYRLENT</p>
            <button className="mt-6 rounded-lg bg-cyan-500 px-8 py-3 font-semibold text-slate-950 transition hover:bg-cyan-400">
              Get Started Free
            </button>
          </section>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-sky-800 bg-sky-950/80 backdrop-blur-md py-8 md:py-12">
        <div className="mx-auto max-w-7xl px-4 md:px-6">
          <div className="grid grid-cols-2 gap-8 md:grid-cols-4">
            <div>
              <h4 className="font-semibold text-white">Product</h4>
              <ul className="mt-4 space-y-2 text-sm text-slate-400">
                <li>
                  <a href="#" className="transition hover:text-white">
                    Features
                  </a>
                </li>
                <li>
                  <a href="#" className="transition hover:text-white">
                    Pricing
                  </a>
                </li>
                <li>
                  <a href="#" className="transition hover:text-white">
                    Security
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-white">Developers</h4>
              <ul className="mt-4 space-y-2 text-sm text-slate-400">
                <li>
                  <a href="#" className="transition hover:text-white">
                    Documentation
                  </a>
                </li>
                <li>
                  <a href="#" className="transition hover:text-white">
                    API Reference
                  </a>
                </li>
                <li>
                  <a href="#" className="transition hover:text-white">
                    Changelog
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-white">Company</h4>
              <ul className="mt-4 space-y-2 text-sm text-slate-400">
                <li>
                  <a href="#" className="transition hover:text-white">
                    About
                  </a>
                </li>
                <li>
                  <a href="#" className="transition hover:text-white">
                    Blog
                  </a>
                </li>
                <li>
                  <a href="#" className="transition hover:text-white">
                    Contact
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-white">Legal</h4>
              <ul className="mt-4 space-y-2 text-sm text-slate-400">
                <li>
                  <a href="#" className="transition hover:text-white">
                    Privacy
                  </a>
                </li>
                <li>
                  <a href="#" className="transition hover:text-white">
                    Terms
                  </a>
                </li>
                <li>
                  <a href="#" className="transition hover:text-white">
                    Status
                  </a>
                </li>
              </ul>
            </div>
          </div>
          <div className="mt-8 border-t border-slate-800 pt-8 flex items-center justify-between text-sm text-slate-400">
            <div>© 2024 ZYRLENT. All rights reserved.</div>
            <div className="flex gap-6">
              <a href="#" className="transition hover:text-white">
                Twitter
              </a>
              <a href="#" className="transition hover:text-white">
                LinkedIn
              </a>
              <a href="#" className="transition hover:text-white">
                GitHub
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
