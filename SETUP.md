# ZoikoSocial — Team Setup Guide

> **First time?** Read this top to bottom. It takes ~15 minutes.  
> **Returning dev?** Jump to [Daily Workflow](#daily-workflow).

---

## Prerequisites

Install these before anything else:

| Tool | Version | Install |
|---|---|---|
| Node.js | 22.x | [nodejs.org](https://nodejs.org) |
| pnpm | 9.15.0 | `npm install -g pnpm@9.15.0` |
| Supabase CLI | latest | `pnpm add -g supabase` |
| Git | any | [git-scm.com](https://git-scm.com) |

Verify:
```bash
node -v    # v22.x.x
pnpm -v    # 9.15.0
supabase --version
```

---

## 1. Clone and Install

```bash
git clone https://github.com/ZoikoGroup/zoiko-social.git
cd zoiko-social
pnpm install
```

> `pnpm install` installs dependencies for all 3 apps and 4 packages in one shot.

---

## 2. Environment Variables

Copy the example files and fill in the values:

```bash
# Main web app
cp apps/web/.env.example apps/web/.env.local

# NestJS API
cp apps/api/.env.example apps/api/.env
```

Get the values from the **project owner** (never commit these files).

### apps/web/.env.local
```env
NEXT_PUBLIC_SUPABASE_URL=https://duekjxlzuefjicitpokn.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=<get from owner>
NEXT_PUBLIC_APP_URL=http://localhost:3000
NEXT_PUBLIC_API_URL=http://localhost:4000
```

### apps/api/.env
```env
PORT=4000
NODE_ENV=development
SUPABASE_URL=https://duekjxlzuefjicitpokn.supabase.co
SUPABASE_SERVICE_ROLE_KEY=<get from owner — NEVER put this in web app>
SUPABASE_ANON_KEY=<get from owner>
JWT_SECRET=<get from owner>
INTERNAL_API_SECRET=<get from owner>
ALLOWED_ORIGIN=http://localhost:3000
REDIS_URL=redis://localhost:6379
```

> **Security rule:** `SUPABASE_SERVICE_ROLE_KEY` bypasses Row Level Security.
> It must NEVER appear in `apps/web/` or any client-side code. API only.

---

## 3. Run Locally

```bash
pnpm dev
```

This starts all three apps simultaneously via Turborepo:

| App | URL | What it is |
|---|---|---|
| `apps/web` | http://localhost:3000 | Full web app (login → all features) |
| `apps/landing` | http://localhost:3001 | Landing/marketing page |
| `apps/api` | http://localhost:4000 | NestJS API |

To run a single app:
```bash
pnpm turbo dev --filter=@zoiko/web
pnpm turbo dev --filter=@zoiko/landing
pnpm turbo dev --filter=@zoiko/api
```

---

## 4. Project Structure

```
zoiko-social/
├── apps/
│   ├── web/              # Full web app — Next.js 16, React 19
│   │   ├── src/
│   │   │   ├── app/      # App Router pages
│   │   │   ├── lib/
│   │   │   │   └── supabase/   # server.ts, client.ts, middleware.ts
│   │   │   ├── types/
│   │   │   │   └── database.ts # Generated Supabase types (do not edit manually)
│   │   │   └── middleware.ts   # Auth + route protection
│   │   └── vercel.json
│   │
│   ├── landing/          # Marketing/landing page — Next.js 16
│   │   └── src/
│   │       └── components/  # nav, hero, features, waitlist, footer
│   │
│   └── api/              # NestJS 10 + Fastify — backend API
│       ├── src/
│       │   └── main.ts
│       └── Dockerfile
│
├── packages/
│   ├── ui/               # Shared React components
│   ├── types/            # Shared TypeScript types
│   ├── validation/       # Shared Zod schemas
│   └── tsconfig/         # Shared TypeScript configs
│
├── supabase/
│   └── migrations/
│       ├── 000_schema.sql           # All tables, enums, indexes, auth trigger
│       ├── 001_rls_setup.sql        # RLS policies for core tables
│       ├── 002_rls_missing_tables.sql  # RLS for remaining tables
│       └── 003_storage.sql          # Storage buckets + storage RLS
│
├── .github/
│   └── workflows/
│       ├── ci.yml                   # Lint + type check + build + audit (all branches)
│       ├── vercel-deploy.yml        # Deploy web app → Vercel
│       ├── landing-deploy.yml       # Deploy landing → Vercel
│       └── api-deploy.yml           # Trigger Render redeploy
│
├── turbo.json            # Turborepo task pipeline
├── pnpm-workspace.yaml   # Workspace definition
└── SETUP.md              # This file
```

---

## 5. Database (Supabase)

The database schema is already deployed. You do not need to run migrations unless you are adding new ones.

### Adding a new migration

```bash
# Create a new migration file
supabase migration new your_migration_name

# Edit the file in supabase/migrations/
# Then push to the remote database
supabase db push
```

### Regenerating TypeScript types

Run this after any schema change and commit the result:

```bash
supabase gen types typescript --project-id duekjxlzuefjicitpokn > apps/web/src/types/database.ts
```

### Linking Supabase CLI (first time only)

```bash
supabase login
supabase link --project-ref duekjxlzuefjicitpokn
```

---

## 6. Daily Workflow

**Never push directly to `main`.** All changes go through a PR.

```bash
# 1. Create a feature branch
git checkout main && git pull
git checkout -b yourname/feature-name

# 2. Make your changes, then commit
git add .
git commit -m "feat: describe what you built"

# 3. Push your branch
git push origin yourname/feature-name

# 4. Open a PR on GitHub → main
# GitHub Actions runs CI automatically — must pass before merging
```

### Branch naming
```
yourname/feature-name     # new feature
yourname/fix-bug-name     # bug fix
yourname/chore-task       # config, deps, cleanup
```

### What happens on merge to main

| Changed files | Triggered workflow | Result |
|---|---|---|
| `apps/web/**` or `packages/**` | `vercel-deploy.yml` | Web app deployed to Vercel |
| `apps/landing/**` | `landing-deploy.yml` | Landing page deployed to Vercel |
| `apps/api/**` | `api-deploy.yml` | Render rebuild triggered |
| Any | `ci.yml` | Lint + type check + security audit |

---

## 7. Code Quality

Run these before pushing:

```bash
# Type check all apps
pnpm turbo type-check

# Lint all apps
pnpm turbo lint

# Fix auto-fixable lint issues (runs eslint --fix in each app)
pnpm turbo lint:fix

# Run tests
pnpm turbo test
```

Or for a single app:
```bash
pnpm turbo type-check --filter=@zoiko/web
pnpm turbo lint --filter=@zoiko/api
```

---

## 8. Supabase Local Development (optional)

If you want a local Supabase instance for offline development:

```bash
# Start local Supabase (requires Docker)
supabase start

# This gives you a local DB + Studio at http://localhost:54323
# Update apps/web/.env.local with the local URLs printed by `supabase start`
```

---

## 9. Storage Upload Convention

All file uploads must use the path `{user_id}/{filename}`.

```typescript
// Correct — IDOR-safe
const path = `${user.id}/avatar.jpg`
await supabase.storage.from('avatars').upload(path, file)

// Wrong — anyone can overwrite this
const path = `avatar.jpg`
```

This is enforced by Storage RLS policies. Uploads to another user's path will be rejected at the database level.

---

## 10. Security Rules (read before writing any code)

See [ai-instructions.md](./ai-instructions.md) for the full security and code quality ruleset.

Short version:
- Never use `createAdminClient()` in frontend code or API routes accessible without auth
- Never put `SUPABASE_SERVICE_ROLE_KEY` in any `NEXT_PUBLIC_*` variable
- Never skip RLS — every new table needs RLS enabled + policies before shipping
- Never trust user input — validate with Zod at every API boundary
- Never store secrets in code — use environment variables

---

## Getting Help

- Slack: `#zoikosocial-dev`
- Product reference: [`docs/zoikosocial_master_reference.md`](./docs/zoikosocial_master_reference.md)
- AI instructions: [`ai-instructions.md`](./ai-instructions.md)
