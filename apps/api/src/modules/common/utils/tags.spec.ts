import { normalizeTag, normalizeTags, MAX_TAGS, MAX_TAG_LENGTH } from './tags'

/**
 * The whole value of tags is that two people typing the same word land on the
 * same page. Every case below is a way that could silently fail to happen.
 */
describe('normalizeTag', () => {
  it('folds case so #Beagle and beagle are the same tag', () => {
    expect(normalizeTag('#Beagle')).toBe('beagle')
    expect(normalizeTag('BEAGLE')).toBe('beagle')
  })

  it('strips leading hashes, however many', () => {
    expect(normalizeTag('##beagle')).toBe('beagle')
  })

  it('trims surrounding whitespace', () => {
    expect(normalizeTag('  beagle  ')).toBe('beagle')
  })

  it('drops characters that would create lookalike tags', () => {
    // 'dog-walk' and 'dog walk' and 'dogwalk' must not be three separate tags.
    expect(normalizeTag('dog-walk')).toBe('dogwalk')
    expect(normalizeTag('dog walk')).toBe('dogwalk')
    expect(normalizeTag('dog.walk!')).toBe('dogwalk')
  })

  it('keeps digits and underscores', () => {
    expect(normalizeTag('golden_retriever2')).toBe('golden_retriever2')
  })

  it('returns null when nothing usable survives', () => {
    // Storing '' would create a tag that exists but can never be found.
    expect(normalizeTag('###')).toBeNull()
    expect(normalizeTag('   ')).toBeNull()
    expect(normalizeTag('!!!')).toBeNull()
  })

  it('truncates rather than rejecting an over-long tag', () => {
    const long = 'a'.repeat(MAX_TAG_LENGTH + 20)
    expect(normalizeTag(long)).toHaveLength(MAX_TAG_LENGTH)
  })
})

describe('normalizeTags', () => {
  it('de-duplicates after normalising, not before', () => {
    // These are four spellings of one tag; storing all four would split the page.
    expect(normalizeTags(['#Beagle', 'beagle', 'BEAGLE ', 'bea-gle'])).toEqual(['beagle'])
  })

  it('preserves the order they were typed in', () => {
    // The first tags someone writes are the ones they think most descriptive.
    expect(normalizeTags(['rescue', 'beagle', 'puppy'])).toEqual(['rescue', 'beagle', 'puppy'])
  })

  it('caps the count so one listing cannot tag itself into every page', () => {
    const many = Array.from({ length: MAX_TAGS + 15 }, (_, i) => `tag${i}`)
    expect(normalizeTags(many)).toHaveLength(MAX_TAGS)
  })

  it('drops unusable entries without losing the good ones', () => {
    expect(normalizeTags(['###', 'beagle', '   ', 'rescue'])).toEqual(['beagle', 'rescue'])
  })

  it('handles undefined and empty input', () => {
    expect(normalizeTags(undefined)).toEqual([])
    expect(normalizeTags(null)).toEqual([])
    expect(normalizeTags([])).toEqual([])
  })

  it('counts the cap after de-duplication, not before', () => {
    // Otherwise ten spellings of one tag would fill the whole allowance.
    const dupes = Array.from({ length: MAX_TAGS + 5 }, () => 'beagle')
    expect(normalizeTags([...dupes, 'rescue'])).toEqual(['beagle', 'rescue'])
  })
})
