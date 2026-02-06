# Platform scripts

## Test users (admin login for testing)

To create test users you can log in with (including an **admin** account):

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
| manager@test.com     | MANAGER     |
| employee@test.com     | EMPLOYEE    |

Use **admin@test.com** / **Test123!@#** for admin login testing.
