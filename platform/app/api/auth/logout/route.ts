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
    
    // Use the request URL to determine the origin
    let redirectUrl: URL
    try {
      const requestUrl = new URL(request.url)
      redirectUrl = new URL('/login', requestUrl.origin)
      
      // #region agent log
      const redirectLog = {location:'app/api/auth/logout/route.ts:30',message:'Creating redirect URL',data:{origin:requestUrl.origin,redirectUrl:redirectUrl.toString()},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'B'};
      await fetch('http://127.0.0.1:7244/ingest/d57efb5a-5bf9-47f9-9b34-6407b474476d',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(redirectLog)}).catch(()=>{});
      // #endregion
    } catch (urlError) {
      // #region agent log
      const urlErrorLog = {location:'app/api/auth/logout/route.ts:35',message:'Error creating URL',data:{error:urlError instanceof Error ? urlError.message : 'Unknown error'},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'B'};
      await fetch('http://127.0.0.1:7244/ingest/d57efb5a-5bf9-47f9-9b34-6407b474476d',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(urlErrorLog)}).catch(()=>{});
      // #endregion
      
      // Fallback to relative URL if URL construction fails
      redirectUrl = new URL('/login', 'http://localhost:3000')
    }
    
    // #region agent log
    const finalLog = {location:'app/api/auth/logout/route.ts:44',message:'Returning redirect response',data:{redirectUrl:redirectUrl.toString()},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'A'};
    await fetch('http://127.0.0.1:7244/ingest/d57efb5a-5bf9-47f9-9b34-6407b474476d',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(finalLog)}).catch(()=>{});
    // #endregion

    return NextResponse.redirect(redirectUrl)
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
