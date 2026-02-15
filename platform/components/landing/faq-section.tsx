'use client'

import { ChevronDown } from 'lucide-react'
import { faqItems } from '@/lib/faq-data'

export function FAQSection() {
  return (
    <section className="landing-section w-full max-w-full overflow-hidden border-t border-border/20 bg-white">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 w-full max-w-full box-border min-w-0">
        <div className="text-center mb-10 sm:mb-12 space-y-4">
          <p className="landing-label">FAQ</p>
          <h2 className="landing-heading text-balance">Frequently asked questions</h2>
        </div>
        <div className="space-y-0 w-full divide-y divide-border/20">
          {faqItems.map((faq, index) => (
            <details
              key={index}
              className="group py-5 sm:py-6 first:pt-0"
            >
              <summary className="flex items-center justify-between gap-4 cursor-pointer list-none font-medium text-foreground text-left hover:text-primary/90 transition-colors">
                {faq.question}
                <ChevronDown className="h-4 w-4 shrink-0 text-muted-foreground group-open:rotate-180 transition-transform duration-200" strokeWidth={2} />
              </summary>
              <div className="mt-3 text-[15px] sm:text-base text-muted-foreground leading-relaxed pr-8">
                {faq.answer}
              </div>
            </details>
          ))}
        </div>
      </div>
    </section>
  )
}
