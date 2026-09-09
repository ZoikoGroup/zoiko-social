import { z } from 'zod'
import { httpUrl } from './http-url'
import { CreateEventSchema } from '../../events/events.schemas'

/**
 * Why this schema exists.
 *
 * `z.string().url()` accepts anything the URL constructor accepts, and the URL
 * constructor is content with `javascript:alert(1)`. Fields validated that way
 * were being rendered straight into an href — an event's booking link, a news
 * article's source, a provider's website — so anyone able to create an event
 * could run script in the session of everyone who clicked through from it.
 *
 * These cases are the attack, written down.
 */

const DANGEROUS = [
  'javascript:alert(1)',
  // Case is not a defence: the scheme is read from the parsed URL, not matched.
  'JavaScript:alert(1)',
  'JAVASCRIPT:alert(1)',
  'data:text/html,<script>alert(1)</script>',
  'vbscript:msgbox(1)',
  'file:///etc/passwd',
]

const ORDINARY = [
  'https://example.com/tickets',
  'http://example.com/tickets',
  'https://sub.example.co.uk/a/b?c=d#e',
]

describe('httpUrl', () => {
  it.each(DANGEROUS)('refuses %s', (value) => {
    expect(httpUrl().safeParse(value).success).toBe(false)
  })

  it.each(ORDINARY)('accepts %s', (value) => {
    expect(httpUrl().safeParse(value).success).toBe(true)
  })

  it('still refuses something that is not a URL at all', () => {
    expect(httpUrl().safeParse('not a url').success).toBe(false)
  })

  it('keeps the length limit it is given', () => {
    const long = 'https://example.com/' + 'a'.repeat(700)
    expect(httpUrl(600).safeParse(long).success).toBe(false)
  })

  // The plain validator is what made this necessary; if it ever starts rejecting
  // these on its own, this schema can go.
  it('documents that the plain validator does not do this', () => {
    expect(z.string().url().safeParse('javascript:alert(1)').success).toBe(true)
  })
})

describe('the schemas that render links', () => {
  const event = {
    title: 'Adoption day',
    startsAt: new Date(Date.now() + 86_400_000).toISOString(),
    isOnline: true,
  }

  it('refuses a booking link that would execute script', () => {
    const parsed = CreateEventSchema.safeParse({ ...event, bookingUrl: 'javascript:alert(1)' })
    expect(parsed.success).toBe(false)
  })

  it('accepts an ordinary booking link', () => {
    const parsed = CreateEventSchema.safeParse({ ...event, bookingUrl: 'https://example.com/book' })
    expect(parsed.success).toBe(true)
  })
})
