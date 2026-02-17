-- Orders SELECT: allow SUPER_ADMIN to see all orders (fixes admin not seeing orders).
-- Existing "Users can view company orders" and "Users can view own orders" stay for HR/employee.
-- Run in Supabase SQL Editor.

DROP POLICY IF EXISTS "orders_select_super_admin" ON public.orders;
CREATE POLICY "orders_select_super_admin" ON public.orders
  FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.users u
      WHERE u.id = auth.uid() AND u.role = 'SUPER_ADMIN'
    )
  );
