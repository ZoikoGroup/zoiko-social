-- ─────────────────────────────────────────────────────────────────────────────
-- 062 — close the last two tables with no row-level security
--
-- Of 108 tables, 106 had RLS enabled. These two never did, and both were
-- reachable with the anon key — the key that ships in the browser bundle by
-- design. Verified against the live project, not inferred:
--
--   adoption_enquiry_messages
--     SELECT returned 200. INSERT returned 23503 (foreign-key violation),
--     which means the write was ACCEPTED and only failed because the probe's
--     enquiry_id did not exist. A table with RLS active answers 42501 instead.
--     This holds the private one-to-one adoption conversations. Anyone holding
--     the anon key could read every message on the platform and post into any
--     thread, completely bypassing AdoptionService.loadThread — which does
--     check participation correctly, and was never the weak point.
--
--   professional_permissions
--     INSERT succeeded outright and wrote a real row; DELETE removed it again.
--     Full read/write/delete for anonymous callers. It defines what each
--     professional category is allowed to do, so writes here are a privilege
--     question, and deletes are a denial-of-service on professional features.
--
-- The API is unaffected either way: it connects with the service role over
-- Prisma, which bypasses RLS. These policies only constrain direct PostgREST
-- access — which is precisely the path that was open.
-- ─────────────────────────────────────────────────────────────────────────────

-- ── ADOPTION ENQUIRY MESSAGES ───────────────────────────────────────────────
-- Mirrors the API's own rule: a thread belongs to the applicant and to the
-- person who posted the listing, and to nobody else.

ALTER TABLE IF EXISTS public.adoption_enquiry_messages ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS adoption_enq_msg_select_participant ON public.adoption_enquiry_messages;
CREATE POLICY adoption_enq_msg_select_participant
  ON public.adoption_enquiry_messages
  FOR SELECT
  USING (
    EXISTS (
      SELECT 1
      FROM public.adoption_enquiries e
      JOIN public.adoption_posts p ON p.id = e.listing_id
      WHERE e.id = adoption_enquiry_messages.enquiry_id
        AND (e.applicant_id = auth.uid() OR p.poster_id = auth.uid())
    )
  );

-- Sending requires being a participant AND sending as yourself, so a
-- participant cannot forge a message from the other party.
DROP POLICY IF EXISTS adoption_enq_msg_insert_participant ON public.adoption_enquiry_messages;
CREATE POLICY adoption_enq_msg_insert_participant
  ON public.adoption_enquiry_messages
  FOR INSERT
  WITH CHECK (
    sender_id = auth.uid()
    AND EXISTS (
      SELECT 1
      FROM public.adoption_enquiries e
      JOIN public.adoption_posts p ON p.id = e.listing_id
      WHERE e.id = adoption_enquiry_messages.enquiry_id
        AND (e.applicant_id = auth.uid() OR p.poster_id = auth.uid())
    )
  );

-- No UPDATE or DELETE policy on purpose: the product exposes no edit or delete
-- for these messages, and with RLS enabled the absence of a policy denies.
-- Moderation removal runs through the API on the service role.

-- ── PROFESSIONAL PERMISSIONS ────────────────────────────────────────────────
-- A read-only reference table of category → capability. Everyone may read it;
-- nobody may change it from a client. Writes belong to migrations and to the
-- API's service role, both of which bypass RLS.

ALTER TABLE IF EXISTS public.professional_permissions ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS professional_permissions_select_all ON public.professional_permissions;
CREATE POLICY professional_permissions_select_all
  ON public.professional_permissions
  FOR SELECT
  USING (true);

-- Deliberately no INSERT / UPDATE / DELETE policy — see above.
