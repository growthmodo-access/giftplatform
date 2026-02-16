'use client'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Wallet, Plus } from 'lucide-react'

interface Wallet {
  balance: number
  currency: string
}

interface WalletSectionProps {
  wallet: Wallet | null
  onAddFunds: () => void
}

export function WalletSection({ wallet, onAddFunds }: WalletSectionProps) {
  const balance = wallet?.balance || 0
  const currency = wallet?.currency || 'INR'

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Wallet className="w-5 h-5" />
            Wallet Balance
          </CardTitle>
          <CardDescription>Your current wallet balance</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="text-4xl font-bold text-foreground">
              {currency} {balance.toFixed(2)}
            </div>
            <Button onClick={onAddFunds} className="w-full sm:w-auto">
              <Plus className="w-4 h-4 mr-2" />
              Add Funds
            </Button>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Payment Methods</CardTitle>
          <CardDescription>Add funds using your preferred payment method</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-2 text-sm text-muted-foreground">
            <p>• Stripe (Credit/Debit Cards)</p>
            <p>• Razorpay (UPI, Cards, Net Banking)</p>
            <p>• Bank Transfer</p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
