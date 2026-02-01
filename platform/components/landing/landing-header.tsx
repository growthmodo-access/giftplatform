'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
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
      <div className="bg-[#F8F3EC] text-foreground py-2 sm:py-3 text-center text-xs sm:text-sm font-medium border-b border-[#F8F3EC]/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8 lg:px-10">
          <span>Built in India, shipping globally</span>
        </div>
      </div>

      {/* Header */}
      <header
        className={cn(
          "sticky top-0 z-50 transition-all duration-300",
          isScrolled
            ? "bg-white/70 backdrop-blur-sm shadow-sm border-b border-[#F8F3EC]/20"
            : "bg-white/40 backdrop-blur-sm border-b border-transparent"
        )}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-10">
          <div className="flex items-center justify-between gap-4 min-h-20 py-3 lg:min-h-24 lg:py-4">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-2 group flex-shrink-0 relative z-10">
              <Image
                src="/logogoodies.png"
                alt="Goodies Logo"
                width={240}
                height={120}
                className="h-8 sm:h-10 lg:h-12 xl:h-14 w-auto object-contain object-left group-hover:opacity-90 transition-opacity"
                priority
                unoptimized
              />
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden lg:flex items-center gap-6 xl:gap-8 flex-shrink-0">
              <a href="#home" className={cn(
                "font-medium transition-colors whitespace-nowrap",
                isScrolled 
                  ? "text-muted-foreground hover:text-foreground" 
                  : "text-foreground/90 hover:text-foreground"
              )}>
                Home
              </a>
              <a href="#solutions" className={cn(
                "font-medium transition-colors whitespace-nowrap",
                isScrolled 
                  ? "text-muted-foreground hover:text-foreground" 
                  : "text-foreground/90 hover:text-foreground"
              )}>
                Solutions
              </a>
              <a href="#pricing" className={cn(
                "font-medium transition-colors whitespace-nowrap",
                isScrolled 
                  ? "text-muted-foreground hover:text-foreground" 
                  : "text-foreground/90 hover:text-foreground"
              )}>
                Pricing
              </a>
              <Link href="/contact" className={cn(
                "font-medium transition-colors whitespace-nowrap focus-visible:outline focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 rounded",
                isScrolled 
                  ? "text-muted-foreground hover:text-foreground" 
                  : "text-foreground/90 hover:text-foreground"
              )}>
                Contact
              </Link>
            </nav>

            {/* Header Actions */}
            <div className="hidden lg:flex items-center gap-3 flex-shrink-0">
              <button
                onClick={handleLogin}
                className={cn(
                  "font-medium text-sm transition-colors whitespace-nowrap",
                  isScrolled 
                    ? "text-muted-foreground hover:text-foreground" 
                    : "text-foreground/90 hover:text-foreground"
                )}
              >
                Login
              </button>
              <button
                onClick={handleGetStarted}
                className="gradient-button text-white px-6 py-2.5 rounded-md font-medium shadow-primary whitespace-nowrap"
                aria-label="Get started with Goodies.so"
              >
                Get Started
              </button>
            </div>

            {/* Mobile Menu Button */}
            <button
              className={cn(
                "lg:hidden p-2 transition-colors",
                isScrolled ? "text-foreground" : "text-foreground/90"
              )}
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
                <a href="#pricing" className="text-muted-foreground hover:text-foreground font-medium" onClick={() => setIsMenuOpen(false)}>
                  Pricing
                </a>
                <Link href="/contact" className="text-muted-foreground hover:text-foreground font-medium" onClick={() => setIsMenuOpen(false)}>
                  Contact
                </Link>
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
                    className="gradient-button text-white px-6 py-2.5 rounded-md font-medium shadow-purple w-full"
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
