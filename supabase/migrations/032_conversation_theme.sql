-- ── Shared chat themes ───────────────────────────────────────────────────────
-- Instagram-style chat themes: a theme is chosen per conversation and shared by
-- both participants. The value is a theme id (see apps/web/src/lib/chat-themes.ts);
-- NULL means the default theme. Idempotent.

ALTER TABLE public.conversations
  ADD COLUMN IF NOT EXISTS theme text;
