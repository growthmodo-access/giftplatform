'use client'

import { useState, useEffect, Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import Image from 'next/image'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { supabase } from '@/lib/supabase/client'

function LoginForm() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [useMagicLink, setUseMagicLink] = useState(false)
  const [magicLinkSent, setMagicLinkSent] = useState(false)

  // Check for error in URL params (from redirects)
  useEffect(() => {
    const errorParam = searchParams.get('error')
    if (errorParam === 'profile_not_found') {
      setError('User profile not found. Please contact support or ensure your account is properly set up.')
    } else if (errorParam === 'profile_error') {
      setError('Error loading user profile. Please try again or contact support.')
    }
  }, [searchParams])

  // Check if user is already logged in
  useEffect(() => {
    const checkUser = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser()
        
        if (user) {
          const redirectTo = searchParams.get('redirect') || '/dashboard'
          router.push(redirectTo)
        }
      } catch (err) {
        // Silently handle error - user can still log in
        if (process.env.NODE_ENV === 'development') {
          console.error('Error checking user:', err)
        }
      }
    }
    checkUser()
  }, [router, searchParams])

  const handleMagicLink = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    try {
      const { error: otpError } = await supabase.auth.signInWithOtp({
        email: email.trim(),
        options: {
          emailRedirectTo: `${typeof window !== 'undefined' ? window.location.origin : ''}/api/auth/callback`,
        },
      })
      if (otpError) throw otpError
      setMagicLinkSent(true)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to send magic link')
    } finally {
      setLoading(false)
    }
  }

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      })

      if (error) {
        console.error('[Login] Supabase auth error:', error)
        throw error
      }

      if (!data?.user) {
        console.error('[Login] No user returned from signInWithPassword')
        throw new Error('Login failed: No user data returned')
      }

      // Verify user profile exists before redirecting
      try {
        const { data: profile, error: profileError } = await supabase
          .from('users')
          .select('id, role, company_id')
          .eq('id', data.user.id)
          .maybeSingle()

        if (profileError) {
          console.error('[Login] Error fetching user profile:', profileError)
          throw new Error(`Profile error: ${profileError.message}`)
        }

        if (!profile) {
          console.error('[Login] User profile not found for user:', data.user.id)
          throw new Error('User profile not found. Please contact support.')
        }

        console.log('[Login] User profile found:', { role: profile.role, company_id: profile.company_id })
      } catch (profileErr) {
        // If profile check fails, still allow login but log the error
        console.warn('[Login] Profile check warning:', profileErr)
        // Don't throw - let the user proceed and see if layout handles it
      }

      // Get redirect URL from query params or default to dashboard
      const redirectTo = searchParams.get('redirect') || '/dashboard'
      
      // Use window.location for a full page reload to ensure cookies are set
      // This ensures middleware can read the authentication cookies
      window.location.href = redirectTo
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'An error occurred during login'
      console.error('[Login] Error:', errorMessage, error)
      setError(errorMessage)
      setLoading(false)
    }
  }

  const testUsers = [
    { email: 'superadmin@test.com', password: 'Test123!@#', role: 'SUPER_ADMIN', label: 'Super Admin' },
    { email: 'admin@test.com', password: 'Test123!@#', role: 'ADMIN', label: 'Admin' },
    { email: 'hr@test.com', password: 'Test123!@#', role: 'HR', label: 'HR' },
    { email: 'manager@test.com', password: 'Test123!@#', role: 'MANAGER', label: 'Manager' },
    { email: 'employee@test.com', password: 'Test123!@#', role: 'EMPLOYEE', label: 'Employee' },
  ]

  const handleTestLogin = async (testUser: typeof testUsers[0]) => {
    setEmail(testUser.email)
    setPassword(testUser.password)
    setLoading(true)
    setError('')

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: testUser.email,
        password: testUser.password,
      })

      if (error) {
        console.error('[Login] Test login Supabase auth error:', error)
        throw error
      }

      if (!data?.user) {
        console.error('[Login] Test login: No user returned')
        throw new Error('Login failed: No user data returned')
      }

      // Verify user profile exists
      try {
        const { data: profile, error: profileError } = await supabase
          .from('users')
          .select('id, role, company_id')
          .eq('id', data.user.id)
          .maybeSingle()

        if (profileError) {
          console.error('[Login] Test login profile error:', profileError)
          throw new Error(`Profile error: ${profileError.message}`)
        }

        if (!profile) {
          console.error('[Login] Test login: User profile not found for:', testUser.email)
          throw new Error(`User profile not found for ${testUser.email}. Please ensure the user exists in the database.`)
        }

        console.log('[Login] Test login profile found:', { email: testUser.email, role: profile.role, company_id: profile.company_id })
      } catch (profileErr) {
        console.warn('[Login] Test login profile check warning:', profileErr)
        // Don't throw - let the user proceed
      }

      // Get redirect URL from query params or default to dashboard
      const redirectTo = searchParams.get('redirect') || '/dashboard'
      
      // Use window.location for a full page reload to ensure cookies are set
      // This ensures middleware can read the authentication cookies
      window.location.href = redirectTo
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'An error occurred during login'
      console.error('[Login] Test login error:', errorMessage, error)
      setError(errorMessage)
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-white p-3 sm:p-4 md:p-6 overflow-x-hidden min-w-0 w-full">
      <Card className="w-full max-w-md border border-black/[0.06] gradient-card shadow-xl min-w-0 max-w-[calc(100vw-1.5rem)]">
        <CardHeader className="space-y-1 pb-6">
          <div className="flex items-center justify-center mb-6">
            <Image
              src="/logogoodies.png"
              alt="Goodies Logo"
              width={160}
              height={80}
              className="h-12 sm:h-16 lg:h-20 w-auto object-contain"
              priority
            />
          </div>
          <CardTitle className="text-2xl font-semibold text-center text-foreground">Welcome back</CardTitle>
          <CardDescription className="text-center text-muted-foreground">
            Sign in to your Goodies.so account
          </CardDescription>
        </CardHeader>
        <CardContent>
          {magicLinkSent ? (
            <div className="space-y-4 text-center py-4">
              <p className="text-foreground font-medium">Check your email</p>
              <p className="text-sm text-muted-foreground">
                We sent a sign-in link to <strong>{email}</strong>. Click the link to sign in.
              </p>
              <Button
                type="button"
                variant="outline"
                className="w-full border-border/50"
                onClick={() => { setMagicLinkSent(false); setError('') }}
              >
                Use a different email
              </Button>
            </div>
          ) : (
            <form onSubmit={useMagicLink ? handleMagicLink : handleLogin} className="space-y-4">
              {error && (
                <div className="p-3 text-sm text-destructive bg-destructive/10 border border-destructive/20 rounded-md">
                  {error}
                </div>
              )}
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
              {!useMagicLink && (
                <div className="space-y-2">
                  <Label htmlFor="password" className="text-foreground">Password</Label>
                  <Input
                    id="password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    className="border-border/50"
                  />
                </div>
              )}
              <Button type="submit" className="w-full gradient-button text-white shadow-primary" disabled={loading}>
                {loading
                  ? (useMagicLink ? 'Sending link...' : 'Signing in...')
                  : (useMagicLink ? 'Send magic link' : 'Sign in')}
              </Button>
              <div className="flex items-center justify-center gap-2">
                <button
                  type="button"
                  className="text-sm text-muted-foreground hover:text-foreground"
                  onClick={() => { setUseMagicLink(!useMagicLink); setError(''); setMagicLinkSent(false); }}
                >
                  {useMagicLink ? 'Sign in with password instead' : 'Sign in with magic link instead'}
                </button>
              </div>
              <div className="text-center text-sm text-muted-foreground">
                Don't have an account?{' '}
                <a href="/signup" className="text-foreground hover:underline font-medium">
                  Sign up
                </a>
              </div>
            </form>
          )}

          {/* Test User Quick Login */}
          <div className="mt-6 pt-6 border-t border-border/50">
            <p className="text-xs text-muted-foreground mb-3 text-center">Quick Login (Testing)</p>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2">
              {testUsers.map((testUser) => (
                <Button
                  key={testUser.email}
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => handleTestLogin(testUser)}
                  disabled={loading}
                  className="text-xs border-border/50"
                >
                  {testUser.label}
                </Button>
              ))}
            </div>
            <p className="text-xs text-muted-foreground mt-2 text-center">
              All test users: Test123!@#
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

export default function LoginPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-muted-foreground">Loading...</div>
      </div>
    }>
      <LoginForm />
    </Suspense>
  )
}
