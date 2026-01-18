# ⚠️ CRITICAL: Vercel Root Directory Setup Required

## The Error
```
Command "cd platform && npm install" exited with 1
```

This error occurs because **Root Directory must be set in Vercel Dashboard**.

## Solution: Set Root Directory (REQUIRED)

### Step-by-Step:

1. **Go to Vercel Dashboard**
   - Visit: https://vercel.com/dashboard
   - Click on your project

2. **Open Settings → General**
   - Click **Settings** in top navigation
   - Click **General** in left sidebar

3. **Set Root Directory**
   - Scroll to **"Root Directory"** section
   - Click **"Edit"**
   - Type exactly: `platform`
   - Click **"Save"**

4. **Verify Settings**
   After saving, you should see:
   - ✅ Root Directory: `platform`
   - ✅ Framework: Next.js (auto-detected)
   - ✅ Build Command: `npm run build`
   - ✅ Output Directory: `.next`
   - ✅ Install Command: `npm install`

5. **Redeploy**
   - Go to **Deployments** tab
   - Click **⋯** on latest deployment
   - Click **Redeploy**

## Why This Is Required

When Root Directory is set to `platform`:
- ✅ Vercel automatically runs all commands in `platform/` directory
- ✅ No need for `cd platform` in commands
- ✅ Finds `package.json` in `platform/`
- ✅ Builds from correct location
- ✅ Outputs to `platform/.next`

## Current vercel.json Configuration

The `vercel.json` is now simplified because Root Directory handles the path:
```json
{
  "buildCommand": "npm run build",
  "outputDirectory": ".next",
  "installCommand": "npm install",
  "devCommand": "npm run dev",
  "framework": "nextjs"
}
```

**These commands run in `platform/` directory automatically when Root Directory is set.**

## Environment Variables

Also make sure these are set in Vercel Dashboard → Settings → Environment Variables:
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `SUPABASE_SERVICE_ROLE_KEY` (optional)

## Verification

After setting Root Directory, check the build logs:
- Should see: "Installing dependencies from platform/package.json"
- Should see: "Running build command in platform/"
- Should succeed! ✅
