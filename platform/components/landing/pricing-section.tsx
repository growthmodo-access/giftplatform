'use client'

import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Check } from 'lucide-react'

const plans = [
  {
    name: 'Starter',
    description: 'For small teams getting started',
    price: 'Custom',
    features: ['Up to 100 gifts/month', '80+ countries', 'Premium catalog', 'Email support'],
    cta: 'Talk to sales',
    highlighted: false,
  },
  {
    name: 'Growth',
    description: 'For scaling teams and campaigns',
    price: 'Custom',
    features: ['Unlimited gifts', 'Dedicated account manager', 'Custom branding', 'API access', 'Priority support'],
    cta: 'Talk to sales',
    highlighted: true,
  },
  {
    name: 'Enterprise',
    description: 'For global organizations',
    price: 'Custom',
    features: ['Everything in Growth', 'SLA & compliance', 'On-prem options', 'Custom integrations'],
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
    <section id="pricing" className="py-20 sm:py-24 md:py-28 lg:py-32 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8 lg:px-10 w-full">
        <div className="text-center mb-12 sm:mb-16 w-full px-2 sm:px-0">
          <p className="text-muted-foreground text-xs sm:text-sm font-bold uppercase tracking-widest mb-4">
            PRICING
          </p>
          <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-4 max-w-2xl mx-auto">
            Plans that scale with you
          </h2>
          <p className="text-muted-foreground text-sm sm:text-base max-w-2xl mx-auto">
            Transparent pricing. No hidden fees. Talk to our team for a quote tailored to your volume and needs.
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6 lg:gap-8 w-full">
          {plans.map((plan) => (
            <div
              key={plan.name}
              className={`rounded-xl border border-border/60 p-6 sm:p-8 flex flex-col shadow-sm hover:shadow-md transition-shadow ${
                plan.highlighted
                  ? 'border-primary/40 bg-primary/5 ring-2 ring-primary/20 scale-[1.02] md:scale-[1.02]'
                  : 'bg-white'
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
                className={plan.highlighted ? 'rounded-xl bg-primary text-primary-foreground hover:bg-primary/90 w-full' : 'rounded-xl w-full border-2 border-border'}
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
