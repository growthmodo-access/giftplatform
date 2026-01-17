/**
 * Environment variable access
 * Returns env vars directly without validation to allow builds to proceed.
 * Validation happens naturally when Supabase client is initialized with missing values.
 * 
 * For Vercel deployments: Set these in Vercel Dashboard → Settings → Environment Variables
 * For local development: Set these in .env.local file
 */

export const env = {
  supabase: {
    get url() {
      // Return directly - allows build to proceed even if not set
      // Will fail at runtime with clear Supabase error if missing
      return process.env.NEXT_PUBLIC_SUPABASE_URL || ''
    },
    get anonKey() {
      // Return directly - allows build to proceed even if not set
      // Will fail at runtime with clear Supabase error if missing
      return process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''
    },
    get serviceRoleKey() {
      return process.env.SUPABASE_SERVICE_ROLE_KEY // Optional
    },
  },
} as const
