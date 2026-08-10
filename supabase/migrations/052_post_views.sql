-- ─────────────────────────────────────────────────────────────────────────────
-- ZoikoSocial — Post Views (seen-filter)
-- One row per (viewer, post) the viewer has actually seen. Powers the feed's
-- "seen filter": posts you've already seen or reacted to stop reappearing in
-- the home + explore feeds. Composite PK mirrors `likes` (idempotent writes).
-- Retention: pruned daily by the post-view cleanup job (default 30 days).
-- ─────────────────────────────────────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS public.post_views (
  user_id    uuid        NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  post_id    uuid        NOT NULL REFERENCES public.posts(id) ON DELETE CASCADE,
  viewed_at  timestamptz NOT NULL DEFAULT now(),
  PRIMARY KEY (user_id, post_id)
);

-- "Recent views" + the cleanup job's age-based delete
CREATE INDEX IF NOT EXISTS post_views_user_viewed_idx
  ON public.post_views (user_id, viewed_at DESC);

-- ── RLS ──────────────────────────────────────────────────────────────────────
-- API uses the service role; RLS is defense-in-depth for direct client access.

ALTER TABLE public.post_views ENABLE ROW LEVEL SECURITY;

CREATE POLICY "post_views_select_own" ON public.post_views FOR SELECT USING (user_id = auth.uid());
CREATE POLICY "post_views_insert_own" ON public.post_views FOR INSERT WITH CHECK (user_id = auth.uid());
CREATE POLICY "post_views_delete_own" ON public.post_views FOR DELETE USING (user_id = auth.uid());
