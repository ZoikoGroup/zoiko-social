-- ── Vet Finder: clinic profiles, appointments & team ────────────────────────
-- Extends the shared service_providers / pet_care_bookings tables with the
-- vet-specific fields powering the advanced Vet Finder (emergency discovery,
-- rich clinic profiles, appointments and Health Passport integration), plus a
-- clinic team-members table. Idempotent — safe to re-run.
-- ─────────────────────────────────────────────────────────────────────────────

-- ── Clinic profile fields on service_providers ───────────────────────────────
ALTER TABLE public.service_providers ADD COLUMN IF NOT EXISTS logo_url            text;
ALTER TABLE public.service_providers ADD COLUMN IF NOT EXISTS photo_urls          text[]  NOT NULL DEFAULT '{}';
ALTER TABLE public.service_providers ADD COLUMN IF NOT EXISTS specialties         text[]  NOT NULL DEFAULT '{}';
ALTER TABLE public.service_providers ADD COLUMN IF NOT EXISTS species             text[]  NOT NULL DEFAULT '{}';
ALTER TABLE public.service_providers ADD COLUMN IF NOT EXISTS facilities          text[]  NOT NULL DEFAULT '{}';
ALTER TABLE public.service_providers ADD COLUMN IF NOT EXISTS consult_modes       text[]  NOT NULL DEFAULT '{}';   -- in_clinic | home_visit | video
ALTER TABLE public.service_providers ADD COLUMN IF NOT EXISTS languages           text[]  NOT NULL DEFAULT '{}';
ALTER TABLE public.service_providers ADD COLUMN IF NOT EXISTS emergency_available boolean NOT NULL DEFAULT false;
ALTER TABLE public.service_providers ADD COLUMN IF NOT EXISTS is_24x7             boolean NOT NULL DEFAULT false;
ALTER TABLE public.service_providers ADD COLUMN IF NOT EXISTS accepts_walkins     boolean NOT NULL DEFAULT false;
ALTER TABLE public.service_providers ADD COLUMN IF NOT EXISTS hours               jsonb;                            -- [{day:0-6, open:"09:00", close:"18:00", closed:false}]
ALTER TABLE public.service_providers ADD COLUMN IF NOT EXISTS license_no          text;
ALTER TABLE public.service_providers ADD COLUMN IF NOT EXISTS is_verified         boolean NOT NULL DEFAULT false;   -- admin-controlled trust flag

-- Emergency clinics are a hot discovery filter — index them.
CREATE INDEX IF NOT EXISTS service_providers_emergency_idx
  ON public.service_providers (category) WHERE emergency_available = true AND is_deleted = false;

-- ── Appointment fields on pet_care_bookings (reused as vet appointments) ──────
ALTER TABLE public.pet_care_bookings ADD COLUMN IF NOT EXISTS pet_id        uuid REFERENCES public.pets(id) ON DELETE SET NULL;
ALTER TABLE public.pet_care_bookings ADD COLUMN IF NOT EXISTS consult_mode  text;   -- in_clinic | home_visit | video
ALTER TABLE public.pet_care_bookings ADD COLUMN IF NOT EXISTS reason        text;   -- reason for visit
ALTER TABLE public.pet_care_bookings ADD COLUMN IF NOT EXISTS visit_summary text;   -- vet's post-visit notes
ALTER TABLE public.pet_care_bookings ADD COLUMN IF NOT EXISTS prescription  text;   -- vet's prescription
ALTER TABLE public.pet_care_bookings ADD COLUMN IF NOT EXISTS follow_up_at  date;   -- recommended next visit

-- ── Clinic team members (vets on staff) ──────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.provider_team_members (
  id          uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  provider_id uuid NOT NULL REFERENCES public.service_providers(id) ON DELETE CASCADE,
  added_by    uuid NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  name        text NOT NULL,
  role        text,                         -- specialty / title, e.g. "Surgeon", "General Vet"
  license_no  text,
  photo_url   text,
  is_deleted  boolean NOT NULL DEFAULT false,
  created_at  timestamptz NOT NULL DEFAULT now(),
  updated_at  timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS provider_team_provider_idx ON public.provider_team_members (provider_id) WHERE is_deleted = false;

ALTER TABLE public.provider_team_members ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS provider_team_select ON public.provider_team_members;
CREATE POLICY provider_team_select ON public.provider_team_members FOR SELECT USING (is_deleted = false);
DROP POLICY IF EXISTS provider_team_insert ON public.provider_team_members;
CREATE POLICY provider_team_insert ON public.provider_team_members FOR INSERT WITH CHECK (added_by = auth.uid());
DROP POLICY IF EXISTS provider_team_update ON public.provider_team_members;
CREATE POLICY provider_team_update ON public.provider_team_members FOR UPDATE USING (added_by = auth.uid());
DROP POLICY IF EXISTS provider_team_delete ON public.provider_team_members;
CREATE POLICY provider_team_delete ON public.provider_team_members FOR DELETE USING (added_by = auth.uid());
