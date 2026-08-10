-- ── Extend write restrictions to the new account states ─────────────────────
-- Migration 050 added deactivated and pending_deletion. These policies were
-- written before those existed and only exclude suspended and banned, so at the
-- database layer a hidden account could still insert rows.
--
-- Scope, verified before writing this: all ten are INSERT-only, so no read path
-- changes and no content can become invisible. The API bypasses RLS entirely
-- (Prisma connects directly to Postgres; the Supabase client uses the service
-- role key), and the web app never queries tables — only auth and storage. So of
-- the ten, only the three storage policies sit on a live code path, and the only
-- caller they newly refuse is a session belonging to a hidden account. Deactivating
-- revokes all sessions and signing back in reactivates, so no legitimate user can
-- be in that position. This closes a gap rather than changing behaviour.
--
-- Generated from the live definitions with ALTER POLICY, so each predicate is
-- preserved exactly and only the state array changes.
-- ─────────────────────────────────────────────────────────────────────────────
ALTER POLICY breeding_insert_verified ON public.breeding_listings
  WITH CHECK (((owner_id = auth.uid()) AND (current_user_state() <> ALL (ARRAY['suspended'::text, 'banned'::text, 'deactivated'::text, 'pending_deletion'::text])) AND (EXISTS ( SELECT 1
   FROM pet_profiles
  WHERE ((pet_profiles.id = breeding_listings.pet_id) AND (pet_profiles.owner_id = auth.uid()) AND (pet_profiles.health_cert_state = 'approved'::health_cert_state))))));

ALTER POLICY bookings_insert_seeker ON public.care_bookings
  WITH CHECK (((seeker_id = auth.uid()) AND (current_user_state() <> ALL (ARRAY['suspended'::text, 'banned'::text, 'deactivated'::text, 'pending_deletion'::text]))));

ALTER POLICY lost_found_insert_verified ON public.lost_found_reports
  WITH CHECK (((reporter_id = auth.uid()) AND (current_user_state() <> ALL (ARRAY['suspended'::text, 'banned'::text, 'deactivated'::text, 'pending_deletion'::text]))));

ALTER POLICY messages_insert_participant ON public.messages
  WITH CHECK (((sender_id = auth.uid()) AND (EXISTS ( SELECT 1
   FROM conversation_members
  WHERE ((conversation_members.conversation_id = messages.conversation_id) AND (conversation_members.user_id = auth.uid())))) AND (current_user_state() <> ALL (ARRAY['suspended'::text, 'banned'::text, 'deactivated'::text, 'pending_deletion'::text]))));

ALTER POLICY organizations_insert_own ON public.organizations
  WITH CHECK (((owner_id = auth.uid()) AND (current_user_state() <> ALL (ARRAY['suspended'::text, 'banned'::text, 'deactivated'::text, 'pending_deletion'::text]))));

ALTER POLICY posts_insert_own ON public.posts
  WITH CHECK (((author_id = auth.uid()) AND (current_user_state() <> ALL (ARRAY['suspended'::text, 'banned'::text, 'deactivated'::text, 'pending_deletion'::text]))));

ALTER POLICY seller_profiles_insert_own ON public.seller_profiles
  WITH CHECK (((user_id = auth.uid()) AND (current_user_state() <> ALL (ARRAY['suspended'::text, 'banned'::text, 'deactivated'::text, 'pending_deletion'::text]))));

ALTER POLICY chat_media_owner_upload ON storage.objects
  WITH CHECK (((bucket_id = 'chat-media'::text) AND (auth.uid() IS NOT NULL) AND ((storage.foldername(name))[1] = (auth.uid())::text) AND (current_user_state() <> ALL (ARRAY['suspended'::text, 'banned'::text, 'deactivated'::text, 'pending_deletion'::text]))));

ALTER POLICY pet_media_owner_upload ON storage.objects
  WITH CHECK (((bucket_id = 'pet-media'::text) AND (auth.uid() IS NOT NULL) AND ((storage.foldername(name))[1] = (auth.uid())::text) AND (current_user_state() <> ALL (ARRAY['suspended'::text, 'banned'::text, 'deactivated'::text, 'pending_deletion'::text]))));

ALTER POLICY post_media_owner_upload ON storage.objects
  WITH CHECK (((bucket_id = 'post-media'::text) AND (auth.uid() IS NOT NULL) AND ((storage.foldername(name))[1] = (auth.uid())::text) AND (current_user_state() <> ALL (ARRAY['suspended'::text, 'banned'::text, 'deactivated'::text, 'pending_deletion'::text]))));
