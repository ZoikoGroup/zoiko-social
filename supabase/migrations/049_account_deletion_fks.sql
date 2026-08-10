-- ── Make account deletion actually work ─────────────────────────────────────
-- Settings → Delete Account (DELETE /profiles/me → auth.admin.deleteUser) failed
-- with ACCOUNT_DELETION_FAILED for any account that had ever been referenced by
-- one of these tables: eleven foreign keys onto profiles were NO ACTION, so
-- Postgres refused the delete. A single audit_log row was enough to block it.
--
-- Two policies, chosen per table:
--
--   SET NULL  — for history that must outlive the account. A moderation
--               decision, an audit entry or a group's creator record stays
--               intact; only the link to the deleted person is dropped. All of
--               these columns are already nullable, so nothing else changes.
--
--   CASCADE   — for the two NOT NULL columns, where the row is an artifact of
--               the person rather than a record worth keeping: a community post
--               pin (the post itself is untouched, it simply becomes unpinned)
--               and a group invite link (revoking a departed member's invite
--               link is the safer outcome anyway).
--
-- Idempotent: each constraint is dropped if present, then recreated.
-- ─────────────────────────────────────────────────────────────────────────────

-- ── Preserve the record, forget the person ──────────────────────────────────

ALTER TABLE public.audit_log DROP CONSTRAINT IF EXISTS audit_log_actor_id_fkey;
ALTER TABLE public.audit_log ADD CONSTRAINT audit_log_actor_id_fkey
  FOREIGN KEY (actor_id) REFERENCES public.profiles(id) ON DELETE SET NULL;

ALTER TABLE public.conversations DROP CONSTRAINT IF EXISTS conversations_created_by_fkey;
ALTER TABLE public.conversations ADD CONSTRAINT conversations_created_by_fkey
  FOREIGN KEY (created_by) REFERENCES public.profiles(id) ON DELETE SET NULL;

ALTER TABLE public.group_members DROP CONSTRAINT IF EXISTS group_members_invited_by_fkey;
ALTER TABLE public.group_members ADD CONSTRAINT group_members_invited_by_fkey
  FOREIGN KEY (invited_by) REFERENCES public.profiles(id) ON DELETE SET NULL;

ALTER TABLE public.group_join_requests DROP CONSTRAINT IF EXISTS group_join_requests_reviewed_by_fkey;
ALTER TABLE public.group_join_requests ADD CONSTRAINT group_join_requests_reviewed_by_fkey
  FOREIGN KEY (reviewed_by) REFERENCES public.profiles(id) ON DELETE SET NULL;

ALTER TABLE public.message_requests DROP CONSTRAINT IF EXISTS message_requests_reviewed_by_admin_fkey;
ALTER TABLE public.message_requests ADD CONSTRAINT message_requests_reviewed_by_admin_fkey
  FOREIGN KEY (reviewed_by_admin) REFERENCES public.profiles(id) ON DELETE SET NULL;

ALTER TABLE public.reports DROP CONSTRAINT IF EXISTS reports_reviewed_by_fkey;
ALTER TABLE public.reports ADD CONSTRAINT reports_reviewed_by_fkey
  FOREIGN KEY (reviewed_by) REFERENCES public.profiles(id) ON DELETE SET NULL;

ALTER TABLE public.community_reports DROP CONSTRAINT IF EXISTS community_reports_reviewed_by_fkey;
ALTER TABLE public.community_reports ADD CONSTRAINT community_reports_reviewed_by_fkey
  FOREIGN KEY (reviewed_by) REFERENCES public.profiles(id) ON DELETE SET NULL;

ALTER TABLE public.verification_requests DROP CONSTRAINT IF EXISTS verification_requests_reviewed_by_fkey;
ALTER TABLE public.verification_requests ADD CONSTRAINT verification_requests_reviewed_by_fkey
  FOREIGN KEY (reviewed_by) REFERENCES public.profiles(id) ON DELETE SET NULL;

ALTER TABLE public.user_roles DROP CONSTRAINT IF EXISTS user_roles_granted_by_fkey;
ALTER TABLE public.user_roles ADD CONSTRAINT user_roles_granted_by_fkey
  FOREIGN KEY (granted_by) REFERENCES public.profiles(id) ON DELETE SET NULL;

-- ── Remove the artifact along with the account ──────────────────────────────

ALTER TABLE public.community_post_pins DROP CONSTRAINT IF EXISTS community_post_pins_pinned_by_fkey;
ALTER TABLE public.community_post_pins ADD CONSTRAINT community_post_pins_pinned_by_fkey
  FOREIGN KEY (pinned_by) REFERENCES public.profiles(id) ON DELETE CASCADE;

ALTER TABLE public.group_invite_links DROP CONSTRAINT IF EXISTS group_invite_links_created_by_fkey;
ALTER TABLE public.group_invite_links ADD CONSTRAINT group_invite_links_created_by_fkey
  FOREIGN KEY (created_by) REFERENCES public.profiles(id) ON DELETE CASCADE;
