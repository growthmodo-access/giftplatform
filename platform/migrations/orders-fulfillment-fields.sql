-- Add fulfillment/recipient fields for store checkout (name, email, phone).
-- Used by swag store and order detail views.
ALTER TABLE orders ADD COLUMN IF NOT EXISTS recipient_name TEXT;
ALTER TABLE orders ADD COLUMN IF NOT EXISTS recipient_email TEXT;
ALTER TABLE orders ADD COLUMN IF NOT EXISTS recipient_phone TEXT;
