-- Orders RLS: allow INSERT/UPDATE/DELETE for SUPER_ADMIN and HR (for their company).
-- Fixes "new row violates row-level security policy" when adding a new order.
-- Run in Supabase SQL Editor.

DROP POLICY IF EXISTS "orders_insert" ON public.orders;
DROP POLICY IF EXISTS "orders_update" ON public.orders;
DROP POLICY IF EXISTS "orders_delete" ON public.orders;
DROP POLICY IF EXISTS "order_items_select" ON public.order_items;
DROP POLICY IF EXISTS "order_items_insert" ON public.order_items;
DROP POLICY IF EXISTS "order_items_update" ON public.order_items;
DROP POLICY IF EXISTS "order_items_delete" ON public.order_items;

-- INSERT: SUPER_ADMIN any; HR/ADMIN for their company; EMPLOYEE for their company (e.g. store checkout)
CREATE POLICY "orders_insert" ON public.orders
  FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.users u
      WHERE u.id = auth.uid()
      AND (
        u.role = 'SUPER_ADMIN'
        OR (u.role IN ('ADMIN', 'HR') AND u.company_id = orders.company_id)
        OR (u.company_id = orders.company_id)
      )
    )
  );

-- UPDATE: SUPER_ADMIN can update any; HR can update orders of their company
CREATE POLICY "orders_update" ON public.orders
  FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM public.users u
      WHERE u.id = auth.uid()
      AND (
        u.role = 'SUPER_ADMIN'
        OR (u.role IN ('ADMIN', 'HR') AND u.company_id = orders.company_id)
      )
    )
  );

-- DELETE: same as update (e.g. rollback on order_items failure, or cancel order)
CREATE POLICY "orders_delete" ON public.orders
  FOR DELETE
  USING (
    EXISTS (
      SELECT 1 FROM public.users u
      WHERE u.id = auth.uid()
      AND (
        u.role = 'SUPER_ADMIN'
        OR (u.role IN ('ADMIN', 'HR') AND u.company_id = orders.company_id)
      )
    )
  );

-- order_items: allow INSERT/UPDATE/DELETE when the order is in scope (same as orders)
CREATE POLICY "order_items_select" ON public.order_items
  FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.orders o
      JOIN public.users u ON u.id = auth.uid()
      WHERE o.id = order_items.order_id
      AND (u.role = 'SUPER_ADMIN' OR o.company_id = u.company_id OR o.user_id = u.id)
    )
  );

CREATE POLICY "order_items_insert" ON public.order_items
  FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.orders o
      JOIN public.users u ON u.id = auth.uid()
      WHERE o.id = order_items.order_id
      AND (u.role = 'SUPER_ADMIN' OR o.company_id = u.company_id)
    )
  );

CREATE POLICY "order_items_update" ON public.order_items
  FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM public.orders o
      JOIN public.users u ON u.id = auth.uid()
      WHERE o.id = order_items.order_id
      AND (u.role = 'SUPER_ADMIN' OR o.company_id = u.company_id)
    )
  );

CREATE POLICY "order_items_delete" ON public.order_items
  FOR DELETE
  USING (
    EXISTS (
      SELECT 1 FROM public.orders o
      JOIN public.users u ON u.id = auth.uid()
      WHERE o.id = order_items.order_id
      AND (u.role = 'SUPER_ADMIN' OR o.company_id = u.company_id)
    )
  );
