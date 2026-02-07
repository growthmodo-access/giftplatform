# Roles, Permissions & Functional Scope (goodies.so V1)

**Product:** goodies.so  
**Version:** V1

## Overview of Roles

goodies.so has **4 roles**, each with clearly separated responsibilities.

| Role | Description |
|------|-------------|
| **Super Admin** | goodies.so internal team (platform owner) |
| **Company Admin** | Primary customer account owner (billing, settings, invite HR) |
| **Company HR** | Operational user running campaigns end-to-end |
| **Company Employee** | End recipient of gifts (link-based, no login) |

---

## 1. Super Admin (Platform Owner)

- **Role:** Highest-level internal role; platform configuration, vendors, companies, oversight.
- **Visibility:** Not visible to customers.

**Menu:** Dashboard, Companies, Users, Vendors, Catalog, Campaigns (read-only), Orders & Fulfillment, Invoices & Finance, System Settings.

**Permissions:**
- Full read/write access to entire platform
- Override any campaign or order
- Control vendors, pricing, and margins
- Cannot act as an employee or select gifts

---

## 2. Company Admin (Customer Account Owner)

- **Role:** Owner of the company account (e.g. Founder, Ops Head, Senior HR).
- **Scope:** Company-level settings and access only; not day-to-day gifting.

**Menu:** Dashboard, Company Settings, Users & Roles, Campaigns (read-only), Invoices.

**Permissions:**
- Manage company profile & billing
- Invite users and assign role: Company HR (and remove/deactivate users)
- View all campaigns & invoices
- **Cannot** create or edit campaigns
- **Cannot** manage vendors or catalog

---

## 3. Company HR (Operational User)

- **Role:** Primary operational user; runs gifting campaigns end-to-end (hero role for PMF).

**Menu:** Dashboard, Campaigns, Employees, Catalog (browse), Orders & Tracking, Invoices.

**Permissions:**
- Create and edit campaigns, set budget, select catalog, upload employees, launch, track deliveries
- **Cannot** edit company billing, change pricing, manage vendors, or view platform-level data

---

## 4. Company Employee (Gift Recipient)

- **Role:** End recipient of gifts. No traditional account.
- **Access:** Link-based, tokenized (email/WhatsApp gift link).

**Experience:**
- No dashboard / no menu
- Gift selection page: view gifts, select one, enter address, confirm
- No login or account access after selection

**Permissions:**
- Select one gift per campaign; enter address and preferences
- **Cannot** view other employees, modify campaigns, reorder, or access dashboard

---

## Role Interaction Summary

| Action | Super Admin | Company Admin | Company HR | Employee |
|--------|:------------:|:--------------:|:----------:|:--------:|
| Manage vendors | ✅ | ❌ | ❌ | ❌ |
| Manage catalog | ✅ | ❌ | ❌ | ❌ |
| Create campaigns | ❌ | ❌ | ✅ | ❌ |
| View campaigns | ✅ | ✅ | ✅ | ❌ |
| Upload employees | ❌ | ❌ | ✅ | ❌ |
| Select gifts | ❌ | ❌ | ❌ | ✅ |
| View invoices | ✅ | ✅ | ✅ | ❌ |
| Platform settings | ✅ | ❌ | ❌ | ❌ |

---

## V1 Guardrails

1. **Company HR** is the hero role (only HR creates/edits campaigns and uploads employees).
2. **Company Admin** is control & billing only (view campaigns/invoices, invite/assign HR).
3. **Employees** never log in (link-based selection only).
4. **Super Admin** stays invisible to customers.

---

## Implementation Alignment (Codebase)

**Role mapping:** `SUPER_ADMIN` = Super Admin, `ADMIN` = Company Admin, `HR` = Company HR, `EMPLOYEE` = Company Employee. The codebase also has `MANAGER`; for V1 it is treated as HR-like (can create campaigns/orders) for backward compatibility.

| Spec rule | Implementation |
|-----------|----------------|
| Only HR (and SUPER_ADMIN) create/edit campaigns | `campaigns.ts`: create/send/update restricted to SUPER_ADMIN, HR, MANAGER (no ADMIN). |
| Only HR (and SUPER_ADMIN) create orders | `orders.ts`: create order restricted to SUPER_ADMIN, HR, MANAGER (no ADMIN). |
| Company Admin: view campaigns & invoices only | Sidebar: ADMIN sees Campaigns (read-only in UI), Billing. No Products/Orders/Gifts for ADMIN. |
| Company Admin: Users & Roles (invite, assign HR) | ADMIN sees Employees (invite/assign) and Settings. Companies limited to own company. |
| HR: full campaign and employee flow | HR sees Dashboard, Campaigns, Employees, Products, Orders, Billing, Analytics. No Companies, no Users (platform). |
| Employee: no dashboard | EMPLOYEE sees minimal nav (e.g. Gifts only) or is redirected to gift-link flow. |
| Super Admin: full platform | SUPER_ADMIN sees all: Dashboard, Companies, Users, Ops, Audit, Settings, etc. |

**Files to keep in sync:** `platform/components/dashboard/sidebar.tsx`, `platform/actions/campaigns.ts`, `platform/actions/orders.ts`, `platform/actions/employees.ts`, and any campaign/order UI that shows create buttons (hide create for ADMIN).
