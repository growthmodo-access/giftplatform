-- Add unique identifier to campaigns table
-- This allows campaigns to have a human-readable unique code

-- Add campaign_identifier column
ALTER TABLE campaigns
ADD COLUMN IF NOT EXISTS campaign_identifier TEXT UNIQUE;

-- Create index for faster lookups
CREATE INDEX IF NOT EXISTS idx_campaigns_identifier ON campaigns(campaign_identifier);

-- Generate identifiers for existing campaigns if they don't have one
DO $$
DECLARE
  campaign_record RECORD;
  new_identifier TEXT;
BEGIN
  FOR campaign_record IN 
    SELECT id, name, created_at FROM campaigns WHERE campaign_identifier IS NULL
  LOOP
    -- Generate identifier: first 3 letters of name + timestamp (last 6 digits)
    new_identifier := UPPER(SUBSTRING(REGEXP_REPLACE(campaign_record.name, '[^A-Za-z0-9]', '', 'g'), 1, 3)) || 
                      LPAD((EXTRACT(EPOCH FROM campaign_record.created_at)::BIGINT % 1000000)::TEXT, 6, '0');
    
    -- Ensure uniqueness
    WHILE EXISTS (SELECT 1 FROM campaigns WHERE campaign_identifier = new_identifier) LOOP
      new_identifier := new_identifier || LPAD(FLOOR(RANDOM() * 1000)::TEXT, 3, '0');
    END LOOP;
    
    UPDATE campaigns 
    SET campaign_identifier = new_identifier 
    WHERE id = campaign_record.id;
  END LOOP;
END $$;

-- Create function to generate unique campaign identifier
CREATE OR REPLACE FUNCTION generate_campaign_identifier(campaign_name TEXT)
RETURNS TEXT AS $$
DECLARE
  base_identifier TEXT;
  final_identifier TEXT;
  counter INTEGER := 0;
BEGIN
  -- Generate base identifier from name (first 3 alphanumeric chars)
  base_identifier := UPPER(SUBSTRING(REGEXP_REPLACE(campaign_name, '[^A-Za-z0-9]', '', 'g'), 1, 3));
  
    -- If name is too short, pad with random chars
    IF LENGTH(base_identifier) < 3 THEN
      base_identifier := base_identifier || LPAD((FLOOR(RANDOM() * 100))::TEXT, 3 - LENGTH(base_identifier), '0');
    END IF;
  
  -- Add timestamp component
  final_identifier := base_identifier || LPAD((EXTRACT(EPOCH FROM NOW())::BIGINT % 1000000)::TEXT, 6, '0');
  
    -- Ensure uniqueness
    WHILE EXISTS (SELECT 1 FROM campaigns WHERE campaign_identifier = final_identifier) LOOP
      counter := counter + 1;
      final_identifier := base_identifier || LPAD(((EXTRACT(EPOCH FROM NOW())::BIGINT % 1000000) + counter)::TEXT, 6, '0');
    IF counter > 1000 THEN
      -- Fallback: use UUID substring if we can't find unique identifier
      final_identifier := base_identifier || SUBSTRING(REPLACE(gen_random_uuid()::TEXT, '-', ''), 1, 6);
      EXIT;
    END IF;
  END LOOP;
  
  RETURN final_identifier;
END;
$$ LANGUAGE plpgsql;

COMMENT ON COLUMN campaigns.campaign_identifier IS 'Unique human-readable identifier for the campaign (e.g., BIR001234)';
