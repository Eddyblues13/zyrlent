import Background from '../../components/Background'
import Navbar from '../../components/Navbar'
import Footer from '../../components/Footer'
import { FileText, ShieldCheck } from 'lucide-react'

export default function PrivacyPolicy() {
  return (
    <div className="min-h-screen font-sans text-white bg-[#0A0B3D] selection:bg-[#00FFFF] selection:text-black">
      <Background />
      <Navbar />

      <main className="relative z-10 pt-32 pb-24 px-4 sm:px-6">
        <div className="mx-auto max-w-4xl">
          {/* Header */}
          <div className="text-center mb-16">
            <div className="inline-flex items-center justify-center p-3 bg-[rgba(0,255,255,0.1)] rounded-2xl mb-6 shadow-[0_0_30px_rgba(0,255,255,0.2)]">
              <ShieldCheck className="w-8 h-8 text-[#00FFFF]" />
            </div>
            <h1 className="text-4xl md:text-5xl font-bold mb-4 tracking-tight drop-shadow-md">
              Zyrlent Privacy Policy
            </h1>
            <p className="text-lg md:text-xl text-[#00FFFF] max-w-2xl mx-auto drop-shadow-sm font-semibold">
              Your Data, Handled with Care
            </p>
          </div>

          {/* Content Wrapper */}
          <div className="bg-[rgba(15,20,60,0.6)] backdrop-blur-xl border border-[rgba(0,255,255,0.15)] rounded-3xl p-8 md:p-12 shadow-[0_0_60px_rgba(0,0,0,0.5)]">
            
            <p className="text-[#FFFFFF]/80 leading-relaxed mb-8 text-lg">
              This Privacy Policy explains how Zyrlent (“Zyrlent”, “we”, “us”, or “our”) collects, uses, and protects your information when you use our platform and services. By using Zyrlent, you agree to the practices described in this policy.
            </p>

            <div className="space-y-10">
              
              {/* Section 1 */}
              <section>
                <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-3">
                  <span className="flex items-center justify-center w-8 h-8 rounded-full bg-[#00FFFF]/20 text-[#00FFFF] text-sm">1</span>
                  Information We Collect
                </h2>
                <p className="text-[#FFFFFF]/70 mb-4">We collect information to provide and improve our services.</p>
                
                <div className="space-y-6 pl-4 md:pl-8 border-l-2 border-[#00FFFF]/20">
                  <div>
                    <h3 className="text-lg font-semibold text-white mb-2">a. Account Information</h3>
                    <p className="text-[#FFFFFF]/70 mb-2">When you create an account, we may collect:</p>
                    <ul className="list-disc list-inside text-[#FFFFFF]/70 space-y-1 ml-2">
                      <li>Email address</li>
                      <li>Username</li>
                      <li>Payment-related details (processed securely via third-party providers)</li>
                    </ul>
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-white mb-2">b. Usage Data</h3>
                    <p className="text-[#FFFFFF]/70 mb-2">We automatically collect:</p>
                    <ul className="list-disc list-inside text-[#FFFFFF]/70 space-y-1 ml-2">
                      <li>IP address</li>
                      <li>Device and browser information</li>
                      <li>Activity on our platform (e.g., purchases, API usage)</li>
                    </ul>
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-white mb-2">c. SMS & Virtual Number Data</h3>
                    <p className="text-[#FFFFFF]/70 mb-2">As part of our service:</p>
                    <ul className="list-disc list-inside text-[#FFFFFF]/70 space-y-1 ml-2">
                      <li>SMS messages received on virtual numbers may be temporarily processed and displayed to you</li>
                      <li>We do not guarantee long-term storage of messages</li>
                      <li>Messages may be automatically deleted after a short period</li>
                    </ul>
                  </div>
                </div>
              </section>

              {/* Section 2 */}
              <section>
                <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-3">
                  <span className="flex items-center justify-center w-8 h-8 rounded-full bg-[#00FFFF]/20 text-[#00FFFF] text-sm">2</span>
                  How We Use Your Information
                </h2>
                <p className="text-[#FFFFFF]/70 mb-2">We use your data to:</p>
                <ul className="list-disc list-inside text-[#FFFFFF]/70 space-y-2 ml-4">
                  <li>Provide and operate Zyrlent services</li>
                  <li>Process transactions</li>
                  <li>Deliver SMS and verification services</li>
                  <li>Improve platform performance and reliability</li>
                  <li>Detect, prevent, and investigate fraud or abuse</li>
                  <li>Communicate important updates and notifications</li>
                </ul>
              </section>

              {/* Section 3 */}
              <section>
                <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-3">
                  <span className="flex items-center justify-center w-8 h-8 rounded-full bg-[#00FFFF]/20 text-[#00FFFF] text-sm">3</span>
                  Data Sharing
                </h2>
                <p className="text-[#FFFFFF]/70 mb-4 font-medium text-white/90">We do not sell your personal data.</p>
                <p className="text-[#FFFFFF]/70 mb-2">We may share data with:</p>
                <ul className="list-disc list-inside text-[#FFFFFF]/70 space-y-2 ml-4">
                  <li>Trusted third-party service providers (e.g., payment processors, infrastructure providers)</li>
                  <li>Legal authorities when required by law or to protect our rights</li>
                </ul>
              </section>

              {/* Section 4 */}
              <section>
                <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-3">
                  <span className="flex items-center justify-center w-8 h-8 rounded-full bg-[#00FFFF]/20 text-[#00FFFF] text-sm">4</span>
                  Data Retention
                </h2>
                <ul className="list-disc list-inside text-[#FFFFFF]/70 space-y-2 ml-4">
                  <li>Account and transaction data are retained as necessary for business and legal purposes</li>
                  <li>SMS messages and verification data are typically stored temporarily and may be deleted automatically</li>
                  <li>We reserve the right to retain data where necessary to prevent fraud or comply with legal obligations</li>
                </ul>
              </section>

              {/* Section 5 */}
              <section>
                <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-3">
                  <span className="flex items-center justify-center w-8 h-8 rounded-full bg-[#00FFFF]/20 text-[#00FFFF] text-sm">5</span>
                  Data Security
                </h2>
                <p className="text-[#FFFFFF]/70 mb-4">We implement industry-standard measures to protect your data.</p>
                <p className="text-[#FFFFFF]/70 mb-2">However:</p>
                <ul className="list-disc list-inside text-[#FFFFFF]/70 space-y-2 ml-4">
                  <li>No system is 100% secure</li>
                  <li>You are responsible for keeping your account credentials safe</li>
                </ul>
              </section>

              {/* Section 6 */}
              <section>
                <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-3">
                  <span className="flex items-center justify-center w-8 h-8 rounded-full bg-[#00FFFF]/20 text-[#00FFFF] text-sm">6</span>
                  Cookies & Tracking
                </h2>
                <p className="text-[#FFFFFF]/70 mb-2">Zyrlent may use cookies and similar technologies to:</p>
                <ul className="list-disc list-inside text-[#FFFFFF]/70 space-y-2 ml-4 mb-4">
                  <li>Improve user experience</li>
                  <li>Analyze platform usage</li>
                  <li>Maintain session security</li>
                </ul>
                <p className="text-[#FFFFFF]/70">You can control cookie settings through your browser.</p>
              </section>

              {/* Section 7 */}
              <section>
                <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-3">
                  <span className="flex items-center justify-center w-8 h-8 rounded-full bg-[#00FFFF]/20 text-[#00FFFF] text-sm">7</span>
                  Your Responsibilities
                </h2>
                <p className="text-[#FFFFFF]/70 mb-2">By using Zyrlent, you agree:</p>
                <ul className="list-disc list-inside text-[#FFFFFF]/70 space-y-2 ml-4">
                  <li>Not to use the platform for illegal or abusive purposes</li>
                  <li>Not to submit sensitive personal data through virtual numbers unless necessary</li>
                  <li>To understand that virtual number services are not intended for highly confidential communications</li>
                </ul>
              </section>

              {/* Section 8 */}
              <section>
                <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-3">
                  <span className="flex items-center justify-center w-8 h-8 rounded-full bg-[#00FFFF]/20 text-[#00FFFF] text-sm">8</span>
                  Third-Party Services
                </h2>
                <p className="text-[#FFFFFF]/70 mb-4">Zyrlent may integrate with third-party services.</p>
                <p className="text-[#FFFFFF]/70 mb-2">We are not responsible for:</p>
                <ul className="list-disc list-inside text-[#FFFFFF]/70 space-y-2 ml-4">
                  <li>The privacy practices of third-party platforms</li>
                  <li>How external services handle your data</li>
                </ul>
              </section>

              {/* Section 9 */}
              <section>
                <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-3">
                  <span className="flex items-center justify-center w-8 h-8 rounded-full bg-[#00FFFF]/20 text-[#00FFFF] text-sm">9</span>
                  Children’s Privacy
                </h2>
                <p className="text-[#FFFFFF]/70 mb-2">Zyrlent is not intended for use by individuals under the age of 18.</p>
                <p className="text-[#FFFFFF]/70">We do not knowingly collect personal data from minors.</p>
              </section>

              {/* Section 10 */}
              <section>
                <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-3">
                  <span className="flex items-center justify-center w-8 h-8 rounded-full bg-[#00FFFF]/20 text-[#00FFFF] text-sm">10</span>
                  Changes to This Policy
                </h2>
                <p className="text-[#FFFFFF]/70 mb-2">We may update this Privacy Policy from time to time.</p>
                <p className="text-[#FFFFFF]/70">Continued use of Zyrlent after updates means you accept the revised policy.</p>
              </section>

            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}
