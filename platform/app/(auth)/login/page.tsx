'use client'

import { useState, useEffect, Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
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

      // With @supabase/ssr createBrowserClient, if signInWithPassword succeeds (no error),
      // the session is automatically stored in cookies by the client.
      // We don't need to verify the session immediately - it will be available after redirect via middleware.
      // If there was an error, it would have been thrown above.

      // Get redirect URL from query params or default to dashboard
      const redirectTo = searchParams.get('redirect') || '/dashboard'
      
      // Use window.location for a full page reload to ensure cookies are set
      // This ensures middleware can read the authentication cookies
      window.location.href = redirectTo
    } catch (error) {
      setError(
        error instanceof Error ? error.message : 'An error occurred during login'
      )
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

      if (error) throw error

      // With @supabase/ssr createBrowserClient, if signInWithPassword succeeds (no error),
      // the session is automatically stored in cookies by the client.
      // We don't need to verify the session immediately - it will be available after redirect via middleware.
      // If there was an error, it would have been thrown above.

      // Get redirect URL from query params or default to dashboard
      const redirectTo = searchParams.get('redirect') || '/dashboard'
      
      // Use window.location for a full page reload to ensure cookies are set
      // This ensures middleware can read the authentication cookies
      window.location.href = redirectTo
    } catch (error) {
      setError(
        error instanceof Error ? error.message : 'An error occurred during login'
      )
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <Card className="w-full max-w-md border border-border/50">
        <CardHeader className="space-y-1 pb-6">
          <div className="flex items-center justify-center mb-6">
            <div className="w-12 h-12 bg-foreground rounded-lg flex items-center justify-center">
              <span className="text-background font-semibold text-xl">G</span>
            </div>
          </div>
          <CardTitle className="text-2xl font-semibold text-center text-foreground">Welcome back</CardTitle>
          <CardDescription className="text-center text-muted-foreground">
            Sign in to your Goodies.so account
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleLogin} className="space-y-4">
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
            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? 'Signing in...' : 'Sign in'}
            </Button>
            <div className="text-center text-sm text-muted-foreground">
              Don't have an account?{' '}
              <a href="/signup" className="text-foreground hover:underline font-medium">
                Sign up
              </a>
            </div>
          </form>

          {/* Test User Quick Login */}
          <div className="mt-6 pt-6 border-t border-border/50">
            <p className="text-xs text-muted-foreground mb-3 text-center">Quick Login (Testing)</p>
            <div className="grid grid-cols-2 gap-2">
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
