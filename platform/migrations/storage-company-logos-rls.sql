-- Storage RLS: allow authenticated users to upload and read company logos.
-- Create the bucket "company-logos" in Supabase Dashboard → Storage first, then run this.

-- Allow authenticated users to upload (INSERT) to company-logos bucket
CREATE POLICY "company-logos allow authenticated upload"
ON storage.objects
FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'company-logos');

-- Allow public read so company logo URLs work (bucket is public)
CREATE POLICY "company-logos allow public read"
ON storage.objects
FOR SELECT
TO public
USING (bucket_id = 'company-logos');

-- Allow authenticated users to update/delete their uploads
CREATE POLICY "company-logos allow authenticated update"
ON storage.objects
FOR UPDATE
TO authenticated
USING (bucket_id = 'company-logos');

CREATE POLICY "company-logos allow authenticated delete"
ON storage.objects
FOR DELETE
TO authenticated
USING (bucket_id = 'company-logos');
