# Platform scripts

## Test users (all roles)

Create test users for every role so you can log in and test the app:

1. Set `SUPABASE_SERVICE_ROLE_KEY` in `.env.local`.
2. From the `platform` directory run:
   ```bash
   npm run seed:test-users
   ```
   Or: `npx tsx scripts/create-test-users.ts`

**Default password for all test users:** `Test123!@#`

| Email                 | Role        |
|-----------------------|-------------|
| superadmin@test.com   | SUPER_ADMIN |
| admin@test.com        | ADMIN       |
| hr@test.com           | HR          |
| manager@test.com      | MANAGER     |
| employee@test.com     | EMPLOYEE    |

---

## Mock data (for all roles)

After creating test users, seed products, orders, campaigns, and gifts so each role has data to see:

```bash
npm run seed:mock-data
```

Or: `npx tsx scripts/seed-mock-data.ts`

This will:

- Create **Test Company** if missing and add 4 mock products (swag, gift card, earbuds, experience).
- Add 6 mock orders (so Dashboard and Analytics show data for ADMIN/HR/MANAGER).
- Add 2 mock campaigns (DRAFT + SENT) for the test company.
- Add 2 mock gifts for **employee@test.com** (so Employees see gifts).
- Create a second company **Acme Corp** with one product and one order so **SUPER_ADMIN** sees multiple companies.

Run `seed:test-users` first; then run `seed:mock-data`. Safe to run multiple times (skips existing data).
