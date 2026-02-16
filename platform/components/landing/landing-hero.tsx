'use client'

import { useRouter } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import { Button } from '@/components/ui/button'
import { Globe, Layers, CheckCircle, ArrowRight } from 'lucide-react'

export function LandingHero() {
  const router = useRouter()

  const handleTalkToSales = () => router.push('/contact')

  return (
    <section id="home" className="relative overflow-hidden w-full max-w-full bg-white">
      <div className="landing-container relative">
        <div className="flex flex-col items-center justify-center pt-10 sm:pt-14 md:pt-16 lg:pt-20 pb-8 sm:pb-10">
          <div className="flex flex-col items-center text-center max-w-4xl mx-auto w-full px-3 sm:px-4">
            <h1 className="landing-heading-hero font-extrabold mb-4 sm:mb-5 w-full px-1">
              Corporate gifting, without the chaos
            </h1>

            <p className="text-lg sm:text-xl md:text-2xl text-muted-foreground mb-8 sm:mb-10 max-w-2xl w-full px-2 leading-[1.4] font-medium">
              Send gifts to employees, clients, and partners—globally, in minutes.
            </p>

            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 w-full max-w-sm sm:max-w-none mx-auto px-2 sm:px-0 justify-center items-stretch sm:items-center mb-8 sm:mb-10">
              <Button
                asChild
                variant="outline"
                className="rounded-xl border-primary/40 text-primary hover:bg-primary/5 hover:border-primary/60 hover:text-primary px-6 py-3.5 text-base font-medium w-full sm:w-auto inline-flex items-center justify-center gap-2"
              >
                <Link href="/login">Login</Link>
              </Button>
              <Button
                onClick={handleTalkToSales}
                className="rounded-xl bg-primary text-primary-foreground hover:bg-primary/90 px-6 py-3.5 text-base font-semibold w-full sm:w-auto inline-flex items-center justify-center gap-2 transition-colors focus-visible:ring-2 focus-visible:ring-primary/20 focus-visible:outline-none shadow-lg hover:shadow-xl"
                aria-label="Talk to sales"
              >
                Talk to sales
                <ArrowRight className="h-5 w-5" strokeWidth={2} />
              </Button>
            </div>

            <div className="flex flex-wrap items-center justify-center gap-4 sm:gap-6 md:gap-8 w-full max-w-2xl mx-auto">
              <div className="flex items-center gap-2.5 text-foreground/90">
                <Globe className="h-4 w-4 sm:h-5 sm:w-5 text-primary shrink-0" strokeWidth={1.75} />
                <span className="text-xs sm:text-sm font-medium">Global Gifting</span>
              </div>
              <div className="flex items-center gap-2.5 text-foreground/90">
                <Layers className="h-4 w-4 sm:h-5 sm:w-5 text-primary shrink-0" strokeWidth={1.75} />
                <span className="text-xs sm:text-sm font-medium">One Powerful Platform</span>
              </div>
              <div className="flex items-center gap-2.5 text-foreground/90">
                <CheckCircle className="h-4 w-4 sm:h-5 sm:w-5 text-primary shrink-0" strokeWidth={1.75} />
                <span className="text-xs sm:text-sm font-medium">Reliable & scalable</span>
              </div>
            </div>
          </div>
        </div>

        <div className="pb-12 sm:pb-14 md:pb-16 lg:pb-20 relative w-full">
          <div className="relative w-full max-w-6xl mx-auto overflow-hidden">
            <Image
              src="https://github.com/growthmodo-access/giftplatform/blob/main/platform/public/MAINIMAGE.png?raw=true"
              alt="Global gifting dashboard and delivery"
              width={1536}
              height={1024}
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 90vw, 1152px"
              className="w-full h-auto object-contain"
              priority
            />
          </div>
        </div>
      </div>
    </section>
  )
}
