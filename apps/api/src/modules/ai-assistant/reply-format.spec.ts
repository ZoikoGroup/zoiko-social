import { cleanReply, stripToolSyntax, stripMarkdown } from './reply-format'

describe('stripToolSyntax', () => {
  // All observed live: the model narrates a tool call as text instead of using
  // the tool_calls API field. None of this may reach a member's inbox.
  const leaks = [
    'You can share records. <function=list_pets></function>',
    'Let me check. <function(update_pet){"pet_id":"unknown","age_years":8}</function>',
    'Sure <function=update_pet {"pet_id":"x"}>',
    'Checking<|python_tag|>list_pets()',
    'One moment <tool_call>{"name":"list_pets"}</tool_call> done',
  ]

  it.each(leaks)('removes tool syntax from %p', (text) => {
    const out = stripToolSyntax(text)
    expect(out).not.toMatch(/<function|python_tag|tool_call/i)
  })

  it('keeps the prose around the markup', () => {
    expect(cleanReply('You can share records. <function=list_pets></function>')).toBe(
      'You can share records.',
    )
  })

  it('leaves ordinary text with angle brackets alone', () => {
    const text = 'Keep her weight under 5 kg (ideally < 4.5) and she will be fine.'
    expect(stripToolSyntax(text)).toBe(text)
  })
})

describe('stripMarkdown', () => {
  it('unwraps bold, which would otherwise render as literal asterisks', () => {
    expect(stripMarkdown('Open **Health Passport** then tap __Share__.')).toBe(
      'Open Health Passport then tap Share.',
    )
  })

  it('removes heading hashes', () => {
    expect(stripMarkdown('### Steps\nDo the thing')).toBe('Steps\nDo the thing')
  })

  it('normalises bullets to dashes', () => {
    expect(stripMarkdown('* first\n* second')).toBe('- first\n- second')
  })

  it('does not mangle arithmetic or ordinary asterisks in prose', () => {
    expect(stripMarkdown('Feed 2 * 50g meals')).toBe('Feed 2 * 50g meals')
  })
})

describe('cleanReply', () => {
  it('returns an empty string when the reply was nothing but tool syntax', () => {
    // The caller treats this as "no usable reply" and falls back, which is right —
    // there is no content to send.
    expect(cleanReply('<function=list_pets></function>')).toBe('')
  })

  it('handles null and undefined', () => {
    expect(cleanReply(null)).toBe('')
    expect(cleanReply(undefined)).toBe('')
  })

  it('tidies the whitespace left where markup was', () => {
    expect(cleanReply('Done <function=x></function> — she is 8 now.')).toBe('Done — she is 8 now.')
  })

  it('does not strip a stray space before punctuation into a broken sentence', () => {
    expect(cleanReply('She is fine <function=y></function>.')).toBe('She is fine.')
  })

  it('collapses excess blank lines but keeps paragraph breaks', () => {
    expect(cleanReply('First line.\n\n\n\nSecond line.')).toBe('First line.\n\nSecond line.')
  })

  it('leaves a normal reply untouched', () => {
    const normal = "Eight is where I'd switch to a senior formula — higher protein, easier on the kidneys."
    expect(cleanReply(normal)).toBe(normal)
  })

  it('preserves emoji', () => {
    expect(cleanReply('Done 🐾')).toBe('Done 🐾')
  })
})
