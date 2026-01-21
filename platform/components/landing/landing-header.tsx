'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import { Menu, X } from 'lucide-react'
import { cn } from '@/lib/utils'

export function LandingHeader() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isScrolled, setIsScrolled] = useState(false)
  const router = useRouter()

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 100)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const handleGetStarted = () => {
    router.push('/signup')
  }

  const handleLogin = () => {
    router.push('/login')
  }

  return (
    <>
      {/* Sustainability Banner */}
      <div className="bg-green-600 text-white py-3 text-center text-sm font-medium">
        <div className="max-w-7xl mx-auto px-10">
          <span>Your trusted partner for global gifting.</span>
        </div>
      </div>

      {/* Header */}
      <header
        className={cn(
          "sticky top-0 z-50 transition-all duration-300",
          isScrolled
            ? "bg-white/95 backdrop-blur-lg shadow-md"
            : "bg-white/85 backdrop-blur-lg"
        )}
      >
        <div className="max-w-7xl mx-auto px-10">
          <div className="flex items-center justify-between h-20">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-2 group">
              <div className="relative w-9 h-9 group-hover:scale-105 transition-transform">
                <Image
                  src="/goodies.png"
                  alt="Goodies.so Logo"
                  fill
                  className="object-contain"
                  priority
                />
              </div>
              <span className="font-bold text-xl bg-gradient-to-r from-purple-600 to-purple-400 bg-clip-text text-transparent">
                Goodies.so
              </span>
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden lg:flex items-center gap-8">
              <a href="#home" className="text-gray-700 hover:text-purple-600 font-medium transition-colors">
                Home
              </a>
              <a href="#solutions" className="text-gray-700 hover:text-purple-600 font-medium transition-colors flex items-center gap-1">
                Solutions <span className="text-xs">▼</span>
              </a>
              <a href="#products" className="text-gray-700 hover:text-purple-600 font-medium transition-colors flex items-center gap-1">
                Products <span className="text-xs">▼</span>
              </a>
              <a href="#pricing" className="text-gray-700 hover:text-purple-600 font-medium transition-colors">
                Pricing
              </a>
              <a href="#blog" className="text-gray-700 hover:text-purple-600 font-medium transition-colors">
                Blog
              </a>
              <a href="#contact" className="text-gray-700 hover:text-purple-600 font-medium transition-colors">
                Contact
              </a>
            </nav>

            {/* Header Actions */}
            <div className="hidden lg:flex items-center gap-3">
              <button
                onClick={handleLogin}
                className="text-gray-700 hover:text-purple-600 font-medium text-sm transition-colors"
              >
                Login
              </button>
              <button
                onClick={handleGetStarted}
                className="bg-gradient-to-r from-purple-600 to-purple-500 text-white px-6 py-2.5 rounded-xl font-semibold hover:shadow-lg hover:-translate-y-0.5 transition-all"
                aria-label="Get started with Goodies.so"
              >
                Get Started
              </button>
            </div>

            {/* Mobile Menu Button */}
            <button
              className="lg:hidden p-2 text-gray-700"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              aria-label="Toggle menu"
            >
              {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>

          {/* Mobile Menu */}
          {isMenuOpen && (
            <div className="lg:hidden border-t border-gray-200 py-4">
              <nav className="flex flex-col gap-4">
                <a href="#home" className="text-gray-700 hover:text-purple-600 font-medium" onClick={() => setIsMenuOpen(false)}>
                  Home
                </a>
                <a href="#solutions" className="text-gray-700 hover:text-purple-600 font-medium" onClick={() => setIsMenuOpen(false)}>
                  Solutions
                </a>
                <a href="#products" className="text-gray-700 hover:text-purple-600 font-medium" onClick={() => setIsMenuOpen(false)}>
                  Products
                </a>
                <a href="#pricing" className="text-gray-700 hover:text-purple-600 font-medium" onClick={() => setIsMenuOpen(false)}>
                  Pricing
                </a>
                <a href="#blog" className="text-gray-700 hover:text-purple-600 font-medium" onClick={() => setIsMenuOpen(false)}>
                  Blog
                </a>
                <a href="#contact" className="text-gray-700 hover:text-purple-600 font-medium" onClick={() => setIsMenuOpen(false)}>
                  Contact
                </a>
                <div className="flex flex-col gap-2 pt-4 border-t border-gray-200">
                  <button
                    onClick={() => {
                      handleLogin()
                      setIsMenuOpen(false)
                    }}
                    className="text-gray-700 hover:text-purple-600 font-medium text-left"
                  >
                    Login
                  </button>
                  <button
                    onClick={() => {
                      handleGetStarted()
                      setIsMenuOpen(false)
                    }}
                    className="bg-gradient-to-r from-purple-600 to-purple-500 text-white px-6 py-2.5 rounded-xl font-semibold w-full"
                  >
                    Get Started
                  </button>
                </div>
              </nav>
            </div>
          )}
        </div>
      </header>
    </>
  )
}
