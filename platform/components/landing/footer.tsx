import Image from 'next/image'
import Link from 'next/link'

const productLinks = [
  { label: 'Corporate gifting', href: '#benefits' },
  { label: 'How it works', href: '#solutions' },
  { label: 'Pricing', href: '#pricing' },
  { label: 'Contact', href: '/contact' },
]

const companyLinks = [
  { label: 'About us', href: '/contact' },
  { label: 'Contact', href: '/contact' },
  { label: 'Careers', href: '/contact#careers' },
]

const legalLinks = [
  { label: 'Privacy Policy', href: '/privacy' },
  { label: 'Terms of Service', href: '/terms' },
  { label: 'Cookie Policy', href: '/privacy#cookies' },
]

export function Footer() {
  return (
    <footer className="bg-foreground text-background w-full max-w-full overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14 sm:py-16 w-full max-w-full box-border min-w-0">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-10 sm:gap-12 lg:gap-14 min-w-0">
          <div className="lg:col-span-2 min-w-0">
            <Link href="/" className="inline-block mb-5" aria-label="Goodies home">
              <Image
                src="/logogoodies.png"
                alt="Goodies"
                width={200}
                height={100}
                className="h-9 sm:h-10 w-auto max-w-[140px] object-contain brightness-0 invert"
                unoptimized
              />
            </Link>
            <p className="text-sm text-white/80 max-w-xs mb-5 leading-relaxed">
              One platform to send corporate gifts globally—without spreadsheets, vendors, or chaos. Built in India. Ships to 100+ locations.
            </p>
            <div className="text-sm text-white/80 space-y-1">
              <p className="font-semibold text-white">Goodies</p>
              <p>India · Shipping globally</p>
              <a href="mailto:hello@goodies.so" className="text-primary-foreground hover:underline block mt-2 font-medium">
                hello@goodies.so
              </a>
            </div>
          </div>

          <div>
            <h3 className="font-semibold text-white text-sm uppercase tracking-wider mb-4">Product</h3>
            <ul className="space-y-3">
              {productLinks.map((link) => (
                <li key={link.href}>
                  <a href={link.href} className="text-sm text-white/80 hover:text-white transition-colors">
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="font-semibold text-white text-sm uppercase tracking-wider mb-4">Company</h3>
            <ul className="space-y-3">
              {companyLinks.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="text-sm text-white/80 hover:text-white transition-colors">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="font-semibold text-white text-sm uppercase tracking-wider mb-4">Legal</h3>
            <ul className="space-y-3">
              {legalLinks.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="text-sm text-white/80 hover:text-white transition-colors">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-14 pt-8 border-t border-white/20 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <p className="text-xs sm:text-sm text-white/60">
            © {new Date().getFullYear()} Goodies. All rights reserved.
          </p>
          <p className="text-xs text-white/60">
            Built in India · Startups to enterprise
          </p>
        </div>
      </div>
    </footer>
  )
}
