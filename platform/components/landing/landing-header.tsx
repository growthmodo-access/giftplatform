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
      <div className="bg-muted/50 text-foreground py-2.5 sm:py-3 text-center text-xs sm:text-sm font-medium border-b border-border/60 w-full max-w-full overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8 lg:px-10 box-border">
          <span>Built in India, shipping globally</span>
        </div>
      </div>

      {/* Header - dashboard-aligned */}
      <header
        className={cn(
          'sticky top-0 z-50 transition-all duration-300 bg-white border-b max-w-full',
          isScrolled ? 'border-border/60 shadow-sm' : 'border-transparent'
        )}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-10 w-full max-w-full box-border">
          <div className="flex items-center justify-between gap-3 min-h-16 py-3 sm:min-h-20 lg:min-h-24 lg:py-4 min-w-0">
            {/* Logo - balanced size */}
            <Link href="/" className="flex items-center gap-2 group flex-shrink-0 relative z-10 min-w-0">
              <Image
                src="/logogoodies.png"
                alt="Goodies"
                width={200}
                height={100}
                className="h-10 sm:h-11 lg:h-12 w-auto max-w-[140px] sm:max-w-[160px] lg:max-w-[180px] object-contain object-left group-hover:opacity-90 transition-opacity"
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
                className="bg-primary text-primary-foreground hover:bg-primary/90 px-5 py-2.5 rounded-xl font-medium whitespace-nowrap"
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

          {/* Mobile Menu - full width, visible text and tap targets */}
          {isMenuOpen && (
            <div className="lg:hidden border-t border-border bg-white py-4 w-full">
              <nav className="flex flex-col gap-1 w-full text-left" role="navigation" aria-label="Mobile menu">
                <a href="#home" className="block py-3 px-2 text-base font-medium text-foreground hover:bg-muted/50 rounded-lg active:bg-muted" onClick={() => setIsMenuOpen(false)}>
                  Home
                </a>
                <a href="#solutions" className="block py-3 px-2 text-base font-medium text-foreground hover:bg-muted/50 rounded-lg active:bg-muted" onClick={() => setIsMenuOpen(false)}>
                  Solutions
                </a>
                <a href="#pricing" className="block py-3 px-2 text-base font-medium text-foreground hover:bg-muted/50 rounded-lg active:bg-muted" onClick={() => setIsMenuOpen(false)}>
                  Pricing
                </a>
                <Link href="/contact" className="block py-3 px-2 text-base font-medium text-foreground hover:bg-muted/50 rounded-lg active:bg-muted" onClick={() => setIsMenuOpen(false)}>
                  Contact
                </Link>
                <div className="flex flex-col gap-2 pt-4 mt-2 border-t border-border">
                  <button
                    type="button"
                    onClick={() => {
                      handleLogin()
                      setIsMenuOpen(false)
                    }}
                    className="block w-full text-left py-3 px-4 text-base font-medium text-foreground hover:bg-muted/50 rounded-xl border border-border"
                  >
                    Login
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      handleGetStarted()
                      setIsMenuOpen(false)
                    }}
                    className="w-full py-3 px-4 rounded-xl font-medium text-base bg-primary text-primary-foreground hover:bg-primary/90"
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
