import { appUrl } from './app-links'

/**
 * Destinations for the Support & Developers pages, keyed by the label a card
 * or link shows. These pages point at one another constantly ("Contact Us",
 * "System Status", …), so the mapping lives in one place.
 */
export const SUPPORT_HREF: Readonly<Record<string, string>> = {
  'Help Center': '/support-developers-help-center',
  'Search Help Center': '/support-developers-help-center',
  'Visit the Help Center': '/support-developers-help-center',
  'Contact Us': '/support-developers-contact-us',
  'Contact support': '/support-developers-contact-us',
  'Specialist teams': '/support-developers-contact-us#specialist-teams',
  'System Status': '/support-developers-system-status',
  'Check status': '/support-developers-system-status',
  'Check System Status': '/support-developers-system-status',
  'Report a concern': '/safety-report-concern',
  "You're in the right place": '/support-developers-community-forums#recent-discussions',
  // Help articles live in the app's documentation.
  'Reset your password': appUrl('/docs/notifications-and-settings'),
  'Fix photo uploads that fail': appUrl('/docs/feed-and-content'),
  'Manage notifications': appUrl('/docs/notifications-and-settings'),
  'Accessibility Support': '/support-developers-accessibility-support',
  'Get accessibility help': '/support-developers-accessibility-support',
  'API Documentation': '/support-developers-api-documentation',
  'Open docs': '/support-developers-api-documentation',
  'Developer Support': '/support-developers-developer-support',
  'Community Forums': '/support-developers-community-forums',
  'Visit the forums': '/support-developers-community-forums',
}

/** Help Center topics and article categories → the app's documentation. */
export const HELP_TOPIC_HREF: Readonly<Record<string, string>> = {
  'Getting started': appUrl('/docs/getting-started'),
  'Account and sign-in': appUrl('/docs/notifications-and-settings'),
  'Privacy and safety': appUrl('/docs/safety-and-trust'),
  Communities: appUrl('/docs/community-and-events'),
  'Posts and media': appUrl('/docs/feed-and-content'),
  'Adoption and Market': appUrl('/docs/marketplace-and-services'),
}
