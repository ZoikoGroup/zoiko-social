# Video Stories + R2 — Deployment Setup

The code is fully scaffolded. This is the operational checklist to turn on real
video stories (ffmpeg) and optionally Cloudflare R2. **Do these in your
Cloudflare + Render dashboards** — no code changes needed.

## TL;DR
- **Video needs ffmpeg** → deploy a Render **Background Worker** from
  `Dockerfile.worker` with `ENABLE_WORKERS=true`. That's the only hard
  requirement; renditions upload through the storage adapter (Supabase by
  default).
- **R2 is optional** (CDN/perf upgrade). Set the 5 `R2_*` env vars and storage
  auto-switches from Supabase to R2 — no redeploy logic needed.

---

## 1. ffmpeg worker pod (required for video)

The transcode pipeline (`TranscodeService` / `StoryMediaService`) degrades to
"raw upload" when ffmpeg is absent. To enable real HLS/segmentation:

1. In Render, create a new **Background Worker** service from this repo.
2. **Dockerfile path:** `Dockerfile.worker` (already includes `apk add ffmpeg`).
3. **Environment** — copy the same vars as the API service, and set:
   - `ENABLE_WORKERS=true`  ← makes this process run the BullMQ consumers
   - `DATABASE_URL` → the pooler URL (`...pooler.supabase.com:6543/...?pgbouncer=true&connection_limit=10`)
   - `REDIS_URL` → the Upstash URL (same as API)
   - `SUPABASE_URL`, `SUPABASE_SERVICE_ROLE_KEY`, `SUPABASE_ANON_KEY`
   - (R2 vars below, if using R2)
4. Keep the **API web service** with `ENABLE_WORKERS` unset/`false` so only the
   worker processes jobs (avoids double-processing).

That alone makes video stories work (renditions land in the Supabase
`post-media` bucket via the storage adapter).

---

## 2. Cloudflare R2 (optional — CDN delivery)

When all five `R2_*` vars are set, `ConfigService.r2Enabled` is true and the
`MEDIA_STORAGE` factory switches from Supabase to `R2Storage` automatically.

### Create the bucket + credentials (Cloudflare dashboard)
1. **R2 → Create bucket** (e.g. `zoiko-media`).
2. Enable public access: attach a **custom domain** or the R2.dev public URL —
   this becomes `R2_PUBLIC_URL` (e.g. `https://cdn.zoikosocial.com`).
3. **R2 → Manage API Tokens → Create API token** (Object Read & Write). Note the
   **Access Key ID** and **Secret Access Key**.
4. Note your Cloudflare **Account ID** (R2 overview page).
5. **CORS** (bucket → Settings → CORS) so the browser can direct-upload:
   ```json
   [{ "AllowedOrigins": ["https://your-web-domain.com", "http://localhost:3000"],
      "AllowedMethods": ["PUT", "GET"],
      "AllowedHeaders": ["*"], "MaxAgeSeconds": 3600 }]
   ```

### Env vars (set on BOTH the API service and the worker)
```
R2_ACCOUNT_ID=<cloudflare account id>
R2_ACCESS_KEY_ID=<r2 access key id>
R2_SECRET_ACCESS_KEY=<r2 secret>
R2_BUCKET=zoiko-media
R2_PUBLIC_URL=https://cdn.zoikosocial.com
```
Missing any one → storage stays on Supabase (safe fallback).

> Note: the web **composer** currently uploads photos/videos to the Supabase
> `post-media` bucket directly. To route client uploads to R2, switch the
> composer to request a signed URL from `GET /stories/upload-url` and `PUT` the
> file there (the endpoint already returns an R2 presigned URL when R2 is on).

---

## 3. Music audio (separate content task)
The catalog is seeded but `audio_url`s are placeholders. Upload real
royalty-free audio to R2/Supabase and update `music_tracks.audio_url` /
`preview_url` so playback works.

---

## 4. Database migrations (do before/at deploy)
Apply against the production DB (direct connection for DDL):
- `010_communities.sql`
- `011_stories.sql`
- `012_post_kinds.sql`

All are idempotent (guarded policies / `IF NOT EXISTS`), safe to re-run.

---

## Rollback / safety
- No R2 vars → Supabase storage (current behavior). Zero risk to enable the code.
- No worker / no ffmpeg → video stories publish with the raw file (degraded),
  photo/text unaffected.
