# HR Features Implementation Guide

## Overview
This document outlines all features available to HR users and how to ensure they work properly.

## Critical Requirement: Company Association
**HR and EMPLOYEE users MUST be associated with a company (`company_id`) to access most features.**

### Why This Matters
- HR cannot add employees without a `company_id`
- HR cannot create campaigns without a `company_id`
- HR cannot view company-specific data without a `company_id`

### How to Fix
1. Run the migration: `platform/migrations/ensure-hr-employee-company-association.sql`
2. Manually assign HR/EMPLOYEE users to companies via the admin interface
3. Or use SQL: `UPDATE public.users SET company_id = 'company-uuid' WHERE id = 'user-uuid'`

## HR Features Checklist

### ✅ Employee Management
- [x] **Add Employees** - HR can invite new employees (HR, MANAGER, EMPLOYEE roles only)
- [x] **View All Employees** - HR can see all employees in their company
- [x] **Change Employee Roles** - HR can change roles (to HR, MANAGER, EMPLOYEE only)
- [x] **View Employee Details** - HR can see company association and shipping addresses
- [x] **CSV Import** - HR can bulk import employees via CSV

**Location**: `/employees` page
**Access**: Sidebar → Management → Employees

### ✅ Campaign Management
- [x] **Create Campaigns** - HR can create gift campaigns
- [x] **Send Campaigns** - HR can send campaigns to employees
- [x] **View Campaigns** - HR can view all company campaigns
- [x] **Activate/Deactivate** - HR can toggle campaign status
- [x] **View Campaign Stats** - HR can see gifts sent per campaign

**Location**: `/campaigns` page
**Access**: Sidebar → Management → Campaigns

### ✅ View-Only Features
- [x] **View Products** - HR can browse products (read-only)
- [x] **View Orders** - HR can view all company orders (read-only)
- [x] **View Gifts** - HR can view all gifts and track redemption
- [x] **View Analytics** - HR can view employee engagement analytics

**Locations**: 
- Products: `/products`
- Orders: `/orders`
- Gifts: `/gifts`
- Analytics: `/analytics`

### ❌ Restricted Features (HR Cannot)
- ❌ **Remove Employees** - Only ADMIN can remove employees
- ❌ **Create/Edit/Delete Products** - Only ADMIN and SUPER_ADMIN
- ❌ **Create Orders** - Only ADMIN and MANAGER
- ❌ **Delete Campaigns** - Only ADMIN and SUPER_ADMIN
- ❌ **Change Roles to ADMIN/SUPER_ADMIN** - Only SUPER_ADMIN can
- ❌ **Company Settings** - Only ADMIN and SUPER_ADMIN
- ❌ **Manage Companies** - Only ADMIN and SUPER_ADMIN

## Navigation Access

HR has access to the following sidebar items:

### Core
- ✅ Dashboard
- ✅ Products (view-only)
- ✅ Orders (view-only)
- ✅ Gifts
- ✅ Billing

### Management
- ✅ Employees
- ✅ Campaigns

### Administration
- ✅ Analytics
- ❌ Companies (ADMIN/SUPER_ADMIN only)
- ❌ Users (SUPER_ADMIN only)

### Settings
- ✅ Settings (personal settings only)

## Quick Actions

HR sees the following quick actions on the dashboard:
- ✅ Add Employee
- ✅ New Campaign
- ❌ New Order (ADMIN/MANAGER only)
- ❌ Add Product (ADMIN/SUPER_ADMIN only)

## Troubleshooting

### Issue: HR Cannot Add Employees
**Solution**: 
1. Check if HR has `company_id` set
2. Run: `SELECT id, email, role, company_id FROM public.users WHERE role = 'HR' AND company_id IS NULL;`
3. Assign company: `UPDATE public.users SET company_id = 'company-uuid' WHERE id = 'hr-user-uuid';`

### Issue: HR Cannot Create Campaigns
**Solution**:
1. Check if HR has `company_id` set
2. Verify RLS policies allow HR to insert into campaigns table
3. Check campaign creation action permissions

### Issue: HR Doesn't See "Add Employee" Button
**Solution**:
1. Verify HR role in database: `SELECT role FROM public.users WHERE id = 'user-id';`
2. Check if `currentUserRole` is correctly passed to `EmployeesPageClient`
3. Ensure HR is in the `allowedRoles` array: `['ADMIN', 'HR', 'SUPER_ADMIN']`

### Issue: HR Doesn't See "Create Campaign" Button
**Solution**:
1. Verify HR role in database
2. Check if `currentUserRole` is correctly passed to `CampaignsPageClient`
3. Ensure HR is in the `canCreateCampaigns` check: `currentUserRole === 'ADMIN' || currentUserRole === 'HR' || currentUserRole === 'SUPER_ADMIN'`

## Code References

### Employee Management
- **Page**: `platform/app/(dashboard)/employees/page.tsx`
- **Client Component**: `platform/components/employees/employees-page-client.tsx`
- **Action**: `platform/actions/employees.ts` → `inviteEmployee()`
- **Permission Check**: Line 152 in `actions/employees.ts`

### Campaign Management
- **Page**: `platform/app/(dashboard)/campaigns/page.tsx`
- **Client Component**: `platform/components/campaigns/campaigns-page-client.tsx`
- **Action**: `platform/actions/campaigns.ts` → `createCampaign()`
- **Permission Check**: Line 119 in `actions/campaigns.ts`

### Navigation
- **Sidebar**: `platform/components/dashboard/sidebar.tsx`
- **Quick Actions**: `platform/components/dashboard/quick-actions.tsx`

## Testing HR Access

1. **Login as HR user**
2. **Verify Sidebar** - Should see Employees and Campaigns
3. **Go to Employees** - Should see "Add Employee" button
4. **Go to Campaigns** - Should see "Create Campaign" button
5. **Try Adding Employee** - Should work if `company_id` is set
6. **Try Creating Campaign** - Should work if `company_id` is set

## Next Steps

1. Run the migration to ensure all HR/EMPLOYEE users have `company_id`
2. Test HR access to all features
3. Update any HR users missing `company_id`
4. Verify RLS policies allow HR operations
