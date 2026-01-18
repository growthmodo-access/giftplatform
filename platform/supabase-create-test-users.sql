-- Create Test Users for All Roles
-- This script creates test users for SUPER_ADMIN, ADMIN, HR, MANAGER, and EMPLOYEE roles
-- 
-- IMPORTANT: Run this in Supabase SQL Editor
-- After running, you'll need to set passwords for these users via Supabase Auth dashboard
-- or use the password reset flow

-- Step 1: Create a test company (if it doesn't exist)
INSERT INTO companies (id, name, domain, budget)
VALUES (
  '00000000-0000-0000-0000-000000000001',
  'Test Company',
  'testcompany.com',
  100000.00
)
ON CONFLICT (id) DO NOTHING;

-- Step 2: Create auth users and profiles
-- Note: You'll need to create auth users via Supabase Dashboard → Authentication → Users
-- Or use the Supabase Admin API to create users with passwords
-- 
-- For now, this script creates the user profiles. You'll need to:
-- 1. Create auth users in Supabase Dashboard with these emails
-- 2. Set temporary passwords
-- 3. Run this script to create the profiles

-- SUPER_ADMIN User
-- Email: superadmin@test.com
-- Password: (set in Supabase Auth dashboard)
INSERT INTO public.users (id, email, name, role, company_id)
SELECT 
  id,
  'superadmin@test.com',
  'Super Admin User',
  'SUPER_ADMIN',
  '00000000-0000-0000-0000-000000000001'
FROM auth.users
WHERE email = 'superadmin@test.com'
ON CONFLICT (id) DO UPDATE SET
  role = 'SUPER_ADMIN',
  name = 'Super Admin User',
  company_id = '00000000-0000-0000-0000-000000000001';

-- ADMIN User
-- Email: admin@test.com
-- Password: (set in Supabase Auth dashboard)
INSERT INTO public.users (id, email, name, role, company_id)
SELECT 
  id,
  'admin@test.com',
  'Admin User',
  'ADMIN',
  '00000000-0000-0000-0000-000000000001'
FROM auth.users
WHERE email = 'admin@test.com'
ON CONFLICT (id) DO UPDATE SET
  role = 'ADMIN',
  name = 'Admin User',
  company_id = '00000000-0000-0000-0000-000000000001';

-- HR User
-- Email: hr@test.com
-- Password: (set in Supabase Auth dashboard)
INSERT INTO public.users (id, email, name, role, company_id)
SELECT 
  id,
  'hr@test.com',
  'HR User',
  'HR',
  '00000000-0000-0000-0000-000000000001'
FROM auth.users
WHERE email = 'hr@test.com'
ON CONFLICT (id) DO UPDATE SET
  role = 'HR',
  name = 'HR User',
  company_id = '00000000-0000-0000-0000-000000000001';

-- MANAGER User
-- Email: manager@test.com
-- Password: (set in Supabase Auth dashboard)
INSERT INTO public.users (id, email, name, role, company_id)
SELECT 
  id,
  'manager@test.com',
  'Manager User',
  'MANAGER',
  '00000000-0000-0000-0000-000000000001'
FROM auth.users
WHERE email = 'manager@test.com'
ON CONFLICT (id) DO UPDATE SET
  role = 'MANAGER',
  name = 'Manager User',
  company_id = '00000000-0000-0000-0000-000000000001';

-- EMPLOYEE User
-- Email: employee@test.com
-- Password: (set in Supabase Auth dashboard)
INSERT INTO public.users (id, email, name, role, company_id)
SELECT 
  id,
  'employee@test.com',
  'Employee User',
  'EMPLOYEE',
  '00000000-0000-0000-0000-000000000001'
FROM auth.users
WHERE email = 'employee@test.com'
ON CONFLICT (id) DO UPDATE SET
  role = 'EMPLOYEE',
  name = 'Employee User',
  company_id = '00000000-0000-0000-0000-000000000001';

-- Verify users were created
SELECT 
  u.id,
  u.email,
  u.name,
  u.role,
  u.company_id,
  c.name as company_name,
  CASE 
    WHEN au.id IS NOT NULL THEN 'Auth user exists'
    ELSE 'Auth user missing - create in Supabase Dashboard'
  END as auth_status
FROM public.users u
LEFT JOIN companies c ON u.company_id = c.id
LEFT JOIN auth.users au ON u.id = au.id
WHERE u.email IN (
  'superadmin@test.com',
  'admin@test.com',
  'hr@test.com',
  'manager@test.com',
  'employee@test.com'
)
ORDER BY 
  CASE u.role
    WHEN 'SUPER_ADMIN' THEN 1
    WHEN 'ADMIN' THEN 2
    WHEN 'HR' THEN 3
    WHEN 'MANAGER' THEN 4
    WHEN 'EMPLOYEE' THEN 5
  END;
