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
      setIsScrolled(window.scrollY > 24)
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

  const navLinkClass = cn(
    'font-medium text-sm transition-colors whitespace-nowrap rounded-md px-2 py-1.5',
    isScrolled ? 'text-muted-foreground hover:text-foreground hover:bg-muted/50' : 'text-foreground/90 hover:text-foreground hover:bg-black/5'
  )

  return (
    <>
      {/* Top banner - compact */}
      <div className="bg-primary/8 text-foreground py-2.5 sm:py-3 text-center text-xs sm:text-sm font-medium border-b border-border/40 w-full max-w-full overflow-hidden">
        <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 box-border">
          <span className="block sm:inline">
            Corporate gifting for HR & Ops—one platform, 100+ locations.{' '}
            <Link href="/signup" className="underline font-semibold hover:opacity-90 decoration-2 underline-offset-2">
              Book a demo
            </Link>
          </span>
        </div>
      </div>

      <header
        className={cn(
          'sticky top-0 z-50 transition-all duration-300 max-w-full',
          isScrolled ? 'bg-white/95 backdrop-blur-md border-b border-border/50 shadow-sm' : 'bg-white border-b border-transparent'
        )}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full max-w-full box-border">
          <div className="flex items-center justify-between gap-4 min-h-16 sm:min-h-[4.25rem] min-w-0">
            <Link href="/" className="flex items-center gap-2 group flex-shrink-0 relative z-10 min-w-0" aria-label="Goodies home">
              <Image
                src="/logogoodies.png"
                alt="Goodies"
                width={200}
                height={100}
                className="h-9 sm:h-10 lg:h-11 w-auto max-w-[140px] sm:max-w-[160px] lg:max-w-[180px] object-contain object-left group-hover:opacity-90 transition-opacity"
                priority
                unoptimized
              />
            </Link>

            <nav className="hidden lg:flex items-center gap-0.5 flex-shrink-0" aria-label="Main navigation">
              <a href="#home" className={navLinkClass}>Home</a>
              <a href="#solutions" className={navLinkClass}>How it works</a>
              <a href="#pricing" className={navLinkClass}>Pricing</a>
              <Link href="/contact" className={navLinkClass}>Contact</Link>
            </nav>

            <div className="hidden lg:flex items-center gap-3 flex-shrink-0">
              <button
                onClick={handleLogin}
                className={cn(
                  'font-medium text-sm transition-colors whitespace-nowrap rounded-lg px-3 py-2',
                  isScrolled ? 'text-muted-foreground hover:text-foreground hover:bg-muted/50' : 'text-foreground/90 hover:text-foreground hover:bg-black/5'
                )}
              >
                Login
              </button>
              <button
                onClick={handleGetStarted}
                className="bg-primary text-primary-foreground hover:bg-primary/90 px-5 py-2.5 rounded-xl font-semibold text-sm whitespace-nowrap shadow-sm hover:shadow transition-all"
                aria-label="Get started"
              >
                Get Started
              </button>
            </div>

            <button
              className={cn(
                'lg:hidden p-2.5 rounded-lg transition-colors',
                isScrolled ? 'text-foreground hover:bg-muted/50' : 'text-foreground/90 hover:bg-black/5'
              )}
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              aria-label="Toggle menu"
              aria-expanded={isMenuOpen}
            >
              {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>

          {isMenuOpen && (
            <div className="lg:hidden border-t border-border/40 bg-white py-4 w-full animate-in fade-in slide-in-from-top-2 duration-200">
              <nav className="flex flex-col gap-0.5 w-full text-left" role="navigation" aria-label="Mobile menu">
                <a href="#home" className="block py-3 px-4 text-base font-medium text-foreground hover:bg-muted/50 rounded-lg" onClick={() => setIsMenuOpen(false)}>Home</a>
                <a href="#solutions" className="block py-3 px-4 text-base font-medium text-foreground hover:bg-muted/50 rounded-lg" onClick={() => setIsMenuOpen(false)}>How it works</a>
                <a href="#pricing" className="block py-3 px-4 text-base font-medium text-foreground hover:bg-muted/50 rounded-lg" onClick={() => setIsMenuOpen(false)}>Pricing</a>
                <Link href="/contact" className="block py-3 px-4 text-base font-medium text-foreground hover:bg-muted/50 rounded-lg" onClick={() => setIsMenuOpen(false)}>Contact</Link>
                <div className="flex flex-col gap-2 pt-4 mt-2 border-t border-border/40 px-4">
                  <button type="button" onClick={() => { handleLogin(); setIsMenuOpen(false) }} className="w-full text-left py-3 px-4 text-base font-medium text-foreground hover:bg-muted/30 rounded-xl border border-border/40">
                    Login
                  </button>
                  <button type="button" onClick={() => { handleGetStarted(); setIsMenuOpen(false) }} className="w-full py-3 px-4 rounded-xl font-semibold text-base bg-primary text-primary-foreground hover:bg-primary/90">
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
