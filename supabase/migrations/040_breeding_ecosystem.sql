-- ── Breeding Match: ecosystem links, near-me & private chat ──────────────────
-- Links breeding profiles to the owner's pets (Health Passport), adds
-- coordinates for near-me discovery, richer profile fields, and a private
-- request chat (fraud-scanned, like adoption). Idempotent.
-- ─────────────────────────────────────────────────────────────────────────────

-- Pet sex (ecosystem-wide; enables pet-linked breeding auto-fill & matching)
ALTER TABLE public.pets ADD COLUMN IF NOT EXISTS sex text;   -- male | female | unknown

-- Breeding profile: link to a pet + near-me + richer/flexible fields
ALTER TABLE public.breeding_profiles ADD COLUMN IF NOT EXISTS pet_id            uuid REFERENCES public.pets(id) ON DELETE SET NULL;
ALTER TABLE public.breeding_profiles ADD COLUMN IF NOT EXISTS latitude          double precision;
ALTER TABLE public.breeding_profiles ADD COLUMN IF NOT EXISTS longitude         double precision;
ALTER TABLE public.breeding_profiles ADD COLUMN IF NOT EXISTS temperament       text[] NOT NULL DEFAULT '{}';
ALTER TABLE public.breeding_profiles ADD COLUMN IF NOT EXISTS registered        boolean NOT NULL DEFAULT false;
ALTER TABLE public.breeding_profiles ADD COLUMN IF NOT EXISTS willing_to_travel boolean NOT NULL DEFAULT false;

CREATE INDEX IF NOT EXISTS breeding_profiles_match_idx
  ON public.breeding_profiles (species, sex, breed) WHERE is_deleted = false AND status = 'available';

-- Request chat: track last activity + a message thread
ALTER TABLE public.breeding_requests ADD COLUMN IF NOT EXISTS last_message_at timestamptz;

CREATE TABLE IF NOT EXISTS public.breeding_request_messages (
  id          uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  request_id  uuid NOT NULL REFERENCES public.breeding_requests(id) ON DELETE CASCADE,
  sender_id   uuid NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  body        text NOT NULL,
  flagged     boolean NOT NULL DEFAULT false,
  created_at  timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS breeding_request_messages_req_idx ON public.breeding_request_messages (request_id, created_at);

ALTER TABLE public.breeding_request_messages ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS breeding_req_msg_select ON public.breeding_request_messages;
CREATE POLICY breeding_req_msg_select ON public.breeding_request_messages FOR SELECT USING (true);
DROP POLICY IF EXISTS breeding_req_msg_insert ON public.breeding_request_messages;
CREATE POLICY breeding_req_msg_insert ON public.breeding_request_messages FOR INSERT WITH CHECK (sender_id = auth.uid());
