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
    <footer className="bg-[#F8F3EC]/50 border-t border-[#F8F3EC]/50 py-8 sm:py-12 md:py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8 lg:px-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-8 sm:gap-10 md:gap-12">
          {/* Logo and Social */}
          <div className="lg:col-span-2">
            <div className="flex items-center gap-2 mb-3 sm:mb-4">
              <Image
                src="/logogoodies.png"
                alt="Goodies Logo"
                width={120}
                height={60}
                className="h-6 sm:h-8 md:h-10 lg:h-12 w-auto object-contain"
              />
            </div>
            <p className="text-muted-foreground text-xs sm:text-sm mb-4 sm:mb-6">
              © 2024 Goodies.so. All rights reserved.
            </p>
            <div className="flex flex-wrap gap-3 sm:gap-4">
              {['LinkedIn', 'Instagram', 'Facebook', 'Twitter'].map((social) => (
                <a
                  key={social}
                  href="#"
                  className="text-muted-foreground hover:text-foreground text-xs sm:text-sm font-medium transition-colors"
                >
                  {social}
                </a>
              ))}
            </div>
          </div>

          {/* Footer Links */}
          {Object.entries(footerLinks).map(([category, links]) => (
            <div key={category}>
              <h4 className="font-semibold text-foreground mb-3 sm:mb-4 text-sm sm:text-base">{category}</h4>
              <ul className="space-y-2 sm:space-y-3">
                {links.map((link) => (
                  <li key={link}>
                    <a
                      href="#"
                      className="text-muted-foreground hover:text-foreground text-xs sm:text-sm transition-colors"
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
        <div className="mt-8 sm:mt-10 md:mt-12 pt-6 sm:pt-8 border-t border-border/50 flex flex-wrap gap-3 sm:gap-4">
          <div className="flex items-center gap-2 px-3 sm:px-4 py-1.5 sm:py-2 bg-white/90 backdrop-blur-sm rounded-lg border border-[#F8F3EC]/50 shadow-sm">
            <span className="text-[10px] sm:text-xs font-bold text-foreground">ACTA</span>
            <span className="text-xs sm:text-sm font-semibold text-foreground">500</span>
          </div>
          <div className="flex items-center gap-2 px-3 sm:px-4 py-1.5 sm:py-2 bg-white/90 backdrop-blur-sm rounded-lg border border-[#F8F3EC]/50 shadow-sm">
            <span className="text-base sm:text-lg">🌱</span>
            <span className="text-xs sm:text-sm font-semibold text-foreground">Eco-Friendly</span>
          </div>
        </div>
      </div>
    </footer>
  )
}
