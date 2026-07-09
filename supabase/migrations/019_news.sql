-- ── Verified News ───────────────────────────────────────────────────────────
-- Curated, fact-checked animal & conservation news. Articles carry a trust tier
-- derived from the author's verification. Likes + saves are per-user. Idempotent.

CREATE TABLE IF NOT EXISTS public.news_articles (
  id            uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  author_id     uuid NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  title         text NOT NULL,
  excerpt       text NOT NULL,
  body          text NOT NULL,
  cover_url     text,
  category      text NOT NULL DEFAULT 'community',   -- policy | science | rescue | health | climate | community
  tier          text NOT NULL DEFAULT 'community',   -- institutional | verified | community
  source_name   text,
  source_url    text,
  read_minutes  int  NOT NULL DEFAULT 3,
  featured      boolean NOT NULL DEFAULT false,
  likes_count   int  NOT NULL DEFAULT 0,
  saves_count   int  NOT NULL DEFAULT 0,
  status        text NOT NULL DEFAULT 'published',   -- published | draft
  is_deleted    boolean NOT NULL DEFAULT false,
  published_at  timestamptz NOT NULL DEFAULT now(),
  created_at    timestamptz NOT NULL DEFAULT now(),
  updated_at    timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS news_articles_published_idx ON public.news_articles (published_at DESC, id DESC) WHERE is_deleted = false AND status = 'published';
CREATE INDEX IF NOT EXISTS news_articles_category_idx ON public.news_articles (category, published_at DESC);
CREATE INDEX IF NOT EXISTS news_articles_author_idx ON public.news_articles (author_id, published_at DESC);

CREATE TABLE IF NOT EXISTS public.news_likes (
  article_id uuid NOT NULL REFERENCES public.news_articles(id) ON DELETE CASCADE,
  user_id    uuid NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  created_at timestamptz NOT NULL DEFAULT now(),
  PRIMARY KEY (article_id, user_id)
);
CREATE INDEX IF NOT EXISTS news_likes_user_idx ON public.news_likes (user_id);

CREATE TABLE IF NOT EXISTS public.news_saves (
  article_id uuid NOT NULL REFERENCES public.news_articles(id) ON DELETE CASCADE,
  user_id    uuid NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  created_at timestamptz NOT NULL DEFAULT now(),
  PRIMARY KEY (article_id, user_id)
);
CREATE INDEX IF NOT EXISTS news_saves_user_idx ON public.news_saves (user_id);

ALTER TABLE public.news_articles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.news_likes    ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.news_saves    ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS news_articles_select ON public.news_articles;
CREATE POLICY news_articles_select ON public.news_articles FOR SELECT USING (is_deleted = false AND status = 'published');

DROP POLICY IF EXISTS news_likes_select ON public.news_likes;
CREATE POLICY news_likes_select ON public.news_likes FOR SELECT USING (true);

DROP POLICY IF EXISTS news_saves_select ON public.news_saves;
CREATE POLICY news_saves_select ON public.news_saves FOR SELECT USING (true);
