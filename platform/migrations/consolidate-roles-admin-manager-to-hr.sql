-- Consolidate roles: ADMIN and MANAGER become HR (3 roles: SUPER_ADMIN, HR, EMPLOYEE)
-- Run this after deploying the app changes that use the 3-role model.
-- Constraint users_hr_employee_company_check requires HR/EMPLOYEE to have company_id NOT NULL.

-- Step 1: Assign ADMIN/MANAGER with null company_id to the first company (so we can set role = HR)
UPDATE users u
SET company_id = (SELECT id FROM companies ORDER BY created_at ASC LIMIT 1),
    updated_at = now()
WHERE u.role IN ('ADMIN', 'MANAGER')
  AND u.company_id IS NULL
  AND EXISTS (SELECT 1 FROM companies LIMIT 1);

-- Step 2: Set role = 'HR' only where company_id is set (constraint requires HR to have company_id)
UPDATE users
SET role = 'HR', updated_at = now()
WHERE role IN ('ADMIN', 'MANAGER')
  AND company_id IS NOT NULL;

-- If any ADMIN/MANAGER still have null company_id (e.g. no companies in DB), leave them as-is;
-- the app still treats them as Company HR via toAppRole(). After assigning a company, run:
--   UPDATE users SET role = 'HR', updated_at = now() WHERE role IN ('ADMIN', 'MANAGER') AND company_id IS NOT NULL;
