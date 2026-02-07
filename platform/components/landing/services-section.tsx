import Image from 'next/image'

export function ServicesSection() {
  return (
    <section id="services" className="py-12 sm:py-24 md:py-28 lg:py-32 xl:py-36 bg-muted/30 w-full max-w-full overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-5 lg:px-8 w-full max-w-full box-border min-w-0">
        <div className="text-center mb-10 sm:mb-16 md:mb-20 w-full">
          <div className="text-muted-foreground text-xs font-medium uppercase tracking-wider mb-4 sm:mb-6">
            OUR SERVICES
          </div>
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-foreground tracking-tight mb-6 sm:mb-8 leading-tight px-2 sm:px-0 max-w-4xl mx-auto">
            Everything you need for corporate gifting
          </h2>
          <p className="text-sm sm:text-base md:text-lg text-muted-foreground max-w-3xl mx-auto px-2 sm:px-0">
            From employee recognition to client appreciation, we've got you covered with flexible, delightful gifting solutions.
          </p>
        </div>

        <div className="w-full max-w-6xl mx-auto px-0 sm:px-2">
          <div className="relative rounded-xl overflow-hidden border border-border/40 shadow-sm bg-white">
            <Image
              src="/services-grid.png"
              alt="Corporate gifting services - Employees, Clients, Sales Prospecting, Swag, Global Gifting, Holidays"
              width={1536}
              height={1024}
              className="w-full h-auto object-contain transition-shadow duration-300"
              priority
            />
          </div>
        </div>
      </div>
    </section>
  )
}
