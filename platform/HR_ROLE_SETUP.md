# HR Role Setup Guide

## Overview
This guide explains how to add the HR role to your database and use the new employee management features.

## Database Migration

### Step 1: Add HR Role to Database

Run this SQL in your Supabase SQL Editor:

```sql
-- Add HR role to the users table
-- First, drop the existing constraint
ALTER TABLE public.users DROP CONSTRAINT IF EXISTS users_role_check;

-- Add the new constraint with HR role included
ALTER TABLE public.users 
ADD CONSTRAINT users_role_check 
CHECK (role IN ('SUPER_ADMIN', 'ADMIN', 'HR', 'MANAGER', 'EMPLOYEE'));
```

Or use the file: `supabase-add-hr-role.sql`

## New Features

### 1. Add Employee Functionality
- Admins and HR can now invite employees by email
- Employees receive an email to set their password
- New employees are automatically added to the company

### 2. HR Role Support
- HR role is now available alongside ADMIN, MANAGER, and EMPLOYEE
- HR can:
  - Invite new employees
  - Manage employee roles
  - Create and manage campaigns
  - Send campaigns to employees

### 3. Role Management
- All roles are now visible: SUPER_ADMIN, ADMIN, HR, MANAGER, EMPLOYEE
- Admins and HR can change employee roles
- Role badges are color-coded for easy identification

## How to Use

### Inviting Employees
1. Go to the Employees page
2. Click "Add Employee" button (visible to Admins and HR)
3. Fill in:
   - Email address
   - Full name
   - Role (Admin, HR, Manager, or Employee)
4. Click "Invite Employee"
5. The employee will receive an email to set their password

### Changing Employee Roles
1. Go to the Employees page
2. Click the three-dot menu next to an employee
3. Select the new role
4. The role will be updated immediately

## Role Permissions

| Role | Invite Employees | Manage Roles | Create Campaigns | Send Campaigns |
|------|-----------------|--------------|------------------|-----------------|
| SUPER_ADMIN | ✅ | ✅ | ✅ | ✅ |
| ADMIN | ✅ | ✅ | ✅ | ✅ |
| HR | ✅ | ✅ | ✅ | ✅ |
| MANAGER | ❌ | ❌ | ✅ | ✅ |
| EMPLOYEE | ❌ | ❌ | ❌ | ❌ |

## Notes

- The HR role has the same permissions as ADMIN for employee and campaign management
- All role changes are logged with timestamps
- Employees must be part of a company to be invited
