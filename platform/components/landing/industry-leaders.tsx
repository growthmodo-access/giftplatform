'use client'

import { Button } from '@/components/ui/button'
import Image from 'next/image'
import { AlertCircle } from 'lucide-react'

const pains = [
  'Excel sheets with outdated addresses',
  'Endless vendor coordination',
  'Late deliveries and zero tracking',
  'Manual approvals stuck in email threads',
  'Different vendors for different countries',
  'No visibility on inventory or spend',
]

export function IndustryLeaders() {
  return (
    <section id="problem" className="py-16 sm:py-20 md:py-24 lg:py-28 bg-white w-full max-w-full overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full max-w-full box-border min-w-0">
        <div className="grid lg:grid-cols-2 gap-8 sm:gap-12 lg:gap-20 items-center min-w-0">
          <div className="order-2 lg:order-1 space-y-6 sm:space-y-8 text-center lg:text-left flex flex-col items-center lg:items-start w-full">
            <div className="inline-flex items-center gap-2 text-primary text-xs font-semibold uppercase tracking-widest">
              <AlertCircle className="h-4 w-4" strokeWidth={2} />
              The problem
            </div>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-foreground tracking-tight leading-tight max-w-xl mx-auto lg:mx-0">
              Gifting breaks the moment your company grows
            </h2>
            <p className="text-base text-muted-foreground leading-relaxed max-w-xl mx-auto lg:mx-0">
              Corporate gifting should be simple. Instead, it becomes messy fast.
            </p>
            <ul className="text-sm sm:text-base text-muted-foreground space-y-3 max-w-xl mx-auto lg:mx-0">
              {pains.map((item) => (
                <li key={item} className="flex items-start gap-3">
                  <span className="mt-1.5 h-1.5 w-1.5 rounded-full bg-primary shrink-0" aria-hidden />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
            <p className="text-sm text-muted-foreground max-w-xl mx-auto lg:mx-0">
              What starts as a &ldquo;small task&rdquo; turns into weeks of follow-ups.
            </p>
            <Button
              onClick={() => document.getElementById('solutions')?.scrollIntoView({ behavior: 'smooth' })}
              className="rounded-xl bg-primary text-primary-foreground hover:bg-primary/90 px-6 py-5 text-base font-semibold shadow-lg shadow-primary/20 w-full sm:max-w-[280px] lg:max-w-none lg:w-auto"
            >
              See the better way
            </Button>
          </div>
          <div className="order-1 lg:order-2 w-full min-w-0">
            <div className="relative w-full max-w-xl mx-auto rounded-2xl overflow-hidden border border-border/50 shadow-xl shadow-black/5 bg-muted/20 ring-1 ring-black/5">
              <Image
                src="/g4.png"
                alt="Corporate gifting challenges - spreadsheets and coordination"
                width={1536}
                height={1024}
                className="w-full h-auto object-contain"
                priority
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
