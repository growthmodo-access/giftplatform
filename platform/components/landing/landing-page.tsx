'use client'

import { useEffect } from 'react'
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
    <div className="min-h-screen bg-gradient-to-b from-white via-[#FAFBFC] to-[#F8FAFC]">
      <ScrollProgress />
      <a 
        href="#home" 
        className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-50 focus:bg-purple-600 focus:text-white focus:px-4 focus:py-2 focus:rounded-md"
      >
        Skip to main content
      </a>
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
      <div className="fixed bottom-6 left-6 z-50">
        <div className="w-14 h-14 bg-purple-600 rounded-full flex items-center justify-center shadow-lg hover:scale-110 transition-transform cursor-pointer">
          <span className="text-white font-semibold text-sm">Help</span>
        </div>
      </div>
    </div>
  )
}
