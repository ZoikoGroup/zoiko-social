-- ── Web Push: subscriptions and per-channel notification preferences ─────────
-- The settings screen has offered a "Push Notifications" toggle described as
-- "Receive notifications on your device" since before this migration, and
-- push_enabled has been stored and read by nothing. There was no transport and
-- nowhere to keep a browser's subscription, so the control could not work.
--
-- Two tables:
--
--   push_subscriptions        one row per browser per member. Disposable: a push
--                             service answers 404/410 for an endpoint that is
--                             gone, and the sender deletes on that signal.
--
--   notification_preferences  one row per (member, category, channel). The
--                             eleven booleans on user_settings are shared by
--                             in-app and email, so switching a category off to
--                             silence a phone also erased the in-app record.
--                             Push gets its own answer here. Absence means the
--                             default, which is on, so nothing is backfilled.
--
-- Only the push channel is read today. The channel column exists so in-app and
-- email can move here later without a second migration.
-- ─────────────────────────────────────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS public.push_subscriptions (
  id            uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id       uuid NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  endpoint      text NOT NULL UNIQUE,
  p256dh        text NOT NULL,
  auth          text NOT NULL,
  user_agent    text,
  created_at    timestamptz NOT NULL DEFAULT now(),
  last_seen_at  timestamptz,
  failure_count integer NOT NULL DEFAULT 0
);

CREATE INDEX IF NOT EXISTS push_subscriptions_user_id_idx
  ON public.push_subscriptions (user_id);

COMMENT ON TABLE public.push_subscriptions IS
  'Web Push endpoints, one per browser per member. Deleted when the push service reports the endpoint gone (404/410).';
COMMENT ON COLUMN public.push_subscriptions.endpoint IS
  'Push service URL from the browser. Unique so re-subscribing a browser updates its row instead of adding one.';
COMMENT ON COLUMN public.push_subscriptions.p256dh IS
  'Subscription public key. Payloads are encrypted to it, so the push service relays without reading.';
COMMENT ON COLUMN public.push_subscriptions.user_agent IS
  'Shown only so a member can recognise a device in a list of their sessions. Never used for targeting.';
COMMENT ON COLUMN public.push_subscriptions.failure_count IS
  'Consecutive non-fatal send failures. Pruned past a threshold so dead endpoints stop taxing every send.';

CREATE TABLE IF NOT EXISTS public.notification_preferences (
  id             uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id        uuid NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  preference_key text NOT NULL,
  channel        text NOT NULL,
  enabled        boolean NOT NULL,
  updated_at     timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT notification_preferences_channel_check
    CHECK (channel IN ('push', 'in_app', 'email')),
  CONSTRAINT notification_preferences_user_key_channel_key
    UNIQUE (user_id, preference_key, channel)
);

CREATE INDEX IF NOT EXISTS notification_preferences_user_id_channel_idx
  ON public.notification_preferences (user_id, channel);

COMMENT ON TABLE public.notification_preferences IS
  'Per-channel notification preferences. A missing row means the default, which is on, so new categories need no backfill.';
COMMENT ON COLUMN public.notification_preferences.preference_key IS
  'A preference key from the comms registry, e.g. social.reactions. Text, not an enum: the registry decides which keys exist.';
COMMENT ON COLUMN public.notification_preferences.channel IS
  'push, in_app or email. Only push is read today; in-app and email still read user_settings.';
