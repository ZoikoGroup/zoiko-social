/**
 * Marks a region as other people's words, so the browser may translate it.
 *
 * The document shell carries translate="no" (see app/layout.tsx): our own chrome
 * ships in six locales with a picker, so machine-translating it duplicates a
 * feature we already provide — and doing so restructures the DOM under React,
 * which crashes it with NotFoundError from insertBefore.
 *
 * User-generated text is the opposite case. Our catalog will never contain a
 * stranger's post, bio, comment or message, and a reader may genuinely need one
 * translated, so those regions opt back in. Wrapping is safe for React here
 * because the translator rewrites the contents of this element rather than
 * replacing a sibling React is tracking.
 */
/**
 * `as` defaults to a div, which is wrong inside a paragraph or alongside inline
 * text — a div inside a <p> is invalid HTML, and React reports it as a hydration
 * error rather than quietly rendering it. Inline callers must pass `as="span"`.
 */
export function UserContent({
  children,
  as: Tag = 'div',
  className = '',
}: {
  children: React.ReactNode
  as?: 'div' | 'span' | 'p'
  className?: string
}): React.JSX.Element {
  return (
    <Tag translate="yes" className={className}>
      {children}
    </Tag>
  )
}
