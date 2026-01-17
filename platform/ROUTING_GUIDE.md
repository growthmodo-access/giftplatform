# Routing Guide - Landing Page & App

## Current Setup

Your landing page and app are **already integrated** and will both be hosted on Vercel together!

### URL Structure

When deployed to Vercel, your site will have:

- **`/`** → Landing Page (marketing site)
- **`/login`** → Login page
- **`/signup`** → Signup page  
- **`/dashboard`** → Main dashboard (protected)
- **`/products`** → Products page (protected)
- **`/orders`** → Orders page (protected)
- **`/employees`** → Employees page (protected)
- **`/gifts`** → Gifts page (protected)
- **`/automation`** → Automation page (protected)
- **`/analytics`** → Analytics page (protected)
- **`/settings`** → Settings page (protected)

### How It Works

1. **Landing Page** (`app/page.tsx`)
   - Serves at the root URL `/`
   - Public access - no authentication required
   - Contains all marketing content

2. **Authentication** (`app/(auth)/`)
   - `/login` and `/signup` routes
   - Public access
   - Redirects to `/dashboard` after login

3. **Dashboard** (`app/(dashboard)/`)
   - All dashboard routes are protected
   - Requires authentication
   - Redirects to `/login` if not authenticated

### Middleware Protection

The `middleware.ts` file handles:
- Protecting dashboard routes
- Redirecting unauthenticated users to login
- Redirecting authenticated users away from auth pages

## Deployment on Vercel

When you deploy to Vercel:

1. **Single Deployment** - Everything is in one Next.js app
2. **Single Domain** - All routes on the same domain
3. **Automatic Routing** - Next.js handles all routing
4. **SEO Friendly** - Landing page is server-rendered

### Example URLs After Deployment

Production domain: `goodies.so`

- `https://goodies.so/` → Landing page
- `https://goodies.so/login` → Login
- `https://goodies.so/dashboard` → Dashboard

## Custom Domain

The custom domain `goodies.so` should be configured in Vercel:

1. Go to **Settings** → **Domains**
2. Verify `goodies.so` is added
3. Ensure DNS is properly configured
4. The site will be available at `https://goodies.so`
4. All routes will work on your custom domain

## Separate Landing Page (Alternative)

If you want the landing page on a **completely separate** deployment:

### Option 1: Separate Next.js App
- Create a new Next.js app just for landing page
- Deploy to a different Vercel project
- Use different domain/subdomain

### Option 2: Static Export
- Export landing page as static HTML
- Deploy to Vercel or another static host
- Keep app separate

**However, the current integrated approach is recommended** because:
- ✅ Single codebase
- ✅ Shared components and styles
- ✅ Easy navigation between landing and app
- ✅ Better SEO and performance
- ✅ Simpler deployment

## Current Setup is Optimal

Your current setup is perfect for Vercel:
- Landing page at `/` (public)
- App at `/dashboard/*` (protected)
- Everything in one deployment
- Automatic routing
- No additional configuration needed

Just deploy to Vercel and everything will work! 🚀
