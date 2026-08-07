-- ─────────────────────────────────────────────────────────────────────────────
-- 063 — communications delivery ledger and suppression list
--
-- ZS-COMMS-EMAIL-001 §07, deliverable 2 of §16.
--
-- Three tables:
--
--   email_deliveries       One row per attempted communication, including the
--                          ones deliberately not sent. §03 requires the absence
--                          of an email to be "a designed and auditable
--                          outcome", so a suppression is a ledger entry with a
--                          reason rather than a missing row. Without this,
--                          "why didn't I get the email" has no answer.
--
--   email_suppressions     Addresses that must never be mailed again. Hard
--                          bounces and complaints are permanent — continuing to
--                          mail an address that already complained is the
--                          quickest way to lose a sending domain's reputation,
--                          and §08 requires the console to refuse to lift them.
--
--   email_provider_events  Webhook dedupe. §07: provider feedback is
--                          "deduplicated on provider event ID after signature
--                          verification". Providers retry, and a retried
--                          complaint processed twice would double-suppress and
--                          corrupt the audit trail.
--
-- The ledger stores a SHA-256 of the address rather than the address itself.
-- §07 models the recipient as an address record rather than raw mail, and a
-- permanent audit log is the last place that should be re-identifiable. The
-- suppression list does store the address, because matching requires it.
--
-- RLS is on with no policy on all three: nothing here is client-readable. The
-- API reaches them as the table owner, which bypasses RLS, exactly as it does
-- for the other 106 tables.
-- ─────────────────────────────────────────────────────────────────────────────

DO $$ BEGIN
  CREATE TYPE public.email_delivery_state AS ENUM (
    'received', 'policy_blocked', 'suppressed', 'held', 'collapsed', 'queued',
    'deferred', 'rendered', 'canceled', 'superseded', 'expired',
    'provider_accepted', 'delivered', 'soft_bounced', 'hard_bounced',
    'complaint', 'failed'
  );
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  CREATE TYPE public.email_suppression_reason AS ENUM (
    'hard_bounce', 'complaint', 'unsubscribed', 'non_member_opt_out', 'manual'
  );
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

-- ── DELIVERY LEDGER ─────────────────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS public.email_deliveries (
  id                  uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  -- hash(event_name, event_version, recipient, source_object_id, qualifier).
  -- Unique so a retried producer cannot mail twice: a second password-reset
  -- request carries a new qualifier, a repeated webhook for one payment does not.
  idempotency_key     text NOT NULL UNIQUE,
  correlation_id      text,
  event_name          text NOT NULL,
  template_id         text NOT NULL,
  template_version    text NOT NULL DEFAULT '1.0.0',
  message_class       text NOT NULL,
  stream              text NOT NULL,
  preference_key      text,
  user_id             uuid REFERENCES public.profiles(id) ON DELETE SET NULL,
  recipient_hash      text NOT NULL,
  state               public.email_delivery_state NOT NULL,
  suppression_reason  text,
  provider            text,
  provider_message_id text,
  subject             text,
  failure_detail      text,
  created_at          timestamptz NOT NULL DEFAULT now(),
  updated_at          timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS email_deliveries_user_idx ON public.email_deliveries (user_id, created_at DESC);
CREATE INDEX IF NOT EXISTS email_deliveries_state_idx ON public.email_deliveries (state);
CREATE INDEX IF NOT EXISTS email_deliveries_provider_msg_idx ON public.email_deliveries (provider_message_id);
CREATE INDEX IF NOT EXISTS email_deliveries_recipient_idx ON public.email_deliveries (recipient_hash);

-- ── SUPPRESSION LIST ────────────────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS public.email_suppressions (
  id         uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  address    text NOT NULL UNIQUE,
  reason     public.email_suppression_reason NOT NULL,
  permanent  boolean NOT NULL DEFAULT true,
  source     text,
  detail     text,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS email_suppressions_reason_idx ON public.email_suppressions (reason);

-- ── PROVIDER WEBHOOK DEDUPE ─────────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS public.email_provider_events (
  id                uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  provider          text NOT NULL,
  provider_event_id text NOT NULL,
  event_type        text NOT NULL,
  received_at       timestamptz NOT NULL DEFAULT now(),
  UNIQUE (provider, provider_event_id)
);

-- ── RLS ─────────────────────────────────────────────────────────────────────
-- Enabled with no policy: with RLS on, the absence of a policy denies. None of
-- this is client-readable, and the API bypasses RLS as table owner.

ALTER TABLE IF EXISTS public.email_deliveries ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.email_suppressions ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.email_provider_events ENABLE ROW LEVEL SECURITY;
