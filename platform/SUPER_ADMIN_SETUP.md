# Super Admin Setup Guide

This guide explains how to create a SUPER_ADMIN user account.

## Method 1: SQL Script (Recommended)

### Step 1: Create User Account (if not exists)
1. Go to your application's signup page
2. Create an account with the email you want to make SUPER_ADMIN
3. Complete the signup process

### Step 2: Update Role to SUPER_ADMIN
1. Open your Supabase Dashboard
2. Go to **SQL Editor**
3. Run this SQL (replace email with your actual email):

```sql
UPDATE public.users
SET 
  role = 'SUPER_ADMIN',
  updated_at = NOW()
WHERE email = 'your-email@example.com';

-- Verify
SELECT id, email, name, role, company_id, created_at, updated_at
FROM public.users
WHERE email = 'your-email@example.com';
```

Or use the file: `supabase-create-super-admin.sql`

## Method 2: Using Admin Script

If you have `SUPABASE_SERVICE_ROLE_KEY` configured:

```bash
cd platform
npx tsx scripts/create-super-admin.ts your-email@example.com
```

## Method 3: Via Supabase Dashboard

1. Go to Supabase Dashboard → **Authentication** → **Users**
2. Find or create the user
3. Go to **Table Editor** → **users** table
4. Find the user row
5. Edit the `role` column to `SUPER_ADMIN`
6. Save

## Quick Setup for kunal@growthmodo.com

Run this SQL in Supabase SQL Editor:

```sql
UPDATE public.users
SET 
  role = 'SUPER_ADMIN',
  updated_at = NOW()
WHERE email = 'kunal@growthmodo.com';
```

## Super Admin Permissions

SUPER_ADMIN has full access to:
- ✅ Invite employees
- ✅ Manage all employee roles (including other admins)
- ✅ Create and manage campaigns
- ✅ Send campaigns to employees
- ✅ All product management
- ✅ All order management
- ✅ Access to all companies (if multi-tenant)

## Verification

After setting the role, log out and log back in. You should see:
- "Add Employee" button enabled
- Full access to all features
- Debug line showing: "Your role: SUPER_ADMIN | Can invite: Yes"
