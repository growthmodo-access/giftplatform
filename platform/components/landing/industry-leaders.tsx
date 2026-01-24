import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { ReactNode } from 'react'

const clients: Array<{
  name: string
  logo: ReactNode
}> = [
  {
    name: 'Microsoft',
    logo: (
      <div className="flex items-center gap-3">
        <div className="grid grid-cols-2 gap-0.5 w-10 h-10">
          <div className="w-5 h-5 bg-[#F25022]" />
          <div className="w-5 h-5 bg-[#7FBA00]" />
          <div className="w-5 h-5 bg-[#00A4EF]" />
          <div className="w-5 h-5 bg-[#FFB900]" />
        </div>
        <span className="text-gray-600 font-medium">Microsoft</span>
      </div>
    ),
  },
  {
    name: 'cornerstone',
    logo: (
      <div className="flex items-center gap-2.5">
        <span className="text-3xl text-orange-500">⭐</span>
        <span className="text-gray-600 font-medium">cornerstone</span>
      </div>
    ),
  },
  {
    name: 'mapbox',
    logo: (
      <div className="flex items-center gap-2.5">
        <div className="w-9 h-9 bg-gray-900 rounded-full flex items-center justify-center">
          <span className="text-white text-xl">📍</span>
        </div>
        <span className="text-gray-900 font-semibold lowercase">mapbox</span>
      </div>
    ),
  },
  {
    name: 'ChowNow',
    logo: (
      <div className="flex items-center gap-2.5">
        <div className="w-9 h-9 bg-[#E31837] rounded-full flex items-center justify-center">
          <span className="text-white text-xl">🍴</span>
        </div>
        <span className="text-[#1E3A8A] font-semibold">ChowNow</span>
      </div>
    ),
  },
  {
    name: 'inhabit',
    logo: (
      <div className="flex items-center gap-2.5">
        <div className="w-9 h-9 bg-[#FF6B35] rounded-lg flex items-center justify-center italic font-bold text-white text-2xl">
          i
        </div>
        <span className="text-[#FF6B35] font-semibold lowercase">inhabit</span>
      </div>
    ),
  },
  {
    name: 'LUMEN',
    logo: (
      <div className="flex items-center gap-1">
        <span className="text-gray-900 font-bold text-xl tracking-wider relative">
          LUMEN
          <span className="absolute bottom-1 left-0 right-0 h-0.5 bg-blue-600 w-3/5" />
        </span>
        <span className="text-gray-500 text-xs align-super">®</span>
      </div>
    ),
  },
]

export function IndustryLeaders() {
  return (
    <section className="py-16 sm:py-20 md:py-24 lg:py-28 xl:py-32 gradient-landing">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8 lg:px-10">
        <div className="grid lg:grid-cols-2 gap-8 sm:gap-12 md:gap-16 lg:gap-20 items-center">
          <div className="order-2 lg:order-1">
            <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-4 sm:mb-6 leading-tight">
              From India to the world
            </h2>
            <p className="text-sm sm:text-base md:text-lg text-muted-foreground mb-6 sm:mb-8 leading-relaxed max-w-md">
              Built in India, shipping worldwide. We understand local preferences and global scale. Whether you're a startup expanding internationally or an enterprise managing distributed teams, we have you covered.
            </p>
            <Button className="text-sm sm:text-base">
              Talk to sales
            </Button>
          </div>
          <div className="bg-muted/30 p-6 sm:p-8 md:p-10 lg:p-12 rounded-2xl sm:rounded-3xl border border-border/50 order-1 lg:order-2">
            <div className="grid grid-cols-2 gap-3 sm:gap-4 md:gap-6">
              {clients.map((client, index) => (
                <Card
                  key={client.name}
                  className={`p-3 sm:p-4 md:p-6 glass hover:shadow-xl transition-all border-2 border-white/30 ${
                    index % 2 === 0 ? 'rotate-[-1deg]' : 'rotate-[1deg]'
                  } hover:rotate-0 hover:scale-105`}
                >
                  <div className="flex items-center justify-center min-h-[40px] sm:min-h-[50px] md:min-h-[60px]">
                    {client.logo}
                  </div>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
