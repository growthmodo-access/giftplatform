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
    <section id="blog" className="py-16 sm:py-20 md:py-24 lg:py-28 xl:py-32 gradient-landing">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8 lg:px-10">
        <div className="text-center mb-8 sm:mb-10 md:mb-12">
          <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-3 sm:mb-4 leading-tight px-4 sm:px-0">
            Resources for better gifting
          </h2>
          <p className="text-sm sm:text-base md:text-lg text-muted-foreground max-w-2xl mx-auto mb-6 sm:mb-8 px-4 sm:px-0">
            Learn how thoughtful gifting drives employee engagement, strengthens client relationships, and elevates events.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center max-w-md mx-auto px-4 sm:px-0">
            <Input
              type="text"
              placeholder="Search articles..."
              className="flex-1 text-sm sm:text-base"
            />
            <Button variant="outline" className="text-sm sm:text-base">View all articles</Button>
          </div>
        </div>

        <div className="grid sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5 md:gap-6">
          {blogPosts.map((post, index) => (
            <Card
              key={index}
              className="p-5 sm:p-6 glass hover:shadow-xl transition-all cursor-pointer group"
            >
              <div className="text-4xl sm:text-5xl md:text-6xl mb-3 sm:mb-4 group-hover:scale-110 transition-transform">
                {post.emoji}
              </div>
              <h3 className="text-base sm:text-lg md:text-xl font-bold text-foreground leading-tight">
                {post.title}
              </h3>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}
