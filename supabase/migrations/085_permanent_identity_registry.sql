-- 085_permanent_identity_registry.sql
-- Anchors global government identity verification permanently across account
-- deletions and recreations. Prevents banned or fraudulent members from
-- escaping their history by creating fresh accounts.

CREATE TABLE IF NOT EXISTS public.permanent_identity_registry (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    id_document_hash TEXT NOT NULL UNIQUE,
    verified_full_name TEXT NOT NULL,
    birth_date TEXT,
    issuing_country TEXT NOT NULL,
    doc_type TEXT NOT NULL,
    current_user_id TEXT,
    associated_user_ids TEXT[] NOT NULL DEFAULT '{}',
    is_banned BOOLEAN NOT NULL DEFAULT FALSE,
    ban_reason TEXT,
    didit_session_id TEXT,
    first_verified_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    last_verified_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_permanent_identity_hash ON public.permanent_identity_registry(id_document_hash);
CREATE INDEX IF NOT EXISTS idx_permanent_identity_user ON public.permanent_identity_registry(current_user_id);

ALTER TABLE public.permanent_identity_registry ENABLE ROW LEVEL SECURITY;

-- Service role only access for security (defense in depth)
DROP POLICY IF EXISTS "Service role full access on permanent_identity_registry" ON public.permanent_identity_registry;
CREATE POLICY "Service role full access on permanent_identity_registry"
    ON public.permanent_identity_registry
    FOR ALL
    TO service_role
    USING (true)
    WITH CHECK (true);
