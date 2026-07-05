/**
 * Extracts #hashtags and @mentions from a post/comment caption.
 * Rules match the platform username/hashtag constraints.
 */

const HASHTAG_RE = /#([\p{L}\p{N}_]{1,50})/gu
const MENTION_RE = /@([a-z0-9._]{3,30})/g

export function parseHashtags(caption: string, max = 30): string[] {
  const tags = new Set<string>()
  for (const match of caption.matchAll(HASHTAG_RE)) {
    tags.add(match[1]!.toLowerCase())
    if (tags.size >= max) break
  }
  return Array.from(tags)
}

export function parseMentions(caption: string, max = 20): string[] {
  const usernames = new Set<string>()
  for (const match of caption.toLowerCase().matchAll(MENTION_RE)) {
    usernames.add(match[1]!)
    if (usernames.size >= max) break
  }
  return Array.from(usernames)
}
