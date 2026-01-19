-- Add teams feature for grouping employees
-- Teams can be used to send campaigns to specific groups

-- Create teams table
CREATE TABLE IF NOT EXISTS teams (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  description TEXT,
  company_id UUID REFERENCES companies(id) ON DELETE CASCADE NOT NULL,
  created_by UUID REFERENCES public.users(id) ON DELETE SET NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create team_members junction table
CREATE TABLE IF NOT EXISTS team_members (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  team_id UUID REFERENCES teams(id) ON DELETE CASCADE NOT NULL,
  user_id UUID REFERENCES public.users(id) ON DELETE CASCADE NOT NULL,
  role TEXT DEFAULT 'MEMBER' CHECK (role IN ('LEAD', 'MEMBER')),
  added_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(team_id, user_id)
);

-- Add team_id to campaigns table for team-specific campaigns
ALTER TABLE campaigns
ADD COLUMN IF NOT EXISTS team_id UUID REFERENCES teams(id) ON DELETE SET NULL;

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_teams_company_id ON teams(company_id);
CREATE INDEX IF NOT EXISTS idx_teams_created_by ON teams(created_by);
CREATE INDEX IF NOT EXISTS idx_team_members_team_id ON team_members(team_id);
CREATE INDEX IF NOT EXISTS idx_team_members_user_id ON team_members(user_id);
CREATE INDEX IF NOT EXISTS idx_campaigns_team_id ON campaigns(team_id);

-- Enable RLS
ALTER TABLE teams ENABLE ROW LEVEL SECURITY;
ALTER TABLE team_members ENABLE ROW LEVEL SECURITY;

-- RLS Policies for teams
-- Users can view teams from their company
CREATE POLICY "Users can view company teams" ON teams
  FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.users
      WHERE users.id = auth.uid()
      AND (
        users.role = 'SUPER_ADMIN'
        OR teams.company_id = users.company_id
      )
    )
  );

-- ADMIN, HR, SUPER_ADMIN can create teams
CREATE POLICY "Authorized users can create teams" ON teams
  FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.users
      WHERE users.id = auth.uid()
      AND users.role IN ('SUPER_ADMIN', 'ADMIN', 'HR')
      AND (
        users.role = 'SUPER_ADMIN'
        OR teams.company_id = users.company_id
      )
    )
  );

-- ADMIN, HR, SUPER_ADMIN can update teams
CREATE POLICY "Authorized users can update teams" ON teams
  FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM public.users
      WHERE users.id = auth.uid()
      AND users.role IN ('SUPER_ADMIN', 'ADMIN', 'HR')
      AND (
        users.role = 'SUPER_ADMIN'
        OR teams.company_id = (
          SELECT company_id FROM public.users WHERE id = auth.uid()
        )
      )
    )
  );

-- ADMIN, SUPER_ADMIN can delete teams
CREATE POLICY "Admins can delete teams" ON teams
  FOR DELETE
  USING (
    EXISTS (
      SELECT 1 FROM public.users
      WHERE users.id = auth.uid()
      AND users.role IN ('SUPER_ADMIN', 'ADMIN')
      AND (
        users.role = 'SUPER_ADMIN'
        OR teams.company_id = (
          SELECT company_id FROM public.users WHERE id = auth.uid()
        )
      )
    )
  );

-- RLS Policies for team_members
-- Users can view team members from their company's teams
CREATE POLICY "Users can view team members" ON team_members
  FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM teams t
      JOIN public.users u ON u.id = auth.uid()
      WHERE t.id = team_members.team_id
      AND (
        u.role = 'SUPER_ADMIN'
        OR t.company_id = u.company_id
      )
    )
  );

-- ADMIN, HR, SUPER_ADMIN can add team members
CREATE POLICY "Authorized users can add team members" ON team_members
  FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM teams t
      JOIN public.users u ON u.id = auth.uid()
      WHERE t.id = team_members.team_id
      AND u.role IN ('SUPER_ADMIN', 'ADMIN', 'HR')
      AND (
        u.role = 'SUPER_ADMIN'
        OR t.company_id = u.company_id
      )
    )
  );

-- ADMIN, HR, SUPER_ADMIN can remove team members
CREATE POLICY "Authorized users can remove team members" ON team_members
  FOR DELETE
  USING (
    EXISTS (
      SELECT 1 FROM teams t
      JOIN public.users u ON u.id = auth.uid()
      WHERE t.id = team_members.team_id
      AND u.role IN ('SUPER_ADMIN', 'ADMIN', 'HR')
      AND (
        u.role = 'SUPER_ADMIN'
        OR t.company_id = u.company_id
      )
    )
  );

COMMENT ON TABLE teams IS 'Teams for grouping employees within a company';
COMMENT ON TABLE team_members IS 'Junction table linking employees to teams';
COMMENT ON COLUMN campaigns.team_id IS 'If set, campaign is sent only to this team';
