-- ── Onboarding: real names, and a marker for "we have actually asked" ────────
-- OAuth hands us one combined name. Supabase joins Facebook's first_name and
-- last_name before we ever see them, and drops Google's given_name/family_name
-- outright, so splitting on the last space is the best seed available. A wrong
-- guess costs the user one edit on the onboarding page rather than a bad name
-- living on their profile forever.
--
-- handle_new_user already gives every new row an email-derived username, so
-- "a profile exists" tells us nothing about whether the person has been asked
-- anything. onboarding_completed_at is that answer.
--
-- Email signups arrive with a username in their auth metadata because the
-- signup form collects one; OAuth arrivals never do. That difference is how we
-- tell the two apart without inventing a second source of truth.
--
-- Idempotent.
-- ─────────────────────────────────────────────────────────────────────────────

ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS first_name text;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS last_name  text;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS onboarding_completed_at timestamptz;

-- Split a display name on its LAST space: "Mary Anne Smith" → "Mary Anne" +
-- "Smith". Returns [first, last]. A name with no space yields just a first name
-- — a surname is not something to guess at.
CREATE OR REPLACE FUNCTION public.split_display_name(full_name text)
RETURNS text[]
LANGUAGE sql
IMMUTABLE
AS $$
  WITH n AS (SELECT TRIM(COALESCE(full_name, '')) AS s)
  SELECT CASE
           WHEN n.s = ''                   THEN ARRAY[NULL, NULL]::text[]
           WHEN POSITION(' ' IN n.s) = 0    THEN ARRAY[n.s, NULL]::text[]
           ELSE ARRAY[
             TRIM(SUBSTRING(n.s FROM 1 FOR LENGTH(n.s) - POSITION(' ' IN REVERSE(n.s)))),
             NULLIF(TRIM(SUBSTRING(n.s FROM LENGTH(n.s) - POSITION(' ' IN REVERSE(n.s)) + 2)), '')
           ]::text[]
         END
  FROM n
$$;

-- ── handle_new_user: seed the split name and the avatar, and record whether we
-- still owe this person an onboarding pass. Username logic unchanged from 006,
-- except that 'onboarding' joins the reserved list.
-- ─────────────────────────────────────────────────────────────────────────────
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = public
AS $$
DECLARE
  requested      text;
  base_username  text;
  final_username text;
  counter        integer := 0;
  chose_username boolean := false;
  full_name      text;
  parts          text[];
BEGIN
  requested := LOWER(TRIM(COALESCE(NEW.raw_user_meta_data->>'username', '')));

  IF requested <> ''
     AND requested ~ '^[a-z0-9._]{3,30}$'
     AND requested !~ '^\.'
     AND requested !~ '\.$'
     AND requested !~ '\.\.'
     AND requested NOT IN (
       'admin','administrator','root','support','help','moderator','mod',
       'zoiko','zoikosocial','zoikogroup','official',
       'api','www','mail','app','web','dev','test','staging',
       'login','signup','register','logout','auth','settings','profile',
       'explore','notifications','messages','news','events','shop','adoption',
       'about','contact','privacy','terms','security','onboarding'
     )
     AND NOT EXISTS (SELECT 1 FROM public.profiles WHERE username = requested)
  THEN
    final_username := requested;
    chose_username := true;
  ELSE
    base_username := LOWER(REGEXP_REPLACE(SPLIT_PART(NEW.email, '@', 1), '[^a-z0-9_]', '_', 'g'));
    IF LENGTH(base_username) < 3 THEN
      base_username := base_username || '_user';
    END IF;
    final_username := base_username;

    WHILE EXISTS (SELECT 1 FROM public.profiles WHERE username = final_username) LOOP
      counter := counter + 1;
      final_username := base_username || counter::text;
    END LOOP;
  END IF;

  full_name := TRIM(COALESCE(
    NEW.raw_user_meta_data->>'full_name',
    NEW.raw_user_meta_data->>'name',
    ''
  ));
  parts := public.split_display_name(full_name);

  INSERT INTO public.profiles (
    id, username, display_name, first_name, last_name, avatar_url,
    onboarding_completed_at
  )
  VALUES (
    NEW.id,
    final_username,
    COALESCE(NULLIF(full_name, ''), SPLIT_PART(NEW.email, '@', 1)),
    parts[1],
    parts[2],
    NULLIF(TRIM(COALESCE(NEW.raw_user_meta_data->>'avatar_url', '')), ''),
    -- A username in the metadata means the signup form already collected name
    -- and handle, so there is nothing left to ask. OAuth arrivals get NULL and
    -- are sent to /onboarding on first landing.
    CASE WHEN chose_username THEN NOW() ELSE NULL END
  )
  ON CONFLICT (id) DO NOTHING;

  RETURN NEW;
END;
$$;

-- ── Backfill ────────────────────────────────────────────────────────────────
-- Everyone who already has an account is already using the product. Walling
-- them behind a new form would be a regression, so they count as done.
UPDATE public.profiles
SET first_name = (public.split_display_name(display_name))[1],
    last_name  = (public.split_display_name(display_name))[2]
WHERE first_name IS NULL
  AND last_name IS NULL
  AND COALESCE(TRIM(display_name), '') <> '';

UPDATE public.profiles
SET onboarding_completed_at = created_at
WHERE onboarding_completed_at IS NULL;
