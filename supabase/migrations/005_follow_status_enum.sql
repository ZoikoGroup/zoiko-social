-- ─────────────────────────────────────────────────────────────────────────────
-- ZoikoSocial — Convert follows.status from text+CHECK to a proper enum
-- Aligns the database with the Prisma schema (FollowStatus @@map "follow_status")
-- ─────────────────────────────────────────────────────────────────────────────

DO $$ BEGIN
  CREATE TYPE public.follow_status AS ENUM ('active', 'blocked');
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

-- Policies referencing follows.status must be dropped for the type change
-- and recreated identically afterwards.
DROP POLICY IF EXISTS "follows_select" ON public.follows;
DROP POLICY IF EXISTS "posts_select" ON public.posts;

ALTER TABLE public.follows
  DROP CONSTRAINT IF EXISTS follows_status_check;

ALTER TABLE public.follows
  ALTER COLUMN status DROP DEFAULT,
  ALTER COLUMN status TYPE public.follow_status USING status::public.follow_status,
  ALTER COLUMN status SET DEFAULT 'active';

CREATE POLICY "follows_select"
  ON public.follows FOR SELECT
  USING (
    status = 'active'
    OR follower_id = auth.uid()
    OR following_id = auth.uid()
  );

CREATE POLICY "posts_select"
  ON public.posts FOR SELECT
  USING (
    visibility = 'public'
    OR author_id = auth.uid()
    OR (
      visibility = 'followers'
      AND EXISTS (
        SELECT 1 FROM public.follows
        WHERE follower_id = auth.uid()
          AND following_id = author_id
          AND status = 'active'
      )
    )
  );

-- Composite index used by follower/following list queries filtered on status
CREATE INDEX IF NOT EXISTS follows_following_status_idx ON public.follows (following_id, status);
CREATE INDEX IF NOT EXISTS follows_follower_status_idx  ON public.follows (follower_id, status);
