-- ── Native push: FCM device tokens for the Android app ─────────────────────
-- The Android app (Zoiko Social App, com.zoikosocial.app) renders the site in a
-- WebView, and Android's WebView has no Push API: it can never produce the
-- browser subscription push_subscriptions stores. The app registers a Firebase
-- Cloud Messaging token instead, and PushService.sendToUser sends to both.
--
-- One row per installed app per member. Disposable in the same way as
-- push_subscriptions: FCM answers UNREGISTERED for a token that is gone
-- (uninstall, data cleared), and the sender deletes on that signal. The token is
-- also how a device moves between accounts — sign out, sign in as someone else
-- on the same phone — so it is unique and re-registering updates user_id.
-- ─────────────────────────────────────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS public.push_devices (
  id            uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id       uuid NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  token         text NOT NULL UNIQUE,
  platform      text NOT NULL,
  created_at    timestamptz NOT NULL DEFAULT now(),
  last_seen_at  timestamptz,
  failure_count integer NOT NULL DEFAULT 0,
  CONSTRAINT push_devices_platform_check CHECK (platform IN ('android'))
);

CREATE INDEX IF NOT EXISTS push_devices_user_id_idx
  ON public.push_devices (user_id);

COMMENT ON TABLE public.push_devices IS
  'FCM registration tokens for the native app, one per install per member. Deleted when FCM reports the token UNREGISTERED.';
COMMENT ON COLUMN public.push_devices.token IS
  'FCM registration token. Unique so re-registering a device updates its row (and its owner) instead of adding one.';
COMMENT ON COLUMN public.push_devices.failure_count IS
  'Consecutive non-fatal send failures. Pruned past a threshold so dead tokens stop taxing every send.';

-- Only the API touches this table. RLS with no client policy keeps tokens out of
-- reach of the anon/authenticated roles (defense in depth, as in 085).
ALTER TABLE public.push_devices ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Service role full access on push_devices" ON public.push_devices;
CREATE POLICY "Service role full access on push_devices"
    ON public.push_devices
    FOR ALL
    TO service_role
    USING (true)
    WITH CHECK (true);
