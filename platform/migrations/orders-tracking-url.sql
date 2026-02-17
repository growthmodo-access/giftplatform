-- Allow storing an optional tracking URL (admin can paste carrier link).
-- If set, "Track" uses this URL; otherwise we build from tracking_number via getTrackingUrl().
ALTER TABLE orders ADD COLUMN IF NOT EXISTS tracking_url TEXT;
