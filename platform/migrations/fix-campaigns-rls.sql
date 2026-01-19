-- Fix RLS policies for campaigns table to allow creation
-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Users can view campaigns" ON campaigns;
DROP POLICY IF EXISTS "Users can create campaigns" ON campaigns;
DROP POLICY IF EXISTS "Users can update campaigns" ON campaigns;
DROP POLICY IF EXISTS "Users can delete campaigns" ON campaigns;

-- Allow users to view campaigns from their company
CREATE POLICY "Users can view company campaigns" ON campaigns
  FOR SELECT
  USING (
    company_id IN (
      SELECT company_id FROM public.users WHERE id = auth.uid()
    )
    OR company_id IS NULL
    OR EXISTS (
      SELECT 1 FROM public.users
      WHERE users.id = auth.uid()
      AND users.role = 'SUPER_ADMIN'
    )
  );

-- Allow ADMIN, HR, MANAGER, and SUPER_ADMIN to create campaigns
CREATE POLICY "Authorized users can create campaigns" ON campaigns
  FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.users
      WHERE users.id = auth.uid()
      AND users.role IN ('SUPER_ADMIN', 'ADMIN', 'HR', 'MANAGER')
      AND (
        users.role = 'SUPER_ADMIN'
        OR (campaigns.company_id = users.company_id)
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
        OR (campaigns.company_id = users.company_id)
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
        OR (campaigns.company_id = users.company_id)
      )
    )
  );
