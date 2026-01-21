-- Enhance campaigns table for PerkUp-style gift campaigns
-- Run this in Supabase SQL Editor

-- Add new columns to campaigns table
ALTER TABLE campaigns 
ADD COLUMN IF NOT EXISTS campaign_type TEXT DEFAULT 'AUTOMATED' CHECK (campaign_type IN ('AUTOMATED', 'MANUAL', 'SCHEDULED')),
ADD COLUMN IF NOT EXISTS recipient_type TEXT DEFAULT 'ALL' CHECK (recipient_type IN ('ALL', 'SELECTED', 'TEAM', 'DEPARTMENT')),
ADD COLUMN IF NOT EXISTS recipient_ids JSONB DEFAULT '[]'::jsonb,
ADD COLUMN IF NOT EXISTS gift_type TEXT DEFAULT 'SINGLE' CHECK (gift_type IN ('SINGLE', 'CATALOG', 'BUDGET')),
ADD COLUMN IF NOT EXISTS selected_products JSONB DEFAULT '[]'::jsonb,
ADD COLUMN IF NOT EXISTS per_recipient_budget DECIMAL(10, 2),
ADD COLUMN IF NOT EXISTS scheduled_date TIMESTAMP WITH TIME ZONE,
ADD COLUMN IF NOT EXISTS custom_message TEXT,
ADD COLUMN IF NOT EXISTS description TEXT,
ADD COLUMN IF NOT EXISTS status TEXT DEFAULT 'DRAFT' CHECK (status IN ('DRAFT', 'SCHEDULED', 'SENT', 'CANCELLED'));

-- Add campaign_id to gifts table to track which campaign sent the gift
ALTER TABLE gifts 
ADD COLUMN IF NOT EXISTS campaign_id UUID REFERENCES campaigns(id) ON DELETE SET NULL,
ADD COLUMN IF NOT EXISTS budget DECIMAL(10, 2);

-- Create index for better query performance
CREATE INDEX IF NOT EXISTS idx_gifts_campaign_id ON gifts(campaign_id);
CREATE INDEX IF NOT EXISTS idx_campaigns_status ON campaigns(status);
CREATE INDEX IF NOT EXISTS idx_campaigns_scheduled_date ON campaigns(scheduled_date);
