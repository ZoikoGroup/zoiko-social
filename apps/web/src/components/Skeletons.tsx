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
