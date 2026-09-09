import type { MessageClass } from '../comms.types'

/**
 * Email design system — ZS-COMMS-EMAIL-001 §08, deliverable 3 of §16.
 *
 * Hand-written table HTML rather than MJML. §16 asks for an "MJML/HTML
 * component library"; MJML would add a compiler to the runtime for markup this
 * small, and every rule below (640px, 44px targets, dark mode, contrast) is
 * expressible directly. If the estate grows past what this file can carry
 * legibly, revisit.
 *
 * Rules taken literally from §08:
 *   Canvas       single column, max 640px, 24px desktop / 16px mobile padding
 *   Typography   min 16px body, accessible line height, left-aligned
 *   CTA          one dominant action, min 44px touch height, descriptive label
 *   Images       never required to understand the message
 *   Contrast     WCAG 2.2 AA, dark-mode-safe
 *   Structure    hidden preheader, wordmark, context label, heading, body,
 *                context panel, CTA, help, legal footer
 *   Responsive   no horizontal scroll at 320px; long names and URLs wrap
 */

export interface LegalEntity {
  /** §08: sourced from the legal-entity registry, never hard-coded in a template. */
  entityName: string
  postalAddress: string
}

export interface FooterLinks {
  privacyUrl: string
  communityStandardsUrl: string
  helpCenterUrl: string
  communicationsHistoryUrl: string
  preferencesUrl: string
  /** Category-scoped one-click unsubscribe; absent for essential mail. */
  unsubscribeUrl?: string
}

export interface LayoutInput {
  subject: string
  preheader: string
  heading: string
  /** Paragraphs. Plain strings — no caller-supplied HTML, ever. */
  body: string[]
  cta?: { label: string; url: string }
  secondaryAction?: { label: string; url: string }
  /** §08 "context panel" — the facts behind the message, as label/value rows. */
  contextPanel?: { label: string; value: string }[]
  messageClass: MessageClass
  /** Human-readable category for the footer, e.g. "comments and replies". */
  categoryLabel?: string
  legal: LegalEntity
  links: FooterLinks
}

/** Escapes text for HTML. Every interpolated value passes through this. */
export function escapeHtml(value: string): string {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;')
}

/**
 * §03: "Zoiko Social will never ask you to send a password, sign-in code..."
 * Anti-phishing language is centrally controlled so it reads identically on
 * every security message — inconsistency is what phishing exploits.
 */
export const ANTI_PHISHING_NOTICE =
  'Zoiko Social will never ask you to send a password, sign-in code, recovery code, ' +
  'payment-card number, bank credential, or identity document by email.'

/** §08 footer variants. The class picks the variant; the template never does. */
function footerCopy(input: LayoutInput): { links: { label: string; url: string }[]; note: string } {
  const { links, messageClass, categoryLabel } = input
  const common = [
    { label: 'Privacy', url: links.privacyUrl },
    { label: 'Community Standards', url: links.communityStandardsUrl },
    { label: 'Help Center', url: links.helpCenterUrl },
  ]

  switch (messageClass) {
    case 'essential_account':
    case 'essential_security':
    case 'essential_transactional':
      return {
        links: [...common, { label: 'Verify this email in Communications History', url: links.communicationsHistoryUrl }],
        note:
          'This is an essential account, security, safety, billing, transaction, privacy, or legal ' +
          'communication. It cannot be disabled while necessary to provide, administer, or protect the ' +
          'relevant account, service, transaction, or legal obligation.',
      }
    case 'configurable_activity':
      return {
        links: [
          ...(links.unsubscribeUrl
            ? [{ label: `Unsubscribe from ${categoryLabel ?? 'these emails'}`, url: links.unsubscribeUrl }]
            : []),
          { label: 'Manage all email preferences', url: links.preferencesUrl },
          ...common,
        ],
        note: `You received this because ${categoryLabel ?? 'this category'} is enabled for your Zoiko Social account.`,
      }
    case 'marketing':
      return {
        links: [
          ...(links.unsubscribeUrl
            ? [{ label: `Unsubscribe from ${categoryLabel ?? 'these emails'}`, url: links.unsubscribeUrl }]
            : []),
          { label: 'Manage all subscriptions', url: links.preferencesUrl },
          { label: 'Privacy', url: links.privacyUrl },
          { label: 'Help Center', url: links.helpCenterUrl },
        ],
        note: 'Where required, this message is identified as promotional.',
      }
    case 'non_member':
      return {
        links: [
          ...(links.unsubscribeUrl ? [{ label: 'Do not invite me again', url: links.unsubscribeUrl }] : []),
          { label: 'Privacy', url: links.privacyUrl },
          { label: 'Help Center', url: links.helpCenterUrl },
        ],
        note:
          'You received one invitation initiated by a Zoiko Social member. Joining is optional. ' +
          'No reminder will be sent.',
      }
  }
}

/**
 * System font stack. Deliberately not a webfont: most clients block remote
 * fonts, and loading one would be an extra tracking vector on messages that
 * §09 requires to carry no open pixel.
 */
const FONT =
  "-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,'Helvetica Neue',Arial,sans-serif"

const COLORS = {
  bg: '#f4f6f8',
  bgDark: '#0f1419',
  surface: '#ffffff',
  surfaceDark: '#16202a',
  text: '#16202a',
  textDark: '#e7edf3',
  muted: '#55636e',
  mutedDark: '#9bacba',
  border: '#dbe2e8',
  borderDark: '#2a3947',
  // Contrast against white measured for WCAG 2.2 AA on 16px text.
  accent: '#00707d',
  accentText: '#ffffff',
}

export function renderHtml(input: LayoutInput): string {
  const footer = footerCopy(input)
  const e = escapeHtml

  const bodyHtml = input.body
    .map(
      (p) =>
        `<p style="margin:0 0 16px;font-size:16px;line-height:1.6;color:${COLORS.text};" class="zs-text">${e(p)}</p>`,
    )
    .join('')

  const contextHtml = input.contextPanel?.length
    ? `<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin:0 0 24px;border:1px solid ${COLORS.border};border-radius:8px;" class="zs-panel">
         ${input.contextPanel
           .map(
             (row) =>
               `<tr>
                  <td style="padding:10px 16px;font-size:14px;color:${COLORS.muted};" class="zs-muted">${e(row.label)}</td>
                  <td style="padding:10px 16px;font-size:14px;color:${COLORS.text};text-align:right;word-break:break-word;" class="zs-text">${e(row.value)}</td>
                </tr>`,
           )
           .join('')}
       </table>`
    : ''

  // 44px minimum touch height via padding + line-height (§08).
  const ctaHtml = input.cta
    ? `<table role="presentation" cellpadding="0" cellspacing="0" style="margin:0 0 16px;">
         <tr><td style="border-radius:8px;background:${COLORS.accent};">
           <a href="${e(input.cta.url)}" style="display:inline-block;padding:13px 28px;font-size:16px;line-height:18px;font-weight:600;color:${COLORS.accentText};text-decoration:none;border-radius:8px;">${e(input.cta.label)}</a>
         </td></tr>
       </table>`
    : ''

  const secondaryHtml = input.secondaryAction
    ? `<p style="margin:0 0 24px;font-size:15px;line-height:1.6;"><a href="${e(input.secondaryAction.url)}" style="color:${COLORS.accent};">${e(input.secondaryAction.label)}</a></p>`
    : ''

  // §08: the CTA must have a secure web fallback — the raw URL, so the message
  // still works when the button is stripped or images are blocked.
  const fallbackHtml = input.cta
    ? `<p style="margin:0 0 24px;font-size:13px;line-height:1.6;color:${COLORS.muted};word-break:break-all;" class="zs-muted">If the button does not work, copy this address into your browser:<br>${e(input.cta.url)}</p>`
    : ''

  const footerLinksHtml = footer.links
    .map((l) => `<a href="${e(l.url)}" style="color:${COLORS.muted};text-decoration:underline;" class="zs-muted">${e(l.label)}</a>`)
    .join(' &middot; ')

  return `<!doctype html>
<html lang="en" dir="ltr">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<meta name="color-scheme" content="light dark">
<meta name="supported-color-schemes" content="light dark">
<title>${e(input.subject)}</title>
<style>
  @media (max-width:600px){ .zs-pad{padding-left:16px!important;padding-right:16px!important;} }
  @media (prefers-color-scheme:dark){
    .zs-bg{background:${COLORS.bgDark}!important;}
    .zs-surface{background:${COLORS.surfaceDark}!important;}
    .zs-text{color:${COLORS.textDark}!important;}
    .zs-muted{color:${COLORS.mutedDark}!important;}
    .zs-panel{border-color:${COLORS.borderDark}!important;}
  }
</style>
</head>
<body style="margin:0;padding:0;background:${COLORS.bg};font-family:${FONT};" class="zs-bg">
<!-- Hidden preheader: the inbox preview line. Padded so the client does not
     pull body copy in after it. -->
<div style="display:none;max-height:0;overflow:hidden;opacity:0;">${e(input.preheader)}</div>
<div style="display:none;max-height:0;overflow:hidden;">&#8199;&#65279;&#847;&#8199;&#65279;&#847;&#8199;&#65279;&#847;&#8199;&#65279;&#847;</div>

<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:${COLORS.bg};" class="zs-bg">
<tr><td align="center" style="padding:24px 12px;">
  <table role="presentation" width="640" cellpadding="0" cellspacing="0" style="width:100%;max-width:640px;background:${COLORS.surface};border-radius:12px;font-family:${FONT};" class="zs-surface">
    <tr><td class="zs-pad" style="padding:32px 24px 0;">
      <p style="margin:0 0 4px;font-size:18px;font-weight:700;color:${COLORS.text};" class="zs-text">ZoikoSocial</p>
      <p style="margin:0 0 24px;font-size:12px;letter-spacing:.08em;text-transform:uppercase;color:${COLORS.muted};" class="zs-muted">${e(contextLabel(input.messageClass))}</p>
      <h1 style="margin:0 0 16px;font-size:24px;line-height:1.3;color:${COLORS.text};" class="zs-text">${e(input.heading)}</h1>
      ${bodyHtml}
      ${contextHtml}
      ${ctaHtml}
      ${secondaryHtml}
      ${fallbackHtml}
    </td></tr>
    <tr><td class="zs-pad" style="padding:0 24px 32px;">
      <hr style="border:none;border-top:1px solid ${COLORS.border};margin:0 0 16px;" class="zs-panel">
      <p style="margin:0 0 8px;font-size:12px;line-height:1.6;color:${COLORS.muted};" class="zs-muted">Zoiko Social &middot; ${e(input.legal.entityName)} &middot; ${e(input.legal.postalAddress)}</p>
      <p style="margin:0 0 8px;font-size:12px;line-height:1.6;" class="zs-muted">${footerLinksHtml}</p>
      <p style="margin:0;font-size:12px;line-height:1.6;color:${COLORS.muted};" class="zs-muted">${e(footer.note)}</p>
    </td></tr>
  </table>
</td></tr>
</table>
</body>
</html>`
}

/** §08 "context label" — the small caps line above the heading. */
function contextLabel(cls: MessageClass): string {
  switch (cls) {
    case 'essential_account':
      return 'Account'
    case 'essential_security':
      return 'Security'
    case 'essential_transactional':
      return 'Transaction'
    case 'configurable_activity':
      return 'Activity'
    case 'marketing':
      return 'Announcement'
    case 'non_member':
      return 'Invitation'
  }
}

/**
 * Plain-text part.
 *
 * §08 requires it to be *semantically equivalent* — "no HTML-only legal or
 * security information". So this is generated from the same input rather than
 * stripped from the HTML, which is how the two drift apart.
 */
export function renderText(input: LayoutInput): string {
  const footer = footerCopy(input)
  const lines: string[] = [
    'ZOIKO SOCIAL',
    contextLabel(input.messageClass).toUpperCase(),
    '',
    input.heading,
    '',
    ...input.body.flatMap((p) => [p, '']),
  ]

  if (input.contextPanel?.length) {
    for (const row of input.contextPanel) lines.push(`${row.label}: ${row.value}`)
    lines.push('')
  }
  if (input.cta) {
    lines.push(`${input.cta.label}:`, input.cta.url, '')
  }
  if (input.secondaryAction) {
    lines.push(`${input.secondaryAction.label}:`, input.secondaryAction.url, '')
  }

  lines.push(
    '—',
    `Zoiko Social · ${input.legal.entityName} · ${input.legal.postalAddress}`,
    ...footer.links.map((l) => `${l.label}: ${l.url}`),
    '',
    footer.note,
  )

  return lines.join('\n')
}
