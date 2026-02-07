'use client'

import { Quote } from 'lucide-react'

const testimonials = [
  {
    quote: "What used to take weeks now takes minutes. Gifting finally feels effortless.",
    author: "HR Manager",
    role: "SaaS Company",
    company: null,
  },
  {
    quote: "Global gifting was a nightmare before this. Now it's completely under control.",
    author: "Operations Lead",
    role: null,
    company: null,
  },
  {
    quote: "No spreadsheets. No follow-ups. That alone makes it worth it.",
    author: "Founder",
    role: null,
    company: null,
  },
]

export function Testimonials() {
  return (
    <section className="py-16 sm:py-20 md:py-24 lg:py-28 bg-white w-full max-w-full overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full max-w-full box-border min-w-0">
        <div className="text-center mb-12 sm:mb-16 max-w-2xl mx-auto">
          <p className="text-primary text-xs font-semibold uppercase tracking-widest mb-4">
            Testimonials
          </p>
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-foreground tracking-tight leading-tight">
            What teams say about us
          </h2>
        </div>

        <div className="grid sm:grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6 md:gap-8 max-w-5xl mx-auto min-w-0">
          {testimonials.map((testimonial, index) => (
            <div
              key={index}
              className="relative p-6 sm:p-8 rounded-2xl border border-border/50 bg-white shadow-lg shadow-black/5 hover:shadow-xl hover:border-primary/20 transition-all duration-200 flex flex-col"
            >
              <Quote className="absolute top-5 right-5 h-8 w-8 text-primary/20" strokeWidth={1.5} />
              <p className="text-base sm:text-lg text-foreground leading-relaxed flex-1 pr-8">
                &ldquo;{testimonial.quote}&rdquo;
              </p>
              <div className="mt-6 pt-4 border-t border-border/40 flex items-center gap-3">
                <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-semibold text-sm">
                  {testimonial.author.charAt(0)}
                </div>
                <div>
                  <p className="font-semibold text-foreground">{testimonial.author}</p>
                  {testimonial.role && (
                    <p className="text-xs text-muted-foreground">{testimonial.role}</p>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
