import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

export async function POST(request: Request) {
  try {
    // #region agent log
    const logEntry = {location:'app/api/auth/logout/route.ts:5',message:'Logout route called',data:{},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'A'};
    await fetch('http://127.0.0.1:7244/ingest/d57efb5a-5bf9-47f9-9b34-6407b474476d',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(logEntry)}).catch(()=>{});
    // #endregion

    const supabase = await createClient()
    
    // #region agent log
    const signOutLog = {location:'app/api/auth/logout/route.ts:12',message:'Calling signOut',data:{},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'A'};
    await fetch('http://127.0.0.1:7244/ingest/d57efb5a-5bf9-47f9-9b34-6407b474476d',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(signOutLog)}).catch(()=>{});
    // #endregion

    const { error: signOutError } = await supabase.auth.signOut()
    
    // #region agent log
    const signOutResult = {location:'app/api/auth/logout/route.ts:17',message:'SignOut result',data:{hasError:!!signOutError,error:signOutError?.message},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'A'};
    await fetch('http://127.0.0.1:7244/ingest/d57efb5a-5bf9-47f9-9b34-6407b474476d',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(signOutResult)}).catch(()=>{});
    // #endregion

    if (signOutError) {
      console.error('Logout error:', signOutError)
    }
    
    // Create redirect response - use relative URL
    const response = NextResponse.redirect(new URL('/login', request.url))
    
    // Clear auth cookies by setting them to expire
    // Note: Supabase SSR handles cookie clearing via signOut(), but we'll also clear manually
    const cookieOptions = {
      maxAge: 0,
      path: '/',
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax' as const
    }
    
    response.cookies.set('sb-access-token', '', cookieOptions)
    response.cookies.set('sb-refresh-token', '', cookieOptions)
    
    // Also delete any other Supabase auth cookies
    const allCookies = request.cookies.getAll()
    allCookies.forEach(cookie => {
      if (cookie.name.startsWith('sb-')) {
        response.cookies.set(cookie.name, '', cookieOptions)
      }
    })
    
    // #region agent log
    const finalLog = {location:'app/api/auth/logout/route.ts:30',message:'Returning redirect response',data:{redirectUrl:loginUrl.toString()},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'A'};
    await fetch('http://127.0.0.1:7244/ingest/d57efb5a-5bf9-47f9-9b34-6407b474476d',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(finalLog)}).catch(()=>{});
    // #endregion

    return response
  } catch (error) {
    // #region agent log
    const errorLog = {location:'app/api/auth/logout/route.ts:49',message:'Logout route error',data:{error:error instanceof Error ? error.message : 'Unknown error',errorStack:error instanceof Error ? error.stack : undefined},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'A'};
    await fetch('http://127.0.0.1:7244/ingest/d57efb5a-5bf9-47f9-9b34-6407b474476d',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(errorLog)}).catch(()=>{});
    // #endregion
    
    console.error('Logout route error:', error)
    
    // Return error response instead of crashing
    return NextResponse.json(
      { error: 'Logout failed' },
      { status: 500 }
    )
  }
}
