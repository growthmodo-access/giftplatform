-- Consolidate roles: ADMIN and MANAGER become HR (3 roles: SUPER_ADMIN, HR, EMPLOYEE)
-- Run this after deploying the app changes that use the 3-role model.

UPDATE users
SET role = 'HR', updated_at = now()
WHERE role IN ('ADMIN', 'MANAGER');

-- Optional: add a check constraint so only the 3 roles can be stored (uncomment if desired)
-- ALTER TABLE users DROP CONSTRAINT IF EXISTS users_role_check;
-- ALTER TABLE users ADD CONSTRAINT users_role_check CHECK (role IN ('SUPER_ADMIN', 'HR', 'EMPLOYEE'));
