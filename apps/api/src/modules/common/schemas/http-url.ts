import { z } from 'zod'

/**
 * A URL safe to store and later render as a link or an image.
 *
 * `z.string().url()` is not that. It accepts anything the URL constructor
 * accepts, and the URL constructor is happy with `javascript:alert(1)`,
 * `data:text/html,<script>…</script>` and `vbscript:`. Those were reaching fields
 * the apps render straight into an href — an event's booking link, a news
 * article's source, a provider's website — so anyone who could create an event
 * could run script in the session of everyone who clicked through from it.
 *
 * Only http and https, and the scheme is read from the parsed URL rather than
 * matched by pattern, so `JavaScript:` and other casings cannot slip past.
 *
 * Not for configuration read from the environment: DATABASE_URL is a
 * `postgresql://` URL and correctly stays on the plain validator.
 */
export function httpUrl(max = 600) {
  return z
    .string()
    .url()
    .max(max)
    .refine(
      (value) => {
        try {
          const { protocol } = new URL(value)
          return protocol === 'http:' || protocol === 'https:'
        } catch {
          return false
        }
      },
      { message: 'Must be an http or https URL' },
    )
}
