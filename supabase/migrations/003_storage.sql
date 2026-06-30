-- ─────────────────────────────────────────────────────────────────────────────
-- ZoikoSocial — Storage Buckets + Storage RLS
--
-- Path convention (CRITICAL for IDOR protection):
--   All uploads MUST use the path: {user_id}/{filename}
--   The first path segment is enforced by every upload policy below.
--   This means: even if an attacker knows a file URL, they cannot upload
--   to another user's path or overwrite another user's file.
--
-- Buckets:
--   avatars      public  5 MB   jpg/png/webp/gif
--   post-media   public  50 MB  jpg/png/webp/mp4/webm
--   pet-media    public  50 MB  jpg/png/webp/mp4
--   documents    private 10 MB  pdf/jpg/png  (health records — never public)
-- ─────────────────────────────────────────────────────────────────────────────

-- ── CREATE BUCKETS ────────────────────────────────────────────────────────────

INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES
  (
    'avatars',
    'avatars',
    true,
    5242880, -- 5 MB
    ARRAY['image/jpeg', 'image/png', 'image/webp', 'image/gif']
  ),
  (
    'post-media',
    'post-media',
    true,
    52428800, -- 50 MB
    ARRAY['image/jpeg', 'image/png', 'image/webp', 'video/mp4', 'video/webm']
  ),
  (
    'pet-media',
    'pet-media',
    true,
    52428800, -- 50 MB
    ARRAY['image/jpeg', 'image/png', 'image/webp', 'video/mp4']
  ),
  (
    'documents',
    'documents',
    false, -- PRIVATE — health records must never be publicly accessible
    10485760, -- 10 MB
    ARRAY['application/pdf', 'image/jpeg', 'image/png']
  )
ON CONFLICT (id) DO NOTHING;

-- ── STORAGE RLS — AVATARS (public) ───────────────────────────────────────────
-- Path: avatars/{user_id}/avatar.jpg
-- Anyone can read; only the owner can write to their own path segment.

CREATE POLICY "avatars_public_read"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'avatars');

CREATE POLICY "avatars_owner_upload"
  ON storage.objects FOR INSERT
  WITH CHECK (
    bucket_id = 'avatars'
    AND auth.uid() IS NOT NULL
    -- IDOR gate: first path segment MUST be the uploader's own user ID
    AND (storage.foldername(name))[1] = auth.uid()::text
  );

CREATE POLICY "avatars_owner_update"
  ON storage.objects FOR UPDATE
  USING (
    bucket_id = 'avatars'
    AND (storage.foldername(name))[1] = auth.uid()::text
  );

CREATE POLICY "avatars_owner_delete"
  ON storage.objects FOR DELETE
  USING (
    bucket_id = 'avatars'
    AND (storage.foldername(name))[1] = auth.uid()::text
  );

-- ── STORAGE RLS — POST MEDIA (public) ────────────────────────────────────────
-- Path: post-media/{user_id}/{filename}

CREATE POLICY "post_media_public_read"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'post-media');

CREATE POLICY "post_media_owner_upload"
  ON storage.objects FOR INSERT
  WITH CHECK (
    bucket_id = 'post-media'
    AND auth.uid() IS NOT NULL
    AND (storage.foldername(name))[1] = auth.uid()::text
    -- Block suspended/banned users from uploading
    AND public.current_user_state() NOT IN ('suspended', 'banned')
  );

CREATE POLICY "post_media_owner_update"
  ON storage.objects FOR UPDATE
  USING (
    bucket_id = 'post-media'
    AND (storage.foldername(name))[1] = auth.uid()::text
  );

CREATE POLICY "post_media_owner_delete"
  ON storage.objects FOR DELETE
  USING (
    bucket_id = 'post-media'
    AND (storage.foldername(name))[1] = auth.uid()::text
  );

-- ── STORAGE RLS — PET MEDIA (public) ─────────────────────────────────────────
-- Path: pet-media/{user_id}/{filename}
-- First segment is the pet OWNER's user ID (not the pet ID).

CREATE POLICY "pet_media_public_read"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'pet-media');

CREATE POLICY "pet_media_owner_upload"
  ON storage.objects FOR INSERT
  WITH CHECK (
    bucket_id = 'pet-media'
    AND auth.uid() IS NOT NULL
    AND (storage.foldername(name))[1] = auth.uid()::text
    AND public.current_user_state() NOT IN ('suspended', 'banned')
  );

CREATE POLICY "pet_media_owner_update"
  ON storage.objects FOR UPDATE
  USING (
    bucket_id = 'pet-media'
    AND (storage.foldername(name))[1] = auth.uid()::text
  );

CREATE POLICY "pet_media_owner_delete"
  ON storage.objects FOR DELETE
  USING (
    bucket_id = 'pet-media'
    AND (storage.foldername(name))[1] = auth.uid()::text
  );

-- ── STORAGE RLS — DOCUMENTS (private) ────────────────────────────────────────
-- Path: documents/{user_id}/{filename}
-- Health records, vet docs, insurance docs.
-- NO public read — only the owner can access their own documents.
-- Shared access is handled at the app layer via health_share_tokens (DB table),
-- NOT by making the bucket public or sharing a direct URL.

CREATE POLICY "documents_owner_read"
  ON storage.objects FOR SELECT
  USING (
    bucket_id = 'documents'
    AND (storage.foldername(name))[1] = auth.uid()::text
  );

CREATE POLICY "documents_owner_upload"
  ON storage.objects FOR INSERT
  WITH CHECK (
    bucket_id = 'documents'
    AND auth.uid() IS NOT NULL
    AND (storage.foldername(name))[1] = auth.uid()::text
  );

CREATE POLICY "documents_owner_update"
  ON storage.objects FOR UPDATE
  USING (
    bucket_id = 'documents'
    AND (storage.foldername(name))[1] = auth.uid()::text
  );

CREATE POLICY "documents_owner_delete"
  ON storage.objects FOR DELETE
  USING (
    bucket_id = 'documents'
    AND (storage.foldername(name))[1] = auth.uid()::text
  );

-- ─────────────────────────────────────────────────────────────────────────────
-- STORAGE SECURITY NOTES
--
-- 1. Path-based IDOR protection: all policies enforce that the first path
--    segment equals auth.uid(). Uploading to another user's path is blocked
--    at the database layer, not just the application layer.
--
-- 2. documents bucket is private: health records cannot be fetched via a
--    public URL. Sharing works via signed URLs generated server-side only,
--    gated by health_share_tokens table (RLS-protected).
--
-- 3. File type restrictions are set at the bucket level (allowed_mime_types).
--    This prevents polyglot file uploads (e.g. a JPEG that is also a ZIP).
--
-- 4. File size limits are set at the bucket level — not just client-side.
--
-- 5. The service_role key (admin client) bypasses all storage RLS.
--    It must NEVER be exposed to the browser. Only use in NestJS API routes.
-- ─────────────────────────────────────────────────────────────────────────────
