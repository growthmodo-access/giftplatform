# Test Users Setup Guide

This guide explains how to create test users for all roles to test the application functionality.

## Method 1: Using TypeScript Script (Recommended)

This is the easiest method if you have `SUPABASE_SERVICE_ROLE_KEY` configured.

### Steps:

1. **Set up environment variable** (if not already set):
   ```bash
   # In platform/.env.local
   SUPABASE_SERVICE_ROLE_KEY=your-service-role-key-here
   ```

2. **Run the script**:
   ```bash
   cd platform
   npx tsx scripts/create-test-users.ts
   ```

3. **Login with test accounts**:
   - All users have the same password: `Test123!@#`
   - Emails:
     - `superadmin@test.com` - SUPER_ADMIN
     - `admin@test.com` - ADMIN
     - `hr@test.com` - HR
     - `manager@test.com` - MANAGER
     - `employee@test.com` - EMPLOYEE

## Method 2: Using Supabase Dashboard + SQL

### Step 1: Create Auth Users

1. Go to Supabase Dashboard → **Authentication** → **Users**
2. Click **Add User** → **Create new user**
3. Create users with these emails:
   - `superadmin@test.com`
   - `admin@test.com`
   - `hr@test.com`
   - `manager@test.com`
   - `employee@test.com`
4. Set a password for each (e.g., `Test123!@#`)
5. **Important**: Make sure to check "Auto Confirm User" for each

### Step 2: Run SQL Script

1. Go to Supabase Dashboard → **SQL Editor**
2. Open and run `supabase-create-test-users.sql`
3. This will create the user profiles with correct roles

### Step 3: Verify

Run this query in SQL Editor to verify all users:

```sql
SELECT 
  u.email,
  u.name,
  u.role,
  c.name as company_name,
  CASE 
    WHEN au.id IS NOT NULL THEN 'Ready'
    ELSE 'Auth user missing'
  END as status
FROM public.users u
LEFT JOIN companies c ON u.company_id = c.id
LEFT JOIN auth.users au ON u.id = au.id
WHERE u.email LIKE '%@test.com'
ORDER BY 
  CASE u.role
    WHEN 'SUPER_ADMIN' THEN 1
    WHEN 'ADMIN' THEN 2
    WHEN 'HR' THEN 3
    WHEN 'MANAGER' THEN 4
    WHEN 'EMPLOYEE' THEN 5
  END;
```

## Test User Credentials

All test users belong to "Test Company" and have the password: **`Test123!@#`**

| Email | Role | Permissions |
|-------|------|-------------|
| `superadmin@test.com` | SUPER_ADMIN | Full access to everything |
| `admin@test.com` | ADMIN | Can manage employees, products, campaigns, orders |
| `hr@test.com` | HR | Can manage employees, campaigns |
| `manager@test.com` | MANAGER | Can create campaigns and orders |
| `employee@test.com` | EMPLOYEE | View-only access |

## Testing Different Features

### SUPER_ADMIN
- ✅ All features accessible
- ✅ Can change any user's role
- ✅ Full company management

### ADMIN
- ✅ Add/remove employees
- ✅ Create/edit products
- ✅ Create campaigns
- ✅ Create orders
- ✅ Manage employee roles (within company)

### HR
- ✅ Add/remove employees
- ✅ Create campaigns
- ✅ View orders
- ✅ Manage employee roles (within company)

### MANAGER
- ✅ Create campaigns
- ✅ Create orders
- ✅ View employees and products

### EMPLOYEE
- ✅ View own gifts
- ✅ View products
- ❌ Cannot create orders
- ❌ Cannot manage employees

## Troubleshooting

### "User not found" error
- Make sure auth users were created in Supabase Dashboard
- Verify the email matches exactly

### "Permission denied" error
- Check that the user profile has the correct role
- Verify the user is assigned to a company

### Can't log in
- Verify the password is correct
- Check that "Auto Confirm User" was enabled when creating auth user
- Try resetting password via Supabase Dashboard

## Changing Passwords

To change a test user's password:

1. Go to Supabase Dashboard → **Authentication** → **Users**
2. Find the user
3. Click **...** → **Reset Password**
4. Or use the password reset flow in the app

## Cleanup

To remove all test users:

```sql
-- Delete user profiles
DELETE FROM public.users 
WHERE email LIKE '%@test.com';

-- Delete auth users (run in Supabase Dashboard → Authentication → Users)
-- Or use the Admin API to delete users
```
