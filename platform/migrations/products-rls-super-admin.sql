-- Products RLS: allow SUPER_ADMIN to insert/update/delete; others can only select by company.
-- Fixes "new row violates row-level security policy" when saving products.

-- Drop existing policy if it exists (name from supabase-schema)
DROP POLICY IF EXISTS "Users can view company products" ON public.products;

-- SELECT: SUPER_ADMIN sees all; others see products for their company or company_id IS NULL
CREATE POLICY "products_select" ON public.products
  FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.users u
      WHERE u.id = auth.uid()
      AND (
        u.role = 'SUPER_ADMIN'
        OR products.company_id = u.company_id
        OR products.company_id IS NULL
      )
    )
  );

-- INSERT: only SUPER_ADMIN
CREATE POLICY "products_insert_super_admin" ON public.products
  FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.users u
      WHERE u.id = auth.uid() AND u.role = 'SUPER_ADMIN'
    )
  );

-- UPDATE: only SUPER_ADMIN
CREATE POLICY "products_update_super_admin" ON public.products
  FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM public.users u
      WHERE u.id = auth.uid() AND u.role = 'SUPER_ADMIN'
    )
  );

-- DELETE: only SUPER_ADMIN
CREATE POLICY "products_delete_super_admin" ON public.products
  FOR DELETE
  USING (
    EXISTS (
      SELECT 1 FROM public.users u
      WHERE u.id = auth.uid() AND u.role = 'SUPER_ADMIN'
    )
  );
