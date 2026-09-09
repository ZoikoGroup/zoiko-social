# ZoikoSocial — Deployment & Services Requirements

Everything needed to run the backend, frontend, and landing site, plus the
backing services and a suggested plan for moving off Supabase (e.g. to GCP).

> Repo: `github.com/ZoikoGroup/zoiko-social` — a pnpm + Turborepo monorepo.
> Prepared for the DevOps/deployment team. Values (secrets) are **not** included
> here — only the variable names and what each is for.

---

## 1. What's in the repo

| Path | App | Stack | Runs as |
|---|---|---|---|
| `apps/api` | Backend API | NestJS 11 + Fastify + Prisma + Socket.IO | Node service (HTTP + WebSocket), port **4000**, path prefix `/api/v1` |
| `apps/web` | Main web app | Next.js 16 (React 19) | Node service (or serverless), port **3000** |
| `apps/landing` | Marketing/landing site | Next.js | Static/Node service |
| `packages/*` | Shared libs (`@zoiko/types`, `@zoiko/validation`) | TypeScript | built as part of apps |
| `supabase/migrations/*.sql` | Database schema | ~45 raw SQL files | applied to Postgres in filename order |

**Toolchain:** Node.js **22.x**, pnpm **9.15** (`packageManager` pinned), Turborepo.
The API container also needs **ffmpeg** (Stories video pipeline) — already in the Dockerfiles.

---

## 2. Processes to deploy

1. **API (web service)** — `Dockerfile.api`. Serves HTTP + WebSocket on port 4000. By default it *also* runs the background queue workers.
2. **Worker (background)** — `Dockerfile.worker`, same image with `ENABLE_WORKERS=true`. Runs the BullMQ consumers (video/media transcode, notifications, feed fan-out, scheduled jobs, story lifecycle). Recommended as a **separate** service at scale; optional for a small deployment (the API runs workers unless `ENABLE_WORKERS=false`).
3. **Web** — `apps/web`, `next build` → `next start` (or Cloud Run / static hosting).
4. **Landing** — `apps/landing`, Next.js build.

WebSocket note: the API uses Socket.IO (messaging, presence, call signaling). The load balancer must **allow WebSockets**. If you run **more than one** API instance, enable the Socket.IO Redis adapter / sticky sessions (Redis is already a dependency).

---

## 3. Backing services

| Service | Used for | Required? | Currently | GCP / managed equivalent |
|---|---|---|---|---|
| **PostgreSQL 15+** | Primary database (Prisma ORM) | **Yes** | Supabase Postgres | **Cloud SQL for PostgreSQL** |
| **Redis 7+** | BullMQ job queues, caching, presence, rate-limits | **Yes** | Upstash Redis | **Memorystore for Redis** |
| **Object storage (S3-compatible)** | Media uploads (images, video, HLS) via presigned URLs | **Yes** (for uploads) | Cloudflare R2 (`@aws-sdk/client-s3`) | Keep **R2**, or **GCS** (S3 interop) |
| **Auth (JWT)** | User authentication | **Yes** | Supabase Auth | see §6 — decision needed |
| **LiveKit** | Audio/video calls (WebRTC SFU) | Optional (calls feature) | LiveKit Cloud | LiveKit Cloud or self-hosted |
| **Stripe** | Payments / subscriptions | Optional (payments feature) | Stripe | Stripe (unchanged) |
| **ffmpeg** | ~~Video transcode/HLS (Stories)~~ — no longer used; Stories were removed and transcoding went with them | No | — | — |

**Sentry** is wired in `apps/api` and off by default: set `SENTRY_DSN` and the API reports 5xx and unhandled rejections, each tagged with the request id that also appears in the access log and in the error response body. Leave it unset and nothing initialises. There is no error reporting at all without it.

**Planned but not yet wired in code** (env placeholders exist in `.env.example`, no SDK in `apps/api` yet — safe to ignore for first deploy): **Mux** (video), **Resend** (email), **OneSignal** (push).

---

## 4. Environment variables

### `apps/api` — currently active (required to boot & core features)
| Var | Purpose |
|---|---|
| `PORT` | HTTP port (4000) |
| `NODE_ENV` | `production` |
| `DATABASE_URL` | Postgres connection string (Prisma) — **use the session pooler, port 5432, and no `pgbouncer=true`;** see below |
| `REDIS_URL` | Redis connection string |
| `SUPABASE_URL` | Supabase project URL (auth + storage) |
| `SUPABASE_SERVICE_ROLE_KEY` | Supabase service key (server-side) |
| `SUPABASE_ANON_KEY` | Supabase anon key |
| `JWT_SECRET` | signing/verification secret (generate: `openssl rand -base64 32`) |
| `INTERNAL_API_SECRET` | internal service-to-service secret |
| `ALLOWED_ORIGIN` | CORS origin, e.g. the web app URL |
| `ENABLE_WORKERS` | `true` = worker-only mode; unset/`false` = API also runs workers |
| `GIT_SHA` | build arg, surfaced at `/api/v1/health/version` |
| `VAPID_PUBLIC_KEY` | Web Push — sent to browsers so they can subscribe. Public by design. |
| `VAPID_PRIVATE_KEY` | Web Push — signs the push requests. Never leaves the server. |
| `VAPID_SUBJECT` | `mailto:` or URL a push service can use to reach the operator. Defaults to `mailto:support@zoikosocial.com`. |

#### Which Supabase pooler `DATABASE_URL` should use

Use the **session** pooler and leave `pgbouncer=true` off:

```
postgresql://…@aws-1-<region>.pooler.supabase.com:5432/postgres?connection_limit=10
```

`pgbouncer=true` tells Prisma to give up prepared statements, and it costs about
five network round-trips per query instead of one. Measured against this project
from India, with a 148 ms round-trip to the Sydney region:

| `DATABASE_URL` | `SELECT 1` |
|---|---|
| `:6543` with `pgbouncer=true` | 771 ms |
| `:5432` with `pgbouncer=true` | 734 ms |
| `:5432`, flag omitted | **149 ms** |

The port is not what matters — the flag is.

The flag cannot simply be dropped from the **transaction** pooler (`:6543`). That
mode hands each transaction whichever server connection is free, so a prepared
statement made on one is missing on the next: a 200-query concurrency test failed
147 of them with `42P05` and `26000`. Session mode gives each client its own
server connection for the life of the connection, so prepared statements hold.

The cost of session mode is connection count: every connection in Prisma's pool
pins a real Postgres backend, so an instance holds up to `connection_limit` of
them. This project's database allows 60 and Supabase itself uses ~17, which leaves
room for roughly four instances at `connection_limit=10`. Two things to respect:

- Raise `connection_limit` only against that budget, not by feel.
- **Development and production share one Supabase project here.** Several API
  instances left running at once will exhaust the backends and every one of them
  starts answering "Can't reach database server".

Serverless callers would still need the transaction pooler, since each invocation
opens its own connection. Nothing in this repo is in that position — only the API
talks to Postgres, and it is a long-lived process.

#### Web Push keys

Generate a pair once and keep it. **Rotating these invalidates every existing
subscription**, so every member silently stops receiving notifications until each
of their browsers re-subscribes:

```bash
node -e "console.log(require('web-push').generateVAPIDKeys())"
```

Both are optional. Without them the API boots normally, `/api/v1/push/public-key`
reports `available: false`, and the web app hides the notification control rather
than offering a permission prompt that cannot lead anywhere. That is deliberate:
a deployment with no keys should not look broken.



### `apps/api` — feature services (set when enabling that feature)
| Var group | Enables |
|---|---|
| `R2_ACCOUNT_ID`, `R2_ACCESS_KEY_ID`, `R2_SECRET_ACCESS_KEY`, `R2_BUCKET`, `R2_PUBLIC_URL` | Media object storage (uploads/CDN) |
| `LIVEKIT_URL`, `LIVEKIT_API_KEY`, `LIVEKIT_API_SECRET` | Audio/video calls |
| `STRIPE_SECRET_KEY`, `STRIPE_WEBHOOK_SECRET` | Payments |
| `SENTRY_DSN` | Error reporting. Unset = no reporting; the API logs to stdout only. |
| `GROQ_API_KEY`, optionally `GROQ_MODEL` | **The AI assistant.** Unset = the assistant still exists, has a profile and a DM thread, and answers every message with the fixed "I'm not quite switched on yet" text. It does not fail, error, or hide — it degrades silently, which is how production ran without a key long enough to be reported as "the AI gives the same answer to every question". `GROQ_MODEL` has a default; the key does not. |
| `NEWS_INGEST_DISABLED` | Set to `true` to stop the 3-hourly news ingest (local development). Unset in production. |
| *(planned)* `MUX_*`, `RESEND_API_KEY` + `EMAIL_FROM`, `ONESIGNAL_*` | video / email / push |

### `apps/web` (and `apps/landing`)
| Var | Purpose |
|---|---|
| `NEXT_PUBLIC_API_URL` | Base URL of the API (e.g. `https://api.zoikosocial.com`) |
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase URL (client auth) |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase anon key (client auth) |
| `NEXT_PUBLIC_APP_URL` | Public web app URL |
| `NEXT_PUBLIC_APP_NAME` | display name (optional) |
| `NEXT_PUBLIC_SENTRY_DSN` | monitoring (optional) |

> Full templates live in `/.env.example` and `apps/api/.env.example`.

---

## 5. Database & migrations

- Postgres is the source of truth. The schema is built from **raw SQL files** in `supabase/migrations/` (currently through `081_chat_media_no_enumeration.sql`), applied **in filename order**.
- The app uses **Prisma as the client/ORM only** — it does **not** use `prisma migrate` to build the DB. `prisma generate` runs at build time (already in the Dockerfiles). `apps/api/prisma/schema.prisma` must stay in sync with the SQL (there's a `pnpm --filter @zoiko/api db:check` drift check).
- To provision a fresh DB: create the database, then run every file in `supabase/migrations/*.sql` in order.

### Migrations are never applied automatically

No workflow in `.github/workflows/` runs `supabase db push`, `prisma migrate`, or
any equivalent — deploying does **not** touch the schema. A migration lands only
when a person runs it, which is deliberate on a database shared by dev and
production, but does mean a merged migration file can sit inert indefinitely.

Applying them, from the repo root:

```bash
SUPABASE_DB_PASSWORD=… supabase db push --linked --yes
```

Use `--dry-run` first; it prints exactly which files would run. Note the CLI
needs a **session-mode** connection (port 5432). `DATABASE_URL` points at the
transaction pooler on 6543, which does not support prepared statements and fails
with `prepared statement "lrupsc_1_0" already exists`.

**Currently unapplied: `081_chat_media_no_enumeration.sql`.** Until it runs, the
`chat-media` bucket's read policy has no owner scoping, so the anon key that
ships in the browser bundle can list every DM attachment path and fetch any of
them without credentials.

### ⚠️ Important for non-Supabase Postgres (Cloud SQL, etc.)
The SQL files are **Supabase-flavored**: they contain `ENABLE ROW LEVEL SECURITY` and `CREATE POLICY ... USING (… auth.uid() …)`. On a vanilla Postgres, `auth.uid()` **does not exist**, so those statements will error.

The API connects to Postgres with a **direct connection via Prisma, which bypasses RLS entirely** — so RLS is not required for the API to function. Two clean options when moving off Supabase:
1. **Add a compatibility shim** before running migrations: `CREATE SCHEMA IF NOT EXISTS auth; CREATE FUNCTION auth.uid() RETURNS uuid AS $$ SELECT NULL::uuid $$ LANGUAGE sql;` — lets the RLS statements run without changing files (RLS stays dormant since the API bypasses it).
2. **Strip the RLS/policy statements** from the SQL when importing (safe, because the API enforces access in application code, not RLS).

Recommended: option 1 (least churn).

---

## 6. Moving off Supabase — the key decision

Supabase currently provides **three** things. Plan each separately:

1. **Postgres database** → straightforward: move to **Cloud SQL for PostgreSQL** and apply the migrations (see §5). Export/import data with `pg_dump`/`pg_restore`.
2. **Storage** (user images/media) → the code already speaks S3 (`@aws-sdk/client-s3`); point it at **Cloudflare R2** (already configured) or **GCS** (S3 interop). Migrate existing objects with `rclone`.
3. **Auth (the hard part)** → the API verifies **Supabase-issued JWTs** (`jose`) and the web app uses `@supabase/supabase-js` for login/session. Options:
   - **Keep Supabase Auth only** (managed, hosted — it does **not** consume your servers' RAM; the RAM concern only applies to *self-hosting* the full Supabase stack). Lowest effort, zero code change.
   - **Self-host GoTrue** (Supabase's auth server) on GCP — medium effort.
   - **Replace with another IdP** (Firebase Auth / Auth0 / Clerk) — highest effort: requires changing API token verification + the web auth client, and migrating users.

> The "Supabase uses a lot of RAM" issue is specific to **self-hosting Supabase**. Managed Supabase (or just its Auth) is a hosted SaaS. If the goal is only to reduce infra RAM, keeping **managed Supabase Auth** while moving DB→Cloud SQL and Storage→R2/GCS is the cheapest path and needs no code changes.

---

## 7. Suggested GCP deployment

| Component | GCP service |
|---|---|
| API + Worker (containers) | **Cloud Run** (WebSockets supported) or GKE |
| Postgres | **Cloud SQL for PostgreSQL 15** |
| Redis | **Memorystore for Redis** |
| Media storage | **Cloud Storage** (S3 interop) or keep **Cloudflare R2** |
| Secrets | **Secret Manager** |
| Container images | **Artifact Registry** |
| Web + Landing | **Cloud Run** or keep **Vercel** |
| CDN / domains | Cloud CDN / Cloud Load Balancing; domains: `api.zoikosocial.com`, `media.zoikosocial.com`, app + landing domains |

Build: `docker build -f Dockerfile.api --build-arg GIT_SHA=$SHA` (and `Dockerfile.worker`). The image is self-contained (`pnpm deploy --prod`), Node 22 Alpine, non-root, with ffmpeg.

Health checks: `GET /api/v1/health` (liveness) and `GET /api/v1/health/version` (returns the built commit SHA).

---

## 7a. Cloudflare sits in front of the API

`api.zoikosocial.com` is proxied by Cloudflare (responses carry `Server:
cloudflare` and a `CF-RAY` header). Two consequences worth carrying to any new
environment:

**Rate limiting depends on it.** Fastify is not configured with `trustProxy`, so
`request.ip` is a Cloudflare *edge* address — shared by every anonymous caller
routed through that datacentre. The limiter therefore keys on the
`CF-Connecting-IP` header, which Cloudflare sets and overwrites on every request
(`apps/api/src/modules/common/guards/rate-limiter.guard.ts`). Authenticated
callers key on user id and are unaffected either way.

`X-Forwarded-For` is deliberately **not** consulted: on a direct connection it is
just a client-supplied header, and honouring it would let an attacker mint a
fresh identity per request.

**Therefore the origin must not be reachable except through Cloudflare.** If it
ever is, `CF-Connecting-IP` becomes forgeable and per-IP limits stop meaning
anything. Restrict the origin to Cloudflare's published IP ranges at the
firewall rather than adding header fallbacks in application code.

If a future environment fronts the API with something else, that header changes
and the guard needs updating with it.

---

## 7b. The database connection is the platform's slowest part

Measured, not estimated. `DATABASE_URL` points at the Supabase pooler on port
**6543 (transaction mode)**. Port 5432 on the same host is session mode. Same
credentials, same query, five warm runs each:

| Connection | Warm `SELECT 1` |
|---|---|
| 6543 transaction, `pgbouncer=true` (current) | **1,568 ms** |
| 5432 session, no parameters | **297 ms** |
| 5432 session, `connection_limit=10` | **316 ms** |
| 5432 session **with `pgbouncer=true`** | **1,545 ms** |
| 6543 with `connection_limit` removed | 1,512 ms — the cap is not the cause |

**It is the `pgbouncer=true` flag, not the port.** Carrying it onto 5432 keeps
the full 1.5 s, so changing the port alone gains nothing — the flag has to come
off with it. The flag tells Prisma to disable prepared statements, which
transaction-mode pooling requires (without it, queries fail with
`prepared statement "lrupsc_1_0" already exists` — the same error `supabase db
push` hits on 6543). Session mode does not need it, which is what makes the
move worthwhile.

A no-op query costing 1.5 s is the dominant term in almost every request. For
comparison, on the same machine: a real query fetching 12 news articles took
1,521 ms, so the *work* was ~26 ms and the round-trip was the rest. Ten queries
in sequence took 15.3 s; the same ten in parallel took 3.7 s. It is pure latency.

**Switching `DATABASE_URL` to session mode is a single-line change worth roughly
5x on every database-backed request.** Change the port to 5432 *and* remove
`pgbouncer=true`; keep `connection_limit` if you want the pool capped, which
costs nothing measurable. It is the same connection migrations already have to
use — see §5.

    ...@<host>.pooler.supabase.com:5432/postgres?connection_limit=10

In production this is the `DATABASE_URL_OVERRIDE` repository secret, which the
API deploy writes over the VM's own `.env` — no server access needed. Locally it
is `apps/api/.env`.

Caveat worth knowing before flipping it: session mode holds a server connection
per client rather than per transaction, so watch the connection count if the API
is ever scaled to several instances.

For scale, two other round-trips measured from the same place: Redis (Upstash)
is **217 ms**, and an in-process L1 cache hit is free. That ordering is why
`NewsService.feedCards` caches the viewer-independent half of a news page — it
turns a 2,319 ms call into 0 ms once warm.

---

## 8. Current CI/CD (for reference)

GitHub Actions in `.github/workflows/`:
- `api-deploy.yml` — builds the Docker image → pushes to GHCR → triggers a Render deploy → verifies `/health/version`.
- `vercel-deploy.yml` / `landing-deploy.yml` — deploy web & landing to Vercel.

These can be repointed to Artifact Registry + Cloud Run.

---

## 9. Notes / current state

- Dev and production share **one** Supabase project. Migrations are applied through `080`; `081` is committed but not yet applied (see §5).
- Two external free-tiers are currently exhausted and will need paid/managed replacements: **Upstash Redis** (over quota) and **Render** (workspace bandwidth-suspended). Memorystore + Cloud Run/Cloud SQL resolve both.
- Minimum viable service set to get the site fully working: **Postgres + Redis + object storage + auth (Supabase or replacement) + the two secrets**. Calls (LiveKit) and payments (Stripe) can be enabled later without blocking launch.
