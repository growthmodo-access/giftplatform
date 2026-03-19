'use client'

import { useState, useEffect, Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import Image from 'next/image'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { supabase } from '@/lib/supabase/client'
import { createUserProfile } from '@/actions/auth'

function LoginForm() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [resetSent, setResetSent] = useState(false)

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
        const { data: profile } = await supabase
          .from('users')
          .select('id')
          .eq('id', user.id)
          .maybeSingle()

        if (profile) {
          const redirectTo = searchParams.get('redirect') || '/dashboard'
          router.push(redirectTo)
        }
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

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      })

      if (error) throw error
      if (!data?.user) throw new Error('Login failed: No user data returned')

      // Ensure user profile exists before redirecting; self-heal if missing.
      const { data: profile, error: profileError } = await supabase
        .from('users')
        .select('id, role, company_id')
        .eq('id', data.user.id)
        .maybeSingle()

      if (profileError) throw new Error(`Profile error: ${profileError.message}`)
      if (!profile) {
        const createResult = await createUserProfile(
          data.user.id,
          data.user.email ?? email,
          typeof data.user.user_metadata?.name === 'string' ? data.user.user_metadata.name : undefined,
          null,
          { defaultRoleWithoutCompany: 'MANAGER' }
        )
        if (createResult.error) {
          throw new Error(`User profile setup failed: ${createResult.error}`)
        }
      }

      // Get redirect URL from query params or default to dashboard
      const redirectTo = searchParams.get('redirect') || '/dashboard'
      
      // Use window.location for a full page reload to ensure cookies are set
      // This ensures middleware can read the authentication cookies
      window.location.href = redirectTo
    } catch (error) {
      setError(error instanceof Error ? error.message : 'An error occurred during login')
      setLoading(false)
    }
  }

  const handleForgotPassword = async () => {
    const normalizedEmail = email.trim()
    if (!normalizedEmail) {
      setError('Please enter your email first.')
      return
    }

    setLoading(true)
    setError('')
    setResetSent(false)
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(normalizedEmail, {
        redirectTo: `${typeof window !== 'undefined' ? window.location.origin : ''}/login`,
      })
      if (error) throw error
      setResetSent(true)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to send reset email')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="w-full max-w-[400px] mx-auto overflow-x-hidden min-w-0">
      <Card className="w-full border border-border/20 shadow-xl min-w-0">
        <CardHeader className="space-y-1 pb-6">
          <div className="flex items-center justify-center mb-6">
            <Image
              src="/logogoodies.png"
              alt="Goodies"
              width={160}
              height={80}
              className="h-12 sm:h-16 lg:h-20 w-auto object-contain"
              priority
            />
          </div>
          <CardTitle className="text-2xl font-semibold text-center text-foreground">Welcome back</CardTitle>
          <CardDescription className="text-center text-muted-foreground">
            Sign in to your Goodies account
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleLogin} className="space-y-4">
            {error && (
                <div className="p-3 text-sm text-destructive bg-destructive/10 border border-destructive/20 rounded-none">
                {error}
              </div>
            )}
            {resetSent && (
              <div className="p-3 text-sm text-green-700 bg-green-50 border border-green-200 rounded-none">
                Password reset link sent. Please check your inbox.
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
            <div className="text-right">
              <button
                type="button"
                className="text-sm text-muted-foreground hover:text-foreground underline underline-offset-2"
                onClick={handleForgotPassword}
                disabled={loading}
              >
                Forgot password?
              </button>
            </div>
              <Button type="submit" className="w-full rounded-none bg-primary text-primary-foreground hover:bg-primary/90 font-medium" disabled={loading}>
                {loading
                  ? 'Signing in...'
                  : 'Sign in'}
            </Button>
              <div className="text-center text-sm text-muted-foreground">
              Don't have an account?{' '}
                <a href="/signup" className="text-foreground hover:underline font-medium">
                Sign up
              </a>
            </div>
          </form>
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
