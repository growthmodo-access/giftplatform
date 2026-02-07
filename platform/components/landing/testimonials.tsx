import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'

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
    <section className="py-12 sm:py-24 lg:py-28 bg-muted/20">
      <div className="max-w-7xl mx-auto px-4 sm:px-5 lg:px-8">
        <div className="text-center mb-10 sm:mb-16">
          <div className="text-muted-foreground text-xs font-medium uppercase tracking-wider mb-4 sm:mb-6">
            CUSTOMERS
          </div>
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-foreground tracking-tight mb-6 sm:mb-8 leading-tight px-4 sm:px-0">
            Testimonials
          </h2>
        </div>

        <div className="grid sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-8">
          {testimonials.map((testimonial, index) => (
            <Card
              key={index}
              className="p-6 sm:p-8 bg-white rounded-xl border border-border/40 shadow-sm hover:shadow-md transition-all duration-200"
            >
              <div className="flex flex-col gap-5 sm:gap-6 md:gap-8">
                <p className="text-base sm:text-lg text-foreground leading-relaxed flex-1">
                  "{testimonial.quote}"
                </p>
                <div className="flex items-start gap-2 sm:gap-3">
                  <Avatar className="w-8 h-8 sm:w-10 sm:h-10">
                    <AvatarFallback className="text-xs sm:text-sm">👤</AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    {testimonial.author && (
                      <div className="text-sm sm:text-base font-semibold text-foreground">{testimonial.author}</div>
                    )}
                    {testimonial.role && (
                      <div className="text-xs sm:text-sm text-muted-foreground">{testimonial.role}</div>
                    )}
                  </div>
                </div>
                {testimonial.company && (
                  <div className="pt-4 border-t border-border/50">
                    <Badge variant="outline" className="text-foreground border-border/50">
                      {testimonial.company}
                    </Badge>
                  </div>
                )}
              </div>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}
