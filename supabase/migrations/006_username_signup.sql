-- ─────────────────────────────────────────────────────────────────────────────
-- ZoikoSocial — Username at signup
-- handle_new_user now honors a username chosen during signup, passed via
-- auth metadata (raw_user_meta_data->>'username').
--
-- Instagram-style rules enforced here (defense-in-depth; the API and the
-- signup form validate the same rules up front):
--   · 3–30 chars, lowercase letters, digits, underscore, period
--   · no leading/trailing period, no consecutive periods
--   · not a reserved word
--   · unique (case-insensitive — usernames are stored lowercase)
-- If the requested username is invalid or taken, signup still succeeds with
-- an email-derived username (never block account creation in a trigger).
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
       'about','contact','privacy','terms','security'
     )
     AND NOT EXISTS (SELECT 1 FROM public.profiles WHERE username = requested)
  THEN
    final_username := requested;
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

  INSERT INTO public.profiles (id, username, display_name)
  VALUES (
    NEW.id,
    final_username,
    COALESCE(NEW.raw_user_meta_data->>'full_name', SPLIT_PART(NEW.email, '@', 1))
  )
  ON CONFLICT (id) DO NOTHING;

  RETURN NEW;
END;
$$;
