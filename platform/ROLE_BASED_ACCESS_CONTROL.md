# Role-Based Access Control (RBAC) Implementation

This document outlines the complete role-based access control system implemented in the platform.

## Role Definitions

### **SUPER_ADMIN** (Platform Administrator)
- **Purpose**: Platform/system-level admin with full access
- **Scope**: All companies and users
- **Key Permissions**:
  - Manage all companies
  - Manage all users across all companies
  - Change any user's role (including other admins)
  - Full CRUD on all products, campaigns, orders, gifts
  - Access to all analytics and platform settings

### **ADMIN** (Company Administrator)
- **Purpose**: Full company management within their company
- **Scope**: Own company only
- **Key Permissions**:
  - Invite employees (any role except SUPER_ADMIN)
  - Remove employees
  - Change employee roles (except to SUPER_ADMIN or ADMIN)
  - Full CRUD on products
  - Full CRUD on campaigns (create, edit, delete, send)
  - Create and manage orders
  - View all gifts and send individual gifts
  - Access company analytics and settings
- **Restrictions**:
  - Cannot change roles to SUPER_ADMIN
  - Cannot promote others to ADMIN (only SUPER_ADMIN can)
  - Cannot manage other companies

### **HR** (Human Resources)
- **Purpose**: Employee management and engagement
- **Scope**: Own company only
- **Key Permissions**:
  - Invite employees (HR, MANAGER, EMPLOYEE only)
  - View all employees
  - Change employee roles (to HR, MANAGER, EMPLOYEE only)
  - View products (read-only)
  - Create and send campaigns
  - View all orders (read-only)
  - View all gifts and track redemption
- **Restrictions**:
  - Cannot remove employees (ADMIN only)
  - Cannot change roles to ADMIN or SUPER_ADMIN
  - Cannot manage products (create/edit/delete)
  - Cannot create orders
  - Cannot delete campaigns
  - Cannot access financial/budget settings

### **MANAGER** (Team Manager)
- **Purpose**: Team management and gift distribution
- **Scope**: Own company, team-focused
- **Key Permissions**:
  - View employees in company (read-only)
  - View products (read-only)
  - Create campaigns (for team engagement)
  - Send campaigns to employees
  - Create orders (for team members)
  - View gifts sent via their campaigns
- **Restrictions**:
  - Cannot invite or manage employees
  - Cannot manage products
  - Cannot delete campaigns
  - Cannot view all company orders (only own)
  - Cannot change employee roles
  - Cannot access company settings

### **EMPLOYEE** (Regular User)
- **Purpose**: View and redeem gifts
- **Scope**: Own data only
- **Key Permissions**:
  - View own profile
  - Edit own profile (name, avatar)
  - View own gifts
  - Redeem gifts
  - View products (read-only, for browsing)
  - View own orders only
- **Restrictions**:
  - Cannot invite employees
  - Cannot create campaigns
  - Cannot create orders
  - Cannot view other employees
  - Cannot access any management features

## Permission Matrix

| Feature | SUPER_ADMIN | ADMIN | HR | MANAGER | EMPLOYEE |
|---------|-------------|-------|----|---------|----------| 
| **Manage Companies** | ✅ All | ❌ | ❌ | ❌ | ❌ |
| **Invite Employees** | ✅ All | ✅ (except SUPER_ADMIN) | ✅ (HR/MGR/EMP only) | ❌ | ❌ |
| **Remove Employees** | ✅ | ✅ | ❌ | ❌ | ❌ |
| **Change Employee Roles** | ✅ All | ✅ (except SUPER_ADMIN/ADMIN) | ✅ (HR/MGR/EMP only) | ❌ | ❌ |
| **Create Products** | ✅ | ✅ | ❌ | ❌ | ❌ |
| **Edit Products** | ✅ | ✅ | ❌ | ❌ | ❌ |
| **Delete Products** | ✅ | ✅ | ❌ | ❌ | ❌ |
| **View Products** | ✅ All | ✅ Company | ✅ Company | ✅ Company | ✅ (browse) |
| **Create Campaigns** | ✅ | ✅ | ✅ | ✅ | ❌ |
| **Send Campaigns** | ✅ | ✅ | ✅ | ✅ | ❌ |
| **Delete Campaigns** | ✅ | ✅ | ❌ | ❌ | ❌ |
| **Create Orders** | ✅ | ✅ | ❌ | ✅ (for team) | ❌ |
| **View All Orders** | ✅ All | ✅ Company | ✅ (read-only) | ❌ | ❌ |
| **View Own Orders** | ✅ | ✅ | ✅ | ✅ | ✅ |
| **Send Individual Gifts** | ✅ | ✅ | ❌ | ❌ | ❌ |
| **View All Gifts** | ✅ All | ✅ Company | ✅ Company | ✅ (own campaigns) | ❌ |
| **View Own Gifts** | ✅ | ✅ | ✅ | ✅ | ✅ |
| **Redeem Gifts** | ✅ | ✅ | ✅ | ✅ | ✅ |
| **View Analytics** | ✅ All | ✅ Company | ✅ (employee only) | ✅ (team only) | ❌ |
| **Company Settings** | ✅ All | ✅ | ❌ | ❌ | ❌ |

## Implementation Details

### Server Actions

All server actions now include role-based permission checks:

1. **Products** (`actions/products.ts`):
   - `createProduct`: Only ADMIN and SUPER_ADMIN
   - `updateProduct`: Only ADMIN and SUPER_ADMIN
   - `deleteProduct`: Only ADMIN and SUPER_ADMIN

2. **Employees** (`actions/employees.ts`):
   - `inviteEmployee`: ADMIN, HR, SUPER_ADMIN (HR restricted to HR/MGR/EMP roles)
   - `updateEmployeeRole`: ADMIN, HR, SUPER_ADMIN (HR cannot assign ADMIN/SUPER_ADMIN)
   - HR cannot remove employees (functionality not implemented for HR)

3. **Campaigns** (`actions/campaigns.ts`):
   - `createCampaign`: ADMIN, HR, MANAGER, SUPER_ADMIN
   - `sendCampaignToEmployees`: ADMIN, HR, MANAGER, SUPER_ADMIN
   - `updateCampaignStatus`: ADMIN, HR, MANAGER, SUPER_ADMIN
   - `deleteCampaign`: Only ADMIN and SUPER_ADMIN

4. **Orders** (`actions/orders.ts`):
   - `getOrders`: All roles (EMPLOYEE sees only own orders)
   - `createOrder`: ADMIN, MANAGER, SUPER_ADMIN (HR cannot create)

### UI Components

UI components hide/show features based on roles:

1. **Products Page**:
   - "Add Product" button: Only ADMIN and SUPER_ADMIN
   - Edit/Delete actions: Only ADMIN and SUPER_ADMIN

2. **Orders Page**:
   - "New Order" button: ADMIN, MANAGER, SUPER_ADMIN (HR cannot create)

3. **Campaigns Page**:
   - "New Campaign" button: ADMIN, HR, MANAGER, SUPER_ADMIN
   - "Delete Campaign" button: Only ADMIN and SUPER_ADMIN

4. **Employees Page**:
   - "Add Employee" button: ADMIN, HR, SUPER_ADMIN
   - Role change dropdown: ADMIN, HR, SUPER_ADMIN (with restrictions)

## Security Considerations

1. **Privilege Escalation Prevention**:
   - ADMIN cannot promote others to ADMIN (only SUPER_ADMIN can)
   - ADMIN cannot change roles to SUPER_ADMIN
   - HR cannot assign ADMIN or SUPER_ADMIN roles

2. **Company Isolation**:
   - All queries filter by `company_id` to ensure users only see their company's data
   - SUPER_ADMIN can access all companies (uses service role when needed)

3. **Data Access**:
   - EMPLOYEE can only see their own orders and gifts
   - MANAGER can see all orders but only create for team (currently all employees)
   - HR has read-only access to orders

## Testing

Use the test users to verify permissions:
- `superadmin@test.com` - Full access
- `admin@test.com` - Company admin
- `hr@test.com` - HR (restricted)
- `manager@test.com` - Manager (restricted)
- `employee@test.com` - Employee (view-only)

All test users password: `Test123!@#`

## Future Enhancements

1. **Team Structure**: Add team/department assignment for MANAGER role filtering
2. **Audit Logging**: Track all role changes and permission-sensitive actions
3. **Fine-grained Permissions**: Add permission flags for specific features
4. **Role Templates**: Predefined permission sets for common roles
