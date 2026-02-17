-- Product sizes: for SWAG/PHYSICAL_GIFT that require size selection (e.g. T-shirts).
-- Store: requires_sizes = true, sizes = ["S", "M", "L", "XL"]; order_items store selected size.

ALTER TABLE products ADD COLUMN IF NOT EXISTS requires_sizes BOOLEAN DEFAULT false;
ALTER TABLE products ADD COLUMN IF NOT EXISTS sizes JSONB DEFAULT '[]'::jsonb;

ALTER TABLE order_items ADD COLUMN IF NOT EXISTS size TEXT;

COMMENT ON COLUMN products.requires_sizes IS 'When true, store and checkout show size selector';
COMMENT ON COLUMN products.sizes IS 'Array of size options, e.g. ["S", "M", "L", "XL"]';
COMMENT ON COLUMN order_items.size IS 'Selected size for products that require sizes';
