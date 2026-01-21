'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { supabase } from '@/lib/supabase/client'
import { createUserProfile } from '@/actions/auth'

export default function SignupPage() {
  const router = useRouter()
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [signupType, setSignupType] = useState<'individual' | 'company'>('individual')
  const [companyName, setCompanyName] = useState('')
  const [companyDomain, setCompanyDomain] = useState('')
  const [taxId, setTaxId] = useState('')
  const [billingStreet, setBillingStreet] = useState('')
  const [billingCity, setBillingCity] = useState('')
  const [billingState, setBillingState] = useState('')
  const [billingCountry, setBillingCountry] = useState('')
  const [billingZip, setBillingZip] = useState('')
  const [currency, setCurrency] = useState('USD')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            name,
          },
        },
      })

      if (error) throw error

      if (!data.user) {
        throw new Error('Failed to create user account')
      }

      // Create user profile and company if needed
      const companyData = signupType === 'company' ? {
        name: companyName,
        domain: companyDomain,
        taxId: taxId,
        currency: currency,
        billingAddress: {
          street: billingStreet,
          city: billingCity,
          state: billingState,
          country: billingCountry,
          zip_code: billingZip,
        }
      } : null

      const profileResult = await createUserProfile(
        data.user.id,
        data.user.email!,
        name,
        companyData
      )

      if (profileResult.error) {
        // If user creation fails, sign out the auth user to prevent orphaned accounts
        await supabase.auth.signOut()
        throw new Error(
          `Account created but failed to set up profile: ${profileResult.error}. Please try again.`
        )
      }

      router.push('/dashboard')
      router.refresh()
    } catch (error) {
      setError(
        error instanceof Error ? error.message : 'An error occurred during signup'
      )
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <Card className="w-full max-w-md border border-border/50">
        <CardHeader className="space-y-1 pb-6">
          <div className="flex items-center justify-center mb-6">
            <div className="relative w-[448px] h-[224px] max-w-full">
              <Image
                src="/goodies.png"
                alt="Goodies.so Logo"
                fill
                className="object-contain"
                priority
              />
            </div>
          </div>
          <CardTitle className="text-2xl font-semibold text-center text-foreground">Create an account</CardTitle>
          <CardDescription className="text-center text-muted-foreground">
            Sign up to get started with Goodies.so
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSignup} className="space-y-4">
            {error && (
              <div className="p-3 text-sm text-destructive bg-destructive/10 border border-destructive/20 rounded-md">
                {error}
              </div>
            )}

            <Tabs value={signupType} onValueChange={(v) => setSignupType(v as 'individual' | 'company')} className="w-full">
              <TabsList className="grid w-full grid-cols-2 mb-4">
                <TabsTrigger value="individual">Individual</TabsTrigger>
                <TabsTrigger value="company">Company</TabsTrigger>
              </TabsList>

              <TabsContent value="individual" className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="name" className="text-foreground">Full Name</Label>
                  <Input
                    id="name"
                    type="text"
                    placeholder="John Doe"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                    className="border-border/50"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email" className="text-foreground">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="name@company.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="border-border/50"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="password" className="text-foreground">Password</Label>
                  <Input
                    id="password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    minLength={6}
                    className="border-border/50"
                  />
                </div>
              </TabsContent>

              <TabsContent value="company" className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="name" className="text-foreground">Your Name</Label>
                  <Input
                    id="name"
                    type="text"
                    placeholder="John Doe"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                    className="border-border/50"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email" className="text-foreground">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="name@company.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="border-border/50"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="password" className="text-foreground">Password</Label>
                  <Input
                    id="password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    minLength={6}
                    className="border-border/50"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="companyName" className="text-foreground">Company Name *</Label>
                  <Input
                    id="companyName"
                    type="text"
                    placeholder="Acme Inc."
                    value={companyName}
                    onChange={(e) => setCompanyName(e.target.value)}
                    required={signupType === 'company'}
                    className="border-border/50"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="companyDomain" className="text-foreground">Company Domain</Label>
                  <Input
                    id="companyDomain"
                    type="text"
                    placeholder="acme.com"
                    value={companyDomain}
                    onChange={(e) => setCompanyDomain(e.target.value)}
                    className="border-border/50"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="taxId" className="text-foreground">Tax ID</Label>
                    <Input
                      id="taxId"
                      type="text"
                      placeholder="TAX-123456"
                      value={taxId}
                      onChange={(e) => setTaxId(e.target.value)}
                      className="border-border/50"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="currency" className="text-foreground">Currency</Label>
                    <Select value={currency} onValueChange={setCurrency}>
                      <SelectTrigger id="currency" className="border-border/50">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="USD">USD</SelectItem>
                        <SelectItem value="INR">INR</SelectItem>
                        <SelectItem value="EUR">EUR</SelectItem>
                        <SelectItem value="GBP">GBP</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="space-y-2">
                  <Label className="text-foreground">Billing Address</Label>
                  <div className="space-y-2">
                    <Input
                      placeholder="Street Address"
                      value={billingStreet}
                      onChange={(e) => setBillingStreet(e.target.value)}
                      className="border-border/50"
                    />
                    <div className="grid grid-cols-2 gap-2">
                      <Input
                        placeholder="City"
                        value={billingCity}
                        onChange={(e) => setBillingCity(e.target.value)}
                        className="border-border/50"
                      />
                      <Input
                        placeholder="State"
                        value={billingState}
                        onChange={(e) => setBillingState(e.target.value)}
                        className="border-border/50"
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      <Input
                        placeholder="ZIP Code"
                        value={billingZip}
                        onChange={(e) => setBillingZip(e.target.value)}
                        className="border-border/50"
                      />
                      <Input
                        placeholder="Country"
                        value={billingCountry}
                        onChange={(e) => setBillingCountry(e.target.value)}
                        className="border-border/50"
                      />
                    </div>
                  </div>
                </div>
              </TabsContent>
            </Tabs>

            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? 'Creating account...' : 'Sign up'}
            </Button>
            <div className="text-center text-sm text-muted-foreground">
              Already have an account?{' '}
              <a href="/login" className="text-foreground hover:underline font-medium">
                Sign in
              </a>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
