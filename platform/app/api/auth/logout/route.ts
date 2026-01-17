import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

export async function POST(request: Request) {
  const supabase = await createClient()
  await supabase.auth.signOut()
  
  // Use the request URL to determine the origin
  const url = new URL(request.url)
  return NextResponse.redirect(new URL('/login', url.origin))
}
