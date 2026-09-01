-- ── The poll tables were left open to the anon key ───────────────────────────
-- Migration 075 created message_polls, message_poll_options and
-- message_poll_votes without enabling row-level security. 115 of the other 118
-- tables have it on, so these three were the exception rather than the rule.
--
-- Supabase grants anon and authenticated full DML on new public tables by
-- default, and RLS is what normally holds that back. With RLS off, the grants
-- applied directly — and the anon key ships in the browser bundle, because
-- Supabase Auth needs it there.
--
-- Verified against the live project rather than inferred. An anon INSERT into
-- message_poll_votes was refused by a FOREIGN KEY (23503), not by authorization;
-- the same request against news_articles was refused by RLS (42501). The write
-- reached the table and only a bad id stopped it. With a real option_id it would
-- have succeeded, and the grants also include UPDATE, DELETE and TRUNCATE.
--
-- What that allowed, with nothing but the public key:
--   * read every poll and every individual vote — who voted for what, including
--     in private group conversations
--   * stuff a poll with votes, or delete the ones already cast
--   * rewrite a poll's question and options after people had answered
--   * truncate all three tables
--
-- Nothing has been exploited: the tables are empty, because polls could not be
-- rendered until the read path was finished. They will start filling now, which
-- is why this cannot wait.
--
-- The API is unaffected either way — it connects as `postgres`, which bypasses
-- RLS. These policies exist solely to close the direct PostgREST route.
-- ─────────────────────────────────────────────────────────────────────────────

ALTER TABLE public.message_polls        ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.message_poll_options ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.message_poll_votes   ENABLE ROW LEVEL SECURITY;

-- No policies are added, deliberately.
--
-- RLS enabled with no policy denies everything to anon and authenticated, which
-- is the correct answer here: every legitimate read and write goes through the
-- API, which is not subject to RLS. A policy would only be needed if the browser
-- talked to these tables directly, and it does not.
--
-- The alternative — a policy allowing conversation members to read votes — would
-- have to re-implement community and conversation membership in SQL, duplicating
-- rules that already live in one place in the application. Two copies of an
-- authorisation rule is how they drift.

-- Revoke the blanket DML as well, so the tables are not one accidental
-- `DISABLE ROW LEVEL SECURITY` away from being open again. Defence in depth:
-- RLS is the lock, this removes the key from the door.
REVOKE ALL ON public.message_polls        FROM anon, authenticated;
REVOKE ALL ON public.message_poll_options FROM anon, authenticated;
REVOKE ALL ON public.message_poll_votes   FROM anon, authenticated;
