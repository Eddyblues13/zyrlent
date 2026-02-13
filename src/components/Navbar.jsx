'use client'

import { useState } from 'react'
import { Link } from 'react-router-dom'
import logo from '../assets/logo.png'

export default function Navbar() {
  const [navOpen, setNavOpen] = useState(false)

  return (
    <header className="relative z-10 border-b border-[rgba(0,255,255,0.2)] bg-[#0A0B3D]/90 backdrop-blur-md sticky top-0">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-5 md:px-6">
        <div className="flex items-center">
          <Link to="/">
            <img src={logo} alt="Zyrlent Logo" className="h-10 w-auto object-contain" />
          </Link>
        </div>

        <nav className="hidden items-center gap-8 text-sm text-[#FFFFFF]/80 md:flex">
          <Link to="/" className="transition hover:text-[#FFFFFF]">
            Home
          </Link>
          <Link to="/partners" className="transition hover:text-[#FFFFFF]">
            Partners (API)
          </Link>
          <Link to="/features" className="transition hover:text-[#FFFFFF]">
            Features
          </Link>
          <a href="/#how-it-works" className="transition hover:text-[#FFFFFF]">
            How it works
          </a>
          <a href="/#reviews" className="transition hover:text-[#FFFFFF]">
            Reviews
          </a>
        </nav>

        <div className="flex items-center gap-3">
          <Link to="/signup" className="hidden rounded-full border border-[rgba(0,255,255,0.2)] bg-[rgba(15,20,60,0.4)] px-6 py-2 text-sm font-medium text-[#FFFFFF] transition hover:border-[#00FFFF]/50 hover:bg-[rgba(0,255,255,0.1)] md:inline-flex">
            Sign In
          </Link>
          <Link to="/signup" className="hidden rounded-full bg-gradient-to-r from-[#33CCFF] to-[#0099FF] px-6 py-2 text-sm font-bold text-[#FFFFFF] shadow-[0_0_15px_rgba(0,255,255,0.4)] transition transform hover:scale-105 hover:shadow-[0_0_25px_rgba(0,255,255,0.6)] md:inline-flex">
            Get verified
          </Link>
          <button
            type="button"
            className="inline-flex h-10 w-10 items-center justify-center rounded-lg border border-[rgba(0,255,255,0.3)] bg-[rgba(15,20,60,0.8)] transition hover:bg-[#080a2e] md:hidden"
            aria-label="Toggle navigation"
            onClick={() => setNavOpen(!navOpen)}
          >
            <span className="relative block h-5 w-5">
              <span
                className={`absolute left-0 right-0 h-0.5 bg-[#FFFFFF] transition-all duration-200 ${navOpen ? 'top-[10px] rotate-45' : 'top-[4px]'
                  }`}
              />
              <span
                className={`absolute left-0 right-0 top-[10px] h-0.5 bg-[#FFFFFF] transition-opacity duration-200 ${navOpen ? 'opacity-0' : 'opacity-100'
                  }`}
              />
              <span
                className={`absolute left-0 right-0 h-0.5 bg-[#FFFFFF] transition-all duration-200 ${navOpen ? 'top-[10px] -rotate-45' : 'top-[16px]'
                  }`}
              />
            </span>
          </button>
        </div>
      </div>

      {navOpen && (
        <div className="border-t border-[rgba(0,255,255,0.2)] bg-[rgba(15,20,60,0.9)] px-4 py-4 text-sm text-[#FFFFFF]/80 backdrop-blur-md md:hidden">
          <nav className="flex flex-col">
            <Link to="/" className="py-3 text-base font-medium transition hover:text-[#00FFFF] hover:pl-2" onClick={() => setNavOpen(false)}>
              Home
            </Link>
            <Link to="/partners" className="py-3 text-base font-medium transition hover:text-[#00FFFF] hover:pl-2" onClick={() => setNavOpen(false)}>
              Partners (API)
            </Link>
            <Link to="/features" className="border-b border-[rgba(0,255,255,0.1)] py-3 text-base font-medium transition hover:text-[#00FFFF] hover:pl-2" onClick={() => setNavOpen(false)}>
              Features
            </Link>
            <a href="/#how-it-works" className="py-3 text-base font-medium transition hover:text-[#00FFFF] hover:pl-2" onClick={() => setNavOpen(false)}>
              How it works
            </a>
            <a href="/#reviews" className="py-3 text-base font-medium transition hover:text-[#00FFFF] hover:pl-2" onClick={() => setNavOpen(false)}>
              Reviews
            </a>
            <div className="mt-4 flex flex-col gap-3">
              <Link
                to="/signup"
                className="rounded-full border border-[rgba(0,255,255,0.2)] bg-[rgba(15,20,60,0.4)] px-6 py-2 text-sm font-medium text-[#FFFFFF] transition hover:border-[#00FFFF]/50 hover:bg-[rgba(0,255,255,0.1)] text-center"
                onClick={() => setNavOpen(false)}
              >
                Sign In
              </Link>
              <Link
                to="/signup"
                className="rounded-full bg-gradient-to-r from-[#33CCFF] to-[#0099FF] px-6 py-2 text-sm font-bold text-[#FFFFFF] shadow-[0_0_15px_rgba(0,255,255,0.4)] transition transform hover:scale-105 hover:shadow-[0_0_25px_rgba(0,255,255,0.6)] text-center"
                onClick={() => setNavOpen(false)}
              >
                Get verified
              </Link>
            </div>
          </nav>
        </div>
      )}
    </header>
  )
}
