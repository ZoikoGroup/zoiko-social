# ZoikoSocial — AI Assistant

**Version:** 1.0 · **Status:** Implemented · **Owner:** Platform Engineering
**Companion:** [messaging.md](./messaging.md) — the assistant is delivered as an ordinary DM thread

The assistant every member has a private conversation with. It answers questions
about using the platform and about animal care, and it can act on the member's
own pets and search the platform on their behalf.

---

## 1. It is a profile, not a special case

The assistant has a real profile row, a username (`zoikosocial.ai`), a verified
tier and a DM thread like any other account. That is what lets the entire
messaging stack — inbox, unread counts, realtime, search — work with no special
casing.

**Provisioning is the trap.** `profiles.id` is a foreign key onto
`auth.users(id)`, so the assistant cannot simply be inserted as a profile row. It
is created as a real, never-signed-into Supabase auth user; the
`on_auth_user_created` trigger turns that into a profile, which is then updated
with the username, display name and tier. The path is idempotent and safe to
re-run on every boot.

The client identifies it by handle alone (`isAiAssistant()` in
`apps/web/src/lib/ai-assistant.ts`), which must stay in step with `AI_USERNAME`
in the service. Features that genuinely do not apply — calls, blocking, message
requests — key off that check.

---

## 2. Request pipeline

A member's message runs through the following, in order. Every stage can end the
turn.

1. **Rate limit** — 20 messages per rolling hour per member, in-process, tracking
   at most 10,000 members. Over the limit returns a fixed message rather than an
   error.
2. **Inbound guardrails** — `detectOffLimits()` classifies the request; anything
   off-limits gets a written deflection instead of reaching the model.
   `looksHealthUrgent()` runs separately and steers toward a real vet.
3. **Retrieval** — `retrieveKnowledge()` pulls relevant passages from a curated
   knowledge base and formats them as context. This is what keeps answers about
   the product tied to how the product actually works.
4. **Generation** — Groq, model set by config, with a system prompt built per
   request.
5. **Tools** — the model may call one of the functions below; the executor runs
   it and the model gets the result to answer from.
6. **Outbound guardrails** — `containsTechLeak()` rejects a reply that exposes
   implementation detail, and the profanity service applies the same standard as
   everywhere else. A reply that fails is replaced, not shipped.
7. **Formatting** — `cleanReply()` normalises the output for a chat bubble.

Each failure mode has its own message (`UNCONFIGURED_MESSAGE`,
`RATE_LIMITED_MESSAGE`, `UNSAFE_REPLY_MESSAGE`, `EMERGENCY_FALLBACK_MESSAGE`,
`FALLBACK_MESSAGE`), so a member always gets a straight answer about what
happened rather than silence.

**No credentials, no assistant.** With Groq unconfigured the module still loads
and the thread still exists; it replies with `UNCONFIGURED_MESSAGE`. A missing
key must never look like a crash.

---

## 3. Tools

Two families, both scoped to the asking member.

**Pet tools** — act on that member's own pets:
`list_pets` · `add_pet` · `update_pet` · `log_weight` · `add_diary_entry` ·
`add_health_record`

**Discovery tools** — read-only searches across the platform:
`find_providers` · `find_adoption_listings` · `find_events` ·
`find_lost_found_reports`

Tool arguments arrive as a raw JSON string produced by the model and are
**validated before use** — a model is an untrusted input source, and a tool that
trusted its arguments would be a write primitive pointed at the database by
whoever is chatting.

---

## 4. Safety stance

The assistant is explicitly **not a veterinarian**, and the system prompt, the
urgency guardrail and the in-app help all say so. `looksHealthUrgent()` exists to
catch the case that matters most: someone describing an emergency to a chatbot
instead of phoning a vet.

Product questions are grounded in the knowledge base rather than answered from
model memory, because a confidently wrong answer about how ZoikoSocial works is
worse than no answer.

---

## 5. Where it is covered for members

`/docs/messaging-and-calls` — "The ZoikoSocial assistant", including the
not-a-vet warning.
