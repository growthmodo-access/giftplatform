-- Ensure all HR and EMPLOYEE users are associated with a company
-- This migration fixes users without company associations before adding a constraint

-- Step 1: Check which HR and EMPLOYEE users don't have a company_id
DO $$
DECLARE
  unassociated_count INTEGER;
  first_company_id UUID;
BEGIN
  -- Count unassociated HR/EMPLOYEE users
  SELECT COUNT(*) INTO unassociated_count
  FROM public.users
  WHERE role IN ('HR', 'EMPLOYEE') AND company_id IS NULL;

  -- If there are unassociated users, try to assign them to a company
  IF unassociated_count > 0 THEN
    -- Get the first available company
    SELECT id INTO first_company_id
    FROM public.companies
    ORDER BY created_at ASC
    LIMIT 1;

    -- If a company exists, assign unassociated users to it
    IF first_company_id IS NOT NULL THEN
      UPDATE public.users
      SET company_id = first_company_id
      WHERE role IN ('HR', 'EMPLOYEE') 
      AND company_id IS NULL;
      
      RAISE NOTICE 'Assigned % HR/EMPLOYEE users to company %', unassociated_count, first_company_id;
    ELSE
      RAISE WARNING 'No companies found. Cannot assign HR/EMPLOYEE users. Please create a company first.';
      -- Don't add constraint if we can't assign users
      RETURN;
    END IF;
  END IF;

  -- Step 2: Drop existing constraint if it exists
  IF EXISTS (
    SELECT 1 FROM pg_constraint 
    WHERE conname = 'users_hr_employee_company_check'
  ) THEN
    ALTER TABLE public.users DROP CONSTRAINT users_hr_employee_company_check;
  END IF;

  -- Step 3: Verify all HR/EMPLOYEE users now have company_id before adding constraint
  SELECT COUNT(*) INTO unassociated_count
  FROM public.users
  WHERE role IN ('HR', 'EMPLOYEE') AND company_id IS NULL;

  IF unassociated_count > 0 THEN
    RAISE EXCEPTION 'Cannot add constraint: % HR/EMPLOYEE users still lack company_id. Please assign them manually first.', unassociated_count;
  END IF;

  -- Step 4: Add constraint: HR and EMPLOYEE must have company_id
  ALTER TABLE public.users
  ADD CONSTRAINT users_hr_employee_company_check
  CHECK (
    (role IN ('HR', 'EMPLOYEE') AND company_id IS NOT NULL) OR
    (role NOT IN ('HR', 'EMPLOYEE'))
  );

  RAISE NOTICE 'Successfully added constraint: HR and EMPLOYEE users must have company_id';
END $$;

-- Step 5: Verify the constraint was added
SELECT 
  conname as constraint_name,
  pg_get_constraintdef(oid) as constraint_definition
FROM pg_constraint
WHERE conname = 'users_hr_employee_company_check';

-- Step 6: Show current status of HR/EMPLOYEE users
SELECT 
  u.id,
  u.email,
  u.role,
  u.company_id,
  c.name as company_name,
  CASE 
    WHEN u.company_id IS NULL THEN 'MISSING - CONSTRAINT VIOLATION'
    ELSE 'OK'
  END as status
FROM public.users u
LEFT JOIN public.companies c ON c.id = u.company_id
WHERE u.role IN ('HR', 'EMPLOYEE')
ORDER BY u.role, u.email;
