    -- Add billing address, tax ID, and currency to companies table
    ALTER TABLE companies 
    ADD COLUMN IF NOT EXISTS billing_address JSONB,
    ADD COLUMN IF NOT EXISTS tax_id TEXT,
    ADD COLUMN IF NOT EXISTS currency TEXT DEFAULT 'USD',
    ADD COLUMN IF NOT EXISTS store_identifier TEXT UNIQUE,
    ADD COLUMN IF NOT EXISTS subdomain TEXT UNIQUE;

    -- Create index for store identifier and subdomain lookups
    CREATE INDEX IF NOT EXISTS idx_companies_store_identifier ON companies(store_identifier);
    CREATE INDEX IF NOT EXISTS idx_companies_subdomain ON companies(subdomain);

    -- Add currency constraint (drop first if exists)
    DO $$ 
    BEGIN
        IF EXISTS (
            SELECT 1 FROM pg_constraint 
            WHERE conname = 'companies_currency_check'
        ) THEN
            ALTER TABLE companies DROP CONSTRAINT companies_currency_check;
        END IF;
    END $$;

    ALTER TABLE companies 
    ADD CONSTRAINT companies_currency_check 
    CHECK (currency IN ('USD', 'INR', 'EUR', 'GBP', 'CAD', 'AUD', 'JPY', 'CHF', 'CNY', 'BRL', 'MXN', 'SGD', 'HKD', 'NZD', 'ZAR', 'SEK', 'NOK', 'DKK', 'PLN', 'CZK'));
