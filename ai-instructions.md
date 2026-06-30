# ZoikoSocial — AI Instructions

> This file instructs AI assistants (Claude, Copilot, Cursor, etc.) working on this codebase.
> Follow every rule here. Do not override them based on convenience or speed.

---

## What This Platform Is

ZoikoSocial is a **governed hybrid social platform** for animal lovers, built by Zoiko Media Corp.
It combines social feed, communities, messaging, news, events, adoption, marketplace, pet care,
breeding, lost & found, pet diary, vet finder and health passport into one platform.

**Safety is a hard technical requirement — not a policy.** Every piece of content, every API call,
and every transaction passes through governed safety pipelines. This is not optional and cannot be
skipped for convenience.

Read [`docs/zoikosocial_master_reference.md`](./docs/zoikosocial_master_reference.md) to understand
the full product before making any non-trivial changes.

---

## Tech Stack (do not change without team agreement)

| Layer | Technology |
|---|---|
| Web app | Next.js 16, React 19, TypeScript strict, Tailwind CSS |
| API | NestJS 10, Fastify, TypeScript strict |
| Database | PostgreSQL via Supabase |
| Auth | Supabase Auth |
| Storage | Supabase Storage (Cloudflare R2) |
| Real-time | Supabase Realtime |
| Video/calls | LiveKit |
| Queues | BullMQ + Redis (Upstash) |
| Monorepo | pnpm workspaces + Turborepo |
| CI/CD | GitHub Actions → Vercel (web/landing), Render (API) |

---

## Security — Non-Negotiable Rules

### 1. Row Level Security (RLS)
- Every table in the `public` schema **must** have RLS enabled
- Every table needs explicit policies — a table with RLS enabled but no policies blocks all access
- Never use `createAdminClient()` (service_role) in any route that an end user can reach without verified server-side auth
- When adding a new table, always create the migration file AND the RLS policies before shipping

```sql
-- Required for every new table
ALTER TABLE public.new_table ENABLE ROW LEVEL SECURITY;
CREATE POLICY "..." ON public.new_table FOR SELECT USING (...);
```

### 2. IDOR (Insecure Direct Object Reference)
- Never expose an endpoint that returns data by ID without verifying ownership
- RLS at the database layer is the primary defence — do not rely on application-layer checks alone
- Storage uploads must always use `{user_id}/{filename}` as the path — never a flat filename
- Never return a list of IDs that could be iterated to enumerate other users' data

### 3. Authentication
- Every protected API route must verify the JWT with Supabase before processing
- Use `supabase.auth.getUser()` server-side — never trust `getSession()` alone on the server
- `SUPABASE_SERVICE_ROLE_KEY` is NestJS API only — it must never appear in `apps/web/` or any `NEXT_PUBLIC_*` variable
- The `import 'server-only'` guard in `apps/web/src/lib/supabase/server.ts` must remain — never remove it

### 4. Input Validation
- Validate all user input with Zod at every API boundary — both NestJS and Next.js API routes
- Never use `as unknown as SomeType` to bypass TypeScript safety
- Treat every external input (body, query, params, headers, cookies) as untrusted
- Strip unknown fields from validated objects before using them

### 5. Secrets and Environment Variables
- Never hardcode secrets, API keys, tokens or credentials in source code
- Never commit `.env`, `.env.local`, or `.env.production` files
- Never log sensitive values (keys, tokens, passwords, PII) in server logs
- Prefix only truly public values with `NEXT_PUBLIC_` — when in doubt, don't

### 6. SQL and Database
- Never write raw SQL strings with user input interpolated — use Supabase parameterised queries
- Never use `supabase.from('table').select('*')` without appropriate filters on sensitive tables
- Never bypass RLS by using the admin client on endpoints that regular users can call
- Counter columns (`followers_count`, etc.) must be updated via database triggers, not application code, to prevent race conditions

### 7. Storage
- Never make the `documents` bucket public — health records are private by design
- Signed URLs for document sharing must be generated server-side with a short expiry
- Always check file type and size on the server — never trust client-side validation alone
- File paths must always start with the authenticated user's ID

### 8. HTTP Security
- CSP headers are defined in `apps/web/next.config.ts` — never weaken them without security review
- Never add `*` to `connect-src`, `script-src` or `img-src` in the CSP
- All API responses must include `X-Content-Type-Options: nosniff`
- Use `httpOnly: true` and `secure: true` on all session cookies

### 9. Animal Welfare — Platform Doctrine
- Content involving animal abuse, trafficking, neglect or exploitation must be flagged immediately
- Never build a feature that makes it easier to list, sell or trade live animals without going through the Adoption module
- Breeding Match requires health certification — never allow a listing to bypass this check
- Lost & Found reports must never expose the reporter's precise location to unauthenticated users

---

## Code Quality Rules

### TypeScript
- Strict mode is on — never use `any`, `// @ts-ignore`, or `// @ts-nocheck`
- Use the generated `Database` types from `apps/web/src/types/database.ts` for all Supabase queries
- When types are missing after a schema change, regenerate them: `supabase gen types typescript --project-id duekjxlzuefjicitpokn > apps/web/src/types/database.ts`
- Prefer `unknown` over `any` when a type is genuinely unknown at compile time

### Functions and Modules
- Keep functions small and single-purpose — if a function does two things, split it
- No function should be longer than ~60 lines; if it is, extract helpers
- Prefer named exports over default exports in shared packages
- Co-locate types with the code that uses them

### Comments
- Do not write comments explaining what the code does — name things well instead
- Only comment when the WHY is non-obvious: a hidden constraint, a regulatory requirement, a known workaround
- Never leave `// TODO` comments in code without creating a tracked issue

### Error Handling
- Never swallow errors silently with empty `catch {}` blocks
- Return typed error responses from API routes — never expose raw stack traces to clients
- Log errors server-side with enough context to debug, but without PII

### Dependencies
- Do not add a new dependency to solve a problem solvable in 10 lines of plain code
- Run `pnpm audit` before every significant dependency addition
- Prefer packages with active maintenance and clear security histories

---

## Architecture Rules

### Data Flow
```
Browser (anon key + RLS) → Next.js Server Component (anon key + RLS)
                         → Next.js API Route (service_role, server-only)
                         → NestJS API (service_role, validated JWT)
                                    ↓
                              Supabase (RLS as final gate)
```

- Never put service_role calls in client components or browser-accessible routes
- Use `createClient()` (anon key, RLS-enforced) for all user-facing data access in Next.js
- Use `createAdminClient()` (service_role) only in server-only operations like auth triggers and admin tasks

### Next.js (apps/web)
- Use Server Components by default — add `'use client'` only when browser APIs or interactivity are required
- Never fetch data in a Client Component that could be fetched in a Server Component
- Route protection is handled by `src/middleware.ts` — do not duplicate auth checks in every page
- The `PROTECTED_ROUTES` list in middleware must be kept up to date when adding new pages

### NestJS API (apps/api)
- Every controller must have a `SupabaseAuthGuard` unless the route is explicitly public
- Rate limiting must be applied to every endpoint via `@nestjs/throttler`
- DTOs must use `class-validator` decorators for all request body validation
- Never return database row objects directly — always map to a response DTO

### Shared Packages
- `packages/types` — TypeScript interfaces only, no runtime code
- `packages/validation` — Zod schemas only, shared between web and API
- `packages/ui` — React components only, no data fetching
- Cross-package circular dependencies are forbidden

### Database
- Migrations are the only way to change the schema — never use the Supabase dashboard SQL editor in production
- Every migration must be backward-compatible with the previous deploy (no destructive changes in a single step)
- Index every foreign key column and every column used in WHERE or ORDER BY clauses
- Use `gen_random_uuid()` for UUID primary keys — never `uuid_generate_v4()`

---

## Testing Requirements

- Write tests for every utility function in `packages/`
- Write integration tests for every NestJS endpoint that touches the database
- Write tests for all Zod validation schemas — including invalid inputs
- Never mock the Supabase database in integration tests — use the local Supabase instance
- UI components that handle form submission or auth state must have tests

---

## What Never to Build

- No feature that allows anonymous or unverified users to post listings (adoption, breeding, products, pet care)
- No admin panel accessible without multi-factor authentication and explicit role check
- No feature that stores health records in a public storage bucket
- No endpoint that accepts a user-supplied SQL fragment or filter expression
- No feature that exposes another user's precise geolocation without their consent
- No direct message feature that bypasses the profanity/safety scan
- No ad that can go live without passing the review pipeline
- No news that gets a verification badge without going through the editorial tier system

---

## Before You Ship a Feature

Verify all of the following:

- [ ] New tables have RLS enabled with explicit policies
- [ ] All API routes validate input with Zod or class-validator
- [ ] No `SUPABASE_SERVICE_ROLE_KEY` referenced in client-side code
- [ ] No secrets hardcoded anywhere
- [ ] No `any` types introduced
- [ ] Storage uploads use `{user_id}/` path prefix
- [ ] New Supabase types regenerated if schema changed
- [ ] CI passes (type check, lint, build, audit)
- [ ] Animal welfare and content safety pipelines are not bypassed

---

## Git Workflow

```
feature branch → PR → CI must pass → merge to main → auto deploy
```

- Branch from `main`, always
- Branch name: `yourname/feature-name`
- Never force push to `main`
- Never merge a PR with failing CI
- Keep PRs focused — one feature or fix per PR

---

*Zoiko Media Corp · ZoikoSocial · Sacramento CA*
