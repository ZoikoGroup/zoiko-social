ALTER TABLE "Profile" ADD COLUMN "identity_status" TEXT NOT NULL DEFAULT 'unverified';
ALTER TABLE "Profile" ADD COLUMN "organization_status" TEXT NOT NULL DEFAULT 'unverified';
ALTER TABLE "Profile" ADD COLUMN "credential_status" TEXT NOT NULL DEFAULT 'unverified';
ALTER TABLE "Profile" ADD COLUMN "publisher_status" TEXT NOT NULL DEFAULT 'unverified';

ALTER TABLE "Subscription" ADD COLUMN "stripe_id" TEXT;
ALTER TABLE "Subscription" ADD COLUMN "entitlement" TEXT;
ALTER TABLE "Subscription" ADD COLUMN "current_period_end" TIMESTAMP(3);
ALTER TABLE "Subscription" ADD COLUMN "cancel_at_period_end" BOOLEAN NOT NULL DEFAULT false;
