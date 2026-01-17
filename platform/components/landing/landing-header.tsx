'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

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
      <div className="sustainability-banner">
        <div className="container">
          <span>Your trusted partner for global gifting.</span>
        </div>
      </div>
      <header className={`header ${isScrolled ? 'scrolled' : ''}`}>
        <div className="container">
          <div className="nav-wrapper">
            <Link href="/" className="logo">
              <span className="logo-icon">P</span>
              <span className="logo-text">Goodies.so</span>
            </Link>
            <button
              className={`mobile-menu-toggle ${isMenuOpen ? 'active' : ''}`}
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              aria-label="Toggle menu"
            >
              <span></span>
              <span></span>
              <span></span>
            </button>
            <nav className={`nav ${isMenuOpen ? 'active' : ''}`}>
              <a href="#home" className="nav-link" onClick={() => setIsMenuOpen(false)}>Home</a>
              <a href="#solutions" className="nav-link" onClick={() => setIsMenuOpen(false)}>
                Solutions <span className="dropdown-arrow">▼</span>
              </a>
              <a href="#products" className="nav-link" onClick={() => setIsMenuOpen(false)}>
                Products <span className="dropdown-arrow">▼</span>
              </a>
              <a href="#pricing" className="nav-link" onClick={() => setIsMenuOpen(false)}>Pricing</a>
              <a href="#blog" className="nav-link" onClick={() => setIsMenuOpen(false)}>Blog</a>
              <a href="#contact" className="nav-link" onClick={() => setIsMenuOpen(false)}>Contact</a>
            </nav>
            <div className="header-actions">
              <button onClick={handleLogin} className="sign-in-link">Login</button>
              <button onClick={handleGetStarted} className="btn-primary" aria-label="Get started with Goodies.so">
                Get Started
              </button>
            </div>
          </div>
        </div>
      </header>
    </>
  )
}
