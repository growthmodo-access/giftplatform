import { Button } from '@/components/ui/button'
import Image from 'next/image'

export function FeatureSections() {
  return (
    <>
      {/* Order Premium Swag Section */}
      <section id="swag" className="py-16 sm:py-20 md:py-24 lg:py-28 xl:py-32 gradient-landing">
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
              <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-4 sm:mb-6 leading-tight">
                Premium swag and gifts, shipped worldwide
              </h2>
              <p className="text-sm sm:text-base md:text-lg text-muted-foreground mb-6 sm:mb-8 leading-relaxed">
                We own inventory across 80+ countries. Order branded swag, premium gifts, or curated selections. We handle warehousing, customs, and delivery. No volume minimums, no logistics headaches.
              </p>
              <Button variant="outline" className="border-[#7B61FF]/30 bg-white/90 hover:bg-[#F8F3EC]/80 text-[#7B61FF] text-sm sm:text-base">
                Talk to sales
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Explore Gifts Section */}
      <section id="gifts" className="py-16 sm:py-20 md:py-24 lg:py-28 xl:py-32 gradient-landing">
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
              <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-4 sm:mb-6 leading-tight">
                Thoughtful gifts build stronger relationships
              </h2>
              <p className="text-sm sm:text-base md:text-lg text-muted-foreground mb-6 sm:mb-8 leading-relaxed">
                Gift cards feel transactional. Branded, curated gifts show you care. We curate premium selections that recipients actually want, from tech accessories to wellness products. Every gift reinforces your brand and strengthens relationships.
              </p>
              <Button variant="outline" className="border-[#7B61FF]/30 bg-white/90 hover:bg-[#F8F3EC]/80 text-[#7B61FF] text-sm sm:text-base">
                Talk to sales
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Automate Gifts Section */}
      <section className="py-16 sm:py-20 md:py-24 lg:py-28 xl:py-32 gradient-landing">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8 lg:px-10">
          <div className="grid lg:grid-cols-2 gap-8 sm:gap-12 md:gap-16 lg:gap-20 items-center">
            <div className="flex justify-center order-2 lg:order-1">
              <div className="w-full max-w-lg">
                <Image
                  src="/f2.png"
                  alt="Use cases visualization"
                  width={1536}
                  height={1024}
                  className="w-full h-auto rounded-2xl sm:rounded-3xl object-contain"
                  priority
                />
              </div>
            </div>
            <div className="order-1 lg:order-2">
              <div className="text-muted-foreground text-[10px] sm:text-xs font-bold uppercase tracking-widest mb-3 sm:mb-4">
                USE CASES
              </div>
              <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-4 sm:mb-6 leading-tight">
                Gifts for employees, clients, and events
              </h2>
              <p className="text-sm sm:text-base md:text-lg text-muted-foreground mb-6 sm:mb-8 leading-relaxed space-y-2">
                <span className="block"><strong>Employee recognition:</strong> Welcome kits, work anniversaries, performance rewards</span>
                <span className="block"><strong>Client appreciation:</strong> Thank you gifts, deal closings, partnership milestones</span>
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
