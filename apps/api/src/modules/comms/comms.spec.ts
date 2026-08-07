import { renderHtml, renderText, escapeHtml } from './render/layout'
import { AUTH_TEMPLATES, toLayoutInput } from './templates/auth.templates'
import { EVENT_REGISTRY, IN_APP_ONLY_TYPES, lookupEvent, streamForEvent } from './comms.registry'
import { isEssential, streamForClass, bypassesQuietHours, MESSAGE_CLASSES } from './comms.types'

/**
 * Guards the rules ZS-COMMS-EMAIL-001 states as non-negotiable, so a later edit
 * to copy or layout cannot quietly drop a legal or safety requirement.
 */

const CHROME = {
  legal: { entityName: 'Zoiko Media Corp', postalAddress: '1401 21st Street, Suite R, Sacramento, CA 95811' },
  links: {
    privacyUrl: 'https://zoikosocial.com/privacy',
    communityStandardsUrl: 'https://zoikosocial.com/docs/safety-and-trust',
    helpCenterUrl: 'https://zoikosocial.com/docs',
    communicationsHistoryUrl: 'https://zoikosocial.com/settings/communications',
    preferencesUrl: 'https://zoikosocial.com/settings',
    unsubscribeUrl: 'https://zoikosocial.com/u/abc',
  },
}

const VARS = {
  displayName: 'Sam',
  actionUrl: 'https://zoikosocial.com/verify?token=t',
  securityUrl: 'https://zoikosocial.com/settings/security',
  oneTimeCode: '482913',
}

function render(id: string) {
  const content = AUTH_TEMPLATES[id]!(VARS)
  const input = toLayoutInput(content, CHROME)
  return { content, input, html: renderHtml(input), text: renderText(input) }
}

describe('classification (§03)', () => {
  it('treats the three essential classes as non-disableable', () => {
    expect(isEssential('essential_account')).toBe(true)
    expect(isEssential('essential_security')).toBe(true)
    expect(isEssential('essential_transactional')).toBe(true)
    expect(isEssential('configurable_activity')).toBe(false)
    expect(isEssential('marketing')).toBe(false)
  })

  it('exempts only security/safety/privacy/legal from quiet hours', () => {
    // A receipt is essential but does not need to arrive at 3am; a moderation
    // decision does.
    expect(bypassesQuietHours('essential_security')).toBe(true)
    expect(bypassesQuietHours('essential_transactional')).toBe(false)
    expect(bypassesQuietHours('configurable_activity')).toBe(false)
  })

  it('keeps marketing off the transactional stream (§05 reputation segmentation)', () => {
    expect(streamForClass('marketing')).toBe('marketing')
    expect(streamForClass('essential_security')).toBe('transactional')
    expect(streamForClass('configurable_activity')).toBe('notification')
  })

  it('routes every class somewhere', () => {
    for (const cls of MESSAGE_CLASSES) expect(streamForClass(cls)).toBeTruthy()
  })
})

describe('event registry (§07)', () => {
  it('never preference-gates essential mail', () => {
    // §03: essential "cannot be disabled while needed to operate or protect the
    // account". A preference key on an essential event would be a way to.
    for (const [type, def] of Object.entries(EVENT_REGISTRY)) {
      if (isEssential(def.messageClass)) {
        expect({ type, key: def.preferenceKey }).toEqual({ type, key: undefined })
      }
    }
  })

  it('gives every configurable event a preference key', () => {
    for (const [type, def] of Object.entries(EVENT_REGISTRY)) {
      if (def.messageClass === 'configurable_activity') {
        expect({ type, hasKey: Boolean(def.preferenceKey) }).toEqual({ type, hasKey: true })
      }
    }
  })

  it('never caps or delays essential security', () => {
    // A password reset held for a rate cap is a broken password reset.
    for (const [type, def] of Object.entries(EVENT_REGISTRY)) {
      if (def.messageClass === 'essential_security') {
        expect({ type, cap: def.dailyCap, grace: def.inProductGraceSeconds }).toEqual({
          type,
          cap: undefined,
          grace: undefined,
        })
      }
    }
  })

  it('caps the high-volume social events', () => {
    // Reactions are digest-or-off in §14 — a popular post must not become an
    // inbox outage.
    expect(EVENT_REGISTRY.new_like?.dailyCap).toBeLessThanOrEqual(1)
    expect(EVENT_REGISTRY.new_like?.collapseKey).toBeDefined()
    expect(EVENT_REGISTRY.new_comment?.collapseKey).toBeDefined()
  })

  it('derives the stream from the class rather than the template', () => {
    const def = lookupEvent('auth.password_reset')!
    expect(streamForEvent(def)).toBe('transactional')
    expect(streamForEvent(lookupEvent('new_like')!)).toBe('notification')
  })

  it('does not register an event that is also declared in-app only', () => {
    for (const type of IN_APP_ONLY_TYPES) {
      expect({ type, registered: type in EVENT_REGISTRY }).toEqual({ type, registered: false })
    }
  })
})

describe('layout (§08)', () => {
  it('escapes interpolated values', () => {
    expect(escapeHtml('<script>alert("x")</script>')).not.toContain('<script>')
  })

  it('cannot be injected through a display name', () => {
    const content = AUTH_TEMPLATES['ZS-EM-AUTH-001']!({
      ...VARS,
      displayName: '<img src=x onerror=alert(1)>',
    })
    const html = renderHtml(toLayoutInput(content, CHROME))
    expect(html).not.toContain('<img src=x')
    expect(html).toContain('&lt;img')
  })

  it('constrains the canvas to 640px', () => {
    expect(render('ZS-EM-AUTH-001').html).toContain('max-width:640px')
  })

  it('declares dark-mode support', () => {
    const { html } = render('ZS-EM-AUTH-001')
    expect(html).toContain('prefers-color-scheme:dark')
    expect(html).toContain('name="color-scheme"')
  })

  it('hides the preheader from the body but keeps it in the markup', () => {
    const { html, content } = render('ZS-EM-AUTH-001')
    expect(html).toContain(content.preheader)
    expect(html).toContain('display:none')
  })

  it('gives the CTA a copyable web fallback, so a stripped button still works', () => {
    const { html } = render('ZS-EM-AUTH-001')
    expect(html).toContain('If the button does not work')
    expect(html).toContain(VARS.actionUrl)
  })

  it('renders the legal entity and postal address from the registry, not the template', () => {
    const { html, text } = render('ZS-EM-AUTH-001')
    for (const out of [html, text]) {
      expect(out).toContain('Zoiko Media Corp')
      expect(out).toContain('1401 21st Street')
    }
  })
})

describe('footer variants (§08)', () => {
  it('tells essential recipients the mail cannot be disabled, and offers no unsubscribe', () => {
    const { html } = render('ZS-EM-AUTH-005')
    expect(html).toContain('cannot be disabled')
    expect(html).toContain('Verify this email in Communications History')
    expect(html).not.toContain('Unsubscribe from')
  })

  it('gives configurable mail an unsubscribe and says why it was received', () => {
    const { html } = render('ZS-EM-AUTH-003')
    expect(html).toContain('Unsubscribe from account guidance')
    expect(html).toContain('You received this because')
  })
})

describe('plain text (§08)', () => {
  it('is generated from the same source, not stripped from the HTML', () => {
    const { text, content } = render('ZS-EM-AUTH-005')
    expect(text).toContain(content.heading)
    for (const p of content.body) expect(text).toContain(p)
    expect(text).not.toContain('<')
  })

  it('carries the security notice, which must not be HTML-only', () => {
    // §08: "no HTML-only legal or security information".
    const { text } = render('ZS-EM-AUTH-005')
    expect(text).toContain('will never ask you to send a password')
  })

  it('includes every link as a resolvable URL', () => {
    const { text } = render('ZS-EM-AUTH-001')
    expect(text).toContain(VARS.actionUrl)
    expect(text).toContain(CHROME.links.privacyUrl)
  })
})

describe('AUTH copy (§12)', () => {
  it('matches the canonical subjects', () => {
    expect(AUTH_TEMPLATES['ZS-EM-AUTH-001']!(VARS).subject).toBe('Verify your email for Zoiko Social')
    expect(AUTH_TEMPLATES['ZS-EM-AUTH-005']!(VARS).subject).toBe('Reset your Zoiko Social password')
    expect(AUTH_TEMPLATES['ZS-EM-AUTH-004']!(VARS).subject).toBe('Your Zoiko Social sign-in code')
  })

  it('keeps the one-time code out of the subject and preheader', () => {
    // §12 implementation note, and the reason is real: previews render on lock
    // screens, so a code in the subject defeats the second factor.
    const c = AUTH_TEMPLATES['ZS-EM-AUTH-004']!(VARS)
    expect(c.subject).not.toContain(VARS.oneTimeCode)
    expect(c.preheader).not.toContain(VARS.oneTimeCode)
    expect(renderHtml(toLayoutInput(c, CHROME))).toContain(VARS.oneTimeCode)
  })

  it('carries the anti-phishing notice on security messages', () => {
    for (const id of ['ZS-EM-AUTH-004', 'ZS-EM-AUTH-005']) {
      expect(render(id).html).toContain('will never ask you to send a password')
    }
  })

  it('classifies each AUTH template as the spec does', () => {
    expect(AUTH_TEMPLATES['ZS-EM-AUTH-001']!(VARS).messageClass).toBe('essential_account')
    expect(AUTH_TEMPLATES['ZS-EM-AUTH-004']!(VARS).messageClass).toBe('essential_security')
    expect(AUTH_TEMPLATES['ZS-EM-AUTH-005']!(VARS).messageClass).toBe('essential_security')
    // Welcome is the one configurable member of the family.
    expect(AUTH_TEMPLATES['ZS-EM-AUTH-003']!(VARS).messageClass).toBe('configurable_activity')
  })

  it('never puts commercial content in a security message (§03)', () => {
    const { html } = render('ZS-EM-AUTH-005')
    for (const word of ['Upgrade', 'Premium', 'offer', 'Discover more']) {
      expect(html).not.toContain(word)
    }
  })
})
