# Database Migration Instructions

## Quick Setup Guide

You need to run the following migrations in your Supabase SQL Editor to enable all features.

## Step 1: Access Supabase SQL Editor

1. Go to your Supabase Dashboard
2. Navigate to **SQL Editor** (left sidebar)
3. Click **New Query**

## Step 2: Run Migrations in Order

Run these migrations **one at a time** in the order listed:

### 1. Fix Companies RLS Policy
**File**: `platform/migrations/fix-companies-rls.sql`

This allows ADMIN and SUPER_ADMIN to create companies.

### 2. Add Company Details
**File**: `platform/migrations/add-company-details.sql`

This adds billing address, tax ID, currency, and swag store fields to companies.

### 3. Fix Campaigns RLS Policy
**File**: `platform/migrations/fix-campaigns-rls.sql`

This allows ADMIN, HR, MANAGER, and SUPER_ADMIN to create campaigns.

### 4. Add Billing & Wallet Tables ⚠️ **REQUIRED FOR BILLING**
**File**: `platform/migrations/add-billing-wallet.sql`

This creates:
- `wallets` table (for user wallet balances)
- `wallet_transactions` table (for transaction history)
- `invoices` table (for invoice records)

## How to Run a Migration

1. Open the migration file (e.g., `platform/migrations/add-billing-wallet.sql`)
2. Copy **ALL** the SQL code from the file
3. Paste it into the Supabase SQL Editor
4. Click **Run** (or press Cmd/Ctrl + Enter)
5. Verify success message appears
6. Check the **Table Editor** to confirm tables were created

## Verification

After running `add-billing-wallet.sql`, verify the tables exist:

1. Go to **Table Editor** in Supabase
2. You should see:
   - ✅ `wallets`
   - ✅ `wallet_transactions`
   - ✅ `invoices`

## Troubleshooting

### Error: "relation already exists"
- The table already exists, you can skip that migration
- Or drop the table first if you want to recreate it

### Error: "permission denied"
- Make sure you're using the SQL Editor (not the Table Editor)
- Check that you have admin access to the Supabase project

### Error: "syntax error"
- Make sure you copied the entire SQL code
- Check for any markdown formatting that might have been copied
- Try copying the file content directly

## Current Status

Run this query to check which tables exist:

```sql
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'public' 
AND table_name IN ('wallets', 'wallet_transactions', 'invoices', 'campaigns', 'companies')
ORDER BY table_name;
```
