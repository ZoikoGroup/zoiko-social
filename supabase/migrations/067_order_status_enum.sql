-- ─────────────────────────────────────────────────────────────────────────────
-- 067 — orders.status becomes an enum
--
-- ZSOC-COM-REV-001 §31 (Canonical State Machines & Commercial Event Rules).
--
-- `status` has been a free-text column since migration 025, with the permitted
-- values recorded only in a trailing comment. A typo, a stale client or a
-- half-finished feature could write anything into it, and the first sign would
-- be an order that no query matches and no screen renders.
--
-- The value set here is the one this codebase already uses, NOT §31's canonical
-- vocabulary (DRAFT / AWAITING_PAYMENT / CONFIRMED / IN_PROGRESS / FULFILLED /
-- CANCELED / DISPUTED / REFUNDED). Renaming would touch the buyer and seller
-- order screens and every status comparison in the API for no behavioural gain,
-- and it would have to happen in the same breath as the marketplace merchant
-- decision that reshapes these records anyway. Constraining the column is worth
-- doing now; renaming is worth doing once, later, deliberately.
--
-- Note the British spelling `cancelled` — it is what migration 025 wrote and
-- what the data holds. §31 spells it `CANCELED`. Reconciling that is part of
-- the same later rename, not a silent change here.
--
-- The conversion refuses to run against unexpected data rather than coercing
-- it. §32: reconciliation never "repairs" money by discarding what it cannot
-- explain — a row holding an unrecognised status is a fact somebody needs to
-- see, not one this migration should quietly overwrite.
-- ─────────────────────────────────────────────────────────────────────────────

DO $$
DECLARE
  unexpected text;
BEGIN
  SELECT string_agg(DISTINCT status, ', ')
    INTO unexpected
    FROM public.orders
   WHERE status NOT IN ('pending', 'paid', 'fulfilled', 'cancelled', 'refunded', 'disputed');

  IF unexpected IS NOT NULL THEN
    RAISE EXCEPTION
      'orders.status holds unrecognised values (%). Resolve them deliberately before converting to an enum — see ZSOC-COM-REV-001 section 32.',
      unexpected;
  END IF;
END $$;

DO $$ BEGIN
  CREATE TYPE public.order_status AS ENUM (
    'pending',    -- checkout session created, not yet paid
    'paid',       -- payment captured; also where a partial refund leaves it
    'fulfilled',  -- seller marked the order delivered
    'cancelled',  -- checkout expired or was abandoned
    'refunded',   -- fully refunded, or a dispute lost
    'disputed'    -- buyer raised a dispute; awaiting the issuer's decision
  );
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

ALTER TABLE public.orders ALTER COLUMN status DROP DEFAULT;

ALTER TABLE public.orders
  ALTER COLUMN status TYPE public.order_status
  USING status::public.order_status;

ALTER TABLE public.orders ALTER COLUMN status SET DEFAULT 'pending';

-- Supersedes the comment added by migration 065: the type now carries the
-- permitted values, so the comment records intent rather than the vocabulary.
COMMENT ON COLUMN public.orders.status IS
  'Operational order state. Legal transitions are enforced in code — see '
  'apps/api/src/modules/payments/order-status.ts (ZSOC-COM-REV-001 section 31).';
