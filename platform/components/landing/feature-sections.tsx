import { Button } from '@/components/ui/button'

export function FeatureSections() {
  return (
    <>
      {/* Order Premium Swag Section */}
      <section id="swag" className="py-24 lg:py-32 bg-transparent">
        <div className="max-w-7xl mx-auto px-10">
          <div className="grid lg:grid-cols-2 gap-20 items-center">
            <div className="flex justify-center">
              <div className="gradient-primary-light p-12 rounded-3xl w-full max-w-lg grid grid-cols-3 gap-6 border border-[#7B61FF]/20 shadow-primary">
                {['🎒', '☕', '🧢', '👕', '🧥', '📓'].map((item, i) => (
                  <div
                    key={i}
                    className="bg-white/95 backdrop-blur-xl rounded-2xl aspect-square flex items-center justify-center text-6xl shadow-primary hover:scale-105 transition-transform border border-[#7B61FF]/10"
                  >
                    {item}
                  </div>
                ))}
              </div>
            </div>
            <div>
              <div className="text-muted-foreground text-xs font-bold uppercase tracking-widest mb-4">
                GLOBAL FULFILLMENT
              </div>
              <h2 className="text-4xl lg:text-5xl font-semibold text-foreground mb-6 leading-tight">
                Premium swag and gifts, shipped worldwide
              </h2>
              <p className="text-lg text-muted-foreground mb-8 leading-relaxed">
                We own inventory across 80+ countries. Order branded swag, premium gifts, or curated selections—we handle warehousing, customs, and delivery. No volume minimums, no logistics headaches.
              </p>
              <Button variant="outline" className="border-[#7B61FF]/30 bg-white/90 hover:bg-[#F8F3EC]/80 text-[#7B61FF]">
                Talk to sales
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
              <div className="gradient-primary-light p-12 rounded-3xl w-full max-w-lg grid grid-cols-3 gap-6 border border-[#7B61FF]/20 shadow-primary">
                {['📷', '☕', '💳', '🎁', '🍫', '📦'].map((item, i) => (
                  <div
                    key={i}
                    className="bg-white/95 backdrop-blur-xl rounded-2xl aspect-square flex items-center justify-center text-6xl shadow-primary hover:scale-105 transition-transform border border-[#7B61FF]/10"
                  >
                    {item}
                  </div>
                ))}
              </div>
            </div>
            <div className="lg:order-1">
              <div className="text-muted-foreground text-xs font-bold uppercase tracking-widest mb-4">
                WHY GIFTS BEAT GIFT CARDS
              </div>
              <h2 className="text-4xl lg:text-5xl font-semibold text-foreground mb-6 leading-tight">
                Thoughtful gifts build stronger relationships
              </h2>
              <p className="text-lg text-muted-foreground mb-8 leading-relaxed">
                Gift cards feel transactional. Branded, curated gifts show you care. We curate premium selections that recipients actually want—from tech accessories to wellness products. Every gift reinforces your brand and strengthens relationships.
              </p>
              <Button variant="outline" className="border-[#7B61FF]/30 bg-white/90 hover:bg-[#F8F3EC]/80 text-[#7B61FF]">
                Talk to sales
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
                USE CASES
              </div>
              <h2 className="text-4xl lg:text-5xl font-semibold text-foreground mb-6 leading-tight">
                Gifts for employees, clients, and events
              </h2>
              <p className="text-lg text-muted-foreground mb-8 leading-relaxed">
                <strong>Employee recognition:</strong> Welcome kits, work anniversaries, performance rewards<br/>
                <strong>Client appreciation:</strong> Thank-you gifts, deal closings, partnership milestones<br/>
                <strong>Events & campaigns:</strong> Conference swag, product launches, team offsites
              </p>
              <Button variant="outline" className="border-[#7B61FF]/30 bg-white/90 hover:bg-[#F8F3EC]/80 text-[#7B61FF]">
                Talk to sales
              </Button>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}
