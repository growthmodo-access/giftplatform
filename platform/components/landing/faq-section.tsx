'use client'

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
    <section className="py-12 sm:py-20 md:py-24 lg:py-28 bg-white w-full max-w-full overflow-hidden">
      <div className="max-w-3xl mx-auto px-4 sm:px-5 lg:px-8 w-full max-w-full box-border min-w-0">
        <div className="text-center mb-10 sm:mb-14">
          <p className="text-muted-foreground text-xs font-medium uppercase tracking-wider mb-4">
            FAQ
          </p>
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-foreground tracking-tight leading-tight">
            Frequently asked questions
          </h2>
        </div>
        <div className="space-y-2 w-full">
          {faqs.map((faq, index) => (
            <details
              key={index}
              className="group rounded-xl border border-border/40 bg-muted/20 overflow-hidden"
            >
              <summary className="flex items-center justify-between gap-4 cursor-pointer list-none px-4 py-4 sm:px-5 sm:py-5 font-semibold text-foreground text-left">
                {faq.question}
                <span className="shrink-0 text-muted-foreground group-open:rotate-180 transition-transform">
                  ▼
                </span>
              </summary>
              <div className="px-4 pb-4 sm:px-5 sm:pb-5 pt-0 text-muted-foreground border-t border-border/40">
                {faq.answer}
              </div>
            </details>
          ))}
        </div>
      </div>
    </section>
  )
}
