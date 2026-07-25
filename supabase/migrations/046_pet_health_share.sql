-- ── Health Passport: public shareable vet card ──────────────────────────────
-- An opt-in, revocable read-only token that lets an owner hand a vet a link/QR
-- to the pet's health summary without exposing the account. Idempotent.
-- ─────────────────────────────────────────────────────────────────────────────

ALTER TABLE public.pets ADD COLUMN IF NOT EXISTS health_share_token text;
CREATE UNIQUE INDEX IF NOT EXISTS pets_health_share_token_key ON public.pets (health_share_token) WHERE health_share_token IS NOT NULL;
