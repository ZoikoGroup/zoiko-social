-- ── Events — Rich Detail Fields (BookMyShow-style) ──────────────────────────
-- Adds featured video, category, separate venue name, ticket/price info, and
-- capacity to events so the detail page can show a full listing. Idempotent.

ALTER TABLE public.events ADD COLUMN IF NOT EXISTS video_url   text;
ALTER TABLE public.events ADD COLUMN IF NOT EXISTS category    text;      -- adoption_drive | vet_camp | workshop | meetup | fundraiser | competition | awareness | other
ALTER TABLE public.events ADD COLUMN IF NOT EXISTS venue_name  text;      -- e.g. "Cubbon Park Bandstand" (address stays in `location`)
ALTER TABLE public.events ADD COLUMN IF NOT EXISTS is_free     boolean NOT NULL DEFAULT true;
ALTER TABLE public.events ADD COLUMN IF NOT EXISTS price       text;      -- display price, e.g. "₹499" / "₹200 onwards"
ALTER TABLE public.events ADD COLUMN IF NOT EXISTS booking_url text;      -- external ticket/registration link
ALTER TABLE public.events ADD COLUMN IF NOT EXISTS capacity    integer;   -- max attendees (null = unlimited)

CREATE INDEX IF NOT EXISTS events_category_idx ON public.events (category, starts_at);
