/**
 * Cleans up a model reply before it is stored as a message.
 *
 * Two problems this solves, both observed live with real models:
 *
 * 1. Leaked tool-call syntax. Llama-family models sometimes narrate a tool call as
 *    text (`<function=list_pets></function>`, `<|python_tag|>…`) instead of using
 *    the API's tool_calls field — usually when they begin answering and change
 *    their mind mid-sentence. That markup is meaningless to a member and must
 *    never appear in their inbox.
 *
 * 2. Markdown in a plain-text surface. The chat renders text verbatim, so `**bold**`
 *    shows up as literal asterisks. The prompt asks for plain prose; this enforces
 *    it rather than trusting the model to comply every time.
 */

/**
 * Text-form tool-call syntax emitted by various models.
 *
 * The first pattern is deliberately loose about the opening tag: the form seen in
 * practice is `<function(update_pet){"pet_id":"x"}</function>`, where the opening
 * tag is never closed with `>`. Anything anchored on a well-formed `<function …>`
 * misses it, so this matches from `<function` up to the first closing tag.
 */
const TOOL_SYNTAX_PATTERNS: RegExp[] = [
  /<function[\s\S]*?<\/function\s*>/gi,
  /<function[=(\s][^\n]*?\/?>/gi,
  /<\|python_tag\|>[\s\S]*?(?=$|\n)/gi,
  /<\|?(?:eom|eot)_id\|?>/gi,
  /<tool_call>[\s\S]*?<\/tool_call\s*>/gi,
]

export function stripToolSyntax(text: string): string {
  let out = text
  for (const pattern of TOOL_SYNTAX_PATTERNS) out = out.replace(pattern, ' ')
  return out
}

export function stripMarkdown(text: string): string {
  return (
    text
      // **bold** / __bold__ → plain
      .replace(/\*\*([^*]+)\*\*/g, '$1')
      .replace(/__([^_]+)__/g, '$1')
      // Leading heading hashes on their own line
      .replace(/^#{1,6}\s+/gm, '')
      // Markdown bullets → a simple dash, so intentional lists still read fine
      .replace(/^\s*[*+]\s+/gm, '- ')
  )
}

/** Collapses the whitespace left behind once markup is removed. */
function tidyWhitespace(text: string): string {
  return text
    .replace(/[ \t]{2,}/g, ' ')
    .replace(/ +([.,!?;:])/g, '$1')
    .replace(/\n{3,}/g, '\n\n')
    .split('\n')
    .map((line) => line.trimEnd())
    .join('\n')
    .trim()
}

/**
 * Full clean-up applied to every generated reply. Returns an empty string if
 * nothing survives — the caller treats that as "no usable reply" and falls back,
 * which is correct: a message that was only tool syntax has no content to send.
 */
export function cleanReply(text: string | null | undefined): string {
  if (!text) return ''
  return tidyWhitespace(stripMarkdown(stripToolSyntax(text)))
}
