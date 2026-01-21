-- Create Super Admin User
-- This script helps you create a SUPER_ADMIN user
-- 
-- OPTION 1: If you already have a user account (created via signup)
-- Replace 'your-email@example.com' with your actual email and run:

UPDATE public.users
SET 
  role = 'SUPER_ADMIN',
  updated_at = NOW()
WHERE email = 'your-email@example.com';

-- Verify the update
SELECT id, email, name, role, company_id, created_at, updated_at
FROM public.users
WHERE email = 'your-email@example.com';

-- OPTION 2: Create Super Admin from existing user by user ID
-- First, find your user ID from auth.users or public.users, then:

-- UPDATE public.users
-- SET 
--   role = 'SUPER_ADMIN',
--   updated_at = NOW()
-- WHERE id = 'your-user-id-here';

-- OPTION 3: Create a new company and assign SUPER_ADMIN
-- This creates a company and assigns the user as SUPER_ADMIN

-- Step 1: Create a company (if needed)
-- INSERT INTO companies (name, domain, budget)
-- VALUES ('Your Company Name', 'yourcompany.com', 10000.00)
-- RETURNING id;

-- Step 2: Update user to SUPER_ADMIN and assign to company
-- Replace 'your-email@example.com' and 'company-id-from-step-1' with actual values:
-- UPDATE public.users
-- SET 
--   role = 'SUPER_ADMIN',
--   company_id = 'company-id-from-step-1',
--   updated_at = NOW()
-- WHERE email = 'your-email@example.com';

-- Quick setup for kunal@growthmodo.com as SUPER_ADMIN:
UPDATE public.users
SET 
  role = 'SUPER_ADMIN',
  updated_at = NOW()
WHERE email = 'kunal@growthmodo.com';

-- Verify
SELECT id, email, name, role, company_id, created_at, updated_at
FROM public.users
WHERE email = 'kunal@growthmodo.com';
