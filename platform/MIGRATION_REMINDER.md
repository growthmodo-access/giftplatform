# Migration Reminder

## Required Migrations

To fix the "Could not find the table 'public.wallets'" error, you need to run the following migration:

### 1. Wallets and Billing Tables

Run this migration in your Supabase SQL Editor:
- **File**: `platform/migrations/add-billing-wallet.sql`

This migration creates:
- `wallets` table
- `wallet_transactions` table  
- `invoices` table
- All necessary RLS policies

### 2. Campaign Identifier

Run this migration to add unique identifiers to campaigns:
- **File**: `platform/migrations/add-campaign-identifier.sql`

### 3. Teams Feature

Run this migration to enable team functionality:
- **File**: `platform/migrations/add-teams-feature.sql`

### 4. Campaigns RLS Fix

Run this migration to fix campaign creation permissions:
- **File**: `platform/migrations/fix-campaigns-rls-final.sql`

## Quick Run All

You can also run all migrations at once using:
- **File**: `platform/migrations/RUN_ALL_MIGRATIONS.sql`

**Note**: Make sure to run migrations in order if running individually, as some depend on others.
