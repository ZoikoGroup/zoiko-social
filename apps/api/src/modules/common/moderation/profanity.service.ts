import { BadRequestException, Injectable, Logger } from '@nestjs/common'
import { RegExpMatcher, englishDataset, englishRecommendedTransformers } from 'obscenity'
import { AuditLogService } from '../audit-log/audit-log.service'

/**
 * Common words/species/breed names that are substrings of blacklisted terms
 * (the "Scunthorpe problem") and would otherwise false-positive on this
 * platform's content. Extend this list as real false positives are found —
 * a wordlist filter can never be exhaustively tuned up front.
 */
const WHITELISTED_TERMS = [
  // pet species/breeds containing blacklisted substrings
  'cockatiel',
  'cockatoo',
  'cocker spaniel',
  'sussex', // chicken/spaniel breed — contains "sex"
  'titmouse', // bird
  'great tit', // bird species
  // common English words containing blacklisted substrings
  'document',
  'documentation',
  'class',
  'classic',
  'classroom',
  'glass',
  'grass',
  'brass',
  'assistant',
  'assassin',
  'embarrass',
  'harass',
  'harassment',
  'analysis',
  'bass', // fish
  'scunthorpe',
]

@Injectable()
export class ProfanityService {
  private readonly logger = new Logger(ProfanityService.name)
  private readonly matcher = new RegExpMatcher({
    ...englishDataset.build(),
    ...englishRecommendedTransformers,
    whitelistedTerms: WHITELISTED_TERMS,
  })

  constructor(private readonly auditLog: AuditLogService) {}

  check(text: string): { blocked: boolean; matchCount: number } {
    if (!text) return { blocked: false, matchCount: 0 }
    const matches = this.matcher.getAllMatches(text)
    return { blocked: matches.length > 0, matchCount: matches.length }
  }

  /**
   * Throws BadRequestException if `text` contains blocked content. Call this
   * synchronously, before storage, on every user-generated text write path.
   */
  assertClean(text: string, context: { actorId?: string; entityType: string }): void {
    const { blocked, matchCount } = this.check(text)
    if (!blocked) return

    this.logger.warn(`Blocked content on write to ${context.entityType} (${matchCount} match(es))`)
    void this.auditLog.record({
      actorId: context.actorId ?? null,
      action: 'content.blocked',
      entityType: context.entityType,
      newData: { matchCount },
    })

    throw new BadRequestException({
      code: 'CONTENT_POLICY_VIOLATION',
      message: 'This content violates our profanity policy and cannot be posted.',
    })
  }
}
