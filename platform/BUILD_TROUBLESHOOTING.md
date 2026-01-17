# Build Troubleshooting Guide

## Common Build Errors & Solutions

### Error: "Command 'npm run build' exited with 1"

This error means the build failed. Check the build logs for the specific error message.

#### Most Common Causes:

1. **Root Directory Not Set in Vercel**
   - **Error**: "No Next.js version detected" or "cd: platform: No such file or directory"
   - **Solution**: 
     - Go to Vercel Dashboard → Settings → General
     - Set "Root Directory" to: `platform`
     - Save and redeploy

2. **Missing Environment Variables**
   - **Error**: Build succeeds but app fails at runtime
   - **Solution**: 
     - Go to Vercel Dashboard → Settings → Environment Variables
     - Add: `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY`
     - Redeploy

3. **TypeScript Errors**
   - **Error**: Type errors in build logs
   - **Solution**: 
     - Run `npm run type-check` locally to see errors
     - Fix TypeScript errors
     - Commit and push

4. **Missing Dependencies**
   - **Error**: "Module not found" or "Cannot find module"
   - **Solution**: 
     - Run `npm install` in `platform/` directory
     - Commit `package-lock.json` if it changed
     - Push and redeploy

5. **Import/Export Errors**
   - **Error**: "Cannot find module" or "Export not found"
   - **Solution**: 
     - Check all import paths use `@/` alias correctly
     - Verify all exports exist
     - Check file extensions

## How to Get the Actual Error

1. Go to Vercel Dashboard
2. Click on your project
3. Go to "Deployments" tab
4. Click on the failed deployment
5. Scroll down to see the full build logs
6. Look for the red error message

## Quick Fixes

### If build fails with env var errors:
- The code now allows builds without env vars
- Set them in Vercel Dashboard for runtime

### If build fails with "cd: platform: No such file or directory":
- Set Root Directory to `platform` in Vercel Dashboard

### If build fails with TypeScript errors:
- Check the specific error in build logs
- Fix the TypeScript issue
- Commit and push

## Still Having Issues?

1. Check the full build logs in Vercel
2. Copy the exact error message
3. Check if it's one of the common issues above
4. If not, the error message will tell you what's wrong
