# Store URL and SSL (ERR_SSL_PROTOCOL_ERROR)

If you see **"This site can't provide a secure connection"** or **ERR_SSL_PROTOCOL_ERROR** when opening the store URL, the browser is reaching a server that isn’t serving valid HTTPS for that hostname.

## Quick fix: use your main app domain for stores

Store links are driven by **NEXT_PUBLIC_SITE_URL** (or **NEXT_PUBLIC_APP_URL** / **NEXT_PUBLIC_STORE_URL**). If your main app is on **goodies.so** and that domain has valid SSL:

1. Set in Vercel (or your host) environment variables:
   - `NEXT_PUBLIC_SITE_URL=https://goodies.so`
   - (Optional) `NEXT_PUBLIC_STORE_URL=https://goodies.so` if you want a store-specific override.

2. Redeploy. Store URLs become: `https://goodies.so/companies/your-store-id`

Then open the store at `https://goodies.so/companies/...` — no separate domain or SSL needed.

## If you want the store on a separate domain

1. **Add the domain in Vercel** (Project → **Settings** → **Domains**).
2. **Point DNS to Vercel** (A or CNAME as Vercel instructs).
3. **Wait for SSL** (Vercel provisions it automatically; can take a few minutes to hours).
4. Set `NEXT_PUBLIC_STORE_URL=https://your-store-domain.com` and redeploy.
