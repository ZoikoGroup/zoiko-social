-- Private tables stop being readable by the key that ships in the browser.
--
-- A sweep of all 118 tables with the public anon key found 18 returning real
-- rows through a `USING (true)` SELECT policy, and 15 more that would start
-- leaking the moment data landed in them. Writes were not affected: every INSERT
-- policy has a real with_check, and a forged insert as anon is refused with
-- 42501, so this is a disclosure problem only.
--
-- Most of the 33 are legitimately public — posts, profiles, comments, hashtags,
-- likes on public posts, business listings. This migration touches only the ones
-- holding something a member would expect to be private, plus two policies that
-- were already dead or already defeated.
--
-- WHY REVOKE RATHER THAN WRITE SCOPED POLICIES
--
-- Nothing in the browser reads any of these tables. The web app's Supabase client
-- is used for exactly two things — `auth.*` and `storage.from(...)` — verified by
-- grep across all of src: no `.from('<table>')` anywhere, and no `.channel()` /
-- `postgres_changes` subscription either, so Realtime is not a hidden reader
-- (realtime does honour RLS, which would have made this unsafe). Live updates run
-- over socket.io through the API instead. The API connects as a role that bypasses
-- RLS and already scopes each of these reads to the right person.
--
-- So a bespoke policy per table would be app authorisation logic restated in SQL,
-- in a second place, that no client exercises and no test covers — three ways to
-- drift. Revoking the privilege is one line, has the same effect today, and fails
-- closed. If a client ever does need direct access, granting it back surfaces the
-- question of the right policy at that point, with a caller to test against.
--
-- The open policies are dropped as well as the grants revoked. Either alone would
-- do; both together mean a future `GRANT` cannot silently reopen the table, which
-- is exactly the trap message_polls fell into below.

-- ── the two that were already broken, not merely permissive ──────────────────

-- user_presence had TWO permissive SELECT policies: `up_select_own` scoped to
-- (user_id = auth.uid()), and `presence_select` with USING (true). Postgres ORs
-- permissive policies together, so the scoped one never restricted anything —
-- somebody tightened this table and the tightening was a no-op.
--
-- It matters more than the row count suggests: user_privacy carries
-- `who_can_see_last_seen` and `who_can_see_online_status`, so a member could set
-- their last-seen to private and still have it readable by anyone with the anon
-- key. The setting was not bypassed, it was untrue.
DROP POLICY IF EXISTS "presence_select" ON public.user_presence;
-- `up_select_own` is deliberately left in place: it is the policy whose intent
-- was being defeated, and it is the correct one if this table is ever granted
-- back to a client.
REVOKE SELECT ON public.user_presence FROM anon, authenticated;

-- message_polls had a USING (true) policy while RLS was switched OFF, which is
-- how the poll tables came to be wide open in the first place (078). 078 enabled
-- RLS and revoked the grants, so the table is closed today — but the open policy
-- survived, meaning any future GRANT on this table reopens it in full with no
-- other change. Drop it.
DROP POLICY IF EXISTS "Authenticated users can view polls" ON public.message_polls;

-- ── story analytics: who watched, and who reacted ────────────────────────────

-- story_views records viewer_id, completion_pct, whether they reacted, replied,
-- or went on to visit the profile. That is the story owner's private analytics
-- and the viewer's private behaviour on every platform that has stories.
DROP POLICY IF EXISTS "story_views_select" ON public.story_views;
REVOKE SELECT ON public.story_views FROM anon, authenticated;

-- story_reactions carries a free-text `message` and a `conversation_id` — a
-- reply sent privately to the story's author, not a public comment.
DROP POLICY IF EXISTS "story_reactions_select" ON public.story_reactions;
REVOKE SELECT ON public.story_reactions FROM anon, authenticated;

-- ── private collections ─────────────────────────────────────────────────────

-- What someone saved. A bookmark list is private by default everywhere; the
-- like tables are left public because a like is a visible act and a save is not.
DROP POLICY IF EXISTS "news_saves_select" ON public.news_saves;
REVOKE SELECT ON public.news_saves FROM anon, authenticated;

DROP POLICY IF EXISTS "product_saves_select" ON public.product_saves;
REVOKE SELECT ON public.product_saves FROM anon, authenticated;

-- ── community membership and configuration ──────────────────────────────────

-- `communities` itself is already scoped by visibility, so private communities
-- are correctly hidden from the anon key. But community_members and
-- community_settings were not, so the roster and the configuration of a private
-- community were readable even though the community was not. No private
-- community exists in this deployment yet, which is the only reason this had not
-- already leaked one.
DROP POLICY IF EXISTS "community_members_select" ON public.community_members;
REVOKE SELECT ON public.community_members FROM anon, authenticated;

DROP POLICY IF EXISTS "community_settings_select" ON public.community_settings;
REVOKE SELECT ON public.community_settings FROM anon, authenticated;

-- ── empty today, private by nature ──────────────────────────────────────────

-- These hold no rows yet, which is not the same as being safe — each would have
-- started leaking with its first row and nothing would have signalled it.

-- Free-text messages between the two parties to a breeding request.
DROP POLICY IF EXISTS "breeding_req_msg_select" ON public.breeding_request_messages;
REVOKE SELECT ON public.breeding_request_messages FROM anon, authenticated;

-- Who has granted whom access to a professional account.
DROP POLICY IF EXISTS "professional_permissions_select_all" ON public.professional_permissions;
REVOKE SELECT ON public.professional_permissions FROM anon, authenticated;

-- Who was invited to an event, including invitations never accepted.
DROP POLICY IF EXISTS "event_invites_select" ON public.event_invites;
REVOKE SELECT ON public.event_invites FROM anon, authenticated;
