-- ── Adoption & Rescue → Animal Marketplace ─────────────────────────────────
-- Adds Adopt-vs-Sell listing type, sale price, negotiable flag, and coordinates.
-- Plus a private per-enquiry chat (adoption_enquiry_messages) with a fraud flag,
-- so buyers/adopters and owners talk in-app without sharing phone/personal info.
-- Idempotent.

ALTER TABLE public.adoption_posts     ADD COLUMN IF NOT EXISTS listing_type text NOT NULL DEFAULT 'adopt'; -- adopt | sale
ALTER TABLE public.adoption_posts     ADD COLUMN IF NOT EXISTS price        integer;
ALTER TABLE public.adoption_posts     ADD COLUMN IF NOT EXISTS negotiable   boolean NOT NULL DEFAULT false;
ALTER TABLE public.adoption_posts     ADD COLUMN IF NOT EXISTS latitude     double precision;
ALTER TABLE public.adoption_posts     ADD COLUMN IF NOT EXISTS longitude    double precision;

ALTER TABLE public.adoption_enquiries ADD COLUMN IF NOT EXISTS last_message_at timestamptz;

CREATE TABLE IF NOT EXISTS public.adoption_enquiry_messages (
  id         uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  enquiry_id uuid NOT NULL REFERENCES public.adoption_enquiries(id) ON DELETE CASCADE,
  sender_id  uuid NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  body       text NOT NULL,
  flagged    boolean NOT NULL DEFAULT false,   -- fraud-scan hit (phone / payment / off-platform)
  created_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS adoption_enq_msg_idx ON public.adoption_enquiry_messages (enquiry_id, created_at);

CREATE INDEX IF NOT EXISTS adoption_listing_type_idx ON public.adoption_posts (listing_type, status, created_at DESC);
