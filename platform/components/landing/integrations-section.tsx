const steps = [
  { number: '1', title: 'Choose your gifts', description: 'Browse curated selections or work with us to customize' },
  { number: '2', title: 'We handle fulfillment', description: 'Inventory, branding, packaging, and shipping' },
  { number: '3', title: 'Recipients receive gifts', description: 'Delivered worldwide with tracking and support' },
]

export function IntegrationsSection() {
  return (
    <section className="py-24 lg:py-32 bg-transparent">
      <div className="max-w-7xl mx-auto px-10">
        <div className="text-center mb-12">
          <h2 className="text-4xl lg:text-5xl font-semibold text-foreground mb-4">
            How it works
          </h2>
          <p className="text-lg text-muted-foreground">
            Simple, human-managed process. No complex automation required.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          {steps.map((step, index) => (
            <div
              key={index}
              className="bg-background backdrop-blur-xl p-8 rounded-xl border border-border/50 hover:shadow-sm transition-all text-center"
            >
              <div className="text-5xl font-bold text-[#7B61FF] mb-4">{step.number}</div>
              <h3 className="text-xl font-semibold text-foreground mb-2">{step.title}</h3>
              <p className="text-muted-foreground">{step.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
