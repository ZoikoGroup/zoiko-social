-- Private chat attachments stop being enumerable.
--
-- The `chat-media` bucket holds DM attachments — images, PDFs, voice notes. It
-- had a read policy on storage.objects of `USING (bucket_id = 'chat-media')`,
-- with no owner scoping at all, which made the whole bucket LISTABLE with the
-- anon key that ships in the browser bundle. Proven against production: a POST
-- to /storage/v1/object/list/chat-media returned the user-id folders, and each
-- folder can be listed in turn to recover every object path. Fetching one then
-- needs no credentials at all — it came back HTTP 200 with 38158 bytes.
--
-- Listing is the part that turns "an unguessable URL" into "download every
-- private attachment on the platform", so that is what this closes.
--
-- Scoped to the uploader via the path convention the code already follows —
-- keys are `{userId}/chat/{uuid}.{ext}`, so the first folder segment is the
-- owner (see SupabaseStorageService.generateKey). The recipient of a DM is
-- deliberately NOT included: nothing lists this bucket from a client, so the
-- narrower rule is the safe one, and a recipient reads the object by URL rather
-- than by listing the sender's folder.
--
-- Nothing legitimate is affected. The web app never references 'chat-media' at
-- all — grep across apps/web/src finds no occurrence — the API holds the
-- service-role key and bypasses RLS entirely, and serving a public bucket's
-- object through /object/public/... does not consult storage.objects RLS, so
-- existing attachments keep loading.
--
-- WHAT THIS DOES NOT FIX
--
-- The bucket is still flagged public, so anyone holding an exact object URL can
-- still fetch it, unauthenticated and indefinitely. Closing that means flipping
-- the bucket to private and serving short-lived signed URLs instead, which is a
-- change to the storage contract rather than a policy fix: messages.media_urls
-- persists whole public URLs today (3 rows), the client stores whatever the
-- upload response hands it, and the signing has to happen at response-mapping
-- time only — never before a write, or message forwarding would persist a URL
-- that expires. Left as a deliberate, separate decision.

DROP POLICY IF EXISTS "chat_media_public_read" ON storage.objects;

CREATE POLICY "chat_media_owner_list"
  ON storage.objects FOR SELECT
  USING (
    bucket_id = 'chat-media'
    AND (storage.foldername(name))[1] = auth.uid()::text
  );
