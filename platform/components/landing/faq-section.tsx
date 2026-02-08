'use client'

import { ChevronDown } from 'lucide-react'
import { faqItems } from '@/lib/faq-data'

export function FAQSection() {
  return (
    <section className="landing-section bg-muted/30 w-full max-w-full overflow-hidden">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 w-full max-w-full box-border min-w-0">
        <div className="text-center mb-12 sm:mb-14 space-y-4">
          <p className="landing-label">FAQ</p>
          <h2 className="landing-heading">Frequently asked questions</h2>
        </div>
        <div className="space-y-4 w-full">
          {faqItems.map((faq, index) => (
            <details
              key={index}
              className="group rounded-2xl border border-border/50 bg-white shadow-sm hover:shadow-md overflow-hidden transition-shadow [&[open]]:shadow-md [&[open]]:ring-2 [&[open]]:ring-primary/20"
            >
              <summary className="flex items-center justify-between gap-4 cursor-pointer list-none px-6 py-5 sm:py-6 font-semibold text-foreground text-left hover:bg-muted/30 transition-colors">
                {faq.question}
                <ChevronDown className="h-5 w-5 shrink-0 text-muted-foreground group-open:rotate-180 transition-transform duration-200" strokeWidth={2} />
              </summary>
              <div className="px-6 pb-6 pt-0 text-muted-foreground leading-[1.65] border-t border-border/40 bg-muted/20">
                {faq.answer}
              </div>
            </details>
          ))}
        </div>
      </div>
    </section>
  )
}
