-- ── Shop orders (Stripe Checkout) ────────────────────────────────────────────
-- One-time purchases of `products` via Stripe Checkout Sessions. Amounts are
-- captured at order-creation time (not re-read from products.price_cents
-- later), so price changes never retroactively affect an in-flight order.

CREATE TABLE IF NOT EXISTS public.orders (
  id                        uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id                uuid NOT NULL REFERENCES public.products(id) ON DELETE RESTRICT,
  buyer_id                  uuid NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  seller_id                 uuid NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  quantity                  int  NOT NULL DEFAULT 1,
  amount_cents              int  NOT NULL,
  currency                  text NOT NULL DEFAULT 'USD',
  status                    text NOT NULL DEFAULT 'pending',  -- pending | paid | fulfilled | cancelled | refunded
  stripe_checkout_session_id text UNIQUE,
  stripe_payment_intent_id  text,
  created_at                timestamptz NOT NULL DEFAULT now(),
  updated_at                timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS orders_buyer_idx ON public.orders (buyer_id, created_at DESC);
CREATE INDEX IF NOT EXISTS orders_seller_idx ON public.orders (seller_id, created_at DESC);
CREATE INDEX IF NOT EXISTS orders_status_idx ON public.orders (status);

ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;

-- No public SELECT policy: orders are only readable via the API's service
-- role (buyer/seller order-history endpoints enforce the id check there).
