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
    <footer className="bg-white border-t border-gray-200 py-16">
      <div className="max-w-7xl mx-auto px-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-12">
          {/* Logo and Social */}
          <div className="lg:col-span-2">
            <div className="flex items-center gap-2 mb-4">
              <div className="relative w-8 h-8">
                <Image
                  src="/goodies.png"
                  alt="Goodies.so Logo"
                  fill
                  className="object-contain"
                  priority
                />
              </div>
              <span className="font-bold text-lg bg-gradient-to-r from-purple-600 to-purple-400 bg-clip-text text-transparent">
                Goodies.so
              </span>
            </div>
            <p className="text-gray-600 text-sm mb-6">
              © 2024 Goodies.so. All rights reserved.
            </p>
            <div className="flex flex-wrap gap-4">
              {['LinkedIn', 'Instagram', 'Facebook', 'Twitter'].map((social) => (
                <a
                  key={social}
                  href="#"
                  className="text-gray-600 hover:text-purple-600 text-sm font-medium transition-colors"
                >
                  {social}
                </a>
              ))}
            </div>
          </div>

          {/* Footer Links */}
          {Object.entries(footerLinks).map(([category, links]) => (
            <div key={category}>
              <h4 className="font-semibold text-gray-900 mb-4">{category}</h4>
              <ul className="space-y-3">
                {links.map((link) => (
                  <li key={link}>
                    <a
                      href="#"
                      className="text-gray-600 hover:text-purple-600 text-sm transition-colors"
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
        <div className="mt-12 pt-8 border-t border-gray-200 flex flex-wrap gap-4">
          <div className="flex items-center gap-2 px-4 py-2 bg-gray-100 rounded-lg">
            <span className="text-xs font-bold text-gray-700">ACTA</span>
            <span className="text-sm font-semibold text-gray-900">500</span>
          </div>
          <div className="flex items-center gap-2 px-4 py-2 bg-green-50 rounded-lg">
            <span className="text-lg">🌱</span>
            <span className="text-sm font-semibold text-green-700">Eco-Friendly</span>
          </div>
        </div>
      </div>
    </footer>
  )
}
