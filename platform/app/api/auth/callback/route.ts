import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'
import { createUserProfile } from '@/actions/auth'

export async function GET(request: Request) {
  const requestUrl = new URL(request.url)
  const code = requestUrl.searchParams.get('code')
  const type = requestUrl.searchParams.get('type')
  const next = requestUrl.searchParams.get('next') ?? (type === 'recovery' ? '/reset-password' : '/dashboard')

  const supabase = await createClient()
  if (code) {
    await supabase.auth.exchangeCodeForSession(code)
  }

  // Ensure profile exists for magic-link logins to avoid dashboard/login redirect loops.
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (user) {
    const { data: profile } = await supabase
      .from('users')
      .select('id')
      .eq('id', user.id)
      .maybeSingle()

    if (!profile) {
      await createUserProfile(
        user.id,
        user.email ?? '',
        typeof user.user_metadata?.name === 'string' ? user.user_metadata.name : undefined,
        null,
        { defaultRoleWithoutCompany: 'MANAGER' }
      )
    }
  }

  // URL to redirect to after sign in process completes
  return NextResponse.redirect(new URL(next, requestUrl.origin))
}
