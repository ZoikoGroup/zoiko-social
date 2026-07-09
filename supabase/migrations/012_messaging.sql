-- ─────────────────────────────────────────────────────────────────────────────
-- ZoikoSocial — Messaging Module Tables
-- ─────────────────────────────────────────────────────────────────────────────

-- ── Enums (native PostgreSQL) ──────────────────────────────────────────────

DO $$ BEGIN
  CREATE TYPE message_request_status AS ENUM ('pending', 'accepted', 'rejected', 'expired');
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
  CREATE TYPE group_type AS ENUM ('private', 'public', 'invite_only');
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
  CREATE TYPE group_role AS ENUM ('owner', 'admin', 'member');
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
  CREATE TYPE group_permission AS ENUM ('send_messages', 'edit_group_info', 'edit_group_image', 'manage_description', 'add_members', 'remove_members', 'promote_admins', 'demote_admins', 'approve_join_requests', 'revoke_invite_links', 'pin_messages', 'delete_messages', 'mention_all', 'share_media', 'share_files', 'share_links');
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
  CREATE TYPE group_setting AS ENUM ('only_admins_can_send', 'everyone_can_send', 'only_admins_edit_group', 'everyone_edit_group', 'join_approval_required', 'invite_links_enabled', 'member_invites_enabled', 'mentions_enabled', 'read_receipts_enabled', 'show_group_history');
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
  CREATE TYPE message_request_expiry AS ENUM ('seven_days', 'fourteen_days', 'thirty_days', 'never');
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
  CREATE TYPE presence_status AS ENUM ('online', 'offline', 'away', 'do_not_disturb');
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
  CREATE TYPE privacy_setting AS ENUM ('everyone', 'my_connections', 'my_followers', 'nobody');
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

-- ── CONVERSATIONS ─────────────────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS conversations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  type TEXT NOT NULL,
  name TEXT,
  avatar_url TEXT,
  created_by UUID REFERENCES profiles(id) ON DELETE SET NULL,
  last_message_at TIMESTAMPTZ,
  is_deleted BOOLEAN NOT NULL DEFAULT false,
  deleted_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_conversations_last_message_at ON conversations(last_message_at);
CREATE INDEX IF NOT EXISTS idx_conversations_type ON conversations(type);

-- ── CONVERSATION MEMBERS ───────────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS conversation_members (
  conversation_id UUID NOT NULL REFERENCES conversations(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  group_role TEXT NOT NULL DEFAULT 'member',
  joined_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  last_read_at TIMESTAMPTZ,
  is_deleted BOOLEAN NOT NULL DEFAULT false,
  deleted_at TIMESTAMPTZ,
  PRIMARY KEY (conversation_id, user_id)
);

CREATE INDEX IF NOT EXISTS idx_cm_user_id ON conversation_members(user_id);
CREATE INDEX IF NOT EXISTS idx_cm_conversation_id ON conversation_members(conversation_id);

-- ── CONVERSATION SETTINGS ──────────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS conversation_settings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  conversation_id UUID NOT NULL REFERENCES conversations(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  is_pinned BOOLEAN NOT NULL DEFAULT false,
  is_muted BOOLEAN NOT NULL DEFAULT false,
  is_archived BOOLEAN NOT NULL DEFAULT false,
  muted_until TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE (conversation_id, user_id)
);

CREATE INDEX IF NOT EXISTS idx_cs_user_id ON conversation_settings(user_id);

-- ── MESSAGES ───────────────────────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  conversation_id UUID NOT NULL REFERENCES conversations(id) ON DELETE CASCADE,
  sender_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  type TEXT NOT NULL DEFAULT 'text',
  body TEXT,
  media_urls TEXT[] NOT NULL DEFAULT '{}',
  parent_id UUID REFERENCES messages(id) ON DELETE SET NULL,
  forwarded_from UUID REFERENCES messages(id) ON DELETE SET NULL,
  is_deleted BOOLEAN NOT NULL DEFAULT false,
  deleted_for_everyone BOOLEAN NOT NULL DEFAULT false,
  edited_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_messages_conversation_created ON messages(conversation_id, created_at);
CREATE INDEX IF NOT EXISTS idx_messages_sender_id ON messages(sender_id);
CREATE INDEX IF NOT EXISTS idx_messages_parent_id ON messages(parent_id);

-- ── MESSAGE ATTACHMENTS ────────────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS message_attachments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  message_id UUID NOT NULL REFERENCES messages(id) ON DELETE CASCADE,
  type TEXT NOT NULL,
  url TEXT NOT NULL,
  thumbnail_url TEXT,
  file_name TEXT,
  file_size INTEGER,
  mime_type TEXT,
  width INTEGER,
  height INTEGER,
  duration INTEGER,
  is_voice_note BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_ma_message_id ON message_attachments(message_id);

-- ── MESSAGE REACTIONS ──────────────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS message_reactions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  message_id UUID NOT NULL REFERENCES messages(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  emoji TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE (message_id, user_id, emoji)
);

CREATE INDEX IF NOT EXISTS idx_mr_message_id ON message_reactions(message_id);

-- ── MESSAGE RECEIPTS ───────────────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS message_receipts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  message_id UUID NOT NULL REFERENCES messages(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  status TEXT NOT NULL,
  read_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE (message_id, user_id)
);

CREATE INDEX IF NOT EXISTS idx_mreceipt_message_id ON message_receipts(message_id);
CREATE INDEX IF NOT EXISTS idx_mreceipt_user_status ON message_receipts(user_id, status);

-- ── MESSAGE REQUESTS ───────────────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS message_requests (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  sender_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  recipient_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  status message_request_status NOT NULL DEFAULT 'pending',
  message TEXT,
  expires_at TIMESTAMPTZ,
  is_spam BOOLEAN NOT NULL DEFAULT false,
  reviewed_by_admin UUID REFERENCES profiles(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE (sender_id, recipient_id)
);

CREATE INDEX IF NOT EXISTS idx_mrq_recipient_status ON message_requests(recipient_id, status);
CREATE INDEX IF NOT EXISTS idx_mrq_sender_id ON message_requests(sender_id);
CREATE INDEX IF NOT EXISTS idx_mrq_expires_at ON message_requests(expires_at);

-- ── GROUPS ─────────────────────────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS groups (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  conversation_id UUID NOT NULL UNIQUE REFERENCES conversations(id) ON DELETE CASCADE,
  type group_type NOT NULL DEFAULT 'private',
  description TEXT,
  cover_image_url TEXT,
  is_announcement BOOLEAN NOT NULL DEFAULT false,
  slow_mode_seconds INTEGER NOT NULL DEFAULT 0,
  max_members INTEGER NOT NULL DEFAULT 256,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ── GROUP MEMBERS ──────────────────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS group_members (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  group_id UUID NOT NULL REFERENCES groups(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  role group_role NOT NULL DEFAULT 'member',
  joined_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  invited_by UUID REFERENCES profiles(id) ON DELETE SET NULL,
  is_approved BOOLEAN NOT NULL DEFAULT true,
  UNIQUE (group_id, user_id)
);

CREATE INDEX IF NOT EXISTS idx_gm_group_id ON group_members(group_id);
CREATE INDEX IF NOT EXISTS idx_gm_user_id ON group_members(user_id);

-- ── GROUP SETTINGS ─────────────────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS group_settings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  group_id UUID NOT NULL REFERENCES groups(id) ON DELETE CASCADE,
  setting group_setting NOT NULL,
  enabled BOOLEAN NOT NULL DEFAULT true,
  UNIQUE (group_id, setting)
);

-- ── GROUP PERMISSIONS ──────────────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS group_permissions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  group_id UUID NOT NULL REFERENCES groups(id) ON DELETE CASCADE,
  role group_role NOT NULL,
  permission group_permission NOT NULL,
  UNIQUE (group_id, role, permission)
);

-- ── GROUP INVITE LINKS ─────────────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS group_invite_links (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  group_id UUID NOT NULL REFERENCES groups(id) ON DELETE CASCADE,
  code TEXT NOT NULL UNIQUE,
  created_by UUID NOT NULL,
  expires_at TIMESTAMPTZ,
  max_uses INTEGER DEFAULT 0,
  use_count INTEGER NOT NULL DEFAULT 0,
  is_revoked BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_gil_code ON group_invite_links(code);
CREATE INDEX IF NOT EXISTS idx_gil_group_id ON group_invite_links(group_id);

-- ── GROUP JOIN REQUESTS ────────────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS group_join_requests (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  group_id UUID NOT NULL REFERENCES groups(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  status TEXT NOT NULL DEFAULT 'pending',
  message TEXT,
  reviewed_by UUID REFERENCES profiles(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE (group_id, user_id)
);

CREATE INDEX IF NOT EXISTS idx_gjr_group_status ON group_join_requests(group_id, status);

-- ── FAVORITE CONTACTS ──────────────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS favorite_contacts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  contact_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  note TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE (user_id, contact_id)
);

CREATE INDEX IF NOT EXISTS idx_fc_user_id ON favorite_contacts(user_id);

-- ── PINNED CHATS ───────────────────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS pinned_chats (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  conversation_id UUID NOT NULL REFERENCES conversations(id) ON DELETE CASCADE,
  pinned_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE (user_id, conversation_id)
);

-- ── USER PRESENCE ──────────────────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS user_presence (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL UNIQUE REFERENCES profiles(id) ON DELETE CASCADE,
  status presence_status NOT NULL DEFAULT 'offline',
  last_seen TIMESTAMPTZ,
  is_typing BOOLEAN NOT NULL DEFAULT false,
  typing_in TEXT,
  is_recording BOOLEAN NOT NULL DEFAULT false,
  recording_in TEXT,
  device TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ── USER PRIVACY SETTINGS ──────────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS user_privacy (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL UNIQUE REFERENCES profiles(id) ON DELETE CASCADE,
  who_can_message privacy_setting NOT NULL DEFAULT 'everyone',
  who_can_send_message_request privacy_setting NOT NULL DEFAULT 'everyone',
  who_can_see_profile_photo privacy_setting NOT NULL DEFAULT 'everyone',
  who_can_see_last_seen privacy_setting NOT NULL DEFAULT 'everyone',
  who_can_see_online_status privacy_setting NOT NULL DEFAULT 'everyone',
  who_can_see_read_receipts privacy_setting NOT NULL DEFAULT 'everyone',
  who_can_add_to_groups privacy_setting NOT NULL DEFAULT 'everyone',
  who_can_mention privacy_setting NOT NULL DEFAULT 'everyone',
  message_request_expiry message_request_expiry NOT NULL DEFAULT 'thirty_days',
  show_read_receipts BOOLEAN NOT NULL DEFAULT true,
  show_typing_indicator BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ── PROFESSIONAL MESSAGING SETTINGS ────────────────────────────────────────

CREATE TABLE IF NOT EXISTS professional_messaging_settings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL UNIQUE REFERENCES profiles(id) ON DELETE CASCADE,
  greeting_enabled BOOLEAN NOT NULL DEFAULT false,
  greeting_message TEXT,
  away_message_enabled BOOLEAN NOT NULL DEFAULT false,
  away_message TEXT,
  away_message_schedule JSONB,
  business_hours_enabled BOOLEAN NOT NULL DEFAULT false,
  business_hours JSONB,
  auto_reply_enabled BOOLEAN NOT NULL DEFAULT false,
  auto_reply_message TEXT,
  quick_replies JSONB NOT NULL DEFAULT '[]',
  service_inquiry_enabled BOOLEAN NOT NULL DEFAULT false,
  product_inquiry_enabled BOOLEAN NOT NULL DEFAULT false,
  appointment_enabled BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ── MESSAGE RATE LIMITS ────────────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS message_rate_limits (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  count INTEGER NOT NULL DEFAULT 0,
  window_start TIMESTAMPTZ NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_mrl_user_window ON message_rate_limits(user_id, window_start);

