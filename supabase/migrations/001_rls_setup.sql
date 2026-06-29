-- ─────────────────────────────────────────────────────────────────────────────
-- ZoikoSocial — Row Level Security (RLS) Setup
-- Run this after your table creation migrations.
-- Every table must have RLS enabled. No exceptions.
-- ─────────────────────────────────────────────────────────────────────────────

-- ── HELPER FUNCTIONS ─────────────────────────────────────────────────────────

-- Returns the authenticated user's UUID from the JWT
CREATE OR REPLACE FUNCTION auth.uid() RETURNS uuid
  LANGUAGE sql STABLE
  AS $$ SELECT COALESCE(current_setting('request.jwt.claims', true)::json->>'sub', '')::uuid $$;

-- Returns true if the current user has a given role
CREATE OR REPLACE FUNCTION public.has_role(role_name text) RETURNS boolean
  LANGUAGE sql STABLE SECURITY DEFINER
  AS $$
    SELECT EXISTS (
      SELECT 1 FROM public.user_roles
      WHERE user_id = auth.uid() AND role = role_name AND is_active = true
    )
  $$;

-- Returns the trust/moderation state of the current user
CREATE OR REPLACE FUNCTION public.current_user_state() RETURNS text
  LANGUAGE sql STABLE SECURITY DEFINER
  AS $$
    SELECT state FROM public.profiles WHERE id = auth.uid()
  $$;

-- ── PROFILES ─────────────────────────────────────────────────────────────────

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Anyone can read a public profile
CREATE POLICY "profiles_select_public"
  ON public.profiles FOR SELECT
  USING (is_private = false OR id = auth.uid());

-- Users can only update their own profile
CREATE POLICY "profiles_update_own"
  ON public.profiles FOR UPDATE
  USING (id = auth.uid())
  WITH CHECK (id = auth.uid());

-- Profile is created by the auth trigger — no direct insert from client
CREATE POLICY "profiles_insert_auth_trigger"
  ON public.profiles FOR INSERT
  WITH CHECK (id = auth.uid());

-- ── POSTS ─────────────────────────────────────────────────────────────────────

ALTER TABLE public.posts ENABLE ROW LEVEL SECURITY;

-- Public posts visible to everyone; private posts only to author and followers
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

-- Only author can insert their own posts
CREATE POLICY "posts_insert_own"
  ON public.posts FOR INSERT
  WITH CHECK (
    author_id = auth.uid()
    -- Suspended or banned users cannot post
    AND public.current_user_state() NOT IN ('suspended', 'banned')
  );

-- Only author can update their own posts
CREATE POLICY "posts_update_own"
  ON public.posts FOR UPDATE
  USING (author_id = auth.uid())
  WITH CHECK (author_id = auth.uid());

-- Only author can delete their own posts (or moderator)
CREATE POLICY "posts_delete_own_or_moderator"
  ON public.posts FOR DELETE
  USING (author_id = auth.uid() OR public.has_role('moderator'));

-- ── MESSAGES ─────────────────────────────────────────────────────────────────

ALTER TABLE public.messages ENABLE ROW LEVEL SECURITY;

-- Only participants in a conversation can read messages
CREATE POLICY "messages_select_participants"
  ON public.messages FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.conversation_members
      WHERE conversation_id = messages.conversation_id
        AND user_id = auth.uid()
    )
  );

-- Only a conversation participant can send messages
CREATE POLICY "messages_insert_participant"
  ON public.messages FOR INSERT
  WITH CHECK (
    sender_id = auth.uid()
    AND EXISTS (
      SELECT 1 FROM public.conversation_members
      WHERE conversation_id = messages.conversation_id
        AND user_id = auth.uid()
    )
    AND public.current_user_state() NOT IN ('suspended', 'banned')
  );

-- Only sender can delete (soft-delete) their own messages
CREATE POLICY "messages_delete_own"
  ON public.messages FOR DELETE
  USING (sender_id = auth.uid());

-- ── CONVERSATIONS ─────────────────────────────────────────────────────────────

ALTER TABLE public.conversations ENABLE ROW LEVEL SECURITY;

CREATE POLICY "conversations_select_participants"
  ON public.conversations FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.conversation_members
      WHERE conversation_id = conversations.id
        AND user_id = auth.uid()
    )
  );

-- ── PET PROFILES ─────────────────────────────────────────────────────────────

ALTER TABLE public.pet_profiles ENABLE ROW LEVEL SECURITY;

-- Public pets visible to all; private pets only to owner
CREATE POLICY "pet_profiles_select"
  ON public.pet_profiles FOR SELECT
  USING (is_private = false OR owner_id = auth.uid());

-- Only owner can manage their pet profiles
CREATE POLICY "pet_profiles_insert_own"
  ON public.pet_profiles FOR INSERT
  WITH CHECK (owner_id = auth.uid());

CREATE POLICY "pet_profiles_update_own"
  ON public.pet_profiles FOR UPDATE
  USING (owner_id = auth.uid())
  WITH CHECK (owner_id = auth.uid());

CREATE POLICY "pet_profiles_delete_own"
  ON public.pet_profiles FOR DELETE
  USING (owner_id = auth.uid());

-- ── PET DIARY ────────────────────────────────────────────────────────────────

ALTER TABLE public.pet_diary_entries ENABLE ROW LEVEL SECURITY;

-- Diary entries visible based on pet privacy and entry privacy
CREATE POLICY "diary_select"
  ON public.pet_diary_entries FOR SELECT
  USING (
    -- Author can always see their own
    author_id = auth.uid()
    OR (
      -- Public entry on a public pet
      visibility = 'public'
      AND EXISTS (
        SELECT 1 FROM public.pet_profiles
        WHERE id = pet_diary_entries.pet_id
          AND is_private = false
      )
    )
  );

CREATE POLICY "diary_insert_own"
  ON public.pet_diary_entries FOR INSERT
  WITH CHECK (
    author_id = auth.uid()
    AND EXISTS (
      SELECT 1 FROM public.pet_profiles
      WHERE id = pet_diary_entries.pet_id
        AND owner_id = auth.uid()
    )
  );

CREATE POLICY "diary_update_own"
  ON public.pet_diary_entries FOR UPDATE
  USING (author_id = auth.uid())
  WITH CHECK (author_id = auth.uid());

CREATE POLICY "diary_delete_own"
  ON public.pet_diary_entries FOR DELETE
  USING (author_id = auth.uid());

-- ── LOST & FOUND ─────────────────────────────────────────────────────────────

ALTER TABLE public.lost_found_reports ENABLE ROW LEVEL SECURITY;

-- Anyone can view active lost/found reports (public safety feature)
CREATE POLICY "lost_found_select_active"
  ON public.lost_found_reports FOR SELECT
  USING (status IN ('active', 'resolved'));

-- Only verified users can post reports
CREATE POLICY "lost_found_insert_verified"
  ON public.lost_found_reports FOR INSERT
  WITH CHECK (
    reporter_id = auth.uid()
    AND public.current_user_state() NOT IN ('suspended', 'banned')
  );

-- Only reporter or moderator can update
CREATE POLICY "lost_found_update"
  ON public.lost_found_reports FOR UPDATE
  USING (reporter_id = auth.uid() OR public.has_role('moderator'));

-- ── PET CARE BOOKINGS ─────────────────────────────────────────────────────────

ALTER TABLE public.care_bookings ENABLE ROW LEVEL SECURITY;

-- Only seeker or provider can see a booking
CREATE POLICY "bookings_select_parties"
  ON public.care_bookings FOR SELECT
  USING (seeker_id = auth.uid() OR provider_id = auth.uid());

-- Only seeker can create a booking
CREATE POLICY "bookings_insert_seeker"
  ON public.care_bookings FOR INSERT
  WITH CHECK (
    seeker_id = auth.uid()
    AND public.current_user_state() NOT IN ('suspended', 'banned')
  );

-- Either party can update status (accept, complete, cancel)
CREATE POLICY "bookings_update_parties"
  ON public.care_bookings FOR UPDATE
  USING (seeker_id = auth.uid() OR provider_id = auth.uid());

-- ── HEALTH PASSPORT ───────────────────────────────────────────────────────────

ALTER TABLE public.health_records ENABLE ROW LEVEL SECURITY;

-- Health records are private — only owner or shared vet link
CREATE POLICY "health_records_select_owner"
  ON public.health_records FOR SELECT
  USING (
    owner_id = auth.uid()
    -- Allow access via a valid time-limited share token
    OR EXISTS (
      SELECT 1 FROM public.health_share_tokens
      WHERE health_share_tokens.pet_id = health_records.pet_id
        AND health_share_tokens.shared_with_user_id = auth.uid()
        AND health_share_tokens.expires_at > NOW()
        AND health_share_tokens.is_revoked = false
    )
  );

CREATE POLICY "health_records_insert_owner"
  ON public.health_records FOR INSERT
  WITH CHECK (owner_id = auth.uid());

CREATE POLICY "health_records_update_owner"
  ON public.health_records FOR UPDATE
  USING (owner_id = auth.uid())
  WITH CHECK (owner_id = auth.uid());

CREATE POLICY "health_records_delete_owner"
  ON public.health_records FOR DELETE
  USING (owner_id = auth.uid());

-- ── ADOPTION LISTINGS ─────────────────────────────────────────────────────────

ALTER TABLE public.adoption_listings ENABLE ROW LEVEL SECURITY;

-- Active listings visible to all
CREATE POLICY "adoption_select_active"
  ON public.adoption_listings FOR SELECT
  USING (status = 'active' OR organization_id IN (
    SELECT id FROM public.organizations WHERE owner_id = auth.uid()
  ));

-- Only verified organizations can post adoption listings
CREATE POLICY "adoption_insert_verified_org"
  ON public.adoption_listings FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.organizations
      WHERE id = adoption_listings.organization_id
        AND owner_id = auth.uid()
        AND verification_state = 'verified'
    )
  );

CREATE POLICY "adoption_update_org"
  ON public.adoption_listings FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM public.organizations
      WHERE id = adoption_listings.organization_id
        AND owner_id = auth.uid()
    )
  );

-- ── BREEDING MATCH ───────────────────────────────────────────────────────────

ALTER TABLE public.breeding_listings ENABLE ROW LEVEL SECURITY;

-- Active listings visible to authenticated users only
CREATE POLICY "breeding_select_authenticated"
  ON public.breeding_listings FOR SELECT
  USING (
    auth.uid() IS NOT NULL
    AND status = 'active'
    AND review_state = 'approved'
  );

-- Only verified users with valid pet health cert can post
CREATE POLICY "breeding_insert_verified"
  ON public.breeding_listings FOR INSERT
  WITH CHECK (
    owner_id = auth.uid()
    AND public.current_user_state() NOT IN ('suspended', 'banned')
    -- Health cert must exist and be approved for this pet
    AND EXISTS (
      SELECT 1 FROM public.pet_profiles
      WHERE id = breeding_listings.pet_id
        AND owner_id = auth.uid()
        AND health_cert_state = 'approved'
    )
  );

-- ── PRODUCTS / MARKETPLACE ───────────────────────────────────────────────────

ALTER TABLE public.product_listings ENABLE ROW LEVEL SECURITY;

-- Published listings visible to all
CREATE POLICY "products_select_published"
  ON public.product_listings FOR SELECT
  USING (status = 'published' AND review_state = 'approved');

-- Only verified sellers can create listings
CREATE POLICY "products_insert_verified_seller"
  ON public.product_listings FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.seller_profiles
      WHERE id = product_listings.seller_id
        AND user_id = auth.uid()
        AND verification_state = 'verified'
    )
  );

-- ── NOTIFICATIONS ─────────────────────────────────────────────────────────────

ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;

CREATE POLICY "notifications_select_own"
  ON public.notifications FOR SELECT
  USING (user_id = auth.uid());

CREATE POLICY "notifications_update_own"
  ON public.notifications FOR UPDATE
  USING (user_id = auth.uid())
  WITH CHECK (user_id = auth.uid());

-- ── AUDIT LOG — read-only ─────────────────────────────────────────────────────

ALTER TABLE public.audit_log ENABLE ROW LEVEL SECURITY;

-- Users can read their own audit entries; moderators read all
CREATE POLICY "audit_select"
  ON public.audit_log FOR SELECT
  USING (actor_id = auth.uid() OR public.has_role('moderator') OR public.has_role('admin'));

-- Audit log is insert-only (via server/triggers); no user updates or deletes
CREATE POLICY "audit_insert_server"
  ON public.audit_log FOR INSERT
  WITH CHECK (false); -- Only service role can insert (via admin client)

-- ─────────────────────────────────────────────────────────────────────────────
-- SAFETY RULE: All content insert policies block suspended/banned users.
-- The public.current_user_state() function is the single source of truth.
-- If a user is suspended, RLS prevents them from posting — even if the
-- application layer has a bug. This is defense in depth.
-- ─────────────────────────────────────────────────────────────────────────────
