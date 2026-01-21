-- Add soft delete support to key tables
-- This allows data to be archived instead of permanently deleted

-- Add deleted_at column to orders
ALTER TABLE orders
ADD COLUMN IF NOT EXISTS deleted_at TIMESTAMP WITH TIME ZONE;

-- Add deleted_at column to products
ALTER TABLE products
ADD COLUMN IF NOT EXISTS deleted_at TIMESTAMP WITH TIME ZONE;

-- Add deleted_at column to campaigns
ALTER TABLE campaigns
ADD COLUMN IF NOT EXISTS deleted_at TIMESTAMP WITH TIME ZONE;

-- Add deleted_at column to companies (for SUPER_ADMIN)
ALTER TABLE companies
ADD COLUMN IF NOT EXISTS deleted_at TIMESTAMP WITH TIME ZONE;

-- Create indexes for soft delete queries
CREATE INDEX IF NOT EXISTS idx_orders_deleted_at ON orders(deleted_at) WHERE deleted_at IS NULL;
CREATE INDEX IF NOT EXISTS idx_products_deleted_at ON products(deleted_at) WHERE deleted_at IS NULL;
CREATE INDEX IF NOT EXISTS idx_campaigns_deleted_at ON campaigns(deleted_at) WHERE deleted_at IS NULL;
CREATE INDEX IF NOT EXISTS idx_companies_deleted_at ON companies(deleted_at) WHERE deleted_at IS NULL;

-- Create function to soft delete orders
CREATE OR REPLACE FUNCTION soft_delete_order(order_id UUID)
RETURNS void AS $$
BEGIN
  UPDATE orders
  SET deleted_at = NOW()
  WHERE id = order_id AND deleted_at IS NULL;
END;
$$ LANGUAGE plpgsql;

-- Create function to restore soft deleted orders
CREATE OR REPLACE FUNCTION restore_order(order_id UUID)
RETURNS void AS $$
BEGIN
  UPDATE orders
  SET deleted_at = NULL
  WHERE id = order_id AND deleted_at IS NOT NULL;
END;
$$ LANGUAGE plpgsql;

COMMENT ON COLUMN orders.deleted_at IS 'Timestamp when order was soft deleted. NULL means order is active.';
COMMENT ON COLUMN products.deleted_at IS 'Timestamp when product was soft deleted. NULL means product is active.';
COMMENT ON COLUMN campaigns.deleted_at IS 'Timestamp when campaign was soft deleted. NULL means campaign is active.';
COMMENT ON COLUMN companies.deleted_at IS 'Timestamp when company was soft deleted. NULL means company is active.';
