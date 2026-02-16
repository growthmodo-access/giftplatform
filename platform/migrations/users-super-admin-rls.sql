-- Allow SUPER_ADMIN to list and update all users via a SECURITY DEFINER function
-- so we avoid RLS policies that reference public.users (which can cause redirect loops).
-- Run this in Supabase SQL Editor after dashboard is working.

-- 1) Function: list all users with company name (only callable by SUPER_ADMIN)
CREATE OR REPLACE FUNCTION public.get_all_users_for_super_admin(requestor_id UUID)
RETURNS TABLE (
  id uuid,
  email text,
  name text,
  role text,
  avatar text,
  company_id uuid,
  created_at timestamptz,
  company_name text
)
LANGUAGE sql
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT u.id, u.email, u.name, u.role, u.avatar, u.company_id, u.created_at, COALESCE(c.name, 'No Company')
  FROM public.users u
  LEFT JOIN public.companies c ON c.id = u.company_id
  WHERE EXISTS (
    SELECT 1 FROM public.users me
    WHERE me.id = requestor_id AND me.role = 'SUPER_ADMIN'
  )
  ORDER BY u.created_at DESC;
$$;

-- 2) Function: update user role (only by SUPER_ADMIN)
CREATE OR REPLACE FUNCTION public.update_user_role_as_super_admin(
  requestor_id UUID,
  target_user_id UUID,
  new_role TEXT
)
RETURNS VOID
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM public.users WHERE id = requestor_id AND role = 'SUPER_ADMIN') THEN
    RAISE EXCEPTION 'Unauthorized';
  END IF;
  UPDATE public.users SET role = new_role, updated_at = now() WHERE id = target_user_id;
END;
$$;

-- Grant execute to authenticated users (function checks SUPER_ADMIN inside)
GRANT EXECUTE ON FUNCTION public.get_all_users_for_super_admin(UUID) TO authenticated;
GRANT EXECUTE ON FUNCTION public.update_user_role_as_super_admin(UUID, UUID, TEXT) TO authenticated;
