'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'

export default function Header() {
  const [isScrolled, setIsScrolled] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const navLinks = [
    { href: '#services', label: 'Services' },
    { href: '#results', label: 'Results' },
    { href: '#how-it-works', label: 'How It Works' },
    { href: '#testimonials', label: 'Testimonials' },
    { href: '#faq', label: 'FAQ' },
    { href: '/blog', label: 'Blog' },
  ]

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled ? 'bg-white shadow-lg' : 'bg-transparent'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-24">
          {/* Logo */}
          <Link href="/" className="flex items-center">
            <Image
              src="/logo-bw.png"
              alt="Masters Marketing Agency"
              width={200}
              height={50}
              className={`h-20 w-auto transition-all duration-300 ${isScrolled ? '' : 'brightness-0 invert'}`}
              priority
            />
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-8">
            {navLinks.map((link) =>
              link.href.startsWith('#') ? (
                <a
                  key={link.href}
                  href={link.href}
                  className={`text-sm font-medium transition-colors hover:text-[#FF9700] ${
                    isScrolled ? 'text-gray-700' : 'text-white/90'
                  }`}
                >
                  {link.label}
                </a>
              ) : (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`text-sm font-medium transition-colors hover:text-[#FF9700] ${
                    isScrolled ? 'text-gray-700' : 'text-white/90'
                  }`}
                >
                  {link.label}
                </Link>
              )
            )}
          </nav>

          {/* CTA Button */}
          <div className="hidden md:block">
            <Link
              href="/booking"
              className="inline-flex items-center justify-center px-6 py-3 bg-[#FF9700] text-white font-semibold rounded-full hover:bg-[#E68600] transition-all hover:scale-105"
            >
              Book Consultation
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden p-2"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            aria-label="Toggle menu"
          >
            <div className="w-6 h-5 relative flex flex-col justify-between">
              <span
                className={`w-full h-0.5 transition-all ${
                  isScrolled ? 'bg-gray-900' : 'bg-white'
                } ${isMobileMenuOpen ? 'rotate-45 translate-y-2' : ''}`}
              />
              <span
                className={`w-full h-0.5 transition-all ${
                  isScrolled ? 'bg-gray-900' : 'bg-white'
                } ${isMobileMenuOpen ? 'opacity-0' : ''}`}
              />
              <span
                className={`w-full h-0.5 transition-all ${
                  isScrolled ? 'bg-gray-900' : 'bg-white'
                } ${isMobileMenuOpen ? '-rotate-45 -translate-y-2' : ''}`}
              />
            </div>
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-white border-t">
          <nav className="px-4 py-4 space-y-3">
            {navLinks.map((link) =>
              link.href.startsWith('#') ? (
                <a
                  key={link.href}
                  href={link.href}
                  className="block py-2 text-gray-700 hover:text-[#FF9700] font-medium"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  {link.label}
                </a>
              ) : (
                <Link
                  key={link.href}
                  href={link.href}
                  className="block py-2 text-gray-700 hover:text-[#FF9700] font-medium"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  {link.label}
                </Link>
              )
            )}
            <Link
              href="/booking"
              className="block w-full text-center py-3 bg-[#FF9700] text-white font-semibold rounded-full hover:bg-[#E68600] transition-colors"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Book Consultation
            </Link>
          </nav>
        </div>
      )}
    </header>
  )
}
