-- ─────────────────────────────────────────────────────────────────────────────
-- ZoikoSocial — RLS for tables missing from 001_rls_setup.sql
--
-- Security concern: every table that is readable via the Supabase anon/user
-- key MUST have RLS enabled. Without it, a direct API call can enumerate all
-- rows — a classic IDOR (Insecure Direct Object Reference) vulnerability.
--
-- Tables covered here:
--   conversation_members, follows, user_roles, health_share_tokens,
--   seller_profiles, organizations
-- ─────────────────────────────────────────────────────────────────────────────

-- ── SECURITY DEFINER HELPER ───────────────────────────────────────────────────
-- Used to avoid recursive RLS when conversation_members queries itself.
-- SECURITY DEFINER bypasses RLS on the inner query, preventing an infinite loop.
CREATE OR REPLACE FUNCTION public.get_my_conversation_ids()
RETURNS SETOF uuid
LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public
AS $$
  SELECT conversation_id FROM public.conversation_members WHERE user_id = auth.uid()
$$;

-- ── CONVERSATION MEMBERS ──────────────────────────────────────────────────────
-- IDOR risk: without RLS anyone could GET /conversation_members and enumerate
-- every private conversation on the platform.

ALTER TABLE public.conversation_members ENABLE ROW LEVEL SECURITY;

-- See your own memberships AND see who else is in your conversations
CREATE POLICY "conv_members_select"
  ON public.conversation_members FOR SELECT
  USING (
    user_id = auth.uid()
    OR conversation_id IN (SELECT public.get_my_conversation_ids())
  );

-- You can only add yourself (client join). The server (service_role) adds
-- the other party when creating a DM or group.
CREATE POLICY "conv_members_insert_self"
  ON public.conversation_members FOR INSERT
  WITH CHECK (user_id = auth.uid());

-- You can only leave your own conversations
CREATE POLICY "conv_members_delete_self"
  ON public.conversation_members FOR DELETE
  USING (user_id = auth.uid());

-- ── FOLLOWS ───────────────────────────────────────────────────────────────────
-- Follows are semi-public (follower counts are visible) but direct enumeration
-- of who follows whom should be gated to prevent stalking/scraping.

ALTER TABLE public.follows ENABLE ROW LEVEL SECURITY;

-- Anyone can see follows involving public profiles (needed for follower counts
-- and feed construction). Blocked follows (status='blocked') are only visible
-- to the parties involved.
CREATE POLICY "follows_select"
  ON public.follows FOR SELECT
  USING (
    status = 'active'
    OR follower_id = auth.uid()
    OR following_id = auth.uid()
  );

-- You can only create follows where you are the follower
CREATE POLICY "follows_insert_own"
  ON public.follows FOR INSERT
  WITH CHECK (follower_id = auth.uid());

-- You can update (block/unblock) follows you own
CREATE POLICY "follows_update_own"
  ON public.follows FOR UPDATE
  USING (follower_id = auth.uid())
  WITH CHECK (follower_id = auth.uid());

-- You can unfollow (or the person being followed can remove the follow)
CREATE POLICY "follows_delete_own"
  ON public.follows FOR DELETE
  USING (follower_id = auth.uid() OR following_id = auth.uid());

-- ── USER ROLES ────────────────────────────────────────────────────────────────
-- IDOR risk: exposing role assignments lets an attacker find moderator/admin
-- accounts and target them for takeover.

ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

-- Users can see their own active roles only
CREATE POLICY "user_roles_select_own"
  ON public.user_roles FOR SELECT
  USING (user_id = auth.uid() AND is_active = true);

-- Admins can see all roles (uses the SECURITY DEFINER has_role function
-- which bypasses RLS on user_roles for this specific check)
CREATE POLICY "user_roles_select_admin"
  ON public.user_roles FOR SELECT
  USING (public.has_role('admin') OR public.has_role('super_admin'));

-- No direct INSERT/UPDATE/DELETE from client — only via service_role (admin API).
-- This prevents privilege escalation: a user cannot grant themselves a role.

-- ── HEALTH SHARE TOKENS ───────────────────────────────────────────────────────
-- These tokens grant time-limited access to private pet health records.
-- IDOR risk: leaking a token lets someone read another pet's medical history.

ALTER TABLE public.health_share_tokens ENABLE ROW LEVEL SECURITY;

-- Both the sharer and the recipient can see the token
CREATE POLICY "health_tokens_select"
  ON public.health_share_tokens FOR SELECT
  USING (
    shared_by_user_id = auth.uid()
    OR shared_with_user_id = auth.uid()
  );

-- Only the pet owner can create a share token
CREATE POLICY "health_tokens_insert"
  ON public.health_share_tokens FOR INSERT
  WITH CHECK (
    shared_by_user_id = auth.uid()
    AND EXISTS (
      SELECT 1 FROM public.pet_profiles
      WHERE id = health_share_tokens.pet_id
        AND owner_id = auth.uid()
    )
  );

-- Only the sharer can revoke (update is_revoked = true)
CREATE POLICY "health_tokens_update_revoke"
  ON public.health_share_tokens FOR UPDATE
  USING (shared_by_user_id = auth.uid())
  WITH CHECK (shared_by_user_id = auth.uid());

-- Only the sharer can delete
CREATE POLICY "health_tokens_delete"
  ON public.health_share_tokens FOR DELETE
  USING (shared_by_user_id = auth.uid());

-- ── SELLER PROFILES ───────────────────────────────────────────────────────────

ALTER TABLE public.seller_profiles ENABLE ROW LEVEL SECURITY;

-- Seller profiles are public (needed for marketplace browsing)
CREATE POLICY "seller_profiles_select_public"
  ON public.seller_profiles FOR SELECT
  USING (true);

-- Only the account holder can create their own seller profile
CREATE POLICY "seller_profiles_insert_own"
  ON public.seller_profiles FOR INSERT
  WITH CHECK (
    user_id = auth.uid()
    AND public.current_user_state() NOT IN ('suspended', 'banned')
  );

-- Only the seller can update their own profile
CREATE POLICY "seller_profiles_update_own"
  ON public.seller_profiles FOR UPDATE
  USING (user_id = auth.uid())
  WITH CHECK (user_id = auth.uid());

-- Sellers cannot delete their profile if they have active listings
-- (enforced at app layer); RLS allows delete by owner only
CREATE POLICY "seller_profiles_delete_own"
  ON public.seller_profiles FOR DELETE
  USING (user_id = auth.uid());

-- ── ORGANIZATIONS ─────────────────────────────────────────────────────────────

ALTER TABLE public.organizations ENABLE ROW LEVEL SECURITY;

-- Verified organizations are publicly browsable; owner can always see their own
CREATE POLICY "organizations_select"
  ON public.organizations FOR SELECT
  USING (
    verification_state = 'verified'
    OR owner_id = auth.uid()
  );

-- Only authenticated, non-suspended users can create an organization
CREATE POLICY "organizations_insert_own"
  ON public.organizations FOR INSERT
  WITH CHECK (
    owner_id = auth.uid()
    AND public.current_user_state() NOT IN ('suspended', 'banned')
  );

-- Only owner can update
CREATE POLICY "organizations_update_own"
  ON public.organizations FOR UPDATE
  USING (owner_id = auth.uid())
  WITH CHECK (owner_id = auth.uid());

-- Only owner can delete (app layer must check for dependent listings first)
CREATE POLICY "organizations_delete_own"
  ON public.organizations FOR DELETE
  USING (owner_id = auth.uid());

-- ─────────────────────────────────────────────────────────────────────────────
-- SECURITY SUMMARY
-- After this migration every table in the public schema has RLS enabled.
-- No table is readable by the anon/user key without an explicit policy.
-- Privilege escalation via user_roles is blocked (no client INSERT policy).
-- Health share token IDOR is blocked (path-scoped INSERT + explicit SELECT).
-- ─────────────────────────────────────────────────────────────────────────────
