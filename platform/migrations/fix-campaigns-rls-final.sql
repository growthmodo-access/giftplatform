-- Final fix for campaigns RLS policy
-- This handles NULL company_id values correctly

-- Drop all existing policies
DROP POLICY IF EXISTS "Users can view campaigns" ON campaigns;
DROP POLICY IF EXISTS "Users can view company campaigns" ON campaigns;
DROP POLICY IF EXISTS "campaigns_select_policy" ON campaigns;
DROP POLICY IF EXISTS "Users can create campaigns" ON campaigns;
DROP POLICY IF EXISTS "Authorized users can create campaigns" ON campaigns;
DROP POLICY IF EXISTS "campaigns_insert_policy" ON campaigns;
DROP POLICY IF EXISTS "Users can update campaigns" ON campaigns;
DROP POLICY IF EXISTS "Authorized users can update campaigns" ON campaigns;
DROP POLICY IF EXISTS "campaigns_update_policy" ON campaigns;
DROP POLICY IF EXISTS "Users can delete campaigns" ON campaigns;
DROP POLICY IF EXISTS "Admins can delete campaigns" ON campaigns;
DROP POLICY IF EXISTS "campaigns_delete_policy" ON campaigns;

-- SELECT: Users can view campaigns
CREATE POLICY "campaigns_select" ON campaigns
  FOR SELECT
  USING (
    -- SUPER_ADMIN sees all campaigns
    EXISTS (
      SELECT 1 FROM public.users
      WHERE id = auth.uid() AND role = 'SUPER_ADMIN'
    )
    OR
    -- Users see campaigns from their company
    (
      company_id IS NOT NULL
      AND company_id IN (
        SELECT company_id FROM public.users WHERE id = auth.uid()
      )
    )
    OR
    -- Authorized users can see campaigns with NULL company_id
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
-- This is the key fix - handles NULL company_id properly
CREATE POLICY "campaigns_insert" ON campaigns
  FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.users u
      WHERE u.id = auth.uid()
      AND u.role IN ('SUPER_ADMIN', 'ADMIN', 'HR', 'MANAGER')
      AND (
        -- SUPER_ADMIN can create with any company_id (including NULL)
        u.role = 'SUPER_ADMIN'
        OR
        -- For other roles: if campaign has company_id, it must match user's company_id
        -- If campaign company_id is NULL, check if user's company_id is also NULL or if user is authorized
        (
          campaigns.company_id IS NULL
          OR
          campaigns.company_id = u.company_id
        )
      )
    )
  );

-- UPDATE: Allow ADMIN, HR, MANAGER, SUPER_ADMIN to update campaigns
CREATE POLICY "campaigns_update" ON campaigns
  FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM public.users u
      WHERE u.id = auth.uid()
      AND u.role IN ('SUPER_ADMIN', 'ADMIN', 'HR', 'MANAGER')
      AND (
        u.role = 'SUPER_ADMIN'
        OR
        (
          campaigns.company_id IS NULL
          OR
          campaigns.company_id = u.company_id
        )
      )
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.users u
      WHERE u.id = auth.uid()
      AND u.role IN ('SUPER_ADMIN', 'ADMIN', 'HR', 'MANAGER')
      AND (
        u.role = 'SUPER_ADMIN'
        OR
        (
          campaigns.company_id IS NULL
          OR
          campaigns.company_id = u.company_id
        )
      )
    )
  );

-- DELETE: Only ADMIN and SUPER_ADMIN can delete
CREATE POLICY "campaigns_delete" ON campaigns
  FOR DELETE
  USING (
    EXISTS (
      SELECT 1 FROM public.users u
      WHERE u.id = auth.uid()
      AND u.role IN ('SUPER_ADMIN', 'ADMIN')
      AND (
        u.role = 'SUPER_ADMIN'
        OR
        (
          campaigns.company_id IS NULL
          OR
          campaigns.company_id = u.company_id
        )
      )
    )
  );
