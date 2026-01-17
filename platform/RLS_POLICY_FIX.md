# Fix RLS Policy for User Signup

## Problem
When users sign up, they get this error:
```
Account created but failed to set up profile: new row violates row-level security policy for table "users"
```

## Cause
The Row Level Security (RLS) policy for the `users` table was missing an INSERT policy, so users couldn't create their own profile records during signup.

## Solution

Run this SQL in your Supabase SQL Editor:

```sql
-- Create INSERT policy to allow users to create their own profile
CREATE POLICY "Users can insert own data" ON public.users
  FOR INSERT WITH CHECK (auth.uid() = id);
```

Or use the file: `supabase-fix-rls-policy.sql`

## Steps

1. Go to Supabase Dashboard → SQL Editor
2. Copy and paste the SQL above (or from `supabase-fix-rls-policy.sql`)
3. Click "Run"
4. Try signing up again - it should work now!

## What This Does

This policy allows authenticated users to insert a row into the `users` table, but only if:
- They are authenticated (`auth.uid()` exists)
- The `id` field in the insert matches their authenticated user ID (`auth.uid() = id`)

This ensures users can only create their own profile, not someone else's.

## Updated Schema

The `supabase-schema.sql` file has been updated to include this policy for future setups.
