/**
 * One password rule for every place a password is set — signup, the reset link,
 * and Change Password in settings. Those three had drifted: only the reset page
 * carried a minLength, none capped the length, and none checked case at all.
 *
 * Keep in step with RegisterSchema / ResetPasswordSchema in
 * apps/api/src/modules/auth/auth.controller.ts, which enforce the same rule so
 * it holds even if a client skips it.
 */

export const PASSWORD_MIN = 8

/**
 * bcrypt hashes at most 72 bytes and silently ignores the rest, so anything
 * longer gives a false sense of strength — two passwords sharing their first 72
 * bytes would both unlock the account. Capped rather than truncated.
 */
export const PASSWORD_MAX = 72

export const PASSWORD_HINT =
  '8–72 characters, with at least one lowercase letter, one uppercase letter and one number.'

/** The specific reason a password is unusable, or null when it is fine. */
export function validatePassword(password: string): string | null {
  if (password.length < PASSWORD_MIN) {
    return `Password must be at least ${PASSWORD_MIN} characters.`
  }
  if (password.length > PASSWORD_MAX) {
    return `Password must be ${PASSWORD_MAX} characters or fewer.`
  }
  // Reported one at a time: listing every rule at once buries which one failed,
  // which is how "RADHARAMANI1234" reads as a length problem rather than a
  // missing lowercase letter.
  if (!/[a-z]/.test(password)) return 'Password must include a lowercase letter.'
  if (!/[A-Z]/.test(password)) return 'Password must include an uppercase letter.'
  if (!/[0-9]/.test(password)) return 'Password must include a number.'
  return null
}
