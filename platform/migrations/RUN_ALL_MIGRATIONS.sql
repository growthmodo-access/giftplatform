-- ============================================
-- COMPLETE MIGRATION SCRIPT
-- Run this entire script in Supabase SQL Editor
-- ============================================

-- ============================================
-- 1. Fix Companies RLS Policy
-- ============================================
DROP POLICY IF EXISTS "Users can view companies" ON companies;
DROP POLICY IF EXISTS "Users can create companies" ON companies;
DROP POLICY IF EXISTS "Users can update companies" ON companies;
DROP POLICY IF EXISTS "Users can delete companies" ON companies;

CREATE POLICY "Admins can view companies" ON companies
  FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.users
      WHERE users.id = auth.uid()
      AND users.role IN ('SUPER_ADMIN', 'ADMIN')
    )
  );

CREATE POLICY "Admins can create companies" ON companies
  FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.users
      WHERE users.id = auth.uid()
      AND users.role IN ('SUPER_ADMIN', 'ADMIN')
    )
  );

CREATE POLICY "Admins can update companies" ON companies
  FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM public.users
      WHERE users.id = auth.uid()
      AND (
        users.role = 'SUPER_ADMIN'
        OR (users.role = 'ADMIN' AND users.company_id = companies.id)
      )
    )
  );

CREATE POLICY "Super admins can delete companies" ON companies
  FOR DELETE
  USING (
    EXISTS (
      SELECT 1 FROM public.users
      WHERE users.id = auth.uid()
      AND users.role = 'SUPER_ADMIN'
    )
  );

-- ============================================
-- 2. Add Company Details
-- ============================================
ALTER TABLE companies 
ADD COLUMN IF NOT EXISTS billing_address JSONB,
ADD COLUMN IF NOT EXISTS tax_id TEXT,
ADD COLUMN IF NOT EXISTS currency TEXT DEFAULT 'USD',
ADD COLUMN IF NOT EXISTS store_identifier TEXT UNIQUE,
ADD COLUMN IF NOT EXISTS subdomain TEXT UNIQUE;

CREATE INDEX IF NOT EXISTS idx_companies_store_identifier ON companies(store_identifier);
CREATE INDEX IF NOT EXISTS idx_companies_subdomain ON companies(subdomain);

ALTER TABLE companies 
ADD CONSTRAINT IF NOT EXISTS companies_currency_check 
CHECK (currency IN ('USD', 'INR', 'EUR', 'GBP', 'CAD', 'AUD', 'JPY', 'CHF', 'CNY', 'BRL', 'MXN', 'SGD', 'HKD', 'NZD', 'ZAR', 'SEK', 'NOK', 'DKK', 'PLN', 'CZK'));

-- ============================================
-- 3. Fix Campaigns RLS Policy
-- ============================================
DROP POLICY IF EXISTS "Users can view campaigns" ON campaigns;
DROP POLICY IF EXISTS "Users can create campaigns" ON campaigns;
DROP POLICY IF EXISTS "Users can update campaigns" ON campaigns;
DROP POLICY IF EXISTS "Users can delete campaigns" ON campaigns;

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

-- ============================================
-- 4. Add Billing & Wallet Tables
-- ============================================
CREATE TABLE IF NOT EXISTS wallets (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES public.users(id) ON DELETE CASCADE UNIQUE,
  balance DECIMAL(10, 2) DEFAULT 0 CHECK (balance >= 0),
  currency TEXT DEFAULT 'USD',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS wallet_transactions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  wallet_id UUID REFERENCES wallets(id) ON DELETE CASCADE,
  type TEXT NOT NULL CHECK (type IN ('CREDIT', 'DEBIT', 'PAYMENT', 'REFUND')),
  amount DECIMAL(10, 2) NOT NULL,
  description TEXT,
  reference_id TEXT,
  payment_method TEXT,
  status TEXT DEFAULT 'PENDING' CHECK (status IN ('PENDING', 'COMPLETED', 'FAILED', 'CANCELLED')),
  metadata JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS invoices (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  invoice_number TEXT UNIQUE NOT NULL,
  order_id UUID REFERENCES orders(id) ON DELETE SET NULL,
  company_id UUID REFERENCES companies(id) ON DELETE CASCADE,
  user_id UUID REFERENCES public.users(id) ON DELETE SET NULL,
  amount DECIMAL(10, 2) NOT NULL,
  tax_amount DECIMAL(10, 2) DEFAULT 0,
  total_amount DECIMAL(10, 2) NOT NULL,
  currency TEXT DEFAULT 'USD',
  status TEXT DEFAULT 'PENDING' CHECK (status IN ('PENDING', 'PAID', 'OVERDUE', 'CANCELLED')),
  due_date TIMESTAMP WITH TIME ZONE,
  paid_at TIMESTAMP WITH TIME ZONE,
  payment_method TEXT,
  billing_address JSONB,
  items JSONB,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_wallets_user_id ON wallets(user_id);
CREATE INDEX IF NOT EXISTS idx_wallet_transactions_wallet_id ON wallet_transactions(wallet_id);
CREATE INDEX IF NOT EXISTS idx_wallet_transactions_reference_id ON wallet_transactions(reference_id);
CREATE INDEX IF NOT EXISTS idx_invoices_order_id ON invoices(order_id);
CREATE INDEX IF NOT EXISTS idx_invoices_company_id ON invoices(company_id);
CREATE INDEX IF NOT EXISTS idx_invoices_invoice_number ON invoices(invoice_number);

-- Enable RLS
ALTER TABLE wallets ENABLE ROW LEVEL SECURITY;
ALTER TABLE wallet_transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE invoices ENABLE ROW LEVEL SECURITY;

-- RLS Policies for wallets
DROP POLICY IF EXISTS "Users can view own wallet" ON wallets;
DROP POLICY IF EXISTS "Users can update own wallet" ON wallets;

CREATE POLICY "Users can view own wallet" ON wallets
  FOR SELECT
  USING (user_id = auth.uid());

CREATE POLICY "Users can update own wallet" ON wallets
  FOR UPDATE
  USING (user_id = auth.uid());

-- Allow system to insert wallets (for new users)
CREATE POLICY "System can create wallets" ON wallets
  FOR INSERT
  WITH CHECK (true);

-- RLS Policies for wallet_transactions
DROP POLICY IF EXISTS "Users can view own transactions" ON wallet_transactions;

CREATE POLICY "Users can view own transactions" ON wallet_transactions
  FOR SELECT
  USING (
    wallet_id IN (
      SELECT id FROM wallets WHERE user_id = auth.uid()
    )
  );

-- Allow system to create transactions
CREATE POLICY "System can create transactions" ON wallet_transactions
  FOR INSERT
  WITH CHECK (true);

-- RLS Policies for invoices
DROP POLICY IF EXISTS "Users can view company invoices" ON invoices;

CREATE POLICY "Users can view company invoices" ON invoices
  FOR SELECT
  USING (
    company_id IN (
      SELECT company_id FROM public.users WHERE id = auth.uid()
    )
    OR EXISTS (
      SELECT 1 FROM public.users
      WHERE users.id = auth.uid()
      AND users.role = 'SUPER_ADMIN'
    )
  );

-- Allow system to create invoices
CREATE POLICY "System can create invoices" ON invoices
  FOR INSERT
  WITH CHECK (true);

-- ============================================
-- Migration Complete!
-- ============================================
-- Verify tables were created:
-- SELECT table_name FROM information_schema.tables 
-- WHERE table_schema = 'public' 
-- AND table_name IN ('wallets', 'wallet_transactions', 'invoices')
-- ORDER BY table_name;
