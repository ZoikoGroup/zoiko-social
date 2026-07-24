-- ── Breeding Match: genetic safety, vet-verification, reviews & alerts ───────
-- Adds structured DNA/health results, welfare guards, cycle/availability,
-- media docs, vet verification, a review/reputation system, and saved-search
-- match alerts. Idempotent.
-- ─────────────────────────────────────────────────────────────────────────────

-- Profile: genetic safety + welfare + cycle + media + verification + rating
ALTER TABLE public.breeding_profiles ADD COLUMN IF NOT EXISTS dna_results             jsonb;              -- [{condition, status: clear|carrier|affected}]
ALTER TABLE public.breeding_profiles ADD COLUMN IF NOT EXISTS age_months              int;                -- for age-minimum guard & scoring
ALTER TABLE public.breeding_profiles ADD COLUMN IF NOT EXISTS litters_count           int NOT NULL DEFAULT 0;
ALTER TABLE public.breeding_profiles ADD COLUMN IF NOT EXISTS last_litter_at          date;
ALTER TABLE public.breeding_profiles ADD COLUMN IF NOT EXISTS documents               text[] NOT NULL DEFAULT '{}';  -- pedigree / DNA report URLs
ALTER TABLE public.breeding_profiles ADD COLUMN IF NOT EXISTS heat_status             text;               -- unknown | in_season | due_soon | resting
ALTER TABLE public.breeding_profiles ADD COLUMN IF NOT EXISTS next_heat_at            date;
ALTER TABLE public.breeding_profiles ADD COLUMN IF NOT EXISTS available_now           boolean NOT NULL DEFAULT true;
ALTER TABLE public.breeding_profiles ADD COLUMN IF NOT EXISTS verified_by_provider_id uuid REFERENCES public.service_providers(id) ON DELETE SET NULL;
ALTER TABLE public.breeding_profiles ADD COLUMN IF NOT EXISTS verified_at             timestamptz;
ALTER TABLE public.breeding_profiles ADD COLUMN IF NOT EXISTS rating                  double precision NOT NULL DEFAULT 0;
ALTER TABLE public.breeding_profiles ADD COLUMN IF NOT EXISTS review_count            int NOT NULL DEFAULT 0;

-- Two-way reviews after an accepted match → breeder reputation
CREATE TABLE IF NOT EXISTS public.breeding_reviews (
  id          uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  profile_id  uuid NOT NULL REFERENCES public.breeding_profiles(id) ON DELETE CASCADE,
  request_id  uuid NOT NULL REFERENCES public.breeding_requests(id) ON DELETE CASCADE,
  author_id   uuid NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  target_id   uuid NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  rating      int NOT NULL CHECK (rating >= 1 AND rating <= 5),
  body        text,
  is_deleted  boolean NOT NULL DEFAULT false,
  created_at  timestamptz NOT NULL DEFAULT now(),
  UNIQUE (request_id, author_id)
);
CREATE INDEX IF NOT EXISTS breeding_reviews_profile_idx ON public.breeding_reviews (profile_id, created_at DESC) WHERE is_deleted = false;

ALTER TABLE public.breeding_reviews ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS breeding_reviews_select ON public.breeding_reviews;
CREATE POLICY breeding_reviews_select ON public.breeding_reviews FOR SELECT USING (is_deleted = false);
DROP POLICY IF EXISTS breeding_reviews_insert ON public.breeding_reviews;
CREATE POLICY breeding_reviews_insert ON public.breeding_reviews FOR INSERT WITH CHECK (author_id = auth.uid());

-- Saved-search match alerts
CREATE TABLE IF NOT EXISTS public.breeding_alerts (
  id         uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id    uuid NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  species    text,
  breed      text,
  sex        text,
  near_lat   double precision,
  near_lng   double precision,
  radius_km  int NOT NULL DEFAULT 25,
  created_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS breeding_alerts_user_idx ON public.breeding_alerts (user_id);
CREATE INDEX IF NOT EXISTS breeding_alerts_match_idx ON public.breeding_alerts (species, sex);

ALTER TABLE public.breeding_alerts ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS breeding_alerts_all ON public.breeding_alerts;
CREATE POLICY breeding_alerts_all ON public.breeding_alerts FOR ALL USING (user_id = auth.uid()) WITH CHECK (user_id = auth.uid());
