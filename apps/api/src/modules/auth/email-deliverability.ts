import { promises as dns } from 'node:dns'

/**
 * Does this address stand a chance of receiving mail?
 *
 * The gap this closes: registration calls Supabase's `admin.createUser` with
 * `email_confirm: true`, which marks the address as ALREADY confirmed rather
 * than sending anything to it. So a well-formed address nobody owns —
 * asdf@asdf.com, a typo like user@gmial.com — produced a fully usable account
 * that can never be recovered, and a mailbox that silently swallows every
 * notification the platform ever sends it.
 *
 * A format check cannot catch that, because the format is fine. What separates
 * a real domain from a made-up one is whether anything on the internet has
 * volunteered to accept mail for it, which is exactly what an MX record is.
 *
 * Deliberately NOT a claim that the mailbox exists. Only a confirmation mail
 * proves that, and enabling confirmation is the proper fix — this narrows the
 * gap in the meantime without changing how signup behaves for real addresses.
 */

/** Longer than a DNS lookup should ever take on the signup path. */
const LOOKUP_TIMEOUT_MS = 3_000

/**
 * Domains that resolve but are throwaway inbox services. Kept deliberately
 * short: a long blocklist is a maintenance burden that never keeps up, and the
 * MX check below is what does the real work.
 */
const DISPOSABLE = new Set([
  'mailinator.com',
  'guerrillamail.com',
  '10minutemail.com',
  'tempmail.com',
  'trashmail.com',
  'yopmail.com',
  'throwawaymail.com',
  'sharklasers.com',
])

export type EmailVerdict =
  | { ok: true }
  | { ok: false; reason: 'malformed' | 'no_mail_server' | 'disposable' }

function domainOf(email: string): string | null {
  const at = email.lastIndexOf('@')
  if (at <= 0 || at === email.length - 1) return null
  return email.slice(at + 1).trim().toLowerCase()
}

/**
 * Resolves MX for a domain, or falls back to A/AAAA.
 *
 * The fallback matters: RFC 5321 §5.1 says a host with an address record and no
 * MX is still a valid mail destination, and some small domains rely on that.
 * Treating them as undeliverable would reject real addresses.
 */
async function acceptsMail(domain: string): Promise<boolean> {
  const withTimeout = <T>(p: Promise<T>): Promise<T> =>
    Promise.race([
      p,
      new Promise<T>((_, reject) =>
        setTimeout(() => reject(new Error('DNS timeout')), LOOKUP_TIMEOUT_MS),
      ),
    ])

  try {
    const mx = await withTimeout(dns.resolveMx(domain))
    if (mx.length > 0 && mx.some((r) => r.exchange && r.exchange !== '.')) return true
  } catch {
    // Fall through to the address-record check below.
  }

  try {
    const addrs = await withTimeout(dns.resolve(domain))
    return addrs.length > 0
  } catch {
    return false
  }
}

/**
 * Checks an address before an account is created for it.
 *
 * Fails OPEN on anything other than a definitive "this domain accepts no mail".
 * A DNS outage or a slow resolver must not stop people signing up — refusing a
 * real customer is worse than admitting one bogus address, and the timeout above
 * bounds how long that decision takes.
 */
export async function checkEmailDeliverable(email: string): Promise<EmailVerdict> {
  const domain = domainOf(email)
  if (!domain || !domain.includes('.')) return { ok: false, reason: 'malformed' }

  if (DISPOSABLE.has(domain)) return { ok: false, reason: 'disposable' }

  const deliverable = await acceptsMail(domain)
  return deliverable ? { ok: true } : { ok: false, reason: 'no_mail_server' }
}

/** What the person typing it needs to hear, per verdict. */
export const EMAIL_VERDICT_MESSAGE: Record<Exclude<EmailVerdict, { ok: true }>['reason'], string> = {
  malformed: 'Enter a valid email address, for example name@example.com.',
  no_mail_server:
    'That email domain cannot receive mail. Check the spelling — for example gmail.com rather than gmial.com.',
  disposable: 'Please use a permanent email address rather than a temporary one.',
}
