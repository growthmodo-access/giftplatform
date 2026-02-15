# Supabase trigger: auto-create user profile

## Overview

A database trigger ensures that when a new row is inserted into `auth.users` (sign-up), a corresponding row is created in `public.users`. This is more reliable than creating the profile from the client.

## What it does

- **Trigger:** `on_auth_user_created`
- **Fires:** `AFTER INSERT` on `auth.users`
- **Function:** `public.handle_new_user()`
- **Effect:** Inserts one row into `public.users` with:
  - `id` = auth user id
  - `email` = auth user email
  - `name` = from `raw_user_meta_data->>'name'` (or NULL)
  - `role` = `'MANAGER'` (placeholder)
  - `company_id` = `NULL`

## Why MANAGER + NULL?

The `public.users` table has a check constraint: **HR** and **EMPLOYEE** must have a non-NULL `company_id`. The trigger cannot know the real role or company at sign-up time, so it uses:

- **role:** `MANAGER` (allowed with NULL `company_id`)
- **company_id:** `NULL`

The app (or an admin flow) should then **upsert** the user with the real `role` and `company_id` (e.g. after invite acceptance or onboarding).

## Setup

1. In Supabase: **SQL Editor** → New query.
2. Run the contents of **`platform/supabase-trigger-user-profile.sql`**.
3. If the function already exists from an older version that used `EMPLOYEE` + NULL, run **`platform/migrations/fix-handle-new-user-trigger-constraint.sql`** to replace it with the MANAGER + NULL version (avoids constraint violations).

## Files

| File | Purpose |
|------|--------|
| `platform/supabase-trigger-user-profile.sql` | Full trigger + function (create or replace). |
| `platform/migrations/fix-handle-new-user-trigger-constraint.sql` | Fix only: replace function with MANAGER + NULL. |

## Verifying

After running the trigger SQL:

- Create a new user via Supabase Auth (e.g. sign up in the app or add user in Dashboard).
- Check `public.users`: there should be a row with that user’s `id`, `email`, `role = 'MANAGER'`, and `company_id IS NULL`.
