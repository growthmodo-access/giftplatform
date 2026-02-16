-- ROLLBACK: Remove the Super Admin RLS policies that cause the dashboard redirect loop.
-- Run this first in Supabase SQL Editor to restore dashboard loading.
-- Then run users-super-admin-rls.sql to add SECURITY DEFINER functions so Super Admin
-- can list/update users via RPC (no RLS on users table needed).

DROP POLICY IF EXISTS "Super admins can view all users" ON public.users;
DROP POLICY IF EXISTS "Super admins can update all users" ON public.users;
