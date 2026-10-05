-- Add missing columns to subscriptions and profiles if they don't already exist

DO $$
BEGIN
  -- Check if table "subscriptions" exists
  IF EXISTS (SELECT FROM pg_tables WHERE schemaname = 'public' AND tablename = 'subscriptions') THEN
    ALTER TABLE public.subscriptions ADD COLUMN IF NOT EXISTS stripe_id TEXT;
    ALTER TABLE public.subscriptions ADD COLUMN IF NOT EXISTS entitlement TEXT;
    ALTER TABLE public.subscriptions ADD COLUMN IF NOT EXISTS current_period_end TIMESTAMP(3);
    ALTER TABLE public.subscriptions ADD COLUMN IF NOT EXISTS cancel_at_period_end BOOLEAN NOT NULL DEFAULT false;
    ALTER TABLE public.subscriptions ALTER COLUMN current_period_start DROP NOT NULL;
  END IF;

  -- Also check if table was created in lower case or uppercase
  IF EXISTS (SELECT FROM pg_tables WHERE schemaname = 'public' AND tablename = 'Subscription') THEN
    ALTER TABLE public."Subscription" ADD COLUMN IF NOT EXISTS stripe_id TEXT;
    ALTER TABLE public."Subscription" ADD COLUMN IF NOT EXISTS entitlement TEXT;
    ALTER TABLE public."Subscription" ADD COLUMN IF NOT EXISTS current_period_end TIMESTAMP(3);
    ALTER TABLE public."Subscription" ADD COLUMN IF NOT EXISTS cancel_at_period_end BOOLEAN NOT NULL DEFAULT false;
    ALTER TABLE public."Subscription" ALTER COLUMN current_period_start DROP NOT NULL;
  END IF;

  IF EXISTS (SELECT FROM pg_tables WHERE schemaname = 'public' AND tablename = 'profiles') THEN
    ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS identity_status TEXT NOT NULL DEFAULT 'unverified';
    ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS organization_status TEXT NOT NULL DEFAULT 'unverified';
    ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS credential_status TEXT NOT NULL DEFAULT 'unverified';
    ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS publisher_status TEXT NOT NULL DEFAULT 'unverified';
  END IF;
END $$;
