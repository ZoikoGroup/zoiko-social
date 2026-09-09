import type { OrderStatus } from '@prisma/client'
import { ORDER_TRANSITIONS, canTransition, TERMINAL_ORDER_STATUSES } from './order-status'

/**
 * The order state machine (ZSOC-COM-REV-001 §31).
 *
 * The cases worth pinning are the ones a late or duplicated webhook creates:
 * money moving back out of a terminal state, or a reversal arriving for an
 * order that was never paid.
 */

const ALL = Object.keys(ORDER_TRANSITIONS) as OrderStatus[]

describe('the moves money actually makes', () => {
  it.each([
    ['pending', 'paid'],
    ['pending', 'cancelled'],
    ['paid', 'fulfilled'],
    ['paid', 'refunded'],
    ['paid', 'disputed'],
    ['fulfilled', 'refunded'],
    ['disputed', 'paid'],
    ['disputed', 'refunded'],
  ] as [OrderStatus, OrderStatus][])('%s → %s is legal', (from, to) => {
    expect(canTransition(from, to)).toBe(true)
  })

  it('lets a refund follow delivery', () => {
    // §17 M3's refund-after-fulfilment case. Blocking it would mean the ledger
    // could not record something that genuinely happens.
    expect(canTransition('fulfilled', 'refunded')).toBe(true)
  })
})

describe('the moves that would invent money', () => {
  it.each([
    ['refunded', 'paid'],
    ['refunded', 'fulfilled'],
    ['cancelled', 'paid'],
    ['cancelled', 'refunded'],
  ] as [OrderStatus, OrderStatus][])('%s → %s is refused', (from, to) => {
    expect(canTransition(from, to)).toBe(false)
  })

  it('refuses to refund an order that was never paid', () => {
    expect(canTransition('pending', 'refunded')).toBe(false)
  })

  it('refuses to dispute an unpaid order', () => {
    // A dispute is raised against a captured payment. One arriving for a
    // pending order is a mismatch to reconcile, not a state change.
    expect(canTransition('pending', 'disputed')).toBe(false)
  })

  it('refuses to fulfil before payment', () => {
    expect(canTransition('pending', 'fulfilled')).toBe(false)
  })
})

describe('the table is total', () => {
  it('gives every status an entry', () => {
    for (const status of ALL) {
      expect(ORDER_TRANSITIONS[status]).toBeDefined()
    }
  })

  it('never lets a status move to itself', () => {
    // A redelivered webhook re-proposing the current state is a no-op the
    // caller should skip, not a transition.
    for (const status of ALL) {
      expect(canTransition(status, status)).toBe(false)
    }
  })

  it('only points at statuses that exist', () => {
    for (const status of ALL) {
      for (const next of ORDER_TRANSITIONS[status]) {
        expect(ALL).toContain(next)
      }
    }
  })

  it('names cancelled and refunded as the terminal states', () => {
    expect([...TERMINAL_ORDER_STATUSES].sort()).toEqual(['cancelled', 'refunded'])
  })
})
