-- ─────────────────────────────────────────────────────────────────────────────
-- ZoikoSocial — Stories Module (Phase 1: schema + enums + RLS)
-- See docs/stories-architecture.md
-- ─────────────────────────────────────────────────────────────────────────────

-- ── ENUMS ────────────────────────────────────────────────────────────────────

DO $$ BEGIN
  CREATE TYPE public.story_type AS ENUM (
    'photo', 'video', 'text',
    'shared_post', 'shared_professional_profile',
    'shared_marketplace_product', 'shared_community_post'
  );
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  CREATE TYPE public.story_status AS ENUM ('processing', 'ready', 'failed');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  CREATE TYPE public.story_privacy AS ENUM ('public', 'followers', 'close_friends', 'professional');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  CREATE TYPE public.story_ref_type AS ENUM ('feed_post', 'profile', 'product', 'community_post');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  CREATE TYPE public.story_media_type AS ENUM ('image', 'video');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  CREATE TYPE public.story_reaction_kind AS ENUM ('emoji', 'quick_reply', 'dm_reply', 'share', 'report');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  CREATE TYPE public.sticker_type AS ENUM (
    'emoji', 'text', 'gif', 'mention', 'hashtag',
    'time', 'date', 'weather', 'poll', 'question', 'countdown'
  );
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  CREATE TYPE public.music_mood AS ENUM (
    'happy', 'calm', 'cinematic', 'emotional', 'travel',
    'nature', 'pets', 'funny', 'inspirational', 'background',
    'corporate', 'ambient'
  );
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  CREATE TYPE public.music_category AS ENUM (
    'happy', 'calm', 'cinematic', 'emotional', 'travel',
    'nature', 'pets', 'funny', 'inspirational', 'background',
    'corporate', 'ambient'
  );
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

-- ── MUSIC TRACKS (ref table — no module dependency) ──────────────────────────

CREATE TABLE IF NOT EXISTS public.music_tracks (
  id                uuid                  PRIMARY KEY DEFAULT gen_random_uuid(),
  title             text                  NOT NULL,
  artist            text                  NOT NULL,
  album             text,
  genre             text                  NOT NULL,
  mood              public.music_mood     NOT NULL,
  category          public.music_category NOT NULL,
  duration_ms       integer               NOT NULL,
  cover_url         text                  NOT NULL,
  preview_url       text                  NOT NULL,
  audio_url         text                  NOT NULL,
  license           text                  NOT NULL,
  attribution       text,
  provider          text                  NOT NULL DEFAULT 'internal',
  provider_track_id text,
  is_active         boolean               NOT NULL DEFAULT true,
  created_at        timestamptz           NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS music_tracks_mood_idx       ON public.music_tracks (mood);
CREATE INDEX IF NOT EXISTS music_tracks_category_idx   ON public.music_tracks (category);
CREATE INDEX IF NOT EXISTS music_tracks_genre_idx      ON public.music_tracks (genre);
CREATE INDEX IF NOT EXISTS music_tracks_search_trgm_idx
  ON public.music_tracks USING gin (title gin_trgm_ops, artist gin_trgm_ops);

-- ── STORIES ──────────────────────────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS public.stories (
  id                uuid                     PRIMARY KEY DEFAULT gen_random_uuid(),
  author_id         uuid                     NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  type              public.story_type        NOT NULL,
  status            public.story_status      NOT NULL DEFAULT 'processing',
  privacy           public.story_privacy     NOT NULL DEFAULT 'followers',
  segment_index     integer                  NOT NULL DEFAULT 0,
  segment_group_id  uuid,
  caption           text,
  background        jsonb,
  ref_type          public.story_ref_type,
  ref_id            uuid,
  duration_ms       integer                  NOT NULL DEFAULT 5000,
  views_count       integer                  NOT NULL DEFAULT 0,
  reactions_count   integer                  NOT NULL DEFAULT 0,
  replies_count     integer                  NOT NULL DEFAULT 0,
  impressions_count integer                  NOT NULL DEFAULT 0,
  allow_replies     boolean                  NOT NULL DEFAULT true,
  allow_reactions   boolean                  NOT NULL DEFAULT true,
  is_archived       boolean                  NOT NULL DEFAULT false,
  is_deleted        boolean                  NOT NULL DEFAULT false,
  published_at      timestamptz,
  expires_at        timestamptz,
  deleted_at        timestamptz,
  created_at        timestamptz              NOT NULL DEFAULT now(),
  updated_at        timestamptz              NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS stories_author_expires_idx
  ON public.stories (author_id, expires_at DESC);
CREATE INDEX IF NOT EXISTS stories_expires_idx
  ON public.stories (expires_at) WHERE expires_at IS NOT NULL;
CREATE INDEX IF NOT EXISTS stories_segment_group_idx
  ON public.stories (segment_group_id, segment_index);

-- ── STORY MEDIA ──────────────────────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS public.story_media (
  id               uuid                  PRIMARY KEY DEFAULT gen_random_uuid(),
  story_id         uuid                  NOT NULL REFERENCES public.stories(id) ON DELETE CASCADE,
  type             public.story_media_type NOT NULL,
  hls_url          text,
  mp4_fallback_url text,
  image_url        text,
  renditions       jsonb,
  thumbnail_url    text,
  preview_url      text,
  blurhash         text,
  width            integer,
  height           integer,
  duration_ms      integer,
  file_size        integer,
  created_at       timestamptz           NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS story_media_story_idx ON public.story_media (story_id);

-- ── STORY VIEWS (composite PK — identity is the pair) ───────────────────────

CREATE TABLE IF NOT EXISTS public.story_views (
  story_id        uuid        NOT NULL REFERENCES public.stories(id) ON DELETE CASCADE,
  viewer_id       uuid        NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  completion_pct  integer     NOT NULL DEFAULT 0,
  reacted         boolean     NOT NULL DEFAULT false,
  replied         boolean     NOT NULL DEFAULT false,
  profile_visited boolean     NOT NULL DEFAULT false,
  viewed_at       timestamptz NOT NULL DEFAULT now(),
  PRIMARY KEY (story_id, viewer_id)
);

CREATE INDEX IF NOT EXISTS story_views_story_viewed_idx
  ON public.story_views (story_id, viewed_at DESC);
CREATE INDEX IF NOT EXISTS story_views_viewer_idx
  ON public.story_views (viewer_id);

-- ── STORY REACTIONS ──────────────────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS public.story_reactions (
  id              uuid                     PRIMARY KEY DEFAULT gen_random_uuid(),
  story_id        uuid                     NOT NULL REFERENCES public.stories(id) ON DELETE CASCADE,
  user_id         uuid                     NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  kind            public.story_reaction_kind NOT NULL,
  emoji           text,
  message         text,
  conversation_id uuid,
  created_at      timestamptz              NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS story_reactions_story_created_idx
  ON public.story_reactions (story_id, created_at DESC);
CREATE INDEX IF NOT EXISTS story_reactions_user_idx
  ON public.story_reactions (user_id);

-- ── STORY MENTIONS ───────────────────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS public.story_mentions (
  id                uuid        PRIMARY KEY DEFAULT gen_random_uuid(),
  story_id          uuid        NOT NULL REFERENCES public.stories(id) ON DELETE CASCADE,
  mentioned_user_id uuid        NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  actor_id          uuid        NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  created_at        timestamptz NOT NULL DEFAULT now(),
  UNIQUE (story_id, mentioned_user_id)
);

CREATE INDEX IF NOT EXISTS story_mentions_mentioned_idx
  ON public.story_mentions (mentioned_user_id, created_at DESC);
CREATE INDEX IF NOT EXISTS story_mentions_story_idx
  ON public.story_mentions (story_id);

-- ── STORY STICKERS ───────────────────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS public.story_stickers (
  id         uuid              PRIMARY KEY DEFAULT gen_random_uuid(),
  story_id   uuid              NOT NULL REFERENCES public.stories(id) ON DELETE CASCADE,
  kind       public.sticker_type NOT NULL,
  payload    jsonb             NOT NULL DEFAULT '{}',
  transform  jsonb             NOT NULL DEFAULT '{}',
  created_at timestamptz       NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS story_stickers_story_idx ON public.story_stickers (story_id);

-- ── STORY MUSIC (0..1 per story) ─────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS public.story_music (
  story_id      uuid        PRIMARY KEY REFERENCES public.stories(id) ON DELETE CASCADE,
  track_id      uuid        NOT NULL REFERENCES public.music_tracks(id) ON DELETE RESTRICT,
  start_ms      integer     NOT NULL DEFAULT 0,
  duration_ms   integer,
  volume        integer     NOT NULL DEFAULT 100,
  fade_in       boolean     NOT NULL DEFAULT false,
  fade_out      boolean     NOT NULL DEFAULT false,
  mute_original boolean     NOT NULL DEFAULT false,
  created_at    timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS story_music_track_idx ON public.story_music (track_id);

-- ── STORY HASHTAGS (reuses existing hashtags table — unified trending) ───────

CREATE TABLE IF NOT EXISTS public.story_hashtags (
  story_id   uuid NOT NULL REFERENCES public.stories(id) ON DELETE CASCADE,
  hashtag_id uuid NOT NULL REFERENCES public.hashtags(id) ON DELETE CASCADE,
  PRIMARY KEY (story_id, hashtag_id)
);

CREATE INDEX IF NOT EXISTS story_hashtags_hashtag_idx ON public.story_hashtags (hashtag_id);

-- ── STORY HIGHLIGHTS ─────────────────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS public.story_highlights (
  id           uuid        PRIMARY KEY DEFAULT gen_random_uuid(),
  owner_id     uuid        NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  title        text        NOT NULL,
  cover_url    text,
  position     integer     NOT NULL DEFAULT 0,
  items_count  integer     NOT NULL DEFAULT 0,
  created_at   timestamptz NOT NULL DEFAULT now(),
  updated_at   timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS story_highlights_owner_position_idx
  ON public.story_highlights (owner_id, position);

-- ── STORY HIGHLIGHT ITEMS ────────────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS public.story_highlight_items (
  id                uuid        PRIMARY KEY DEFAULT gen_random_uuid(),
  highlight_id      uuid        NOT NULL REFERENCES public.story_highlights(id) ON DELETE CASCADE,
  archived_story_id uuid        NOT NULL REFERENCES public.stories(id) ON DELETE CASCADE,
  position          integer     NOT NULL DEFAULT 0,
  added_at          timestamptz NOT NULL DEFAULT now(),
  UNIQUE (highlight_id, archived_story_id)
);

CREATE INDEX IF NOT EXISTS highlight_items_highlight_position_idx
  ON public.story_highlight_items (highlight_id, position);

-- ── STORY ARCHIVE (frozen snapshot at expiry) ────────────────────────────────

CREATE TABLE IF NOT EXISTS public.story_archive (
  story_id    uuid        PRIMARY KEY,
  owner_id    uuid        NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  snapshot    jsonb       NOT NULL DEFAULT '{}',
  archived_at timestamptz NOT NULL DEFAULT now(),
  purge_after timestamptz NOT NULL
);

CREATE INDEX IF NOT EXISTS story_archive_owner_archived_idx
  ON public.story_archive (owner_id, archived_at DESC);
CREATE INDEX IF NOT EXISTS story_archive_purge_idx
  ON public.story_archive (purge_after);

-- ── RLS (defense-in-depth; API uses service role) ────────────────────────────

ALTER TABLE public.music_tracks          ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.stories               ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.story_media           ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.story_views           ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.story_reactions       ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.story_mentions        ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.story_stickers        ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.story_music           ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.story_hashtags        ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.story_highlights      ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.story_highlight_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.story_archive         ENABLE ROW LEVEL SECURITY;

-- Music catalog is public-read (used to populate composer picker)
DROP POLICY IF EXISTS "music_tracks_select" ON public.music_tracks;
CREATE POLICY "music_tracks_select" ON public.music_tracks
  FOR SELECT USING (is_active = true);

-- Stories: authors own their rows; viewers see through the privacy gate
DROP POLICY IF EXISTS "stories_insert" ON public.stories;
CREATE POLICY "stories_insert" ON public.stories
  FOR INSERT WITH CHECK (author_id = auth.uid());
DROP POLICY IF EXISTS "stories_select" ON public.stories;
CREATE POLICY "stories_select" ON public.stories
  FOR SELECT USING (is_deleted = false);
DROP POLICY IF EXISTS "stories_update" ON public.stories;
CREATE POLICY "stories_update" ON public.stories
  FOR UPDATE USING (author_id = auth.uid());
DROP POLICY IF EXISTS "stories_delete" ON public.stories;
CREATE POLICY "stories_delete" ON public.stories
  FOR DELETE USING (author_id = auth.uid());

-- Media: cascaded from stories
DROP POLICY IF EXISTS "story_media_select" ON public.story_media;
CREATE POLICY "story_media_select" ON public.story_media
  FOR SELECT USING (true);

-- Views: insert/update by the viewer
DROP POLICY IF EXISTS "story_views_insert" ON public.story_views;
CREATE POLICY "story_views_insert" ON public.story_views
  FOR INSERT WITH CHECK (viewer_id = auth.uid());
DROP POLICY IF EXISTS "story_views_select" ON public.story_views;
CREATE POLICY "story_views_select" ON public.story_views
  FOR SELECT USING (true);
DROP POLICY IF EXISTS "story_views_update" ON public.story_views;
CREATE POLICY "story_views_update" ON public.story_views
  FOR UPDATE USING (viewer_id = auth.uid());

-- Reactions: insert by the reactor, select for the story
DROP POLICY IF EXISTS "story_reactions_insert" ON public.story_reactions;
CREATE POLICY "story_reactions_insert" ON public.story_reactions
  FOR INSERT WITH CHECK (user_id = auth.uid());
DROP POLICY IF EXISTS "story_reactions_select" ON public.story_reactions;
CREATE POLICY "story_reactions_select" ON public.story_reactions
  FOR SELECT USING (true);

-- Mentions: inserted during publish
DROP POLICY IF EXISTS "story_mentions_select" ON public.story_mentions;
CREATE POLICY "story_mentions_select" ON public.story_mentions
  FOR SELECT USING (true);

-- Stickers: cascaded from stories
DROP POLICY IF EXISTS "story_stickers_select" ON public.story_stickers;
CREATE POLICY "story_stickers_select" ON public.story_stickers
  FOR SELECT USING (true);

-- Music: cascaded
DROP POLICY IF EXISTS "story_music_select" ON public.story_music;
CREATE POLICY "story_music_select" ON public.story_music
  FOR SELECT USING (true);

-- Hashtags join: cascaded
DROP POLICY IF EXISTS "story_hashtags_select" ON public.story_hashtags;
CREATE POLICY "story_hashtags_select" ON public.story_hashtags
  FOR SELECT USING (true);

-- Highlights: owner manages
DROP POLICY IF EXISTS "story_highlights_insert" ON public.story_highlights;
CREATE POLICY "story_highlights_insert" ON public.story_highlights
  FOR INSERT WITH CHECK (owner_id = auth.uid());
DROP POLICY IF EXISTS "story_highlights_select" ON public.story_highlights;
CREATE POLICY "story_highlights_select" ON public.story_highlights
  FOR SELECT USING (true);
DROP POLICY IF EXISTS "story_highlights_update" ON public.story_highlights;
CREATE POLICY "story_highlights_update" ON public.story_highlights
  FOR UPDATE USING (owner_id = auth.uid());
DROP POLICY IF EXISTS "story_highlights_delete" ON public.story_highlights;
CREATE POLICY "story_highlights_delete" ON public.story_highlights
  FOR DELETE USING (owner_id = auth.uid());

-- Highlight items: owner via cascade
DROP POLICY IF EXISTS "story_highlight_items_insert" ON public.story_highlight_items;
CREATE POLICY "story_highlight_items_insert" ON public.story_highlight_items
  FOR INSERT WITH CHECK (EXISTS (
    SELECT 1 FROM public.story_highlights h WHERE h.id = highlight_id AND h.owner_id = auth.uid()
  ));
DROP POLICY IF EXISTS "story_highlight_items_select" ON public.story_highlight_items;
CREATE POLICY "story_highlight_items_select" ON public.story_highlight_items
  FOR SELECT USING (true);
DROP POLICY IF EXISTS "story_highlight_items_delete" ON public.story_highlight_items;
CREATE POLICY "story_highlight_items_delete" ON public.story_highlight_items
  FOR DELETE USING (EXISTS (
    SELECT 1 FROM public.story_highlights h WHERE h.id = highlight_id AND h.owner_id = auth.uid()
  ));

-- Archive: owner-only
DROP POLICY IF EXISTS "story_archive_insert" ON public.story_archive;
CREATE POLICY "story_archive_insert" ON public.story_archive
  FOR INSERT WITH CHECK (owner_id = auth.uid());
DROP POLICY IF EXISTS "story_archive_select" ON public.story_archive;
CREATE POLICY "story_archive_select" ON public.story_archive
  FOR SELECT USING (owner_id = auth.uid());
DROP POLICY IF EXISTS "story_archive_delete" ON public.story_archive;
CREATE POLICY "story_archive_delete" ON public.story_archive
  FOR DELETE USING (owner_id = auth.uid());


-- ── Music catalog seed (idempotent: only seeds an empty table) ──
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM music_tracks LIMIT 1) THEN
    INSERT INTO music_tracks (title, artist, album, genre, mood, category, duration_ms, cover_url, preview_url, audio_url, license, attribution, is_active)
    VALUES
    (
      'Playful Paws',
      'Zoiko Audio',
      'Pet Vibes',
      'Acoustic',
      'happy'::music_mood,
      'pets'::music_category,
      30000,
      'https://cdn.zoikosocial.com/music/covers/playful-paws.jpg',
      'https://cdn.zoikosocial.com/music/playful-paws-preview.mp3',
      'https://cdn.zoikosocial.com/music/playful-paws.mp3',
      'royalty-free',
      'Music by Zoiko Audio',
      true
    ),
    (
      'Whisker Waltz',
      'Zoiko Audio',
      'Pet Vibes',
      'Orchestral',
      'calm'::music_mood,
      'pets'::music_category,
      30000,
      'https://cdn.zoikosocial.com/music/covers/whisker-waltz.jpg',
      'https://cdn.zoikosocial.com/music/whisker-waltz-preview.mp3',
      'https://cdn.zoikosocial.com/music/whisker-waltz.mp3',
      'royalty-free',
      'Music by Zoiko Audio',
      true
    ),
    (
      'Happy Tails',
      'Zoiko Audio',
      'Pet Vibes',
      'Folk',
      'happy'::music_mood,
      'pets'::music_category,
      30000,
      'https://cdn.zoikosocial.com/music/covers/happy-tails.jpg',
      'https://cdn.zoikosocial.com/music/happy-tails-preview.mp3',
      'https://cdn.zoikosocial.com/music/happy-tails.mp3',
      'royalty-free',
      'Music by Zoiko Audio',
      true
    ),
    (
      'Catnap Serenade',
      'Zoiko Audio',
      'Pet Vibes',
      'Ambient',
      'calm'::music_mood,
      'pets'::music_category,
      30000,
      'https://cdn.zoikosocial.com/music/covers/catnap-serenade.jpg',
      'https://cdn.zoikosocial.com/music/catnap-serenade-preview.mp3',
      'https://cdn.zoikosocial.com/music/catnap-serenade.mp3',
      'royalty-free',
      'Music by Zoiko Audio',
      true
    ),
    (
      'Sunshine Stroll',
      'Zoiko Audio',
      'Happy Days',
      'Pop',
      'happy'::music_mood,
      'happy'::music_category,
      30000,
      'https://cdn.zoikosocial.com/music/covers/sunshine-stroll.jpg',
      'https://cdn.zoikosocial.com/music/sunshine-stroll-preview.mp3',
      'https://cdn.zoikosocial.com/music/sunshine-stroll.mp3',
      'royalty-free',
      'Music by Zoiko Audio',
      true
    ),
    (
      'Bubblegum Beat',
      'Zoiko Audio',
      'Happy Days',
      'Electronic',
      'happy'::music_mood,
      'happy'::music_category,
      25000,
      'https://cdn.zoikosocial.com/music/covers/bubblegum-beat.jpg',
      'https://cdn.zoikosocial.com/music/bubblegum-beat-preview.mp3',
      'https://cdn.zoikosocial.com/music/bubblegum-beat.mp3',
      'royalty-free',
      'Music by Zoiko Audio',
      true
    ),
    (
      'Good Morning Glow',
      'Zoiko Audio',
      'Happy Days',
      'Acoustic',
      'happy'::music_mood,
      'happy'::music_category,
      30000,
      'https://cdn.zoikosocial.com/music/covers/good-morning-glow.jpg',
      'https://cdn.zoikosocial.com/music/good-morning-glow-preview.mp3',
      'https://cdn.zoikosocial.com/music/good-morning-glow.mp3',
      'royalty-free',
      'Music by Zoiko Audio',
      true
    ),
    (
      'Gentle Rain',
      'Zoiko Audio',
      'Calm Waters',
      'Ambient',
      'calm'::music_mood,
      'calm'::music_category,
      30000,
      'https://cdn.zoikosocial.com/music/covers/gentle-rain.jpg',
      'https://cdn.zoikosocial.com/music/gentle-rain-preview.mp3',
      'https://cdn.zoikosocial.com/music/gentle-rain.mp3',
      'royalty-free',
      'Music by Zoiko Audio',
      true
    ),
    (
      'Ocean Breath',
      'Zoiko Audio',
      'Calm Waters',
      'Ambient',
      'calm'::music_mood,
      'calm'::music_category,
      30000,
      'https://cdn.zoikosocial.com/music/covers/ocean-breath.jpg',
      'https://cdn.zoikosocial.com/music/ocean-breath-preview.mp3',
      'https://cdn.zoikosocial.com/music/ocean-breath.mp3',
      'royalty-free',
      'Music by Zoiko Audio',
      true
    ),
    (
      'Forest Whispers',
      'Zoiko Audio',
      'Calm Waters',
      'Nature',
      'calm'::music_mood,
      'calm'::music_category,
      30000,
      'https://cdn.zoikosocial.com/music/covers/forest-whispers.jpg',
      'https://cdn.zoikosocial.com/music/forest-whispers-preview.mp3',
      'https://cdn.zoikosocial.com/music/forest-whispers.mp3',
      'royalty-free',
      'Music by Zoiko Audio',
      true
    ),
    (
      'Epic Horizons',
      'Zoiko Audio',
      'Cinematic Collection',
      'Orchestral',
      'cinematic'::music_mood,
      'cinematic'::music_category,
      30000,
      'https://cdn.zoikosocial.com/music/covers/epic-horizons.jpg',
      'https://cdn.zoikosocial.com/music/epic-horizons-preview.mp3',
      'https://cdn.zoikosocial.com/music/epic-horizons.mp3',
      'royalty-free',
      'Music by Zoiko Audio',
      true
    ),
    (
      'Rising Tide',
      'Zoiko Audio',
      'Cinematic Collection',
      'Orchestral',
      'cinematic'::music_mood,
      'cinematic'::music_category,
      30000,
      'https://cdn.zoikosocial.com/music/covers/rising-tide.jpg',
      'https://cdn.zoikosocial.com/music/rising-tide-preview.mp3',
      'https://cdn.zoikosocial.com/music/rising-tide.mp3',
      'royalty-free',
      'Music by Zoiko Audio',
      true
    ),
    (
      'Heartstrings',
      'Zoiko Audio',
      'Cinematic Collection',
      'Piano',
      'emotional'::music_mood,
      'emotional'::music_category,
      30000,
      'https://cdn.zoikosocial.com/music/covers/heartstrings.jpg',
      'https://cdn.zoikosocial.com/music/heartstrings-preview.mp3',
      'https://cdn.zoikosocial.com/music/heartstrings.mp3',
      'royalty-free',
      'Music by Zoiko Audio',
      true
    ),
    (
      'Golden Hour',
      'Zoiko Audio',
      'Cinematic Collection',
      'Ambient',
      'emotional'::music_mood,
      'emotional'::music_category,
      30000,
      'https://cdn.zoikosocial.com/music/covers/golden-hour.jpg',
      'https://cdn.zoikosocial.com/music/golden-hour-preview.mp3',
      'https://cdn.zoikosocial.com/music/golden-hour.mp3',
      'royalty-free',
      'Music by Zoiko Audio',
      true
    ),
    (
      'Tender Moments',
      'Zoiko Audio',
      'Cinematic Collection',
      'Piano',
      'emotional'::music_mood,
      'emotional'::music_category,
      30000,
      'https://cdn.zoikosocial.com/music/covers/tender-moments.jpg',
      'https://cdn.zoikosocial.com/music/tender-moments-preview.mp3',
      'https://cdn.zoikosocial.com/music/tender-moments.mp3',
      'royalty-free',
      'Music by Zoiko Audio',
      true
    ),
    (
      'Wanderlust',
      'Zoiko Audio',
      'Travel Beats',
      'Indie Folk',
      'travel'::music_mood,
      'travel'::music_category,
      30000,
      'https://cdn.zoikosocial.com/music/covers/wanderlust.jpg',
      'https://cdn.zoikosocial.com/music/wanderlust-preview.mp3',
      'https://cdn.zoikosocial.com/music/wanderlust.mp3',
      'royalty-free',
      'Music by Zoiko Audio',
      true
    ),
    (
      'Road Trip',
      'Zoiko Audio',
      'Travel Beats',
      'Rock',
      'happy'::music_mood,
      'travel'::music_category,
      25000,
      'https://cdn.zoikosocial.com/music/covers/road-trip.jpg',
      'https://cdn.zoikosocial.com/music/road-trip-preview.mp3',
      'https://cdn.zoikosocial.com/music/road-trip.mp3',
      'royalty-free',
      'Music by Zoiko Audio',
      true
    ),
    (
      'Coastal Drive',
      'Zoiko Audio',
      'Travel Beats',
      'Electronic',
      'happy'::music_mood,
      'travel'::music_category,
      30000,
      'https://cdn.zoikosocial.com/music/covers/coastal-drive.jpg',
      'https://cdn.zoikosocial.com/music/coastal-drive-preview.mp3',
      'https://cdn.zoikosocial.com/music/coastal-drive.mp3',
      'royalty-free',
      'Music by Zoiko Audio',
      true
    ),
    (
      'Morning Dew',
      'Zoiko Audio',
      'Nature Sounds',
      'Ambient',
      'nature'::music_mood,
      'nature'::music_category,
      30000,
      'https://cdn.zoikosocial.com/music/covers/morning-dew.jpg',
      'https://cdn.zoikosocial.com/music/morning-dew-preview.mp3',
      'https://cdn.zoikosocial.com/music/morning-dew.mp3',
      'royalty-free',
      'Music by Zoiko Audio',
      true
    ),
    (
      'Mountain Trail',
      'Zoiko Audio',
      'Nature Sounds',
      'Folk',
      'nature'::music_mood,
      'nature'::music_category,
      30000,
      'https://cdn.zoikosocial.com/music/covers/mountain-trail.jpg',
      'https://cdn.zoikosocial.com/music/mountain-trail-preview.mp3',
      'https://cdn.zoikosocial.com/music/mountain-trail.mp3',
      'royalty-free',
      'Music by Zoiko Audio',
      true
    ),
    (
      'Giggles',
      'Zoiko Audio',
      'Playful Tunes',
      'Novelty',
      'funny'::music_mood,
      'funny'::music_category,
      20000,
      'https://cdn.zoikosocial.com/music/covers/giggles.jpg',
      'https://cdn.zoikosocial.com/music/giggles-preview.mp3',
      'https://cdn.zoikosocial.com/music/giggles.mp3',
      'royalty-free',
      'Music by Zoiko Audio',
      true
    ),
    (
      'Goofy Groove',
      'Zoiko Audio',
      'Playful Tunes',
      'Jazz',
      'funny'::music_mood,
      'funny'::music_category,
      20000,
      'https://cdn.zoikosocial.com/music/covers/goofy-groove.jpg',
      'https://cdn.zoikosocial.com/music/goofy-groove-preview.mp3',
      'https://cdn.zoikosocial.com/music/goofy-groove.mp3',
      'royalty-free',
      'Music by Zoiko Audio',
      true
    ),
    (
      'Silly Walk',
      'Zoiko Audio',
      'Playful Tunes',
      'Novelty',
      'funny'::music_mood,
      'funny'::music_category,
      20000,
      'https://cdn.zoikosocial.com/music/covers/silly-walk.jpg',
      'https://cdn.zoikosocial.com/music/silly-walk-preview.mp3',
      'https://cdn.zoikosocial.com/music/silly-walk.mp3',
      'royalty-free',
      'Music by Zoiko Audio',
      true
    ),
    (
      'New Dawn',
      'Zoiko Audio',
      'Inspire',
      'Orchestral',
      'inspirational'::music_mood,
      'inspirational'::music_category,
      30000,
      'https://cdn.zoikosocial.com/music/covers/new-dawn.jpg',
      'https://cdn.zoikosocial.com/music/new-dawn-preview.mp3',
      'https://cdn.zoikosocial.com/music/new-dawn.mp3',
      'royalty-free',
      'Music by Zoiko Audio',
      true
    ),
    (
      'Unstoppable',
      'Zoiko Audio',
      'Inspire',
      'Electronic',
      'inspirational'::music_mood,
      'inspirational'::music_category,
      30000,
      'https://cdn.zoikosocial.com/music/covers/unstoppable.jpg',
      'https://cdn.zoikosocial.com/music/unstoppable-preview.mp3',
      'https://cdn.zoikosocial.com/music/unstoppable.mp3',
      'royalty-free',
      'Music by Zoiko Audio',
      true
    ),
    (
      'Limitless',
      'Zoiko Audio',
      'Inspire',
      'Pop',
      'inspirational'::music_mood,
      'inspirational'::music_category,
      30000,
      'https://cdn.zoikosocial.com/music/covers/limitless.jpg',
      'https://cdn.zoikosocial.com/music/limitless-preview.mp3',
      'https://cdn.zoikosocial.com/music/limitless.mp3',
      'royalty-free',
      'Music by Zoiko Audio',
      true
    ),
    (
      'Clean Lines',
      'Zoiko Audio',
      'Background Vol 1',
      'Electronic',
      'background'::music_mood,
      'background'::music_category,
      30000,
      'https://cdn.zoikosocial.com/music/covers/clean-lines.jpg',
      'https://cdn.zoikosocial.com/music/clean-lines-preview.mp3',
      'https://cdn.zoikosocial.com/music/clean-lines.mp3',
      'royalty-free',
      'Music by Zoiko Audio',
      true
    ),
    (
      'Fresh Start',
      'Zoiko Audio',
      'Background Vol 1',
      'Acoustic',
      'background'::music_mood,
      'background'::music_category,
      30000,
      'https://cdn.zoikosocial.com/music/covers/fresh-start.jpg',
      'https://cdn.zoikosocial.com/music/fresh-start-preview.mp3',
      'https://cdn.zoikosocial.com/music/fresh-start.mp3',
      'royalty-free',
      'Music by Zoiko Audio',
      true
    ),
    (
      'Professional Pulse',
      'Zoiko Audio',
      'Background Vol 1',
      'Corporate',
      'corporate'::music_mood,
      'corporate'::music_category,
      30000,
      'https://cdn.zoikosocial.com/music/covers/professional-pulse.jpg',
      'https://cdn.zoikosocial.com/music/professional-pulse-preview.mp3',
      'https://cdn.zoikosocial.com/music/professional-pulse.mp3',
      'royalty-free',
      NULL,
      true
    ),
    (
      'Stargazer',
      'Zoiko Audio',
      'Ambient Dreams',
      'Ambient',
      'ambient'::music_mood,
      'ambient'::music_category,
      30000,
      'https://cdn.zoikosocial.com/music/covers/stargazer.jpg',
      'https://cdn.zoikosocial.com/music/stargazer-preview.mp3',
      'https://cdn.zoikosocial.com/music/stargazer.mp3',
      'royalty-free',
      'Music by Zoiko Audio',
      true
    ),
    (
      'Lunar Tide',
      'Zoiko Audio',
      'Ambient Dreams',
      'Ambient',
      'ambient'::music_mood,
      'ambient'::music_category,
      30000,
      'https://cdn.zoikosocial.com/music/covers/lunar-tide.jpg',
      'https://cdn.zoikosocial.com/music/lunar-tide-preview.mp3',
      'https://cdn.zoikosocial.com/music/lunar-tide.mp3',
      'royalty-free',
      'Music by Zoiko Audio',
      true
    ),
    (
      'Deep Focus',
      'Zoiko Audio',
      'Ambient Dreams',
      'Ambient',
      'ambient'::music_mood,
      'ambient'::music_category,
      30000,
      'https://cdn.zoikosocial.com/music/covers/deep-focus.jpg',
      'https://cdn.zoikosocial.com/music/deep-focus-preview.mp3',
      'https://cdn.zoikosocial.com/music/deep-focus.mp3',
      'royalty-free',
      NULL,
      true
    );
    
  END IF;
END $$;
