-- Fix RLS policies for campaigns table - improved version
-- This handles edge cases better, especially for users without company_id

-- Drop existing policies
DROP POLICY IF EXISTS "Users can view campaigns" ON campaigns;
DROP POLICY IF EXISTS "Users can view company campaigns" ON campaigns;
DROP POLICY IF EXISTS "Users can create campaigns" ON campaigns;
DROP POLICY IF EXISTS "Authorized users can create campaigns" ON campaigns;
DROP POLICY IF EXISTS "Users can update campaigns" ON campaigns;
DROP POLICY IF EXISTS "Authorized users can update campaigns" ON campaigns;
DROP POLICY IF EXISTS "Users can delete campaigns" ON campaigns;
DROP POLICY IF EXISTS "Admins can delete campaigns" ON campaigns;

-- Allow users to view campaigns from their company or if they're SUPER_ADMIN
CREATE POLICY "Users can view company campaigns" ON campaigns
  FOR SELECT
  USING (
    -- SUPER_ADMIN can see all campaigns
    EXISTS (
      SELECT 1 FROM public.users
      WHERE users.id = auth.uid()
      AND users.role = 'SUPER_ADMIN'
    )
    OR
    -- Users can see campaigns from their company
    (
      company_id IS NOT NULL
      AND company_id IN (
        SELECT company_id FROM public.users WHERE id = auth.uid()
      )
    )
    OR
    -- Users can see campaigns with NULL company_id if they're ADMIN/HR/MANAGER
    (
      company_id IS NULL
      AND EXISTS (
        SELECT 1 FROM public.users
        WHERE users.id = auth.uid()
        AND users.role IN ('SUPER_ADMIN', 'ADMIN', 'HR', 'MANAGER')
      )
    )
  );

-- Allow ADMIN, HR, MANAGER, and SUPER_ADMIN to create campaigns
-- This policy is more permissive to handle edge cases
CREATE POLICY "Authorized users can create campaigns" ON campaigns
  FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.users
      WHERE users.id = auth.uid()
      AND users.role IN ('SUPER_ADMIN', 'ADMIN', 'HR', 'MANAGER')
      AND (
        -- SUPER_ADMIN can create campaigns with any company_id (including NULL)
        users.role = 'SUPER_ADMIN'
        OR
        -- Other roles: campaign company_id must match user's company_id, or both can be NULL
        (
          (campaigns.company_id IS NULL AND users.company_id IS NULL)
          OR
          (campaigns.company_id IS NOT NULL AND campaigns.company_id = users.company_id)
        )
      )
    )
  );

-- Allow ADMIN, HR, MANAGER, and SUPER_ADMIN to update campaigns
CREATE POLICY "Authorized users can update campaigns" ON campaigns
  FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM public.users
      WHERE users.id = auth.uid()
      AND users.role IN ('SUPER_ADMIN', 'ADMIN', 'HR', 'MANAGER')
      AND (
        users.role = 'SUPER_ADMIN'
        OR (
          (campaigns.company_id IS NULL AND users.company_id IS NULL)
          OR
          (campaigns.company_id IS NOT NULL AND campaigns.company_id = users.company_id)
        )
      )
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.users
      WHERE users.id = auth.uid()
      AND users.role IN ('SUPER_ADMIN', 'ADMIN', 'HR', 'MANAGER')
      AND (
        users.role = 'SUPER_ADMIN'
        OR (
          (campaigns.company_id IS NULL AND users.company_id IS NULL)
          OR
          (campaigns.company_id IS NOT NULL AND campaigns.company_id = users.company_id)
        )
      )
    )
  );

-- Allow ADMIN and SUPER_ADMIN to delete campaigns
CREATE POLICY "Admins can delete campaigns" ON campaigns
  FOR DELETE
  USING (
    EXISTS (
      SELECT 1 FROM public.users
      WHERE users.id = auth.uid()
      AND users.role IN ('SUPER_ADMIN', 'ADMIN')
      AND (
        users.role = 'SUPER_ADMIN'
        OR (
          (campaigns.company_id IS NULL AND users.company_id IS NULL)
          OR
          (campaigns.company_id IS NOT NULL AND campaigns.company_id = users.company_id)
        )
      )
    )
  );
