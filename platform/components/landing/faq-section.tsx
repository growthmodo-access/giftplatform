'use client'

import { ChevronDown } from 'lucide-react'
import { faqItems } from '@/lib/faq-data'

export function FAQSection() {
  return (
    <section
      className="landing-section w-full max-w-full overflow-hidden border-t border-border/20 bg-white"
      aria-labelledby="faq-heading"
    >
      <div className="max-w-xl mx-auto px-4 sm:px-6 lg:px-8 w-full max-w-full box-border min-w-0">
        <div className="text-center mb-8 sm:mb-12 space-y-3">
          <p className="landing-label">FAQ</p>
          <h2 id="faq-heading" className="landing-heading text-balance">
            Frequently asked questions
          </h2>
          <p className="text-[15px] sm:text-base text-muted-foreground leading-relaxed max-w-lg mx-auto">
            Quick answers about shipping, addresses, and customization.
          </p>
        </div>
        <div className="space-y-0 w-full divide-y divide-border/30">
          {faqItems.map((faq, index) => (
            <details
              key={index}
              className="group py-0"
            >
              <summary className="flex items-center justify-between gap-4 cursor-pointer list-none py-5 sm:py-6 px-0 font-medium text-foreground text-[15px] sm:text-base text-left rounded-lg hover:bg-muted/30 hover:text-foreground transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/20 focus-visible:ring-offset-2 focus-visible:bg-muted/20 [&::-webkit-details-marker]:hidden">
                <span className="pr-4">{faq.question}</span>
                <ChevronDown className="h-4 w-4 sm:h-5 sm:w-5 shrink-0 text-muted-foreground group-open:rotate-180 transition-transform duration-200 flex-shrink-0" strokeWidth={2} aria-hidden />
              </summary>
              <div className="pb-5 sm:pb-6 pl-5 sm:pl-6 pr-10 sm:pr-12 text-[15px] sm:text-base text-muted-foreground leading-relaxed border-l-2 border-primary/20">
                {faq.answer}
              </div>
            </details>
          ))}
        </div>
      </div>
    </section>
  )
}
