-- 086_profile_name_change_limit.sql
-- Enforces permanent tracking of name changes to prevent scam / identity hopping.

ALTER TABLE public.profiles
ADD COLUMN IF NOT EXISTS name_change_count INT NOT NULL DEFAULT 0;

COMMENT ON COLUMN public.profiles.name_change_count IS
  'Lifetime count of display name changes. Maximum 2 per account, permanently enforced.';
