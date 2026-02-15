import Image from 'next/image'
import Link from 'next/link'
import { ArrowRight, Instagram, Facebook } from 'lucide-react'
import { siteConfig } from '@/lib/site'

const productLinks = [
  { label: 'Corporate gifting', href: '#benefits' },
  { label: 'How it works', href: '#solutions' },
  { label: 'Pricing', href: '#pricing' },
  { label: 'Contact', href: '/contact' },
]
const companyLinks = [
  { label: 'About us', href: '/about' },
  { label: 'Contact', href: '/contact' },
]
const legalLinks = [
  { label: 'Privacy Policy', href: '/privacy' },
  { label: 'Terms of Service', href: '/terms' },
  { label: 'Cookie Policy', href: '/privacy#cookies' },
]

export function Footer() {
  return (
    <footer className="bg-foreground text-background w-full max-w-full overflow-hidden" role="contentinfo">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full max-w-full box-border min-w-0">
        {/* Top CTA strip */}
        <div className="py-8 sm:py-10 md:py-12 border-b border-white/10">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6 text-center sm:text-left">
            <div>
              <h3 className="text-lg sm:text-xl font-semibold text-white tracking-tight">
                Ready to simplify corporate gifting?
              </h3>
              <p className="text-sm sm:text-base text-white/70 mt-1 max-w-md mx-auto sm:mx-0">
                Talk to our team for a custom quote. No commitment required.
              </p>
            </div>
            <Link
              href="/contact"
              className="inline-flex items-center justify-center gap-2 rounded-lg bg-white text-foreground px-5 py-3 sm:px-6 sm:py-3.5 text-sm font-semibold hover:bg-white/90 transition-colors focus-visible:ring-2 focus-visible:ring-white/50 focus-visible:outline-none shrink-0"
              aria-label="Talk to sales"
            >
              Talk to sales
              <ArrowRight className="h-4 w-4" strokeWidth={2} aria-hidden />
            </Link>
          </div>
        </div>

        {/* Main footer grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-10 sm:gap-12 lg:gap-16 py-12 sm:py-14 lg:py-16 min-w-0">
          <div className="sm:col-span-2 min-w-0 space-y-6">
            <Link href="/" className="inline-block" aria-label={`${siteConfig.name} home`}>
              <Image
                src="/logogoodies.png"
                alt={`${siteConfig.name} logo`}
                width={200}
                height={100}
                className="h-9 sm:h-10 lg:h-11 w-auto max-w-[140px] sm:max-w-[160px] object-contain brightness-0 invert"
                unoptimized
              />
            </Link>
            <p className="text-sm sm:text-base text-white/80 max-w-sm leading-relaxed">
              One platform to send corporate gifts globally—without spreadsheets, vendors, or chaos. Built in India. Ships to 100+ locations.
            </p>
            <div className="text-sm text-white/80 space-y-1.5">
              <p className="font-semibold text-white">{siteConfig.name}</p>
              <p>{siteConfig.companyLegalName}</p>
              <p className="text-white/70">India · Shipping globally</p>
              <a
                href={`mailto:${siteConfig.supportEmail}`}
                className="text-white/90 hover:text-white transition-colors block mt-2 font-medium focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/50 focus-visible:ring-offset-2 focus-visible:ring-offset-foreground rounded"
              >
                {siteConfig.supportEmail}
              </a>
              <a
                href={`tel:${siteConfig.supportPhone.replace(/\s/g, '')}`}
                className="text-white/90 hover:text-white transition-colors block font-medium focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/50 focus-visible:ring-offset-2 focus-visible:ring-offset-foreground rounded"
              >
                {siteConfig.supportPhone}
              </a>
            </div>
            <div className="flex gap-2 mt-4">
              <a
                href={siteConfig.links.instagram}
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 rounded-lg text-white/80 hover:text-white hover:bg-white/10 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/50 focus-visible:ring-offset-2 focus-visible:ring-offset-foreground"
                aria-label="Instagram"
              >
                <Instagram className="h-5 w-5" />
              </a>
              <a
                href={siteConfig.links.facebook}
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 rounded-lg text-white/80 hover:text-white hover:bg-white/10 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/50 focus-visible:ring-offset-2 focus-visible:ring-offset-foreground"
                aria-label="Facebook"
              >
                <Facebook className="h-5 w-5" />
              </a>
            </div>
          </div>
          <div className="min-w-0">
            <h3 className="font-semibold text-white text-xs sm:text-sm uppercase tracking-widest mb-4 sm:mb-5">
              Product
            </h3>
            <ul className="space-y-3 sm:space-y-3.5" role="list">
              {productLinks.map((link) => (
                <li key={link.href}>
                  {link.href.startsWith('#') ? (
                    <a
                      href={link.href}
                      className="text-sm sm:text-base text-white/80 hover:text-white transition-colors py-1 inline-block focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/50 focus-visible:ring-offset-2 focus-visible:ring-offset-foreground rounded"
                    >
                      {link.label}
                    </a>
                  ) : (
                    <Link
                      href={link.href}
                      className="text-sm sm:text-base text-white/80 hover:text-white transition-colors py-1 inline-block focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/50 focus-visible:ring-offset-2 focus-visible:ring-offset-foreground rounded"
                    >
                      {link.label}
                    </Link>
                  )}
                </li>
              ))}
            </ul>
          </div>
          <div className="min-w-0">
            <h3 className="font-semibold text-white text-xs sm:text-sm uppercase tracking-widest mb-4 sm:mb-5">
              Company
            </h3>
            <ul className="space-y-3 sm:space-y-3.5" role="list">
              {companyLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm sm:text-base text-white/80 hover:text-white transition-colors py-1 inline-block focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/50 focus-visible:ring-offset-2 focus-visible:ring-offset-foreground rounded"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          <div className="min-w-0">
            <h3 className="font-semibold text-white text-xs sm:text-sm uppercase tracking-widest mb-4 sm:mb-5">
              Legal
            </h3>
            <ul className="space-y-3 sm:space-y-3.5" role="list">
              {legalLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm sm:text-base text-white/80 hover:text-white transition-colors py-1 inline-block focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/50 focus-visible:ring-offset-2 focus-visible:ring-offset-foreground rounded"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="py-6 sm:py-8 border-t border-white/10 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 text-center sm:text-left">
          <p className="text-xs sm:text-sm text-white/60">
            © {new Date().getFullYear()} {siteConfig.companyLegalName}. All rights reserved.
          </p>
          <p className="text-xs sm:text-sm text-white/60">
            Built in India · Startups to enterprise
          </p>
        </div>
      </div>
    </footer>
  )
}
