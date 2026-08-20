/**
 * Recognising the ZoikoSocial AI assistant on the client.
 *
 * As far as messaging is concerned the assistant is an ordinary profile: it has a
 * row, a username, a verified tick and a DM thread like any other account. That is
 * what makes the inbox work without special cases — and also why the client needs
 * a way to tell it apart when a feature genuinely does not apply to it.
 *
 * The handle is the only signal the client is given, so it has to stay in step with
 * AI_USERNAME in `apps/api/src/modules/ai-assistant/ai-assistant.service.ts`, which
 * is what provisions the profile. If that ever changes, this changes with it.
 */
export const AI_ASSISTANT_USERNAME = 'zoikosocial.ai'

export function isAiAssistant(username: string | null | undefined): boolean {
  return username === AI_ASSISTANT_USERNAME
}
