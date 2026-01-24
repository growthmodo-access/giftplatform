import Image from 'next/image'

export function ServicesSection() {
  return (
    <section id="services" className="py-20 sm:py-24 md:py-28 lg:py-32 xl:py-36 gradient-landing">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8 lg:px-10">
        <div className="text-center mb-12 sm:mb-16 md:mb-20">
          <div className="text-muted-foreground text-xs sm:text-sm font-bold uppercase tracking-widest mb-4 sm:mb-6">
            OUR SERVICES
          </div>
          <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-foreground mb-6 sm:mb-8 leading-tight px-4 sm:px-0">
            Everything you need for corporate gifting
          </h2>
          <p className="text-base sm:text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto px-4 sm:px-0">
            From employee recognition to client appreciation, we've got you covered with flexible, delightful gifting solutions.
          </p>
        </div>

        <div className="w-full max-w-6xl mx-auto">
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-br from-[#7B61FF]/10 to-[#2883EB]/10 rounded-3xl blur-2xl -z-10"></div>
            <Image
              src="/services-grid.png"
              alt="Corporate gifting services - Employees, Clients, Sales Prospecting, Swag, Global Gifting, Holidays"
              width={1536}
              height={1024}
              className="w-full h-auto rounded-3xl sm:rounded-[2rem] object-contain shadow-2xl hover:shadow-3xl transition-shadow duration-300"
              priority
            />
          </div>
        </div>
      </div>
    </section>
  )
}
