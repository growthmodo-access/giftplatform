import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'
import { env } from '@/lib/env'

export async function middleware(request: NextRequest) {
  try {
    // #region agent log
    const logData = {location:'middleware.ts:5',message:'Middleware entry',data:{pathname:request.nextUrl.pathname,hasUrl:!!env.supabase.url,hasAnonKey:!!env.supabase.anonKey},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'A'};
    await fetch('http://127.0.0.1:7244/ingest/d57efb5a-5bf9-47f9-9b34-6407b474476d',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(logData)}).catch(()=>{});
    // #endregion
    
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

    // #region agent log
    const getUserLog = {location:'middleware.ts:37',message:'Getting user from Supabase',data:{pathname:request.nextUrl.pathname},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'A'};
    await fetch('http://127.0.0.1:7244/ingest/d57efb5a-5bf9-47f9-9b34-6407b474476d',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(getUserLog)}).catch(()=>{});
    // #endregion

    const {
      data: { user },
      error: getUserError,
    } = await supabase.auth.getUser()

    // #region agent log
    const userCheckLog = {location:'middleware.ts:45',message:'User check result',data:{pathname:request.nextUrl.pathname,hasUser:!!user,getUserError:getUserError?.message},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'A'};
    await fetch('http://127.0.0.1:7244/ingest/d57efb5a-5bf9-47f9-9b34-6407b474476d',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(userCheckLog)}).catch(()=>{});
    // #endregion

  // Protect dashboard routes
  if (request.nextUrl.pathname.startsWith('/dashboard') && !user) {
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
      // #region agent log
      const redirectLog = {location:'middleware.ts:53',message:'Redirecting authenticated user from auth page',data:{pathname:request.nextUrl.pathname,hasUser:!!user},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'A'};
      await fetch('http://127.0.0.1:7244/ingest/d57efb5a-5bf9-47f9-9b34-6407b474476d',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(redirectLog)}).catch(()=>{});
      // #endregion
      return NextResponse.redirect(new URL('/dashboard', request.url))
    }

    // #region agent log
    const finalLog = {location:'middleware.ts:60',message:'Middleware returning response',data:{pathname:request.nextUrl.pathname,hasUser:!!user},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'A'};
    await fetch('http://127.0.0.1:7244/ingest/d57efb5a-5bf9-47f9-9b34-6407b474476d',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(finalLog)}).catch(()=>{});
    // #endregion

    return response
  } catch (error) {
    // #region agent log
    const errorLog = {location:'middleware.ts:65',message:'Middleware error',data:{pathname:request.nextUrl.pathname,error:error instanceof Error ? error.message : 'Unknown error',errorStack:error instanceof Error ? error.stack : undefined},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'A'};
    await fetch('http://127.0.0.1:7244/ingest/d57efb5a-5bf9-47f9-9b34-6407b474476d',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(errorLog)}).catch(()=>{});
    // #endregion
    // If middleware fails, still return response to prevent blocking
    return NextResponse.next()
  }
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}
