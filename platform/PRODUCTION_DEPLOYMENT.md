# Production deployment checklist

## Environment variables

Set these in your hosting provider (e.g. Vercel → Settings → Environment Variables):

| Variable | Required | Description |
|----------|----------|-------------|
| `NEXT_PUBLIC_SITE_URL` | Yes (production) | Canonical site URL, e.g. `https://goodies.so` |
| `NEXT_PUBLIC_SUPABASE_URL` | Yes | Supabase project URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Yes | Supabase anon/public key |
| `SUPABASE_SERVICE_ROLE_KEY` | Optional | For server-side admin operations |

## Pre-launch

- [ ] Set `NEXT_PUBLIC_SITE_URL` to your production domain
- [ ] Run `npm run build` and fix any errors
- [ ] Run `npm run lint` (or re-enable `ignoreDuringBuilds` in `next.config.ts`)
- [ ] Test auth flow (signup, login, magic link)
- [ ] Test critical paths: landing → signup → dashboard
- [ ] Verify sitemap: `https://your-domain.com/sitemap.xml`
- [ ] Verify robots: `https://your-domain.com/robots.txt`
- [ ] (Optional) Add error monitoring (e.g. Sentry) and set `NODE_ENV=production`

## SEO

- Metadata, Open Graph, and Twitter cards are set via `lib/seo.ts` and `lib/site.ts`
- Root layout includes Organization + WebSite JSON-LD
- Home page includes FAQPage JSON-LD for rich results
- Login/signup and dashboard are noindexed
- Sitemap includes: `/`, `/contact`, `/privacy`, `/terms`

## Security headers

Configured in `next.config.ts`:

- `X-Frame-Options: SAMEORIGIN`
- `X-Content-Type-Options: nosniff`
- `Referrer-Policy: strict-origin-when-cross-origin`
- `Permissions-Policy` (camera, microphone, geolocation disabled)
- `X-Powered-By` header removed
