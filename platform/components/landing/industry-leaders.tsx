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
    <section className="py-24 lg:py-32 bg-transparent">
      <div className="max-w-7xl mx-auto px-10">
        <div className="grid lg:grid-cols-2 gap-20 items-center">
          <div>
            <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-6 leading-tight">
              Ready to join industry leaders?
            </h2>
            <p className="text-lg text-gray-600 mb-8 leading-relaxed max-w-md">
              Discover how top companies boost their employee, client, and event engagement through Goodies.so.
            </p>
            <Button className="bg-gradient-to-r from-purple-600 to-purple-500 hover:from-purple-700 hover:to-purple-600">
              See case studies
            </Button>
          </div>
          <div className="bg-gradient-to-br from-purple-50 to-purple-100 p-12 rounded-3xl">
            <div className="grid grid-cols-2 gap-6">
              {clients.map((client, index) => (
                <Card
                  key={client.name}
                  className={`p-6 glass hover:shadow-xl transition-all border-2 border-white/30 ${
                    index % 2 === 0 ? 'rotate-[-1deg]' : 'rotate-[1deg]'
                  } hover:rotate-0 hover:scale-105`}
                >
                  <div className="flex items-center justify-center min-h-[60px]">
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
