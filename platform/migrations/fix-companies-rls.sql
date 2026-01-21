-- Fix RLS policies for companies table to allow creation
-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Users can view companies" ON companies;
DROP POLICY IF EXISTS "Users can create companies" ON companies;
DROP POLICY IF EXISTS "Users can update companies" ON companies;
DROP POLICY IF EXISTS "Users can delete companies" ON companies;

-- Allow SUPER_ADMIN and ADMIN to view all companies
CREATE POLICY "Admins can view companies" ON companies
  FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.users
      WHERE users.id = auth.uid()
      AND users.role IN ('SUPER_ADMIN', 'ADMIN')
    )
  );

-- Allow SUPER_ADMIN and ADMIN to create companies
CREATE POLICY "Admins can create companies" ON companies
  FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.users
      WHERE users.id = auth.uid()
      AND users.role IN ('SUPER_ADMIN', 'ADMIN')
    )
  );

-- Allow SUPER_ADMIN to update any company, ADMIN to update their own
CREATE POLICY "Admins can update companies" ON companies
  FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM public.users
      WHERE users.id = auth.uid()
      AND (
        users.role = 'SUPER_ADMIN'
        OR (users.role = 'ADMIN' AND users.company_id = companies.id)
      )
    )
  );

-- Allow SUPER_ADMIN to delete any company
CREATE POLICY "Super admins can delete companies" ON companies
  FOR DELETE
  USING (
    EXISTS (
      SELECT 1 FROM public.users
      WHERE users.id = auth.uid()
      AND users.role = 'SUPER_ADMIN'
    )
  );
