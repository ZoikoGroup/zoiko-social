-- ── Professional listing hide-on-revert ─────────────────────────────────────
-- When a pro switches back to a personal account, their category's public
-- listings are hidden (hidden_at set) and restored (hidden_at cleared) when they
-- switch back to professional. Distinct from user-initiated withdraw/delete.
-- Idempotent.

ALTER TABLE public.products          ADD COLUMN IF NOT EXISTS hidden_at timestamptz;
ALTER TABLE public.news_articles     ADD COLUMN IF NOT EXISTS hidden_at timestamptz;
ALTER TABLE public.service_providers ADD COLUMN IF NOT EXISTS hidden_at timestamptz;
