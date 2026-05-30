interface SkeletonProps {
  className?: string;
}

export function Skeleton({ className = "" }: SkeletonProps) {
  return (
    <div
      className={`animate-pulse rounded-2xl bg-warm-200 dark:bg-warm-700 ${className}`}
    />
  );
}

/** 骨架屏卡片 — 统一加载占位 */
export function SkeletonCard({ rows = 3 }: { rows?: number }) {
  return (
    <div className="glass rounded-[20px] p-4 sm:p-5 space-y-3">
      <Skeleton className="h-4 w-28" />
      {Array.from({ length: rows }).map((_, i) => (
        <Skeleton key={i} className="h-10 w-full" />
      ))}
    </div>
  );
}

/** 空白状态卡片 — 替代 return null */
export function EmptyState({
  icon,
  title,
  description,
  action,
}: {
  icon: React.ReactNode;
  title: string;
  description?: string;
  action?: React.ReactNode;
}) {
  return (
    <div className="glass rounded-[20px] p-6 sm:p-8 text-center space-y-3">
      <div className="flex justify-center">{icon}</div>
      <p className="text-sm text-warm-500 dark:text-warm-400 font-medium">{title}</p>
      {description && (
        <p className="text-xs text-warm-400">{description}</p>
      )}
      {action && <div className="pt-2">{action}</div>}
    </div>
  );
}
