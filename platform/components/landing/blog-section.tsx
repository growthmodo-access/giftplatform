import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card } from '@/components/ui/card'

const blogPosts = [
  { emoji: '🎁', title: 'Why branded gifts beat gift cards every time' },
  { emoji: '🌍', title: 'Global gifting: How to ship to 80+ countries without the hassle' },
  { emoji: '👥', title: 'Employee gifting strategies that actually boost retention' },
  { emoji: '🤝', title: 'Client appreciation gifts that strengthen relationships' },
  { emoji: '🎉', title: 'Event swag that makes an impression' },
  { emoji: '📊', title: 'Measuring ROI on corporate gifting programs' },
]

export function BlogSection() {
  return (
    <section id="blog" className="py-20 sm:py-24 md:py-28 lg:py-32 xl:py-36 gradient-landing">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8 lg:px-10">
        <div className="text-center mb-12 sm:mb-16 md:mb-20">
          <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-foreground mb-6 sm:mb-8 leading-tight px-4 sm:px-0">
            Resources for better gifting
          </h2>
          <p className="text-base sm:text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto mb-8 sm:mb-10 px-4 sm:px-0">
            Learn how thoughtful gifting drives employee engagement, strengthens client relationships, and elevates events.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 sm:gap-5 justify-center max-w-lg mx-auto px-4 sm:px-0">
            <Input
              type="text"
              placeholder="Search articles..."
              className="flex-1 text-base sm:text-lg px-6 py-4 border-2 border-[#F8F3EC]/50 focus:border-[#7B61FF]/40"
            />
            <Button variant="outline" className="text-base sm:text-lg px-8 py-4 border-2 border-[#7B61FF]/40 bg-white/95 hover:bg-[#F8F3EC]/90">View all articles</Button>
          </div>
        </div>

        <div className="grid sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {blogPosts.map((post, index) => (
            <Card
              key={index}
              className="p-6 sm:p-8 md:p-10 glass hover:shadow-2xl hover:scale-105 transition-all duration-300 cursor-pointer group border-2 border-white/50"
            >
              <div className="text-5xl sm:text-6xl md:text-7xl mb-4 sm:mb-6 group-hover:scale-110 transition-transform duration-300">
                {post.emoji}
              </div>
              <h3 className="text-lg sm:text-xl md:text-2xl font-bold text-foreground leading-tight">
                {post.title}
              </h3>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}
