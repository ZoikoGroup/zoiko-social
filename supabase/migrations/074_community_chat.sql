-- ── Community chat ───────────────────────────────────────────────────────────
-- The Messages screen has had a "Communities" tab since before this migration
-- and it could never show anything: only 'dm' and 'group' conversations are
-- ever written, and nothing linked the communities domain to the messaging one.
-- A member of five communities saw "No communities — Join a community".
--
-- The design decision worth recording: chat membership is DERIVED from
-- community_members, never copied into conversation_members. A community can
-- hold thousands of people, and two membership lists would drift the first time
-- someone is banned — they would keep the chat. Deriving means join, leave and
-- ban are already correct, and no rows are written per member.
--
-- What that costs: conversation_members is where read state lives, so community
-- chat needs its own bookmark. Hence chat_last_read_at below rather than a
-- member row per person.
--
-- conversation_settings (pin / mute / archive) is keyed on (conversation, user)
-- independently of conversation_members, so it already works here untouched.
-- ─────────────────────────────────────────────────────────────────────────────

-- One conversation per community, created lazily on first open.
ALTER TABLE public.conversations
  ADD COLUMN IF NOT EXISTS community_id uuid REFERENCES public.communities(id) ON DELETE CASCADE;

-- Partial unique: one chat per community, while leaving every dm/group NULL.
-- A plain UNIQUE would allow only a single NULL on some engines; this is also
-- the index the lookup by community uses.
CREATE UNIQUE INDEX IF NOT EXISTS conversations_community_id_key
  ON public.conversations (community_id)
  WHERE community_id IS NOT NULL;

-- Chat controls, alongside the community's other settings.
--   chat_enabled            an owner can switch the chat off entirely
--   chat_announcement_only  only owner/admin/moderator may post. The single
--                           most important control for a large community: an
--                           open room of thousands is unusable, and every app
--                           that has shipped this learned it the same way.
--   chat_slow_mode_seconds  0 = off. Cheapest effective anti-flood lever there
--                           is, and gentler than muting people one at a time.
ALTER TABLE public.community_settings
  ADD COLUMN IF NOT EXISTS chat_enabled boolean NOT NULL DEFAULT true,
  ADD COLUMN IF NOT EXISTS chat_announcement_only boolean NOT NULL DEFAULT false,
  ADD COLUMN IF NOT EXISTS chat_slow_mode_seconds integer NOT NULL DEFAULT 0;

-- Guard the range rather than trusting callers: a negative delay would read as
-- "off" and a huge one silently locks the room for everyone.
ALTER TABLE public.community_settings
  DROP CONSTRAINT IF EXISTS community_settings_chat_slow_mode_range;
ALTER TABLE public.community_settings
  ADD CONSTRAINT community_settings_chat_slow_mode_range
  CHECK (chat_slow_mode_seconds >= 0 AND chat_slow_mode_seconds <= 3600);

-- Read bookmark, standing in for the conversation_members row this design does
-- not create. NULL means the member has never opened the chat.
ALTER TABLE public.community_members
  ADD COLUMN IF NOT EXISTS chat_last_read_at timestamptz;

-- Pinned message. One per conversation is enforced in the service rather than
-- by a constraint, so replacing a pin stays a single UPDATE.
ALTER TABLE public.messages
  ADD COLUMN IF NOT EXISTS pinned_at timestamptz,
  ADD COLUMN IF NOT EXISTS pinned_by uuid REFERENCES public.profiles(id) ON DELETE SET NULL;

-- Finding the current pin is the only query this needs, and it runs on every
-- chat open. Partial, so it stays small: almost no message is ever pinned.
CREATE INDEX IF NOT EXISTS messages_pinned_idx
  ON public.messages (conversation_id, pinned_at DESC)
  WHERE pinned_at IS NOT NULL;

-- Slow mode asks "when did this person last post here", which is otherwise a
-- scan of the conversation's messages.
CREATE INDEX IF NOT EXISTS messages_conversation_sender_created_idx
  ON public.messages (conversation_id, sender_id, created_at DESC);
