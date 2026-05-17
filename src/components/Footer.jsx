


import { FaLinkedin, FaInstagram, FaXTwitter, FaTiktok } from 'react-icons/fa6'
import { Link } from 'react-router-dom'
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
              <a href="https://www.linkedin.com/company/zyrlent" target="_blank" rel="noopener noreferrer" className="flex h-10 w-10 items-center justify-center rounded-full bg-[#22223b] text-white hover:bg-[#333356] transition">
                <FaLinkedin className="h-5 w-5" />
              </a>
              <a href="https://www.instagram.com/_zyrlent?igsh=YXg5Z3Qwczlnejlr" target="_blank" rel="noopener noreferrer" className="flex h-10 w-10 items-center justify-center rounded-full bg-[#22223b] text-white hover:bg-[#333356] transition">
                <FaInstagram className="h-5 w-5" />
              </a>
              <a href="https://x.com/zyrlent" target="_blank" rel="noopener noreferrer" className="flex h-10 w-10 items-center justify-center rounded-full bg-[#22223b] text-white hover:bg-[#333356] transition">
                <FaXTwitter className="h-5 w-5" />
              </a>
              <a href="https://www.tiktok.com/@zyrlent" target="_blank" rel="noopener noreferrer" className="flex h-10 w-10 items-center justify-center rounded-full bg-[#22223b] text-white hover:bg-[#333356] transition">
                <FaTiktok className="h-5 w-5" />
              </a>
            </div>

            <div className="mt-4">
              <h4 className="text-lg font-semibold text-[#FFFFFF] mb-3">Legal</h4>
              <div className="flex flex-col gap-2">
                <Link to="/privacy-policy" className="text-[#FFFFFF]/70 hover:text-[#00FFFF] transition">
                  Privacy Policy
                </Link>
                <h4 className="text-lg font-semibold text-[#FFFFFF] mt-3 mb-1">Terms of Service</h4>
                <div className="text-sm text-[#FFFFFF]/70 leading-relaxed font-mono">
                  This webapp's codebase is<br />
                  protected. Any unapproved<br />
                  duplication, redistribution<br />
                  or use is prohibited.
                </div>
              </div>
            </div>
          </div>

          {/* Right Section: Contact */}
          <div className="lg:col-span-8 flex flex-col lg:items-end mt-4 lg:mt-0">
            <div className="flex flex-col gap-4">
              <h4 className="text-lg font-semibold text-[#FFFFFF]">Contact</h4>
              <a href="mailto:support@zyrlent.com" className="text-[#FFFFFF]/70 hover:text-[#00FFFF] transition">
                support@zyrlent.com
              </a>
            </div>
          </div>
        </div>

        {/* Full-width line under social icons section */}
        <div className="mt-12 h-[2px] w-full bg-[rgba(255,255,255,0.4)]"></div>

        <div className="mt-8 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex flex-col gap-1 text-sm text-[#FFFFFF]/60 text-center md:text-left">
            <span>© 2024 Zyrlent. All rights reserved.</span>
          </div>

          <a href="//www.dmca.com/Protection/Status.aspx?ID=2cd61eed-da2f-4a61-9e9e-8fcc1efba7c3" title="DMCA.com Protection Status" className="dmca-badge">
            <img src="https://images.dmca.com/Badges/_dmca_premi_badge_2.png?ID=2cd61eed-da2f-4a61-9e9e-8fcc1efba7c3" alt="DMCA.com Protection Status" className="h-8 w-auto" />
          </a>
        </div>
      </div>
    </footer>
  )
}
