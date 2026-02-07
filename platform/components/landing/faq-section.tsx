'use client'

import { ChevronDown } from 'lucide-react'

const faqs = [
  {
    question: 'Do you handle international shipping?',
    answer: 'Yes. We manage global fulfillment and delivery across multiple regions.',
  },
  {
    question: 'Can recipients choose their own address?',
    answer: 'Yes. Recipients securely enter their details themselves.',
  },
  {
    question: 'Is this suitable for large teams?',
    answer: 'Absolutely. The platform is built to scale from small teams to enterprises.',
  },
  {
    question: 'Can we customize gifts with our branding?',
    answer: 'Yes. Branding and custom kits are fully supported.',
  },
]

export function FAQSection() {
  return (
    <section className="py-16 sm:py-20 md:py-24 lg:py-28 bg-muted/30 w-full max-w-full overflow-hidden">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 w-full max-w-full box-border min-w-0">
        <div className="text-center mb-12 sm:mb-14">
          <p className="text-primary text-xs font-semibold uppercase tracking-widest mb-4">
            FAQ
          </p>
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-foreground tracking-tight leading-tight">
            Frequently asked questions
          </h2>
        </div>
        <div className="space-y-3 w-full">
          {faqs.map((faq, index) => (
            <details
              key={index}
              className="group rounded-2xl border border-border/50 bg-white shadow-sm hover:shadow-md overflow-hidden transition-shadow [&[open]]:shadow-md [&[open]]:ring-2 [&[open]]:ring-primary/20"
            >
              <summary className="flex items-center justify-between gap-4 cursor-pointer list-none px-5 py-4 sm:px-6 sm:py-5 font-semibold text-foreground text-left hover:bg-muted/30 transition-colors">
                {faq.question}
                <ChevronDown className="h-5 w-5 shrink-0 text-muted-foreground group-open:rotate-180 transition-transform duration-200" strokeWidth={2} />
              </summary>
              <div className="px-5 pb-5 sm:px-6 sm:pb-6 pt-0 text-muted-foreground border-t border-border/40 bg-muted/20">
                {faq.answer}
              </div>
            </details>
          ))}
        </div>
      </div>
    </section>
  )
}
