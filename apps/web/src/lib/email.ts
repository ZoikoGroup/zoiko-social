/**
 * Email check for the places a visitor types one.
 *
 * `type="email"` is not enough on its own: the HTML spec's definition allows a
 * bare hostname, so browsers accept test@test, a@b and user@domain. Those reach
 * signup, fail to receive a confirmation mail, and leave an account nobody can
 * get into. Settings was weaker still — it only looked for an "@".
 *
 * Deliberately not RFC 5322. A full parser accepts quoted local parts and
 * bracketed IP domains that no real sign-up uses, while still not proving the
 * address exists — only the confirmation mail does that. This rejects what is
 * obviously unusable and leaves the rest to delivery.
 */
const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/

export function isValidEmail(value: string): boolean {
  const trimmed = value.trim()
  // Longer than this is rejected by mail servers anyway (RFC 5321 §4.5.3.1).
  if (trimmed.length === 0 || trimmed.length > 254) return false
  if (trimmed.includes('..')) return false
  return EMAIL.test(trimmed)
}

export const EMAIL_INVALID_MESSAGE = 'Enter a valid email address, for example name@example.com.'
