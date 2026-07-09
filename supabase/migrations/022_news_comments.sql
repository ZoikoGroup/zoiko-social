-- ── News Comments ───────────────────────────────────────────────────────────
-- Flat (non-threaded) comments on verified-news articles + a denormalized
-- comments_count on the article. Idempotent.

ALTER TABLE public.news_articles ADD COLUMN IF NOT EXISTS comments_count int NOT NULL DEFAULT 0;

CREATE TABLE IF NOT EXISTS public.news_comments (
  id         uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  article_id uuid NOT NULL REFERENCES public.news_articles(id) ON DELETE CASCADE,
  author_id  uuid NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  body       text NOT NULL,
  is_deleted boolean NOT NULL DEFAULT false,
  created_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS news_comments_article_idx ON public.news_comments (article_id, created_at DESC, id DESC) WHERE is_deleted = false;
CREATE INDEX IF NOT EXISTS news_comments_author_idx ON public.news_comments (author_id);

ALTER TABLE public.news_comments ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS news_comments_select ON public.news_comments;
CREATE POLICY news_comments_select ON public.news_comments FOR SELECT USING (is_deleted = false);
