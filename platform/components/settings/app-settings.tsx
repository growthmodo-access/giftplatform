'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Switch } from '@/components/ui/switch'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Settings, Globe, Shield, Bell, Mail } from 'lucide-react'
import { useRouter } from 'next/navigation'

import type { AppRole } from '@/lib/roles'

interface AppSettingsProps {
  currentUserRole: AppRole
}

export function AppSettings({ currentUserRole }: AppSettingsProps) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)

  // Settings state
  const [emailNotifications, setEmailNotifications] = useState(true)
  const [campaignAutoSend, setCampaignAutoSend] = useState(false)
  const [requireApproval, setRequireApproval] = useState(true)
  const [defaultCurrency, setDefaultCurrency] = useState('INR')
  const [maxBudget, setMaxBudget] = useState('100000')

  const isSuperAdmin = currentUserRole === 'SUPER_ADMIN'

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    setSuccess(false)

    try {
      // In real app, save to database
      await new Promise(resolve => setTimeout(resolve, 1000))
      setSuccess(true)
      setTimeout(() => setSuccess(false), 3000)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred')
    } finally {
      setLoading(false)
    }
  }

  if (!isSuperAdmin) {
    return null
  }

  return (
    <Card className="border border-border/50">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Settings className="w-5 h-5" />
          App-Wide Settings
        </CardTitle>
        <CardDescription>
          Configure global application settings (Super Admin only)
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          {error && (
            <div className="p-3 text-sm text-destructive bg-destructive/10 border border-destructive/20 rounded-md">
              {error}
            </div>
          )}
          {success && (
            <div className="p-3 text-sm text-foreground bg-muted border border-border/50 rounded-md">
              Settings saved successfully
            </div>
          )}

          {/* Notification Settings */}
          <div className="space-y-4">
            <h3 className="text-sm font-semibold text-foreground flex items-center gap-2">
              <Bell className="w-4 h-4" />
              Notifications
            </h3>
            <div className="space-y-3 pl-6">
              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="email-notifications" className="text-foreground">Email Notifications</Label>
                  <p className="text-xs text-muted-foreground">Send email notifications for important events</p>
                </div>
                <Switch
                  id="email-notifications"
                  checked={emailNotifications}
                  onCheckedChange={setEmailNotifications}
                />
              </div>
            </div>
          </div>

          {/* Campaign Settings */}
          <div className="space-y-4 border-t border-border/50 pt-4">
            <h3 className="text-sm font-semibold text-foreground flex items-center gap-2">
              <Mail className="w-4 h-4" />
              Campaign Settings
            </h3>
            <div className="space-y-3 pl-6">
              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="auto-send" className="text-foreground">Auto-Send Campaigns</Label>
                  <p className="text-xs text-muted-foreground">Automatically send campaigns when triggered</p>
                </div>
                <Switch
                  id="auto-send"
                  checked={campaignAutoSend}
                  onCheckedChange={setCampaignAutoSend}
                />
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="require-approval" className="text-foreground">Require Approval</Label>
                  <p className="text-xs text-muted-foreground">Require admin approval before sending campaigns</p>
                </div>
                <Switch
                  id="require-approval"
                  checked={requireApproval}
                  onCheckedChange={setRequireApproval}
                />
              </div>
            </div>
          </div>

          {/* System Settings */}
          <div className="space-y-4 border-t border-border/50 pt-4">
            <h3 className="text-sm font-semibold text-foreground flex items-center gap-2">
              <Shield className="w-4 h-4" />
              System Settings
            </h3>
            <div className="space-y-3 pl-6">
              <div className="space-y-2">
                <Label htmlFor="default-currency" className="text-foreground">Default Currency</Label>
                <Select value={defaultCurrency} onValueChange={setDefaultCurrency}>
                  <SelectTrigger id="default-currency" className="border-border/50">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="INR">INR - Indian Rupee</SelectItem>
                    <SelectItem value="USD">USD - US Dollar</SelectItem>
                    <SelectItem value="EUR">EUR - Euro</SelectItem>
                    <SelectItem value="GBP">GBP - British Pound</SelectItem>
                    <SelectItem value="CAD">CAD - Canadian Dollar</SelectItem>
                    <SelectItem value="AUD">AUD - Australian Dollar</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="max-budget" className="text-foreground">Maximum Budget per Company</Label>
                <Input
                  id="max-budget"
                  type="number"
                  value={maxBudget}
                  onChange={(e) => setMaxBudget(e.target.value)}
                  className="border-border/50"
                  placeholder="100000"
                />
              </div>
            </div>
          </div>

          <Button type="submit" disabled={loading} className="w-full">
            {loading ? 'Saving...' : 'Save Settings'}
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}
