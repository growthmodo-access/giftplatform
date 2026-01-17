'use client'

import { useEffect } from 'react'
import './landing-styles.css'
import { LandingHeader } from './landing-header'
import { LandingHero } from './landing-hero'
import { ClientLogos } from './client-logos'
import { FeatureSections } from './feature-sections'
import { IndustryLeaders } from './industry-leaders'
import { Testimonials } from './testimonials'
import { BlogSection } from './blog-section'
import { IntegrationsSection } from './integrations-section'
import { CTASection } from './cta-section'
import { Footer } from './footer'
import { ScrollProgress } from './scroll-progress'

export function LandingPage() {
  useEffect(() => {
    // Smooth scrolling for anchor links
    const handleAnchorClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement
      const anchor = target.closest('a[href^="#"]')
      if (anchor) {
        e.preventDefault()
        const href = anchor.getAttribute('href')
        if (href && href !== '#') {
          const targetElement = document.querySelector(href)
          if (targetElement) {
            const headerOffset = 80
            const elementPosition = targetElement.getBoundingClientRect().top
            const offsetPosition = elementPosition + window.pageYOffset - headerOffset

            window.scrollTo({
              top: offsetPosition,
              behavior: 'smooth'
            })
          }
        }
      }
    }

    document.addEventListener('click', handleAnchorClick)
    return () => document.removeEventListener('click', handleAnchorClick)
  }, [])

  return (
    <div className="landing-page">
      <ScrollProgress />
      <a href="#home" className="skip-link">Skip to main content</a>
      <LandingHeader />
      <main>
        <LandingHero />
        <ClientLogos />
        <FeatureSections />
        <IndustryLeaders />
        <Testimonials />
        <BlogSection />
        <IntegrationsSection />
        <CTASection />
      </main>
      <Footer />
      <div className="chat-widget">
        <div className="chat-bubble">
          <span>Help</span>
        </div>
      </div>
    </div>
  )
}
