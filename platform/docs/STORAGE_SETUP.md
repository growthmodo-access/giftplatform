# Storage setup (product images)

If you see **"Image upload failed: Bucket not found"** or **"new row violates row-level security policy"** when uploading product images:

## 1. Create the bucket

1. In **Supabase Dashboard** go to **Storage**.
2. Click **New bucket**.
3. Name: `product-images`
4. Enable **Public bucket** (so product images can be displayed without signed URLs).
5. Create the bucket.

## 2. Allow uploads via RLS

Run the migration **`migrations/storage-product-images-rls.sql`** in the Supabase SQL Editor. It adds policies on `storage.objects` so that:

- Authenticated users can **upload** (INSERT) and **update/delete** objects in `product-images`.
- Anyone can **read** (SELECT) so image URLs work.

After both steps, adding/editing products with images will work.
