const steps = [
  { number: '1', title: 'Choose your gifts', description: 'Browse curated selections or work with us to customize' },
  { number: '2', title: 'We handle fulfillment', description: 'Inventory, branding, packaging, and shipping' },
  { number: '3', title: 'Recipients receive gifts', description: 'Delivered worldwide with tracking and support' },
]

export function IntegrationsSection() {
  return (
    <section className="py-12 sm:py-16 md:py-20 lg:py-24 xl:py-32 bg-transparent">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8 lg:px-10">
        <div className="text-center mb-8 sm:mb-10 md:mb-12">
          <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-semibold text-foreground mb-3 sm:mb-4 leading-tight px-4 sm:px-0">
            How it works
          </h2>
          <p className="text-sm sm:text-base md:text-lg text-muted-foreground px-4 sm:px-0">
            Simple, human-managed process. No complex automation required.
          </p>
        </div>

        <div className="grid sm:grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6 md:gap-8 max-w-5xl mx-auto">
          {steps.map((step, index) => (
            <div
              key={index}
              className="bg-background backdrop-blur-xl p-6 sm:p-7 md:p-8 rounded-xl border border-border/50 hover:shadow-sm transition-all text-center"
            >
              <div className="text-4xl sm:text-5xl font-bold text-[#7B61FF] mb-3 sm:mb-4">{step.number}</div>
              <h3 className="text-lg sm:text-xl font-semibold text-foreground mb-2">{step.title}</h3>
              <p className="text-sm sm:text-base text-muted-foreground">{step.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
