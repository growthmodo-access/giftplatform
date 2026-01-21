'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase/client'
import type { RealtimeChannel } from '@supabase/supabase-js'

export function useRealtimeOrders(onUpdate?: () => void) {
  const [channel, setChannel] = useState<RealtimeChannel | null>(null)

  useEffect(() => {
    // Subscribe to order changes
    const orderChannel = supabase
      .channel('orders-changes')
      .on(
        'postgres_changes',
        {
          event: '*', // INSERT, UPDATE, DELETE
          schema: 'public',
          table: 'orders',
        },
        (payload) => {
          console.log('Order change detected:', payload)
          onUpdate?.()
        }
      )
      .subscribe()

    setChannel(orderChannel)

    return () => {
      orderChannel.unsubscribe()
    }
  }, [onUpdate])

  return channel
}
