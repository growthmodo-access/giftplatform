import Image from 'next/image'
import Link from 'next/link'

const productLinks = [
  { label: 'Corporate gifting', href: '#solutions' },
  { label: 'Employee recognition', href: '#solutions' },
  { label: 'Campaigns & swag', href: '#solutions' },
  { label: 'Pricing', href: '#pricing' },
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
    <footer className="bg-muted/30 border-t border-border/40 w-full max-w-full overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-5 lg:px-8 py-10 sm:py-12 w-full max-w-full box-border min-w-0">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6 sm:gap-8 lg:gap-10 min-w-0">
          {/* Brand + address */}
          <div className="lg:col-span-2 min-w-0">
            <Link href="/" className="inline-block mb-4">
              <Image
                src="/logogoodies.png"
                alt="Goodies"
                width={200}
                height={100}
                className="h-9 sm:h-10 w-auto max-w-[140px] object-contain"
                unoptimized
              />
            </Link>
            <p className="text-sm text-muted-foreground max-w-xs mb-4">
              Corporate gifting and swag, built for India. Ship to 80+ countries from one platform.
            </p>
            <div className="text-sm text-muted-foreground space-y-1">
              <p className="font-medium text-foreground">Goodies.so</p>
              <p>India · Shipping globally</p>
              <a href="mailto:hello@goodies.so" className="text-primary hover:underline block mt-2">
                hello@goodies.so
              </a>
            </div>
          </div>

          {/* Product */}
          <div>
            <h3 className="font-semibold text-foreground text-sm uppercase tracking-wider mb-4">Product</h3>
            <ul className="space-y-2.5">
              {productLinks.map((link) => (
                <li key={link.href}>
                  <a href={link.href} className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Company */}
          <div>
            <h3 className="font-semibold text-foreground text-xs uppercase tracking-wider mb-4">Company</h3>
            <ul className="space-y-2.5">
              {companyLinks.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h3 className="font-semibold text-foreground text-xs uppercase tracking-wider mb-4">Legal</h3>
            <ul className="space-y-2.5">
              {legalLinks.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-10 pt-8 border-t border-border/40 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <p className="text-xs sm:text-sm text-muted-foreground">
            © {new Date().getFullYear()} Goodies.so. All rights reserved.
          </p>
          <p className="text-xs text-muted-foreground">
            Built in India · Startups to enterprise
          </p>
        </div>
      </div>
    </footer>
  )
}
