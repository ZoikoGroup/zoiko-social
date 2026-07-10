-- ── CHAT MEDIA STORAGE ───────────────────────────────────────────────────────
-- Bucket for message attachments (images / videos / audio / documents) sent in
-- direct and group chats. Uploads go through Supabase signed upload URLs minted
-- by the API (service-role); reads are public.
--
-- Path convention: chat-media/{user_id}/chat/{uuid}.{ext}
--   → the first folder segment is the uploader, matching owner-path RLS.

INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES
  (
    'chat-media',
    'chat-media',
    true,
    104857600, -- 100 MB (matches the API upload limit)
    ARRAY[
      -- images
      'image/jpeg', 'image/png', 'image/gif', 'image/webp',
      -- video
      'video/mp4', 'video/webm', 'video/quicktime',
      -- audio (voice notes)
      'audio/mpeg', 'audio/ogg', 'audio/wav', 'audio/webm',
      -- documents
      'application/pdf',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'text/plain', 'text/csv'
    ]
  )
ON CONFLICT (id) DO UPDATE
  SET public = EXCLUDED.public,
      file_size_limit = EXCLUDED.file_size_limit,
      allowed_mime_types = EXCLUDED.allowed_mime_types;

-- ── STORAGE RLS — CHAT MEDIA (public read, owner write) ───────────────────────
-- Path: chat-media/{user_id}/chat/{filename}

CREATE POLICY "chat_media_public_read"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'chat-media');

CREATE POLICY "chat_media_owner_upload"
  ON storage.objects FOR INSERT
  WITH CHECK (
    bucket_id = 'chat-media'
    AND auth.uid() IS NOT NULL
    AND (storage.foldername(name))[1] = auth.uid()::text
    -- Block suspended/banned users from uploading
    AND public.current_user_state() NOT IN ('suspended', 'banned')
  );

CREATE POLICY "chat_media_owner_update"
  ON storage.objects FOR UPDATE
  USING (
    bucket_id = 'chat-media'
    AND (storage.foldername(name))[1] = auth.uid()::text
  );

CREATE POLICY "chat_media_owner_delete"
  ON storage.objects FOR DELETE
  USING (
    bucket_id = 'chat-media'
    AND (storage.foldername(name))[1] = auth.uid()::text
  );
