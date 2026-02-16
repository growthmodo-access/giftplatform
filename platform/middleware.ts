import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'
import { env } from '@/lib/env'

export async function middleware(request: NextRequest) {
  try {
    // Debug logging only in development
    if (process.env.NODE_ENV === 'development' && process.env.ENABLE_DEBUG_LOGGING === 'true') {
      // Debug logging can be enabled via environment variable
    }
    
    let response = NextResponse.next({
      request: {
        headers: request.headers,
      },
    })

    const supabase = createServerClient(
      env.supabase.url,
      env.supabase.anonKey,
      {
        cookies: {
          getAll() {
            return request.cookies.getAll()
          },
          setAll(cookiesToSet) {
            cookiesToSet.forEach(({ name, value }) =>
              request.cookies.set(name, value)
            )
            response = NextResponse.next({
              request,
            })
            cookiesToSet.forEach(({ name, value, options }) =>
              response.cookies.set(name, value, options)
            )
          },
        },
      }
    )

    const {
      data: { user },
      error: getUserError,
    } = await supabase.auth.getUser()

  // Protect dashboard routes
  if (request.nextUrl.pathname.startsWith('/dashboard') && !user) {
    // #region agent log
    fetch('http://127.0.0.1:7245/ingest/d22e37f8-4626-40d8-a25a-149d05f68c5f',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'middleware.ts',message:'Redirect to login (no user)',data:{pathname:request.nextUrl.pathname},timestamp:Date.now(),hypothesisId:'H2'})}).catch(()=>{});
    // #endregion
    const url = request.nextUrl.clone()
    url.pathname = '/login'
    url.searchParams.set('redirect', request.nextUrl.pathname)
    return NextResponse.redirect(url)
  }

    // Redirect authenticated users away from auth pages
    // BUT: Allow access to /login after logout (user might be null but cookies still exist)
    // Only redirect if user is actually authenticated
    if (
      (request.nextUrl.pathname.startsWith('/login') ||
        request.nextUrl.pathname.startsWith('/signup')) &&
      user
    ) {
      return NextResponse.redirect(new URL('/dashboard', request.url))
    }

    return response
  } catch (error) {
    // #region agent log
    fetch('http://127.0.0.1:7245/ingest/d22e37f8-4626-40d8-a25a-149d05f68c5f',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'middleware.ts:catch',message:'Middleware error',data:{pathname:request.nextUrl.pathname,errorMessage:error instanceof Error ? error.message : String(error)},timestamp:Date.now(),hypothesisId:'H2'})}).catch(()=>{});
    // #endregion
    if (process.env.NODE_ENV === 'development') {
      console.error('Middleware error:', error)
    }
    return NextResponse.next()
  }
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}
