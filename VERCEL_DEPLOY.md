# Vercel Deployment Guide

## Quick Setup

Since your Next.js app is in the `platform/` subdirectory, you need to configure Vercel to use it as the root directory.

### Option 1: Vercel Dashboard (Recommended)

1. Go to your Vercel project settings
2. Navigate to **Settings** → **General**
3. Under **Root Directory**, click **Edit**
4. Set the root directory to: `platform`
5. Click **Save**

Vercel will automatically detect Next.js and use the correct build settings.

### Option 2: Using vercel.json

The `vercel.json` file in the root is configured, but you still need to set the root directory in Vercel dashboard:

1. Go to **Settings** → **General**
2. Set **Root Directory** to: `platform`

### Environment Variables

Don't forget to add your environment variables in Vercel:

1. Go to **Settings** → **Environment Variables**
2. Add the following:
   - `NEXT_PUBLIC_SUPABASE_URL` - Your Supabase project URL
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY` - Your Supabase anon key
   - `SUPABASE_SERVICE_ROLE_KEY` - Your Supabase service role key (optional, for server-side operations)

### Build Settings

Vercel should automatically detect:
- **Framework Preset**: Next.js
- **Build Command**: `npm run build` (runs in platform directory)
- **Output Directory**: `.next`
- **Install Command**: `npm install`

### After Deployment

1. Your app will be available at your Vercel domain
2. Make sure to set up your Supabase database (see `SUPABASE_SETUP.md`)
3. Test the authentication flow
4. Verify all pages load correctly

### Troubleshooting

If you still get the "No Next.js version detected" error:

1. Make sure **Root Directory** is set to `platform` in Vercel dashboard
2. Verify `platform/package.json` exists and has `next` in dependencies
3. Check that `platform/next.config.ts` exists
4. Try redeploying after setting the root directory
