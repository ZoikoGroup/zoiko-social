import { ANTI_PHISHING_NOTICE, type LayoutInput } from '../render/layout'
import type { MessageClass } from '../comms.types'

/**
 * AUTH template family — ZS-COMMS-EMAIL-001 §12, IDs ZS-EM-AUTH-001..005.
 *
 * Copy is the canonical American-English baseline from §12, reproduced rather
 * than paraphrased: subject, preheader, heading, body and CTA labels are all
 * specified, and §12 warns that localized variants "must preserve legal
 * classification, uncertainty, safety meaning, CTA purpose, data minimization,
 * and orchestration behavior". Rewording it here would silently fork the
 * baseline.
 *
 * Templates supply content only. Sender, footer, legal entity, postal address,
 * unsubscribe and accessibility all come from the layout (§11 global rules), so
 * a template cannot accidentally omit a legal requirement.
 */

export interface TemplateContent {
  subject: string
  preheader: string
  heading: string
  body: string[]
  cta?: { label: string; url: string }
  secondaryAction?: { label: string; url: string }
  contextPanel?: { label: string; value: string }[]
  messageClass: MessageClass
  categoryLabel?: string
}

export interface AuthVars {
  displayName: string
  actionUrl: string
  /** AUTH-004 only. §12: never rendered into subject or preheader. */
  oneTimeCode?: string
  securityUrl?: string
  profileSetupUrl?: string
}

type TemplateFn = (v: AuthVars) => TemplateContent

/** ZS-EM-AUTH-001 · Verify Email Address — essential account, transactional. */
const verifyEmail: TemplateFn = (v) => ({
  messageClass: 'essential_account',
  subject: 'Verify your email for Zoiko Social',
  preheader: 'Confirm this address to activate and protect your account.',
  heading: 'Verify your email address',
  body: [
    `Hello ${v.displayName},`,
    'Verify this email address to activate your Zoiko Social account. This secure link expires in 24 hours and can be used once.',
    'If you did not create or update a Zoiko Social account, do not use the link.',
  ],
  cta: { label: 'Verify Email Address', url: v.actionUrl },
})

/** ZS-EM-AUTH-002 · Verification Link Expired. */
const verificationExpired: TemplateFn = (v) => ({
  messageClass: 'essential_account',
  subject: 'Your Zoiko Social verification link has expired',
  preheader: 'Request a new secure verification link.',
  heading: 'Request a new verification link',
  body: [
    `Hello ${v.displayName},`,
    'The verification link has expired or was already used. Request a new link to continue. If you did not request this action, no further action is required.',
  ],
  cta: { label: 'Send a New Verification Link', url: v.actionUrl },
})

/**
 * ZS-EM-AUTH-003 · Welcome.
 *
 * The only configurable one in this family — §12 gives it preference key
 * account.guidance and "cancel if onboarding completed before dispatch", which
 * the registry carries as a grace window.
 */
const welcome: TemplateFn = (v) => ({
  messageClass: 'configurable_activity',
  categoryLabel: 'account guidance',
  subject: 'Welcome to Zoiko Social',
  preheader: 'Build your profile and choose the communities that matter to you.',
  heading: 'Your Zoiko Social account is ready',
  body: [
    `Hello ${v.displayName},`,
    'Your account is ready. Create personal and animal profiles, follow people and organizations, join groups and events, and review your privacy and notification settings before sharing.',
  ],
  cta: { label: 'Set Up Your Profile', url: v.profileSetupUrl ?? v.actionUrl },
})

/**
 * ZS-EM-AUTH-004 · Sign-In Code.
 *
 * §12 implementation note: "Code never appears in subject or preheader".
 * Enforced by construction — the code is only ever placed in the context panel.
 */
const signInCode: TemplateFn = (v) => ({
  messageClass: 'essential_security',
  subject: 'Your Zoiko Social sign-in code',
  preheader: 'Use this one-time code to complete your sign-in.',
  heading: 'Complete your sign-in',
  body: [
    `Hello ${v.displayName},`,
    `Your one-time code is ${v.oneTimeCode ?? ''}. It expires in 10 minutes.`,
    ANTI_PHISHING_NOTICE,
    'If you did not attempt to sign in, review your account security.',
  ],
  contextPanel: v.oneTimeCode ? [{ label: 'One-time code', value: v.oneTimeCode }] : undefined,
  cta: { label: 'Review Account Security', url: v.securityUrl ?? v.actionUrl },
})

/** ZS-EM-AUTH-005 · Password Reset — essential security. */
const passwordReset: TemplateFn = (v) => ({
  messageClass: 'essential_security',
  subject: 'Reset your Zoiko Social password',
  preheader: 'Use this secure link within 30 minutes.',
  heading: 'Reset your password',
  body: [
    `Hello ${v.displayName},`,
    'We received a request to reset your password. The link expires in 30 minutes and can be used once. If you did not request it, do not use the link and review active sessions.',
    ANTI_PHISHING_NOTICE,
  ],
  cta: { label: 'Reset Password', url: v.actionUrl },
  secondaryAction: v.securityUrl ? { label: 'Secure My Account', url: v.securityUrl } : undefined,
})

export const AUTH_TEMPLATES: Readonly<Record<string, TemplateFn>> = {
  'ZS-EM-AUTH-001': verifyEmail,
  'ZS-EM-AUTH-002': verificationExpired,
  'ZS-EM-AUTH-003': welcome,
  'ZS-EM-AUTH-004': signInCode,
  'ZS-EM-AUTH-005': passwordReset,
}

/** Merges template content with the layout inputs the platform controls. */
export function toLayoutInput(
  content: TemplateContent,
  chrome: Pick<LayoutInput, 'legal' | 'links'>,
): LayoutInput {
  return {
    subject: content.subject,
    preheader: content.preheader,
    heading: content.heading,
    body: content.body,
    cta: content.cta,
    secondaryAction: content.secondaryAction,
    contextPanel: content.contextPanel,
    messageClass: content.messageClass,
    categoryLabel: content.categoryLabel,
    legal: chrome.legal,
    links: chrome.links,
  }
}
