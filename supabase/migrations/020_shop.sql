-- ── Marketplace / Shop ──────────────────────────────────────────────────────
-- Peer + professional product listings. Prices stored in minor units (cents).
-- Wishlist saves + buyer→seller enquiries (with notifications). Idempotent.
-- Note: named `products` to avoid the legacy `product_listings` table.

CREATE TABLE IF NOT EXISTS public.products (
  id              uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  seller_id       uuid NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  title           text NOT NULL,
  description     text,
  price_cents     int  NOT NULL DEFAULT 0,
  compare_cents   int,
  currency        text NOT NULL DEFAULT 'USD',
  category        text NOT NULL DEFAULT 'accessories',  -- food|toys|health|grooming|accessories|beds|tech
  condition       text NOT NULL DEFAULT 'new',          -- new | used
  cover_url       text,
  photos          text[] NOT NULL DEFAULT '{}',
  stock           int  NOT NULL DEFAULT 1,
  shipping        text,
  location        text,
  status          text NOT NULL DEFAULT 'active',       -- active | sold | withdrawn
  saves_count     int  NOT NULL DEFAULT 0,
  enquiries_count int  NOT NULL DEFAULT 0,
  is_deleted      boolean NOT NULL DEFAULT false,
  created_at      timestamptz NOT NULL DEFAULT now(),
  updated_at      timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS products_status_idx ON public.products (status, created_at DESC) WHERE is_deleted = false;
CREATE INDEX IF NOT EXISTS products_category_idx ON public.products (category, created_at DESC);
CREATE INDEX IF NOT EXISTS products_seller_idx ON public.products (seller_id, created_at DESC);

CREATE TABLE IF NOT EXISTS public.product_saves (
  product_id uuid NOT NULL REFERENCES public.products(id) ON DELETE CASCADE,
  user_id    uuid NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  created_at timestamptz NOT NULL DEFAULT now(),
  PRIMARY KEY (product_id, user_id)
);
CREATE INDEX IF NOT EXISTS product_saves_user_idx ON public.product_saves (user_id);

CREATE TABLE IF NOT EXISTS public.product_enquiries (
  id         uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id uuid NOT NULL REFERENCES public.products(id) ON DELETE CASCADE,
  buyer_id   uuid NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  message    text,
  status     text NOT NULL DEFAULT 'pending',   -- pending | replied | closed
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (product_id, buyer_id)
);
CREATE INDEX IF NOT EXISTS product_enquiries_product_idx ON public.product_enquiries (product_id, created_at DESC);

ALTER TABLE public.products          ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.product_saves     ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.product_enquiries ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS products_select ON public.products;
CREATE POLICY products_select ON public.products FOR SELECT USING (is_deleted = false);

DROP POLICY IF EXISTS product_saves_select ON public.product_saves;
CREATE POLICY product_saves_select ON public.product_saves FOR SELECT USING (true);

DROP POLICY IF EXISTS product_enquiries_select ON public.product_enquiries;
CREATE POLICY product_enquiries_select ON public.product_enquiries FOR SELECT USING (true);
