-- ─────────────────────────────────────────────────────────────────────────────
-- ZoikoSocial — Communities Module (Phase 1: membership core + posts column)
-- See docs/communities-architecture.md
-- ─────────────────────────────────────────────────────────────────────────────

-- ── ENUMS ────────────────────────────────────────────────────────────────────

DO $$ BEGIN
  CREATE TYPE public.community_privacy AS ENUM ('public', 'private', 'invite_only');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  CREATE TYPE public.community_role AS ENUM ('owner', 'admin', 'moderator', 'member');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  CREATE TYPE public.member_status AS ENUM ('active', 'pending', 'banned');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  CREATE TYPE public.invite_type AS ENUM ('user', 'link');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

-- ── CATEGORIES (configurable, seeded) ────────────────────────────────────────

CREATE TABLE IF NOT EXISTS public.community_categories (
  id        uuid        PRIMARY KEY DEFAULT gen_random_uuid(),
  slug      text        NOT NULL UNIQUE,
  label     text        NOT NULL,
  icon      text,
  position  integer     NOT NULL DEFAULT 0,
  is_active boolean     NOT NULL DEFAULT true
);

INSERT INTO public.community_categories (slug, label, icon, position) VALUES
  ('general',       'General',        'Users',        0),
  ('dogs',          'Dogs',           'Dog',          1),
  ('cats',          'Cats',           'Cat',          2),
  ('birds',         'Birds',          'Bird',         3),
  ('fish',          'Fish',           'Fish',         4),
  ('reptiles',      'Reptiles',       'Turtle',       5),
  ('wildlife',      'Wildlife',       'Trees',        6),
  ('adoption',      'Adoption',       'Heart',        7),
  ('rescue',        'Rescue',         'Shield',       8),
  ('veterinarian',  'Veterinarian',   'Stethoscope',  9),
  ('pet-care',      'Pet Care',       'HandHeart',    10),
  ('grooming',      'Grooming',       'Scissors',     11),
  ('training',      'Training',       'Award',        12),
  ('nutrition',     'Nutrition',      'Apple',        13),
  ('breeding',      'Breeding',       'Dna',          14),
  ('marketplace',   'Marketplace',    'ShoppingBag',  15),
  ('verified-news', 'Verified News',  'Newspaper',    16)
ON CONFLICT (slug) DO NOTHING;

-- ── COMMUNITIES ──────────────────────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS public.communities (
  id             uuid                     PRIMARY KEY DEFAULT gen_random_uuid(),
  slug           text                     NOT NULL UNIQUE,
  name           text                     NOT NULL,
  description    text,
  avatar_url     text,
  cover_url      text,
  category_id    uuid                     REFERENCES public.community_categories(id),
  tags           text[]                   NOT NULL DEFAULT '{}',
  privacy        public.community_privacy NOT NULL DEFAULT 'public',
  is_verified    boolean                  NOT NULL DEFAULT false,
  members_count  integer                  NOT NULL DEFAULT 0,
  posts_count    integer                  NOT NULL DEFAULT 0,
  created_by     uuid                     NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  rules_updated_at timestamptz,
  is_deleted     boolean                  NOT NULL DEFAULT false,
  deleted_at     timestamptz,
  created_at     timestamptz              NOT NULL DEFAULT now(),
  updated_at     timestamptz              NOT NULL DEFAULT now(),
  -- Trigram search document — maintained by CommunitiesService on create/update
  -- (app-maintained rather than GENERATED because array_to_string is not immutable)
  search_doc     text                     NOT NULL DEFAULT ''
);

CREATE INDEX IF NOT EXISTS communities_category_idx
  ON public.communities (category_id) WHERE is_deleted = false;
CREATE INDEX IF NOT EXISTS communities_members_count_idx
  ON public.communities (members_count DESC) WHERE is_deleted = false;
CREATE INDEX IF NOT EXISTS communities_created_idx
  ON public.communities (created_at DESC) WHERE is_deleted = false;
CREATE INDEX IF NOT EXISTS communities_search_trgm_idx
  ON public.communities USING gin (search_doc gin_trgm_ops);

-- ── COMMUNITY MEMBERS ────────────────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS public.community_members (
  community_id      uuid                 NOT NULL REFERENCES public.communities(id) ON DELETE CASCADE,
  user_id           uuid                 NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  role              public.community_role NOT NULL DEFAULT 'member',
  status            public.member_status  NOT NULL DEFAULT 'active',
  muted_until       timestamptz,
  accepted_rules_at timestamptz,
  invited_by        uuid,
  created_at        timestamptz          NOT NULL DEFAULT now(),
  updated_at        timestamptz          NOT NULL DEFAULT now(),
  PRIMARY KEY (community_id, user_id)
);

CREATE INDEX IF NOT EXISTS cm_user_active_idx
  ON public.community_members (user_id) WHERE status = 'active';
CREATE INDEX IF NOT EXISTS cm_community_status_role_idx
  ON public.community_members (community_id, status, role);
CREATE UNIQUE INDEX IF NOT EXISTS cm_one_owner_idx
  ON public.community_members (community_id) WHERE role = 'owner';

-- ── COMMUNITY SETTINGS (1:1) ─────────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS public.community_settings (
  community_id       uuid    PRIMARY KEY REFERENCES public.communities(id) ON DELETE CASCADE,
  post_approval      boolean NOT NULL DEFAULT false,
  members_can_invite boolean NOT NULL DEFAULT false,
  notification_prefs jsonb
);

-- ── COMMUNITY RULES ──────────────────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS public.community_rules (
  id           uuid        PRIMARY KEY DEFAULT gen_random_uuid(),
  community_id uuid        NOT NULL REFERENCES public.communities(id) ON DELETE CASCADE,
  position     integer     NOT NULL DEFAULT 0,
  title        text        NOT NULL,
  body         text,
  created_at   timestamptz NOT NULL DEFAULT now(),
  updated_at   timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS community_rules_community_idx
  ON public.community_rules (community_id, position);

-- ── COMMUNITY INVITES ────────────────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS public.community_invites (
  id           uuid              PRIMARY KEY DEFAULT gen_random_uuid(),
  community_id uuid              NOT NULL REFERENCES public.communities(id) ON DELETE CASCADE,
  type         public.invite_type NOT NULL,
  invitee_id   uuid              REFERENCES public.profiles(id) ON DELETE CASCADE,
  code         text,
  expires_at   timestamptz,
  max_uses     integer,
  uses         integer           NOT NULL DEFAULT 0,
  revoked_at   timestamptz,
  created_by   uuid              NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  created_at   timestamptz       NOT NULL DEFAULT now()
);

CREATE UNIQUE INDEX IF NOT EXISTS invites_code_idx
  ON public.community_invites (code) WHERE revoked_at IS NULL AND code IS NOT NULL;
CREATE INDEX IF NOT EXISTS invites_invitee_idx
  ON public.community_invites (invitee_id) WHERE invitee_id IS NOT NULL;
CREATE INDEX IF NOT EXISTS invites_community_idx
  ON public.community_invites (community_id);

-- ── COMMUNITY POST PINS ──────────────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS public.community_post_pins (
  community_id uuid        NOT NULL REFERENCES public.communities(id) ON DELETE CASCADE,
  post_id      uuid        NOT NULL REFERENCES public.posts(id) ON DELETE CASCADE,
  type         text        NOT NULL DEFAULT 'pin',   -- pin | announcement
  pinned_by    uuid        NOT NULL REFERENCES public.profiles(id),
  created_at   timestamptz NOT NULL DEFAULT now(),
  PRIMARY KEY (community_id, post_id)
);

-- ── COMMUNITY REPORTS ────────────────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS public.community_reports (
  id           uuid        PRIMARY KEY DEFAULT gen_random_uuid(),
  community_id uuid        NOT NULL REFERENCES public.communities(id) ON DELETE CASCADE,
  reporter_id  uuid        NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  target_type  text        NOT NULL,   -- post | comment | member
  target_id    uuid        NOT NULL,
  reason       text        NOT NULL,   -- spam | harassment | off_topic | misinformation | other
  note         text,
  status       text        NOT NULL DEFAULT 'open',  -- open | actioned | dismissed
  reviewed_by  uuid        REFERENCES public.profiles(id),
  reviewed_at  timestamptz,
  created_at   timestamptz NOT NULL DEFAULT now(),
  UNIQUE (community_id, reporter_id, target_type, target_id)
);

CREATE INDEX IF NOT EXISTS community_reports_open_idx
  ON public.community_reports (community_id, status);

-- ── POSTS: community_id column ───────────────────────────────────────────────

ALTER TABLE public.posts
  ADD COLUMN IF NOT EXISTS community_id uuid REFERENCES public.communities(id) ON DELETE CASCADE;

CREATE INDEX IF NOT EXISTS posts_community_created_idx
  ON public.posts (community_id, created_at DESC)
  WHERE community_id IS NOT NULL AND is_deleted = false;

-- ── RLS (defense-in-depth; API uses service role) ────────────────────────────

ALTER TABLE public.communities         ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.community_members   ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.community_settings  ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.community_rules     ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.community_invites   ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.community_post_pins ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.community_reports   ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.community_categories ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "communities_select"       ON public.communities;
CREATE POLICY "communities_select"       ON public.communities FOR SELECT USING (is_deleted = false);
DROP POLICY IF EXISTS "community_categories_sel"  ON public.community_categories;
CREATE POLICY "community_categories_sel"  ON public.community_categories FOR SELECT USING (true);
DROP POLICY IF EXISTS "community_members_select"  ON public.community_members;
CREATE POLICY "community_members_select"  ON public.community_members FOR SELECT USING (true);
DROP POLICY IF EXISTS "community_rules_select"    ON public.community_rules;
CREATE POLICY "community_rules_select"    ON public.community_rules FOR SELECT USING (true);
DROP POLICY IF EXISTS "community_settings_select" ON public.community_settings;
CREATE POLICY "community_settings_select" ON public.community_settings FOR SELECT USING (true);
DROP POLICY IF EXISTS "community_pins_select"     ON public.community_post_pins;
CREATE POLICY "community_pins_select"     ON public.community_post_pins FOR SELECT USING (true);
DROP POLICY IF EXISTS "community_invites_select"  ON public.community_invites;
CREATE POLICY "community_invites_select"  ON public.community_invites FOR SELECT
  USING (invitee_id = auth.uid() OR created_by = auth.uid());
DROP POLICY IF EXISTS "community_reports_insert"  ON public.community_reports;
CREATE POLICY "community_reports_insert"  ON public.community_reports FOR INSERT
  WITH CHECK (reporter_id = auth.uid());
