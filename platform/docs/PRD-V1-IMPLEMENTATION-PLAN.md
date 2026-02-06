# goodies.so PRD V1 – Implementation Plan

**Based on PRD clarifications (answers 1–9).**

---

## 1. Decisions Summary

| # | Topic | Decision |
|---|--------|----------|
| 1 | Admin auth | **B:** Keep password login; add magic link as an option |
| 2 | Employee experience | **Repurpose** current Employee dashboard (e.g. view gift/order status) in addition to tokenized gift selection |
| 3 | Catalog & budget | **B:** HR picks individual products/SKUs per campaign. Budget is **per recipient** (fixed amount per employee) |
| 4 | Employee list & delivery | CSV columns: **name, email, designation, department, phone**. Gift link sent **by email only** |
| 5 | Ops panel | **A:** Same app, different role (e.g. goodies.so Ops) with different views |
| 6 | Vendors | One order can involve **multiple vendors**. Build a **vendor dashboard** in V1 |
| 7 | Invoice | Indian invoice with **GST** (usual fields: GSTIN, HSN, place of supply, etc.) |
| 8 | Link validity & editing | **HR sets link validity.** HR **can still edit** campaign when Live |
| 9 | Scope | **Map** existing product to PRD and **add** missing pieces |

---

## 2. Map: Existing → PRD

| PRD Concept | Existing in Codebase | Notes |
|-------------|----------------------|--------|
| Admin dashboard (HR) | ✅ Dashboard, Campaigns, wizard | Add: magic link, CSV upload, link validity, consolidated invoice PDF |
| Campaign (name, type, dates, budget, catalog) | ✅ `campaigns` + wizard (steps 1–6) | Align types to onboarding/festival/other; ensure per_recipient_budget; catalog = selected_products |
| Employee list (recipients) | ✅ Step 2: select from **employees** | **Add:** CSV upload + optional manual entry; store in `campaign_recipients` (name, email, designation, department, phone) |
| Gift selection (tokenized link, no login) | ❌ | **Add:** `gift_links` table, public route `/g/[token]`, email send (Resend) |
| Employee “dashboard” (repurpose) | ✅ Employee role + dashboard | **Repurpose:** After using gift link, employee can see “my gift / status” (same token or lightweight session) |
| Orders & fulfillment | ✅ `orders`, `order_items` | **Add:** vendor assignment (multi-vendor per order), vendor dashboard |
| Internal Ops panel | Partial (SUPER_ADMIN sees all) | **Add:** Ops role (or reuse SUPER_ADMIN) + views: Campaigns → Orders → Vendor assignment, cost vs price, status, SLA, overrides |
| Vendors | ❌ | **Add:** `vendors` table, `order_vendor_assignments` (or line-level), vendor portal (login, POs, status) |
| Invoicing | ❌ | **Add:** Consolidated invoice PDF per campaign (Indian GST) |

---

## 3. Data Model Additions

- **campaign_recipients**  
  - `id`, `campaign_id`, `name`, `email`, `designation`, `department`, `phone`, `gift_link_token`, `link_expires_at`, `gift_selected_at`, `order_id` (nullable), `created_at`, `updated_at`  
  - Token unique; used in `/g/[token]`.

- **gift_links** (optional; can be merged into campaign_recipients)  
  - If separate: `id`, `campaign_recipient_id`, `token`, `expires_at`, `used_at`, `created_at`.

- **vendors**  
  - `id`, `name`, `email`, `contact_phone`, `categories` (e.g. welcome_kits, apparel), `sla_days`, `gstin`, `is_active`, `created_at`, `updated_at`.

- **order_vendor_assignments** (multi-vendor per order)  
  - `id`, `order_id`, `vendor_id`, `status` (pending/accepted/shipped/delivered), `cost`, `po_sent_at`, `tracking_number`, `created_at`, `updated_at`.  
  - One order can have multiple rows (one per vendor).

- **campaigns** (add columns)  
  - `link_valid_until` (timestamp; HR-set validity), `allow_edit_when_live` (boolean; true = HR can edit when Live).

- **companies** (for invoice)  
  - Ensure `gstin`, `billing_address`, etc., exist for Indian GST invoice.

---

## 4. Feature Implementation Checklist

### 4.1 Auth
- [ ] Add magic link sign-in (Supabase magic link) alongside password.
- [ ] UI: “Sign in with email” → enter email → send magic link; keep “Sign in with password” option.

### 4.2 Campaign (HR)
- [ ] Campaign type: onboarding / festival / other (map to existing trigger or new enum).
- [ ] Per-recipient budget: already in wizard; enforce in UI and when generating gift options.
- [ ] Catalog: HR selects individual products (current step 3); ensure only products within per-recipient budget are shown to employee.
- [ ] **CSV upload:** Accept CSV with columns: name, email, designation, department, phone. Create/update `campaign_recipients`; no account required for recipients.
- [ ] **Link validity:** Campaign field `link_valid_until` (and optionally “valid for N days after end”). Show in wizard and campaign detail.
- [ ] **Editable when Live:** Allow HR to edit campaign (recipients, catalog, dates, etc.) when status = Live; persist `allow_edit_when_live` if needed for logic.

### 4.3 Employee Gift Selection (tokenized, no login)
- [ ] Generate unique token per `campaign_recipient`; store in DB.
- [ ] Public route: `/g/[token]` (or `/gift/[token]`).
- [ ] Page: show campaign name, list of gifts within budget (from campaign’s selected_products), employee selects one, enters shipping address + size/color if needed.
- [ ] On submit: create/update order (or gift record), mark recipient as “gift_selected_at”, send confirmation (email).
- [ ] If token expired or invalid: show friendly message.

### 4.4 Email (Resend)
- [ ] Send magic link email (admin).
- [ ] Send gift selection link to each recipient (email only): link = `https://<domain>/g/<token>`.
- [ ] Send confirmation after employee selects gift.

### 4.5 Repurpose Employee Dashboard
- [ ] If user has role Employee and arrived via token/session: show “My gift” / “Gift status” (e.g. ordered, shipped, delivered).
- [ ] Option A: employee visits `/g/[token]` and after selection can “View status” (link or button) using same token.
- [ ] Option B: optional lightweight “employee session” after gift selection (e.g. cookie with token) to show status on a simple `/my-gift` page.
- [ ] Reuse existing Employee dashboard layout with new content: gift status, tracking if available.

### 4.6 Internal Ops Panel
- [ ] Define role: e.g. `OPS` or use `SUPER_ADMIN` with ops-specific views.
- [ ] Views: list all campaigns → drill to campaign → orders → per-order vendor assignment(s).
- [ ] Assign vendor(s) to order (multi-vendor); show cost vs selling price (margin).
- [ ] Order status: Pending / Accepted / Shipped / Delivered; SLA flags; manual overrides.

### 4.7 Vendors
- [ ] **Vendor dashboard:** Vendor logs in (separate auth or same app with role VENDOR). See POs/orders assigned to them; update status (accepted/shipped/delivered), add tracking.
- [ ] **Multi-vendor:** When order has items from multiple vendors, create one assignment per vendor; each vendor sees only their lines (or their PO).

### 4.8 Invoicing
- [ ] Consolidated invoice PDF per campaign: company details, GSTIN, HSN, line items (recipients/orders), amounts, tax, total. Standard Indian GST invoice format.

### 4.9 Non-functional
- [ ] Mobile-responsive gift selection page.
- [ ] Secure tokenized links (HTTPS, token entropy, expiry).
- [ ] Basic audit logging (campaign create/edit, order create, vendor assign).

---

## 5. Suggested Implementation Order

1. **Data model** – Add `campaign_recipients`, extend `campaigns`, add `vendors`, `order_vendor_assignments` (migrations).
2. **Magic link** – Auth option for HR/Admin.
3. **CSV upload + link validity** – Campaign wizard: upload CSV, set validity; create recipients and tokens.
4. **Gift selection page** – Public `/g/[token]`, show catalog within budget, collect address/size, create order.
5. **Email** – Resend: gift link email, confirmation email.
6. **Repurpose employee dashboard** – “My gift” / status view (token or session).
7. **Ops panel** – Campaign → Orders → Vendor assignment, margin, status, overrides.
8. **Vendor dashboard** – Vendor login, view POs, update status/tracking.
9. **Indian GST invoice** – PDF generation per campaign.

---

## 6. Files / Areas to Touch (High Level)

- **Auth:** `app/(auth)/login`, Supabase magic link, `actions/auth.ts`.
- **Campaigns:** `actions/campaigns.ts`, wizard steps (step1–step6), new step or modal for CSV upload, link validity.
- **Gift selection:** New route `app/g/[token]/page.tsx`, server action to validate token and submit selection.
- **Recipients:** New table + `actions/campaign-recipients.ts` (or under campaigns).
- **Email:** `lib/email-notifications.ts` or new Resend integration; call from campaign “launch” and after gift selection.
- **Ops:** New role (or SUPER_ADMIN), `app/(dashboard)/ops/` or reuse campaigns/orders with ops-only views.
- **Vendors:** `app/(dashboard)/vendors/`, `app/(dashboard)/vendor-portal/` or subdomain, `actions/vendors.ts`, `order_vendor_assignments`.
- **Invoice:** New `lib/invoice-pdf.ts` or server action, Indian GST template.

This document should be the single reference for “map existing and add” for PRD V1.
