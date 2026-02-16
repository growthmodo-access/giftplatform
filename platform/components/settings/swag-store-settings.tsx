'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Switch } from '@/components/ui/switch'
import { Globe, ExternalLink, Copy, Check } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { updateSwagStoreSettings } from '@/actions/swag-store'
import { getStoreBaseUrl } from '@/lib/site'

interface SwagStoreSettingsProps {
  companyId: string | null
  storeIdentifier: string | null
  isEnabled: boolean
  canEdit: boolean
}

export function SwagStoreSettings({ 
  companyId, 
  storeIdentifier: initialStoreIdentifier, 
  isEnabled: initialIsEnabled,
  canEdit 
}: SwagStoreSettingsProps) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)
  const [isEnabled, setIsEnabled] = useState(initialIsEnabled)
  const [copied, setCopied] = useState(false)

  const storeBase = getStoreBaseUrl()
  const storeUrl = initialStoreIdentifier 
    ? `${storeBase}/companies/${initialStoreIdentifier}`
    : null

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!canEdit || !companyId) {
      setError('You do not have permission to update swag store settings')
      return
    }

    setLoading(true)
    setError('')
    setSuccess(false)

    try {
      const formData = new FormData()
      formData.append('isEnabled', isEnabled.toString())

      const result = await updateSwagStoreSettings(companyId, formData)

      if (result.error) {
        setError(result.error)
      } else {
        setSuccess(true)
        router.refresh()
        setTimeout(() => setSuccess(false), 3000)
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred')
    } finally {
      setLoading(false)
    }
  }

  if (!canEdit) {
    return (
      <Card className="border border-border/50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Globe className="w-5 h-5" />
            Swag Store
          </CardTitle>
          <CardDescription>Your company's swag store settings (read-only)</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {storeUrl && (
            <div className="space-y-2">
              <Label className="text-muted-foreground">Store URL</Label>
              <div className="flex items-center gap-2">
                <Input value={storeUrl} readOnly className="border-border/50" />
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => window.open(storeUrl, '_blank')}
                >
                  <ExternalLink className="w-4 h-4" />
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="border border-border/50">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Globe className="w-5 h-5" />
          Swag Store Settings
        </CardTitle>
        <CardDescription>
          Configure your company's swag store URL
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
              Swag store settings updated successfully
            </div>
          )}

          {/* Store Status */}
          <div className="flex items-center justify-between p-4 border border-border/50 rounded-lg">
            <div>
              <Label htmlFor="store-enabled" className="text-foreground">Enable Swag Store</Label>
              <p className="text-xs text-muted-foreground">Make your swag store publicly accessible</p>
            </div>
            <Switch
              id="store-enabled"
              checked={isEnabled}
              onCheckedChange={setIsEnabled}
            />
          </div>

          {/* Store URL */}
          {storeUrl && (
            <div className="space-y-2">
              <Label className="text-foreground">Store URL</Label>
              <div className="flex items-center gap-2">
                <Input value={storeUrl} readOnly className="border-border/50 bg-muted/50" />
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => handleCopy(storeUrl)}
                >
                  {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => window.open(storeUrl, '_blank')}
                >
                  <ExternalLink className="w-4 h-4" />
                </Button>
              </div>
              <p className="text-xs text-muted-foreground">
                Your unique store identifier: {initialStoreIdentifier}
              </p>
            </div>
          )}

          <Button type="submit" disabled={loading} className="w-full">
            {loading ? 'Saving...' : 'Save Settings'}
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}
