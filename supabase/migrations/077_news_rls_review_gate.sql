-- ── Close the read path that goes around the review gate ─────────────────────
-- news_articles_select allows anyone holding the anon key to read every article
-- where is_deleted = false AND status = 'published'. That key ships in the
-- browser bundle by design — it is what Supabase Auth uses — so this policy is
-- effectively "the public internet".
--
-- The policy predates review_status and does not know about it. Since 076,
-- community submissions are created with status 'published' and review_status
-- 'pending', which means an unreviewed article is refused by the API and served
-- by PostgREST. The moderation gate lives in application code; a direct REST
-- call does not go through application code.
--
-- The same hole already existed for hidden_at: an article a moderator hides
-- stays readable through this path. Both are closed here.
--
-- Deliberately not touching the API, which connects as `postgres` (rolbypassrls
-- = true) and is unaffected by any policy on this table.
-- ─────────────────────────────────────────────────────────────────────────────

DROP POLICY IF EXISTS news_articles_select ON public.news_articles;

CREATE POLICY news_articles_select ON public.news_articles
  FOR SELECT
  TO public
  USING (
    is_deleted = false
    AND status = 'published'
    -- Unreviewed and rejected submissions are the author's business and the
    -- moderators', not the public's.
    AND review_status = 'approved'
    -- Hiding an article should actually hide it.
    AND hidden_at IS NULL
  );

-- news_sources deliberately has NO policy. RLS is enabled and nothing grants
-- access, so anon and authenticated get nothing — which is right for a table
-- whose whole purpose is deciding what publishes into everyone's feed without
-- review. The API reaches it as `postgres`, which bypasses RLS.
