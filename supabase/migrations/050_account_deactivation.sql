-- ── Reversible account states ───────────────────────────────────────────────
-- Deleting an account used to be instant and irreversible. Two softer states
-- replace that, in the shape members expect from other social apps:
--
--   deactivated       temporarily hidden. Signing back in restores it.
--   pending_deletion  scheduled for permanent deletion after a grace period.
--                     Signing back in during the window cancels it; a daily job
--                     purges anything past it.
--
-- Both states are hidden from everyone else for free: profile visibility across
-- feed, search, posts, comments, messaging and stories is already gated on
-- `state = 'active'`, so a non-active account drops out of all of them.
--
-- ADD VALUE cannot run in the same transaction that later uses the new value, so
-- each is its own statement and the columns follow separately. IF NOT EXISTS
-- makes the whole file idempotent.
-- ─────────────────────────────────────────────────────────────────────────────

ALTER TYPE public.user_state ADD VALUE IF NOT EXISTS 'deactivated';
ALTER TYPE public.user_state ADD VALUE IF NOT EXISTS 'pending_deletion';

-- When the member deactivated, so the UI can say how long it has been hidden.
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS deactivated_at timestamptz;

-- Start of the deletion grace period. The purge job reads this; it is also what
-- tells a returning member how many days they have left to change their mind.
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS deletion_requested_at timestamptz;

-- The purge job scans for expired grace periods, so keep that lookup cheap.
CREATE INDEX IF NOT EXISTS profiles_deletion_requested_at_idx
  ON public.profiles (deletion_requested_at)
  WHERE deletion_requested_at IS NOT NULL;
