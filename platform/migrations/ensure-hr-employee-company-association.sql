-- Ensure all HR and EMPLOYEE users are associated with a company
-- This migration helps identify and fix users without company associations

-- Step 1: Check which HR and EMPLOYEE users don't have a company_id
SELECT 
  u.id,
  u.email,
  u.role,
  u.company_id,
  CASE 
    WHEN u.company_id IS NULL THEN 'NEEDS_ASSIGNMENT'
    ELSE 'OK'
  END as status
FROM public.users u
WHERE u.role IN ('HR', 'EMPLOYEE')
ORDER BY u.role, u.email;

-- Step 2: For users without company_id, you can:
-- Option A: Assign them to a specific company (recommended)
-- UPDATE public.users 
-- SET company_id = 'YOUR_COMPANY_UUID_HERE'
-- WHERE id = 'USER_UUID_HERE' AND role IN ('HR', 'EMPLOYEE') AND company_id IS NULL;

-- Option B: Assign all unassociated HR/EMPLOYEE users to the first company (use with caution)
-- UPDATE public.users u
-- SET company_id = (SELECT id FROM public.companies ORDER BY created_at ASC LIMIT 1)
-- WHERE u.role IN ('HR', 'EMPLOYEE') 
-- AND u.company_id IS NULL
-- AND EXISTS (SELECT 1 FROM public.companies LIMIT 1);

-- Step 3: Add a constraint to ensure HR and EMPLOYEE always have a company_id (optional)
-- Note: SUPER_ADMIN and ADMIN might not always have company_id, so we won't enforce this globally
-- But we can add a check constraint for HR and EMPLOYEE roles

-- Add constraint: HR and EMPLOYEE must have company_id
DO $$
BEGIN
  -- Drop existing constraint if it exists
  IF EXISTS (
    SELECT 1 FROM pg_constraint 
    WHERE conname = 'users_hr_employee_company_check'
  ) THEN
    ALTER TABLE public.users DROP CONSTRAINT users_hr_employee_company_check;
  END IF;

  -- Add new constraint
  ALTER TABLE public.users
  ADD CONSTRAINT users_hr_employee_company_check
  CHECK (
    (role IN ('HR', 'EMPLOYEE') AND company_id IS NOT NULL) OR
    (role NOT IN ('HR', 'EMPLOYEE'))
  );
END $$;

-- Step 4: Verify the constraint
SELECT 
  conname as constraint_name,
  pg_get_constraintdef(oid) as constraint_definition
FROM pg_constraint
WHERE conname = 'users_hr_employee_company_check';
