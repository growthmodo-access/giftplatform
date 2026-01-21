import { Button } from '@/components/ui/button'

export function FeatureSections() {
  return (
    <>
      {/* Order Premium Swag Section */}
      <section id="swag" className="py-24 lg:py-32 bg-transparent">
        <div className="max-w-7xl mx-auto px-10">
          <div className="grid lg:grid-cols-2 gap-20 items-center">
            <div className="flex justify-center">
              <div className="gradient-purple-light p-12 rounded-3xl w-full max-w-lg grid grid-cols-3 gap-6 border border-purple-200/50 shadow-purple">
                {['🎒', '☕', '🧢', '👕', '🧥', '📓'].map((item, i) => (
                  <div
                    key={i}
                    className="bg-white/90 backdrop-blur-xl rounded-2xl aspect-square flex items-center justify-center text-6xl shadow-purple hover:scale-105 transition-transform border border-purple-200/30"
                  >
                    {item}
                  </div>
                ))}
              </div>
            </div>
            <div>
              <div className="text-muted-foreground text-xs font-bold uppercase tracking-widest mb-4">
                THINK GLOBAL, ACT LOCAL
              </div>
              <h2 className="text-4xl lg:text-5xl font-semibold text-foreground mb-6 leading-tight">
                Order premium swag for your global team and events in any volume
              </h2>
              <p className="text-lg text-muted-foreground mb-8 leading-relaxed">
                Access hassle-free global swag with no shipping or customs fees. Premium swag in any volume, on-demand or in bulk, warehoused and delivered to over 80 countries.
              </p>
              <Button variant="outline" className="border-purple-300/50 bg-white/80 hover:bg-purple-50/80 text-purple-700">
                Learn more &gt;
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Explore Gifts Section */}
      <section id="gifts" className="py-24 lg:py-32 bg-transparent">
        <div className="max-w-7xl mx-auto px-10">
          <div className="grid lg:grid-cols-2 gap-20 items-center">
            <div className="lg:order-2 flex justify-center">
              <div className="gradient-purple-light p-12 rounded-3xl w-full max-w-lg grid grid-cols-3 gap-6 border border-purple-200/50 shadow-purple">
                {['📷', '☕', '💳', '🎁', '🍫', '📦'].map((item, i) => (
                  <div
                    key={i}
                    className="bg-white/90 backdrop-blur-xl rounded-2xl aspect-square flex items-center justify-center text-6xl shadow-purple hover:scale-105 transition-transform border border-purple-200/30"
                  >
                    {item}
                  </div>
                ))}
              </div>
            </div>
            <div className="lg:order-1">
              <div className="text-muted-foreground text-xs font-bold uppercase tracking-widest mb-4">
                GIVE THE GIFT OF CHOICE
              </div>
              <h2 className="text-4xl lg:text-5xl font-semibold text-foreground mb-6 leading-tight">
                Explore 60,000+ gifts and gift cards globally
              </h2>
              <p className="text-lg text-muted-foreground mb-8 leading-relaxed">
                Boost employee retention and client appreciation with thoughtful, personalized gifts for every occasion, allowing each person to choose something they truly love, and making every gift feel special and memorable.
              </p>
              <Button variant="outline" className="border-border/50">
                Learn More &gt;
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Automate Gifts Section */}
      <section className="py-24 lg:py-32 bg-transparent">
        <div className="max-w-7xl mx-auto px-10">
          <div className="grid lg:grid-cols-2 gap-20 items-center">
            <div className="flex justify-center">
              <div className="grid grid-cols-2 gap-4 w-full max-w-md">
                {[
                  { title: 'WORK ANNIVERSARY!', stars: '⭐⭐⭐' },
                  { title: 'Welcome to the team!', photo: '👤' },
                  { title: 'Happy Birthday!', photo: '👤' },
                ].map((card, i) => (
                  <div
                    key={i}
                    className="bg-background backdrop-blur-xl p-6 rounded-2xl shadow-sm border border-border/50 hover:scale-105 transition-transform relative overflow-hidden"
                  >
                    <div className="absolute top-0 left-0 right-0 h-1 bg-foreground" />
                    <div className="flex flex-col items-center justify-center gap-3 min-h-[180px]">
                      {card.photo && (
                        <div className="w-14 h-14 rounded-full bg-muted/50 flex items-center justify-center text-3xl border border-border/50">
                          {card.photo}
                        </div>
                      )}
                      {card.stars && <div className="text-2xl">{card.stars}</div>}
                      <div className="text-base font-semibold text-foreground text-center">{card.title}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div>
              <div className="text-muted-foreground text-xs font-bold uppercase tracking-widest mb-4">
                MAKE EVERY OCCASION MEANINGFUL
              </div>
              <h2 className="text-4xl lg:text-5xl font-semibold text-foreground mb-6 leading-tight">
                Automate gifts for new hires, birthdays, and anniversaries
              </h2>
              <p className="text-lg text-muted-foreground mb-8 leading-relaxed">
                Celebrate your employees' milestones effortlessly. Automate rewards for anniversaries, birthdays, and new hires to ensure every moment is recognized and appreciated.
              </p>
              <Button variant="outline" className="border-border/50">
                Learn More &gt;
              </Button>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}
