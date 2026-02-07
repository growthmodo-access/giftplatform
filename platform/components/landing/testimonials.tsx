import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'

const testimonials = [
  {
    quote: "We cut our gifting admin from a few days per campaign to under an hour. One catalog, one approval, and we can see exactly who received what. No more spreadsheets.",
    author: "Priya S.",
    role: "Head of People Ops",
    company: "Tech Startup, Bangalore",
    featured: true,
  },
  {
    quote: "We send to 15 countries. Goodies handles customs and logistics—we just pick the gifts. Delivery and tracking are in one place.",
    author: "Raj K.",
    role: "Marketing Director",
    company: "SaaS Company, Mumbai",
  },
  {
    quote: "Client gifts used to be a coordination nightmare. Now we run thank-you and milestone gifts from the same platform. Our clients notice the difference.",
    author: "Sarah M.",
    role: "VP of Sales",
    company: "B2B Services, Delhi",
  },
  {
    quote: "We needed global gifting without hiring a logistics person. Goodies gave us one dashboard and one invoice. Setup took a day.",
    author: "Arjun P.",
    role: "Founder",
    company: "Startup, Hyderabad",
  },
  {
    quote: "Onboarding kits and anniversary gifts are on autopilot. We set the rules once; finance approves once. No more chasing vendors or delivery status.",
    author: "Meera R.",
    role: "HR Manager",
    company: "Enterprise, Chennai",
  },
  {
    quote: "Indian preferences and global scale in one product. We standardized gifting across regions without adding headcount.",
    author: "Vikram D.",
    role: "COO",
    company: "Global Company, Pune",
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
            What HR and Ops teams say about Goodies
          </h2>
            <p className="text-base sm:text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto px-4 sm:px-0">
            Outcomes, not just feedback.
          </p>
        </div>

        <div className="grid sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-8">
          {testimonials.map((testimonial, index) => (
            <Card
              key={index}
              className={`
                p-6 sm:p-8 bg-white rounded-xl border border-border/40 shadow-sm hover:shadow-md transition-all duration-200
                ${testimonial.featured ? 'md:col-span-2 lg:col-span-1 border-primary/20' : ''}
              `}
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
