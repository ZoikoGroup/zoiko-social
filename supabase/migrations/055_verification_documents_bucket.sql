-- ── Verification documents — PRIVATE storage bucket ──────────────────────────
-- Professional verification asks members for identity documents, business
-- licences and vet registrations. Every other bucket on this project is public,
-- which is fine for avatars and post media and completely wrong for these: a
-- public URL to a passport scan is a data breach with extra steps.
--
-- So this bucket is private. Members may only write and read inside their own
-- {user_id}/... prefix, there is no public read policy at all, and reviewers
-- reach a document through a short-lived signed URL minted by the API
-- (GET /profiles/verification/documents/:id/url), which checks that the caller
-- is either the owner or staff before signing.
--
-- Idempotent.

INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'verification-docs',
  'verification-docs',
  false,
  10485760, -- 10 MB
  ARRAY['image/jpeg', 'image/png', 'image/webp', 'application/pdf']
)
ON CONFLICT (id) DO UPDATE
  SET public             = false,
      file_size_limit    = EXCLUDED.file_size_limit,
      allowed_mime_types = EXCLUDED.allowed_mime_types;

-- Path convention: verification-docs/{user_id}/verification/{uuid}.{ext}
-- storage.foldername(name)[1] is the owner segment.

DROP POLICY IF EXISTS "verification_docs_insert_own" ON storage.objects;
CREATE POLICY "verification_docs_insert_own" ON storage.objects
  FOR INSERT WITH CHECK (
    bucket_id = 'verification-docs'
    AND (storage.foldername(name))[1] = auth.uid()::text
  );

DROP POLICY IF EXISTS "verification_docs_select_own" ON storage.objects;
CREATE POLICY "verification_docs_select_own" ON storage.objects
  FOR SELECT USING (
    bucket_id = 'verification-docs'
    AND (storage.foldername(name))[1] = auth.uid()::text
  );

-- Members may replace a document they uploaded by mistake, up until review.
DROP POLICY IF EXISTS "verification_docs_delete_own" ON storage.objects;
CREATE POLICY "verification_docs_delete_own" ON storage.objects
  FOR DELETE USING (
    bucket_id = 'verification-docs'
    AND (storage.foldername(name))[1] = auth.uid()::text
  );
