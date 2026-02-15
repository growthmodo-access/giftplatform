'use client'

import { Gift } from 'lucide-react'

const items = [
  'Employee onboarding kits',
  'Company swag & merchandise',
  'Client and partner gifts',
  'Event & conference kits',
  'Rewards and milestone gifts',
]

export function WhatYouCanSendSection() {
  return (
    <section
      id="what-you-can-send"
      className="landing-section w-full max-w-full overflow-hidden border-t border-border/20 bg-white"
      aria-labelledby="what-you-can-send-heading"
    >
      <div className="landing-container">
        <div className="text-center mb-12 sm:mb-16">
          <p className="landing-label mb-2">What you can send</p>
          <h2 id="what-you-can-send-heading" className="landing-heading text-balance max-w-2xl mx-auto">
            One platform for every gifting moment
          </h2>
          <p className="text-[15px] sm:text-base text-muted-foreground leading-relaxed max-w-xl mx-auto mt-4">
            All customizable. All trackable. All handled for you.
          </p>
        </div>
        <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 max-w-4xl mx-auto w-full" role="list">
          {items.map((item) => (
            <li
              key={item}
              className="flex items-center gap-4 py-4 sm:py-5 px-5 sm:px-6 rounded-xl border border-border/20 bg-white text-left hover:border-primary/20 hover:bg-muted/20 transition-colors"
            >
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
                <Gift className="h-5 w-5" strokeWidth={1.75} aria-hidden />
              </div>
              <span className="font-medium text-foreground text-[15px] sm:text-base leading-snug">{item}</span>
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}
