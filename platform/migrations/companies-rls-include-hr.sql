-- Companies RLS: include HR role (after consolidating ADMIN/MANAGER to HR).
-- Without this, Company HR gets "No companies available" in Add Employee because
-- SELECT on companies was only allowed for SUPER_ADMIN and ADMIN.

DROP POLICY IF EXISTS "Admins can view companies" ON public.companies;
CREATE POLICY "Admins can view companies" ON public.companies
  FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.users u
      WHERE u.id = auth.uid()
      AND u.role IN ('SUPER_ADMIN', 'ADMIN', 'HR')
    )
  );

DROP POLICY IF EXISTS "Admins can create companies" ON public.companies;
CREATE POLICY "Admins can create companies" ON public.companies
  FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.users u
      WHERE u.id = auth.uid()
      AND u.role IN ('SUPER_ADMIN', 'ADMIN', 'HR')
    )
  );

DROP POLICY IF EXISTS "Admins can update companies" ON public.companies;
CREATE POLICY "Admins can update companies" ON public.companies
  FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM public.users u
      WHERE u.id = auth.uid()
      AND (
        u.role = 'SUPER_ADMIN'
        OR ((u.role IN ('ADMIN', 'HR')) AND u.company_id = companies.id)
      )
    )
  );
