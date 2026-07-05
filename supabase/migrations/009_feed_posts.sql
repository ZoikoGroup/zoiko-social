-- ─────────────────────────────────────────────────────────────────────────────
-- ZoikoSocial — Feed & Posts Module
-- Extends the minimal posts table and adds media, likes, comments,
-- comment_likes, saved_posts, hashtags, post_hashtags, mentions.
-- See docs/feed-posts-architecture.md
-- ─────────────────────────────────────────────────────────────────────────────

-- ── ENUMS ────────────────────────────────────────────────────────────────────

DO $$ BEGIN
  CREATE TYPE public.media_type AS ENUM ('image', 'video');
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

-- ── POSTS: extend the existing table ────────────────────────────────────────

ALTER TABLE public.posts
  ADD COLUMN IF NOT EXISTS saves_count integer NOT NULL DEFAULT 0,
  ADD COLUMN IF NOT EXISTS comments_disabled boolean NOT NULL DEFAULT false,
  ADD COLUMN IF NOT EXISTS deleted_at timestamptz;

-- Feed + profile-grid query: author + recency
CREATE INDEX IF NOT EXISTS posts_author_created_idx
  ON public.posts (author_id, created_at DESC);

-- ── POST MEDIA ───────────────────────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS public.post_media (
  id            uuid              PRIMARY KEY DEFAULT gen_random_uuid(),
  post_id       uuid              NOT NULL REFERENCES public.posts(id) ON DELETE CASCADE,
  position      integer           NOT NULL DEFAULT 0,
  url           text              NOT NULL,
  thumbnail_url text,
  type          public.media_type NOT NULL DEFAULT 'image',
  width         integer,
  height        integer,
  file_size     integer,
  blurhash      text,
  UNIQUE (post_id, position)
);

-- ── LIKES ────────────────────────────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS public.likes (
  user_id    uuid        NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  post_id    uuid        NOT NULL REFERENCES public.posts(id) ON DELETE CASCADE,
  created_at timestamptz NOT NULL DEFAULT now(),
  PRIMARY KEY (user_id, post_id)
);

CREATE INDEX IF NOT EXISTS likes_post_created_idx
  ON public.likes (post_id, created_at DESC);

-- ── COMMENTS ─────────────────────────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS public.comments (
  id            uuid        PRIMARY KEY DEFAULT gen_random_uuid(),
  post_id       uuid        NOT NULL REFERENCES public.posts(id) ON DELETE CASCADE,
  author_id     uuid        NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  parent_id     uuid        REFERENCES public.comments(id) ON DELETE CASCADE,
  body          varchar(1000) NOT NULL,
  likes_count   integer     NOT NULL DEFAULT 0,
  replies_count integer     NOT NULL DEFAULT 0,
  is_pinned     boolean     NOT NULL DEFAULT false,
  is_deleted    boolean     NOT NULL DEFAULT false,
  created_at    timestamptz NOT NULL DEFAULT now(),
  updated_at    timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS comments_thread_idx
  ON public.comments (post_id, is_pinned DESC, created_at DESC);
CREATE INDEX IF NOT EXISTS comments_replies_idx
  ON public.comments (parent_id, created_at);

-- ── COMMENT LIKES ────────────────────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS public.comment_likes (
  user_id    uuid        NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  comment_id uuid        NOT NULL REFERENCES public.comments(id) ON DELETE CASCADE,
  created_at timestamptz NOT NULL DEFAULT now(),
  PRIMARY KEY (user_id, comment_id)
);

-- ── SAVED POSTS ──────────────────────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS public.saved_posts (
  user_id       uuid        NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  post_id       uuid        NOT NULL REFERENCES public.posts(id) ON DELETE CASCADE,
  collection_id uuid,
  created_at    timestamptz NOT NULL DEFAULT now(),
  PRIMARY KEY (user_id, post_id)
);

CREATE INDEX IF NOT EXISTS saved_posts_user_created_idx
  ON public.saved_posts (user_id, created_at DESC);

-- ── HASHTAGS ─────────────────────────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS public.hashtags (
  id          uuid        PRIMARY KEY DEFAULT gen_random_uuid(),
  tag         text        NOT NULL UNIQUE,
  posts_count integer     NOT NULL DEFAULT 0,
  created_at  timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.post_hashtags (
  post_id    uuid NOT NULL REFERENCES public.posts(id) ON DELETE CASCADE,
  hashtag_id uuid NOT NULL REFERENCES public.hashtags(id) ON DELETE CASCADE,
  PRIMARY KEY (post_id, hashtag_id)
);

CREATE INDEX IF NOT EXISTS post_hashtags_hashtag_idx
  ON public.post_hashtags (hashtag_id);

-- ── MENTIONS ─────────────────────────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS public.mentions (
  id                uuid        PRIMARY KEY DEFAULT gen_random_uuid(),
  mentioned_user_id uuid        NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  actor_id          uuid        NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  post_id           uuid        REFERENCES public.posts(id) ON DELETE CASCADE,
  comment_id        uuid        REFERENCES public.comments(id) ON DELETE CASCADE,
  created_at        timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS mentions_user_created_idx
  ON public.mentions (mentioned_user_id, created_at DESC);

-- ── RLS ──────────────────────────────────────────────────────────────────────
-- API uses the service role; RLS is defense-in-depth for direct client access.

ALTER TABLE public.post_media    ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.likes         ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.comments      ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.comment_likes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.saved_posts   ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.hashtags      ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.post_hashtags ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.mentions      ENABLE ROW LEVEL SECURITY;

-- Media follows its post's visibility (posts_select policy governs posts)
CREATE POLICY "post_media_select" ON public.post_media FOR SELECT USING (
  EXISTS (SELECT 1 FROM public.posts p WHERE p.id = post_media.post_id)
);
CREATE POLICY "post_media_insert_own" ON public.post_media FOR INSERT WITH CHECK (
  EXISTS (SELECT 1 FROM public.posts p WHERE p.id = post_media.post_id AND p.author_id = auth.uid())
);

CREATE POLICY "likes_select"      ON public.likes FOR SELECT USING (true);
CREATE POLICY "likes_insert_own"  ON public.likes FOR INSERT WITH CHECK (user_id = auth.uid());
CREATE POLICY "likes_delete_own"  ON public.likes FOR DELETE USING (user_id = auth.uid());

CREATE POLICY "comments_select"     ON public.comments FOR SELECT USING (is_deleted = false OR author_id = auth.uid());
CREATE POLICY "comments_insert_own" ON public.comments FOR INSERT WITH CHECK (author_id = auth.uid());
CREATE POLICY "comments_update_own" ON public.comments FOR UPDATE USING (author_id = auth.uid());

CREATE POLICY "comment_likes_select"     ON public.comment_likes FOR SELECT USING (true);
CREATE POLICY "comment_likes_insert_own" ON public.comment_likes FOR INSERT WITH CHECK (user_id = auth.uid());
CREATE POLICY "comment_likes_delete_own" ON public.comment_likes FOR DELETE USING (user_id = auth.uid());

-- Saves are strictly private
CREATE POLICY "saved_posts_select_own" ON public.saved_posts FOR SELECT USING (user_id = auth.uid());
CREATE POLICY "saved_posts_insert_own" ON public.saved_posts FOR INSERT WITH CHECK (user_id = auth.uid());
CREATE POLICY "saved_posts_delete_own" ON public.saved_posts FOR DELETE USING (user_id = auth.uid());

CREATE POLICY "hashtags_select"      ON public.hashtags      FOR SELECT USING (true);
CREATE POLICY "post_hashtags_select" ON public.post_hashtags FOR SELECT USING (true);

CREATE POLICY "mentions_select_own" ON public.mentions FOR SELECT USING (
  mentioned_user_id = auth.uid() OR actor_id = auth.uid()
);
