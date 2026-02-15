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
        <div className="text-center mb-10 sm:mb-12 max-w-2xl mx-auto space-y-4">
          <p className="landing-label">Testimonials</p>
          <h2 className="landing-heading text-balance">What teams say about us</h2>
        </div>

        <div className="grid sm:grid-cols-1 md:grid-cols-3 gap-8 sm:gap-10 max-w-4xl mx-auto min-w-0">
          {testimonials.map((testimonial, index) => (
            <div key={index} className="flex flex-col">
              <Quote className="h-6 w-6 text-primary/30 mb-4" strokeWidth={1.5} aria-hidden />
              <p className="text-[15px] sm:text-base text-foreground leading-relaxed flex-1">
                &ldquo;{testimonial.quote}&rdquo;
              </p>
              <div className="mt-6 pt-4 flex items-center gap-3">
                <div className="h-9 w-9 rounded-full bg-primary/10 flex items-center justify-center text-primary font-medium text-xs">
                  {testimonial.author.charAt(0)}
                </div>
                <div>
                  <p className="font-medium text-foreground text-sm">{testimonial.author}</p>
                  {testimonial.role && <p className="text-xs text-muted-foreground mt-0.5">{testimonial.role}</p>}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
