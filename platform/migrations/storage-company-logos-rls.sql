-- Storage RLS: allow authenticated users to upload and read company logos.
-- Fixes "Logo upload failed: new row violates row-level security policy".
--
-- 1. In Supabase Dashboard → Storage, create a bucket named exactly: company-logos
--    (set to Public if you want logo URLs to work without auth).
-- 2. Run this entire script in SQL Editor.

DROP POLICY IF EXISTS "company-logos allow authenticated upload" ON storage.objects;
DROP POLICY IF EXISTS "company-logos allow public read" ON storage.objects;
DROP POLICY IF EXISTS "company-logos allow authenticated update" ON storage.objects;
DROP POLICY IF EXISTS "company-logos allow authenticated delete" ON storage.objects;

CREATE POLICY "company-logos allow authenticated upload"
ON storage.objects FOR INSERT TO authenticated
WITH CHECK (bucket_id = 'company-logos');

CREATE POLICY "company-logos allow public read"
ON storage.objects FOR SELECT TO public
USING (bucket_id = 'company-logos');

CREATE POLICY "company-logos allow authenticated update"
ON storage.objects FOR UPDATE TO authenticated
USING (bucket_id = 'company-logos');

CREATE POLICY "company-logos allow authenticated delete"
ON storage.objects FOR DELETE TO authenticated
USING (bucket_id = 'company-logos');
