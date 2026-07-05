-- ─────────────────────────────────────────────────────────────────────────────
-- ZoikoSocial — Profile & Network Module Tables
-- Adds tables for professional profiles, verification workflow,
-- follow requests, blocked users, and muted users.
-- ─────────────────────────────────────────────────────────────────────────────

-- ── NEW ENUMS (idempotent — skip if already exists) ───────────────────────────

DO $$ BEGIN
  CREATE TYPE public.professional_category AS ENUM (
    'verified_news_publisher',
    'product_seller',
    'pet_care_service_provider',
    'veterinarian'
  );
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
  CREATE TYPE public.verification_request_status AS ENUM (
    'pending',
    'under_review',
    'approved',
    'rejected',
    'additional_info_required'
  );
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
  CREATE TYPE public.follow_request_status AS ENUM (
    'pending',
    'accepted',
    'rejected'
  );
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

-- ── PROFESSIONAL PROFILES ────────────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS public.professional_profiles (
  id                uuid                      PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id           uuid                      NOT NULL UNIQUE REFERENCES public.profiles(id) ON DELETE CASCADE,
  category          public.professional_category NOT NULL,
  business_name     text,
  business_email    text,
  business_phone    text,
  business_address  text,
  description       text,
  website_url       text,
  logo_url          text,
  tax_id            text,
  license_number    text,
  service_areas     text[]                    NOT NULL DEFAULT '{}',
  business_hours    jsonb,
  is_verified       boolean                   NOT NULL DEFAULT false,
  verified_at       timestamptz,
  created_at        timestamptz               NOT NULL DEFAULT now(),
  updated_at        timestamptz               NOT NULL DEFAULT now(),
  deleted_at        timestamptz
);

CREATE INDEX IF NOT EXISTS professional_profiles_category_idx ON public.professional_profiles (category);
CREATE INDEX IF NOT EXISTS professional_profiles_verified_idx ON public.professional_profiles (is_verified) WHERE is_verified = true;

-- ── PROFESSIONAL SETTINGS ────────────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS public.professional_settings (
  id                    uuid        PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id               uuid        NOT NULL UNIQUE REFERENCES public.profiles(id) ON DELETE CASCADE,
  show_email            boolean     NOT NULL DEFAULT false,
  show_phone            boolean     NOT NULL DEFAULT false,
  show_address          boolean     NOT NULL DEFAULT false,
  available_for_booking boolean     NOT NULL DEFAULT true,
  notification_preferences jsonb,
  created_at            timestamptz NOT NULL DEFAULT now(),
  updated_at            timestamptz NOT NULL DEFAULT now()
);

-- ── PROFESSIONAL PERMISSIONS ────────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS public.professional_permissions (
  id             uuid        PRIMARY KEY DEFAULT gen_random_uuid(),
  category_slug  text        NOT NULL,
  permission     text        NOT NULL,
  description    text,
  created_at     timestamptz NOT NULL DEFAULT now(),
  UNIQUE (category_slug, permission)
);

-- ── VERIFICATION REQUESTS ───────────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS public.verification_requests (
  id                uuid                            PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id           uuid                            NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  type              text                            NOT NULL,
  status            public.verification_request_status NOT NULL DEFAULT 'pending',
  category_slug     text,
  notes             text,
  reviewed_by       uuid                            REFERENCES public.profiles(id),
  reviewed_at       timestamptz,
  rejection_reason  text,
  created_at        timestamptz                     NOT NULL DEFAULT now(),
  updated_at        timestamptz                     NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS verification_requests_user_id_idx ON public.verification_requests (user_id);
CREATE INDEX IF NOT EXISTS verification_requests_status_idx ON public.verification_requests (status);

-- ── VERIFICATION DOCUMENTS ──────────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS public.verification_documents (
  id             uuid        PRIMARY KEY DEFAULT gen_random_uuid(),
  request_id     uuid        NOT NULL REFERENCES public.verification_requests(id) ON DELETE CASCADE,
  document_type  text        NOT NULL,
  document_url   text        NOT NULL,
  file_name      text,
  file_size      integer,
  mime_type      text,
  status         text        NOT NULL DEFAULT 'pending',
  notes          text,
  created_at     timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS verification_documents_request_id_idx ON public.verification_documents (request_id);

-- ── FOLLOW REQUESTS ─────────────────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS public.follow_requests (
  id             uuid                        PRIMARY KEY DEFAULT gen_random_uuid(),
  sender_id      uuid                        NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  receiver_id    uuid                        NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  status         public.follow_request_status NOT NULL DEFAULT 'pending',
  message        text,
  created_at     timestamptz                  NOT NULL DEFAULT now(),
  updated_at     timestamptz                  NOT NULL DEFAULT now(),
  UNIQUE (sender_id, receiver_id)
);

CREATE INDEX IF NOT EXISTS follow_requests_receiver_status_idx ON public.follow_requests (receiver_id, status);

-- ── BLOCKED USERS ───────────────────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS public.blocked_users (
  blocker_id  uuid        NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  blocked_id  uuid        NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  reason      text,
  created_at  timestamptz NOT NULL DEFAULT now(),
  PRIMARY KEY (blocker_id, blocked_id)
);

-- ── MUTED USERS ─────────────────────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS public.muted_users (
  muter_id   uuid        NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  muted_id   uuid        NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  created_at timestamptz NOT NULL DEFAULT now(),
  PRIMARY KEY (muter_id, muted_id)
);

-- ── AUTH TRIGGER UPDATE — create verification_tier on profile update already exists

-- ── RLS POLICIES (idempotent — drop first to avoid "already exists") ────────

ALTER TABLE IF EXISTS public.professional_profiles ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "professional_profiles_select" ON public.professional_profiles;
CREATE POLICY "professional_profiles_select" ON public.professional_profiles FOR SELECT USING (true);

DROP POLICY IF EXISTS "professional_profiles_insert_own" ON public.professional_profiles;
CREATE POLICY "professional_profiles_insert_own" ON public.professional_profiles FOR INSERT WITH CHECK (user_id = auth.uid());

DROP POLICY IF EXISTS "professional_profiles_update_own" ON public.professional_profiles;
CREATE POLICY "professional_profiles_update_own" ON public.professional_profiles FOR UPDATE USING (user_id = auth.uid()) WITH CHECK (user_id = auth.uid());

DROP POLICY IF EXISTS "professional_profiles_delete_own" ON public.professional_profiles;
CREATE POLICY "professional_profiles_delete_own" ON public.professional_profiles FOR DELETE USING (user_id = auth.uid());

ALTER TABLE IF EXISTS public.professional_settings ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "professional_settings_select_own" ON public.professional_settings;
CREATE POLICY "professional_settings_select_own" ON public.professional_settings FOR SELECT USING (user_id = auth.uid());

DROP POLICY IF EXISTS "professional_settings_insert_own" ON public.professional_settings;
CREATE POLICY "professional_settings_insert_own" ON public.professional_settings FOR INSERT WITH CHECK (user_id = auth.uid());

DROP POLICY IF EXISTS "professional_settings_update_own" ON public.professional_settings;
CREATE POLICY "professional_settings_update_own" ON public.professional_settings FOR UPDATE USING (user_id = auth.uid()) WITH CHECK (user_id = auth.uid());

ALTER TABLE IF EXISTS public.verification_requests ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "verification_requests_select_own" ON public.verification_requests;
CREATE POLICY "verification_requests_select_own" ON public.verification_requests FOR SELECT USING (user_id = auth.uid() OR public.has_role('admin') OR public.has_role('moderator'));

DROP POLICY IF EXISTS "verification_requests_insert_own" ON public.verification_requests;
CREATE POLICY "verification_requests_insert_own" ON public.verification_requests FOR INSERT WITH CHECK (user_id = auth.uid());

DROP POLICY IF EXISTS "verification_requests_update_admin" ON public.verification_requests;
CREATE POLICY "verification_requests_update_admin" ON public.verification_requests FOR UPDATE USING (public.has_role('admin') OR public.has_role('moderator')) WITH CHECK (public.has_role('admin') OR public.has_role('moderator'));

ALTER TABLE IF EXISTS public.verification_documents ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "verification_documents_select_own" ON public.verification_documents;
CREATE POLICY "verification_documents_select_own" ON public.verification_documents FOR SELECT USING (EXISTS (SELECT 1 FROM public.verification_requests WHERE id = verification_documents.request_id AND (user_id = auth.uid() OR public.has_role('admin'))));

DROP POLICY IF EXISTS "verification_documents_insert_own" ON public.verification_documents;
CREATE POLICY "verification_documents_insert_own" ON public.verification_documents FOR INSERT WITH CHECK (EXISTS (SELECT 1 FROM public.verification_requests WHERE id = verification_documents.request_id AND user_id = auth.uid()));

ALTER TABLE IF EXISTS public.follow_requests ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "follow_requests_select" ON public.follow_requests;
CREATE POLICY "follow_requests_select" ON public.follow_requests FOR SELECT USING (sender_id = auth.uid() OR receiver_id = auth.uid());

DROP POLICY IF EXISTS "follow_requests_insert" ON public.follow_requests;
CREATE POLICY "follow_requests_insert" ON public.follow_requests FOR INSERT WITH CHECK (sender_id = auth.uid());

DROP POLICY IF EXISTS "follow_requests_update" ON public.follow_requests;
CREATE POLICY "follow_requests_update" ON public.follow_requests FOR UPDATE USING (sender_id = auth.uid() OR receiver_id = auth.uid()) WITH CHECK (sender_id = auth.uid() OR receiver_id = auth.uid());

ALTER TABLE IF EXISTS public.blocked_users ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "blocked_users_select_own" ON public.blocked_users;
CREATE POLICY "blocked_users_select_own" ON public.blocked_users FOR SELECT USING (blocker_id = auth.uid());

DROP POLICY IF EXISTS "blocked_users_insert_own" ON public.blocked_users;
CREATE POLICY "blocked_users_insert_own" ON public.blocked_users FOR INSERT WITH CHECK (blocker_id = auth.uid());

DROP POLICY IF EXISTS "blocked_users_delete_own" ON public.blocked_users;
CREATE POLICY "blocked_users_delete_own" ON public.blocked_users FOR DELETE USING (blocker_id = auth.uid());

ALTER TABLE IF EXISTS public.muted_users ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "muted_users_select_own" ON public.muted_users;
CREATE POLICY "muted_users_select_own" ON public.muted_users FOR SELECT USING (muter_id = auth.uid());

DROP POLICY IF EXISTS "muted_users_insert_own" ON public.muted_users;
CREATE POLICY "muted_users_insert_own" ON public.muted_users FOR INSERT WITH CHECK (muter_id = auth.uid());

DROP POLICY IF EXISTS "muted_users_delete_own" ON public.muted_users;
CREATE POLICY "muted_users_delete_own" ON public.muted_users FOR DELETE USING (muter_id = auth.uid());
