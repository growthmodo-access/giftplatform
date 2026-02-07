'use client'

import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Check } from 'lucide-react'

const plans = [
  {
    name: 'Starter',
    description: 'For teams sending up to a few hundred gifts a year',
    price: 'Custom',
    features: ['Up to 100 gifts/month', '80+ countries', 'Premium catalog', 'Email support'],
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
    <section id="pricing" className="py-20 sm:py-24 md:py-28 lg:py-32 bg-white w-full max-w-full overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-5 lg:px-8 w-full max-w-full box-border min-w-0">
        <div className="text-center mb-12 sm:mb-16 w-full px-2 sm:px-0">
          <p className="text-muted-foreground text-xs font-medium uppercase tracking-wider mb-4">
            PRICING
          </p>
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-foreground tracking-tight mb-4 max-w-2xl mx-auto">
            Plans that fit your volume. No hidden fees.
          </h2>
          <p className="text-muted-foreground text-sm sm:text-base max-w-2xl mx-auto">
            We quote based on your team size and gifting volume. Talk to us for a clear proposal and a short setup.
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6 lg:gap-8 w-full">
          {plans.map((plan) => (
            <div
              key={plan.name}
              className={`rounded-xl border p-6 sm:p-8 flex flex-col shadow-sm hover:shadow-md transition-shadow ${
                plan.highlighted
                  ? 'border-primary/30 bg-primary/5 border-primary/40'
                  : 'border-border/40 bg-white'
              }`}
            >
              <h3 className="text-xl font-semibold text-foreground mb-1">{plan.name}</h3>
              <p className="text-sm text-muted-foreground mb-4">{plan.description}</p>
              <p className="text-2xl font-bold text-foreground mb-6">{plan.price}</p>
              <ul className="space-y-3 mb-8 flex-1">
                {plan.features.map((f) => (
                  <li key={f} className="flex items-center gap-2 text-sm text-foreground">
                    <Check className="w-4 h-4 text-[#28BF5D] flex-shrink-0" />
                    {f}
                  </li>
                ))}
              </ul>
              <Button
                onClick={handleTalkToSales}
                className={plan.highlighted ? 'rounded-xl bg-primary text-primary-foreground hover:bg-primary/90 w-full shadow-sm' : 'rounded-xl w-full border border-border/40 hover:bg-muted/30'}
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
