'use client'

import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Check } from 'lucide-react'

const plans = [
  {
    name: 'Starter',
    description: 'For teams sending up to a few hundred gifts a year',
    price: 'Custom',
    features: ['Up to 100 gifts/month', '100+ countries', 'Premium catalog', 'Email support'],
    cta: 'Talk to sales',
    highlighted: false,
  },
  {
    name: 'Growth',
    description: 'For scaling recognition and client gifting',
    price: 'Custom',
    features: ['Unlimited gifts', 'Dedicated account manager', 'Custom branding', 'API access', 'Priority support'],
    cta: 'Talk to sales',
    highlighted: true,
  },
  {
    name: 'Enterprise',
    description: 'For global orgs with compliance and integration needs',
    price: 'Custom',
    features: ['Everything in Growth', 'SLA & compliance', 'Custom integrations'],
    cta: 'Talk to sales',
    highlighted: false,
  },
]

export function PricingSection() {
  const router = useRouter()

  const handleTalkToSales = () => {
    router.push('/contact')
  }

  return (
    <section id="pricing" className="py-16 sm:py-20 md:py-24 lg:py-28 bg-muted/30 w-full max-w-full overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full max-w-full box-border min-w-0">
        <div className="text-center mb-12 sm:mb-16 max-w-2xl mx-auto">
          <p className="text-primary text-xs font-semibold uppercase tracking-widest mb-4">
            Pricing
          </p>
          <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-[2.5rem] font-bold text-foreground tracking-tight mb-4 leading-tight">
            Flexible plans that grow with your team
          </h2>
          <p className="text-base text-muted-foreground mb-6">
            Whether you&apos;re sending gifts occasionally or running gifting year-round, our plans adapt to your needs.
          </p>
          <ul className="text-sm text-muted-foreground space-y-2 max-w-md mx-auto text-left flex flex-wrap justify-center gap-x-6 gap-y-1">
            <li className="flex items-center gap-2">
              <Check className="h-4 w-4 text-primary shrink-0" /> No vendor lock-ins
            </li>
            <li className="flex items-center gap-2">
              <Check className="h-4 w-4 text-primary shrink-0" /> No operational overhead
            </li>
            <li className="flex items-center gap-2">
              <Check className="h-4 w-4 text-primary shrink-0" /> Pay only for what you use
            </li>
          </ul>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8 w-full max-w-5xl mx-auto">
          {plans.map((plan) => (
            <div
              key={plan.name}
              className={`rounded-2xl border p-6 sm:p-8 flex flex-col transition-all duration-200 ${
                plan.highlighted
                  ? 'border-primary/40 bg-white shadow-xl shadow-primary/10 ring-2 ring-primary/20 md:scale-[1.02] lg:scale-105'
                  : 'border-border/50 bg-white shadow-lg shadow-black/5 hover:shadow-xl hover:border-primary/20'
              }`}
            >
              <h3 className="text-xl font-bold text-foreground mb-2">{plan.name}</h3>
              <p className="text-sm text-muted-foreground mb-4">{plan.description}</p>
              <p className="text-2xl font-bold text-foreground mb-6">{plan.price}</p>
              <ul className="space-y-3 mb-8 flex-1">
                {plan.features.map((f) => (
                  <li key={f} className="flex items-center gap-3 text-sm text-foreground">
                    <Check className="h-5 w-5 text-primary flex-shrink-0" strokeWidth={2} />
                    {f}
                  </li>
                ))}
              </ul>
              <Button
                onClick={handleTalkToSales}
                className={plan.highlighted
                  ? 'rounded-xl bg-primary text-primary-foreground hover:bg-primary/90 w-full py-6 font-semibold shadow-lg shadow-primary/20'
                  : 'rounded-xl w-full py-6 font-semibold border-2 border-border/60 hover:bg-muted/50 hover:border-primary/30'
                }
                aria-label={`Talk to sales for ${plan.name}`}
              >
                {plan.cta}
              </Button>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
