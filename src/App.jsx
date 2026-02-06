'use client'

import { useState } from 'react'
import { ArrowRight, CheckCircle2, Zap, Shield, Globe, Gift, UserPlus, CreditCard, Smartphone, MessageSquare, Star } from 'lucide-react'
import bgImage from './assets/background.jpg'
import phoneImage from './assets/phone.jpg'

export default function Home() {
  const [navOpen, setNavOpen] = useState(false)

  return (
    <div className="min-h-screen w-full text-[#FFFFFF] overflow-hidden relative">
      {/* Background image (JPEG from assets) */}
      <div
        className="fixed inset-0 z-0 pointer-events-none bg-cover bg-center bg-no-repeat blur-[2px]"
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
            <a href="#" className="transition hover:text-[#FFFFFF]">
              Home
            </a>
            <a href="#partners" className="transition hover:text-[#FFFFFF]">
              Partners (API)
            </a>
            <a href="#features" className="transition hover:text-[#FFFFFF]">
              Features
            </a>
            <a href="#how-it-works" className="transition hover:text-[#FFFFFF]">
              How it works
            </a>
            <a href="#reviews" className="transition hover:text-[#FFFFFF]">
              Reviews
            </a>
          </nav>

          <div className="flex items-center gap-3">
            <button className="hidden rounded-full border border-[rgba(0,255,255,0.2)] bg-[rgba(15,20,60,0.4)] px-6 py-2 text-sm font-medium text-[#FFFFFF] transition hover:border-[#00FFFF]/50 hover:bg-[rgba(0,255,255,0.1)] md:inline-flex">
              Sign In
            </button>
            <button className="hidden rounded-full bg-gradient-to-r from-[#33CCFF] to-[#0099FF] px-6 py-2 text-sm font-bold text-[#FFFFFF] shadow-[0_0_15px_rgba(0,255,255,0.4)] transition transform hover:scale-105 hover:shadow-[0_0_25px_rgba(0,255,255,0.6)] md:inline-flex">
              Get verified
            </button>
            <button
              type="button"
              className="inline-flex h-10 w-10 items-center justify-center rounded-lg border border-[rgba(0,255,255,0.3)] bg-[rgba(15,20,60,0.8)] transition hover:bg-[#080a2e] md:hidden"
              aria-label="Toggle navigation"
              onClick={() => setNavOpen(!navOpen)}
            >
              <span className="relative block h-4 w-4">
                <span
                  className={`absolute inset-x-0 top-1 h-0.5 bg-[#FFFFFF] transition-transform duration-200 ${navOpen ? 'translate-y-1.5 rotate-45' : ''
                    }`}
                />
                <span
                  className={`absolute inset-x-0 top-2 h-0.5 bg-[#FFFFFF] transition-opacity duration-200 ${navOpen ? 'opacity-0' : 'opacity-100'
                    }`}
                />
                <span
                  className={`absolute inset-x-0 top-3 h-0.5 bg-[#FFFFFF] transition-transform duration-200 ${navOpen ? '-translate-y-1.5 -rotate-45' : ''
                    }`}
                />
              </span>
            </button>
          </div>
        </div>

        {navOpen && (
          <div className="border-t border-[rgba(0,255,255,0.2)] bg-[rgba(15,20,60,0.9)] px-4 py-4 text-sm text-[#FFFFFF]/80 backdrop-blur-md md:hidden">
            <nav className="flex flex-col">
              <a href="#" className="border-b border-[rgba(0,255,255,0.1)] py-3 text-base font-medium transition hover:text-[#00FFFF] hover:pl-2" onClick={() => setNavOpen(false)}>
                Home
              </a>
              <a href="#partners" className="border-b border-[rgba(0,255,255,0.1)] py-3 text-base font-medium transition hover:text-[#00FFFF] hover:pl-2" onClick={() => setNavOpen(false)}>
                Partners (API)
              </a>
              <a href="#features" className="border-b border-[rgba(0,255,255,0.1)] py-3 text-base font-medium transition hover:text-[#00FFFF] hover:pl-2" onClick={() => setNavOpen(false)}>
                Features
              </a>
              <a href="#how-it-works" className="border-b border-[rgba(0,255,255,0.1)] py-3 text-base font-medium transition hover:text-[#00FFFF] hover:pl-2" onClick={() => setNavOpen(false)}>
                How it works
              </a>
              <a href="#reviews" className="border-b border-[rgba(0,255,255,0.1)] py-3 text-base font-medium transition hover:text-[#00FFFF] hover:pl-2" onClick={() => setNavOpen(false)}>
                Reviews
              </a>
              <div className="mt-4 flex flex-col gap-3">
                <button
                  className="rounded-full border border-[rgba(0,255,255,0.2)] bg-[rgba(15,20,60,0.4)] px-6 py-2 text-sm font-medium text-[#FFFFFF] transition hover:border-[#00FFFF]/50 hover:bg-[rgba(0,255,255,0.1)]"
                  onClick={() => setNavOpen(false)}
                >
                  Sign In
                </button>
                <button
                  className="rounded-full bg-gradient-to-r from-[#33CCFF] to-[#0099FF] px-6 py-2 text-sm font-bold text-[#FFFFFF] shadow-[0_0_15px_rgba(0,255,255,0.4)] transition transform hover:scale-105 hover:shadow-[0_0_25px_rgba(0,255,255,0.6)]"
                  onClick={() => setNavOpen(false)}
                >
                  Get verified
                </button>
              </div>
            </nav>
          </div>
        )}
      </header>

      {/* Hero Section */}
      <main className="relative z-10">
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
                <Shield className="h-5 w-5 text-[#00FFFF]" />
                Secure
              </div>
              <div className="flex items-center gap-2">
                <Zap className="h-5 w-5 text-[#00FFFF]" />
                Fast
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="h-5 w-5 text-[#00FFFF]" />
                Reliable
              </div>
            </div>

            <p className="mt-6 text-lg leading-relaxed text-[#FFFFFF]/80 max-w-2xl mx-auto">
              Secure your digital presence with our instant SMS verification using private, reliable virtual numbers worldwide.
            </p>

            <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4 w-full sm:w-auto">
              <button className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-full bg-[#FFFFFF] px-8 py-3.5 font-bold text-[#0A0B3D] hover:bg-gray-100 transition shadow-[0_0_20px_rgba(255,255,255,0.3)]">
                Get verified
                <ArrowRight className="h-5 w-5" />
              </button>
              <button className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-full border border-[rgba(255,255,255,0.3)] px-8 py-3.5 font-bold text-[#FFFFFF] transition hover:bg-[rgba(255,255,255,0.1)]">
                Sign in
              </button>
            </div>
          </section>

          {/* Middle Visual - Phone */}
          <section className="relative mx-auto mt-4 max-w-[450px] w-full">
            {/* Phone Container - Replaced with Image */}
            <div className="relative z-10 mx-auto w-full rounded-[2.5rem] shadow-xl overflow-hidden">
              <img src={phoneImage} alt="App Interface" className="w-full h-auto object-cover" />
            </div>

            {/* Glowing effect behind phone */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-[#00FFFF]/20 blur-3xl -z-10 rounded-full"></div>

            {/* Floating Labels */}
            <div className="absolute top-4 -right-4 sm:-right-8 bg-[#0A0B3D] border border-[#00FFFF]/30 px-4 py-2 rounded-xl shadow-lg backdrop-blur-md animate-bounce [animation-delay:0ms] z-20">
              <span className="text-[#00FFFF] font-bold text-sm">Fast</span>
            </div>

            <div className="absolute top-1/2 -right-4 sm:-right-8 transform -translate-y-1/2 bg-[#0A0B3D] border border-[#00FFFF]/30 px-4 py-2 rounded-xl shadow-lg backdrop-blur-md animate-bounce [animation-delay:150ms] z-20">
              <span className="text-[#00FFFF] font-bold text-sm">Secure</span>
            </div>

            <div className="absolute bottom-4 -left-4 sm:-left-8 bg-[#0A0B3D] border border-[#00FFFF]/30 px-4 py-2 rounded-xl shadow-lg backdrop-blur-md animate-bounce [animation-delay:300ms] z-20">
              <span className="text-[#00FFFF] font-bold text-sm">Reliable</span>
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
                  desc: 'Earn 10% credits when your friends fund ₦2000 or more'
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
              {/* Connecting Line (Desktop) */}
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

          {/* Ready to Verify Section */}
          <section className="mt-12 mb-20 rounded-2xl border border-[rgba(0,255,255,0.2)] bg-gradient-to-br from-[rgba(15,20,60,0.9)] to-[rgba(10,11,61,0.95)] backdrop-blur-sm p-12 text-center max-w-4xl mx-auto relative overflow-hidden">
            <div className="absolute top-0 right-0 p-32 bg-[#00FFFF]/5 blur-[100px] rounded-full pointer-events-none"></div>

            <h2 className="text-3xl font-bold text-[#FFFFFF] relative z-10">Ready to Verify?</h2>
            <p className="mt-4 text-[#FFFFFF]/80 max-w-lg mx-auto leading-relaxed relative z-10">
              Join millions of happy users who rely on zyrlent for instant verification needs
            </p>
            <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4 relative z-10">
              <button className="w-full sm:w-auto rounded-lg bg-[#FFFFFF] px-8 py-3 font-semibold text-[#0A0B3D] hover:bg-gray-100 transition">
                Get verified
              </button>
              <button className="w-full sm:w-auto rounded-lg border border-[#FFFFFF]/30 px-8 py-3 font-semibold text-[#FFFFFF] hover:bg-[#FFFFFF]/10 transition">
                Sign in
              </button>
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
                  quote: "A total game-changer for our cross-platform testing! The API is flawlessly engineered, but what truly sets them apart is a support team that’s as fast as their code, always there when we need them.",
                  name: "Tyler Max",
                  role: "Elite",
                  initials: "TM"
                },
                {
                  quote: "The process is so simple, I pick a number, get the code, and I’m verified. No stress at all.",
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
