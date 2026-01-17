-- Update user role to ADMIN by email
-- Run this in Supabase SQL Editor

UPDATE public.users
SET 
  role = 'ADMIN',
  updated_at = NOW()
WHERE email = 'kunal@growthmodo.com';

-- Verify the update
SELECT id, email, name, role, company_id, created_at, updated_at
FROM public.users
WHERE email = 'kunal@growthmodo.com';
