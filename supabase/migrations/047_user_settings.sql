-- ── User Settings: privacy toggles, notification prefs, display prefs ──────
-- One row per user, auto-created on first settings save. All columns have
-- sensible defaults so the API is never blocked by a missing row.
-- Mirror table is managed via Prisma; this migration keeps Supabase in sync.
-- ─────────────────────────────────────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS public.user_settings (
  id              uuid    NOT NULL DEFAULT gen_random_uuid(),
  user_id         uuid    NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,

  -- Privacy toggles
  show_last_active  boolean NOT NULL DEFAULT true,
  show_email        boolean NOT NULL DEFAULT false,
  allow_tagging     boolean NOT NULL DEFAULT true,
  show_location     boolean NOT NULL DEFAULT false,
  allow_messaging   text    NOT NULL DEFAULT 'everyone', -- everyone | connections | none

  -- Notification preferences
  notif_likes        boolean NOT NULL DEFAULT true,
  notif_comments     boolean NOT NULL DEFAULT true,
  notif_follows      boolean NOT NULL DEFAULT true,
  notif_mentions     boolean NOT NULL DEFAULT true,
  notif_events       boolean NOT NULL DEFAULT true,
  notif_communities  boolean NOT NULL DEFAULT true,
  notif_news         boolean NOT NULL DEFAULT true,
  notif_promotions   boolean NOT NULL DEFAULT false,
  email_digest       boolean NOT NULL DEFAULT true,
  email_marketing    boolean NOT NULL DEFAULT false,
  push_enabled       boolean NOT NULL DEFAULT true,

  -- Display preferences
  reduced_motion    boolean NOT NULL DEFAULT false,
  compact_view      boolean NOT NULL DEFAULT false,

  created_at        timestamptz NOT NULL DEFAULT now(),
  updated_at        timestamptz NOT NULL DEFAULT now(),

  CONSTRAINT user_settings_pkey PRIMARY KEY (id),
  CONSTRAINT user_settings_user_id_key UNIQUE (user_id)
);

-- Enable RLS so the row-level trigger in the app's PostgREST path works too
ALTER TABLE IF EXISTS public.user_settings ENABLE ROW LEVEL SECURITY;

-- Users can read/write only their own row
DROP POLICY IF EXISTS "user_settings_select_own" ON public.user_settings;
CREATE POLICY "user_settings_select_own" ON public.user_settings
  FOR SELECT USING (user_id = auth.uid());

DROP POLICY IF EXISTS "user_settings_insert_own" ON public.user_settings;
CREATE POLICY "user_settings_insert_own" ON public.user_settings
  FOR INSERT WITH CHECK (user_id = auth.uid());

DROP POLICY IF EXISTS "user_settings_update_own" ON public.user_settings;
CREATE POLICY "user_settings_update_own" ON public.user_settings
  FOR UPDATE USING (user_id = auth.uid()) WITH CHECK (user_id = auth.uid());
