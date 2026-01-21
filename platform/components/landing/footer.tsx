import Link from 'next/link'
import Image from 'next/image'

const footerLinks = {
  Company: ['About', 'Careers', 'Contact', 'Partners'],
  Solutions: ['Employee Engagement', 'Client Gifting', 'Events', 'Recognition'],
  Products: ['Swag', 'Gifts', 'Gift Cards', 'Automation'],
  Resources: ['Blog', 'Case Studies', 'Guides', 'API Docs'],
  Legal: ['Privacy', 'Terms', 'Security', 'Compliance'],
}

export function Footer() {
  return (
    <footer className="bg-background border-t border-border/50 py-16">
      <div className="max-w-7xl mx-auto px-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-12">
          {/* Logo and Social */}
          <div className="lg:col-span-2">
            <div className="flex items-center gap-2 mb-4">
              <div className="relative w-32 h-16">
                <Image
                  src="/goodies.png"
                  alt="Goodies.so Logo"
                  fill
                  className="object-contain"
                  priority
                />
              </div>
            </div>
            <p className="text-muted-foreground text-sm mb-6">
              © 2024 Goodies.so. All rights reserved.
            </p>
            <div className="flex flex-wrap gap-4">
              {['LinkedIn', 'Instagram', 'Facebook', 'Twitter'].map((social) => (
                <a
                  key={social}
                  href="#"
                  className="text-muted-foreground hover:text-foreground text-sm font-medium transition-colors"
                >
                  {social}
                </a>
              ))}
            </div>
          </div>

          {/* Footer Links */}
          {Object.entries(footerLinks).map(([category, links]) => (
            <div key={category}>
              <h4 className="font-semibold text-foreground mb-4">{category}</h4>
              <ul className="space-y-3">
                {links.map((link) => (
                  <li key={link}>
                    <a
                      href="#"
                      className="text-muted-foreground hover:text-foreground text-sm transition-colors"
                    >
                      {link}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Badges */}
        <div className="mt-12 pt-8 border-t border-border/50 flex flex-wrap gap-4">
          <div className="flex items-center gap-2 px-4 py-2 bg-muted/50 rounded-lg border border-border/50">
            <span className="text-xs font-bold text-foreground">ACTA</span>
            <span className="text-sm font-semibold text-foreground">500</span>
          </div>
          <div className="flex items-center gap-2 px-4 py-2 bg-muted/50 rounded-lg border border-border/50">
            <span className="text-lg">🌱</span>
            <span className="text-sm font-semibold text-foreground">Eco-Friendly</span>
          </div>
        </div>
      </div>
    </footer>
  )
}
