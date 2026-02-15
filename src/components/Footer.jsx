


import { FaLinkedin, FaInstagram, FaXTwitter, FaTiktok } from 'react-icons/fa6'
import logo from '../assets/logo.png'

export default function Footer() {
  return (
    <footer className="relative z-10 border-t border-[rgba(0,255,255,0.2)] bg-[#0A0B3D]/90 backdrop-blur-md py-12 md:py-16">
      <div className="mx-auto max-w-7xl px-4 md:px-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16">
          {/* Left Section: Brand & info */}
          <div className="lg:col-span-4 flex flex-col gap-8">
            <div className="flex items-center gap-2">
              <img src={logo} alt="Zyrlent Logo" className="h-8 w-auto object-contain" />
            </div>

            <p className="text-[#FFFFFF]/70 leading-relaxed">
              The most reliable virtual number infrastructure with instant access to phone numbers across 180+ countries, built for modern digital access.
            </p>

            <div className="flex gap-4">
              <a href="#" className="flex h-10 w-10 items-center justify-center rounded-full bg-[#22223b] text-white hover:bg-[#333356] transition">
                <FaLinkedin className="h-5 w-5" />
              </a>
              <a href="#" className="flex h-10 w-10 items-center justify-center rounded-full bg-[#22223b] text-white hover:bg-[#333356] transition">
                <FaInstagram className="h-5 w-5" />
              </a>
              <a href="#" className="flex h-10 w-10 items-center justify-center rounded-full bg-[#22223b] text-white hover:bg-[#333356] transition">
                <FaXTwitter className="h-5 w-5" />
              </a>
              <a href="#" className="flex h-10 w-10 items-center justify-center rounded-full bg-[#22223b] text-white hover:bg-[#333356] transition">
                <FaTiktok className="h-5 w-5" />
              </a>
            </div>

            <div className="mt-4">
              <h4 className="text-lg font-semibold text-[#FFFFFF] mb-3">Terms of Service</h4>
              <div className="text-sm text-[#FFFFFF]/70 leading-relaxed font-mono">
                This webapp's codebase is<br />
                protected. Any unapproved<br />
                duplication, redistribution<br />
                or use is prohibited.
              </div>
            </div>
          </div>
        </div>

        {/* Full-width line under social icons section */}
        <div className="mt-12 h-[2px] w-full bg-[rgba(255,255,255,0.4)]"></div>

        <div className="mt-8 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="text-sm text-[#FFFFFF]/60">
            © 2024 Zyrlent. All rights reserved.
          </div>

          <div className="flex items-center gap-2 rounded border border-[#FFFFFF]/20 bg-[#FFFFFF]/5 px-3 py-1 text-xs font-bold tracking-widest text-[#FFFFFF]/80">
            DMCA <span className="text-[#00FFFF] mx-1">|</span> PROTECTED
          </div>
        </div>
      </div>
    </footer>
  )
}
