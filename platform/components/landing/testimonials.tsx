import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'

const testimonials = [
  {
    quote: "The quality of gifts is excellent, and our team actually uses them. Way better than gift cards that get forgotten.",
    author: "Priya S.",
    role: "Head of People Ops",
    company: "Tech Startup, Bangalore",
    featured: true,
  },
  {
    quote: "We ship to 15 countries. Goodies handles all the customs and logistics—we just pick the gifts and they handle the rest.",
    author: "Raj K.",
    role: "Marketing Director",
    company: "SaaS Company, Mumbai",
  },
  {
    quote: "Our clients love the branded gifts. It's become a differentiator for us in how we show appreciation.",
    author: "Sarah M.",
    role: "VP of Sales",
    company: "B2B Services, Delhi",
  },
  {
    quote: "The platform is simple, but the real value is in the fulfillment. They make global gifting feel local.",
    author: "Arjun P.",
    role: "Founder",
    company: "Startup, Hyderabad",
  },
  {
    quote: "We use it for employee onboarding and client thank-yous. The branded packaging makes a real impression.",
    author: "Meera R.",
    role: "HR Manager",
    company: "Enterprise, Chennai",
  },
  {
    quote: "Finally, a gifting platform that understands both Indian preferences and global scale. Exactly what we needed.",
    author: "Vikram D.",
    role: "COO",
    company: "Global Company, Pune",
  },
]

export function Testimonials() {
  return (
    <section className="py-16 sm:py-20 md:py-24 lg:py-28 xl:py-32 gradient-landing">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8 lg:px-10">
        <div className="text-center mb-8 sm:mb-12 md:mb-16">
          <div className="text-muted-foreground text-[10px] sm:text-xs font-bold uppercase tracking-widest mb-3 sm:mb-4">
            EARLY CUSTOMERS
          </div>
          <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-3 sm:mb-4 leading-tight px-4 sm:px-0">
            What our customers are saying
          </h2>
          <p className="text-sm sm:text-base md:text-lg text-muted-foreground max-w-2xl mx-auto px-4 sm:px-0">
            We're early, but we're building something special. Here's what our first customers have to say.
          </p>
        </div>

        <div className="grid sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          {testimonials.map((testimonial, index) => (
            <Card
              key={index}
              className={`
                p-5 sm:p-6 md:p-8 glass hover:shadow-xl transition-all
                ${testimonial.featured ? 'md:col-span-2 lg:col-span-1 border-2 border-border/50' : ''}
              `}
            >
              <div className="flex flex-col gap-4 sm:gap-5 md:gap-6">
                <p className="text-sm sm:text-base text-foreground leading-relaxed flex-1">
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
