'use client'

import { useState } from 'react'
import { Label } from '@/components/ui/label'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { Input } from '@/components/ui/input'
import { Calendar } from '@/components/ui/calendar'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { Button } from '@/components/ui/button'
import { CalendarIcon, Clock } from 'lucide-react'
import { format } from 'date-fns'
import { CampaignWizardData } from '../campaign-wizard'
import { cn } from '@/lib/utils'

interface Step5Props {
  data: CampaignWizardData
  onUpdate: (data: Partial<CampaignWizardData>) => void
}

export function CampaignStep5Schedule({ data, onUpdate }: Step5Props) {
  const [time, setTime] = useState('09:00')

  const handleScheduleTypeChange = (value: string) => {
    if (value === 'NOW') {
      onUpdate({ scheduleType: 'NOW', scheduledDate: null })
    } else {
      // Set default to tomorrow at 9 AM
      const tomorrow = new Date()
      tomorrow.setDate(tomorrow.getDate() + 1)
      tomorrow.setHours(9, 0, 0, 0)
      onUpdate({ scheduleType: 'SCHEDULED', scheduledDate: tomorrow })
    }
  }

  const handleDateChange = (date: Date | undefined) => {
    if (date) {
      const [hours, minutes] = time.split(':').map(Number)
      date.setHours(hours, minutes, 0, 0)
      onUpdate({ scheduledDate: date })
    }
  }

  const handleTimeChange = (newTime: string) => {
    setTime(newTime)
    if (data.scheduledDate) {
      const [hours, minutes] = newTime.split(':').map(Number)
      const newDate = new Date(data.scheduledDate)
      newDate.setHours(hours, minutes, 0, 0)
      onUpdate({ scheduledDate: newDate })
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold text-foreground mb-2">Schedule Campaign</h3>
        <p className="text-sm text-muted-foreground">
          Choose when to send the gifts. You can send immediately or schedule for later.
        </p>
      </div>

      <RadioGroup
        value={data.scheduleType}
        onValueChange={handleScheduleTypeChange}
        className="space-y-4"
      >
        <div className="flex items-center space-x-2 p-4 border border-border/50 rounded-lg hover:bg-muted/50 cursor-pointer">
          <RadioGroupItem value="NOW" id="now" />
          <Label htmlFor="now" className="cursor-pointer flex-1">
            <div className="font-medium text-foreground">Send Immediately</div>
            <div className="text-sm text-muted-foreground">Gifts will be sent as soon as the campaign is created</div>
          </Label>
        </div>
        <div className="flex items-center space-x-2 p-4 border border-border/50 rounded-lg hover:bg-muted/50 cursor-pointer">
          <RadioGroupItem value="SCHEDULED" id="scheduled" />
          <Label htmlFor="scheduled" className="cursor-pointer flex-1">
            <div className="font-medium text-foreground">Schedule for Later</div>
            <div className="text-sm text-muted-foreground">Choose a specific date and time to send the gifts</div>
          </Label>
        </div>
      </RadioGroup>

      {data.scheduleType === 'SCHEDULED' && (
        <div className="space-y-4 p-4 border border-border/50 rounded-lg">
          <div className="space-y-2">
            <Label className="text-foreground">Select Date</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn(
                    "w-full justify-start text-left font-normal border-border/50",
                    !data.scheduledDate && "text-muted-foreground"
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {data.scheduledDate ? (
                    format(data.scheduledDate, "PPP")
                  ) : (
                    <span>Pick a date</span>
                  )}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0 border-border/50" align="start">
                <Calendar
                  mode="single"
                  selected={data.scheduledDate || undefined}
                  onSelect={handleDateChange}
                  disabled={(date) => date < new Date()}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
          </div>

          <div className="space-y-2">
            <Label htmlFor="time" className="text-foreground">Select Time</Label>
            <div className="relative">
              <Clock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                id="time"
                type="time"
                value={time}
                onChange={(e) => handleTimeChange(e.target.value)}
                className="pl-9 border-border/50"
              />
            </div>
          </div>

          {data.scheduledDate && (
            <div className="p-3 bg-muted/50 rounded-lg">
              <p className="text-sm text-foreground">
                Campaign will be sent on{' '}
                <span className="font-medium">
                  {format(data.scheduledDate, "PPP 'at' p")}
                </span>
              </p>
            </div>
          )}
        </div>
      )}

      <div className="space-y-2">
        <Label htmlFor="custom_message" className="text-foreground">Custom Message (Optional)</Label>
        <textarea
          id="custom_message"
          value={data.customMessage}
          onChange={(e) => onUpdate({ customMessage: e.target.value })}
          placeholder="Add a personal message that will be included with each gift..."
          className="w-full min-h-[100px] p-3 border border-border/50 rounded-md bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
        />
        <p className="text-xs text-muted-foreground">
          This message will be included when recipients receive their gift notification
        </p>
      </div>
    </div>
  )
}
