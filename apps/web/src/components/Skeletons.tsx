'use client'

/**
 * Skeleton placeholders — content-shaped loading states shown instead of
 * spinners, so pages feel instant and never flash placeholder identities.
 */

export function SkeletonRow(): React.JSX.Element {
  return (
    <div className="flex items-center gap-3 px-2 py-2">
      <div className="w-10 h-10 rounded-full bg-surface-container animate-pulse flex-shrink-0" />
      <div className="flex-1 space-y-1.5">
        <div className="h-3.5 w-28 bg-surface-container rounded animate-pulse" />
        <div className="h-3 w-20 bg-surface-container rounded animate-pulse" />
      </div>
      <div className="h-8 w-20 bg-surface-container rounded-lg animate-pulse flex-shrink-0" />
    </div>
  )
}

export function SkeletonRowList({ count = 4 }: { count?: number }): React.JSX.Element {
  return (
    <div className="space-y-1">
      {Array.from({ length: count }, (_, i) => <SkeletonRow key={i} />)}
    </div>
  )
}

export function SkeletonPeopleCard(): React.JSX.Element {
  return (
    <div className="bg-surface-container-lowest rounded-xl border border-outline-variant/30 shadow-sm overflow-hidden flex flex-col">
      <div className="h-14 bg-surface-container animate-pulse" />
      <div className="px-4 pb-4 -mt-6 flex flex-col flex-1">
        <div className="w-14 h-14 rounded-full bg-surface-container animate-pulse ring-2 ring-surface-container-lowest mb-2" />
        <div className="h-3.5 w-24 bg-surface-container rounded animate-pulse" />
        <div className="h-3 w-16 bg-surface-container rounded animate-pulse mt-1.5" />
        <div className="h-3 w-32 bg-surface-container rounded animate-pulse mt-2.5" />
        <div className="flex gap-2 mt-auto pt-4">
          <div className="flex-1 h-8 bg-surface-container rounded-lg animate-pulse" />
          <div className="w-16 h-8 bg-surface-container rounded-lg animate-pulse" />
        </div>
      </div>
    </div>
  )
}

export function SkeletonPeopleGrid({ count = 4 }: { count?: number }): React.JSX.Element {
  return (
    <div className="grid grid-cols-2 gap-4">
      {Array.from({ length: count }, (_, i) => <SkeletonPeopleCard key={i} />)}
    </div>
  )
}

export function SkeletonNotification(): React.JSX.Element {
  return (
    <div className="flex items-start gap-3 p-3.5">
      <div className="w-10 h-10 rounded-full bg-surface-container animate-pulse flex-shrink-0" />
      <div className="flex-1 space-y-2 pt-0.5">
        <div className="h-3.5 w-40 bg-surface-container rounded animate-pulse" />
        <div className="h-3 w-56 bg-surface-container rounded animate-pulse" />
        <div className="h-2.5 w-14 bg-surface-container rounded animate-pulse" />
      </div>
    </div>
  )
}

const SKELETON_BUBBLE_WIDTHS = ['w-44', 'w-52', 'w-36', 'w-56', 'w-40', 'w-48', 'w-32', 'w-60'] as const

export function SkeletonMessageBubble({ align = 'left', index = 0 }: { align?: 'left' | 'right'; index?: number }): React.JSX.Element {
  const numLines = index % 3 === 1 ? 3 : 2
  const mainWidth = SKELETON_BUBBLE_WIDTHS[index % SKELETON_BUBBLE_WIDTHS.length]
  const secondWidth = SKELETON_BUBBLE_WIDTHS[(index + 2) % SKELETON_BUBBLE_WIDTHS.length]
  const thirdWidth = SKELETON_BUBBLE_WIDTHS[(index + 5) % SKELETON_BUBBLE_WIDTHS.length]

  if (align === 'right') {
    return (
      <div className="flex justify-end gap-2 py-0.5">
        <div className="max-w-[72%] flex flex-col items-end gap-1">
          {/* Bubble with multiple skeleton lines */}
          <div className={`bg-surface-container rounded-2xl rounded-br-sm px-4 py-3 space-y-2`}>
            <div className={`h-3 bg-surface-container-high rounded animate-pulse ${mainWidth}`} />
            <div className={`h-3 bg-surface-container-high rounded animate-pulse ${secondWidth}`} />
            {numLines === 3 && (
              <div className={`h-3 bg-surface-container-high rounded animate-pulse ${thirdWidth}`} />
            )}
          </div>
          {/* Timestamp skeleton */}
          <div className="h-2.5 w-12 bg-surface-container rounded animate-pulse" />
        </div>
      </div>
    )
  }

  return (
    <div className="flex justify-start gap-2 py-0.5">
      {/* Avatar skeleton */}
      <div className="w-8 h-8 rounded-full bg-surface-container animate-pulse flex-shrink-0" />
      <div className="max-w-[72%] flex flex-col items-start gap-1">
        <div className="bg-surface-container rounded-2xl rounded-bl-sm px-4 py-3 space-y-2">
          <div className={`h-3 bg-surface-container-high rounded animate-pulse ${mainWidth}`} />
          <div className={`h-3 bg-surface-container-high rounded animate-pulse ${secondWidth}`} />
          {numLines === 3 && (
            <div className={`h-3 bg-surface-container-high rounded animate-pulse ${thirdWidth}`} />
          )}
        </div>
        <div className="h-2.5 w-12 bg-surface-container rounded animate-pulse" />
      </div>
    </div>
  )
}

export function SkeletonMessageList(): React.JSX.Element {
  return (
    <div className="space-y-0.5 pt-4">
      {/* Group header skeleton */}
      <div className="flex justify-center py-3">
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded-full bg-surface-container animate-pulse" />
          <div className="h-3 w-24 bg-surface-container rounded animate-pulse" />
        </div>
      </div>
      {/* Date separator skeleton */}
      <div className="flex justify-center py-3">
        <div className="h-5 w-28 bg-surface-container rounded-full animate-pulse" />
      </div>
      {/* Alternating messages */}
      <SkeletonMessageBubble align="left" index={0} />
      <SkeletonMessageBubble align="left" index={1} />
      <SkeletonMessageBubble align="right" index={2} />
      <SkeletonMessageBubble align="left" index={3} />
      <SkeletonMessageBubble align="right" index={4} />
      <SkeletonMessageBubble align="right" index={5} />
      <SkeletonMessageBubble align="left" index={6} />
      <SkeletonMessageBubble align="left" index={7} />
      <SkeletonMessageBubble align="right" index={8} />
      <SkeletonMessageBubble align="left" index={9} />
    </div>
  )
}

export function SkeletonWidget(): React.JSX.Element {
  return (
    <div className="space-y-4">
      {Array.from({ length: 3 }, (_, i) => (
        <div key={i} className="flex items-start gap-3">
          <div className="w-10 h-10 rounded-full bg-surface-container animate-pulse flex-shrink-0" />
          <div className="flex-1 space-y-1.5 pt-0.5">
            <div className="h-3.5 w-24 bg-surface-container rounded animate-pulse" />
            <div className="h-3 w-16 bg-surface-container rounded animate-pulse" />
            <div className="h-6 w-16 bg-surface-container rounded-full animate-pulse mt-1" />
          </div>
        </div>
      ))}
    </div>
  )
}
