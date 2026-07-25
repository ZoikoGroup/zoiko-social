-- ── Profile display currency (multi-currency, cross-device) ──────────────────
-- Stores the user's preferred display currency so it follows them across
-- devices. Display-only; base amounts remain in INR. Idempotent.
-- ─────────────────────────────────────────────────────────────────────────────

ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS currency text;
