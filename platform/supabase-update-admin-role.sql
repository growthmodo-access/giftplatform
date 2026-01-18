-- Update user role to ADMIN by email
-- Run this in Supabase SQL Editor

-- Option 1: Set to ADMIN
UPDATE public.users
SET 
  role = 'ADMIN',
  updated_at = NOW()
WHERE email = 'kunal@growthmodo.com';

-- Option 2: Set to SUPER_ADMIN (uncomment to use)
-- UPDATE public.users
-- SET 
--   role = 'SUPER_ADMIN',
--   updated_at = NOW()
-- WHERE email = 'kunal@growthmodo.com';

-- Verify the update
SELECT id, email, name, role, company_id, created_at, updated_at
FROM public.users
WHERE email = 'kunal@growthmodo.com';
