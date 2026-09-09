# ZoikoSocial — Tester Guide

> **Read sections 1–3 before you touch the app.** Section 2 lists features that
> do not exist yet — filing bugs against them wastes your time and ours.
>
> Build under test: `vigneshzoiko/updates` · API 312 HTTP routes + 18 WebSocket
> events · Web 60 pages · Last verified 2026-08-05

---

## 1. Setup

### 1.1 Environments

| App | Local URL | What it is |
|---|---|---|
| Web app | http://localhost:3000 | The product. Almost all testing happens here. |
| Landing page | http://localhost:3001 | Marketing page only. |
| API | http://localhost:4000/api/v1 | Backend. Used for API-level checks in §5. |

### 1.2 Starting the app

```bash
pnpm install
pnpm dev
```

That starts all three apps together, with each line of output prefixed by which
app produced it. To run just one:

```bash
pnpm dev:api      # API on :4000
pnpm dev:web      # Web on :3000
pnpm dev:landing  # Landing on :3001
```

The API is ready when its log shows:

```
[Bootstrap] ZoikoSocial API running on http://localhost:4000/api/v1
[RedisService] Redis connected
```

One message at API startup is **expected and harmless**:

- `[R2Service] R2 not configured — R2 storage inactive.` Nothing uses R2. Media
  uploads go to Supabase Storage and **do** work.

One is real:

- `[StripeService] Stripe credentials not configured` — Shop checkout is
  genuinely unavailable (see §2).

### 1.3 Getting a test account

Accounts are **auto-confirmed** — there is no confirmation email to wait for.
Sign up at http://localhost:3000/signup with any email address you like
(`tester1+shop@example.com` works fine).

Requirements:
- Email must be a valid format
- Password minimum **8 characters**

**You need at least three accounts** to test properly, because most bugs live in
the relationships between users:

| Account | Purpose |
|---|---|
| **A** — your main account | Everyday testing |
| **B** — the other party | Follows, DMs, requests, blocks, reports |
| **C** — private account | Set to private in Settings. Tests privacy gating. |

Keep a fourth account promoted to **professional** (§4.4) for provider, booking
and analytics tests. Admin-only surfaces (§4.21) need a role you cannot
self-assign — ask the project owner to grant it.

### 1.4 What to test on

Test **both** widths — the app has a separate mobile tab bar and a desktop
sidebar, and they do not always agree:

- **Desktop** — 1280px or wider, Chrome
- **Mobile** — 390 × 844 (iPhone-class), via DevTools device emulation

Also check **dark and light mode**. The app uses `next-themes`; the toggle is in
Settings. Contrast and icon-visibility bugs cluster here.

---

## 2. Known gaps — do NOT file bugs for these

These were verified absent on 2026-08-05. They are unbuilt or deliberately off,
not broken.

### 2.1 Features that do not exist at all

| Feature | Status |
|---|---|
| **Stories** | Removed from the codebase. No routes, no UI, no story tray, no highlights, no archive, no story music. If you see any story affordance, **that is a bug** — report it. |
| **Reels** | Never built. `/reels` returns 404. |
| **Live / livestreaming** | Never built. `/live` returns 404. 1:1 calls do exist (§4.9). |
| **Advertising** | Never built. No ad surfaces anywhere. |
| **Premium / subscriptions / billing** | Never built. `/premium` and `/pricing` return 404. There is no way to subscribe to anything. |
| **Appeals against moderation decisions** | Not built. Reporting works; appealing an outcome does not. |
| **Email notifications** | Not built. Notifications are **in-app only**. |
| **Push notifications** | Not built. |

### 2.2 Known-broken things already logged

Do not re-file these; do tell us if you find *more* of the same kind.

| Issue | Detail |
|---|---|
| Shop checkout disabled | Stripe is not configured. Creating a listing and enquiring both work; paying does not. |
| Apple sign-in absent | Deliberate. The button is hidden and `/auth/apple` returns `OAUTH_PROVIDER_DISABLED`. Not a bug. |
| Video has no HLS/transcoding | Uploaded video is served as the raw file. |

### 2.3 Search behaves differently from the feed

Search and safety advisories work **without signing in**. The feed does not —
`/feed/explore` returns 401 to a logged-out visitor. That asymmetry is
intentional. Do not file it.

---

## 3. How to report a bug

### 3.1 Severity

| Level | Means | Examples |
|---|---|---|
| **S1 — Blocker** | Core journey impossible; data loss; security hole | Cannot sign in; someone sees another user's private data; posts vanish |
| **S2 — Major** | Feature unusable, no workaround | Cannot send a DM; community join button does nothing |
| **S3 — Minor** | Feature works, behaves wrongly | Wrong count; stale badge; bad empty state |
| **S4 — Polish** | Cosmetic | Misalignment; truncated label; wrong shade in dark mode |

Anything touching **privacy, blocking, muting, private accounts, or profanity
filtering is at least S2** even if it looks cosmetic. Those are product
non-negotiables.

### 3.2 Template

```
ID:        <MODULE>-<case number>   e.g. NET-07
Title:     One line, what's wrong — not what you expected
Severity:  S1 / S2 / S3 / S4
Accounts:  A (main), B (other) — include which account did what
Width:     Desktop 1280 / Mobile 390
Theme:     Light / Dark
RequestID: <paste error.requestId if the response was a 500 — see below>

Steps:
1.
2.
3.

Expected:
Actual:

Evidence:
- Screenshot / screen recording
- Browser console errors (F12 → Console)
- Failing network call (F12 → Network → click it → Response tab)
- API log line if you have the terminal
```

**Always include the console and the failing network response.** A screenshot
alone usually is not enough to diagnose.

### 3.2.1 If you see a server error, grab the Request ID

When the API returns a **500**, the response body now carries a correlation id:

```json
{"success":false,"error":{"code":"INTERNAL_ERROR","message":"Internal server error","requestId":"req-2417"}}
```

Copy that `requestId` into your report. It ties your bug directly to the stack
trace in the API log, which otherwise takes far longer to find. Get it from
**F12 → Network → the red request → Response**.

Client errors (400, 401, 403, 404) deliberately have no `requestId` — those are
the API working as designed, and nothing needs correlating.

### 3.3 Before you file

1. Hard-refresh (Ctrl+Shift+R) — the app caches GETs client-side.
2. Retry once. Note whether it reproduces.
3. Check §2. Is it a known gap?
4. Check whether it happens for a second account. "Only my account" is
   important information.

---

## 4. Module test plans

Each module lists **where** to find it, **preconditions**, and numbered cases.
Case IDs are stable — use them in bug reports.

Expected results are derived from the API contracts and route definitions in
this build. If a case's expectation seems wrong for the product, say so in the
report rather than silently skipping it.

### 4.0 Checks that apply to EVERY module

Run these against every screen you touch. They catch the most bugs.

| ID | Check | Expected |
|---|---|---|
| GEN-01 | **Profanity** — put a slur or profanity in any free-text field (post, comment, DM, username, community name, event title, pet name, listing) | Rejected **before** publishing, with a clear message. Content must never publish and then disappear. |
| GEN-02 | **Logged out** — open the page signed out | Redirects to `/login?next=<path>`, and after signing in you land back on the page you asked for. |
| GEN-03 | **Empty state** — view with no data | A helpful empty state, never a blank panel, spinner-forever, or raw error. |
| GEN-04 | **Loading** — throttle to Slow 3G (DevTools → Network) | Skeletons or spinners, no layout jump when content lands. |
| GEN-05 | **Long input** — paste 5,000 characters into any text field | Either rejected with a limit message or handled without breaking layout. |
| GEN-06 | **Refresh mid-flow** — reload the page halfway through a form | No crash. Either state is preserved or you are cleanly returned to the start. |
| GEN-07 | **Back button** — after every navigation and modal | Goes where a user would expect. Modals close rather than leaving the page. |
| GEN-08 | **Double-submit** — click any submit button twice fast | Exactly one record created. No duplicates. |
| GEN-09 | **Mobile 390px** | Nothing clipped, nothing horizontally scrolling, tap targets reachable. |
| GEN-10 | **Dark mode** | All text readable, all icons visible, no white-on-white or black-on-black. |
| GEN-11 | **Console** | No red errors during normal use. |

---

### 4.1 Auth & Sessions — 11 routes

**Where:** `/login`, `/signup`, `/forgot-password`, `/reset-password`

| ID | Case | Expected |
|---|---|---|
| AUTH-01 | Sign up with valid email + 8-char password | Account created, signed in, no confirmation email required |
| AUTH-02 | Sign up with a 7-character password | Rejected: "Password must be at least 8 characters" |
| AUTH-03 | Sign up with `notanemail` | Rejected: "Valid email is required" |
| AUTH-04 | Sign up with an email that already exists | Rejected with `EMAIL_EXISTS`, worded for humans |
| AUTH-05 | Log in with **email** + password | Success |
| AUTH-06 | Log in with **username** + password | Success — the identifier field accepts email, username *or* phone |
| AUTH-07 | Log in with **phone** + password | Success |
| AUTH-08 | Log in with a wrong password | Rejected. Message must **not** reveal whether the account exists |
| AUTH-09 | "Remember me for 30 days" checked, close browser, reopen | Still signed in |
| AUTH-10 | "Remember me" unchecked | Session ends as designed |
| AUTH-11 | Log out | Returned to `/login`; pressing Back does not restore a working session |
| AUTH-12 | Forgot password → submit email | Confirmation shown. Message must not reveal whether the account exists |
| AUTH-13 | Reset password with a valid link | Password changed; old password no longer works |
| AUTH-14 | Reset password with a used/expired link | Clear error, no crash |
| AUTH-15 | **Continue with Google** | Redirects to Google, returns to `/auth/callback`, lands signed in |
| AUTH-16 | **Continue with Facebook** | Same. If the provider is not enabled on the Supabase project you will get a clear error — note which |
| AUTH-17 | **No Apple button anywhere** | Correct as of this build. If you see one, that is a bug |
| AUTH-18 | Toggle password visibility (eye icon) | Reveals and hides |
| AUTH-19 | Language selector top-right of `/login` | Note actual behaviour — verify whether it changes anything |
| AUTH-20 | Footer links Terms of Service / Privacy Policy | Both open real pages, each marked as a draft pending legal review |

**Session edge cases**

| ID | Case | Expected |
|---|---|---|
| AUTH-21 | Sign in on two browsers at once | Both work independently |
| AUTH-22 | Log out in browser 1, act in browser 2 | Browser 2 unaffected |
| AUTH-23 | Sign in, leave idle 30+ min, act | Either still works, or a clean re-auth prompt — never a silent failure |

---

### 4.2 Onboarding & Username

**Where:** `/onboarding` — reached automatically after OAuth signup

**Preconditions:** a brand-new account created via Google or Facebook.

| ID | Case | Expected |
|---|---|---|
| ONB-01 | Sign up with Google for the first time | Sent to onboarding, asked who you are — not dropped into the feed |
| ONB-02 | Required fields | First name (1–40 chars) and username (3–30 chars) required. Last name, bio, avatar optional |
| ONB-03 | Type a username already taken | Live "unavailable" feedback |
| ONB-04 | Type a reserved username — try `login`, `admin`, `settings`, `terms`, `privacy`, `onboarding` | Rejected as reserved |
| ONB-05 | Username with spaces or symbols (`my name`, `a@b`) | Rejected as invalid |
| ONB-06 | 2-character username | Rejected (min 3) |
| ONB-07 | Username suggestions offered | Suggestions appear and are all actually available |
| ONB-08 | Bio over 500 characters | Rejected or truncated with a message |
| ONB-09 | Upload an avatar during onboarding | Uploads to Supabase Storage and displays |
| ONB-10 | Complete onboarding | Land in the app with your name and username correct on `/profile` |
| ONB-11 | Refresh mid-onboarding | Returns to onboarding, not a broken half-state |
| ONB-12 | Sign out mid-onboarding, sign back in | Returns to onboarding rather than an incomplete profile |
| ONB-13 | Try to reach `/` before completing onboarding | Should not be able to bypass it |
| ONB-14 | Profanity in first name, last name or username | Rejected (GEN-01) |

---

### 4.3 Profile & Settings — 26 routes

**Where:** `/profile`, `/profile/[username]`, `/settings`

| ID | Case | Expected |
|---|---|---|
| PROF-01 | View your own profile | Name, username, bio, avatar, counts all correct |
| PROF-02 | Edit profile — change name, bio, avatar | Saves, visible immediately, survives refresh |
| PROF-03 | Upload and crop an avatar | Cropper works; result is what you cropped |
| PROF-03a | Upload a banner, then look at the **sidebar profile card** on the home page | The banner shows there too, not just on the profile page. A profile with no banner falls back to the gradient |
| PROF-03b | Check the status dot on that sidebar card | Reflects real presence — it must not be green while you are signed out or disconnected |
| PROF-04 | View another user's profile by username | Their public info, plus a Follow button |
| PROF-05 | View a **private** account (C) you don't follow | Limited view; posts hidden |
| PROF-06 | View a nonexistent username | Clean not-found page, not a crash |
| PROF-07 | Profile tabs (posts / pets / communities) | Each loads its own content |
| PROF-08 | **Communities on a profile** | Shows only **public** communities. A private community you share must not leak |
| PROF-09 | Followers / following counts | Match the actual lists; click opens the list modal |
| PROF-10 | Settings → privacy: switch account to private | Takes effect — new follows become requests |
| PROF-11 | Settings → every toggle | Each persists across refresh |
| PROF-12 | Settings → theme light/dark | Applies everywhere, persists |
| PROF-13 | **Deactivate account** | Account hidden; your content disappears for others |
| PROF-14 | Sign back in after deactivating | Account restored automatically, content returns |
| PROF-15 | **Delete account** | Confirmation required. Use a throwaway account — this is destructive |
| PROF-16 | Relationship indicator on another profile | Correctly reflects following / requested / blocked |

---

### 4.4 Professional Profile & Verification

**Where:** `/settings` → switch to professional; `/admin/verification` for review

| ID | Case | Expected |
|---|---|---|
| PRO-01 | Switch to a professional account | Category picker offered from the real category list |
| PRO-02 | Fill out the professional profile | Saves and shows on your public profile |
| PRO-03 | Edit, then delete the professional profile | Reverts to a normal account cleanly |
| PRO-04 | Submit a verification request | Enters pending state; status visible to you |
| PRO-05 | Upload verification documents | Uploads accepted; you can see what you submitted |
| PRO-06 | Try to read another user's verification document URL | **Must be denied.** S1 if it succeeds |
| PRO-07 | Submit a second request while one is pending | Blocked or clearly explained — no duplicate queue entries |
| PRO-08 | *(admin)* View the verification queue | Pending requests listed |
| PRO-09 | *(admin)* Approve a request | Badge appears on that user's profile |
| PRO-10 | *(admin)* Reject a request | User sees rejected status and can resubmit |
| PRO-11 | Non-admin opens `/admin/verification` | Denied — must not render the queue |

---

### 4.5 Pets & Health Passport — 14 routes + public passport

**Where:** `/profile` (pets tab), `/pet-diary`, `/health-passport`, `/pet-passport/[token]`

| ID | Case | Expected |
|---|---|---|
| PET-01 | Add a pet with all fields | Created, appears on your profile |
| PET-02 | Add a pet with only required fields | Works |
| PET-03 | Upload a pet photo | Uploads and displays |
| PET-04 | Edit, then delete a pet | Both work; delete asks for confirmation |
| PET-05 | Add a diary entry | Appears newest-first |
| PET-06 | Edit and delete a diary entry | Both work |
| PET-07 | Add a health record (vaccination, vet visit, medication, allergy, weight) | Each type saves |
| PET-08 | Weight chart | Renders from weight entries and matches them |
| PET-09 | Edit and delete a health record | Both work |
| PET-10 | **Share vet card** — generate QR + link | Both produced |
| PET-11 | Open the share link in a **private window** (logged out) | Read-only card for **that one pet only** |
| PET-12 | From that link, try to reach the owner's other pets or profile | **Must be impossible.** S1 if it leaks |
| PET-13 | Revoke sharing, then reopen the old link | Old link dead immediately |
| PET-14 | Open `/pet-passport/<random-token>` | Clean not-found, no information leak |
| PET-15 | Tag a pet in a post | Post appears on the pet's page too |
| PET-16 | View another user's pets | Only what their privacy allows |

---

### 4.6 Posts & Feed — 16 routes

**Where:** `/` (home feed), `/explore`, `/p/[postId]`

| ID | Case | Expected |
|---|---|---|
| FEED-01 | Text-only post | Publishes, appears at top of your feed |
| FEED-02 | Post with photos | Uploads to Supabase Storage and displays |
| FEED-03 | Post with video | Uploads and plays (raw file — no HLS, per §2.2) |
| FEED-04 | Post with hashtags | Tags become links to the tag page |
| FEED-05 | Post tagging a pet | Shows on the pet's page too |
| FEED-06 | Post visibility options | Each level behaves as labelled — verify with account B |
| FEED-07 | **Profanity in a caption** | Rejected before publishing (GEN-01) |
| FEED-08 | Edit your post | Updates everywhere |
| FEED-09 | Delete your post | Gone from feed, profile and direct link |
| FEED-10 | Try to edit or delete **B's** post | Not offered; blocked if forced via API |
| FEED-11 | Like / unlike | Count changes, state survives refresh, author notified |
| FEED-12 | Save / unsave | Appears in and disappears from saved list |
| FEED-13 | Share to followers, and send via DM | Both paths work |
| FEED-14 | Home feed content | Posts from people, pets and communities you follow |
| FEED-15 | Explore | Public posts from accounts you do **not** follow |
| FEED-16 | Feed ranking | No post repeats on scroll; ordering feels stable across refresh |
| FEED-17 | Infinite scroll | Loads more; no duplicates; no jump |
| FEED-18 | Feed after blocking B | B's posts vanish from your feed |
| FEED-19 | Feed after muting B | B's posts vanish but B stays followed |
| FEED-20 | Open a post permalink `/p/<id>` while logged out | Behaves per its visibility — private content must not render |
| FEED-21 | Post from a deactivated account | Not visible |
| FEED-22 | Scroll the home feed to the very bottom | "You're all caught up" appears with a Refresh button — the list must not simply stop with nothing |
| FEED-23 | Press that Refresh | Newest content loads and the page returns to the top; posts already on screen stay put while it loads (no blank page, no skeleton) |
| FEED-24 | Keep scrolling past the last post from people you follow | Feed continues into news articles rather than ending — up to 30 cards per page |
| FEED-25 | Scroll several pages of news | No article appears twice, and none is silently skipped |
| FEED-26 | Look at any news card's cover image | Sharp, not blurry or upscaled. An article with no usable image shows no image rather than a smeared one |
| FEED-27 | Open a news article from the feed | External articles open the publisher's site; the in-app page offers "Read the full article at …" instead of an empty body |
| FEED-28 | Like, save, comment on and share a news card | All behave as on a normal post; sharing an external article shares the **publisher's** link |

---

### 4.7 Comments — 5 routes

**Where:** on any post

| ID | Case | Expected |
|---|---|---|
| COM-01 | Comment on a post | Appears immediately; author notified |
| COM-02 | Reply to a comment | Nests correctly |
| COM-03 | Like / unlike a comment | Count updates |
| COM-04 | Edit and delete your comment | Both work |
| COM-05 | Try to edit or delete B's comment | Blocked |
| COM-06 | **Pin a comment** as post author | Stays at the top of the thread |
| COM-07 | Pin as a community moderator on a community post | Allowed |
| COM-08 | Pin as an unrelated user | Denied |
| COM-09 | Unpin | Returns to normal position |
| COM-10 | Profanity in a comment | Rejected (GEN-01) |
| COM-11 | Comment on a post from someone who blocked you | Blocked |

---

### 4.8 Network — 19 routes

**Where:** `/network`

| ID | Case | Expected |
|---|---|---|
| NET-01 | Follow a **public** account | Immediate; counts update on both sides; they are notified |
| NET-02 | Unfollow | Counts update |
| NET-03 | Follow a **private** account (C) | Becomes a pending **request**, not a follow |
| NET-04 | C accepts the request | You now follow; C's posts appear in your feed |
| NET-05 | C rejects the request | No follow; you can request again |
| NET-06 | Cancel your own pending request | Removed from C's queue |
| NET-07 | Remove a follower | They no longer follow you |
| NET-08 | Followers / following lists | Complete and accurate; paginate correctly |
| NET-09 | Mutual followers / mutual following | Genuinely mutual only |
| NET-10 | Search within your network | Finds the right people |
| NET-11 | Suggestions | Reasonable; excludes people you already follow, and anyone blocked |
| NET-12 | **Block B** | B disappears from your feed, search and suggestions |
| NET-13 | As B, view your profile after being blocked | Cannot see content; cannot follow or DM |
| NET-14 | Unblock | Access restored; note whether the old follow returns |
| NET-15 | Blocked list | Accurate; unblock works from here |
| NET-16 | **Mute B** | B's posts leave your feed but B remains followed and can still DM |
| NET-17 | Muted list | Accurate; unmute works |
| NET-18 | Block someone who currently follows you | Follow relationship severed both ways |

---

### 4.9 Messaging & Calls — 46 routes + 18 WebSocket events

The largest module. Budget the most time here.

**Where:** `/messages`

**Preconditions:** two browsers, accounts A and B, both signed in, side by side.

**Direct messages**

| ID | Case | Expected |
|---|---|---|
| MSG-01 | Start a conversation with B | Created; appears in both inboxes |
| MSG-02 | Send text | Arrives on B's screen **without refresh** (live) |
| MSG-03 | Send an emoji, and a very long message | Both render correctly |
| MSG-04 | Send an image / video / file | Uploads to Supabase Storage and renders |
| MSG-05 | Edit a sent message | Updates on both sides |
| MSG-06 | Delete a sent message | Removed on both sides |
| MSG-07 | React to a message | Reaction appears live for both |
| MSG-08 | **Typing indicator** | A typing shows on B's screen, and clears when A stops |
| MSG-09 | **Read receipts** | Marked read when B opens the conversation |
| MSG-10 | **Presence** — B closes the tab | A sees B go offline |
| MSG-11 | Unread badge | Accurate; clears on open; `read-all` clears everything |
| MSG-12 | Change conversation theme | Persists; visible to both |
| MSG-13 | Clear conversation | Empties for you — check whether it also clears for B and report the actual behaviour |
| MSG-14 | Delete conversation | Removed from your inbox |
| MSG-15 | Pin / unpin a conversation | Stays at top |
| MSG-16 | Mute / unmute | No notifications while muted |
| MSG-17 | Archive / unarchive | Moves out of and back into the main list |
| MSG-18 | Search messages, and search users | Both return correct results |
| MSG-19 | Retry a failed send (airplane mode, then back) | Retry works; no duplicate |
| MSG-20 | Profanity in a DM | Rejected (GEN-01) |

**Message requests & privacy**

| ID | Case | Expected |
|---|---|---|
| MSG-21 | DM someone who doesn't follow you | Lands in their **requests**, not their inbox |
| MSG-22 | Accept a request | Moves to inbox; conversation continues |
| MSG-23 | Reject a request | Sender cannot continue |
| MSG-24 | Messaging privacy settings | Each option enforced — verify with B |
| MSG-25 | Block B from within messaging | B cannot message you |
| MSG-26 | Favourite a contact / unfavourite | Appears in favourites |

**Group chat**

| ID | Case | Expected |
|---|---|---|
| MSG-27 | Create a group with B and C | Created; all three see it |
| MSG-28 | Rename group / change details | Visible to all |
| MSG-29 | Invite a member | They get an invite |
| MSG-30 | Accept and reject a group invite | Both work |
| MSG-31 | Remove a member as owner | Removed |
| MSG-32 | Remove a member as a non-owner | Denied |
| MSG-33 | Leave the group | Removed; others see it |
| MSG-34 | Send messages in a group | All members receive live |

**Calls** — 1:1 audio/video via LiveKit

| ID | Case | Expected |
|---|---|---|
| CALL-01 | Start an audio call to B | B gets an incoming invite |
| CALL-02 | B accepts | Two-way audio |
| CALL-03 | Start a video call | Two-way video |
| CALL-04 | B rejects | A is told clearly |
| CALL-05 | A cancels before B answers | Invite disappears on B |
| CALL-06 | Either side ends the call | Both leave cleanly |
| CALL-07 | Deny mic/camera permission in the browser | Clear message, no hang |
| CALL-08 | Call while B is offline | Sensible handling, not an indefinite ring |

**AI assistant** — a system account, not a separate screen

| ID | Case | Expected |
|---|---|---|
| AI-01 | Find the assistant in messaging — account **@zoikosocial.ai** | Present in your conversation list |
| AI-02 | Ask "how do I share my pet's health passport?" | Accurate answer matching the real flow (§4.5) |
| AI-03 | Ask something off-topic or unsafe | Declines appropriately |
| AI-04 | Ask a normal pet-care question | **Not** wrongly refused — over-blocking is a bug worth reporting |
| AI-05 | Ask it to update one of **your** pets | Works |
| AI-06 | Ask it to update **someone else's** pet | **Must refuse.** S1 if it complies |
| AI-07 | Send several messages quickly | Rate limiting is graceful, not a crash |
| AI-08 | Assistant conversation history | It remembers this conversation only — never content from another conversation |

---

### 4.10 Communities — 26 routes

**Where:** `/communities`, `/c/[slug]`

| ID | Case | Expected |
|---|---|---|
| CMTY-01 | Browse communities; filter by category; sort | All work |
| CMTY-02 | Create a **public** community | Created; you are owner |
| CMTY-03 | Create a **private** community | Created; not publicly listed |
| CMTY-04 | Slug availability check | Live feedback; duplicates rejected |
| CMTY-05 | Upload avatar and cover | Both display |
| CMTY-06 | Join a public community | Immediate |
| CMTY-07 | Join a private community | Becomes a **request** |
| CMTY-08 | Leave a community | Removed; member count drops |
| CMTY-09 | Post inside a community | Appears in the community feed |
| CMTY-10 | Members list | Accurate, paginates |
| CMTY-11 | *(owner)* Change a member's role | Applied; their permissions change |
| CMTY-12 | *(owner/mod)* Mute and unmute a member | Muted member cannot post |
| CMTY-13 | *(owner/mod)* Ban and unban | Banned member removed and cannot rejoin |
| CMTY-14 | *(owner/mod)* Remove a member | Removed but can rejoin (unlike ban) |
| CMTY-15 | Approve / reject / block a join request | All three work |
| CMTY-16 | Send and revoke an invite | Both work; invitee sees it in Pending Invitations |
| CMTY-17 | Set community rules | Saved and shown to members |
| CMTY-18 | **Transfer ownership** | New owner has full control; you do not |
| CMTY-19 | Delete a community | Confirmation required; content gone |
| CMTY-20 | Non-member actions on a private community | Denied — cannot read posts or members |
| CMTY-21 | Regular member tries a moderator action | Denied |
| CMTY-22 | Profanity in community name / description / rules | Rejected (GEN-01) |
| CMTY-23 | Private community must not appear on a member's public profile | Cross-check with PROF-08 |

---

### 4.11 Events — 15 routes

**Where:** `/events`, `/events/[id]`

| ID | Case | Expected |
|---|---|---|
| EVT-01 | Browse events | Lists correctly |
| EVT-02 | Create a public event | Created and listed |
| EVT-03 | Create an **invite-only** event | Not publicly listed |
| EVT-04 | Edit and delete your event | Both work |
| EVT-05 | RSVP, then cancel RSVP | Attendee count follows |
| EVT-06 | Attendee list | Accurate |
| EVT-07 | Join an event | Works |
| EVT-08 | Invite users | They receive the invite |
| EVT-09 | **Decline an invite** | Removed from your invites; host can see |
| EVT-10 | Revoke an invite you sent | Invitee loses access |
| EVT-11 | Generate a **share link** | Link opens the event |
| EVT-12 | Open an invite-only event's share link as a non-invitee | Access controlled as designed — report actual behaviour |
| EVT-13 | Event in the past | Sensible handling |
| EVT-14 | Profanity in event title / description | Rejected |

---

### 4.12 Adoption — 10 routes

**Where:** `/adoption`, `/adoption/new`, `/adoption/[id]`

| ID | Case | Expected |
|---|---|---|
| ADO-01 | Browse and filter listings | Works |
| ADO-02 | Create a listing | Created and listed |
| ADO-03 | Edit and delete your listing | Both work |
| ADO-04 | Submit an enquiry as B | Owner receives it |
| ADO-05 | Owner views enquiries | All listed |
| ADO-06 | Update an enquiry's status | Reflected for both parties |
| ADO-07 | Message inside an enquiry thread | Both sides see it |
| ADO-08 | Try to read someone else's enquiry thread | **Denied.** S1 if it leaks |
| ADO-09 | **Report a listing** | Report accepted (§4.21) |
| ADO-10 | Profanity in a listing | Rejected |

---

### 4.13 Lost & Found — 9 routes

**Where:** `/lost-found`, `/lost-found/[id]`

| ID | Case | Expected |
|---|---|---|
| LF-01 | Browse and filter reports | Works |
| LF-02 | Report a lost pet | Created |
| LF-03 | Report a found pet | Created |
| LF-04 | Link a report to one of your pets | Pet shows a missing banner |
| LF-05 | Edit and delete your report | Both work |
| LF-06 | Submit a sighting as B | Reporter is notified |
| LF-07 | Sightings list | Accurate |
| LF-08 | **Matches** for a report | Plausible suggestions |
| LF-09 | Mark as found | Status updates; banner clears |
| LF-10 | Report a fraudulent listing (fake reward) | Reportable (§4.21) |
| LF-11 | Location field / map | Location saved and displayed correctly |

---

### 4.14 Breeding — 22 routes

**Where:** `/breeding-match`, `/breeding-match/[id]`

| ID | Case | Expected |
|---|---|---|
| BRD-01 | Browse breeding profiles | Works |
| BRD-02 | Create a breeding profile | Created |
| BRD-03 | Edit and delete | Both work |
| BRD-04 | "Mine" list | Only yours |
| BRD-05 | **Matches** | Sensible suggestions |
| BRD-06 | Send a breeding request | Owner receives it |
| BRD-07 | Accept / reject a request | Both work |
| BRD-08 | Message inside a request thread | Both sides see it |
| BRD-09 | Read another user's request thread | **Denied** |
| BRD-10 | Create a litter; edit it; toggle listed | All work |
| BRD-11 | Create and delete a breeding alert | Both work; alert fires on a match |
| BRD-12 | Leave a review; view reviews | Both work |
| BRD-13 | Verify a breeding profile | Verified state visible |
| BRD-14 | Report an unlicensed breeder | Reportable (§4.21) |

---

### 4.15 Vet Finder & Service Providers — 24 routes

**Where:** `/vet-finder`, `/vet-finder/[id]`, `/vet-finder/dashboard`, `/pet-care`, `/pet-care/dashboard`, `/pet-care/my-bookings`

**Preconditions:** the professional account from §1.3 for the provider side.

| ID | Case | Expected |
|---|---|---|
| VET-01 | Browse the directory; filter | Works |
| VET-02 | View a provider's detail page | Complete info |
| VET-03 | Create a provider listing (professional account) | Created |
| VET-04 | Edit and delete a listing | Both work |
| VET-05 | Add / edit / remove services | All work |
| VET-06 | Set availability; delete a slot | Both work |
| VET-07 | Book an appointment as a pet owner | Booking created; provider notified |
| VET-08 | My bookings list | Accurate for the owner |
| VET-09 | Provider's bookings list | Accurate for the provider |
| VET-10 | Provider changes booking status | Owner sees the change |
| VET-11 | Provider adds a **visit summary** | Owner can read it |
| VET-12 | Book an unavailable slot | Rejected clearly |
| VET-13 | Double-book the same slot | Prevented |
| VET-14 | Leave a review after a booking | Posted; provider rating updates |
| VET-15 | Delete your review | Removed; rating recalculates |
| VET-16 | Review a provider you never booked | Behaviour per policy — report what happens |
| VET-17 | Add / remove a team member | Both work |
| VET-18 | Non-owner tries to edit a provider | Denied |
| VET-19 | Report a misrepresented clinic | Reportable (§4.21) |

---

### 4.16 Shop & Orders — 14 routes

**Where:** `/shop`, `/shop/[id]`, `/shop/orders`, `/shop/checkout/success`, `/shop/checkout/cancel`

> **Checkout is disabled** — Stripe is unconfigured (§2.2). Test everything up to
> payment.

| ID | Case | Expected |
|---|---|---|
| SHOP-01 | Browse and filter products | Works |
| SHOP-02 | Create a listing | Created |
| SHOP-03 | Edit and delete your listing | Both work |
| SHOP-04 | "Mine" list | Only yours |
| SHOP-05 | Save / unsave a product | Appears in and leaves saved |
| SHOP-06 | Send an enquiry as B | Seller receives it in the enquiries inbox |
| SHOP-07 | Seller views enquiries | Accurate |
| SHOP-08 | Start checkout | Fails clearly because Stripe is off — **must not** hang or show a raw error |
| SHOP-09 | `/shop/orders`, buying and selling views | Both render (likely empty) |
| SHOP-10 | Currency switcher | Prices convert consistently |
| SHOP-11 | Profanity in a listing | Rejected |
| SHOP-12 | Report a product | Reportable (§4.21) |

---

### 4.17 News — 14 routes

**Where:** `/news`, `/news/[id]`

| ID | Case | Expected |
|---|---|---|
| NEWS-01 | Browse news; category tabs | Work |
| NEWS-02 | Featured articles | Surfaced at the top |
| NEWS-03 | "Top Stories" panel | Most-liked recent articles |
| NEWS-04 | Open an article | Full article, **with its source and tier shown** |
| NEWS-05 | Like / unlike | Count updates |
| NEWS-06 | Save / unsave | Appears in saved |
| NEWS-07 | Comment on an article | Posted; same rules as post comments |
| NEWS-08 | Delete your news comment | Removed |
| NEWS-09 | Submit an article | Created; check whether it publishes immediately or awaits review |
| NEWS-10 | "Mine" list | Only your submissions |
| NEWS-11 | Edit and delete your article | Both work |
| NEWS-12 | Source tier is always visible | Never an article with no tier |
| NEWS-13 | Profanity in an article or comment | Rejected |

---

### 4.18 Search — 11 routes

**Where:** `/search`, `/explore/tags/[tag]`

**Search works logged out** — test both states.

| ID | Case | Expected |
|---|---|---|
| SRCH-01 | Unified search, signed in | Returns people, hashtags, posts, communities, news |
| SRCH-02 | Unified search, **signed out** | Still returns results (no 401) |
| SRCH-03 | Each vertical: people, posts, communities, hashtags, news, events, adoption, lost-found, products, providers | All ten return sensible results |
| SRCH-04 | Empty query | Handled gracefully, no crash |
| SRCH-05 | Query with symbols / SQL-ish text / emoji | Safe, no error |
| SRCH-06 | Very long query (1,000 chars) | Handled |
| SRCH-07 | Search for a **blocked** user | Excluded from your results |
| SRCH-08 | Search for a **muted** user | Behaviour per policy — report actual |
| SRCH-09 | Search for a **private** account | Appears but content stays gated |
| SRCH-10 | Search for a **deactivated** account | Excluded |
| SRCH-11 | Signed out, search for private/gated content | Must not leak |
| SRCH-12 | Tag page `/explore/tags/<tag>` | Posts plus adoption, lost & found, events, products, communities sections |
| SRCH-13 | Nonexistent tag | Clean not-found |
| SRCH-14 | Result relevance | Best matches first; note bad ordering |

---

### 4.19 Hashtags — 5 routes

| ID | Case | Expected |
|---|---|---|
| TAG-01 | Trending hashtags | Populated and plausible |
| TAG-02 | "Topics for you" | Personalised; changes as your activity changes |
| TAG-03 | Hashtag search | Matches |
| TAG-04 | Tag page — "everything" sections | Each section links to that feature's own browse view |
| TAG-05 | Tag page — posts, paginated | Loads more correctly |
| TAG-06 | Tag with no content | Clean empty state |
| TAG-07 | Tag a post, then find it under that tag | Appears |

---

### 4.20 Notifications — 4 routes

**Where:** `/notifications`

> In-app only. There is no email or push (§2.1).

| ID | Case | Expected |
|---|---|---|
| NOTIF-01 | Get notified for: follow, follow request, like, comment, comment like, mention, DM, group invite, community invite, event invite, enquiry, booking | Each arrives |
| NOTIF-02 | Unread count badge | Accurate |
| NOTIF-03 | Mark one read | Count decrements |
| NOTIF-04 | Mark all read | Count zeroes |
| NOTIF-05 | Click a notification | Goes to the right place |
| NOTIF-06 | Notification from a user you then block | Handled sensibly |
| NOTIF-07 | Notifications while muted (conversation or user) | Suppressed as designed |
| NOTIF-08 | Live arrival | New notification appears without a refresh |

---

### 4.21 Reporting, Moderation & Admin — 7 routes

**Where:** Report buttons across the app; `/admin/moderation`

**Reportable target types in this build:** post, comment, message, user,
adoption_listing, lost_found_report, event, product, provider,
breeding_profile, community. **Stories are no longer reportable** (removed).

| ID | Case | Expected |
|---|---|---|
| MOD-01 | Report each of the 11 target types above | Report accepted every time; the modal names the right thing ("post", "adoption listing", …) |
| MOD-02 | Each report reason: spam, harassment, abuse, animal_welfare, impersonation, other | All selectable |
| MOD-03 | Add a note to a report | Saved |
| MOD-04 | Report the same thing twice | Handled without duplicate noise |
| MOD-05 | *(admin)* Moderation queue | All reports listed with target and reason |
| MOD-06 | *(admin)* Resolve — dismiss | Report closed, content untouched |
| MOD-07 | *(admin)* Resolve — remove content | Content removed for everyone |
| MOD-08 | *(admin)* Resolve — warn | User warned |
| MOD-09 | *(admin)* Suspend, then reinstate | Suspended user cannot act; reinstated user can |
| MOD-10 | *(admin)* Ban | User banned |
| MOD-11 | *(admin)* **Audit log** | Every admin action above appears in it. A missing entry is S2 — every trust action must be audited |
| MOD-12 | Non-admin opens `/admin/moderation` | Denied, does not render |
| MOD-13 | Non-admin calls an admin API directly | 403, not 200 |

---

### 4.22 Safety Advisories — 1 route

**Where:** the safety banner in the app

Works logged out.

| ID | Case | Expected |
|---|---|---|
| SAFE-01 | Advisories with valid coordinates | Returns conditions — temperature, humidity, wind, UV, air quality — and any advisories |
| SAFE-02 | Advisories with **no** coordinates | `INVALID_COORDINATES` domain error, **not** a 401 or a crash |
| SAFE-03 | Out-of-range coordinates (lat 999) | Clear validation error |
| SAFE-04 | Signed out | Works |
| SAFE-05 | Banner reflects genuinely risky conditions | Advisory shown when it should be |

> Note for API testers: the parameters are `lat` and **`lon`** (not `lng`).

---

### 4.23 Analytics — 2 routes

**Where:** `/dashboard`, post insights

**Preconditions:** professional account with some posts and engagement.

| ID | Case | Expected |
|---|---|---|
| AN-01 | Account analytics | Numbers match reality |
| AN-02 | Post analytics | Views, reach and engagement plausible |
| AN-03 | Analytics on a brand-new account | Clean zero state, not an error |
| AN-04 | Non-professional account | Gated or empty as designed |

---

### 4.24 Invites — 2 routes

| ID | Case | Expected |
|---|---|---|
| INV-01 | Open a valid invite code | Details shown |
| INV-02 | Accept an invite | Joined |
| INV-03 | Invalid or already-used code | Clean error |
| INV-04 | Accept while logged out | Prompted to sign in, then honoured |

---

### 4.25 Help Center / Docs — 12 pages

**Where:** `/docs`

The index plus 11 sections: Getting Started, Profile & Pets, Feed & Posts,
Community & Events, Messaging & Calls, Adoption & Lost/Found, Marketplace &
Services, News, Safety & Trust, Notifications & Settings, FAQ.

| ID | Case | Expected |
|---|---|---|
| DOC-01 | All 12 doc pages load | No 404s |
| DOC-02 | Sidebar navigation | Every entry resolves |
| DOC-03 | Jump links within a page | Every anchor scrolls to a real heading — no dead anchors |
| DOC-04 | **Docs match the product** | Anything documented must exist. Docs promising a missing feature is a real bug |
| DOC-05 | No mention of Stories anywhere | Stories were removed; "Feed & Posts" is correct. News articles called "stories" is fine |
| DOC-06 | Cross-links between docs pages | All resolve |
| DOC-07 | Mobile layout | Readable |

---

### 4.25a Legal pages

**Where:** `/terms`, `/privacy` — linked from the signup consent line and from
Settings → Help.

| ID | Case | Expected |
|---|---|---|
| LEG-01 | Open `/terms` and `/privacy` **signed out** | Both load — the consent line on signup links here, so they must work without an account |
| LEG-02 | Both pages show a visible "Draft — pending legal review" banner | Present. These are not final policy; do not report the banner as a bug |
| LEG-03 | Signup page footer links | Both resolve, no 404 |
| LEG-04 | Settings → Help → Terms of Service / Privacy Policy | Both resolve |
| LEG-05 | "Back to sign in" link, and the footer links between the two pages | All resolve |
| LEG-06 | Mobile 390px and dark mode | Readable, tables scroll rather than overflowing the page |
| LEG-07 | Content accuracy | The privacy policy lists what the app really collects and which providers process it. **If you find a claim that contradicts how the app behaves, report it** — that is the most valuable bug on these pages |

### 4.26 Realtime — 18 WebSocket events

Realtime cuts across modules. Test with two browsers side by side.

Live events in this build: `feed.subscribe/unsubscribe`,
`post.subscribe/unsubscribe`, `profile.subscribe/unsubscribe`,
`conversation:join/leave`, `typing:start/stop`, `messages:read`,
`presence:subscribe/unsubscribe`, `call:invite/accept/reject/cancel/end`.

| ID | Case | Expected |
|---|---|---|
| RT-01 | B posts while A watches the feed | A sees it without refreshing |
| RT-02 | B likes/comments on a post A is viewing | A sees the update live |
| RT-03 | B updates their profile while A views it | A sees the change |
| RT-04 | Typing, read receipts, presence | Covered in MSG-08/09/10 |
| RT-05 | Drop the network, then restore | Reconnects and catches up; no duplicates |
| RT-06 | Leave a tab open 10+ minutes | Still live, no zombie connection |
| RT-07 | Open the same account in 3 tabs | All stay consistent |

---

### 4.27 Health endpoints — 2 routes

| ID | Case | Expected |
|---|---|---|
| SYS-01 | `GET /api/v1/health` | 200 with dependency status |
| SYS-02 | `GET /api/v1/health/version` | 200 with build info |

> Note: `/health` **without** the `/api/v1` prefix returns 404. That is correct —
> everything is under `/api/v1`.

---

## 5. API-level checks

For testers comfortable with `curl` or Postman. Base URL
`http://localhost:4000/api/v1`.

| ID | Case | Expected |
|---|---|---|
| API-01 | Call any authenticated route with no token | 401 with a structured error |
| API-02 | Call it with `Authorization: Bearer garbage` | **Optional-auth routes degrade to anonymous (200); strictly-authenticated routes 401.** Never a 500 |
| API-03 | Every error response shape | `{"success":false,"error":{"code":"...","message":"..."}}` — never a raw stack trace |
| API-04 | Every success shape | `{"success":true,"data":{...}}` |
| API-05 | Pass a non-UUID where a UUID is expected | 400 validation error, not 500 |
| API-06 | Pass a UUID that doesn't exist | 404 with a domain code (e.g. `HASHTAG_NOT_FOUND`), not 500 |
| API-07 | Request a nonexistent route | 404 `Cannot GET /api/v1/...` |
| API-08 | Fire 100 rapid requests at one endpoint | Rate limited with a clear code, not a crash |
| API-09 | Access another user's resource by guessing its ID | **403/404, never the data.** Any leak is S1 |
| API-10 | Send a request from a disallowed origin | CORS blocks it (`ALLOWED_ORIGIN` is `http://localhost:3000`) |
| API-11 | Confirm removed routes are gone: `/stories/tray`, `/music/trending`, `/highlights/x`, `/me/archive`, `/me/story-mentions`, `/hashtags/x/stories` | All 404 `Cannot GET` |
| API-12 | Trigger any 500 and read the body | Contains `error.requestId`; the same id appears in the API log with the method, route and calling user |
| API-13 | Check a 400 / 401 / 404 body | **No** `requestId` field |

**API-09 is the single highest-value test in this document.** Work through it for
pets, health records, DMs, enquiry threads, breeding requests, verification
documents and bookings.

---

## 6. End-to-end journeys

Run these start to finish in one sitting. They catch integration bugs that
module testing misses.

**J1 — New pet owner (~30 min)**
Sign up → onboarding → add a pet → fill the health passport → post a photo
tagging the pet → add hashtags → join a community → post there → follow two
people → DM one → check notifications.

**J2 — Privacy end to end (~25 min)**
Set A private → B requests to follow → A sees the request → A accepts → B sees
A's posts → A blocks B → B loses all access → A unblocks → verify what returns.
Every step must hold. Failures here are S1/S2.

**J3 — Professional (~30 min)**
Switch to professional → pick a category → submit verification → upload
documents → *(admin)* approve → badge appears → create a provider listing → add
services → set availability → B books → change status → add a visit summary →
B reviews → check analytics.

**J4 — Rescue (~20 min)**
Create an adoption listing → B enquires → message in the thread → update status
→ report the listing from a third account → *(admin)* resolve → confirm the
audit log entry.

**J5 — Lost pet (~15 min)**
Report a pet lost, linked to your pet → confirm the missing banner → B submits a
sighting → check matches → mark found → banner clears.

**J6 — Logged-out visitor (~15 min)**
In a private window: search for people, posts, communities, news → open a public
profile → open a public post → open a shared pet passport link → try the feed
(must be 401/redirect) → try a private profile → confirm **nothing** private
leaks anywhere.

**J7 — Group conversation (~20 min)**
A creates a group with B and C → all send messages → verify live delivery,
typing, read receipts → A removes C → C loses access → B leaves → A alone.

---

## 7. Coverage tracker

| Module | Cases | Owner | Pass | Fail | Blocked | Done |
|---|---|---|---|---|---|---|
| 4.0 Global checks | 11 | | | | | ☐ |
| 4.1 Auth & Sessions | 23 | | | | | ☐ |
| 4.2 Onboarding | 14 | | | | | ☐ |
| 4.3 Profile & Settings | 16 | | | | | ☐ |
| 4.4 Professional & Verification | 11 | | | | | ☐ |
| 4.5 Pets & Health Passport | 16 | | | | | ☐ |
| 4.6 Posts & Feed | 21 | | | | | ☐ |
| 4.7 Comments | 11 | | | | | ☐ |
| 4.8 Network | 18 | | | | | ☐ |
| 4.9 Messaging (34) + Calls (8) + AI (8) | 50 | | | | | ☐ |
| 4.10 Communities | 23 | | | | | ☐ |
| 4.11 Events | 14 | | | | | ☐ |
| 4.12 Adoption | 10 | | | | | ☐ |
| 4.13 Lost & Found | 11 | | | | | ☐ |
| 4.14 Breeding | 14 | | | | | ☐ |
| 4.15 Vet Finder & Providers | 19 | | | | | ☐ |
| 4.16 Shop & Orders | 12 | | | | | ☐ |
| 4.17 News | 13 | | | | | ☐ |
| 4.18 Search | 14 | | | | | ☐ |
| 4.19 Hashtags | 7 | | | | | ☐ |
| 4.20 Notifications | 8 | | | | | ☐ |
| 4.21 Moderation & Admin | 13 | | | | | ☐ |
| 4.22 Safety Advisories | 5 | | | | | ☐ |
| 4.23 Analytics | 4 | | | | | ☐ |
| 4.24 Invites | 4 | | | | | ☐ |
| 4.25 Help Center | 7 | | | | | ☐ |
| 4.25a Legal pages | 7 | | | | | ☐ |
| 4.26 Realtime | 7 | | | | | ☐ |
| 4.27 Health | 2 | | | | | ☐ |
| 5 API-level | 13 | | | | | ☐ |
| 6 Journeys J1–J7 | 7 | | | | | ☐ |
| | **398 cases + 7 journeys** | | | | | |

### Suggested order

1. **§1–3** — setup and ground rules
2. **§4.0** — global checks, so you apply them everywhere after
3. **§4.1, 4.2, 4.3** — you cannot test anything else without accounts
4. **§4.9** — messaging, the largest and riskiest module
5. **§4.6, 4.7, 4.8** — the social core
6. **Everything else** by priority
7. **§6 journeys** last — they need all the above to work

### Where the bugs most likely are

Weight your time toward these, based on how this build is put together:

- **Messaging** — 46 routes plus 18 live events, by far the largest surface
- **Privacy and blocking** — many modules each have to honour it independently
- **Cross-user access** (API-09) — the highest-severity class of bug
- **Mobile at 390px** — a separate tab bar from the desktop sidebar
- **Dark mode** — styled separately throughout
- **Anything touching the just-removed Stories module** — feed, hashtags,
  reporting, notifications and Redis caching were all edited when Stories came
  out. Leftover references or broken behaviour in those five areas is the most
  likely regression in this build.
