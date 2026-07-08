-- ── Events + RSVPs ──────────────────────────────────────────────────────────
-- Community events (adoption days, workshops, meetups). Idempotent.

CREATE TABLE IF NOT EXISTS public.events (
  id          uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  host_id     uuid NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  title       text NOT NULL,
  description text,
  location    text,
  is_online   boolean NOT NULL DEFAULT false,
  cover_url   text,
  starts_at   timestamptz NOT NULL,
  ends_at     timestamptz,
  going_count int NOT NULL DEFAULT 0,
  is_deleted  boolean NOT NULL DEFAULT false,
  created_at  timestamptz NOT NULL DEFAULT now(),
  updated_at  timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS events_starts_idx ON public.events (starts_at) WHERE is_deleted = false;
CREATE INDEX IF NOT EXISTS events_host_idx ON public.events (host_id, starts_at);

CREATE TABLE IF NOT EXISTS public.event_rsvps (
  event_id  uuid NOT NULL REFERENCES public.events(id) ON DELETE CASCADE,
  user_id   uuid NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  status    text NOT NULL DEFAULT 'going',    -- going | interested
  created_at timestamptz NOT NULL DEFAULT now(),
  PRIMARY KEY (event_id, user_id)
);
CREATE INDEX IF NOT EXISTS event_rsvps_user_idx ON public.event_rsvps (user_id);

ALTER TABLE public.events ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.event_rsvps ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS events_select ON public.events;
CREATE POLICY events_select ON public.events FOR SELECT USING (is_deleted = false);

DROP POLICY IF EXISTS event_rsvps_select ON public.event_rsvps;
CREATE POLICY event_rsvps_select ON public.event_rsvps FOR SELECT USING (true);
