-- ─────────────────────────────────────────────────────────────────────────────
-- ZoikoSocial — Database Schema
-- Creates all tables, indexes, enums, and auth trigger.
-- Run BEFORE 001_rls_setup.sql
-- ─────────────────────────────────────────────────────────────────────────────

-- ── EXTENSIONS ───────────────────────────────────────────────────────────────

CREATE EXTENSION IF NOT EXISTS "pg_trgm";

-- ── ENUMS ─────────────────────────────────────────────────────────────────────

CREATE TYPE public.user_state AS ENUM ('active', 'suspended', 'banned', 'deleted');
CREATE TYPE public.user_role AS ENUM ('user', 'moderator', 'admin', 'super_admin');
CREATE TYPE public.verification_tier AS ENUM ('none', 'email', 'phone', 'identity', 'professional');
CREATE TYPE public.post_type AS ENUM ('text', 'image', 'video', 'reel', 'story');
CREATE TYPE public.post_visibility AS ENUM ('public', 'followers', 'community', 'private');
CREATE TYPE public.conversation_type AS ENUM ('dm', 'group', 'community');
CREATE TYPE public.animal_category AS ENUM (
  'dog', 'cat', 'bird', 'rabbit', 'hamster', 'guinea_pig',
  'fish', 'reptile', 'horse', 'farm_animal', 'exotic', 'other'
);
CREATE TYPE public.lost_found_status AS ENUM ('active', 'resolved');
CREATE TYPE public.booking_status AS ENUM ('pending', 'confirmed', 'in_progress', 'completed', 'cancelled');
CREATE TYPE public.review_state AS ENUM ('pending', 'approved', 'rejected');
CREATE TYPE public.verification_state AS ENUM ('unverified', 'pending', 'verified', 'rejected');
CREATE TYPE public.health_cert_state AS ENUM ('none', 'pending', 'approved', 'expired');

-- ── PROFILES ──────────────────────────────────────────────────────────────────

CREATE TABLE public.profiles (
  id                uuid        PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  username          text        UNIQUE NOT NULL,
  display_name      text        NOT NULL,
  bio               text,
  avatar_url        text,
  website_url       text,
  state             public.user_state       NOT NULL DEFAULT 'active',
  role              public.user_role        NOT NULL DEFAULT 'user',
  verification_tier public.verification_tier NOT NULL DEFAULT 'none',
  is_private        boolean     NOT NULL DEFAULT false,
  followers_count   integer     NOT NULL DEFAULT 0,
  following_count   integer     NOT NULL DEFAULT 0,
  posts_count       integer     NOT NULL DEFAULT 0,
  trust_score       integer     NOT NULL DEFAULT 100,
  created_at        timestamptz NOT NULL DEFAULT now(),
  updated_at        timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX profiles_username_idx ON public.profiles (username);
CREATE INDEX profiles_state_idx    ON public.profiles (state);

-- ── USER ROLES ────────────────────────────────────────────────────────────────

CREATE TABLE public.user_roles (
  id          uuid        PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id     uuid        NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  role        public.user_role NOT NULL,
  is_active   boolean     NOT NULL DEFAULT true,
  granted_by  uuid        REFERENCES public.profiles(id),
  granted_at  timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX user_roles_user_id_idx ON public.user_roles (user_id);

-- ── FOLLOWS ───────────────────────────────────────────────────────────────────

CREATE TABLE public.follows (
  follower_id  uuid NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  following_id uuid NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  status       text NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'blocked')),
  created_at   timestamptz NOT NULL DEFAULT now(),
  PRIMARY KEY (follower_id, following_id)
);

CREATE INDEX follows_following_id_idx ON public.follows (following_id);

-- ── POSTS ─────────────────────────────────────────────────────────────────────

CREATE TABLE public.posts (
  id             uuid        PRIMARY KEY DEFAULT gen_random_uuid(),
  author_id      uuid        NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  type           public.post_type       NOT NULL DEFAULT 'text',
  body           text,
  media_urls     text[]      NOT NULL DEFAULT '{}',
  visibility     public.post_visibility NOT NULL DEFAULT 'public',
  likes_count    integer     NOT NULL DEFAULT 0,
  comments_count integer     NOT NULL DEFAULT 0,
  shares_count   integer     NOT NULL DEFAULT 0,
  safety_cleared boolean     NOT NULL DEFAULT false,
  is_deleted     boolean     NOT NULL DEFAULT false,
  created_at     timestamptz NOT NULL DEFAULT now(),
  updated_at     timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX posts_author_id_idx  ON public.posts (author_id);
CREATE INDEX posts_created_at_idx ON public.posts (created_at DESC);
CREATE INDEX posts_visibility_idx ON public.posts (visibility);

-- ── CONVERSATIONS & MESSAGES ──────────────────────────────────────────────────

CREATE TABLE public.conversations (
  id              uuid        PRIMARY KEY DEFAULT gen_random_uuid(),
  type            public.conversation_type NOT NULL DEFAULT 'dm',
  name            text,
  avatar_url      text,
  created_by      uuid        REFERENCES public.profiles(id),
  last_message_at timestamptz,
  created_at      timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE public.conversation_members (
  conversation_id uuid        NOT NULL REFERENCES public.conversations(id) ON DELETE CASCADE,
  user_id         uuid        NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  joined_at       timestamptz NOT NULL DEFAULT now(),
  last_read_at    timestamptz,
  PRIMARY KEY (conversation_id, user_id)
);

CREATE INDEX conv_members_user_id_idx ON public.conversation_members (user_id);

CREATE TABLE public.messages (
  id              uuid        PRIMARY KEY DEFAULT gen_random_uuid(),
  conversation_id uuid        NOT NULL REFERENCES public.conversations(id) ON DELETE CASCADE,
  sender_id       uuid        NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  body            text,
  media_urls      text[]      NOT NULL DEFAULT '{}',
  is_deleted      boolean     NOT NULL DEFAULT false,
  edited_at       timestamptz,
  created_at      timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX messages_conv_id_idx    ON public.messages (conversation_id);
CREATE INDEX messages_created_at_idx ON public.messages (created_at DESC);

-- ── PET PROFILES ──────────────────────────────────────────────────────────────

CREATE TABLE public.pet_profiles (
  id                uuid        PRIMARY KEY DEFAULT gen_random_uuid(),
  owner_id          uuid        NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  name              text        NOT NULL,
  species           public.animal_category NOT NULL,
  breed             text,
  date_of_birth     date,
  avatar_url        text,
  bio               text,
  is_private        boolean     NOT NULL DEFAULT false,
  health_cert_state public.health_cert_state NOT NULL DEFAULT 'none',
  created_at        timestamptz NOT NULL DEFAULT now(),
  updated_at        timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX pet_profiles_owner_id_idx ON public.pet_profiles (owner_id);

-- ── PET DIARY ─────────────────────────────────────────────────────────────────

CREATE TABLE public.pet_diary_entries (
  id         uuid        PRIMARY KEY DEFAULT gen_random_uuid(),
  pet_id     uuid        NOT NULL REFERENCES public.pet_profiles(id) ON DELETE CASCADE,
  author_id  uuid        NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  title      text        NOT NULL,
  body       text,
  media_urls text[]      NOT NULL DEFAULT '{}',
  visibility public.post_visibility NOT NULL DEFAULT 'public',
  entry_date date        NOT NULL DEFAULT CURRENT_DATE,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX diary_pet_id_idx    ON public.pet_diary_entries (pet_id);
CREATE INDEX diary_author_id_idx ON public.pet_diary_entries (author_id);

-- ── LOST & FOUND ──────────────────────────────────────────────────────────────

CREATE TABLE public.lost_found_reports (
  id                 uuid        PRIMARY KEY DEFAULT gen_random_uuid(),
  reporter_id        uuid        NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  type               text        NOT NULL CHECK (type IN ('lost', 'found')),
  species            public.animal_category NOT NULL,
  description        text        NOT NULL,
  photo_urls         text[]      NOT NULL DEFAULT '{}',
  last_seen_location text        NOT NULL,
  latitude           numeric(9,6),
  longitude          numeric(9,6),
  contact_info       text        NOT NULL,
  status             public.lost_found_status NOT NULL DEFAULT 'active',
  created_at         timestamptz NOT NULL DEFAULT now(),
  updated_at         timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX lost_found_status_idx   ON public.lost_found_reports (status);
CREATE INDEX lost_found_reporter_idx ON public.lost_found_reports (reporter_id);

-- ── CARE BOOKINGS ─────────────────────────────────────────────────────────────

CREATE TABLE public.care_bookings (
  id           uuid        PRIMARY KEY DEFAULT gen_random_uuid(),
  seeker_id    uuid        NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  provider_id  uuid        NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  pet_id       uuid        NOT NULL REFERENCES public.pet_profiles(id),
  service_type text        NOT NULL,
  status       public.booking_status NOT NULL DEFAULT 'pending',
  hourly_rate  numeric(10,2) NOT NULL,
  start_at     timestamptz NOT NULL,
  end_at       timestamptz NOT NULL,
  notes        text,
  created_at   timestamptz NOT NULL DEFAULT now(),
  updated_at   timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX bookings_seeker_idx   ON public.care_bookings (seeker_id);
CREATE INDEX bookings_provider_idx ON public.care_bookings (provider_id);

-- ── HEALTH PASSPORT ───────────────────────────────────────────────────────────

CREATE TABLE public.health_records (
  id           uuid  PRIMARY KEY DEFAULT gen_random_uuid(),
  pet_id       uuid  NOT NULL REFERENCES public.pet_profiles(id) ON DELETE CASCADE,
  owner_id     uuid  NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  record_type  text  NOT NULL,
  title        text  NOT NULL,
  notes        text,
  document_url text,
  record_date  date  NOT NULL,
  created_at   timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX health_records_pet_id_idx   ON public.health_records (pet_id);
CREATE INDEX health_records_owner_id_idx ON public.health_records (owner_id);

CREATE TABLE public.health_share_tokens (
  id                  uuid        PRIMARY KEY DEFAULT gen_random_uuid(),
  pet_id              uuid        NOT NULL REFERENCES public.pet_profiles(id) ON DELETE CASCADE,
  shared_by_user_id   uuid        NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  shared_with_user_id uuid        NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  expires_at          timestamptz NOT NULL,
  is_revoked          boolean     NOT NULL DEFAULT false,
  created_at          timestamptz NOT NULL DEFAULT now()
);

-- ── ORGANIZATIONS ─────────────────────────────────────────────────────────────

CREATE TABLE public.organizations (
  id                 uuid        PRIMARY KEY DEFAULT gen_random_uuid(),
  owner_id           uuid        NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  name               text        NOT NULL,
  description        text,
  logo_url           text,
  website_url        text,
  verification_state public.verification_state NOT NULL DEFAULT 'unverified',
  created_at         timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX organizations_owner_id_idx ON public.organizations (owner_id);

-- ── ADOPTION LISTINGS ─────────────────────────────────────────────────────────

CREATE TABLE public.adoption_listings (
  id              uuid        PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id uuid        NOT NULL REFERENCES public.organizations(id) ON DELETE CASCADE,
  pet_id          uuid        REFERENCES public.pet_profiles(id),
  name            text        NOT NULL,
  species         public.animal_category NOT NULL,
  breed           text,
  age_years       integer,
  description     text        NOT NULL,
  photo_urls      text[]      NOT NULL DEFAULT '{}',
  status          text        NOT NULL DEFAULT 'active'
                    CHECK (status IN ('active', 'adopted', 'withdrawn')),
  created_at      timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX adoption_listings_org_idx    ON public.adoption_listings (organization_id);
CREATE INDEX adoption_listings_status_idx ON public.adoption_listings (status);

-- ── BREEDING LISTINGS ─────────────────────────────────────────────────────────

CREATE TABLE public.breeding_listings (
  id           uuid        PRIMARY KEY DEFAULT gen_random_uuid(),
  owner_id     uuid        NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  pet_id       uuid        NOT NULL REFERENCES public.pet_profiles(id) ON DELETE CASCADE,
  description  text,
  status       text        NOT NULL DEFAULT 'active'
                 CHECK (status IN ('active', 'matched', 'withdrawn')),
  review_state public.review_state NOT NULL DEFAULT 'pending',
  created_at   timestamptz NOT NULL DEFAULT now()
);

-- ── PRODUCT MARKETPLACE ───────────────────────────────────────────────────────

CREATE TABLE public.seller_profiles (
  id                 uuid        PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id            uuid        NOT NULL UNIQUE REFERENCES public.profiles(id) ON DELETE CASCADE,
  business_name      text        NOT NULL,
  verification_state public.verification_state NOT NULL DEFAULT 'unverified',
  created_at         timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE public.product_listings (
  id           uuid        PRIMARY KEY DEFAULT gen_random_uuid(),
  seller_id    uuid        NOT NULL REFERENCES public.seller_profiles(id) ON DELETE CASCADE,
  name         text        NOT NULL,
  description  text,
  price        numeric(10,2) NOT NULL,
  currency     text        NOT NULL DEFAULT 'USD',
  photo_urls   text[]      NOT NULL DEFAULT '{}',
  status       text        NOT NULL DEFAULT 'draft'
                 CHECK (status IN ('draft', 'published', 'sold', 'withdrawn')),
  review_state public.review_state NOT NULL DEFAULT 'pending',
  created_at   timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX product_listings_seller_idx ON public.product_listings (seller_id);
CREATE INDEX product_listings_status_idx ON public.product_listings (status);

-- ── NOTIFICATIONS ─────────────────────────────────────────────────────────────

CREATE TABLE public.notifications (
  id         uuid        PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id    uuid        NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  type       text        NOT NULL,
  title      text        NOT NULL,
  body       text,
  data       jsonb,
  is_read    boolean     NOT NULL DEFAULT false,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX notifications_user_id_idx ON public.notifications (user_id);
CREATE INDEX notifications_read_idx    ON public.notifications (user_id, is_read);

-- ── AUDIT LOG ─────────────────────────────────────────────────────────────────

CREATE TABLE public.audit_log (
  id          uuid        PRIMARY KEY DEFAULT gen_random_uuid(),
  actor_id    uuid        REFERENCES public.profiles(id),
  action      text        NOT NULL,
  entity_type text        NOT NULL,
  entity_id   uuid,
  old_data    jsonb,
  new_data    jsonb,
  ip_address  inet,
  user_agent  text,
  created_at  timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX audit_log_actor_id_idx   ON public.audit_log (actor_id);
CREATE INDEX audit_log_entity_idx     ON public.audit_log (entity_type, entity_id);
CREATE INDEX audit_log_created_at_idx ON public.audit_log (created_at DESC);

-- ── AUTH TRIGGER — auto-create profile on signup ──────────────────────────────

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = public
AS $$
DECLARE
  base_username text;
  final_username text;
  counter integer := 0;
BEGIN
  base_username := LOWER(REGEXP_REPLACE(SPLIT_PART(NEW.email, '@', 1), '[^a-z0-9_]', '_', 'g'));
  final_username := base_username;

  -- Ensure unique username by appending a number if needed
  WHILE EXISTS (SELECT 1 FROM public.profiles WHERE username = final_username) LOOP
    counter := counter + 1;
    final_username := base_username || counter::text;
  END LOOP;

  INSERT INTO public.profiles (id, username, display_name)
  VALUES (
    NEW.id,
    final_username,
    COALESCE(NEW.raw_user_meta_data->>'full_name', SPLIT_PART(NEW.email, '@', 1))
  )
  ON CONFLICT (id) DO NOTHING;

  RETURN NEW;
END;
$$;

CREATE OR REPLACE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
