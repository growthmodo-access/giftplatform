-- Storage RLS: allow authenticated users to upload and read product images.
-- Fixes "Image upload failed: new row violates row-level security policy" when adding product images.
-- Run this after creating the bucket "product-images" in Supabase Dashboard → Storage.

-- Allow authenticated users to upload (INSERT) to product-images bucket
CREATE POLICY "product-images allow authenticated upload"
ON storage.objects
FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'product-images');

-- Allow public read so product image URLs work (bucket is public)
CREATE POLICY "product-images allow public read"
ON storage.objects
FOR SELECT
TO public
USING (bucket_id = 'product-images');

-- Allow authenticated users to update/delete their uploads if needed (e.g. replace image)
CREATE POLICY "product-images allow authenticated update"
ON storage.objects
FOR UPDATE
TO authenticated
USING (bucket_id = 'product-images');

CREATE POLICY "product-images allow authenticated delete"
ON storage.objects
FOR DELETE
TO authenticated
USING (bucket_id = 'product-images');
