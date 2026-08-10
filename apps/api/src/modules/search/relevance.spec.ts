import { rankByRelevance } from './relevance'

describe('rankByRelevance', () => {
  it('ranks an exact match above a prefix match above a substring match', () => {
    const items = [
      { id: 'contains', name: 'the great dane club' },
      { id: 'exact', name: 'dane' },
      { id: 'prefix', name: 'dane rescue' },
    ]

    const ranked = rankByRelevance('dane', items, (i) => [i.name])

    expect(ranked.map((i) => i.id)).toEqual(['exact', 'prefix', 'contains'])
  })

  it('is case-insensitive', () => {
    const items = [{ id: 'a', name: 'DANE' }]
    const ranked = rankByRelevance('dane', items, (i) => [i.name])
    expect(ranked.map((i) => i.id)).toEqual(['a'])
  })

  it('scores the best match across multiple fields', () => {
    const items = [
      // username is only a substring match, but displayName is an exact match
      { id: 'a', username: 'the_dane_lover', displayName: 'dane' },
      { id: 'b', username: 'dane', displayName: 'Some Person' },
    ]

    const ranked = rankByRelevance('dane', items, (i) => [i.username, i.displayName])

    // both hit score 3 (exact match on one field) — original order preserved as tiebreaker
    expect(ranked.map((i) => i.id)).toEqual(['a', 'b'])
  })

  it('preserves original order for items with equal relevance (stable secondary sort)', () => {
    const items = [
      { id: 'first', name: 'dane rescue north' },
      { id: 'second', name: 'dane rescue south' },
    ]
    const ranked = rankByRelevance('dane', items, (i) => [i.name])
    expect(ranked.map((i) => i.id)).toEqual(['first', 'second'])
  })

  it('ignores null/undefined fields without throwing', () => {
    const items = [{ id: 'a', name: null as string | null, alt: 'dane' }]
    const ranked = rankByRelevance('dane', items, (i) => [i.name, i.alt])
    expect(ranked.map((i) => i.id)).toEqual(['a'])
  })

  it('returns items unchanged for an empty query', () => {
    const items = [{ id: 'a', name: 'z' }, { id: 'b', name: 'a' }]
    const ranked = rankByRelevance('', items, (i) => [i.name])
    expect(ranked.map((i) => i.id)).toEqual(['a', 'b'])
  })
})
