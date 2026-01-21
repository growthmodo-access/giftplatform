# Vercel Build Fix

## Issue
Build failing on Vercel with `npm run build` exited with 1

## Root Cause
Missing dependencies in `platform/package.json` that were only in root `package.json`:
- `react-day-picker`
- `@radix-ui/react-progress`

## Fix Applied
1. ✅ Installed `react-day-picker` and `@radix-ui/react-progress` in `platform/package.json`
2. ✅ Updated `vercel.json` with `rootDirectory: "platform"`

## Vercel Dashboard Configuration Required

**IMPORTANT:** You must also set the Root Directory in Vercel Dashboard:

1. Go to Vercel Dashboard → Your Project → Settings → General
2. Find "Root Directory" section
3. Click "Edit" and set it to: `platform`
4. Click "Save"
5. Redeploy your project

## Verify Build Settings

After setting Root Directory, Vercel should show:
- **Root Directory**: `platform`
- **Framework**: Next.js
- **Build Command**: `npm run build`
- **Output Directory**: `.next`
- **Install Command**: `npm install`

## Environment Variables

Make sure these are set in Vercel Dashboard → Settings → Environment Variables:
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `SUPABASE_SERVICE_ROLE_KEY` (optional)

## Test Build Locally

To test if the build will work on Vercel:
```bash
cd platform
npm install
npm run build
```

If this succeeds locally, it should work on Vercel after setting Root Directory.
