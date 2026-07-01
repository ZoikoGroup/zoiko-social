# ZoikoSocial — Tech Stack

**Version:** 1.0 · June 2026  
**Classification:** Internal Engineering Reference  
**Platform:** Web only (no mobile app)

---

## Monorepo Structure

```
zoiko-social/
├── apps/
│   ├── web/          Next.js 16 — main social platform
│   ├── landing/      Next.js 16 — marketing site
│   └── api/          NestJS 11  — core REST + WebSocket API
├── packages/
│   ├── ui/           Shared React component library
│   └── config/       Shared ESLint, TypeScript, Tailwind config
└── services/
    └── safety/       Python/FastAPI — AI Safety Engine (Phase 6)
```

**Workspace tooling:** pnpm workspaces + Turborepo  
**Node version:** 22 LTS  
**Package manager:** pnpm 9

---

## Frontend

| Layer | Choice | Version |
|---|---|---|
| Framework | Next.js (App Router) | 16.x |
| UI library | React | 19.x |
| Language | TypeScript | 5.x |
| Styling | Tailwind CSS | 4.x |
| Component library | Internal `@zoiko/ui` | — |
| Bundler | Turbopack | (via Next.js) |
| State management | React Server Components + Context | — |
| Forms | React Hook Form + Zod | — |
| Auth client | Supabase Auth (early) → custom session | — |

---

## Backend — Core API

| Layer | Choice | Reason |
|---|---|---|
| Runtime | Node.js 22 | LTS, matches monorepo |
| Framework | **NestJS 11** | Modular architecture, DI, decorators — aligned with 15-domain design |
| Language | TypeScript 5 | Shared types with frontend in same monorepo |
| API style | REST (JSON) | Clean contracts, documented per endpoint |
| Validation | class-validator + class-transformer + Zod | DTOs on all inputs |
| Auth | JWT + refresh tokens, Passport.js | Short-lived access, long-lived refresh, device-aware |
| RBAC | Custom NestJS Guards + Role/Permission tables | Member → Moderator → Admin; per-resource ABAC for sensitive domains |
| WebSockets | NestJS `@WebSocketGateway` + Socket.io | Messaging, presence, typing indicators, notifications |
| Event bus (internal) | NestJS EventEmitter2 / CQRS module | Domain events within the modular monolith |
| Workers / queues | `@nestjs/microservices` RabbitMQ transport | Async jobs: media processing, safety checks, email |

---

## Backend — Safety Engine (separate service)

| Layer | Choice | Reason |
|---|---|---|
| Language | Python 3.12 | Superior AI/ML ecosystem |
| Framework | FastAPI | High-performance async, auto-generated OpenAPI docs |
| Integration | Called by NestJS via HTTP or RabbitMQ queue | Decoupled; can scale independently |
| Build phase | Phase 6 | Built after core platform is stable |

---

## Data Layer

| Store | Choice | Used For |
|---|---|---|
| Primary database | **PostgreSQL 16** | All 15 domains — users, posts, communities, events, ads, moderation, audit |
| Cache | **Redis 7** | Sessions, feed fanout cache, presence state, rate limiting, idempotency keys |
| Search | **OpenSearch** | Full-text search — people, animals, communities, news, events, marketplace |
| Object storage | **S3-compatible** (AWS S3 or R2) | Images, videos, story/reel media, call recordings, moderation evidence |
| Time-series / analytics | PostgreSQL (early) → ClickHouse (Phase 6) | SLO metrics, content analytics, transparency reporting |

---

## Infrastructure & Messaging

| Component | Choice | Notes |
|---|---|---|
| Message queue | **RabbitMQ** | Start here — simpler ops for early team |
| Queue (at scale) | Kafka / Redpanda | Migrate when throughput demands it |
| Media processing | FFmpeg workers | Transcoding, thumbnails, EXIF stripping, safety previews |
| WebRTC / calls | Managed SFU (Livekit or Agora, early) → self-hosted | 1:1 calls, group calls, live rooms; self-host once traffic justifies it |
| CDN | Cloudflare | Static assets, media delivery, DDoS protection |

---

## Auth & Security

| Layer | Choice |
|---|---|
| Auth (early scaffold) | Supabase Auth |
| Auth (production) | Custom NestJS auth module — JWT + refresh tokens, device registry |
| Password hashing | bcrypt / Argon2 |
| Secret management | Environment variables via Vault or cloud secret manager |
| Transport security | TLS everywhere, HSTS |
| Media URLs | Short-lived signed S3 URLs (never public permanent links) |
| RLS | PostgreSQL Row-Level Security on all tables |
| OWASP | Helmet.js, CSRF protection, rate limiting, input sanitisation on all surfaces |

---

## Observability

| Tool | Purpose |
|---|---|
| OpenTelemetry | Distributed tracing across all services |
| Prometheus | Metrics collection |
| Grafana | Dashboards, SLO tracking, alerting |
| Sentry | Error tracking — web, landing, API |
| Structured logging | JSON logs → centralized log aggregator (Loki or CloudWatch) |

---

## CI / CD & Deployment

| Component | Choice |
|---|---|
| CI/CD | GitHub Actions |
| Frontend deploy | **Vercel** — `apps/web` and `apps/landing` |
| API deploy | **Render** — `apps/api` (NestJS) |
| Container | Docker (Dockerfile.api at repo root) |
| Branch strategy | `main` (production) + feature branches via PRs |
| Quality gates | Lint → Type-check → Build → Unit tests → Security audit → Deploy |
| Secret scanning | TruffleHog (on every push and PR) |
| Dependency audit | `pnpm audit --audit-level=high` |

---

## Language / Type Sharing

Because the entire stack (except the Safety Engine) is TypeScript in one monorepo:

- API response types defined once in `packages/config` or `apps/api` and imported directly into `apps/web`
- Zod schemas shared between frontend validation and backend DTOs
- Single `tsconfig` base with per-app extensions
- Single ESLint config via `@zoiko/config`

---

## Why This Stack

| Decision | Reason |
|---|---|
| NestJS over Django | Full TypeScript monorepo — shared types, one toolchain, no language context-switch |
| Python only for Safety Engine | Best AI/ML ecosystem; isolated as a separate service |
| PostgreSQL over NoSQL | Complex relational data (social graph, moderation, audit) needs joins, constraints and transactions |
| RabbitMQ before Kafka | Simpler to operate for an early-stage team; Kafka added when message volume demands it |
| Vercel + Render over self-hosted | Managed infra lets the team focus on product; migrate to Kubernetes when team maturity justifies it |
| pnpm + Turborepo | Fast installs, correct hoisting for workspaces, incremental builds, shared remote cache |
| No mobile app | Web-first; build the product correctly before expanding platforms |

---

## Scalability — 50,000+ Members

This stack is capable well beyond 50,000 members. It's the same foundation Instagram, LinkedIn, and major SaaS platforms are built on.

### At 50,000 Members — Expected Load

| Metric | Estimate |
|---|---|
| Peak concurrent users | ~3,000–5,000 (5–10%) |
| API requests/sec at peak | ~500–2,000 |
| Active WebSocket connections | ~3,000–5,000 |
| Database rows (all tables) | ~50–200 million |
| Media storage | ~5–20 TB |

### Layer Capacity

| Layer | Verdict | Notes |
|---|---|---|
| PostgreSQL | No concern | Instagram ran a single Postgres instance for their first million users. 50k is trivial with proper indexes. |
| NestJS / Node.js | No concern | Single instance handles 10,000+ req/sec. Horizontal scaling is trivial. |
| WebSockets | No concern | Node.js handles 50,000+ simultaneous connections per instance. |
| Redis | No concern | 1M+ operations/sec on a single node. |
| RabbitMQ | No concern | Hundreds of thousands of messages/sec. Fine at this scale. |
| Vercel + Render | No concern | Neither is a bottleneck at 50k. Render scales horizontally on paid plans. |

### What Will Matter Before 50k (implementation, not stack)

1. **Indexes on every queried column** — `posts(author_id)`, `follows(follower_id)`, `messages(conversation_id, created_at)`, `audit_events(actor_id, created_at)`. Missing indexes become full table scans.
2. **Feed caching in Redis** — pre-compute ranked feed results per user; never hit the DB raw on every feed request.
3. **Async safety checks via RabbitMQ** — queue safety checks as jobs, respond immediately with `pending`, update when check completes. Do not block the request.
4. **CDN + signed S3 URLs for all media** — never serve media files from the API server. Cloudflare CDN for delivery.
5. **PgBouncer** — add connection pooling between NestJS and PostgreSQL before reaching 10k active users.

### Scaling Path

| Members | Action |
|---|---|
| 0 – 10k | Single instances of everything. Focus on correctness and indexes. |
| 10k – 50k | Add PgBouncer. Cache feeds in Redis. CDN for all media. |
| 50k – 200k | Horizontal scale NestJS (2–4 instances). Read replicas on PostgreSQL. |
| 200k – 1M | Migrate RabbitMQ → Kafka. OpenSearch cluster (3 nodes). Dedicated Redis cluster. |
| 1M+ | Extract high-traffic domains (messaging, feed) into separate services. ClickHouse for analytics. |

The infrastructure will not be the bottleneck. Ship the product.
