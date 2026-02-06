-- PRD V1: Campaign recipients (CSV upload, tokenized gift links), link validity, vendors, multi-vendor orders
-- Run after enhance-campaigns.sql

-- 0. Orders: allow nullable user_id when order is from campaign gift selection
ALTER TABLE orders ADD COLUMN IF NOT EXISTS campaign_recipient_id UUID;
ALTER TABLE orders ALTER COLUMN user_id DROP NOT NULL;

-- 1. Campaign link validity and editable when live
ALTER TABLE campaigns
ADD COLUMN IF NOT EXISTS link_valid_until TIMESTAMP WITH TIME ZONE,
ADD COLUMN IF NOT EXISTS allow_edit_when_live BOOLEAN DEFAULT true;

-- 2. Campaign recipients (from CSV or manual: name, email, designation, department, phone)
-- Token for gift selection link; no auth required for recipient
CREATE TABLE IF NOT EXISTS campaign_recipients (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  campaign_id UUID NOT NULL REFERENCES campaigns(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  designation TEXT,
  department TEXT,
  phone TEXT,
  gift_link_token TEXT UNIQUE NOT NULL,
  link_expires_at TIMESTAMP WITH TIME ZONE,
  gift_selected_at TIMESTAMP WITH TIME ZONE,
  order_id UUID REFERENCES orders(id) ON DELETE SET NULL,
  shipping_address JSONB,
  selected_product_id UUID REFERENCES products(id) ON DELETE SET NULL,
  size_color_preference JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Add FK from orders to campaign_recipients (column already added above)
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.table_constraints
    WHERE table_name = 'orders' AND constraint_name = 'orders_campaign_recipient_id_fkey'
  ) THEN
    ALTER TABLE orders ADD CONSTRAINT orders_campaign_recipient_id_fkey
      FOREIGN KEY (campaign_recipient_id) REFERENCES campaign_recipients(id) ON DELETE SET NULL;
  END IF;
END $$;

CREATE INDEX IF NOT EXISTS idx_campaign_recipients_campaign_id ON campaign_recipients(campaign_id);
CREATE INDEX IF NOT EXISTS idx_campaign_recipients_token ON campaign_recipients(gift_link_token);
CREATE INDEX IF NOT EXISTS idx_campaign_recipients_email ON campaign_recipients(email);

-- 3. Vendors (goodies.so backend; vendor dashboard will use these)
CREATE TABLE IF NOT EXISTS vendors (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  contact_phone TEXT,
  categories TEXT[] DEFAULT '{}',
  sla_days INTEGER DEFAULT 7,
  gstin TEXT,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 4. Order–vendor assignments (one order can have multiple vendors)
CREATE TABLE IF NOT EXISTS order_vendor_assignments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  order_id UUID NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
  vendor_id UUID NOT NULL REFERENCES vendors(id) ON DELETE CASCADE,
  status TEXT DEFAULT 'PENDING' CHECK (status IN ('PENDING', 'ACCEPTED', 'SHIPPED', 'DELIVERED')),
  cost DECIMAL(10, 2),
  po_sent_at TIMESTAMP WITH TIME ZONE,
  tracking_number TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_order_vendor_assignments_order ON order_vendor_assignments(order_id);
CREATE INDEX IF NOT EXISTS idx_order_vendor_assignments_vendor ON order_vendor_assignments(vendor_id);

-- 5. RLS for new tables (adjust policies as needed for your auth model)
ALTER TABLE campaign_recipients ENABLE ROW LEVEL SECURITY;
ALTER TABLE vendors ENABLE ROW LEVEL SECURITY;
ALTER TABLE order_vendor_assignments ENABLE ROW LEVEL SECURITY;

-- Campaign recipients: HR/Admin of the campaign's company can manage; public gift page will use token (no auth)
CREATE POLICY "Campaign recipients select by company" ON campaign_recipients
  FOR SELECT USING (
    campaign_id IN (
      SELECT id FROM campaigns WHERE company_id IN (
        SELECT company_id FROM public.users WHERE id = auth.uid()
      )
    )
  );

CREATE POLICY "Campaign recipients insert by company" ON campaign_recipients
  FOR INSERT WITH CHECK (
    campaign_id IN (
      SELECT id FROM campaigns WHERE company_id IN (
        SELECT company_id FROM public.users WHERE id = auth.uid()
      )
    )
  );

CREATE POLICY "Campaign recipients update by company or token" ON campaign_recipients
  FOR UPDATE USING (
    campaign_id IN (
      SELECT id FROM campaigns WHERE company_id IN (
        SELECT company_id FROM public.users WHERE id = auth.uid()
      )
    )
  );

-- Vendors: only SUPER_ADMIN / Ops for now
CREATE POLICY "Vendors full access for super admin" ON vendors
  FOR ALL USING (
    EXISTS (SELECT 1 FROM public.users WHERE id = auth.uid() AND role = 'SUPER_ADMIN')
  );

-- Order vendor assignments: company and SUPER_ADMIN
CREATE POLICY "Order vendor assignments select" ON order_vendor_assignments
  FOR SELECT USING (
    order_id IN (SELECT id FROM orders WHERE company_id IN (SELECT company_id FROM public.users WHERE id = auth.uid()))
    OR EXISTS (SELECT 1 FROM public.users WHERE id = auth.uid() AND role = 'SUPER_ADMIN')
  );

CREATE POLICY "Order vendor assignments insert" ON order_vendor_assignments
  FOR INSERT WITH CHECK (
    order_id IN (SELECT id FROM orders WHERE company_id IN (SELECT company_id FROM public.users WHERE id = auth.uid()))
    OR EXISTS (SELECT 1 FROM public.users WHERE id = auth.uid() AND role = 'SUPER_ADMIN')
  );

CREATE POLICY "Order vendor assignments update" ON order_vendor_assignments
  FOR UPDATE USING (
    order_id IN (SELECT id FROM orders WHERE company_id IN (SELECT company_id FROM public.users WHERE id = auth.uid()))
    OR EXISTS (SELECT 1 FROM public.users WHERE id = auth.uid() AND role = 'SUPER_ADMIN')
  );
