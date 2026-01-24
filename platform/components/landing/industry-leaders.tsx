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
    <section className="py-20 sm:py-24 md:py-28 lg:py-32 xl:py-36 gradient-landing">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8 lg:px-10">
        <div className="grid lg:grid-cols-2 gap-12 sm:gap-16 md:gap-20 lg:gap-24 items-center">
          <div className="order-2 lg:order-1 space-y-6 sm:space-y-8">
            <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-foreground mb-6 sm:mb-8 leading-tight">
              From India to the world
            </h2>
            <p className="text-base sm:text-lg md:text-xl text-muted-foreground mb-8 sm:mb-10 leading-relaxed max-w-lg">
              Built in India, shipping worldwide. We understand local preferences and global scale. Whether you're a startup expanding internationally or an enterprise managing distributed teams, we have you covered.
            </p>
            <Button className="px-8 py-6 text-base sm:text-lg font-semibold gradient-button text-white shadow-primary-lg hover:shadow-primary-xl hover:scale-105 transition-all duration-200">
              Talk to sales
            </Button>
          </div>
          <div className="bg-white/60 backdrop-blur-sm p-8 sm:p-10 md:p-12 lg:p-14 rounded-3xl sm:rounded-[2rem] border-2 border-[#F8F3EC]/50 shadow-2xl hover:shadow-3xl transition-shadow duration-300 order-1 lg:order-2">
            <div className="grid grid-cols-2 gap-4 sm:gap-5 md:gap-6">
              {clients.map((client, index) => (
                <Card
                  key={client.name}
                  className={`p-4 sm:p-5 md:p-7 glass hover:shadow-2xl transition-all duration-300 border-2 border-white/50 ${
                    index % 2 === 0 ? 'rotate-[-1deg]' : 'rotate-[1deg]'
                  } hover:rotate-0 hover:scale-110`}
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
