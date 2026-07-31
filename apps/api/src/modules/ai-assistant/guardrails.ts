/**
 * Deterministic guardrails around the assistant, independent of the model's own
 * instruction-following. A system prompt is a request; these are the guarantee.
 *
 * Inbound: questions probing the platform's implementation, or trying to override
 * the assistant's instructions, are answered from here and never reach Groq.
 * Outbound: generated replies are screened for implementation details before they
 * are stored.
 *
 * Patterns are deliberately phrase-based with word boundaries rather than loose
 * substrings, because on an animal platform many tech words are legitimate
 * subjects: python and llama are animals, shell is a turtle's, node is a lymph
 * node, nest is a bird's, react is behaviour, training is obedience work, and
 * Ruby is somebody's dog. `guardrails.spec.ts` locks that behaviour down.
 */

export type OffLimitsReason = 'implementation' | 'instruction-override'

/** Implementation questions: stack, infrastructure, source, or the model itself. */
const IMPLEMENTATION_PATTERNS: RegExp[] = [
  // Named technologies — safe as bare words, none double as animal terms.
  /\b(nest\.?js|next\.?js|nodejs|node\.js|typescript|javascript|prisma|postgres(?:ql)?|supabase|mongodb|redis|upstash|docker|kubernetes|livekit|cloudflare|vercel|render\.com|turborepo|tailwind|fastify|socket\.io)\b/i,
  // AI providers and model families.
  /\b(groq|openai|chatgpt|gpt-?[0-9]|claude|gemini|mistral|deepseek|anthropic|hugging\s?face)\b/i,
  // Same care as the outbound rule: "my llama 5 years ago" is a member's animal,
  // not a model name. Require a dotted version or a size/variant marker.
  /\bllama[\s-]?\d+\.\d+/i,
  /\bllama[\s-]?\d+[\s-]?(b\b|billion|versatile|instant|instruct)/i,
  /\b(large\s+language\s+model|language\s+model|foundation\s+model|neural\s+network|machine\s+learning\s+model)\b/i,
  /\b(which|what|whose)\s+(ai\s+)?(model|llm|engine|provider|api)\b/i,
  /\b(are\s+you|you'?re)\s+(an?\s+)?(gpt|llm|bot|ai|chatbot|robot|program|script|language\s+model)\b/i,
  /\bwho\s+(made|built|created|trained|programmed)\s+you\b/i,
  /\bwhat\s+(are\s+you|ai)\s+(built|based|running|powered)\s+(on|with)\b/i,
  // Stack / architecture / hosting.
  /\b(tech|technology)\s+stack\b/i,
  /\b(back[\s-]?end|front[\s-]?end|full[\s-]?stack|code\s?base|source\s+code|repo(sitory)?|git\s?hub|monorepo)\b/i,
  /\b(database|schema|migration|query|sql|orm|endpoint|micro-?service)s?\b/i,
  /\b(rest|graphql|web)?\s?api\s+(key|token|secret|endpoint|docs?|documentation)\b/i,
  /\bapi\s?key\b/i,
  /\b(env|environment)\s+(var|variable|file)s?\b/i,
  // "server" only in an unambiguously technical form — a bare `\bserver\b` also
  // matches a food server or a server table, ordinary things to mention.
  /\bweb\s+servers?\b|\bserver[\s-]?(side|less)\b|\bservers?\s+(run|running|hosted)\b/i,
  /\b(hosting|infrastructure|deploy(ment|ed)?|ci\/cd|build\s+pipeline)\b/i,
  /\b(framework|library|package|dependency|npm|pnpm|yarn)\b/i,
  /\b(how|what)\s+(is|are|was|were)\s+(this|the|your)\s+(app|site|website|platform|feature|assistant|ai)\s+(built|made|coded|developed|programmed|implemented)\b/i,
  /\b(what|which)\s+(programming\s+)?language\s+(is|does|was)\b/i,
  /\bwrite\s+(me\s+)?(some\s+)?code\b/i,
  /\b(debug|refactor|compile)\s+(this|my|the)\b/i,
]

/** Attempts to override, extract, or roleplay around the assistant's instructions. */
const INSTRUCTION_OVERRIDE_PATTERNS: RegExp[] = [
  /\bignore\s+(all\s+|any\s+|your\s+|the\s+)?(previous|prior|above|earlier|initial|original)?\s*(instruction|rule|prompt|direction|guideline)s?\b/i,
  /\b(disregard|forget|override|bypass|ditch)\s+(all\s+|any\s+|your\s+|the\s+)?(previous\s+|prior\s+|above\s+)?(instruction|rule|prompt|restriction|guideline|guardrail|filter)s?\b/i,
  /\b(system|initial|original|hidden|secret)\s+prompt\b/i,
  /\b(reveal|show|print|repeat|output|tell\s+me|what\s+are)\s+(me\s+)?(your|the)\s+(instruction|rule|prompt|guideline|configuration|setup)s?\b/i,
  /\brepeat\s+(everything|the\s+text|all\s+text)\s+above\b/i,
  /\b(jailbreak|dan\s+mode|developer\s+mode|god\s+mode|unrestricted\s+mode|no\s+filter|without\s+(any\s+)?(filter|restriction|rule)s?)\b/i,
  /\bpretend\s+(you|to\s+be|that\s+you)\b/i,
  /\b(act|behave|respond)\s+as\s+(if\s+you|though\s+you|a\s+different|an?\s+unrestricted|dan\b)/i,
  /\byou\s+are\s+(now|no\s+longer)\s+\w+/i,
  /\b(new|updated)\s+(instruction|rule|persona|role)s?\s*:/i,
  /\bfrom\s+now\s+on,?\s+(you|answer|respond|ignore)\b/i,
  /\bi\s+am\s+(your|the|a)\s+(developer|admin|administrator|creator|engineer|owner)\b/i,
  /\b(this|it)\s+is\s+(just\s+)?(a\s+)?(test|hypothetical|roleplay|for\s+testing)\b.*\b(rule|restriction|instruction|answer\s+anyway)/i,
]

/** Terms an assistant reply must never contain, even if the model volunteers them. */
const OUTBOUND_LEAK_PATTERNS: RegExp[] = [
  /\b(nest\.?js|next\.?js|typescript|prisma|postgres(?:ql)?|supabase|redis|upstash|docker|kubernetes|fastify|socket\.io|turborepo|tailwind)\b/i,
  /\b(groq|openai|chatgpt|anthropic|claude|gemini|mistral)\b/i,
  // Model versions need a dotted version or a size/variant marker. A bare
  // "llama 5" is a member talking about their llama, not a model name.
  /\bllama[\s-]?\d+\.\d+/i,
  /\bllama[\s-]?\d+[\s-]?(b\b|billion|versatile|instant|instruct)/i,
  /\b(large\s+language\s+model|language\s+model|neural\s+network)\b/i,
  /\b(tech|technology)\s+stack\b/i,
  /\b(source\s+code|code\s?base|api\s?key|system\s+prompt)\b/i,
  // Both "I am a…" and "I'm a…" — the contraction is how a model usually says it.
  /\bi(?:\s+am|'?m)\s+(an?\s+)?(ai\s+)?(language\s+model|chatbot|bot|program|script)\b/i,
]

/**
 * Signals that a member may be describing a veterinary emergency.
 *
 * Used to pick a fallback that still says "contact an emergency vet" whenever the
 * real reply has to be discarded. Without this, a poisoning question that trips
 * any screen — or simply arrives when Groq is down — would get a bland "please
 * rephrase", which is actively unsafe. Deliberately over-inclusive: a needless
 * nudge towards a vet costs nothing, a missed emergency does not.
 */
const TOXIC_THINGS =
  'chocolate|lil(?:y|ies)|onions?|garlic|grapes?|raisins?|xylitol|antifreeze|rat\\s?bait|poison|pesticides?|insecticides?|medications?|pills?|tablets?|ibuprofen|paracetamol|acetaminophen|plants?|bones?|socks?|batter(?:y|ies)|string'
const INGESTED =
  "ate|eaten|eating|swallow(?:ed)?|ingest(?:ed)?|chew(?:ed)?|lick(?:ed)?|drank|drunk|got\\s+into|into\\s+some"

const HEALTH_URGENT_PATTERNS: RegExp[] = [
  /\b(poison|poisoned|poisonous|toxic|toxicity|overdose|venom)/i,
  new RegExp(`\\b(?:${INGESTED})\\b[\\s\\S]{0,40}\\b(?:${TOXIC_THINGS})\\b`, 'i'),
  /\b(bleeding|blood|seizure|seizing|convulsion|collapse[d]?|unconscious|unresponsive|limp)\b/i,
  // "breathe" and "breath" are both common here and easy to miss one of.
  /\b(can'?t|cannot|couldn'?t|not|stopped|won'?t)\s+(breathe?|breathing|walk(ing)?|stand(ing)?|eat(ing)?|drink(ing)?|urinate|pee|poop|move|get\s+up)\b/i,
  /\b(struggling|difficulty|trouble|labour(ed)?|labor(ed)?)\s+(to\s+|with\s+)?(breathe?|breathing|walk(ing)?|stand(ing)?|urinat(e|ing))\b/i,
  /\b(vomit|vomiting|vomited|throwing\s+up|threw\s+up|diarrhoea|diarrhea|bloat|bloated|distended)\b/i,
  /\b(hit\s+by|run\s+over|attacked|mauled|bitten|burn(ed|t)?|broken\s+(leg|bone|paw|tail|jaw))\b/i,
  /\b(emergency|urgent(ly)?|dying|choking|heat\s?stroke|hypothermia)\b/i,
]

export function looksHealthUrgent(text: string): boolean {
  const input = text ?? ''
  if (input.trim().length === 0) return false
  return HEALTH_URGENT_PATTERNS.some((p) => p.test(input))
}

/**
 * In-character deflections. Several variants so a member probing repeatedly does
 * not get an identical canned line each time; selection is deterministic so the
 * behaviour stays testable.
 */
const IMPLEMENTATION_DEFLECTIONS = [
  "That's not really my area — I'm here for everything pet and ZoikoSocial 🐾 Anything you're trying to find or do in the app, or any animal questions I can help with?",
  "I'll leave that one alone! What I'm good at is helping you get around ZoikoSocial and talking about animals — adoption, communities, vets, pet care. What do you need?",
  "Not something I get into, sorry! But ask me anything about your pets or how to use ZoikoSocial and I'm all yours 🐾",
]

const OVERRIDE_DEFLECTIONS = [
  "Nice try 🐾 I'm just ZoikoSocial AI, here to help with the app and with animals — what can I actually help you with?",
  "I'll stay as I am, thanks! Happy to help with anything about your pets or finding your way around ZoikoSocial though.",
  "That's not going to work on me, but I'd genuinely love to help — got a question about your animals or the app?",
]

export function detectOffLimits(text: string): OffLimitsReason | null {
  const input = text ?? ''
  if (input.trim().length === 0) return null

  if (INSTRUCTION_OVERRIDE_PATTERNS.some((p) => p.test(input))) return 'instruction-override'
  if (IMPLEMENTATION_PATTERNS.some((p) => p.test(input))) return 'implementation'
  return null
}

export function deflectionFor(reason: OffLimitsReason, text = ''): string {
  const pool = reason === 'instruction-override' ? OVERRIDE_DEFLECTIONS : IMPLEMENTATION_DEFLECTIONS
  return pool[text.length % pool.length] as string
}

/** True when a generated reply leaks implementation detail and must be replaced. */
export function containsTechLeak(reply: string): boolean {
  const input = reply ?? ''
  if (input.trim().length === 0) return false
  return OUTBOUND_LEAK_PATTERNS.some((p) => p.test(input))
}
