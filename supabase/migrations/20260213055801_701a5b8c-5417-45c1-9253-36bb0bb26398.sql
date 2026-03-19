-- Fix project_documents INSERT policy to require ownership verification
DROP POLICY IF EXISTS "Authenticated users can upload project documents" ON storage.objects;

DROP POLICY IF EXISTS "Users can upload their own project documents" ON storage.objects;
CREATE POLICY "Users can upload their own project documents"
ON storage.objects
FOR INSERT
TO authenticated
WITH CHECK (
  bucket_id = 'project_documents' 
  AND auth.uid()::text = (storage.foldername(name))[1]
);

-- Add RLS policies to rate_limits table (currently has RLS enabled but no policies)
DROP POLICY IF EXISTS "Rate limits are managed by functions only" ON public.rate_limits;
CREATE POLICY "Rate limits are managed by functions only"
ON public.rate_limits
FOR ALL
USING (false);
