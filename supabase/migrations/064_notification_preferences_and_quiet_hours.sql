-- ── Notification preferences: the three missing categories, plus quiet hours ──
--
-- ZS-COMMS-EMAIL-001 §14 names eleven preference categories. Three of them —
-- messages.activity, adoption.activity and account.guidance — had a key in the
-- event registry and no column behind it, so the decision engine fell through to
-- "on" and a member could not switch off DM, adoption-message or welcome
-- notifications on either channel. Same shape as the bug where the settings
-- screen wrote toggles nobody read, arrived at from the other direction.
--
-- Quiet hours (§06) had nowhere to read from at all. It needs a window and a
-- timezone: 22:00 means nothing without knowing whose 22:00.
--
-- Idempotent — ADD COLUMN IF NOT EXISTS throughout, safe to re-run.
-- ─────────────────────────────────────────────────────────────────────────────

-- §14 defaults these to on, matching the fall-through they replace, so no
-- member's effective settings change when this lands.
ALTER TABLE public.user_settings
  ADD COLUMN IF NOT EXISTS notif_messages          boolean NOT NULL DEFAULT true,
  ADD COLUMN IF NOT EXISTS notif_adoption          boolean NOT NULL DEFAULT true,
  ADD COLUMN IF NOT EXISTS notif_account_guidance  boolean NOT NULL DEFAULT true;

-- Quiet hours. Stored as minutes past local midnight rather than `time`, so the
-- comparison is integer arithmetic and a window that wraps midnight
-- (22:00 → 07:00) is a plain start > end rather than a date-boundary problem.
ALTER TABLE public.user_settings
  ADD COLUMN IF NOT EXISTS quiet_hours_enabled boolean  NOT NULL DEFAULT false,
  ADD COLUMN IF NOT EXISTS quiet_hours_start   smallint NOT NULL DEFAULT 1320, -- 22:00
  ADD COLUMN IF NOT EXISTS quiet_hours_end     smallint NOT NULL DEFAULT 420,  -- 07:00
  -- IANA name. Defaulting to UTC is honest about not knowing: a member who
  -- never sets one gets a fixed window rather than a guess at their location.
  ADD COLUMN IF NOT EXISTS timezone            text     NOT NULL DEFAULT 'UTC';

-- A window outside 0..1439 would silently never match, leaving quiet hours
-- switched on and doing nothing. Better to reject the write.
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint WHERE conname = 'user_settings_quiet_hours_range'
  ) THEN
    ALTER TABLE public.user_settings
      ADD CONSTRAINT user_settings_quiet_hours_range
      CHECK (
        quiet_hours_start BETWEEN 0 AND 1439
        AND quiet_hours_end BETWEEN 0 AND 1439
      );
  END IF;
END $$;

-- Guards against '' or 'GMT+5:30'-style input reaching the formatter, where an
-- invalid zone throws at render time rather than at write time.
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint WHERE conname = 'user_settings_timezone_shape'
  ) THEN
    ALTER TABLE public.user_settings
      ADD CONSTRAINT user_settings_timezone_shape
      CHECK (timezone = 'UTC' OR timezone ~ '^[A-Za-z]+/[A-Za-z_+-]+(/[A-Za-z_+-]+)?$');
  END IF;
END $$;
