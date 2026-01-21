-- Simplified and more permissive RLS policy for campaigns
-- This should fix the "new row violates row-level security policy" error

-- Drop all existing policies
DROP POLICY IF EXISTS "Users can view campaigns" ON campaigns;
DROP POLICY IF EXISTS "Users can view company campaigns" ON campaigns;
DROP POLICY IF EXISTS "Users can create campaigns" ON campaigns;
DROP POLICY IF EXISTS "Authorized users can create campaigns" ON campaigns;
DROP POLICY IF EXISTS "Users can update campaigns" ON campaigns;
DROP POLICY IF EXISTS "Authorized users can update campaigns" ON campaigns;
DROP POLICY IF EXISTS "Users can delete campaigns" ON campaigns;
DROP POLICY IF EXISTS "Admins can delete campaigns" ON campaigns;

-- SELECT: Users can view campaigns from their company or if SUPER_ADMIN
CREATE POLICY "campaigns_select_policy" ON campaigns
  FOR SELECT
  USING (
    -- SUPER_ADMIN sees all
    EXISTS (
      SELECT 1 FROM public.users
      WHERE id = auth.uid() AND role = 'SUPER_ADMIN'
    )
    OR
    -- Others see their company's campaigns
    company_id IN (
      SELECT company_id FROM public.users WHERE id = auth.uid()
    )
    OR
    -- Or campaigns with no company (if user is authorized)
    (
      company_id IS NULL
      AND EXISTS (
        SELECT 1 FROM public.users
        WHERE id = auth.uid()
        AND role IN ('SUPER_ADMIN', 'ADMIN', 'HR', 'MANAGER')
      )
    )
  );

-- INSERT: Allow ADMIN, HR, MANAGER, SUPER_ADMIN to create campaigns
-- More permissive - allows creation if user has the right role
CREATE POLICY "campaigns_insert_policy" ON campaigns
  FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.users
      WHERE id = auth.uid()
      AND role IN ('SUPER_ADMIN', 'ADMIN', 'HR', 'MANAGER')
      AND (
        -- SUPER_ADMIN can create with any company_id
        role = 'SUPER_ADMIN'
        OR
        -- Others: if campaign has company_id, it must match user's company_id
        -- If campaign company_id is NULL, allow if user company_id is also NULL or if user is authorized
        (
          campaigns.company_id IS NULL
          OR
          campaigns.company_id = (
            SELECT company_id FROM public.users WHERE id = auth.uid()
          )
        )
      )
    )
  );

-- UPDATE: Allow ADMIN, HR, MANAGER, SUPER_ADMIN to update campaigns
CREATE POLICY "campaigns_update_policy" ON campaigns
  FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM public.users
      WHERE id = auth.uid()
      AND role IN ('SUPER_ADMIN', 'ADMIN', 'HR', 'MANAGER')
      AND (
        role = 'SUPER_ADMIN'
        OR
        (
          campaigns.company_id IS NULL
          OR
          campaigns.company_id = (
            SELECT company_id FROM public.users WHERE id = auth.uid()
          )
        )
      )
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.users
      WHERE id = auth.uid()
      AND role IN ('SUPER_ADMIN', 'ADMIN', 'HR', 'MANAGER')
      AND (
        role = 'SUPER_ADMIN'
        OR
        (
          campaigns.company_id IS NULL
          OR
          campaigns.company_id = (
            SELECT company_id FROM public.users WHERE id = auth.uid()
          )
        )
      )
    )
  );

-- DELETE: Only ADMIN and SUPER_ADMIN can delete
CREATE POLICY "campaigns_delete_policy" ON campaigns
  FOR DELETE
  USING (
    EXISTS (
      SELECT 1 FROM public.users
      WHERE id = auth.uid()
      AND role IN ('SUPER_ADMIN', 'ADMIN')
      AND (
        role = 'SUPER_ADMIN'
        OR
        (
          campaigns.company_id IS NULL
          OR
          campaigns.company_id = (
            SELECT company_id FROM public.users WHERE id = auth.uid()
          )
        )
      )
    )
  );
