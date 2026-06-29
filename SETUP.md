# ZoikoSocial — Project Setup Guide

## Prerequisites
- Node.js >= 20
- npm >= 10
- A [Supabase](https://supabase.com) account (free tier works)
- A [Vercel](https://vercel.com) account (free Hobby plan)
- A [GitHub](https://github.com) account

---

## 1. Clone and Install

```bash
git clone https://github.com/YOUR_ORG/zoikosocial.git
cd zoikosocial
npm install
```

---

## 2. Supabase Setup

1. Go to [supabase.com](https://supabase.com) → New Project
2. Name it `zoikosocial`, choose a region close to your users
3. Copy your credentials from **Settings → API**:
   - Project URL → `NEXT_PUBLIC_SUPABASE_URL`
   - anon/public key → `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - service_role key → `SUPABASE_SERVICE_ROLE_KEY` (**NEVER expose this publicly**)

4. Run migrations (in Supabase SQL editor or via CLI):
```bash
# Install Supabase CLI
npm install -g supabase

# Link to your project
supabase link --project-ref YOUR_PROJECT_REF

# Run migrations
supabase db push
```

5. In Supabase Dashboard → Authentication → Settings:
   - Set **Site URL** to your production URL
   - Add `http://localhost:3000` to **Redirect URLs**

---

## 3. Environment Variables

```bash
cp .env.example .env.local
# Then fill in your values in .env.local
```

**Never commit `.env.local`** — it's in `.gitignore`.

---

## 4. Run Locally

```bash
npm run dev
# App runs at http://localhost:3000
```

---

## 5. Vercel + GitHub Actions Setup

This project uses **GitHub Actions to deploy to Vercel**, not Vercel's Git integration.
This prevents multiple team members from triggering concurrent Vercel builds on the free plan.

### One-time setup (project owner only):

**Step 1 — Disconnect Vercel Git integration:**
```
Vercel Dashboard → Project → Settings → Git → Disconnect repository
```

**Step 2 — Link project locally:**
```bash
npm install -g vercel
vercel login
vercel link   # Run in project root, follow the prompts
# This creates .vercel/project.json — DO NOT commit this file
```

**Step 3 — Get your IDs:**
```bash
cat .vercel/project.json
# Note the "orgId" and "projectId" values
```

**Step 4 — Create Vercel token:**
```
vercel.com → Account Settings → Tokens → Create Token
```

**Step 5 — Add GitHub Secrets:**
```
GitHub → Repo → Settings → Secrets and variables → Actions → New secret
```

Add these secrets:
| Secret name | Value |
|---|---|
| `VERCEL_TOKEN` | Token from Step 4 |
| `VERCEL_ORG_ID` | `orgId` from .vercel/project.json |
| `VERCEL_PROJECT_ID` | `projectId` from .vercel/project.json |
| `NEXT_PUBLIC_SUPABASE_URL` | Your Supabase URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Your Supabase anon key |

### How deployments work after setup:

| Event | What happens |
|---|---|
| Push to **any branch** | CI runs: lint + type check + build + security audit |
| Open / update a **PR** | CI runs, then preview deploy → URL posted as PR comment |
| Merge to **main** | CI runs, then production deploy to Vercel |

Team members push branches freely — only GitHub Actions deploys to Vercel.

---

## 6. Security Checklist

- [ ] RLS enabled on all Supabase tables (`supabase/migrations/001_rls_setup.sql`)
- [ ] `.env.local` is in `.gitignore` and never committed
- [ ] `SUPABASE_SERVICE_ROLE_KEY` is only used server-side (never in client code)
- [ ] CSP headers are set in `next.config.ts`
- [ ] Strict TypeScript mode is enabled (`tsconfig.json`)
- [ ] ESLint security rules are active (`.eslintrc.json`)
- [ ] GitHub Actions runs `npm audit` on every push
- [ ] TruffleHog scans for secrets on every push
- [ ] Vercel Git integration is disconnected (GitHub Actions controls all deploys)

---

## 7. Project Structure

```
zoikosocial/
├── src/
│   ├── app/                  # Next.js App Router pages
│   │   ├── (auth)/           # Login, register, forgot password
│   │   ├── (app)/            # Protected app pages (feed, communities, etc.)
│   │   └── layout.tsx        # Root layout
│   ├── components/           # Reusable UI components
│   ├── lib/
│   │   ├── supabase/         # Supabase client (browser + server + middleware)
│   │   └── utils/            # Shared utilities
│   ├── types/
│   │   └── database.ts       # Generated Supabase type definitions
│   └── middleware.ts          # Auth protection + session refresh
├── supabase/
│   └── migrations/           # SQL migrations with RLS policies
├── .github/
│   └── workflows/
│       ├── ci.yml            # Lint, type check, build, audit (all branches)
│       └── vercel-deploy.yml # Vercel deployment (main = prod, PR = preview)
├── .env.example              # Environment variable template
├── next.config.ts            # Security headers, CSP, image domains
├── tailwind.config.ts        # Brand color tokens
├── tsconfig.json             # Strict TypeScript config
└── .eslintrc.json            # ESLint + security rules
```

---

## 8. Generating Supabase Types

After updating your database schema, regenerate the TypeScript types:

```bash
supabase gen types typescript --project-id YOUR_PROJECT_REF > src/types/database.ts
```

Commit the updated `database.ts` so everyone on the team has type safety.
