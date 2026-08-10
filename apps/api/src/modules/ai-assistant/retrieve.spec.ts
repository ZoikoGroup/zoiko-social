import { retrieveKnowledge, formatKnowledgeContext } from './retrieve'
import { KNOWLEDGE_BASE } from './knowledge-base'

describe('retrieveKnowledge', () => {
  it('returns the matching topic for a direct feature question', () => {
    const [top] = retrieveKnowledge('how do I add a health passport for my dog?')
    expect(top?.topic).toBe('Health Passport and sharing records')
  })

  it('returns at most the requested number of entries', () => {
    // A question touching several topics at once still stays inside the limit.
    const results = retrieveKnowledge('how do I report a lost pet, adopt, and message a vet?', 3)
    expect(results.length).toBeLessThanOrEqual(3)
  })

  it('returns nothing for a question with no platform overlap', () => {
    expect(retrieveKnowledge('what is the capital of France')).toEqual([])
  })

  it('returns nothing for empty input', () => {
    expect(retrieveKnowledge('')).toEqual([])
    expect(retrieveKnowledge('   ')).toEqual([])
  })

  it('prefers a specific multi-word match over a generic single word', () => {
    // "pet" alone appears in several entries; "lost pet" should decide the winner.
    const [top] = retrieveKnowledge('I lost my pet, what do I do')
    expect(top?.topic).toBe('Lost and Found pets')
  })

  it('is case-insensitive', () => {
    const [top] = retrieveKnowledge('HOW DO COMMUNITIES WORK')
    expect(top?.topic).toBe('Communities')
  })

  it.each([
    ['how do I block someone who is harassing me', 'Safety, reporting and moderation'],
    ['can I book a groomer', 'Pet care providers, vets and bookings'],
    ['how do I sell a product', 'Shop and marketplace'],
    ['what are message requests', 'Messaging'],
    ['how do I get verified as a vet', 'Professional verification'],
    ['how do I start a video call', 'Audio and video calls'],
  ])('routes %p to %p', (question, expected) => {
    const topics = retrieveKnowledge(question).map((e) => e.topic)
    expect(topics).toContain(expected)
  })
})

describe('formatKnowledgeContext', () => {
  it('returns an empty string when there is nothing to include', () => {
    expect(formatKnowledgeContext([])).toBe('')
  })

  it('includes each entry topic, content and docs path', () => {
    const entries = retrieveKnowledge('how do I adopt a dog')
    const context = formatKnowledgeContext(entries)
    for (const entry of entries) {
      expect(context).toContain(entry.topic)
      expect(context).toContain(entry.content)
      expect(context).toContain(entry.docsPath)
    }
  })
})

describe('KNOWLEDGE_BASE integrity', () => {
  it('has unique topics', () => {
    const topics = KNOWLEDGE_BASE.map((e) => e.topic)
    expect(new Set(topics).size).toBe(topics.length)
  })

  it('gives every entry keywords, content and a docs path', () => {
    for (const entry of KNOWLEDGE_BASE) {
      expect(entry.keywords.length).toBeGreaterThan(0)
      expect(entry.content.length).toBeGreaterThan(50)
      expect(entry.docsPath).toMatch(/^\/docs/)
    }
  })

  it('keeps keywords lowercase so matching against a lowercased question works', () => {
    for (const entry of KNOWLEDGE_BASE) {
      for (const keyword of entry.keywords) {
        expect(keyword).toBe(keyword.toLowerCase())
      }
    }
  })
})
