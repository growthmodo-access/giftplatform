'use client'

const useCases = [
  {
    emoji: '🎉',
    title: 'Employee onboarding',
    copy: 'Deliver branded kits before day one—no coordination required.',
  },
  {
    emoji: '🏆',
    title: 'Rewards & milestones',
    copy: 'Automate birthdays, anniversaries, and achievements.',
  },
  {
    emoji: '🤝',
    title: 'Client & partner gifting',
    copy: 'Strengthen relationships with premium, timely gifts.',
  },
  {
    emoji: '🎪',
    title: 'Events & conferences',
    copy: 'Ship kits to attendees before or after events—globally.',
  },
]

export function UseCasesSection() {
  return (
    <section
      id="use-cases"
      className="landing-section w-full max-w-full overflow-hidden border-t border-border/20 bg-muted/10"
      aria-labelledby="use-cases-heading"
    >
      <div className="landing-container">
        <div className="text-center mb-10 sm:mb-12">
          <p className="landing-label mb-2">Use cases</p>
          <h2 id="use-cases-heading" className="landing-heading text-balance max-w-2xl mx-auto">
            Built for how teams actually gift
          </h2>
          <p className="text-[15px] sm:text-base text-muted-foreground leading-relaxed max-w-xl mx-auto mt-4">
            From welcome packs to global events—one workflow.
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8 max-w-4xl mx-auto w-full">
          {useCases.map((uc) => (
            <div
              key={uc.title}
              className="rounded-xl border border-border/20 bg-white p-6 sm:p-8 text-left shadow-sm hover:shadow-md hover:border-primary/10 transition-all"
            >
              <p className="text-2xl sm:text-3xl mb-3" aria-hidden>
                {uc.emoji}
              </p>
              <h3 className="text-lg sm:text-xl font-semibold text-foreground tracking-tight mb-2">
                {uc.title}
              </h3>
              <p className="text-[15px] sm:text-base text-muted-foreground leading-relaxed">
                {uc.copy}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
