-- ── Per-user "Delete for me" ─────────────────────────────────────────────────
-- Adds a set of user ids for whom a message is hidden from view. "Delete for me"
-- appends the caller here (the message stays intact for everyone else); "delete
-- for everyone" still uses is_deleted + deleted_for_everyone. getMessages filters
-- out rows where the requesting user is in deleted_for.
--
-- text[] (not uuid[]) to match Prisma's String[] mapping, same as messages.media_urls.
-- Idempotent.

ALTER TABLE public.messages
  ADD COLUMN IF NOT EXISTS deleted_for text[] NOT NULL DEFAULT '{}';
