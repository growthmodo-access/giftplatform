-- Add campaign_id to gifts table to track which campaign a gift was sent from
-- This fixes the issue where campaign gift counts are always 0

ALTER TABLE gifts
ADD COLUMN IF NOT EXISTS campaign_id UUID REFERENCES campaigns(id) ON DELETE SET NULL;

-- Create index for better query performance
CREATE INDEX IF NOT EXISTS idx_gifts_campaign_id ON gifts(campaign_id);

-- Update existing gifts to associate with campaigns if possible
-- Note: This is a placeholder - actual migration logic depends on your data structure
-- You may need to manually associate existing gifts with campaigns

COMMENT ON COLUMN gifts.campaign_id IS 'References the campaign that sent this gift. NULL for manually sent gifts.';
