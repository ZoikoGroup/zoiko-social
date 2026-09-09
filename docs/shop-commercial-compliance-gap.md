# Shop & Bookings — Commercial Compliance Gap Analysis

**Assessed against:** ZSOC-COM-REV-001 *Commercial Billing, Monetization & Revenue
Operations Operating Standard* v1.0 (2026-08-07), Domain 3 — Marketplace & Services.

**Scope:** the only money-handling code currently in the repo —
`apps/api/src/modules/payments/`, `apps/api/src/modules/shop/`, the `Product` /
`Order` models, and the `PetCareService` / `PetCareBooking` models.

**Status of the standard itself:** unapproved. §36's signature table is blank. This
document therefore records *divergence*, not a mandate to change — several items
below are Legal/Finance decisions, flagged as such.

---

## Summary

| # | Finding | Severity | Owner | Status |
|---|---|---|---|---|
| 1 | Zoiko collects third-party seller funds into its own Stripe balance, with no remittance path | **Critical** | Legal / Finance | Open — blocked on merchant-model decision |
| 2 | No fee, tax or seller-net decomposition on orders | **High** | Finance → Eng | Open — blocked on #1 |
| 3 | Refund and dispute states exist in the vocabulary but no handler consumes them | **High** | Eng | **Fixed** — migration 065 |
| 4 | `PetCareBooking.pay_now` implies a payment rail that does not exist | **Medium** → **High** | Product → Eng | **Fixed** |
| 5 | `markPaidBySessionId` guard is read-then-write, not atomic | **Low** | Eng | **Fixed** |
| 6 | Seller-declared currency is unconstrained | **Low** | Eng | **Fixed** — and it was hiding a 100× bug |

Two things already conform and should be preserved — see [What already
conforms](#what-already-conforms).

---

## 1. Zoiko collects third-party seller funds into its own balance — **Critical**

### What the code does

[`stripe.service.ts:44-62`](../apps/api/src/modules/payments/stripe.service.ts#L44-L62)
creates the Checkout Session with no `stripe_account` header (Direct charges), no
`payment_intent_data.transfer_data` (Destination charges) and no `on_behalf_of`.
Funds for a seller's goods therefore settle into **Zoiko's own platform Stripe
balance**.

There is no path back out. `Order`
([`schema.prisma:2475-2494`](../apps/api/prisma/schema.prisma#L2475-L2494)) records
`sellerId` but carries no payable, payout or ledger field, and a repo-wide search for
`payout`, `transfer_data`, `connected` or `seller_ledger` across `apps/api/src`
returns no commercial matches.

### What the standard requires

- §11 G1 — *"No. The listed seller/provider remains the merchant unless a separately
  approved model says otherwise."* Orders must carry `merchant_model` and
  `payment_route`.
- §1 (Merchant / funds boundary) — *"Zoiko Social is not assumed to be merchant of
  record, escrow provider, bank, charity trustee, money transmitter, tax authority or
  debt collector. Any such role requires separately approved legal/payment
  architecture."*
- §16 L3 — payouts are *"separate payable and payout records; never a mutation of
  buyer payment history."*
- §4 P0 blocker #8 — *"If not legally approved, Zoiko must not custody or settle
  third-party funds."*

### The decision required (not an engineering call)

Zoiko is currently in the merchant-of-record / fund-custody position the standard
says must not be assumed without approved legal architecture. Three ways out:

1. **Stripe Connect — Direct or Destination charges.** Seller onboards to a connected
   account with KYC; funds route to them; Zoiko takes an application fee. Aligns with
   §11 G1 and §12 H5. Requires KYC/KYB (§4 P0 blocker #9) and a payout ledger.
2. **Zoiko as approved merchant of record.** Keep the current flow, but get it legally
   approved, with terms, tax registration, refund liability and a payout obligation
   modelled explicitly. Materially heavier than it looks.
3. **Disable Shop checkout until (1) or (2) is decided.** `stripeEnabled` is already a
   config gate ([`config.service.ts:179-181`](../apps/api/src/modules/config/config.service.ts#L179-L181)),
   so this is a deploy-time switch, not a code change. Listings and enquiries continue
   to work; only checkout stops.

**Recommendation: option 3 now, option 1 as the target**, since option 1 is what §11
and §12 describe and what a payout ledger would be built for anyway. Option 3 costs
nothing and stops the exposure accruing while the decision is made.

> **Verify before acting:** whether `STRIPE_SECRET_KEY` / `STRIPE_WEBHOOK_SECRET` are
> actually set in the production environment. If they are not, checkout is already
> dormant and this is a design-debt item rather than a live exposure.

---

## 2. No fee, tax or seller-net decomposition — **High**

`Order` stores `amountCents` + `currency` and nothing else. There is no platform fee,
processor fee, tax, seller net, or fee-rule version.

- §11 G5 — *"Persist `fee_rule_version`, `platform_fee`, `processor_fee`, `tax`,
  `seller_net` and refundability separately,"* through a schedule *disclosed before
  transaction authorization*.
- §18 N1 — tax must resolve per seller/buyer location, transaction type and product
  tax category. No tax concept exists anywhere in the codebase.
- §19 O4 / §29 FIN-02 — gross volume and Zoiko revenue must be separately modelled.
  Today they cannot be distinguished, because there is no fee concept at all: every
  order is 100% pass-through with no recorded platform take.
- §30 requires `platform_fee / commission` and `seller_recipient_ledger` objects.

Blocked on the same decision as Finding 1 — the fee schedule and tax treatment depend
on who the merchant is.

---

## 3. Refund and dispute states are declared but unreachable — **High** — FIXED

`orders.status` documents `refunded`
([`025_orders.sql:15`](../supabase/migrations/025_orders.sql#L15)) and
`PetCareBooking.paymentStatus` documents `refund_pending | refunded`
([`schema.prisma:807`](../apps/api/prisma/schema.prisma#L807)). Nothing can ever set
them: the webhook switch in
[`payments.controller.ts:70-84`](../apps/api/src/modules/payments/payments.controller.ts#L70-L84)
handles only `checkout.session.completed` and `checkout.session.expired`.

A refund issued from the Stripe dashboard — the likeliest real-world path today —
leaves the Zoiko order reading `paid` forever, with stock still decremented and the
seller still notified of a sale.

- §17 M3 — marketplace refunds must flow through seller ledger entries.
- §29 FIN-03 — *"Refunds, reversals, disputes and chargebacks preserve original
  financial events and create correct downstream entitlement/payout effects."*
- §33 — required observability includes "refund after payout" and "refund failures".

### What was implemented

- **`order_payment_events`** ([migration 065](../supabase/migrations/065_order_payment_events.sql))
  — a reversal is a new linked fact event, never a destructive edit. `orders.amount_cents`
  is the amount authorized and stays untouched; what came back is reconstructed by
  replaying the table (§31).
- **`order_id` is nullable.** A refund whose payment intent matches no order is still
  recorded, as a reconciliation exception with a partial index over the unmatched rows
  (§16 L5) — the handler never discards evidence it cannot link.
- **`ON DELETE RESTRICT`**, so financial evidence outlives the convenience of deleting a
  row (§17 M3).
- **Idempotency via `stripe_event_id UNIQUE`.** The handler inserts the fact event
  *first* and treats a duplicate-key violation as "already processed", so the whole
  path is replay-safe before any order mutation runs (§23 S1).
- **Handlers** for `charge.refunded`, `charge.dispute.created` and `charge.dispute.closed`
  in [payments.controller.ts](../apps/api/src/modules/payments/payments.controller.ts).
  Partial refunds leave the order `paid`; a lost dispute is treated as a reversal; an
  ambiguous close (`warning_closed`) leaves the order alone rather than guessing.
- **Stock is deliberately not restored** on refund — the goods may have shipped, and
  resurrecting a sold-out listing would be the system inventing commercial truth. Logged
  for whoever owns that product call.

### Notifications — in-app done, email still deferred

Sellers are notified in-app when a sale is refunded, when a payment is disputed and
when that dispute settles; buyers are notified when a refund is processed. An
ambiguous dispute close (`warning_closed`) stays silent rather than implying an
outcome, and an unmatched reversal notifies nobody.

The notification copy carries **no money amounts** — §24 T2, rendering code must not
become a hidden financial calculator. It points at the order, which holds the
authoritative figures. There's a test asserting the copy contains no digits.

`order_refunded`, `order_disputed` and `order_dispute_resolved` are registered in the
comms registry's `IN_APP_ONLY_TYPES`, which is what declares in-app-only as the
*intended* outcome rather than an unmapped event.

**Still deferred: reversal email.** §24 T and §29 COMMS-01 require an approved sender
boundary per commercial domain, and no marketplace commercial sender exists — as of
this writing only the AUTH template family (5 of 33 registered template IDs) is
implemented at all.
- ~~**Order status as an enum.**~~ **Done** — [migration 067](../supabase/migrations/067_order_status_enum.sql)
  makes the column a Postgres enum, and [order-status.ts](../apps/api/src/modules/payments/order-status.ts)
  adds the transition table an enum cannot express. Both reversal writers now propose
  a move and check it, so a late or duplicated webhook proposing a backwards step is
  recorded and declined rather than applied — §31 is explicit that provider event
  ordering may be non-sequential. `refunded` and `cancelled` are terminal.

  The conversion refuses to run against unrecognised data rather than coercing it
  (§32). The values keep this codebase's existing names, not §31's canonical
  vocabulary — including the British `cancelled` against §31's `CANCELED`. Renaming
  touches both order screens and every status comparison for no behavioural gain, and
  belongs with the merchant decision that reshapes these records anyway.

---

## 4. `pay_now` bookings have no payment rail — **High** (raised) — FIXED

`PetCareBooking` carries `priceCents`, `paymentMethod = pay_at_visit | pay_now` and
`paymentStatus`, but no booking route touches Stripe. `pay_now` is a promise the
system cannot keep.

The standard treats bookings as heavier than orders, not lighter:

- §12 H1 — a `service_offer_version` and `booking_quote` must exist *before* payment,
  covering scope, duration, location/remote mode and cancellation terms. Any material
  change invalidates the prior quote. `PetCareBooking` snapshots `priceCents` but not
  the offer version.
- §12 H2 — 1:1 real-time services have **distinct app-store routing** from digital
  goods; the route must be policy-driven, not hard-coded.
- §12 H4 — receipts and booking UI must identify the provider and service category, so
  Zoiko does not silently adopt professional responsibility. Relevant to the vet
  fields already on the model (`consultMode`, `prescription`, `visitSummary`), which
  §12 H4 puts squarely in "regulated categories require category-specific Legal
  approval."

### Worse than first assessed

This was rated Medium on the assumption it was a dormant data field. It was not.
[pet-care/[id]/page.tsx](../apps/web/src/app/pet-care/[id]/page.tsx) rendered a live
**"Pay Now — Secure online payment"** button next to "Pay at Visit". Choosing it
created the booking with `paymentStatus: 'unpaid'` and ran no payment flow at all. A
seeker who picked it had every reason to believe they had paid online. Raised to High.

**Fixed:** the option is removed from the booking UI and replaced with a plain
statement that payment happens with the provider at the visit and nothing is charged
now; `CreateBookingSchema` accepts only `z.literal('pay_at_visit')`, so a stale client
is rejected rather than silently recording an unhonourable state.

Existing `pay_now` rows are left alone — they are accurate history of what was chosen,
and all of them are `unpaid`, which is also accurate. One loose end: the seeker-facing
booking screens still render the label "Pay Now" for those historical rows, which
could still be read as "paid". Deliberately not changed here, because the honest
replacement depends on whether the provider collected cash in person — the booking's
own `paymentStatus` is the truth, and surfacing that is a small follow-up.

---

## 5. `markPaidBySessionId` guard is not atomic — **Low** — FIXED

[`orders.service.ts:117-138`](../apps/api/src/modules/payments/orders.service.ts#L117-L138)
reads the order, checks `status !== 'pending'`, then opens a transaction. Two
concurrent deliveries of the same `checkout.session.completed` can both clear the
check before either writes, double-decrementing stock and sending the seller two
"item sold" notifications.

Practical risk is low — Stripe spaces its retries — but §23 S1 requires idempotency
"wherever retry could duplicate money, entitlement, spend, payout or receipt," and a
duplicated stock decrement plus receipt-adjacent notification qualifies.

**Fixed** by folding the guard into the write, so the status check and the update are
one atomic operation. The read remains as a cheap early-out; the `updateMany` is the
actual claim, and the loser returns before the stock decrement and the seller
notification. `markCancelledBySessionId` had the same shape and got the same treatment
— which additionally stops a late `checkout.session.expired` from un-paying an order.

Covered by [orders.service.spec.ts](../apps/api/src/modules/payments/orders.service.spec.ts).

---

## 6. Seller-declared currency is unconstrained — **Low** — FIXED

[`shop.schemas.ts:16`](../apps/api/src/modules/shop/shop.schemas.ts#L16) accepts any
3-character string as `currency`. An unsupported code surfaces as a Stripe API error
at checkout rather than a validation error at listing time, and cross-currency orders
cannot be aggregated for reporting.

**Fixed** with a `SHOP_CURRENCIES` allowlist in
[shop.schemas.ts](../apps/api/src/modules/shop/shop.schemas.ts), normalised to
uppercase before validation.

### The allowlist surfaced a real bug

The obvious allowlist was the viewer's display-currency list — the nine codes in
[currency.ts](../apps/web/src/lib/currency.ts). Eight are safe. **JPY is not**, and
including it would have introduced a 100× overcharge.

The codebase treats `priceCents` as hundredths everywhere: the UI divides by 100, and
checkout passes the value straight to Stripe as `unit_amount`. Stripe takes
zero-decimal currencies in whole yen, so a ¥1,000 listing stored as `100000` would
charge **¥100,000**. JPY is therefore excluded, with the reason recorded at the
constant — adding any zero-decimal currency requires the amount handling to change
first.

This is also the distinction §18 draws: display currency and transaction currency are
different concerns. A viewer may see any currency converted; the posted transaction has
exactly one currency (§18 N3) and it must be one of the eight.

§18 N4's reporting FX (`fx_source`, rate, timestamp, method) remains unimplemented —
not yet applicable at this volume.

---

## What already conforms

Worth naming so it isn't lost in refactoring:

- **Price snapshotting.** The amount is captured at order creation and never re-read
  from `products.price_cents` — documented in both
  [`025_orders.sql:1-4`](../supabase/migrations/025_orders.sql#L1-L4) and the `Order`
  model comment. This is exactly §W1's catalog-version doctrine ("historical purchases
  must remain reproducible"), reached independently.
- **Webhook signature verification.** [`payments.controller.ts:62-68`](../apps/api/src/modules/payments/payments.controller.ts#L62-L68)
  verifies before any mutation and fails closed on a bad signature — §23 S2, §29 PAY-01.
- **Default-deny listing categories.** `SHOP_CATEGORIES` is a closed allowlist of seven
  physical-goods categories with no animal category — satisfying §11 G2's default-deny
  model and keeping live-animal transfer out of generic checkout per §11 G3. Adoption
  and breeding are separate modules with no payment rail, which is the correct shape.
  Note the constraint lives only in the Zod schema, not in a DB `CHECK`.
- **Fail-closed Stripe gate.** `stripeEnabled` disables checkout with a clear
  `STRIPE_NOT_CONFIGURED` error rather than failing deep in the flow — the same
  fail-closed posture the standard's executive doctrine asks for.

---

## Recommended sequence

1. ~~Findings 3, 4, 5 and 6, in-app reversal notifications, and the order status
   machine~~ — **done.** None of them depended on the merchant model.
2. **Confirm** whether Stripe keys are live in production. Determines whether Finding 1
   is an active exposure or design debt.
3. **Decide** the merchant model — Connect vs merchant-of-record vs disabled. Findings
   1 and 2 are both blocked on it; nothing further should be built until it lands.
4. **Apply migrations 065, 066 and 067** through the normal path.
5. **Reversal email**, once a marketplace commercial sender is approved (§24 T). Only
   the AUTH template family exists today — 5 of 33 registered template IDs.
6. Small follow-ups: the historical "Pay Now" label on old bookings (Finding 4), the
   §31 status rename, enforcing `commercial_classification` at checkout, and the
   manual classification pass for internal/demo accounts.

---

## Verification

At time of writing: `tsc --noEmit` and `eslint` clean across API and web, full API
suite green — **39 suites, 744 tests**. New coverage spans webhook replay, concurrent
delivery, partial refunds, unmatched settlement, dispute outcomes, notification
recipients and copy, and the order transition table.

Migrations 065, 066 and 067 have **not** been applied to any database — they are
checked in awaiting the normal migration path.
