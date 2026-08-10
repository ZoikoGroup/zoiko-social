-- ─────────────────────────────────────────────────────────────────────────────
-- 065 — order payment events (refunds, disputes, chargebacks)
--
-- ZSOC-COM-REV-001 §17 (Refunds, Reversals, Disputes & Chargebacks), §29 FIN-03,
-- §30 (refund / dispute / chargeback object), §31 (immutable fact events).
--
-- Before this migration, `orders.status` documented a `refunded` value that
-- nothing could ever set: the Stripe webhook consumed only
-- checkout.session.completed and checkout.session.expired. A refund issued from
-- the Stripe dashboard — the likeliest real-world path — left the order reading
-- `paid` forever, with stock still decremented and the seller still notified of
-- a sale. See docs/shop-commercial-compliance-gap.md, finding 3.
--
-- Shape follows §31: a reversal is a NEW linked fact event, never a destructive
-- edit of the original charge. `orders.amount_cents` is the amount authorized
-- and stays untouched forever; what actually came back is reconstructed by
-- replaying this table. §32: "No reconciliation routine may 'repair' money by
-- deleting unmatched records."
--
-- order_id is NULLABLE on purpose. §16 L5 requires unmatched settlement to
-- enter a reconciliation exception state rather than be guessed at or dropped —
-- so a refund whose payment_intent matches no order is still recorded, with a
-- null order_id, for someone to resolve. A NOT NULL column here would force the
-- handler to discard the evidence.
--
-- ON DELETE RESTRICT, not CASCADE: financial evidence must outlive the
-- convenience of deleting a row (§17 M3, "never overwrite payout history").
--
-- Dedupe is on stripe_event_id. §23 S1 requires idempotency wherever a retry
-- could duplicate money or a receipt, and §31 warns that provider webhook
-- ordering may be non-sequential. Stripe reuses the event ID across retries of
-- the same event, so the unique index is the idempotency claim: the handler
-- inserts here FIRST and treats a duplicate-key violation as "already
-- processed", which makes the whole handler replay-safe.
--
-- RLS on with no policy, matching `orders`: nothing here is client-readable.
-- The API reaches it as the table owner.
--
-- NOT in scope, deliberately: notifying the seller that a sale was reversed.
-- Commercial communications are governed separately (§24 T, and §29 COMMS-01
-- requires an approved sender boundary per domain); there is no approved
-- marketplace commercial sender yet. Tracked as follow-up.
-- ─────────────────────────────────────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS public.order_payment_events (
  id                uuid PRIMARY KEY DEFAULT gen_random_uuid(),

  -- Nullable: an event we cannot link is a reconciliation exception, not a
  -- record to throw away (§16 L5).
  order_id          uuid REFERENCES public.orders(id) ON DELETE RESTRICT,

  kind              text NOT NULL CHECK (kind IN ('refund', 'dispute_opened', 'dispute_closed')),

  -- Idempotency claim. Stripe retries carry the same event ID.
  stripe_event_id   text NOT NULL UNIQUE,
  -- The charge or dispute the event is about, for provider-side lookup.
  stripe_object_id  text,
  -- Kept even when order_id resolves, so an unmatched row can be reconciled later.
  stripe_payment_intent_id text,

  -- For a refund: the charge's CUMULATIVE amount_refunded at the time of the
  -- event, not the delta — Stripe reports it that way, and storing the
  -- cumulative figure means the latest row is the answer without summing.
  -- For a dispute: the amount under dispute.
  amount_cents      int  NOT NULL DEFAULT 0,
  currency          text NOT NULL,

  -- Whether the charge is now fully refunded (drives the order status change).
  fully_refunded    boolean NOT NULL DEFAULT false,

  reason            text,
  -- Stripe dispute status on close: won | lost | warning_closed | …
  outcome           text,

  -- When the provider says it happened, distinct from when we stored it.
  occurred_at       timestamptz NOT NULL,
  created_at        timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS order_payment_events_order_idx
  ON public.order_payment_events (order_id, occurred_at DESC);

-- Reconciliation queue: the unmatched rows (§16 L5, §32).
CREATE INDEX IF NOT EXISTS order_payment_events_unmatched_idx
  ON public.order_payment_events (occurred_at DESC)
  WHERE order_id IS NULL;

CREATE INDEX IF NOT EXISTS order_payment_events_payment_intent_idx
  ON public.order_payment_events (stripe_payment_intent_id);

-- Refunds and disputes arrive keyed by payment intent, not by checkout session,
-- so the order lookup needs its own index.
CREATE INDEX IF NOT EXISTS orders_payment_intent_idx
  ON public.orders (stripe_payment_intent_id);

ALTER TABLE public.order_payment_events ENABLE ROW LEVEL SECURITY;

-- No public SELECT policy: reversal evidence is service-role only, same as
-- `orders`. Buyer/seller-facing history goes through the API, which enforces
-- the id check there.

-- `disputed` joins the documented order statuses. The column stays text to
-- match the existing table; §31's canonical Order/Booking state machine
-- (DRAFT / AWAITING_PAYMENT / CONFIRMED / IN_PROGRESS / FULFILLED / CANCELED /
-- DISPUTED / REFUNDED) is a larger change tracked separately.
COMMENT ON COLUMN public.orders.status IS
  'pending | paid | fulfilled | cancelled | refunded | disputed';
