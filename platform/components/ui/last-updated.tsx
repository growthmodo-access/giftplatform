import { formatDistanceToNow } from 'date-fns'
import { Clock } from 'lucide-react'
import { cn } from '@/lib/utils'

interface LastUpdatedProps {
  timestamp: string | Date
  className?: string
  showIcon?: boolean
}

export function LastUpdated({ timestamp, className, showIcon = true }: LastUpdatedProps) {
  const date = typeof timestamp === 'string' ? new Date(timestamp) : timestamp
  const relativeTime = formatDistanceToNow(date, { addSuffix: true })

  return (
    <div className={cn("flex items-center gap-1.5 text-xs text-muted-foreground", className)}>
      {showIcon && <Clock className="w-3 h-3" />}
      <span>Updated {relativeTime}</span>
    </div>
  )
}
