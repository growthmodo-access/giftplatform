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
      {/* Banner */}
      <div className="bg-muted text-foreground py-3 text-center text-sm font-medium border-b border-border/50">
        <div className="max-w-7xl mx-auto px-10">
          <span>Your trusted partner for global gifting.</span>
        </div>
      </div>

      {/* Header */}
      <header
        className={cn(
          "sticky top-0 z-50 transition-all duration-300 border-b",
          isScrolled
            ? "bg-background/95 backdrop-blur-lg shadow-sm border-border/50"
            : "bg-background/85 backdrop-blur-lg border-border/50"
        )}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-10">
          <div className="flex items-center justify-between gap-4 min-h-20 py-3 lg:min-h-24 lg:py-4">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-2 group flex-shrink-0">
              <div className="relative w-96 h-48 group-hover:scale-105 transition-transform max-w-[120px] max-h-[60px] sm:max-w-[160px] sm:max-h-[80px] lg:max-w-[240px] lg:max-h-[120px] xl:max-w-[384px] xl:max-h-[192px]">
                <Image
                  src="/goodies.png"
                  alt="Goodies.so Logo"
                  fill
                  className="object-contain"
                  priority
                />
              </div>
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden lg:flex items-center gap-6 xl:gap-8 flex-shrink-0">
              <a href="#home" className="text-muted-foreground hover:text-foreground font-medium transition-colors whitespace-nowrap">
                Home
              </a>
              <a href="#solutions" className="text-muted-foreground hover:text-foreground font-medium transition-colors flex items-center gap-1 whitespace-nowrap">
                Solutions <span className="text-xs">▼</span>
              </a>
              <a href="#products" className="text-muted-foreground hover:text-foreground font-medium transition-colors flex items-center gap-1 whitespace-nowrap">
                Products <span className="text-xs">▼</span>
              </a>
              <a href="#pricing" className="text-muted-foreground hover:text-foreground font-medium transition-colors whitespace-nowrap">
                Pricing
              </a>
              <a href="#blog" className="text-muted-foreground hover:text-foreground font-medium transition-colors whitespace-nowrap">
                Blog
              </a>
              <a href="#contact" className="text-muted-foreground hover:text-foreground font-medium transition-colors whitespace-nowrap">
                Contact
              </a>
            </nav>

            {/* Header Actions */}
            <div className="hidden lg:flex items-center gap-3 flex-shrink-0">
              <button
                onClick={handleLogin}
                className="text-muted-foreground hover:text-foreground font-medium text-sm transition-colors whitespace-nowrap"
              >
                Login
              </button>
              <button
                onClick={handleGetStarted}
                className="bg-foreground text-background px-6 py-2.5 rounded-md font-medium hover:opacity-90 transition-opacity whitespace-nowrap"
                aria-label="Get started with Goodies.so"
              >
                Get Started
              </button>
            </div>

            {/* Mobile Menu Button */}
            <button
              className="lg:hidden p-2 text-foreground"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              aria-label="Toggle menu"
            >
              {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>

          {/* Mobile Menu */}
          {isMenuOpen && (
            <div className="lg:hidden border-t border-border/50 py-4">
              <nav className="flex flex-col gap-4">
                <a href="#home" className="text-muted-foreground hover:text-foreground font-medium" onClick={() => setIsMenuOpen(false)}>
                  Home
                </a>
                <a href="#solutions" className="text-muted-foreground hover:text-foreground font-medium" onClick={() => setIsMenuOpen(false)}>
                  Solutions
                </a>
                <a href="#products" className="text-muted-foreground hover:text-foreground font-medium" onClick={() => setIsMenuOpen(false)}>
                  Products
                </a>
                <a href="#pricing" className="text-muted-foreground hover:text-foreground font-medium" onClick={() => setIsMenuOpen(false)}>
                  Pricing
                </a>
                <a href="#blog" className="text-muted-foreground hover:text-foreground font-medium" onClick={() => setIsMenuOpen(false)}>
                  Blog
                </a>
                <a href="#contact" className="text-muted-foreground hover:text-foreground font-medium" onClick={() => setIsMenuOpen(false)}>
                  Contact
                </a>
                <div className="flex flex-col gap-2 pt-4 border-t border-border/50">
                  <button
                    onClick={() => {
                      handleLogin()
                      setIsMenuOpen(false)
                    }}
                    className="text-muted-foreground hover:text-foreground font-medium text-left"
                  >
                    Login
                  </button>
                  <button
                    onClick={() => {
                      handleGetStarted()
                      setIsMenuOpen(false)
                    }}
                    className="bg-foreground text-background px-6 py-2.5 rounded-md font-medium w-full"
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
