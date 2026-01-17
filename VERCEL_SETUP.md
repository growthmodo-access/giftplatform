# Vercel Deployment - Step by Step

## Critical: Set Root Directory in Vercel Dashboard

The `package.json` is in the `platform/` subdirectory, so you MUST configure Vercel to use it as the root.

### Steps:

1. **Go to Vercel Dashboard**
   - Open your project: https://vercel.com/dashboard
   - Click on your project

2. **Navigate to Settings**
   - Click **Settings** in the top navigation
   - Click **General** in the left sidebar

3. **Set Root Directory**
   - Scroll down to **Root Directory**
   - Click **Edit**
   - Enter: `platform`
   - Click **Save**

4. **Verify Build Settings**
   - After setting root directory, Vercel should auto-detect:
     - Framework: Next.js
     - Build Command: `npm run build`
     - Output Directory: `.next`
     - Install Command: `npm install`

5. **Add Environment Variables**
   - Go to **Settings** → **Environment Variables**
   - Add:
     ```
     NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
     NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
     SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
     ```

6. **Redeploy**
   - Go to **Deployments** tab
   - Click the **⋯** menu on the latest deployment
   - Click **Redeploy**

## Why This Error Happens

The error `Could not read package.json: Error: ENOENT` happens because:
- Vercel is looking for `package.json` in the repository root
- But your `package.json` is in the `platform/` subdirectory
- Setting Root Directory tells Vercel where to find it

## Alternative: Move package.json to Root (Not Recommended)

If you want to avoid the root directory setting, you could move everything from `platform/` to root, but this would require restructuring the entire project.

## Verification

After setting the root directory, the build should:
1. Find `platform/package.json` ✅
2. Run `npm install` in `platform/` directory ✅
3. Run `npm run build` in `platform/` directory ✅
4. Output to `platform/.next` ✅
