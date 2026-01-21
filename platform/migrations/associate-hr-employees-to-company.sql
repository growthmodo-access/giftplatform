-- Associate all HRs and Employees to companies
-- This migration ensures all HR and EMPLOYEE users have a company_id

-- First, let's see which users need company association
-- HR and EMPLOYEE users should be associated with a company

-- If a user doesn't have a company_id, we can:
-- 1. Assign them to the first available company (if any)
-- 2. Or leave them unassociated (they'll need manual assignment)

-- For now, we'll create a function to help with this
-- But manual assignment is recommended for accuracy

-- Check users without company
SELECT 
  id, 
  email, 
  role, 
  company_id 
FROM public.users 
WHERE role IN ('HR', 'EMPLOYEE') 
AND company_id IS NULL;

-- To manually assign:
-- UPDATE public.users 
-- SET company_id = 'company-uuid-here'
-- WHERE id = 'user-uuid-here';

-- Note: This migration is informational
-- Actual assignment should be done manually or via the admin interface
-- to ensure users are assigned to the correct company
