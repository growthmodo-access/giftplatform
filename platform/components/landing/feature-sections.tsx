import { Button } from '@/components/ui/button'
import Image from 'next/image'

export function FeatureSections() {
  return (
    <>
      {/* Order Premium Swag Section */}
      <section id="swag" className="py-16 sm:py-20 md:py-24 lg:py-28 xl:py-32 bg-transparent">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8 lg:px-10">
          <div className="grid lg:grid-cols-2 gap-8 sm:gap-12 md:gap-16 lg:gap-20 items-center">
            <div className="flex justify-center order-2 lg:order-1">
              <div className="w-full max-w-lg">
                <Image
                  src="/IMG1.png"
                  alt="Premium swag and gifts showcase"
                  width={600}
                  height={400}
                  className="w-full h-auto rounded-2xl sm:rounded-3xl object-contain"
                  priority
                />
              </div>
            </div>
            <div className="order-1 lg:order-2">
              <div className="text-muted-foreground text-[10px] sm:text-xs font-bold uppercase tracking-widest mb-3 sm:mb-4">
                GLOBAL FULFILLMENT
              </div>
              <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-semibold text-foreground mb-4 sm:mb-6 leading-tight">
                Premium swag and gifts, shipped worldwide
              </h2>
              <p className="text-sm sm:text-base md:text-lg text-muted-foreground mb-6 sm:mb-8 leading-relaxed">
                We own inventory across 80+ countries. Order branded swag, premium gifts, or curated selections—we handle warehousing, customs, and delivery. No volume minimums, no logistics headaches.
              </p>
              <Button variant="outline" className="border-[#7B61FF]/30 bg-white/90 hover:bg-[#F8F3EC]/80 text-[#7B61FF] text-sm sm:text-base">
                Talk to sales
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Explore Gifts Section */}
      <section id="gifts" className="py-16 sm:py-20 md:py-24 lg:py-28 xl:py-32 bg-transparent">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8 lg:px-10">
          <div className="grid lg:grid-cols-2 gap-8 sm:gap-12 md:gap-16 lg:gap-20 items-center">
            <div className="lg:order-2 flex justify-center order-2 lg:order-2">
              <div className="gradient-primary-light p-6 sm:p-8 md:p-10 lg:p-12 rounded-2xl sm:rounded-3xl w-full max-w-lg grid grid-cols-3 gap-3 sm:gap-4 md:gap-6 border border-[#7B61FF]/20 shadow-primary">
                {['📷', '☕', '💳', '🎁', '🍫', '📦'].map((item, i) => (
                  <div
                    key={i}
                    className="bg-white/95 backdrop-blur-xl rounded-xl sm:rounded-2xl aspect-square flex items-center justify-center text-3xl sm:text-4xl md:text-5xl lg:text-6xl shadow-primary hover:scale-105 transition-transform border border-[#7B61FF]/10"
                  >
                    {item}
                  </div>
                ))}
              </div>
            </div>
            <div className="lg:order-1 order-1 lg:order-1">
              <div className="text-muted-foreground text-[10px] sm:text-xs font-bold uppercase tracking-widest mb-3 sm:mb-4">
                WHY GIFTS BEAT GIFT CARDS
              </div>
              <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-semibold text-foreground mb-4 sm:mb-6 leading-tight">
                Thoughtful gifts build stronger relationships
              </h2>
              <p className="text-sm sm:text-base md:text-lg text-muted-foreground mb-6 sm:mb-8 leading-relaxed">
                Gift cards feel transactional. Branded, curated gifts show you care. We curate premium selections that recipients actually want—from tech accessories to wellness products. Every gift reinforces your brand and strengthens relationships.
              </p>
              <Button variant="outline" className="border-[#7B61FF]/30 bg-white/90 hover:bg-[#F8F3EC]/80 text-[#7B61FF] text-sm sm:text-base">
                Talk to sales
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Automate Gifts Section */}
      <section className="py-16 sm:py-20 md:py-24 lg:py-28 xl:py-32 bg-transparent">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8 lg:px-10">
          <div className="grid lg:grid-cols-2 gap-8 sm:gap-12 md:gap-16 lg:gap-20 items-center">
            <div className="flex justify-center order-2 lg:order-1">
              <div className="grid grid-cols-2 gap-3 sm:gap-4 w-full max-w-md">
                {[
                  { title: 'WORK ANNIVERSARY!', stars: '⭐⭐⭐' },
                  { title: 'Welcome to the team!', photo: '👤' },
                  { title: 'Happy Birthday!', photo: '👤' },
                ].map((card, i) => (
                  <div
                    key={i}
                    className="bg-background backdrop-blur-xl p-4 sm:p-5 md:p-6 rounded-xl sm:rounded-2xl shadow-sm border border-border/50 hover:scale-105 transition-transform relative overflow-hidden"
                  >
                    <div className="absolute top-0 left-0 right-0 h-1 bg-foreground" />
                    <div className="flex flex-col items-center justify-center gap-2 sm:gap-3 min-h-[120px] sm:min-h-[150px] md:min-h-[180px]">
                      {card.photo && (
                        <div className="w-10 h-10 sm:w-12 sm:h-12 md:w-14 md:h-14 rounded-full bg-muted/50 flex items-center justify-center text-2xl sm:text-3xl border border-border/50">
                          {card.photo}
                        </div>
                      )}
                      {card.stars && <div className="text-xl sm:text-2xl">{card.stars}</div>}
                      <div className="text-xs sm:text-sm md:text-base font-semibold text-foreground text-center px-1">{card.title}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div className="order-1 lg:order-2">
              <div className="text-muted-foreground text-[10px] sm:text-xs font-bold uppercase tracking-widest mb-3 sm:mb-4">
                USE CASES
              </div>
              <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-semibold text-foreground mb-4 sm:mb-6 leading-tight">
                Gifts for employees, clients, and events
              </h2>
              <p className="text-sm sm:text-base md:text-lg text-muted-foreground mb-6 sm:mb-8 leading-relaxed space-y-2">
                <span className="block"><strong>Employee recognition:</strong> Welcome kits, work anniversaries, performance rewards</span>
                <span className="block"><strong>Client appreciation:</strong> Thank-you gifts, deal closings, partnership milestones</span>
                <span className="block"><strong>Events & campaigns:</strong> Conference swag, product launches, team offsites</span>
              </p>
              <Button variant="outline" className="border-[#7B61FF]/30 bg-white/90 hover:bg-[#F8F3EC]/80 text-[#7B61FF] text-sm sm:text-base">
                Talk to sales
              </Button>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}
