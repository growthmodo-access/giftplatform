-- Fix RLS Policy for User Signup
-- Run this in Supabase SQL Editor to allow users to insert their own profile during signup

-- Drop existing policy if it exists (optional, will error if doesn't exist)
DROP POLICY IF EXISTS "Users can insert own data" ON public.users;

-- Create INSERT policy to allow users to create their own profile
CREATE POLICY "Users can insert own data" ON public.users
  FOR INSERT WITH CHECK (auth.uid() = id);
