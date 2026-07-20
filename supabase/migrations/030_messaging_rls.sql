-- ─────────────────────────────────────────────────────────────────────────────
-- ZoikoSocial — RLS for messaging tables introduced in 012_messaging.sql
--
-- Security concern: 002_rls_missing_tables.sql established the invariant that
-- EVERY table reachable via the Supabase anon/user key has RLS enabled. The 17
-- tables created in 012_messaging.sql were added AFTER 002 and shipped with RLS
-- OFF — so any signed-in user could enumerate strangers' message requests, every
-- conversation's attachment URLs, reactions, receipts, presence, privacy rows,
-- and group membership (classic IDOR). This restores the invariant.
--
-- The NestJS API talks to these tables with the service role, which BYPASSES RLS,
-- so its behaviour is unchanged. These policies only constrain the anon/user key.
-- Writes are intentionally service-role-only (no client INSERT/UPDATE/DELETE
-- policy), mirroring how user_roles is locked down in 002.
--
-- Idempotent: DROP POLICY IF EXISTS before each CREATE, and ENABLE RLS is a no-op
-- when already on — safe to re-run.
-- ─────────────────────────────────────────────────────────────────────────────

-- ── SECURITY DEFINER HELPER ───────────────────────────────────────────────────
-- Groups I can see = groups whose conversation I'm a member of. SECURITY DEFINER
-- so the inner lookups aren't themselves re-filtered by RLS. Builds on
-- get_my_conversation_ids() from 002_rls_missing_tables.sql.
CREATE OR REPLACE FUNCTION public.get_my_group_ids()
RETURNS SETOF uuid
LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public
AS $$
  SELECT g.id FROM public.groups g
  WHERE g.conversation_id IN (SELECT public.get_my_conversation_ids())
$$;

-- ── CONVERSATION SETTINGS (per-user mute/pin/archive) ─────────────────────────
ALTER TABLE public.conversation_settings ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "cs_select_own" ON public.conversation_settings;
CREATE POLICY "cs_select_own" ON public.conversation_settings FOR SELECT
  USING (user_id = auth.uid());

-- ── MESSAGE ATTACHMENTS (scoped to my conversations) ──────────────────────────
ALTER TABLE public.message_attachments ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "ma_select_member" ON public.message_attachments;
CREATE POLICY "ma_select_member" ON public.message_attachments FOR SELECT
  USING (EXISTS (
    SELECT 1 FROM public.messages m
    WHERE m.id = message_attachments.message_id
      AND m.conversation_id IN (SELECT public.get_my_conversation_ids())
  ));

-- ── MESSAGE REACTIONS ─────────────────────────────────────────────────────────
ALTER TABLE public.message_reactions ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "mr_select_member" ON public.message_reactions;
CREATE POLICY "mr_select_member" ON public.message_reactions FOR SELECT
  USING (EXISTS (
    SELECT 1 FROM public.messages m
    WHERE m.id = message_reactions.message_id
      AND m.conversation_id IN (SELECT public.get_my_conversation_ids())
  ));

-- ── MESSAGE RECEIPTS ──────────────────────────────────────────────────────────
ALTER TABLE public.message_receipts ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "mrcpt_select_member" ON public.message_receipts;
CREATE POLICY "mrcpt_select_member" ON public.message_receipts FOR SELECT
  USING (
    user_id = auth.uid()
    OR EXISTS (
      SELECT 1 FROM public.messages m
      WHERE m.id = message_receipts.message_id
        AND m.conversation_id IN (SELECT public.get_my_conversation_ids())
    )
  );

-- ── MESSAGE REQUESTS (only the two parties) ───────────────────────────────────
ALTER TABLE public.message_requests ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "mrq_select_party" ON public.message_requests;
CREATE POLICY "mrq_select_party" ON public.message_requests FOR SELECT
  USING (sender_id = auth.uid() OR recipient_id = auth.uid());

-- ── GROUPS (members only) ─────────────────────────────────────────────────────
ALTER TABLE public.groups ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "groups_select_member" ON public.groups;
CREATE POLICY "groups_select_member" ON public.groups FOR SELECT
  USING (conversation_id IN (SELECT public.get_my_conversation_ids()));

-- ── GROUP MEMBERS / SETTINGS / PERMISSIONS / INVITE LINKS ─────────────────────
ALTER TABLE public.group_members ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "gm_select_member" ON public.group_members;
CREATE POLICY "gm_select_member" ON public.group_members FOR SELECT
  USING (group_id IN (SELECT public.get_my_group_ids()));

ALTER TABLE public.group_settings ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "gs_select_member" ON public.group_settings;
CREATE POLICY "gs_select_member" ON public.group_settings FOR SELECT
  USING (group_id IN (SELECT public.get_my_group_ids()));

ALTER TABLE public.group_permissions ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "gp_select_member" ON public.group_permissions;
CREATE POLICY "gp_select_member" ON public.group_permissions FOR SELECT
  USING (group_id IN (SELECT public.get_my_group_ids()));

ALTER TABLE public.group_invite_links ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "gil_select_member" ON public.group_invite_links;
CREATE POLICY "gil_select_member" ON public.group_invite_links FOR SELECT
  USING (group_id IN (SELECT public.get_my_group_ids()));

-- ── GROUP JOIN REQUESTS (requester + members of the group) ────────────────────
ALTER TABLE public.group_join_requests ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "gjr_select" ON public.group_join_requests;
CREATE POLICY "gjr_select" ON public.group_join_requests FOR SELECT
  USING (user_id = auth.uid() OR group_id IN (SELECT public.get_my_group_ids()));

-- ── FAVORITE CONTACTS (own) ───────────────────────────────────────────────────
ALTER TABLE public.favorite_contacts ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "fc_select_own" ON public.favorite_contacts;
CREATE POLICY "fc_select_own" ON public.favorite_contacts FOR SELECT
  USING (user_id = auth.uid());

-- ── PINNED CHATS (own) ────────────────────────────────────────────────────────
ALTER TABLE public.pinned_chats ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "pc_select_own" ON public.pinned_chats;
CREATE POLICY "pc_select_own" ON public.pinned_chats FOR SELECT
  USING (user_id = auth.uid());

-- ── USER PRESENCE (own; visibility to others is mediated by the socket layer) ─
ALTER TABLE public.user_presence ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "up_select_own" ON public.user_presence;
CREATE POLICY "up_select_own" ON public.user_presence FOR SELECT
  USING (user_id = auth.uid());

-- ── USER PRIVACY SETTINGS (own) ───────────────────────────────────────────────
ALTER TABLE public.user_privacy ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "priv_select_own" ON public.user_privacy;
CREATE POLICY "priv_select_own" ON public.user_privacy FOR SELECT
  USING (user_id = auth.uid());

-- ── PROFESSIONAL MESSAGING SETTINGS (own) ─────────────────────────────────────
ALTER TABLE public.professional_messaging_settings ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "pms_select_own" ON public.professional_messaging_settings;
CREATE POLICY "pms_select_own" ON public.professional_messaging_settings FOR SELECT
  USING (user_id = auth.uid());

-- ── MESSAGE RATE LIMITS (own) ─────────────────────────────────────────────────
ALTER TABLE public.message_rate_limits ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "mrl_select_own" ON public.message_rate_limits;
CREATE POLICY "mrl_select_own" ON public.message_rate_limits FOR SELECT
  USING (user_id = auth.uid());

-- ─────────────────────────────────────────────────────────────────────────────
-- SECURITY SUMMARY
-- All 17 messaging tables from 012 now have RLS enabled with least-privilege
-- SELECT policies; no client-side write policies (writes are service-role only).
-- The 002 invariant "every public-schema table has RLS enabled" is restored.
-- ─────────────────────────────────────────────────────────────────────────────
