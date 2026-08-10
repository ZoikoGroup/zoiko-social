-- ─────────────────────────────────────────────────────────────────────────────
-- 066 — commercial classification on every account
--
-- ZSOC-COM-REV-001 §26 V (Internal, Demo, Pilot, Sandbox & Existing Accounts),
-- §1 ("Every internal, demo, test, pilot, partner, professional, organization
-- and production account receives explicit commercial_classification and
-- billing_source before monetization is enabled") and §4 P0 blocker #17.
--
-- Added now, before any billing exists, because §26 V1 is explicit that the
-- ENVIRONMENT does not decide whether an account is billable — the
-- classification does. Production holds free, internal and partner accounts
-- side by side, and they are indistinguishable in the data unless somebody
-- records the difference. Back-filling this across a live user base later is
-- exactly the migration pain §26 V2 warns about, and it only gets worse with
-- every signup.
--
-- Back-fill policy, and why it is not uniform:
--
--   legacy_review   Accounts carrying trust or professional standing that
--                   predates any commercial process — a verification tier
--                   above `none`, or a professional profile. §26 V2 requires
--                   these to be inventoried and reconciled before any paid
--                   conversion, precisely so an existing trust relationship is
--                   never silently converted into a new paid obligation.
--
--   commercial_free Everyone else. This is not a fudge: §26 defines
--                   COMMERCIAL_FREE as a production Free Core user with no
--                   recurring charge who may transact only through
--                   individually enabled domains, and that is an accurate
--                   description of an ordinary ZoikoSocial account today.
--
-- Internal, demo, QA and pilot accounts are NOT auto-classified. They are
-- indistinguishable from ordinary users in the data, and guessing would put a
-- wrong commercial fact on record — the one thing the standard's fail-closed
-- doctrine forbids. They need a human pass; see the query at the foot of this
-- file.
--
-- This migration deliberately does NOT gate anything. Wiring the classification
-- into checkout would block Shop purchases for every existing account the
-- moment it ran. §26 V1's charge-authorization rule (classification +
-- billing_source + approved catalog/contract + transaction eligibility) needs
-- all four parts, and the other three do not exist yet. Recording the fact
-- comes first; enforcing it is a separate, deliberate change.
-- ─────────────────────────────────────────────────────────────────────────────

DO $$ BEGIN
  CREATE TYPE public.commercial_classification AS ENUM (
    'commercial_free',      -- production Free Core user
    'commercial_premium',   -- paid Premium user/account
    'partner_contract',     -- contracted partner/sponsor/organization
    'pilot_non_billable',   -- approved pilot/evaluation
    'internal',             -- Zoiko internal use
    'demo',                 -- sales/product demonstration
    'sandbox',              -- developer/customer sandbox
    'qa_automation',        -- automated test identities
    'legacy_review'         -- existing account awaiting migration/classification
  );
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

-- Default is `commercial_free` for new signups: a new account is a Free Core
-- user until something says otherwise. The classifications that authorize a
-- charge (`commercial_premium`, `partner_contract`) are never reachable by
-- default — they have to be set deliberately, which is the fail-closed posture
-- §26 V1 asks for.
ALTER TABLE public.profiles
  ADD COLUMN IF NOT EXISTS commercial_classification public.commercial_classification
  NOT NULL DEFAULT 'commercial_free';

-- Accounts with pre-existing trust or professional standing need a human pass
-- before they can be converted to anything paid (§26 V2).
UPDATE public.profiles p
   SET commercial_classification = 'legacy_review'
 WHERE p.verification_tier <> 'none'
    OR EXISTS (
         SELECT 1 FROM public.professional_profiles pp
          WHERE pp.user_id = p.id AND pp.deleted_at IS NULL
       );

-- Partial index over the accounts that still need a classification decision.
-- §32 models exceptions as first-class records with an owner rather than a
-- report someone has to remember to run.
CREATE INDEX IF NOT EXISTS profiles_commercial_classification_review_idx
  ON public.profiles (created_at DESC)
  WHERE commercial_classification = 'legacy_review';

COMMENT ON COLUMN public.profiles.commercial_classification IS
  'ZSOC-COM-REV-001 §26. Charge authorization requires this PLUS billing_source, '
  'an approved catalog/contract entry and transaction eligibility — never this alone.';

-- ── Follow-up for whoever owns commercial ops ────────────────────────────────
-- Accounts needing a manual classification decision:
--
--   SELECT id, username, display_name, role, verification_tier, created_at
--     FROM public.profiles
--    WHERE commercial_classification = 'legacy_review'
--    ORDER BY created_at;
--
-- Staff, demo and automation identities are not detectable here. `role` in
-- ('admin','super_admin','moderator') is a starting hint, not an answer: a
-- staff member may also be a genuine paying user, and classifying them
-- `internal` would wrongly bar them from ever being charged.
-- ─────────────────────────────────────────────────────────────────────────────
