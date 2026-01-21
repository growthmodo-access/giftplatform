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
    <section id="blog" className="py-24 lg:py-32 bg-transparent">
      <div className="max-w-7xl mx-auto px-10">
        <div className="text-center mb-12">
          <h2 className="text-4xl lg:text-5xl font-semibold text-foreground mb-4">
            Resources for better gifting
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto mb-8">
            Learn how thoughtful gifting drives employee engagement, strengthens client relationships, and elevates events.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center max-w-md mx-auto">
            <Input
              type="text"
              placeholder="Search articles..."
              className="flex-1"
            />
            <Button variant="outline">View all articles</Button>
          </div>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {blogPosts.map((post, index) => (
            <Card
              key={index}
              className="p-6 glass hover:shadow-xl transition-all cursor-pointer group"
            >
              <div className="text-6xl mb-4 group-hover:scale-110 transition-transform">
                {post.emoji}
              </div>
              <h3 className="text-xl font-semibold text-foreground leading-tight">
                {post.title}
              </h3>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}
