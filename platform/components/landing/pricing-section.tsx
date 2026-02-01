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
    <section id="pricing" className="py-20 sm:py-24 md:py-28 lg:py-32 gradient-landing">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8 lg:px-10">
        <div className="text-center mb-12 sm:mb-16">
          <p className="text-muted-foreground text-xs sm:text-sm font-bold uppercase tracking-widest mb-4">
            PRICING
          </p>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-foreground mb-4">
            Plans that scale with you
          </h2>
          <p className="text-muted-foreground text-base sm:text-lg max-w-2xl mx-auto">
            Transparent pricing. No hidden fees. Talk to our team for a quote tailored to your volume and needs.
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-6 lg:gap-8">
          {plans.map((plan) => (
            <div
              key={plan.name}
              className={`rounded-2xl border-2 p-6 sm:p-8 flex flex-col ${
                plan.highlighted
                  ? 'border-[#7B61FF] bg-white/80 shadow-primary-lg scale-[1.02] md:scale-105'
                  : 'border-[#F8F3EC]/50 bg-white/60'
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
                className={plan.highlighted ? 'gradient-button text-white w-full' : 'w-full border-2'}
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
