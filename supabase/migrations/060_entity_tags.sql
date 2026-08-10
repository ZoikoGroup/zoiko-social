-- ── Tags on the pet-domain entities ──────────────────────────────────────────
-- Hashtags existed for posts and stories only (post_hashtags, story_hashtags),
-- so #beagle found posts about beagles and never the beagle up for adoption, the
-- beagle meetup, or the beagle someone is looking for. The tag was a vocabulary
-- the rest of the platform could not speak.
--
-- Implemented as text[] rather than a join table per entity, because:
--   * communities.tags already works this way, so it is the house pattern;
--   * the read side needs one query per entity regardless — each has its own
--     visibility rules (invite-only events, blocked posters, private listings)
--     that a shared join table could not express in a single pass;
--   * five more join tables would be five more cascade paths to maintain for no
--     gain on the query that actually matters.
--
-- Tags are normalised on write (lowercased, '#' stripped, deduped) so the GIN
-- index below can serve exact containment lookups.
--
-- Idempotent.

ALTER TABLE public.adoption_posts   ADD COLUMN IF NOT EXISTS tags text[] NOT NULL DEFAULT '{}';
ALTER TABLE public.events           ADD COLUMN IF NOT EXISTS tags text[] NOT NULL DEFAULT '{}';
ALTER TABLE public.lost_found_posts ADD COLUMN IF NOT EXISTS tags text[] NOT NULL DEFAULT '{}';
ALTER TABLE public.products         ADD COLUMN IF NOT EXISTS tags text[] NOT NULL DEFAULT '{}';

-- GIN is what makes `tags @> ARRAY['beagle']` an index lookup instead of a scan.
CREATE INDEX IF NOT EXISTS adoption_posts_tags_idx   ON public.adoption_posts   USING GIN (tags);
CREATE INDEX IF NOT EXISTS events_tags_idx           ON public.events           USING GIN (tags);
CREATE INDEX IF NOT EXISTS lost_found_posts_tags_idx ON public.lost_found_posts USING GIN (tags);
CREATE INDEX IF NOT EXISTS products_tags_idx         ON public.products         USING GIN (tags);

-- communities.tags predates this and had no index, so the same lookup there was
-- a sequential scan.
CREATE INDEX IF NOT EXISTS communities_tags_idx ON public.communities USING GIN (tags);
