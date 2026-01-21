import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

export async function POST(request: Request) {
  try {
    const supabase = await createClient()
    
    // Sign out from Supabase
    const { error: signOutError } = await supabase.auth.signOut()
    
    if (signOutError) {
      console.error('Logout error:', signOutError)
      // Continue with logout even if signOut has an error
    }
    
    // Get the origin from the request URL
    const url = new URL(request.url)
    const loginUrl = new URL('/login', url.origin)
    
    // Create redirect response
    const response = NextResponse.redirect(loginUrl)
    
    // Clear all Supabase auth cookies
    const cookieOptions = {
      maxAge: 0,
      path: '/',
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax' as const
    }
    
    // Clear known Supabase cookie names
    const supabaseCookieNames = [
      'sb-access-token',
      'sb-refresh-token',
      'sb-provider-token',
      'sb-provider-refresh-token'
    ]
    
    supabaseCookieNames.forEach(name => {
      response.cookies.set(name, '', cookieOptions)
    })
    
    // Also delete any other cookies that start with 'sb-'
    const allCookies = request.cookies.getAll()
    allCookies.forEach(cookie => {
      if (cookie.name.startsWith('sb-')) {
        response.cookies.set(cookie.name, '', cookieOptions)
      }
    })
    
    return response
  } catch (error) {
    console.error('Logout route error:', error)
    
    // Try to redirect to login even on error
    try {
      const url = new URL(request.url)
      const loginUrl = new URL('/login', url.origin)
      return NextResponse.redirect(loginUrl)
    } catch (redirectError) {
      // If redirect fails, return JSON error
      return NextResponse.json(
        { error: 'Logout failed', details: error instanceof Error ? error.message : 'Unknown error' },
        { status: 500 }
      )
    }
  }
}
