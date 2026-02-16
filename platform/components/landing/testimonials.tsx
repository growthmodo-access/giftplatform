'use client'

import { Quote } from 'lucide-react'

const testimonials = [
  { quote: "What used to take weeks now takes minutes. Gifting finally feels effortless.", author: "HR Manager", role: "SaaS Company" },
  { quote: "Global gifting was a nightmare before this. Now it's completely under control.", author: "Operations Lead", role: null },
  { quote: "No spreadsheets. No follow-ups. That alone makes it worth it.", author: "Founder", role: null },
]

export function Testimonials() {
  return (
    <section className="landing-section w-full max-w-full overflow-hidden border-t border-border/20 bg-white">
      <div className="landing-container">
        <div className="text-center mb-6 sm:mb-8 md:mb-10 max-w-2xl mx-auto space-y-3 px-2 sm:px-0">
          <p className="landing-label">Testimonials</p>
          <h2 className="landing-heading text-balance">What teams say about us</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 sm:gap-6 md:gap-8 max-w-4xl mx-auto min-w-0 px-2 sm:px-0">
          {testimonials.map((testimonial, index) => (
            <div
              key={index}
              className="flex flex-col p-5 sm:p-6 rounded-xl border border-border/20 bg-muted/20 sm:bg-transparent sm:border-0 sm:p-0"
            >
              <Quote className="h-5 w-5 sm:h-6 sm:w-6 text-primary/30 mb-3 sm:mb-4 shrink-0" strokeWidth={1.5} aria-hidden />
              <p className="text-[15px] sm:text-base text-foreground leading-relaxed flex-1 min-w-0">
                &ldquo;{testimonial.quote}&rdquo;
              </p>
              <div className="mt-5 sm:mt-6 pt-4 flex items-center gap-3 min-w-0">
                <div className="h-10 w-10 sm:h-9 sm:w-9 rounded-full bg-primary/10 flex items-center justify-center text-primary font-medium text-sm sm:text-xs shrink-0">
                  {testimonial.author.charAt(0)}
                </div>
                <div className="min-w-0">
                  <p className="font-medium text-foreground text-sm truncate">{testimonial.author}</p>
                  {testimonial.role && <p className="text-xs text-muted-foreground mt-0.5 truncate">{testimonial.role}</p>}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
