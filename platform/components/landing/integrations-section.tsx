const steps = [
  { number: '1', title: 'Choose your gifts', description: 'Browse curated selections or work with us to customize' },
  { number: '2', title: 'We handle fulfillment', description: 'Inventory, branding, packaging, and shipping' },
  { number: '3', title: 'Recipients receive gifts', description: 'Delivered worldwide with tracking and support' },
]

export function IntegrationsSection() {
  return (
    <section id="solutions" className="py-20 sm:py-24 md:py-28 lg:py-32 xl:py-36 gradient-landing">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8 lg:px-10">
        <div className="text-center mb-12 sm:mb-16 md:mb-20">
          <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-foreground mb-6 sm:mb-8 leading-tight px-4 sm:px-0">
            How it works
          </h2>
          <p className="text-base sm:text-lg md:text-xl text-muted-foreground px-4 sm:px-0 max-w-2xl mx-auto">
            Simple, human managed process. No complex automation required.
          </p>
        </div>

        <div className="grid sm:grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8 md:gap-10 max-w-6xl mx-auto">
          {steps.map((step, index) => (
            <div
              key={index}
              className="bg-white/80 backdrop-blur-xl p-8 sm:p-10 md:p-12 rounded-3xl border-2 border-[#F8F3EC]/50 hover:shadow-2xl hover:scale-105 transition-all duration-300 text-center"
            >
              <div className="text-5xl sm:text-6xl md:text-7xl font-bold text-[#7B61FF] mb-4 sm:mb-6">{step.number}</div>
              <h3 className="text-xl sm:text-2xl font-bold text-foreground mb-3 sm:mb-4">{step.title}</h3>
              <p className="text-base sm:text-lg text-muted-foreground leading-relaxed">{step.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
