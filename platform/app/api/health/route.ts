import { NextResponse } from 'next/server'

/**
 * Health check for load balancers and monitoring.
 * GET /api/health returns 200 when the app is up.
 */
export async function GET() {
  return NextResponse.json(
    {
      ok: true,
      env: process.env.NODE_ENV ?? 'development',
    },
    { status: 200 }
  )
}
