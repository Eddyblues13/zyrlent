'use client'

import { Shield, Zap, Globe, CheckCircle2, Gift, Lock, Smartphone, RefreshCw, Clock, Headphones, CreditCard, Users, ArrowRight } from 'lucide-react'
import { Link } from 'react-router-dom'
import Background from '../../components/Background'
import Navbar from '../../components/Navbar'
import Footer from '../../components/Footer'

export default function Features() {
  return (
    <div className="min-h-screen w-full text-[#FFFFFF] overflow-hidden relative">
      <Background />
      <Navbar />

      <main className="relative z-10">
        <div className="mx-auto max-w-7xl px-4 py-16 md:px-6 md:py-20">

          {/* Hero */}
          <section className="text-center max-w-3xl mx-auto mb-20">
            <div className="inline-flex items-center gap-2 rounded-full border border-[rgba(0,255,255,0.4)] bg-[rgba(0,255,255,0.08)] px-5 py-2 text-sm font-medium text-[#00FFFF] mb-6">
              <Zap className="h-4 w-4 fill-current" />
              Powerful Features
            </div>
            <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-[#FFFFFF] drop-shadow-[0_0_24px_rgba(0,255,255,0.4)]">
              Everything You Need for <span className="text-[#00FFFF]">SMS Verification</span>
            </h1>
            <p className="mt-6 text-lg text-[#FFFFFF]/70 leading-relaxed max-w-2xl mx-auto">
              Zyrlent provides a comprehensive suite of features designed to make virtual number verification fast, secure, and effortless.
            </p>
          </section>

          {/* Core Features Grid */}
          <section className="mb-20">
            <h2 className="text-2xl md:text-3xl font-bold text-[#FFFFFF] text-center mb-12">Core Features</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[
                {
                  icon: Shield,
                  title: 'Escrow Billing',
                  desc: 'Pay only when you receive a code. If the SMS doesn\'t arrive within 7 minutes, you get an instant refund. Zero risk.',
                  color: 'text-[#00FF00]'
                },
                {
                  icon: Zap,
                  title: 'Lightning Fast Delivery',
                  desc: 'Average SMS delivery in just 2.1 seconds. Our intelligent routing selects the fastest path across global carrier networks.',
                  color: 'text-[#FFFF00]'
                },
                {
                  icon: Globe,
                  title: '180+ Countries',
                  desc: 'Access virtual numbers from over 180 countries including US, UK, EU, African, and Asian regions. True global coverage.',
                  color: 'text-[#00BFFF]'
                },
                {
                  icon: Lock,
                  title: 'Bank-Level Security',
                  desc: 'End-to-end encryption protects your data. Your numbers are private and never shared with other users.',
                  color: 'text-[#BD00FF]'
                },
                {
                  icon: Smartphone,
                  title: 'Multi-Platform Support',
                  desc: 'Verify on WhatsApp, Telegram, Facebook, Instagram, Twitter, Google, and 600+ other platforms seamlessly.',
                  color: 'text-[#00FFFF]'
                },
                {
                  icon: RefreshCw,
                  title: 'Auto-Retry System',
                  desc: 'If a number doesn\'t work, our system automatically assigns a new one. No manual effort required.',
                  color: 'text-[#FF6B6B]'
                },
                {
                  icon: Clock,
                  title: '99.9% Uptime SLA',
                  desc: 'Enterprise-grade infrastructure with guaranteed uptime. Your verifications never stop working.',
                  color: 'text-[#FFA500]'
                },
                {
                  icon: Headphones,
                  title: '24/7 Support',
                  desc: 'Dedicated support team available round the clock. Get help via live chat, email, or our community.',
                  color: 'text-[#4CAF50]'
                },
                {
                  icon: CreditCard,
                  title: 'Flexible Payments',
                  desc: 'Fund your account with cards, bank transfers, crypto, and local payment methods. Easy and secure.',
                  color: 'text-[#E91E63]'
                },
              ].map((item, i) => (
                <div key={i} className="p-6 rounded-xl border border-[rgba(0,255,255,0.15)] bg-[rgba(15,20,60,0.6)] backdrop-blur-sm transition hover:bg-[rgba(15,20,60,0.8)] hover:border-[rgba(0,255,255,0.3)] hover:scale-[1.02]">
                  <div className={`flex h-12 w-12 items-center justify-center rounded-lg bg-[rgba(0,255,255,0.1)] mb-4`}>
                    <item.icon className={`h-6 w-6 ${item.color}`} />
                  </div>
                  <h3 className="text-lg font-semibold text-[#FFFFFF] mb-2">{item.title}</h3>
                  <p className="text-sm text-[#FFFFFF]/70 leading-relaxed">{item.desc}</p>
                </div>
              ))}
            </div>
          </section>

          {/* Supported Platforms */}
          <section className="mb-20 max-w-4xl mx-auto">
            <h2 className="text-2xl md:text-3xl font-bold text-[#FFFFFF] text-center mb-4">Supported Platforms</h2>
            <p className="text-center text-[#FFFFFF]/70 mb-12">Verify on 600+ services. Here are some of the most popular ones.</p>

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
              {[
                'WhatsApp', 'Telegram', 'Facebook', 'Instagram',
                'Twitter / X', 'Google', 'TikTok', 'Snapchat',
                'Discord', 'PayPal', 'Amazon', 'Microsoft',
                'LinkedIn', 'Uber', 'Netflix', 'And 600+ more'
              ].map((platform, i) => (
                <div key={i} className={`py-4 px-4 rounded-xl border text-center text-sm font-medium transition ${i === 15
                  ? 'border-[#00FFFF]/40 bg-[rgba(0,255,255,0.1)] text-[#00FFFF]'
                  : 'border-[rgba(0,255,255,0.15)] bg-[rgba(15,20,60,0.5)] text-[#FFFFFF]/80 hover:bg-[rgba(15,20,60,0.8)] hover:border-[rgba(0,255,255,0.3)]'
                  }`}>
                  {platform}
                </div>
              ))}
            </div>
          </section>

          {/* Referral Program */}
          <section className="mb-20 max-w-4xl mx-auto">
            <div className="rounded-2xl border border-[rgba(0,255,255,0.2)] bg-[rgba(15,20,60,0.6)] backdrop-blur-sm p-10 md:p-14">
              <div className="flex flex-col md:flex-row items-center gap-8">
                <div className="flex-shrink-0">
                  <div className="w-20 h-20 rounded-2xl bg-[rgba(0,255,255,0.1)] flex items-center justify-center">
                    <Gift className="h-10 w-10 text-[#00FFFF]" />
                  </div>
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-[#FFFFFF] mb-3">Referral Program</h3>
                  <p className="text-[#FFFFFF]/70 leading-relaxed mb-4">
                    Earn <span className="text-[#00FFFF] font-bold">20% credits</span> every time a friend you refer funds ₦10,000 or more. Share your unique referral link and start earning today.
                  </p>
                  <div className="flex flex-wrap gap-4">
                    <div className="flex items-center gap-2 text-sm text-[#FFFFFF]/80">
                      <Users className="h-4 w-4 text-[#00FFFF]" />
                      Unlimited referrals
                    </div>
                    <div className="flex items-center gap-2 text-sm text-[#FFFFFF]/80">
                      <CheckCircle2 className="h-4 w-4 text-[#00FFFF]" />
                      Instant credit
                    </div>
                    <div className="flex items-center gap-2 text-sm text-[#FFFFFF]/80">
                      <Gift className="h-4 w-4 text-[#00FFFF]" />
                      No cap on earnings
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* CTA */}
          <section className="rounded-2xl border border-[rgba(0,255,255,0.2)] bg-gradient-to-br from-[rgba(15,20,60,0.9)] to-[rgba(10,11,61,0.95)] backdrop-blur-sm p-12 text-center max-w-4xl mx-auto relative overflow-hidden">
            <div className="absolute top-0 right-0 p-32 bg-[#00FFFF]/5 blur-[100px] rounded-full pointer-events-none"></div>
            <h2 className="text-3xl font-bold text-[#FFFFFF] relative z-10">Start Verifying Today</h2>
            <p className="mt-4 text-[#FFFFFF]/80 max-w-lg mx-auto leading-relaxed relative z-10">
              Join millions of users who trust Zyrlent for fast, private, and reliable SMS verification.
            </p>
            <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4 relative z-10">
              <Link to="/signup" className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-lg bg-[#FFFFFF] px-8 py-3 font-semibold text-[#0A0B3D] hover:bg-gray-100 transition">
                Get Started Free
                <ArrowRight className="h-5 w-5" />
              </Link>
              <Link to="/login" className="w-full sm:w-auto rounded-lg border border-[#FFFFFF]/30 px-8 py-3 font-semibold text-[#FFFFFF] hover:bg-[#FFFFFF]/10 transition text-center">
                Sign In
              </Link>
            </div>
          </section>

        </div>
      </main>

      <Footer />
    </div>
  )
}
