'use client'

import { useEffect, lazy, Suspense } from 'react'
import { LandingHeader } from './landing-header'
import { LandingHero } from './landing-hero'
import { ValueStrip } from './value-strip'
import { BrandsSection } from './brands-section'
import { FeatureSections } from './feature-sections'
import { UseCasesSection } from './use-cases-section'
import { IndustryLeaders } from './industry-leaders'
import { ServicesSection } from './services-section'
import { IndiaSection } from './india-section'
import { PricingSection } from './pricing-section'
import { IntegrationsSection } from './integrations-section'
import { FAQSection } from './faq-section'
import { CTASection } from './cta-section'
import { Footer } from './footer'
import { ScrollProgress } from './scroll-progress'

const Testimonials = lazy(() => import('./testimonials').then((m) => ({ default: m.Testimonials })))

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
    <div className="min-h-screen bg-white overflow-x-hidden w-full max-w-full box-border">
      <ScrollProgress />
      <a 
        href="#home" 
        className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-50 focus:bg-foreground focus:text-background focus:px-4 focus:py-2 focus:rounded-md"
      >
        Skip to main content
      </a>
      <LandingHeader />
      <main className="overflow-x-hidden w-full max-w-full min-w-0 box-border pb-20 sm:pb-24">
        <LandingHero />
        <ValueStrip />
        <BrandsSection />
        <IndustryLeaders />
        <ServicesSection />
        <FeatureSections />
        <UseCasesSection />
        <IndiaSection />
        <IntegrationsSection />
        <PricingSection />
        <Suspense fallback={<section className="py-20 bg-white min-h-[320px] flex items-center justify-center"><div className="animate-pulse text-muted-foreground text-sm">Loading...</div></section>}>
          <Testimonials />
        </Suspense>
        <FAQSection />
        <CTASection />
      </main>
      <Footer />
    </div>
  )
}
