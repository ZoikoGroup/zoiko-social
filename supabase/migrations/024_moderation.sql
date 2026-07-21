-- ── PLATFORM-WIDE MODERATION REPORTS ────────────────────────────────────────
-- Separate from `community_reports` (010_communities.sql), which stays scoped
-- to in-community moderation (post/comment/member reports reviewed by a
-- community's own moderators). `reports` is the platform-wide Trust & Safety
-- queue: any user can report a post, comment, message, story or another user,
-- and any platform admin/moderator (profiles.role) reviews it here.

CREATE TABLE IF NOT EXISTS public.reports (
  id           uuid        PRIMARY KEY DEFAULT gen_random_uuid(),
  reporter_id  uuid        NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  target_type  text        NOT NULL,   -- post | comment | message | user | story
  target_id    uuid        NOT NULL,
  reason       text        NOT NULL,   -- spam | harassment | abuse | animal_welfare | impersonation | other
  note         text,
  status       text        NOT NULL DEFAULT 'open',  -- open | actioned | dismissed
  reviewed_by  uuid        REFERENCES public.profiles(id),
  reviewed_at  timestamptz,
  created_at   timestamptz NOT NULL DEFAULT now(),
  UNIQUE (reporter_id, target_type, target_id)
);

CREATE INDEX IF NOT EXISTS reports_status_idx
  ON public.reports (status, created_at DESC);

ALTER TABLE public.reports ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "reports_insert" ON public.reports;
CREATE POLICY "reports_insert" ON public.reports FOR INSERT
  WITH CHECK (reporter_id = auth.uid());

-- No public SELECT policy: reports are readable only via the API's service
-- role (admin/moderator endpoints), same pattern as community_reports.
