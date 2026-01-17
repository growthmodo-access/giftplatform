# CRITICAL: Set Root Directory in Vercel Dashboard

## The Error
```
sh: line 1: cd: platform: No such file or directory
Error: Command "cd platform && npm install" exited with 1
```

This happens because **Root Directory must be set in Vercel Dashboard**.

## Solution: Set Root Directory

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

4. **Verify**
   - After saving, you should see:
     - Root Directory: `platform`
     - Framework: Next.js
     - Build Command: `npm run build`
     - Output Directory: `.next`
     - Install Command: `npm install`

5. **Redeploy**
   - Go to **Deployments** tab
   - Click **⋯** on latest deployment
   - Click **Redeploy**

## Why This Is Required

When Root Directory is set to `platform`:
- ✅ Vercel automatically runs commands in `platform/` directory
- ✅ No need for `cd platform` in commands
- ✅ Finds `package.json` in `platform/`
- ✅ Builds from correct location

## After Setting Root Directory

The `vercel.json` is now configured to work WITH Root Directory setting:
- `installCommand`: `npm install` (runs in platform/)
- `buildCommand`: `npm run build` (runs in platform/)
- `outputDirectory`: `.next` (in platform/)

**This will work once Root Directory is set to `platform` in the dashboard!**
