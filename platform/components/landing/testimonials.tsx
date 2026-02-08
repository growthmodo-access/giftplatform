'use client'

import { Quote } from 'lucide-react'

const testimonials = [
  { quote: "What used to take weeks now takes minutes. Gifting finally feels effortless.", author: "HR Manager", role: "SaaS Company" },
  { quote: "Global gifting was a nightmare before this. Now it's completely under control.", author: "Operations Lead", role: null },
  { quote: "No spreadsheets. No follow-ups. That alone makes it worth it.", author: "Founder", role: null },
]

export function Testimonials() {
  return (
    <section className="landing-section bg-white w-full max-w-full overflow-hidden">
      <div className="landing-container">
        <div className="text-center mb-14 sm:mb-16 max-w-2xl mx-auto space-y-4">
          <p className="landing-label">Testimonials</p>
          <h2 className="landing-heading">What teams say about us</h2>
        </div>

        <div className="grid sm:grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8 max-w-5xl mx-auto min-w-0">
          {testimonials.map((testimonial, index) => (
            <div
              key={index}
              className="relative p-8 sm:p-10 rounded-2xl border border-border/50 bg-white shadow-lg shadow-black/5 hover:shadow-xl hover:border-primary/20 transition-all duration-200 flex flex-col"
            >
              <Quote className="absolute top-6 right-6 h-8 w-8 text-primary/15" strokeWidth={1.5} />
              <p className="text-base sm:text-lg text-foreground leading-[1.65] flex-1 pr-10">
                &ldquo;{testimonial.quote}&rdquo;
              </p>
              <div className="mt-8 pt-5 border-t border-border/40 flex items-center gap-4">
                <div className="h-11 w-11 rounded-full bg-primary/10 flex items-center justify-center text-primary font-semibold text-sm">
                  {testimonial.author.charAt(0)}
                </div>
                <div>
                  <p className="font-semibold text-foreground">{testimonial.author}</p>
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
