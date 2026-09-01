-- Private enquiries stop being world-readable.
--
-- `product_enquiries` and `breeding_requests` each carry a free-text `message`
-- written by one person to one other person — "Is this still available?", "My
-- male golden is health-tested too." Both tables had a single SELECT policy with
-- `USING (true)`, so the anon key that ships inside the browser bundle could read
-- every enquiry ever sent, along with the buyer's and requester's profile ids.
--
-- The API is unaffected either way: it connects as a role that bypasses RLS, and
-- it already scopes these reads to the two parties. This closes the direct
-- PostgREST path, which was the only one that ignored that scoping.
--
-- The rule below is the same one the API applies — the two parties to the
-- conversation, and nobody else:
--   * the person who sent it, and
--   * the person who owns the thing it was sent about.
--
-- Only SELECT is granted. Neither table had an INSERT, UPDATE or DELETE policy
-- before this migration and neither gains one, so writes stay refused: creating
-- an enquiry goes through the API, which enforces blocks, rate limits and the
-- one-enquiry-per-product uniqueness rule that a raw INSERT would walk straight
-- past.

-- ── product_enquiries ────────────────────────────────────────────────────────

DROP POLICY IF EXISTS "product_enquiries_select" ON public.product_enquiries;

CREATE POLICY "product_enquiries_select_parties"
  ON public.product_enquiries FOR SELECT
  USING (
    buyer_id = auth.uid()
    OR EXISTS (
      SELECT 1 FROM public.products p
      WHERE p.id = product_enquiries.product_id
        AND p.seller_id = auth.uid()
    )
  );

-- ── breeding_requests ────────────────────────────────────────────────────────

DROP POLICY IF EXISTS "breeding_requests_select" ON public.breeding_requests;

CREATE POLICY "breeding_requests_select_parties"
  ON public.breeding_requests FOR SELECT
  USING (
    requester_id = auth.uid()
    OR EXISTS (
      SELECT 1 FROM public.breeding_profiles bp
      WHERE bp.id = breeding_requests.profile_id
        AND bp.owner_id = auth.uid()
    )
  );
