'use client'

import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Button } from '@/components/ui/button'
import { Plus, Wallet, FileText, Download, CreditCard } from 'lucide-react'
import { InvoicesList } from './invoices-list'
import { WalletSection } from './wallet-section'
import { AddFundsDialog } from './add-funds-dialog'

interface Invoice {
  id: string
  invoiceNumber: string
  orderId: string | null
  companyName: string
  amount: string
  status: string
  dueDate: string
  createdAt: string
}

interface Wallet {
  balance: number
  currency: string
}

interface BillingPageClientProps {
  invoices: Invoice[]
  wallet: Wallet | null
  currentUserRole: 'SUPER_ADMIN' | 'ADMIN' | 'HR' | 'MANAGER' | 'EMPLOYEE'
}

export function BillingPageClient({ invoices, wallet, currentUserRole }: BillingPageClientProps) {
  const [addFundsOpen, setAddFundsOpen] = useState(false)

  const isSuperAdmin = currentUserRole === 'SUPER_ADMIN'

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-foreground">Billing & Invoices</h1>
          <p className="text-muted-foreground mt-1">
            {isSuperAdmin
              ? 'All invoices across companies and wallet'
              : 'Manage your invoices and wallet'}
          </p>
        </div>
      </div>

      <Tabs defaultValue="invoices" className="space-y-6">
        <TabsList>
          <TabsTrigger value="invoices">
            <FileText className="w-4 h-4 mr-2" />
            Invoices
          </TabsTrigger>
          <TabsTrigger value="wallet">
            <Wallet className="w-4 h-4 mr-2" />
            Wallet
          </TabsTrigger>
        </TabsList>

        <TabsContent value="invoices" className="space-y-6">
          <InvoicesList invoices={invoices} showCompany={isSuperAdmin} />
        </TabsContent>

        <TabsContent value="wallet" className="space-y-6">
          <WalletSection wallet={wallet} onAddFunds={() => setAddFundsOpen(true)} />
        </TabsContent>
      </Tabs>

      <AddFundsDialog open={addFundsOpen} onClose={() => setAddFundsOpen(false)} />
    </div>
  )
}
