-- ── Events — Invite-only access (share & invite) ─────────────────────────────
-- `invite_only` events are visible ONLY to the host and people explicitly
-- invited. Invited users can RSVP (join); everyone else gets EVENT_NOT_INVITED.
-- Idempotent.

ALTER TABLE public.events ADD COLUMN IF NOT EXISTS invite_only boolean NOT NULL DEFAULT false;

CREATE TABLE IF NOT EXISTS public.event_invites (
  event_id   uuid        NOT NULL REFERENCES public.events(id) ON DELETE CASCADE,
  user_id    uuid        NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  status     text        NOT NULL DEFAULT 'invited',   -- invited | declined
  invited_by uuid        NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  created_at timestamptz NOT NULL DEFAULT now(),
  PRIMARY KEY (event_id, user_id)
);

CREATE INDEX IF NOT EXISTS event_invites_user_idx ON public.event_invites (user_id);
CREATE INDEX IF NOT EXISTS event_invites_event_idx ON public.event_invites (event_id);

ALTER TABLE public.event_invites ENABLE ROW LEVEL SECURITY;

-- Invites: only the event host may add or remove invites. Anyone may read
-- (membership facts are public enough; the API layer enforces the real gate).
-- The host check is a subquery on events, NOT invited_by = auth.uid(), so a
-- user can't self-invite by inserting a row where they are both fields.
DROP POLICY IF EXISTS event_invites_insert ON public.event_invites;
CREATE POLICY event_invites_insert ON public.event_invites
  FOR INSERT WITH CHECK (
    EXISTS (SELECT 1 FROM public.events e WHERE e.id = event_id AND e.host_id = auth.uid())
  );
DROP POLICY IF EXISTS event_invites_select ON public.event_invites;
CREATE POLICY event_invites_select ON public.event_invites
  FOR SELECT USING (true);
DROP POLICY IF EXISTS event_invites_delete ON public.event_invites;
CREATE POLICY event_invites_delete ON public.event_invites
  FOR DELETE USING (
    EXISTS (SELECT 1 FROM public.events e WHERE e.id = event_id AND e.host_id = auth.uid())
  );
