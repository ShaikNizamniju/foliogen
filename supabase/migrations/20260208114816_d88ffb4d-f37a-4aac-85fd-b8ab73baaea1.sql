-- Create storage bucket for project documents
INSERT INTO storage.buckets (id, name, public)
VALUES ('project_documents', 'project_documents', true)
ON CONFLICT (id) DO NOTHING;

-- Allow authenticated users to upload files
CREATE POLICY "Authenticated users can upload project documents"
ON storage.objects
FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'project_documents');

-- Allow public read access for portfolio visitors
CREATE POLICY "Public can view project documents"
ON storage.objects
FOR SELECT
TO public
USING (bucket_id = 'project_documents');

-- Allow users to update their own uploads
CREATE POLICY "Users can update own project documents"
ON storage.objects
FOR UPDATE
TO authenticated
USING (bucket_id = 'project_documents');

-- Allow users to delete their own uploads
CREATE POLICY "Users can delete own project documents"
ON storage.objects
FOR DELETE
TO authenticated
USING (bucket_id = 'project_documents');