import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

const COOKIE_CLEAR_OPTIONS = {
  maxAge: 0,
  path: '/',
  httpOnly: true,
  secure: process.env.NODE_ENV === 'production',
  sameSite: 'lax' as const,
}

function clearSupabaseCookies(response: NextResponse, request: Request) {
  const allCookies = request.cookies.getAll()
  allCookies.forEach((cookie) => {
    if (cookie.name.startsWith('sb-')) {
      response.cookies.set(cookie.name, '', COOKIE_CLEAR_OPTIONS)
    }
  })
}

export async function POST(request: Request) {
  try {
    const supabase = await createClient()
    await supabase.auth.signOut()
  } catch (e) {
    // Continue to clear cookies even if signOut fails
  }

  // Return 200 + JSON so the client receives Set-Cookie and then does a full navigation.
  // This avoids redirect-based logout where cookies sometimes don't clear before the next request.
  const response = NextResponse.json({ ok: true }, { status: 200 })
  clearSupabaseCookies(response, request)
  response.headers.set('Cache-Control', 'no-store, no-cache, must-revalidate')
  return response
}
