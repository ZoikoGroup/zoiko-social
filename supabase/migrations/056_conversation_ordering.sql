-- ── Inbox ordering ───────────────────────────────────────────────────────────
-- The conversation list paginated by conversation_members.joined_at while
-- claiming to be ordered by recency, so the sort was only ever correct *within*
-- a page: a thread you joined two years ago that got a message a minute ago sat
-- several pages down, and freshly-joined silent threads sat at the top.
--
-- Ordering by last_message_at fixes it, which needs the column to always have a
-- value (a NULL sorts unpredictably and cannot be used as a keyset cursor).
-- Conversations with no messages get their creation time — which is exactly
-- where they belong in a recency order.
--
-- Idempotent.

UPDATE public.conversations
   SET last_message_at = created_at
 WHERE last_message_at IS NULL;

ALTER TABLE public.conversations ALTER COLUMN last_message_at SET DEFAULT now();
ALTER TABLE public.conversations ALTER COLUMN last_message_at SET NOT NULL;

-- Keyset pagination reads (last_message_at DESC, id DESC); the single-column
-- index this replaces could not serve the tiebreak.
CREATE INDEX IF NOT EXISTS conversations_last_message_id_idx
  ON public.conversations (last_message_at DESC, id DESC);
