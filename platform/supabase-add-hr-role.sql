-- Add HR role to the users table
-- Run this in Supabase SQL Editor

-- First, drop the existing constraint
ALTER TABLE public.users DROP CONSTRAINT IF EXISTS users_role_check;

-- Add the new constraint with HR role included
ALTER TABLE public.users 
ADD CONSTRAINT users_role_check 
CHECK (role IN ('SUPER_ADMIN', 'ADMIN', 'HR', 'MANAGER', 'EMPLOYEE'));

-- Verify the update
SELECT column_name, data_type, check_clause 
FROM information_schema.check_constraints 
WHERE constraint_name = 'users_role_check';
