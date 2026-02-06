'use client'

import { useEffect, useRef, useState } from 'react'
import { supabase } from '@/lib/supabase/client'
import type { RealtimeChannel } from '@supabase/supabase-js'

export function useRealtimeOrders(onUpdate?: () => void) {
  const [channel, setChannel] = useState<RealtimeChannel | null>(null)
  const onUpdateRef = useRef(onUpdate)
  onUpdateRef.current = onUpdate

  useEffect(() => {
    const orderChannel = supabase
      .channel('orders-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'orders',
        },
        (payload) => {
          console.log('Order change detected:', payload)
          onUpdateRef.current?.()
        }
      )
      .subscribe()

    setChannel(orderChannel)

    return () => {
      orderChannel.unsubscribe()
    }
  }, [])

  return channel
}
