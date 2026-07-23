-- ── Pet Care Services + Bookings + Availability + Reviews ─────────────────────
-- Extends the existing service_providers table with booking-related tables.
-- Idempotent — safe to re-run.
-- ─────────────────────────────────────────────────────────────────────────────

-- ── PET CARE SERVICES: individual services offered by a provider ─────────────

CREATE TABLE IF NOT EXISTS public.pet_care_services (
  id              uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  provider_id     uuid NOT NULL REFERENCES public.service_providers(id) ON DELETE CASCADE,
  created_by      uuid NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  name            text NOT NULL,
  description     text,
  price_cents     int NOT NULL,
  duration_minutes int,
  category        text NOT NULL DEFAULT 'other',   -- grooming | boarding | walking | training | sitting | daycare | vet_escort | other
  is_active       boolean NOT NULL DEFAULT true,
  is_deleted      boolean NOT NULL DEFAULT false,
  created_at      timestamptz NOT NULL DEFAULT now(),
  updated_at      timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS pet_care_services_provider_idx ON public.pet_care_services (provider_id, is_active) WHERE is_deleted = false;
CREATE INDEX IF NOT EXISTS pet_care_services_category_idx ON public.pet_care_services (category) WHERE is_deleted = false;

ALTER TABLE public.pet_care_services ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS pet_care_services_select ON public.pet_care_services;
CREATE POLICY pet_care_services_select ON public.pet_care_services FOR SELECT USING (is_deleted = false AND is_active = true);
DROP POLICY IF EXISTS pet_care_services_insert ON public.pet_care_services;
CREATE POLICY pet_care_services_insert ON public.pet_care_services FOR INSERT WITH CHECK (created_by = auth.uid());
DROP POLICY IF EXISTS pet_care_services_update ON public.pet_care_services;
CREATE POLICY pet_care_services_update ON public.pet_care_services FOR UPDATE USING (created_by = auth.uid());
DROP POLICY IF EXISTS pet_care_services_delete ON public.pet_care_services;
CREATE POLICY pet_care_services_delete ON public.pet_care_services FOR DELETE USING (created_by = auth.uid());


-- ── PET CARE BOOKINGS: full booking system ───────────────────────────────────

CREATE TABLE IF NOT EXISTS public.pet_care_bookings (
  id              uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  service_id      uuid NOT NULL REFERENCES public.pet_care_services(id) ON DELETE CASCADE,
  provider_id     uuid NOT NULL REFERENCES public.service_providers(id) ON DELETE CASCADE,
  seeker_id       uuid NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  scheduled_at    timestamptz NOT NULL,
  end_at          timestamptz,
  location        text,
  latitude        double precision,
  longitude       double precision,
  pet_name        text,
  pet_species     text,
  pet_breed       text,
  pet_weight_kg   double precision,
  notes           text,
  price_cents     int NOT NULL,
  payment_method  text NOT NULL DEFAULT 'pay_at_visit',  -- pay_at_visit | pay_now
  payment_status  text NOT NULL DEFAULT 'unpaid',        -- unpaid | paid | refund_pending | refunded
  status          text NOT NULL DEFAULT 'pending',       -- pending | confirmed | in_progress | completed | cancelled | no_show
  cancelled_by    text,                                  -- seeker | provider | system
  cancel_reason   text,
  is_deleted      boolean NOT NULL DEFAULT false,
  created_at      timestamptz NOT NULL DEFAULT now(),
  updated_at      timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS pet_care_bookings_seeker_idx ON public.pet_care_bookings (seeker_id, created_at DESC) WHERE is_deleted = false;
CREATE INDEX IF NOT EXISTS pet_care_bookings_provider_idx ON public.pet_care_bookings (provider_id, created_at DESC) WHERE is_deleted = false;
CREATE INDEX IF NOT EXISTS pet_care_bookings_status_idx ON public.pet_care_bookings (provider_id, status) WHERE is_deleted = false;
CREATE INDEX IF NOT EXISTS pet_care_bookings_scheduled_idx ON public.pet_care_bookings (scheduled_at) WHERE is_deleted = false;

ALTER TABLE public.pet_care_bookings ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS pet_care_bookings_select ON public.pet_care_bookings;
CREATE POLICY pet_care_bookings_select ON public.pet_care_bookings FOR SELECT USING (seeker_id = auth.uid() OR provider_id IN (SELECT id FROM public.service_providers WHERE added_by = auth.uid()));
DROP POLICY IF EXISTS pet_care_bookings_insert ON public.pet_care_bookings;
CREATE POLICY pet_care_bookings_insert ON public.pet_care_bookings FOR INSERT WITH CHECK (seeker_id = auth.uid());
DROP POLICY IF EXISTS pet_care_bookings_update ON public.pet_care_bookings;
CREATE POLICY pet_care_bookings_update ON public.pet_care_bookings FOR UPDATE USING (seeker_id = auth.uid() OR provider_id IN (SELECT id FROM public.service_providers WHERE added_by = auth.uid()));
DROP POLICY IF EXISTS pet_care_bookings_delete ON public.pet_care_bookings;
CREATE POLICY pet_care_bookings_delete ON public.pet_care_bookings FOR DELETE USING (seeker_id = auth.uid());


-- ── PROVIDER AVAILABILITY: weekly slots + date-specific overrides ─────────────

CREATE TABLE IF NOT EXISTS public.provider_availability (
  id            uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  provider_id   uuid NOT NULL REFERENCES public.service_providers(id) ON DELETE CASCADE,
  added_by      uuid NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  day_of_week   int,                              -- 0=Sunday … 6=Saturday (null for date overrides)
  date          date,                             -- for date-specific overrides / unavailable days
  start_time    text NOT NULL,                    -- HH:mm (24h)
  end_time      text NOT NULL,                    -- HH:mm (24h)
  kind          text NOT NULL DEFAULT 'weekly',   -- weekly | override | unavailable
  is_deleted    boolean NOT NULL DEFAULT false,
  created_at    timestamptz NOT NULL DEFAULT now(),
  updated_at    timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS provider_availability_provider_idx ON public.provider_availability (provider_id, kind) WHERE is_deleted = false;

ALTER TABLE public.provider_availability ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS provider_availability_select ON public.provider_availability;
CREATE POLICY provider_availability_select ON public.provider_availability FOR SELECT USING (true);
DROP POLICY IF EXISTS provider_availability_insert ON public.provider_availability;
CREATE POLICY provider_availability_insert ON public.provider_availability FOR INSERT WITH CHECK (added_by = auth.uid());
DROP POLICY IF EXISTS provider_availability_update ON public.provider_availability;
CREATE POLICY provider_availability_update ON public.provider_availability FOR UPDATE USING (added_by = auth.uid());
DROP POLICY IF EXISTS provider_availability_delete ON public.provider_availability;
CREATE POLICY provider_availability_delete ON public.provider_availability FOR DELETE USING (added_by = auth.uid());


-- ── PROVIDER REVIEWS: ratings and reviews ────────────────────────────────────

CREATE TABLE IF NOT EXISTS public.provider_reviews (
  id            uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  provider_id   uuid NOT NULL REFERENCES public.service_providers(id) ON DELETE CASCADE,
  booking_id    uuid NOT NULL REFERENCES public.pet_care_bookings(id) ON DELETE CASCADE UNIQUE,
  author_id     uuid NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  target_id     uuid NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  rating        int NOT NULL CHECK (rating >= 1 AND rating <= 5),
  body          text,
  is_deleted    boolean NOT NULL DEFAULT false,
  created_at    timestamptz NOT NULL DEFAULT now(),
  updated_at    timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS provider_reviews_provider_idx ON public.provider_reviews (provider_id, created_at DESC) WHERE is_deleted = false;

ALTER TABLE public.provider_reviews ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS provider_reviews_select ON public.provider_reviews;
CREATE POLICY provider_reviews_select ON public.provider_reviews FOR SELECT USING (is_deleted = false);
DROP POLICY IF EXISTS provider_reviews_insert ON public.provider_reviews;
CREATE POLICY provider_reviews_insert ON public.provider_reviews FOR INSERT WITH CHECK (author_id = auth.uid());
DROP POLICY IF EXISTS provider_reviews_update ON public.provider_reviews;
CREATE POLICY provider_reviews_update ON public.provider_reviews FOR UPDATE USING (author_id = auth.uid());
DROP POLICY IF EXISTS provider_reviews_delete ON public.provider_reviews;
CREATE POLICY provider_reviews_delete ON public.provider_reviews FOR DELETE USING (author_id = auth.uid());


-- ── Update service_providers table with new columns ──────────────────────────

ALTER TABLE public.service_providers ADD COLUMN IF NOT EXISTS latitude double precision;
ALTER TABLE public.service_providers ADD COLUMN IF NOT EXISTS longitude double precision;
ALTER TABLE public.service_providers ADD COLUMN IF NOT EXISTS rating double precision NOT NULL DEFAULT 0;
ALTER TABLE public.service_providers ADD COLUMN IF NOT EXISTS review_count int NOT NULL DEFAULT 0;
ALTER TABLE public.service_providers ADD COLUMN IF NOT EXISTS available_for_booking boolean NOT NULL DEFAULT true;
