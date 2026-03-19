'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { supabase } from '@/lib/supabase/client'

export default function ResetPasswordPage() {
  const router = useRouter()
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [checking, setChecking] = useState(true)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)
  const [canReset, setCanReset] = useState(false)

  useEffect(() => {
    let mounted = true
    const checkRecoverySession = async () => {
      try {
        const { data } = await supabase.auth.getSession()
        if (!mounted) return
        setCanReset(!!data.session)
      } catch {
        if (!mounted) return
        setCanReset(false)
      } finally {
        if (mounted) setChecking(false)
      }
    }
    checkRecoverySession()
    return () => {
      mounted = false
    }
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    if (password.length < 6) {
      setError('Password must be at least 6 characters.')
      return
    }
    if (password !== confirmPassword) {
      setError('Passwords do not match.')
      return
    }

    setLoading(true)
    try {
      const { error: updateError } = await supabase.auth.updateUser({
        password,
      })
      if (updateError) throw updateError
      setSuccess(true)
      setTimeout(() => router.push('/login'), 1200)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update password.')
    } finally {
      setLoading(false)
    }
  }

  if (checking) {
    return (
      <div className="w-full max-w-[420px] mx-auto">
        <Card className="w-full border border-border/20 shadow-xl">
          <CardHeader>
            <CardTitle className="text-2xl font-semibold text-center">Reset password</CardTitle>
            <CardDescription className="text-center">Checking your reset link...</CardDescription>
          </CardHeader>
        </Card>
      </div>
    )
  }

  if (!canReset) {
    return (
      <div className="w-full max-w-[420px] mx-auto">
        <Card className="w-full border border-border/20 shadow-xl">
          <CardHeader>
            <CardTitle className="text-2xl font-semibold text-center">Invalid or expired link</CardTitle>
            <CardDescription className="text-center">
              Request a new password reset link from login.
            </CardDescription>
          </CardHeader>
          <CardContent className="text-center">
            <Button asChild className="w-full">
              <Link href="/login">Back to login</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="w-full max-w-[420px] mx-auto">
      <Card className="w-full border border-border/20 shadow-xl">
        <CardHeader>
          <CardTitle className="text-2xl font-semibold text-center">Set a new password</CardTitle>
          <CardDescription className="text-center">
            Enter your new password below.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <div className="p-3 text-sm text-destructive bg-destructive/10 border border-destructive/20 rounded-none">
                {error}
              </div>
            )}
            {success && (
              <div className="p-3 text-sm text-green-700 bg-green-50 border border-green-200 rounded-none">
                Password updated. Redirecting to login...
              </div>
            )}
            <div className="space-y-2">
              <Label htmlFor="password">New password</Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                minLength={6}
                required
                className="border-border/50"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="confirmPassword">Confirm password</Label>
              <Input
                id="confirmPassword"
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                minLength={6}
                required
                className="border-border/50"
              />
            </div>
            <Button
              type="submit"
              className="w-full rounded-none bg-primary text-primary-foreground hover:bg-primary/90 font-medium"
              disabled={loading || success}
            >
              {loading ? 'Updating...' : 'Update password'}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
