import Image from 'next/image'

export function ServicesSection() {
  return (
    <section id="services" className="py-16 sm:py-20 md:py-24 lg:py-28 bg-muted/30 w-full max-w-full overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full max-w-full box-border min-w-0">
        <div className="text-center mb-12 sm:mb-16 md:mb-20 max-w-3xl mx-auto">
          <p className="text-primary text-xs font-semibold uppercase tracking-widest mb-4">
            Solution
          </p>
          <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-[2.5rem] font-bold text-foreground tracking-tight mb-6 leading-tight">
            One platform that handles everything for you
          </h2>
          <p className="text-base text-muted-foreground mb-4 leading-relaxed">
            We built a system specifically for teams that need to send gifts at scale—without adding operational burden.
          </p>
          <p className="text-lg font-semibold text-foreground mb-2">
            You decide what to send. We handle everything else.
          </p>
          <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">
            From storage and customization to shipping and tracking—globally.
          </p>
        </div>

        <div className="w-full max-w-6xl mx-auto">
          <div className="relative rounded-2xl overflow-hidden border border-border/50 shadow-xl shadow-black/5 bg-white ring-1 ring-black/5">
            <Image
              src="/services-grid.png"
              alt="Corporate gifting services - Employees, Clients, Swag, Global Gifting"
              width={1536}
              height={1024}
              className="w-full h-auto object-contain"
              priority
            />
          </div>
        </div>
      </div>
    </section>
  )
}
