export function SkeletonBlock({ className = '' }: { className?: string }) {
  return <div className={`skeleton ${className}`} />
}

export function PostCardSkeleton() {
  return (
    <div className="bg-surface border-b border-border/60 p-4">
      {/* Header */}
      <div className="flex items-center gap-2.5 mb-3">
        <SkeletonBlock className="w-9 h-9 rounded-full flex-shrink-0" />
        <div className="flex-1 space-y-1.5">
          <SkeletonBlock className="h-3 w-28 rounded" />
          <SkeletonBlock className="h-2.5 w-20 rounded" />
        </div>
      </div>
      {/* Image placeholder */}
      <SkeletonBlock className="w-full aspect-[3/2] rounded-lg mb-3" />
      {/* Caption */}
      <SkeletonBlock className="h-3 w-full rounded mb-1.5" />
      <SkeletonBlock className="h-3 w-2/3 rounded mb-4" />
      {/* Actions */}
      <div className="flex gap-5 pt-2 border-t border-border/60">
        <SkeletonBlock className="h-4 w-10 rounded" />
        <SkeletonBlock className="h-4 w-10 rounded" />
        <SkeletonBlock className="h-4 w-8 rounded" />
      </div>
    </div>
  )
}

export function StoryRowSkeleton() {
  return (
    <div className="flex gap-3 px-4 py-3">
      {Array.from({ length: 6 }).map((_, i) => (
        <div key={i} className="flex flex-col items-center gap-1.5 flex-shrink-0">
          <SkeletonBlock className="w-14 h-14 rounded-full" />
          <SkeletonBlock className="h-2 w-10 rounded" />
        </div>
      ))}
    </div>
  )
}
