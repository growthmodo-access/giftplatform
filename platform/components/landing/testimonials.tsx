import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'

const testimonials = [
  {
    quote: "Goodies.so does everything for me, so it's very easy for our employees to also manage the platform. It's fairly simple to get in and pick what you want.",
    author: "Cici R.",
    role: "People Operations Generalist at Chernowe",
  },
  {
    quote: "Easy handling, superb customer support, high quality products.",
    role: "Mental Health Care Professional",
    company: "Spring Health",
    featured: true,
  },
  {
    quote: "The platform is really easy to use. We just decide where to spend money, and it works. Its adaptability lets us use it in different ways, and the reporting is great for taxable items. I can run one report at the end of the year, grass it up, and I know what to do.",
    author: "Shane C.",
    role: "VP of Human Resources, at Inhabit",
  },
  {
    quote: "I am very grateful that I had an opportunity to use the Goodies.so card. I love that I can use it as a regular debit card and pay on things that I wanted/needed. I also like where they would create suggestions on what we can use based on health and wellness. It introduced me to brands I had never thought of looking into. I'm also glad that this perk replenishes every year. Can't wait to use it again. Thank you so much for this benefit! It has helped me greatly!",
    author: "Aliyah J.",
  },
  {
    quote: "Its ability to scale while being easy to use for both the end user and the administrator is the really great thing about Goodies.so. Plus, it keeps it fun and fresh, which allows us to think about the employee experience differently every time.",
    author: "Holly N.",
    role: "Global Head of Marketing and Communications",
    company: "mapbox",
  },
  {
    quote: "The program is so easy for you and beneficial to what is being provided by our company as what we can and can not have. From choosing which site you want to use to transfer your balance is not limited.",
    author: "Holly N.",
    role: "IT Professional",
  },
]

export function Testimonials() {
  return (
    <section className="py-24 lg:py-32 bg-transparent">
      <div className="max-w-7xl mx-auto px-10">
        <div className="text-center mb-16">
          <div className="text-muted-foreground text-xs font-bold uppercase tracking-widest mb-4">
            PROOF IN ACTION
          </div>
          <h2 className="text-4xl lg:text-5xl font-semibold text-foreground mb-4">
            Our clients say it best
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            See what our customers around the world are saying about Goodies.so.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {testimonials.map((testimonial, index) => (
            <Card
              key={index}
              className={`
                p-8 glass hover:shadow-xl transition-all
                ${testimonial.featured ? 'md:col-span-2 lg:col-span-1 border-2 border-border/50' : ''}
              `}
            >
              <div className="flex flex-col gap-6">
                <p className="text-foreground leading-relaxed flex-1">
                  "{testimonial.quote}"
                </p>
                <div className="flex items-start gap-3">
                  <Avatar>
                    <AvatarFallback>👤</AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    {testimonial.author && (
                      <div className="font-semibold text-foreground">{testimonial.author}</div>
                    )}
                    {testimonial.role && (
                      <div className="text-sm text-muted-foreground">{testimonial.role}</div>
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
