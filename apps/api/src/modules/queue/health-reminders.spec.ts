import { healthReminderWindows } from './scheduled-jobs.service'

/**
 * The reminder job relies entirely on these windows being day-wide and
 * non-overlapping. If they overlap, owners get the same reminder twice; if they
 * leave a gap, a vaccination date passes in silence — which is the bug this
 * whole feature exists to fix.
 */
describe('healthReminderWindows', () => {
  // Mid-afternoon on purpose: the windows must snap to midnight regardless of
  // when the job actually runs, or a record due "today" falls outside the bucket.
  const now = new Date('2026-08-03T14:37:12.500Z')

  it('starts both windows at midnight, not at the current time', () => {
    const [, today] = healthReminderWindows(now)
    expect(today!.from.getHours()).toBe(0)
    expect(today!.from.getMinutes()).toBe(0)
    expect(today!.from.getSeconds()).toBe(0)
    expect(today!.from.getMilliseconds()).toBe(0)
  })

  it('makes each window exactly one day wide', () => {
    for (const w of healthReminderWindows(now)) {
      expect(w.to.getTime() - w.from.getTime()).toBe(24 * 3_600_000)
    }
  })

  it('puts the week-ahead window exactly seven days after today', () => {
    const [week, today] = healthReminderWindows(now)
    expect(week!.from.getTime() - today!.from.getTime()).toBe(7 * 24 * 3_600_000)
  })

  it('never overlaps, so no record is reminded twice in one run', () => {
    const [week, today] = healthReminderWindows(now)
    expect(today!.to.getTime()).toBeLessThanOrEqual(week!.from.getTime())
  })

  it('catches a date due today and one due in exactly seven days', () => {
    const [week, today] = healthReminderWindows(now)
    const dueToday = new Date('2026-08-03T00:00:00.000Z')
    const dueInAWeek = new Date('2026-08-10T00:00:00.000Z')

    const inWindow = (d: Date, w: { from: Date; to: Date }): boolean =>
      d.getTime() >= w.from.getTime() && d.getTime() < w.to.getTime()

    // Dates are stored as @db.Date (midnight), so an exact boundary match is
    // the normal case rather than an edge case.
    expect(inWindow(dueToday, today!) || inWindow(dueToday, week!)).toBe(true)
    expect(inWindow(dueInAWeek, week!) || inWindow(dueInAWeek, today!)).toBe(true)
  })

  it('ignores dates already past and dates further out than a week', () => {
    const windows = healthReminderWindows(now)
    const yesterday = new Date('2026-08-02T00:00:00.000Z')
    const nextMonth = new Date('2026-09-03T00:00:00.000Z')

    const matched = (d: Date): boolean =>
      windows.some((w) => d.getTime() >= w.from.getTime() && d.getTime() < w.to.getTime())

    // Overdue items are deliberately left alone: a daily nag about a booster
    // someone has chosen to skip is how people mute notifications entirely.
    expect(matched(yesterday)).toBe(false)
    expect(matched(nextMonth)).toBe(false)
  })

  it('leaves a gap of exactly six days between the two windows', () => {
    // Days 1–6 ahead get nothing, which is intended: the week-ahead nudge has
    // already gone out and the day-of one is still coming.
    const [week, today] = healthReminderWindows(now)
    expect(week!.from.getTime() - today!.to.getTime()).toBe(6 * 24 * 3_600_000)
  })
})
