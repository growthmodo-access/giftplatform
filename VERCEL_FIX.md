# Fix Vercel Build Error - Step by Step

## The Problem

Vercel is looking for `package.json` in the root, but your Next.js app is in the `platform/` subdirectory.

## Solution: Set Root Directory in Vercel Dashboard

This is **REQUIRED** and must be done in the Vercel dashboard.

### Step-by-Step Instructions:

1. **Go to Vercel Dashboard**
   - Visit: https://vercel.com/dashboard
   - Click on your project

2. **Open Settings**
   - Click **Settings** in the top navigation bar
   - Click **General** in the left sidebar

3. **Find Root Directory**
   - Scroll down to find **"Root Directory"** section
   - You'll see it says something like "No root directory" or shows the current setting

4. **Edit Root Directory**
   - Click the **"Edit"** button next to Root Directory
   - A text input will appear
   - Type exactly: `platform`
   - Click **"Save"**

5. **Verify Settings**
   - After saving, you should see:
     - Root Directory: `platform`
     - Framework: Next.js (auto-detected)
     - Build Command: `npm run build` (runs in platform/)
     - Output Directory: `.next` (in platform/)

6. **Redeploy**
   - Go to **Deployments** tab
   - Find your latest deployment
   - Click the **⋯** (three dots) menu
   - Click **Redeploy**

## What This Does

Setting Root Directory to `platform` tells Vercel:
- ✅ Look for `package.json` in `platform/` directory
- ✅ Run `npm install` in `platform/` directory  
- ✅ Run `npm run build` in `platform/` directory
- ✅ Output build to `platform/.next`

## Alternative: Move Everything to Root (Not Recommended)

If you don't want to use Root Directory setting, you could move all files from `platform/` to root, but this requires:
- Moving all files
- Updating all import paths
- More complex restructuring

**The Root Directory setting is much simpler!**

## Verification

After setting Root Directory, check the build logs:
- Should see: "Installing dependencies from platform/package.json"
- Should see: "Running build command in platform/"
- Should succeed! ✅

## Still Having Issues?

If you've set Root Directory but still get errors:

1. **Double-check the setting**
   - Make sure it says exactly `platform` (lowercase, no trailing slash)

2. **Check for typos**
   - Should be `platform` not `Platform` or `platform/`

3. **Clear and redeploy**
   - Delete the deployment
   - Push a new commit
   - Let Vercel redeploy fresh

4. **Check build logs**
   - Look for the exact error message
   - Share it if you need help

## Quick Checklist

- [ ] Root Directory set to `platform` in Vercel Dashboard
- [ ] Environment variables added (Supabase credentials)
- [ ] Latest code pushed to GitHub
- [ ] Deployment triggered/redeployed

Once Root Directory is set, the build should work! 🚀
