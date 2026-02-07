const steps = [
  { number: '1', title: 'Choose your gifts', description: 'Browse curated selections or work with us to customize' },
  { number: '2', title: 'We handle fulfillment', description: 'Inventory, branding, packaging, and shipping' },
  { number: '3', title: 'Recipients receive gifts', description: 'Delivered worldwide with tracking and support' },
]

export function IntegrationsSection() {
  return (
    <section id="solutions" className="py-12 sm:py-24 md:py-28 lg:py-32 xl:py-36 bg-white w-full max-w-full overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-5 lg:px-8 w-full max-w-full box-border min-w-0">
        <div className="text-center mb-10 sm:mb-16 md:mb-20 w-full px-2 sm:px-0">
          <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-bold text-foreground mb-6 sm:mb-8 leading-tight max-w-3xl mx-auto">
            How it works
          </h2>
          <p className="text-sm sm:text-base md:text-lg text-muted-foreground max-w-2xl mx-auto">
            Simple, human managed process. No complex automation required.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6 md:gap-8 max-w-6xl mx-auto w-full">
          {steps.map((step, index) => (
            <div
              key={index}
              className="bg-white p-6 sm:p-8 rounded-xl border border-border/40 shadow-sm hover:shadow-md transition-all duration-200 text-center"
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
