import type { OrderStatus } from '@prisma/client'

/**
 * The Shop order state machine (ZSOC-COM-REV-001 §31).
 *
 * Migration 067 constrains which VALUES the column can hold. This constrains
 * which MOVES between them are legal — the part an enum cannot express, and the
 * part that matters when reversals arrive out of order. §31 is explicit that
 * "provider/app-store webhook ordering may be non-sequential", so a late event
 * proposing a backwards move is expected traffic, not a bug to crash on.
 *
 * The table is deliberately small and total: every status lists exactly what it
 * may become, and a status that is the end of the road lists nothing.
 */
export const ORDER_TRANSITIONS: Readonly<Record<OrderStatus, readonly OrderStatus[]>> = {
  // A checkout session either completes, expires, or sits there.
  pending: ['paid', 'cancelled'],

  // Payment captured. A partial refund leaves the order here on purpose —
  // part of the payment still stands, so calling it `refunded` would overstate
  // what came back.
  paid: ['fulfilled', 'refunded', 'disputed'],

  // Delivered, and still reversible: a refund or dispute can follow delivery,
  // which is exactly the case §17 M3 warns about (a refund after payout).
  fulfilled: ['refunded', 'disputed'],

  // An issuer decision resolves the dispute either way.
  disputed: ['paid', 'refunded'],

  // Terminal. A cancelled checkout was never paid, so nothing can reverse; a
  // refunded order has already returned the money. Anything arriving after
  // these is a reconciliation matter (§16 L5), not a state change.
  cancelled: [],
  refunded: [],
}

export function canTransition(from: OrderStatus, to: OrderStatus): boolean {
  return ORDER_TRANSITIONS[from].includes(to)
}

/** Statuses from which no further movement is legal. */
export const TERMINAL_ORDER_STATUSES: readonly OrderStatus[] = (
  Object.keys(ORDER_TRANSITIONS) as OrderStatus[]
).filter((s) => ORDER_TRANSITIONS[s].length === 0)
