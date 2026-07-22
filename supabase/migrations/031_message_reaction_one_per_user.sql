-- ── One reaction per user per message (Instagram-style) ──────────────────────
-- Previously the unique key was (message_id, user_id, emoji), which let a single
-- user stack multiple emoji on one message. We now enforce a single reaction per
-- user per message: re-reacting with a different emoji replaces the old one, and
-- re-tapping the same emoji removes it (handled in the service).
--
-- Steps: (1) collapse any pre-existing duplicate rows down to each user's most
-- recent reaction, then (2) swap the unique constraint. Idempotent.

-- 1. Dedupe: keep the newest reaction per (message_id, user_id), drop the rest.
DELETE FROM public.message_reactions mr
USING (
  SELECT id,
         ROW_NUMBER() OVER (
           PARTITION BY message_id, user_id
           ORDER BY created_at DESC, id DESC
         ) AS rn
  FROM public.message_reactions
) dup
WHERE mr.id = dup.id
  AND dup.rn > 1;

-- 2. Replace the (message_id, user_id, emoji) unique key with (message_id, user_id).
ALTER TABLE public.message_reactions
  DROP CONSTRAINT IF EXISTS message_reactions_message_id_user_id_emoji_key;

ALTER TABLE public.message_reactions
  DROP CONSTRAINT IF EXISTS message_reactions_message_id_user_id_key;

ALTER TABLE public.message_reactions
  ADD CONSTRAINT message_reactions_message_id_user_id_key
  UNIQUE (message_id, user_id);
